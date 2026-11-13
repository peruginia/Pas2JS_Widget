<?php
declare(strict_types=1);

/**
 * Conservative .pas updater used by the designer save action.
 *
 * It adds missing units to the interface uses clause, adds missing fields to
 * the form class and can rename component identifiers in code and
 * declarations. It never removes other code or rewrites the implementation
 * beyond the requested component renames.
 */

function pasIdentifier(string $value, bool $allowDots = false): ?string
{
    $pattern = $allowDots
        ? '/^[A-Za-z_][A-Za-z0-9_.]*$/'
        : '/^[A-Za-z_][A-Za-z0-9_]*$/';
    return preg_match($pattern, $value) ? $value : null;
}

function pasLineEnding(string $pas, int $offset): string
{
    return substr($pas, $offset, 2) === "\r\n" ? "\r\n" : "\n";
}

function pasAddUses(string $pas, array $units, array &$warnings): string
{
    if (count($units) === 0) {
        return $pas;
    }

    $pattern = '/(\binterface\b[\s\S]*?\buses\b)([\s\S]*?);/i';
    if (preg_match($pattern, $pas, $match, PREG_OFFSET_CAPTURE)) {
        $usesText = $match[2][0];
        $missing = [];
        foreach (array_keys($units) as $unit) {
            if (!preg_match('/\b' . preg_quote($unit, '/') . '\b/i', $usesText)) {
                $missing[] = $unit;
            }
        }
        if (count($missing) === 0) {
            return $pas;
        }
        $replacement = rtrim($usesText) . ', ' . implode(', ', $missing);
        return substr_replace($pas, $replacement, $match[2][1], strlen($usesText));
    }

    // No interface uses clause: insert one after the interface keyword.
    if (preg_match('/\binterface\b/i', $pas, $match, PREG_OFFSET_CAPTURE)) {
        $newline = pasLineEnding($pas, $match[0][1]);
        $insert = $newline . $newline . 'uses' . $newline . '  '
            . implode(', ', array_keys($units)) . ';';
        $offset = $match[0][1] + strlen($match[0][0]);
        return substr_replace($pas, $insert, $offset, 0);
    }

    $warnings[] = 'Interface section not found; uses units were not added.';
    return $pas;
}

function pasAddFields(string $pas, string $formClass, array $fields, array &$warnings): string
{
    if (count($fields) === 0) {
        return $pas;
    }

    $headerPattern = '/^([ \t]*)' . preg_quote($formClass, '/')
        . '\s*=\s*class\b[^\r\n]*$/mi';
    if (!preg_match($headerPattern, $pas, $header, PREG_OFFSET_CAPTURE)) {
        $warnings[] = "Form class $formClass not found; fields were not added.";
        return $pas;
    }

    $indent = $header[1][0];
    $headerStart = $header[0][1];
    $headerEnd = $headerStart + strlen($header[0][0]);
    $lineEnd = strpos($pas, "\n", $headerEnd);
    if ($lineEnd === false) {
        $lineEnd = strlen($pas);
        $newline = "\n";
    } else {
        $newline = pasLineEnding($pas, $headerEnd);
    }

    $endPattern = '/^' . preg_quote($indent, '/') . 'end;\s*$/m';
    if (!preg_match($endPattern, $pas, $end, PREG_OFFSET_CAPTURE, $headerEnd)) {
        $warnings[] = "End of class $formClass not found; fields were not added.";
        return $pas;
    }

    $body = substr($pas, $headerEnd, $end[0][1] - $headerEnd);
    preg_match_all('/\b([A-Za-z_][A-Za-z0-9_]*)\s*:/', $body, $existingMatches);
    $existing = array_fill_keys($existingMatches[1] ?? [], true);

    $insert = '';
    foreach ($fields as $name => $className) {
        if (!isset($existing[$name])) {
            $insert .= $indent . '  ' . $name . ': ' . $className . ';' . $newline;
        }
    }
    if ($insert === '') {
        return $pas;
    }

    $insertAt = $lineEnd;
    if ($insertAt < strlen($pas) && $pas[$insertAt] === "\r") {
        $insertAt++;
    }
    if ($insertAt < strlen($pas) && $pas[$insertAt] === "\n") {
        $insertAt++;
    }
    return substr_replace($pas, $insert, $insertAt, 0);
}

