<?php
declare(strict_types=1);

require __DIR__ . '/../lib/PasSync.php';

$pas = file_get_contents(__DIR__ . '/../../examples/demo/unit1.pas');
if ($pas === false) {
    fwrite(STDERR, "Cannot read examples/demo/unit1.pas\n");
    exit(1);
}

$components = [
    ['name' => 'Button1', 'className' => 'TWButton', 'unit' => 'WebCtrls'],
    ['name' => 'TabSheet5', 'className' => 'TTabSheet', 'unit' => 'ComCtrls'],
    ['name' => 'MenuItem8', 'className' => 'TMenuItem', 'unit' => 'Menus'],
    ['name' => 'WButton1', 'className' => 'TWButton', 'unit' => 'WebCtrls'],
];

$result = syncPasUnit($pas, 'TWForm1', $components);
$updated = $result['pas'];

foreach (['Button1: TWButton;', 'TabSheet5: TTabSheet;', 'MenuItem8: TMenuItem;'] as $needle) {
    if (!str_contains($updated, $needle)) {
        fwrite(STDERR, "Missing field: $needle\n");
        exit(1);
    }
}

if (substr_count($updated, 'WButton1: TWButton;') !== 1) {
    fwrite(STDERR, "Existing WButton1 field was duplicated\n");
    exit(1);
}

$second = syncPasUnit($updated, 'TWForm1', $components);
if ($second['pas'] !== $updated) {
    fwrite(STDERR, "Sync is not idempotent\n");
    exit(1);
}

if (count($result['warnings']) > 0) {
    fwrite(STDERR, "Unexpected warnings: " . implode('; ', $result['warnings']) . "\n");
    exit(1);
}

echo "OK .pas fields and uses synchronization\n";
