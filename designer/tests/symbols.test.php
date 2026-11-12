<?php
declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'PascalSymbols.php';

function check(bool $condition, string $message): void
{
    if (!$condition) {
        fwrite(STDERR, "FAIL: {$message}\n");
        exit(1);
    }
}

$source = <<<'PAS'
unit DemoUnit;

{$mode delphi}{$H+}

interface

uses
  Classes, SysUtils, WebCtrls;

type
  TDemo = class(TWForm)
    Button1: TWButton;
    Edit1, Edit2: TWEdit;
  private
    FSecret: Integer;
    procedure HiddenMethod;
  public
    procedure Run;
    function Value: Integer;
    property Caption2: string read FSecret;
  end;

  TDemoRecord = record
    A: Integer;
    B: string;
  end;

var
  DemoForm: TDemo;
  Count: Integer;

const
  DemoValue = 42;

procedure DemoProc(A: Integer);

implementation

procedure DemoProc(A: Integer);
begin
end;

end.
PAS;

$parsed = PascalSymbols::parse($source, 'demo.pas');
check($parsed['unit'] === 'DemoUnit', 'unit name');
check(in_array('WebCtrls', $parsed['uses'], true), 'uses');

$class = null;
foreach ($parsed['classes'] as $entry) {
    if ($entry['name'] === 'TDemo') {
        $class = $entry;
        break;
    }
}
check($class !== null, 'class TDemo');
check($class['parent'] === 'TWForm', 'class parent');
$members = array_column($class['members'], 'name');
check(in_array('Button1', $members, true), 'field Button1');
check(in_array('Edit1', $members, true) && in_array('Edit2', $members, true), 'comma fields');
check(in_array('Run', $members, true), 'public method');
check(in_array('Value', $members, true), 'public function');
check(in_array('Caption2', $members, true), 'property');
check(!in_array('FSecret', $members, true), 'private field hidden');
check(!in_array('HiddenMethod', $members, true), 'private method hidden');

$record = null;
foreach ($parsed['classes'] as $entry) {
    if ($entry['name'] === 'TDemoRecord') {
        $record = $entry;
        break;
    }
}
check($record !== null && $record['kind'] === 'record', 'record');
check(in_array('A', array_column($record['members'], 'name'), true), 'record field A');

$symbols = [];
foreach ($parsed['symbols'] as $entry) {
    $symbols[$entry['name']] = $entry;
}
check(isset($symbols['DemoForm']) && $symbols['DemoForm']['kind'] === 'var', 'global var');
check(isset($symbols['DemoValue']) && $symbols['DemoValue']['kind'] === 'const', 'const');
check(isset($symbols['DemoProc']) && $symbols['DemoProc']['kind'] === 'procedure', 'procedure');
check(isset($symbols['TDemo']) && $symbols['TDemo']['kind'] === 'class', 'class symbol');

$demo = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR
    . 'examples' . DIRECTORY_SEPARATOR . 'demo' . DIRECTORY_SEPARATOR . 'uLogin.pas';
if (is_file($demo)) {
    $login = PascalSymbols::parse((string) file_get_contents($demo), 'uLogin.pas');
    $loginClass = null;
    foreach ($login['classes'] as $entry) {
        if ($entry['name'] === 'TFormLogin') {
            $loginClass = $entry;
            break;
        }
    }
    check($loginClass !== null, 'TFormLogin');
    $loginMembers = array_column($loginClass['members'], 'name');
    check(in_array('edtUser', $loginMembers, true), 'edtUser field');
    check(in_array('PrepareLogin', $loginMembers, true), 'public method');
    check(!in_array('DoLogin', $loginMembers, true), 'private method hidden');
}

echo "Pascal symbols tests passed.\n";