/**
 * Rename Pascal identifiers outside strings and comments. Used when a
 * component is renamed in the designer so its field and code references stay
 * in sync.
 *
 * @param list<array{old:string,new:string}> $renames
 */
function pasRenameIdentifiers(string $pas, array $renames, array &$warnings): string
{
    $count = 0;
    foreach ($renames as $rename) {
        if (++$count > 200) {
            $warnings[] = 'Too many component renames; the remaining ones were skipped.';
            break;
        }
        if (!is_array($rename)) {
            continue;
        }
        $old = pasIdentifier((string) ($rename['old'] ?? ''));
        $new = pasIdentifier((string) ($rename['new'] ?? ''));
        if ($old === null || $new === null) {
            $warnings[] = 'Invalid component rename skipped.';
            continue;
        }
        if ($old === $new) {
            continue;
        }
        $pas = pasRenameIdentifier($pas, $old, $new);
    }
    return $pas;
}

function pasRenameIdentifier(string $pas, string $old, string $new): string
{
    $length = strlen($pas);
    $result = '';
    $index = 0;
    while ($index < $length) {
        $char = $pas[$index];

        if ($char === "'") {
            $result .= $char;
            $index++;
            while ($index < $length) {
                $next = $pas[$index];
                $result .= $next;
                $index++;
                if ($next === "'") {
                    if ($index < $length && $pas[$index] === "'") {
                        $result .= $pas[$index];
                        $index++;
                        continue;
                    }
                    break;
                }
            }
            continue;
        }

        if ($char === '{') {
            $end = strpos($pas, '}', $index);
            if ($end === false) {
                $result .= substr($pas, $index);
                break;
            }
            $result .= substr($pas, $index, $end - $index + 1);
            $index = $end + 1;
            continue;
        }

        if ($char === '(' && ($pas[$index + 1] ?? '') === '*') {
            $end = strpos($pas, '*)', $index + 2);
            if ($end === false) {
                $result .= substr($pas, $index);
                break;
            }
            $result .= substr($pas, $index, $end - $index + 2);
            $index = $end + 2;
            continue;
        }

        if ($char === '/' && ($pas[$index + 1] ?? '') === '/') {
            $end = strpos($pas, "\n", $index);
            if ($end === false) {
                $result .= substr($pas, $index);
                break;
            }
            $result .= substr($pas, $index, $end - $index + 1);
            $index = $end + 1;
            continue;
        }

        if (preg_match('/[A-Za-z_]/', $char)) {
            $start = $index;
            $index++;
            while ($index < $length && preg_match('/[A-Za-z0-9_]/', $pas[$index])) {
                $index++;
            }
            $word = substr($pas, $start, $index - $start);
            $result .= strcasecmp($word, $old) === 0 ? $new : $word;
            continue;
        }

        $result .= $char;
        $index++;
    }
    return $result;
}

/**
 * @return array{pas: string, warnings: list<string>}
 */
function syncPasUnit(string $pas, string $formClass, array $components, array $renames = []): array
{
    $warnings = [];
    $fields = [];
    $units = [];

    $formClass = pasIdentifier($formClass) ?? '';
    if ($formClass === '') {
        return ['pas' => $pas, 'warnings' => ['Invalid form class name.']];
    }

    foreach ($components as $component) {
        if (!is_array($component)) {
            continue;
        }
        $name = pasIdentifier((string) ($component['name'] ?? ''));
        $className = pasIdentifier((string) ($component['className'] ?? ''));
        $unit = pasIdentifier((string) ($component['unit'] ?? ''), true);
        if ($name === null || $className === null) {
            $warnings[] = 'Skipped a component with an invalid name or class.';
            continue;
        }
        $fields[$name] = $className;
        if ($unit !== null && $unit !== '') {
            $units[$unit] = true;
        }
    }

    if (count($renames) > 0) {
        $pas = pasRenameIdentifiers($pas, $renames, $warnings);
    }
    $pas = pasAddUses($pas, $units, $warnings);
    $pas = pasAddFields($pas, $formClass, $fields, $warnings);
    return ['pas' => $pas, 'warnings' => $warnings];
}
