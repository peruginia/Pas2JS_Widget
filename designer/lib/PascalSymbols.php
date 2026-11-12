<?php
declare(strict_types=1);

/**
 * Lightweight, regex-based Pascal interface scanner used by the source
 * completion. It reads the public part of a unit (or a program before its main
 * begin) and extracts units, classes/records with their visible members, types,
 * globals, constants and routines. It is deliberately not a compiler: it only
 * needs to be good enough to offer identifiers in the editor.
 */
final class PascalSymbols
{
    private const MAX_SYMBOLS = 5000;
    private const MAX_CLASSES = 500;
    private const MAX_MEMBERS = 200;

    /**
     * @return array{
     *   unit: string,
     *   file: string,
     *   uses: list<string>,
     *   classes: list<array{name:string,unit:string,kind:string,parent:string,members:list<array{name:string,kind:string,detail:string,visibility:string}>}>,
     *   symbols: list<array{name:string,kind:string,unit:string,detail:string}>
     * }
     */
    public static function parse(string $source, string $file = '', string $fallbackUnit = ''): array
    {
        $source = str_replace(["\r\n", "\r"], "\n", $source);
        $source = (string) preg_replace('/^\xEF\xBB\xBF/', '', $source);

        $unit = '';
        if (preg_match('/^\s*(?:unit|program|library)\s+([A-Za-z_][A-Za-z0-9_.]*)\s*;/im', $source, $match)) {
            $unit = $match[1];
        }
        if ($unit === '') {
            $unit = $fallbackUnit !== ''
                ? $fallbackUnit
                : (string) pathinfo($file, PATHINFO_FILENAME);
        }

        $uses = self::parseUses($source);
        $scan = self::scanText($source);
        $scan = (string) preg_replace('/^\s*uses\b.*?;/ims', '', $scan);
        $lines = explode("\n", $scan);

        $classes = [];
        $symbols = [];
        $section = '';

        for ($i = 0, $count = count($lines); $i < $count; $i++) {
            if (count($symbols) >= self::MAX_SYMBOLS || count($classes) >= self::MAX_CLASSES) {
                break;
            }
            $line = trim($lines[$i]);
            if ($line === '') {
                continue;
            }

            if (preg_match('/^(var|threadvar|const|resourcestring|type)\b(.*)$/i', $line, $match)) {
                $section = strtolower($match[1]);
                $line = trim($match[2]);
                if ($line === '') {
                    continue;
                }
            } elseif (preg_match('/^(procedure|function)\b/i', $line)) {
                $routine = self::routineSymbol($line, $unit);
                if ($routine['name'] !== '') {
                    $symbols[] = $routine;
                }
                $section = '';
                if (!self::hasTopLevelSemicolon($line)) {
                    while (++$i < $count && !self::hasTopLevelSemicolon($lines[$i])) {
                        // A multi-line routine declaration: skip its parameters.
                    }
                }
                continue;
            }

            if ($section === 'type') {
                $i = self::parseTypeDeclaration($lines, $i, $line, $unit, $classes, $symbols);
                continue;
            }
            if ($section === 'var' || $section === 'threadvar') {
                if (preg_match('/^([A-Za-z_][A-Za-z0-9_]*(?:\s*,\s*[A-Za-z_][A-Za-z0-9_]*)*)\s*:\s*([^;]+);/', $line, $match)) {
                    foreach (self::splitNames($match[1]) as $name) {
                        $symbols[] = [
                            'name' => $name,
                            'kind' => 'var',
                            'unit' => $unit,
                            'detail' => trim($match[2]),
                        ];
                    }
                }
                continue;
            }
            if ($section === 'const' || $section === 'resourcestring') {
                if (preg_match('/^([A-Za-z_][A-Za-z0-9_]*)\s*(?::\s*([^=]+))?\s*=/', $line, $match)) {
                    $symbols[] = [
                        'name' => $match[1],
                        'kind' => 'const',
                        'unit' => $unit,
                        'detail' => trim((string) ($match[2] ?? '')),
                    ];
                }
                if (!self::hasTopLevelSemicolon($line)) {
                    while (++$i < $count && !self::hasTopLevelSemicolon($lines[$i])) {
                        // A multi-line constant value: skip it.
                    }
                }
            }
        }

        return [
            'unit' => $unit,
            'file' => $file,
            'uses' => $uses,
            'classes' => $classes,
            'symbols' => $symbols,
        ];
    }

