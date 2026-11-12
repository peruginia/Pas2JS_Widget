<?php
declare(strict_types=1);

/**
 * Generate designer/manifest/wcl-symbols.json from the published properties of
 * the WCL runtime classes. Run it after changing widgets/*.pas:
 *
 *   php designer/tools/generate-wcl-symbols.php
 */

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'PascalSymbols.php';

$root = dirname(__DIR__, 2);
$widgetsDir = $root . DIRECTORY_SEPARATOR . 'widgets';
$output = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'manifest' . DIRECTORY_SEPARATOR . 'wcl-symbols.json';

$files = glob($widgetsDir . DIRECTORY_SEPARATOR . '*.pas') ?: [];
sort($files, SORT_STRING);

$classes = [];
$units = [];
foreach ($files as $file) {
    $source = file_get_contents($file);
    if ($source === false) {
        fwrite(STDERR, "Cannot read {$file}\n");
        exit(1);
    }
    $parsed = PascalSymbols::parse($source, basename($file));
    $units[] = $parsed['unit'];
    foreach ($parsed['classes'] as $class) {
        $name = $class['name'];
        if (isset($classes[$name])) {
            continue;
        }
        $members = [];
        foreach ($class['members'] as $member) {
            if (($member['visibility'] ?? '') !== 'published') {
                continue;
            }
            $members[] = [
                'name' => $member['name'],
                'kind' => self_member_kind($member),
                'type' => self_member_type($member),
            ];
        }
        $classes[$name] = [
            'unit' => $parsed['unit'],
            'parent' => $class['parent'],
            'members' => $members,
        ];
    }
}

/** @param array{name:string,kind:string,detail:string,visibility:string} $member */
function self_member_kind(array $member): string
{
    if (preg_match('/^On[A-Z]/', $member['name'])) {
        return 'event';
    }
    if (in_array($member['kind'], ['procedure', 'function', 'constructor', 'destructor'], true)) {
        return 'method';
    }
    return 'property';
}

/** @param array{name:string,kind:string,detail:string,visibility:string} $member */
function self_member_type(array $member): string
{
    $detail = trim($member['detail'] ?? '');
    if ($detail === '' || $detail === ';' || !str_starts_with($detail, ':')) {
        return '';
    }
    $detail = ltrim(substr($detail, 1));
    if (preg_match('/^([^;]+?)(?:\s+(?:read|write|stored|default|index|nodefault|implements)\b|;|$)/i', $detail, $match)) {
        return trim($match[1]);
    }
    return '';
}

/** @return array<string, array{name:string,kind:string,type:string}> */
function resolved_members(string $name, array $classes, array $seen = []): array
{
    $key = strtolower($name);
    if (isset($seen[$key]) || !isset($classes[$name])) {
        return [];
    }
    $seen[$key] = true;
    $class = $classes[$name];
    $result = [];
    $parent = (string) ($class['parent'] ?? '');
    if ($parent !== '') {
        foreach (resolved_members($parent, $classes, $seen) as $member) {
            $result[strtolower($member['name'])] = $member;
        }
    }
    foreach ($class['members'] as $member) {
        $key = strtolower($member['name']);
        $existing = $result[$key] ?? null;
        $result[$key] = [
            'name' => $member['name'],
            'kind' => $member['kind'],
            'type' => $member['type'] !== '' ? $member['type'] : (string) ($existing['type'] ?? ''),
        ];
    }
    uasort($result, static fn(array $a, array $b): int => strcasecmp($a['name'], $b['name']));
    return $result;
}

$resolved = [];
foreach (array_keys($classes) as $name) {
    $resolved[strtolower($name)] = resolved_members($name, $classes);
}

$data = [
    'classes' => [],
    'units' => array_values(array_unique($units)),
];
foreach ($classes as $name => $class) {
    $mem = array_values($resolved[strtolower($name)] ?? []);
    $data['classes'][$name] = [
        'unit' => $class['unit'],
        'parent' => $class['parent'],
        'members' => $mem,
    ];
}
ksort($data['classes'], SORT_STRING);
sort($data['units'], SORT_STRING);

$json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if ($json === false) {
    fwrite(STDERR, "Cannot encode the manifest.\n");
    exit(1);
}
$payload = $json . "\n";
if (in_array('--check', $argv ?? [], true)) {
    $current = @file_get_contents($output);
    if ($current === false || $current !== $payload) {
        fwrite(STDERR, "wcl-symbols.json is out of date; run designer/tools/generate-wcl-symbols.php\n");
        exit(1);
    }
    fwrite(STDOUT, "wcl-symbols.json is up to date.\n");
    exit(0);
}
if (file_put_contents($output, $payload) === false) {
    fwrite(STDERR, "Cannot write {$output}\n");
    exit(1);
}

$memberCount = 0;
foreach ($data['classes'] as $class) {
    $memberCount += count($class['members']);
}
fwrite(STDOUT, 'Wrote ' . count($data['classes']) . ' classes and ' . $memberCount
    . ' members from ' . count($files) . " WCL units.\n");
