<?php
declare(strict_types=1);

$file = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'manifest' . DIRECTORY_SEPARATOR . 'wcl-symbols.json';
$raw = @file_get_contents($file);
if ($raw === false) {
    fwrite(STDERR, "FAIL: cannot read wcl-symbols.json; run designer/tools/generate-wcl-symbols.php\n");
    exit(1);
}
$data = json_decode($raw, true);
if (!is_array($data) || !isset($data['classes']) || !is_array($data['classes'])) {
    fwrite(STDERR, "FAIL: invalid wcl-symbols.json\n");
    exit(1);
}

function check(bool $condition, string $message): void
{
    if (!$condition) {
        fwrite(STDERR, "FAIL: {$message}\n");
        exit(1);
    }
}

function member_names(array $class): array
{
    return array_column($class['members'] ?? [], 'name');
}

function member_kind(array $class, string $name): ?string
{
    foreach ($class['members'] ?? [] as $member) {
        if (strcasecmp($member['name'], $name) === 0) {
            return $member['kind'] ?? null;
        }
    }
    return null;
}

$classes = $data['classes'];
check(count($classes) >= 100, 'enough WCL classes');

$componentsFile = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'manifest' . DIRECTORY_SEPARATOR . 'components.json';
$components = json_decode((string) @file_get_contents($componentsFile), true);
if (is_array($components) && isset($components['classes'])) {
    foreach ($components['classes'] as $component) {
        check(isset($classes[$component['name']]), 'missing WCL class ' . $component['name']);
    }
}

$button = $classes['TWButton'] ?? null;
check($button !== null, 'TWButton');
check($button['parent'] === 'TCustomButton', 'TWButton parent');
check(in_array('Caption', member_names($button), true), 'TWButton Caption');
check(in_array('Align', member_names($button), true), 'TWButton inherited Align');
check(in_array('OnClick', member_names($button), true), 'TWButton inherited OnClick');
check(member_kind($button, 'OnClick') === 'event', 'TWButton OnClick is an event');

$edit = $classes['TWEdit'] ?? null;
check($edit !== null, 'TWEdit');
check(in_array('Text', member_names($edit), true), 'TWEdit Text');
check(member_kind($edit, 'OnChange') === 'event', 'TWEdit OnChange is an event');

$timer = $classes['TWTimer'] ?? null;
check($timer !== null, 'TWTimer');
check(in_array('Interval', member_names($timer), true), 'TWTimer Interval');
check(in_array('OnTimer', member_names($timer), true), 'TWTimer OnTimer');

$form = $classes['TWForm'] ?? null;
check($form !== null, 'TWForm');
check(in_array('Caption', member_names($form), true), 'TWForm Caption');
check(in_array('AlphaBlend', member_names($form), true), 'TWForm AlphaBlend');

echo 'WCL symbols tests passed (' . count($classes) . " classes).\n";