    /** Keep the interface (or a program before its main begin) and strip comments. */
    private static function scanText(string $source): string
    {
        $isProgram = (bool) preg_match('/^\s*program\b/im', $source);
        if ($isProgram) {
            $begin = preg_match('/^begin\b/im', $source, $match, PREG_OFFSET_CAPTURE);
            $text = $begin ? substr($source, 0, (int) $match[0][1]) : $source;
        } else {
            $interface = preg_match('/^\s*interface\b/im', $source, $match, PREG_OFFSET_CAPTURE);
            $start = $interface ? (int) $match[0][1] + strlen($match[0][0]) : 0;
            $implementation = preg_match('/^\s*implementation\b/im', $source, $match, PREG_OFFSET_CAPTURE);
            $end = $implementation ? (int) $match[0][1] : strlen($source);
            $text = substr($source, $start, max(0, $end - $start));
        }
        return (string) preg_replace(
            ['/\{[^}]*\}/s', '/\(\*.*?\*\)/s', '/\/\/[^\n]*/'],
            '',
            $text,
        );
    }

    /** @return list<string> */
    private static function parseUses(string $source): array
    {
        $clean = (string) preg_replace(
            ['/\{[^}]*\}/s', '/\(\*.*?\*\)/s', '/\/\/[^\n]*/'],
            '',
            $source,
        );
        $uses = [];
        if (preg_match_all('/^\s*uses\b(.*?);/ims', $clean, $matches)) {
            foreach ($matches[1] as $list) {
                foreach (preg_split('/[,\s]+/', $list) ?: [] as $unit) {
                    $unit = trim($unit);
                    if (preg_match('/^[A-Za-z_][A-Za-z0-9_.]*$/', $unit)) {
                        $uses[] = $unit;
                    }
                }
            }
        }
        return array_values(array_unique($uses));
    }

    /**
     * @param list<string> $lines
     * @param list<array{name:string,unit:string,kind:string,parent:string,members:list<array{name:string,kind:string,detail:string,visibility:string}>}> $classes
     * @param list<array{name:string,kind:string,unit:string,detail:string}> $symbols
     */
    private static function parseTypeDeclaration(
        array $lines,
        int $index,
        string $line,
        string $unit,
        array &$classes,
        array &$symbols,
    ): int {
        if (preg_match('/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(?:packed\s+)?(class|record|object|interface)\b(.*)$/i', $line, $match)) {
            $name = $match[1];
            $kind = strtolower($match[2]);
            $rest = trim($match[3]);
            $parent = '';
            if (preg_match('/^\(\s*([A-Za-z_][A-Za-z0-9_.]*)/', $rest, $parentMatch)) {
                $parent = $parentMatch[1];
            }
            if (preg_match('/^of\b/i', $rest)) {
                $symbols[] = ['name' => $name, 'kind' => 'type', 'unit' => $unit, 'detail' => 'class of'];
                return $index;
            }
            if (str_ends_with($rest, ';')) {
                $symbols[] = [
                    'name' => $name,
                    'kind' => $kind === 'record' ? 'record' : 'class',
                    'unit' => $unit,
                    'detail' => $parent !== '' ? 'class(' . $parent . ')' : $kind,
                ];
                return $index;
            }
            [$members, $end] = self::parseClassBody($lines, $index + 1);
            if (count($classes) < self::MAX_CLASSES) {
                $classes[] = [
                    'name' => $name,
                    'unit' => $unit,
                    'kind' => $kind,
                    'parent' => $parent,
                    'members' => $members,
                ];
            }
            $symbols[] = [
                'name' => $name,
                'kind' => $kind === 'record' ? 'record' : 'class',
                'unit' => $unit,
                'detail' => $parent !== '' ? 'class(' . $parent . ')' : $kind,
            ];
            return $end;
        }

        if (preg_match('/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/s', $line, $match)) {
            $symbols[] = [
                'name' => $match[1],
                'kind' => 'type',
                'unit' => $unit,
                'detail' => trim($match[2]),
            ];
            if (!self::hasTopLevelSemicolon($line)) {
                $count = count($lines);
                while (++$index < $count && !self::hasTopLevelSemicolon($lines[$index])) {
                    // A multi-line type declaration: skip it.
                }
            }
        }
        return $index;
    }

