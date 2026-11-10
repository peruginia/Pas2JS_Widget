<?php
declare(strict_types=1);

/**
 * Conservative .pas updater used by the designer save action.
 *
 * It only adds missing units to the interface uses clause and missing fields
 * to the form class. It never removes code, rewrites existing declarations or
 * touches the implementation section.
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
 * @return array{pas: string, warnings: list<string>}
 */
function syncPasUnit(string $pas, string $formClass, array $components): array
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

    $pas = pasAddUses($pas, $units, $warnings);
    $pas = pasAddFields($pas, $formClass, $fields, $warnings);
    return ['pas' => $pas, 'warnings' => $warnings];
}
