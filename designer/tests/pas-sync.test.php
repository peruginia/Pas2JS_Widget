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

$renameSource = <<<'PAS'
unit RenameTest;

interface

type
  TForm1 = class(TForm)
    Button1: TButton;
    procedure Button1Click(Sender: TObject);
  end;

var
  Form1: TForm1;

implementation

procedure TForm1.Button1Click(Sender: TObject);
begin
  Button1.Caption := 'Button1';
  // Button1 stays in this comment
end;

end.
PAS;

$renamed = syncPasUnit(
    $renameSource,
    'TForm1',
    [['name' => 'Button2', 'className' => 'TButton', 'unit' => 'StdCtrls']],
    [['old' => 'Button1', 'new' => 'Button2']],
);
$renameResult = $renamed['pas'];
foreach ([
    'Button2: TButton;',
    'Button2.Caption',
    'procedure Button1Click',
    "'Button1'",
    '// Button1 stays in this comment',
] as $needle) {
    if (!str_contains($renameResult, $needle)) {
        fwrite(STDERR, "Rename missing expected text: $needle\n");
        exit(1);
    }
}
if (str_contains($renameResult, 'Button1: TButton;')) {
    fwrite(STDERR, "Old field was not renamed\n");
    exit(1);
}

if (count($result['warnings']) > 0) {
    fwrite(STDERR, "Unexpected warnings: " . implode('; ', $result['warnings']) . "\n");
    exit(1);
}

echo "OK .pas fields and uses synchronization\n";