    /**
     * @param list<string> $lines
     * @return array{0:list<array{name:string,kind:string,detail:string,visibility:string}>,1:int}
     */
    private static function parseClassBody(array $lines, int $start): array
    {
        $members = [];
        $visibility = 'published';
        for ($i = $start, $count = count($lines); $i < $count; $i++) {
            $line = trim($lines[$i]);
            if ($line === '') {
                continue;
            }
            if (preg_match('/^(strict\s+)?(private|protected|public|published)\b/i', $line, $match)) {
                $visibility = strtolower(($match[1] ?? '') . $match[2]);
                continue;
            }
            if (preg_match('/^end\s*;?$/i', $line)) {
                return [$members, $i];
            }
            if (count($members) >= self::MAX_MEMBERS) {
                continue;
            }
            $visible = !in_array($visibility, ['private', 'strict private', 'protected', 'strict protected'], true);

            if (preg_match('/^(?:class\s+)?(procedure|function|constructor|destructor)\s+([A-Za-z_][A-Za-z0-9_]*)(.*)$/i', $line, $match)) {
                if ($visible) {
                    $members[] = [
                        'name' => $match[2],
                        'kind' => strtolower($match[1]),
                        'detail' => trim($match[3]),
                        'visibility' => $visibility,
                    ];
                }
                if (!self::hasTopLevelSemicolon($line)) {
                    while (++$i < $count && !self::hasTopLevelSemicolon($lines[$i])) {
                        // A multi-line method declaration: skip its parameters.
                    }
                }
                continue;
            }
            if (preg_match('/^(?:class\s+)?property\s+([A-Za-z_][A-Za-z0-9_]*)(.*)$/i', $line, $match)) {
                if ($visible) {
                    $members[] = [
                        'name' => $match[1],
                        'kind' => 'property',
                        'detail' => trim($match[2]),
                        'visibility' => $visibility,
                    ];
                }
                if (!self::hasTopLevelSemicolon($line)) {
                    while (++$i < $count && !self::hasTopLevelSemicolon($lines[$i])) {
                        // A multi-line property declaration: skip its specifiers.
                    }
                }
                continue;
            }
            $fieldLine = (string) preg_replace('/^(?:class\s+)?var\s+/i', '', $line);
            if (preg_match('/^([A-Za-z_][A-Za-z0-9_]*(?:\s*,\s*[A-Za-z_][A-Za-z0-9_]*)*)\s*:\s*([^;]+);/', $fieldLine, $match)) {
                if ($visible) {
                    foreach (self::splitNames($match[1]) as $name) {
                        $members[] = [
                            'name' => $name,
                            'kind' => 'field',
                            'detail' => trim($match[2]),
                            'visibility' => $visibility,
                        ];
                    }
                }
            }
        }
        return [$members, count($lines) - 1];
    }

    /** @return array{name:string,kind:string,unit:string,detail:string} */
    private static function routineSymbol(string $line, string $unit): array
    {
        if (preg_match('/^(procedure|function)\s+([A-Za-z_][A-Za-z0-9_]*)(.*)$/i', $line, $match)) {
            return [
                'name' => $match[2],
                'kind' => strtolower($match[1]),
                'unit' => $unit,
                'detail' => trim($match[3]),
            ];
        }
        return ['name' => '', 'kind' => 'procedure', 'unit' => $unit, 'detail' => ''];
    }

    /** @return list<string> */
    private static function splitNames(string $value): array
    {
        $names = [];
        foreach (explode(',', $value) as $name) {
            $name = trim($name);
            if (preg_match('/^[A-Za-z_][A-Za-z0-9_]*$/', $name)) {
                $names[] = $name;
            }
        }
        return $names;
    }

    /** True when the line ends a declaration with a semicolon outside parentheses. */
    private static function hasTopLevelSemicolon(string $line): bool
    {
        $depth = 0;
        $inString = false;
        $length = strlen($line);
        for ($i = 0; $i < $length; $i++) {
            $char = $line[$i];
            if ($inString) {
                if ($char === "'") {
                    if ($i + 1 < $length && $line[$i + 1] === "'") {
                        $i++;
                    } else {
                        $inString = false;
                    }
                }
                continue;
            }
            if ($char === "'") {
                $inString = true;
                continue;
            }
            if ($char === '(' || $char === '[') {
                $depth++;
                continue;
            }
            if ($char === ')' || $char === ']') {
                $depth = max(0, $depth - 1);
                continue;
            }
            if ($char === ';' && $depth === 0) {
                return true;
            }
        }
        return false;
    }
}
