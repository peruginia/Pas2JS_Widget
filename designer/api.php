<?php
declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'PasSync.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'ModuleManifest.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$projectsDir = __DIR__ . DIRECTORY_SEPARATOR . 'projects';
if (!is_dir($projectsDir)) {
    mkdir($projectsDir, 0775, true);
}

function fail(string $message, int $status = 400): void
{
    http_response_code($status);
    echo json_encode(['error' => $message], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function projectId(string $value): string
{
    if (!preg_match('/^[A-Za-z0-9_-]{1,64}$/', $value)) {
        fail('Invalid project id. Use letters, digits, _ or -.');
    }
    return $value;
}

function formFile(string $value): string
{
    if (!preg_match('/^[A-Za-z0-9_.-]+\.lfm$/', $value)) {
        fail('Invalid form file name.');
    }
    return $value;
}

function unitFile(string $value): string
{
    if (!preg_match('/^[A-Za-z0-9_.-]+\.pas$/', $value)) {
        fail('Invalid unit file name.');
    }
    return $value;
}

function programFile(string $value): string
{
    if (!preg_match('/^[A-Za-z0-9_.-]+\.lpr$/', $value)) {
        fail('Invalid program file name.');
    }
    return $value;
}

function htmlFile(string $value): string
{
    if (!preg_match('/^[A-Za-z0-9_.-]+\.html?$/i', $value)) {
        fail('Invalid HTML file name.');
    }
    return $value;
}

function jsFile(string $value): string
{
    if (!preg_match('/^[A-Za-z0-9_.-]+\.js$/i', $value)) {
        fail('Invalid JavaScript file name.');
    }
    return $value;
}

function jsonFile(string $value): string
{
    if (!preg_match('/^[A-Za-z0-9_.-]+\.json$/i', $value)) {
        fail('Invalid JSON file name.');
    }
    return $value;
}

function unitName(string $value): string
{
    if (!preg_match('/^[A-Za-z_][A-Za-z0-9_]*$/', $value)) {
        fail('Invalid unit name.');
    }
    return $value;
}

function projectDir(string $projectsDir, string $id): string
{
    return $projectsDir . DIRECTORY_SEPARATOR . $id;
}

/**
 * Normalize one entry of the project "forms" list. A form entry is either a
 * file name ("unit1.lfm") or an object { form, unit, title }.
 *
 * @return array{form: string, unit: string, title?: string}
 */
function formEntry(mixed $value): array
{
    if (is_string($value)) {
        $form = formFile($value);
        return [
            'form' => $form,
            'unit' => unitFile((string) preg_replace('/\.lfm$/i', '.pas', $form)),
        ];
    }
    if (!is_array($value)) {
        fail('Invalid form entry.');
    }
    $form = formFile((string) ($value['form'] ?? $value['lfm'] ?? 'unit1.lfm'));
    $unit = unitFile((string) ($value['unit'] ?? preg_replace('/\.lfm$/i', '.pas', $form)));
    $entry = ['form' => $form, 'unit' => $unit];
    $title = trim((string) ($value['title'] ?? ''));
    if ($title !== '') {
        $entry['title'] = $title;
    }
    return $entry;
}

/**
 * Find a form of the normalized project by file name; an empty name means the
 * main form.
 */
function findProjectForm(array $config, string $name): ?array
{
    $target = $name !== '' ? $name : (string) $config['mainForm'];
    foreach ($config['forms'] as $entry) {
        if ($entry['form'] === $target) {
            return $entry;
        }
    }
    return null;
}

function readProject(string $dir, string $id): array
{
    $configFile = $dir . DIRECTORY_SEPARATOR . 'project.json';
    if (is_file($configFile)) {
        $rawConfig = (string) file_get_contents($configFile);
        $rawConfig = preg_replace('/^\xEF\xBB\xBF/', '', $rawConfig);
        $config = json_decode($rawConfig, true);
        if (!is_array($config)) {
            fail("Invalid project.json for $id");
        }
    } else {
        $config = ['name' => $id];
    }

    $config['id'] = $id;
    $config['name'] = (string) ($config['name'] ?? $id);

    $forms = [];
    if (isset($config['forms']) && is_array($config['forms'])) {
        foreach ($config['forms'] as $entry) {
            $forms[] = formEntry($entry);
        }
    }
    if ($forms === [] && (isset($config['form']) || isset($config['unit']))) {
        // Single-form project written by the first designer version.
        $forms[] = formEntry([
            'form' => $config['form'] ?? 'unit1.lfm',
            'unit' => $config['unit'] ?? 'unit1.pas',
        ]);
    }

    $unique = [];
    foreach ($forms as $entry) {
        if (!isset($unique[$entry['form']])) {
            $unique[$entry['form']] = $entry;
        }
    }
    $forms = array_values($unique);

    if ($forms === []) {
        // A module (or a unit-only project) has no form.
        $config['forms'] = [];
        $config['mainForm'] = '';
        $config['form'] = '';
        $config['unit'] = '';
    } else {
        $main = trim((string) ($config['mainForm'] ?? $config['form'] ?? $forms[0]['form']));
        $mainEntry = null;
        foreach ($forms as $entry) {
            if ($entry['form'] === $main) {
                $mainEntry = $entry;
                break;
            }
        }
        if ($mainEntry === null) {
            $mainEntry = $forms[0];
        }

        $config['forms'] = $forms;
        $config['mainForm'] = $mainEntry['form'];
        // Keep the single-form fields for older clients and scripts.
        $config['form'] = $mainEntry['form'];
        $config['unit'] = $mainEntry['unit'];
    }

    $kinds = ['application', 'host', 'module'];
    $kind = strtolower(trim((string) ($config['kind'] ?? 'application')));
    $config['kind'] = in_array($kind, $kinds, true) ? $kind : 'application';

    $program = trim((string) ($config['program'] ?? ''));
    $config['program'] = $program !== '' ? programFile($program) : '';

    $html = trim((string) ($config['html'] ?? ''));
    $config['html'] = $html !== '' ? htmlFile($html) : '';

    $output = trim((string) ($config['output'] ?? ''));
    $config['output'] = $output !== '' ? jsFile($output) : '';

    $manifest = trim((string) ($config['manifest'] ?? ''));
    $config['manifest'] = $manifest !== '' ? jsonFile($manifest) : '';

    $entry = trim((string) ($config['entry'] ?? ''));
    $config['entry'] = $entry !== '' ? unitName($entry) : '';

    $modules = [];
    if (isset($config['modules']) && is_array($config['modules'])) {
        foreach ($config['modules'] as $module) {
            if (is_string($module) && trim($module) !== '') {
                $modules[] = trim($module);
            }
        }
    }
    $config['modules'] = array_values(array_unique($modules));

    $units = [];
    if (isset($config['units']) && is_array($config['units'])) {
        foreach ($config['units'] as $unit) {
            if (is_string($unit) && trim($unit) !== '') {
                $units[] = unitFile(trim($unit));
            }
        }
    }
    // The units of the forms are always valid members of the project.
    foreach ($forms as $entry) {
        $units[] = $entry['unit'];
    }
    $config['units'] = array_values(array_unique($units));

    return $config;
}

function lfmString(string $value): string
{
    $value = str_replace(["\r\n", "\n", "\r"], ['#13#10', '#10', '#13'], $value);
    return "'" . str_replace("'", "''", $value) . "'";
}

function newFormUnitSource(int $number): string
{
    $source = <<<'PAS'
unit Unit{{N}};

{$mode objfpc}{$H+}

interface

uses
  Classes, Forms, WebCtrls;

type
  TForm{{N}} = class(TWForm)
  private
  public
  end;

var
  Form{{N}}: TForm{{N}};

implementation

{$R *.lfm}

end.
PAS;
    return str_replace('{{N}}', (string) $number, $source) . "\n";
}

function newUnitSource(string $unitName): string
{
    $source = <<<'PAS'
unit {{NAME}};

{$mode objfpc}{$H+}

interface

uses
  Classes, SysUtils;

implementation

end.
PAS;
    return str_replace('{{NAME}}', $unitName, $source) . "\n";
}

function newApplicationProgram(int $number): string
{
    $source = <<<'PAS'
program project1;

{$mode delphi}{$H+}

uses
  Interfaces, Forms, Unit{{N}};

var
  Form{{N}}: TForm{{N}};

begin
  Application.Initialize;
  Application.CreateForm(TForm{{N}}, Form{{N}});
  Application.Run;
end.
PAS;
    return str_replace('{{N}}', (string) $number, $source) . "\n";
}

function newApplicationHtml(string $title, string $output = 'project1.js'): string
{
    $safeTitle = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
    $safeOutput = htmlspecialchars($output, ENT_QUOTES, 'UTF-8');
    return <<<HTML
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{$safeTitle}</title>
  <script src="{$safeOutput}"></script>
</head>
<body>
  <script>rtl.run();</script>
</body>
</html>

HTML;
}

function newModuleUnitSource(): string
{
    return <<<'PAS'
unit Module1;

{$mode delphi}{$H+}

interface

uses
  Classes, SysUtils;

type
  TModule1 = class
  public
    class procedure Register;
  end;

implementation

class procedure TModule1.Register;
begin
  // Register screens, services and actions in the host application.
end;

initialization
  TModule1.Register;

end.
PAS;
}

function newModuleProgramSource(): string
{
    return <<<'PAS'
program project1;

{$mode delphi}{$H+}

uses
  JS, Classes, SysUtils, Forms, WebCtrls, Module1;

begin
  // A module does not start the application: the host does.
  // Module1 registers itself in its initialization section.
end.
PAS;
}

/**
 * Write the normalized project back to project.json. The units of the forms
 * are not repeated in the "units" list.
 */
function writeProject(string $dir, array $config): void
{
    $formUnits = array_map(static fn(array $entry): string => $entry['unit'], $config['forms']);
    $units = [];
    foreach ($config['units'] as $unit) {
        if (!in_array($unit, $formUnits, true)) {
            $units[] = $unit;
        }
    }

    $data = [
        'name' => $config['name'],
        'kind' => $config['kind'] ?? 'application',
        'mainForm' => $config['mainForm'],
        'forms' => $config['forms'],
        'units' => array_values(array_unique($units)),
    ];
    foreach (['program', 'html', 'output', 'manifest', 'entry'] as $key) {
        if (($config[$key] ?? '') !== '') {
            $data[$key] = $config[$key];
        }
    }
    if (($config['modules'] ?? []) !== []) {
        $data['modules'] = array_values($config['modules']);
    }

    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
    if (file_put_contents($dir . DIRECTORY_SEPARATOR . 'project.json', $json) === false) {
        fail('Cannot write project.json.', 500);
    }
}

/**
 * Find the next free unitN.lfm / unitN.pas pair for a new form.
 *
 * @return array{0: int, 1: string, 2: string}
 */
function nextFormName(string $dir, array $config): array
{
    $used = [];
    foreach ($config['forms'] as $entry) {
        $used[strtolower($entry['form'])] = true;
        $used[strtolower($entry['unit'])] = true;
    }
    foreach ($config['units'] as $unit) {
        $used[strtolower($unit)] = true;
    }

    for ($number = 1; $number < 10000; $number++) {
        $form = "unit{$number}.lfm";
        $unit = "unit{$number}.pas";
        if (isset($used[strtolower($form)]) || isset($used[strtolower($unit)])) {
            continue;
        }
        if (is_file($dir . DIRECTORY_SEPARATOR . $form) || is_file($dir . DIRECTORY_SEPARATOR . $unit)) {
            continue;
        }
        return [$number, $form, $unit];
    }

    fail('Cannot find a free form name.');
}

function nextUnitFileName(string $dir, array $config): string
{
    $used = [];
    foreach ($config['forms'] as $entry) {
        $used[strtolower($entry['unit'])] = true;
    }
    foreach ($config['units'] as $unit) {
        $used[strtolower($unit)] = true;
    }

    for ($number = 1; $number < 10000; $number++) {
        $unit = "unit{$number}.pas";
        if (isset($used[strtolower($unit)])) {
            continue;
        }
        if (is_file($dir . DIRECTORY_SEPARATOR . $unit)) {
            continue;
        }
        return $unit;
    }

    fail('Cannot find a free unit name.');
}

/**
 * Run a command without a shell and return its exit code and combined output.
 *
 * @param list<string> $command
 * @return array{0: int, 1: string}
 */
function runProcess(array $command, string $cwd): array
{
    $stdout = tempnam(sys_get_temp_dir(), 'wcl-out-');
    $stderr = tempnam(sys_get_temp_dir(), 'wcl-err-');
    if ($stdout === false || $stderr === false) {
        fail('Cannot create a temporary file.', 500);
    }
    $descriptors = [
        0 => ['pipe', 'r'],
        1 => ['file', $stdout, 'w'],
        2 => ['file', $stderr, 'w'],
    ];
    $process = proc_open($command, $descriptors, $pipes, $cwd);
    if (!is_resource($process)) {
        @unlink($stdout);
        @unlink($stderr);
        fail('Cannot start the pas2js compiler.', 500);
    }
    if (isset($pipes[0]) && is_resource($pipes[0])) {
        fclose($pipes[0]);
    }
    $code = proc_close($process);
    $out = (string) file_get_contents($stdout);
    $err = (string) file_get_contents($stderr);
    @unlink($stdout);
    @unlink($stderr);
    $combined = rtrim($out);
    if (trim($err) !== '') {
        $combined .= ($combined !== '' ? "\n" : '') . rtrim($err);
    }
    return [$code, $combined];
}

function previewProgram(string $unitName, string $formClass, array $extraUnits = []): string
{
    $units = [];
    foreach (array_merge([$unitName], $extraUnits) as $unit) {
        if ($unit === '') {
            continue;
        }
        $known = false;
        foreach ($units as $existing) {
            if (strcasecmp($existing, $unit) === 0) {
                $known = true;
                break;
            }
        }
        if (!$known) {
            $units[] = $unit;
        }
    }
    $uses = implode(",\n  ", $units);
    $source = <<<'PAS'
program preview;

{$mode delphi}{$H+}

uses
  Interfaces, Forms, {{UNIT}};

var
  PreviewForm: {{CLASS}};

begin
  Application.Initialize;
  Application.CreateForm({{CLASS}}, PreviewForm);
  Application.Run;
end.
PAS;
    return str_replace(['{{UNIT}}', '{{CLASS}}'], [$uses, $formClass], $source) . "\n";
}

function previewHtml(string $title, string $version, string $output = 'preview.js'): string
{
    $safeTitle = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
    $safeOutput = htmlspecialchars($output, ENT_QUOTES, 'UTF-8');
    return <<<HTML
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{$safeTitle}</title>
  <!-- Relative paths inside the form (images, URLs) resolve against the project folder. -->
  <base href="../">
  <link rel="icon" href="preview/preview.ico">
  <script src="preview/{$safeOutput}?v={$version}"></script>
</head>
<body>
  <script>rtl.run();</script>
</body>
</html>

HTML;
}

function previewHtmlHost(string $title, string $version, string $output, array $modules): string
{
    $safeTitle = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
    $safeOutput = htmlspecialchars($output, ENT_QUOTES, 'UTF-8');
    $modulesJson = json_encode(array_values($modules), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    return <<<HTML
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{$safeTitle}</title>
  <base href="../">
  <link rel="icon" href="preview/preview.ico">
  <script src="preview/{$safeOutput}?v={$version}"></script>
</head>
<body>
  <script>
    (async function () {
      function loadScript(url) {
        return new Promise(function (resolve, reject) {
          var script = document.createElement("script");
          script.src = url;
          script.onload = function () { resolve(); };
          script.onerror = function () { reject(new Error("Cannot load " + url)); };
          document.head.appendChild(script);
        });
      }
      async function loadModule(url) {
        var response = await fetch(url, { cache: "no-store" });
        if (!response.ok) throw new Error("Cannot load " + url + " (" + response.status + ")");
        var manifest = await response.json();
        var base = url.slice(0, url.lastIndexOf("/") + 1);
        for (var i = 0; i < manifest.files.length; i++) {
          var entry = manifest.files[i];
          var name = typeof entry === "string" ? null : entry.name;
          var file = typeof entry === "string" ? entry : entry.file;
          if (name && window.pas && pas[name]) continue;
          await loadScript(base + file);
        }
        if (manifest.entry) rtl.run(manifest.entry);
      }
      try {
        var modules = {$modulesJson};
        for (var i = 0; i < modules.length; i++) await loadModule(modules[i]);
        rtl.run("program");
      } catch (error) {
        console.error(error);
        var status = document.createElement("pre");
        status.style.cssText = "margin:16px;color:#b00020;white-space:pre-wrap";
        status.textContent = String(error);
        document.body.appendChild(status);
      }
    })();
  </script>
</body>
</html>

HTML;
}

function previewHtmlModule(string $title, string $version, string $manifest): string
{
    $safeTitle = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
    $safeManifest = htmlspecialchars($manifest, ENT_QUOTES, 'UTF-8');
    return <<<HTML
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{$safeTitle}</title>
  <base href="../">
  <link rel="icon" href="preview/preview.ico">
</head>
<body>
  <pre id="module-status">Loading...</pre>
  <script>
    (async function () {
      function loadScript(url) {
        return new Promise(function (resolve, reject) {
          var script = document.createElement("script");
          script.src = url;
          script.onload = function () { resolve(); };
          script.onerror = function () { reject(new Error("Cannot load " + url)); };
          document.head.appendChild(script);
        });
      }
      try {
        var response = await fetch("preview/lib/{$safeManifest}?v={$version}", { cache: "no-store" });
        if (!response.ok) throw new Error("Cannot load modules.json (" + response.status + ")");
        var manifest = await response.json();
        if (manifest.main) await loadScript("preview/lib/" + manifest.main + "?v={$version}");
        for (var i = 0; i < manifest.files.length; i++) {
          var entry = manifest.files[i];
          var file = typeof entry === "string" ? entry : entry.file;
          await loadScript("preview/lib/" + file + "?v={$version}");
        }
        rtl.run("program");
        document.getElementById("module-status").textContent = "Module loaded: "
          + manifest.files.length + " modules"
          + (manifest.entry ? ", entry " + manifest.entry : "") + ".";
      } catch (error) {
        console.error(error);
        document.getElementById("module-status").textContent = String(error);
      }
    })();
  </script>
</body>
</html>

HTML;
}

/**
 * RTL and search paths shared by every build.
 *
 * @return list<string>
 */
function pas2jsPaths(string $widgetsDir, string $dir, string $previewDir): array
{
    return [
        '-Jirtl.js',
        '-Jm-',
        '-Jeutf-8',
        '-JRjs',
        '-O-',
        '-Fu' . $widgetsDir,
        '-Fi' . $widgetsDir,
        '-Fu' . $dir,
        '-Fu' . $previewDir,
    ];
}

function pas2jsCompiler(): string
{
    $compiler = getenv('PAS2JS');
    if ($compiler === false || trim($compiler) === '') {
        $compiler = 'C:\\lazarus\\pas2js\\bin\\x86_64-win64\\pas2js.exe';
    }
    return $compiler;
}

/** Read the root class and the unit name of a form. */
function formMeta(string $dir, array $formEntry): array
{
    $lfmPath = $dir . DIRECTORY_SEPARATOR . $formEntry['form'];
    $unitPath = $dir . DIRECTORY_SEPARATOR . $formEntry['unit'];
    if (!is_file($lfmPath)) {
        return ['error' => "Form file {$formEntry['form']} not found."];
    }
    if (!is_file($unitPath)) {
        return ['error' => "Unit file {$formEntry['unit']} not found."];
    }
    $lfm = (string) file_get_contents($lfmPath);
    $unitSource = (string) file_get_contents($unitPath);
    if (!preg_match('/^\s*(?:object|inherited)\s+[A-Za-z_][A-Za-z0-9_]*\s*:\s*([A-Za-z_][A-Za-z0-9_]*)/m', $lfm, $classMatch)) {
        return ['error' => "Cannot find the root form class in {$formEntry['form']}."];
    }
    if (!preg_match('/^\s*unit\s+([A-Za-z_][A-Za-z0-9_]*)\s*;/mi', $unitSource, $unitMatch)) {
        return ['error' => "Cannot find the unit name in {$formEntry['unit']}."];
    }
    return [
        'class' => $classMatch[1],
        'unit' => $unitMatch[1],
        'resource' => (bool) preg_match('/{\$R\b[^}]*\.lfm/i', $unitSource),
    ];
}

/** @return list<string> */
function missingFormResources(string $dir, array $config): array
{
    $missing = [];
    foreach ($config['forms'] as $entry) {
        $path = $dir . DIRECTORY_SEPARATOR . $entry['unit'];
        if (!is_file($path)) {
            $missing[] = $entry['unit'] . ' (file not found)';
            continue;
        }
        $source = (string) file_get_contents($path);
        if (!preg_match('/{\$R\b[^}]*\.lfm/i', $source)) {
            $missing[] = $entry['unit'];
        }
    }
    return $missing;
}

function unitDeclaredName(string $path, string $fallback): string
{
    if (is_file($path)) {
        $source = (string) file_get_contents($path);
        if (preg_match('/^\s*unit\s+([A-Za-z_][A-Za-z0-9_]*)\s*;/mi', $source, $match)) {
            return $match[1];
        }
    }
    return $fallback;
}

/** @param list<string> $unitNames */
function moduleProgramSource(array $unitNames): string
{
    $uses = $unitNames === [] ? '' : ",\n  " . implode(",\n  ", $unitNames);
    $source = <<<'PAS'
program preview;

{$mode delphi}{$H+}

uses
  JS, Classes, SysUtils, Forms, WebCtrls{{USES}};

begin
  // A module does not start the application: the host does.
end.
PAS;
    return str_replace('{{USES}}', $uses, $source) . "\n";
}

/** A 1x1 transparent icon: the runtime links <page>.ico, so the preview needs one. */
function previewIcon(): string
{
    return "\x00\x00\x01\x00\x01\x00"
        . pack('CCCCvvVV', 1, 1, 0, 0, 1, 32, 48, 22)
        . pack('VVVvvVVVVVV', 40, 1, 2, 1, 32, 0, 4, 0, 0, 0, 0)
        . str_repeat("\x00", 8);
}

function listProjects(string $projectsDir): array
{
    $result = [];
    foreach (glob($projectsDir . DIRECTORY_SEPARATOR . '*', GLOB_ONLYDIR) ?: [] as $dir) {
        $id = basename($dir);
        if (!preg_match('/^[A-Za-z0-9_-]{1,64}$/', $id)) {
            continue;
        }
        $configFile = $dir . DIRECTORY_SEPARATOR . 'project.json';
        if (!is_file($configFile)) {
            continue;
        }
        try {
            $config = readProject($dir, $id);
            $result[] = [
                'id' => $config['id'],
                'name' => $config['name'],
                'kind' => $config['kind'],
                'form' => $config['form'],
                'unit' => $config['unit'],
                'mainForm' => $config['mainForm'],
                'forms' => $config['forms'],
            ];
        } catch (Throwable $e) {
            // Skip broken projects instead of breaking the whole list.
        }
    }
    usort($result, static fn(array $a, array $b): int => strcasecmp($a['name'], $b['name']));
    return $result;
}

function jsonBody(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        fail('Missing JSON body.');
    }
    try {
        $data = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
    } catch (JsonException $e) {
        fail('Invalid JSON body.');
    }
    if (!is_array($data)) {
        fail('Invalid JSON body.');
    }
    return $data;
}

$action = (string) ($_GET['action'] ?? 'projects');

try {
    switch ($action) {
        case 'projects':
            echo json_encode(['projects' => listProjects($projectsDir)], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            break;

        case 'load': {
            $id = projectId((string) ($_GET['project'] ?? ''));
            $dir = projectDir($projectsDir, $id);
            if (!is_dir($dir)) {
                fail('Project not found.', 404);
            }
            $config = readProject($dir, $id);
            $requestedForm = trim((string) ($_GET['form'] ?? ''));
            if ($config['forms'] === []) {
                if ($requestedForm !== '') {
                    fail('Form not found in project.', 404);
                }
                echo json_encode([
                    'project' => $config,
                    'form' => null,
                    'lfm' => '',
                ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                break;
            }
            $formEntry = findProjectForm($config, $requestedForm);
            if ($formEntry === null) {
                fail('Form not found in project.', 404);
            }
            $file = $dir . DIRECTORY_SEPARATOR . $formEntry['form'];
            if (!is_file($file)) {
                fail('Form file not found.', 404);
            }
            $lfm = file_get_contents($file);
            if ($lfm === false) {
                fail('Cannot read form file.', 500);
            }
            echo json_encode([
                'project' => $config,
                'form' => $formEntry,
                'lfm' => $lfm,
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            break;
        }

        case 'unit': {
            $id = projectId((string) ($_GET['project'] ?? ''));
            $dir = projectDir($projectsDir, $id);
            if (!is_dir($dir)) {
                fail('Project not found.', 404);
            }
            $config = readProject($dir, $id);
            $requestedUnit = trim((string) ($_GET['unit'] ?? ''));
            if ($requestedUnit !== '') {
                if (!in_array($requestedUnit, $config['units'], true)) {
                    fail('Unit not found in project.', 404);
                }
                $selectedUnit = $requestedUnit;
            } else {
                $selectedUnit = (string) $config['unit'];
            }
            $file = $dir . DIRECTORY_SEPARATOR . $selectedUnit;
            if (!is_file($file)) {
                fail('Unit file not found.', 404);
            }
            $source = file_get_contents($file);
            if ($source === false) {
                fail('Cannot read the unit file.', 500);
            }
            echo json_encode([
                'unit' => $selectedUnit,
                'source' => $source,
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
            break;
        }

        case 'saveUnit': {
            if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
                fail('POST required.', 405);
            }
            $data = jsonBody();
            $id = projectId((string) ($data['project'] ?? ''));
            $source = $data['source'] ?? null;
            if (!is_string($source)) {
                fail('Missing unit source.');
            }
            $dir = projectDir($projectsDir, $id);
            if (!is_dir($dir)) {
                fail('Project not found.', 404);
            }
            $config = readProject($dir, $id);
            $requestedUnit = trim((string) ($data['unit'] ?? ''));
            if ($requestedUnit !== '' && !in_array($requestedUnit, $config['units'], true)) {
                fail('Unit not found in project.', 404);
            }
            $selectedUnit = $requestedUnit !== '' ? $requestedUnit : (string) $config['unit'];
            $file = $dir . DIRECTORY_SEPARATOR . $selectedUnit;
            if (!is_file($file)) {
                fail('Unit file not found.', 404);
            }
            if (file_put_contents($file, $source) === false) {
                fail('Cannot write the unit file.', 500);
            }
            echo json_encode([
                'ok' => true,
                'unit' => $selectedUnit,
                'bytes' => strlen($source),
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            break;
        }

        case 'save': {
            if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
                fail('POST required.', 405);
            }
            $data = jsonBody();
            $id = projectId((string) ($data['project'] ?? ''));
            $lfm = $data['lfm'] ?? null;
            if (!is_string($lfm) || trim($lfm) === '') {
                fail('Missing LFM text.');
            }
            $dir = projectDir($projectsDir, $id);
            if (!is_dir($dir)) {
                fail('Project not found.', 404);
            }
            $config = readProject($dir, $id);
            $formEntry = findProjectForm($config, trim((string) ($data['form'] ?? '')));
            if ($formEntry === null) {
                fail('Form not found in project.', 404);
            }
            $file = $dir . DIRECTORY_SEPARATOR . $formEntry['form'];
            if (file_put_contents($file, $lfm) === false) {
                fail('Cannot write form file.', 500);
            }

            $warnings = [];
            $pasChanged = false;
            $formClass = trim((string) ($data['formClass'] ?? ''));
            $components = $data['components'] ?? [];
            if ($formClass !== '' && is_array($components)) {
                $unitPath = $dir . DIRECTORY_SEPARATOR . $formEntry['unit'];
                if (is_file($unitPath)) {
                    $pas = file_get_contents($unitPath);
                    if ($pas === false) {
                        $warnings[] = 'Cannot read the unit file; .pas was not synchronized.';
                    } else {
                        $sync = syncPasUnit($pas, $formClass, $components);
                        $warnings = array_merge($warnings, $sync['warnings']);
                        if ($sync['pas'] !== $pas) {
                            if (file_put_contents($unitPath, $sync['pas']) === false) {
                                $warnings[] = 'Cannot write the unit file; .pas was not synchronized.';
                            } else {
                                $pasChanged = true;
                            }
                        }
                    }
                } else {
                    $warnings[] = 'Unit file not found; .pas was not synchronized.';
                }
            }

            echo json_encode([
                'ok' => true,
                'form' => $formEntry['form'],
                'unit' => $formEntry['unit'],
                'bytes' => strlen($lfm),
                'pasChanged' => $pasChanged,
                'warnings' => $warnings,
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            break;
        }

        case 'createForm': {
            if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
                fail('POST required.', 405);
            }
            $data = jsonBody();
            $id = projectId((string) ($data['project'] ?? ''));
            $dir = projectDir($projectsDir, $id);
            if (!is_dir($dir)) {
                fail('Project not found.', 404);
            }
            $config = readProject($dir, $id);
            [$number, $form, $unit] = nextFormName($dir, $config);
            $title = trim((string) ($data['title'] ?? ''));
            if ($title === '') {
                $title = 'Form ' . $number;
            }

            $lfm = 'object Form' . $number . ': TForm' . $number . "\n"
                . "  Left = 0\n  Top = 0\n  Width = 640\n  Height = 480\n"
                . '  Caption = ' . lfmString($title) . "\nend\n";
            $source = newFormUnitSource($number);
            if (file_put_contents($dir . DIRECTORY_SEPARATOR . $form, $lfm) === false
                || file_put_contents($dir . DIRECTORY_SEPARATOR . $unit, $source) === false) {
                fail('Cannot write the new form.', 500);
            }

            $entry = ['form' => $form, 'unit' => $unit, 'title' => $title];
            $config['forms'][] = $entry;
            if (count($config['forms']) === 1) {
                $config['mainForm'] = $form;
            }
            writeProject($dir, $config);
            $updated = readProject($dir, $id);
            echo json_encode([
                'ok' => true,
                'form' => $entry,
                'project' => $updated,
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            break;
        }

        case 'deleteForm': {
            if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
                fail('POST required.', 405);
            }
            $data = jsonBody();
            $id = projectId((string) ($data['project'] ?? ''));
            $dir = projectDir($projectsDir, $id);
            if (!is_dir($dir)) {
                fail('Project not found.', 404);
            }
            $config = readProject($dir, $id);
            $formEntry = findProjectForm($config, trim((string) ($data['form'] ?? '')));
            if ($formEntry === null) {
                fail('Form not found in project.', 404);
            }
            if (count($config['forms']) <= 1) {
                fail('A project needs at least one form.');
            }

            $remaining = [];
            foreach ($config['forms'] as $entry) {
                if ($entry['form'] !== $formEntry['form']) {
                    $remaining[] = $entry;
                }
            }
            $config['forms'] = $remaining;
            if ($config['mainForm'] === $formEntry['form']) {
                $config['mainForm'] = $remaining[0]['form'];
            }
            $config['units'] = array_values(array_filter(
                $config['units'],
                static fn(string $unit): bool => $unit !== $formEntry['unit'],
            ));
            writeProject($dir, $config);

            if (!empty($data['deleteFiles'])) {
                @unlink($dir . DIRECTORY_SEPARATOR . $formEntry['form']);
                $stillUsed = in_array($formEntry['unit'], array_column($config['forms'], 'unit'), true)
                    || in_array($formEntry['unit'], $config['units'], true);
                if (!$stillUsed) {
                    @unlink($dir . DIRECTORY_SEPARATOR . $formEntry['unit']);
                }
            }

            $updated = readProject($dir, $id);
            echo json_encode([
                'ok' => true,
                'removed' => $formEntry,
                'project' => $updated,
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            break;
        }

        case 'createUnit': {
            if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
                fail('POST required.', 405);
            }
            $data = jsonBody();
            $id = projectId((string) ($data['project'] ?? ''));
            $dir = projectDir($projectsDir, $id);
            if (!is_dir($dir)) {
                fail('Project not found.', 404);
            }
            $config = readProject($dir, $id);

            $name = trim((string) ($data['name'] ?? ''));
            if ($name !== '' && !preg_match('/\.pas$/i', $name)) {
                $name .= '.pas';
            }
            if ($name !== '') {
                $name = (string) preg_replace('/\.pas$/i', '.pas', $name);
                if (!preg_match('/^[A-Za-z_][A-Za-z0-9_]*\.pas$/', $name)) {
                    fail('Invalid unit name. Use letters, digits and _.');
                }
                if (is_file($dir . DIRECTORY_SEPARATOR . $name) || in_array($name, $config['units'], true)) {
                    fail('Unit already exists.', 409);
                }
            } else {
                $name = nextUnitFileName($dir, $config);
            }

            $unitName = ucfirst((string) pathinfo($name, PATHINFO_FILENAME));
            if (file_put_contents($dir . DIRECTORY_SEPARATOR . $name, newUnitSource($unitName)) === false) {
                fail('Cannot write the unit.', 500);
            }

            $config['units'][] = $name;
            writeProject($dir, $config);
            $updated = readProject($dir, $id);
            echo json_encode([
                'ok' => true,
                'unit' => $name,
                'project' => $updated,
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            break;
        }

        case 'deleteUnit': {
            if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
                fail('POST required.', 405);
            }
            $data = jsonBody();
            $id = projectId((string) ($data['project'] ?? ''));
            $dir = projectDir($projectsDir, $id);
            if (!is_dir($dir)) {
                fail('Project not found.', 404);
            }
            $config = readProject($dir, $id);
            $unitName = trim((string) ($data['unit'] ?? ''));
            if ($unitName === '') {
                fail('Missing unit.');
            }
            if (in_array($unitName, array_column($config['forms'], 'unit'), true)) {
                fail('The unit belongs to a form; remove the form instead.');
            }
            if (!in_array($unitName, $config['units'], true)) {
                fail('Unit not found in project.', 404);
            }

            $config['units'] = array_values(array_filter(
                $config['units'],
                static fn(string $unit): bool => $unit !== $unitName,
            ));
            writeProject($dir, $config);
            if (!empty($data['deleteFile'])) {
                @unlink($dir . DIRECTORY_SEPARATOR . $unitName);
            }

            $updated = readProject($dir, $id);
            echo json_encode([
                'ok' => true,
                'unit' => $unitName,
                'project' => $updated,
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            break;
        }

        case 'createProject': {
            if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
                fail('POST required.', 405);
            }
            $data = jsonBody();
            $id = projectId((string) ($data['id'] ?? ''));
            $name = trim((string) ($data['name'] ?? ''));
            if ($name === '') {
                $name = $id;
            }
            $kind = strtolower(trim((string) ($data['kind'] ?? 'application')));
            if (!in_array($kind, ['application', 'host', 'module'], true)) {
                fail('Invalid project kind.');
            }
            $dir = projectDir($projectsDir, $id);
            if (is_dir($dir)) {
                fail('Project already exists.', 409);
            }
            if (!mkdir($dir, 0775, true) && !is_dir($dir)) {
                fail('Cannot create the project folder.', 500);
            }

            $config = [
                'name' => $name,
                'kind' => $kind,
                'mainForm' => '',
                'forms' => [],
                'units' => [],
                'program' => '',
                'html' => '',
                'output' => '',
                'manifest' => '',
                'entry' => '',
                'modules' => [],
            ];
            if ($kind === 'module') {
                $config['program'] = 'project1.lpr';
                $config['manifest'] = 'modules.json';
                $config['entry'] = 'Module1';
                $config['units'] = ['module1.pas'];
                $files = [
                    'module1.pas' => newModuleUnitSource(),
                    'project1.lpr' => newModuleProgramSource(),
                ];
            } else {
                $lfm = 'object Form1: TForm1' . "\n"
                    . "  Left = 0\n  Top = 0\n  Width = 800\n  Height = 600\n"
                    . '  Caption = ' . lfmString($name) . "\nend\n";
                $config['program'] = 'project1.lpr';
                $config['html'] = 'project1.html';
                $config['forms'] = [['form' => 'unit1.lfm', 'unit' => 'unit1.pas', 'title' => $name]];
                $config['mainForm'] = 'unit1.lfm';
                $files = [
                    'unit1.lfm' => $lfm,
                    'unit1.pas' => newFormUnitSource(1),
                    'project1.lpr' => newApplicationProgram(1),
                    'project1.html' => newApplicationHtml($name),
                ];
            }

            foreach ($files as $file => $content) {
                if (file_put_contents($dir . DIRECTORY_SEPARATOR . $file, $content) === false) {
                    fail("Cannot write {$file}.", 500);
                }
            }
            writeProject($dir, $config);
            $project = readProject($dir, $id);
            echo json_encode([
                'ok' => true,
                'project' => $project,
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            break;
        }

        case 'updateProject': {
            if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
                fail('POST required.', 405);
            }
            $data = jsonBody();
            $id = projectId((string) ($data['project'] ?? ''));
            $dir = projectDir($projectsDir, $id);
            if (!is_dir($dir)) {
                fail('Project not found.', 404);
            }
            $config = readProject($dir, $id);
            $settings = $data['settings'] ?? $data;
            if (!is_array($settings)) {
                fail('Invalid project settings.');
            }

            if (array_key_exists('name', $settings)) {
                $name = trim((string) $settings['name']);
                if ($name === '') {
                    fail('Project name is required.');
                }
                $config['name'] = $name;
            }
            if (array_key_exists('kind', $settings)) {
                $kind = strtolower(trim((string) $settings['kind']));
                if (!in_array($kind, ['application', 'host', 'module'], true)) {
                    fail('Invalid project kind.');
                }
                $config['kind'] = $kind;
            }
            $validators = [
                'program' => 'programFile',
                'html' => 'htmlFile',
                'output' => 'jsFile',
                'manifest' => 'jsonFile',
                'entry' => 'unitName',
            ];
            foreach ($validators as $key => $validator) {
                if (!array_key_exists($key, $settings)) {
                    continue;
                }
                $value = trim((string) $settings[$key]);
                $config[$key] = $value === '' ? '' : $validator($value);
            }
            if (array_key_exists('modules', $settings)) {
                $modules = $settings['modules'];
                if (!is_array($modules)) {
                    fail('modules must be a list.');
                }
                $clean = [];
                foreach ($modules as $module) {
                    if (!is_string($module)) {
                        fail('Invalid module reference.');
                    }
                    $module = trim($module);
                    if ($module === '') {
                        continue;
                    }
                    if (strlen($module) > 1024 || preg_match('/[\r\n]/', $module)) {
                        fail('Invalid module reference.');
                    }
                    $clean[] = $module;
                }
                $config['modules'] = array_values(array_unique($clean));
            }

            writeProject($dir, $config);
            $updated = readProject($dir, $id);
            echo json_encode([
                'ok' => true,
                'project' => $updated,
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            break;
        }

        case 'build': {
            if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
                fail('POST required.', 405);
            }
            $data = jsonBody();
            $id = projectId((string) ($data['project'] ?? ''));
            $dir = projectDir($projectsDir, $id);
            if (!is_dir($dir)) {
                fail('Project not found.', 404);
            }
            $config = readProject($dir, $id);
            $mode = (string) ($data['mode'] ?? 'project');
            $mode = $mode === 'form' ? 'form' : 'project';

            $previewDir = $dir . DIRECTORY_SEPARATOR . 'preview';
            if (!is_dir($previewDir) && !mkdir($previewDir, 0775, true) && !is_dir($previewDir)) {
                fail('Cannot create the preview folder.', 500);
            }
            $version = (string) time();
            $emit = static function (array $result): void {
                echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            };
            $write = static function (string $file, string $content) use ($previewDir): void {
                if (file_put_contents($previewDir . DIRECTORY_SEPARATOR . $file, $content) === false) {
                    fail("Cannot write preview/{$file}.", 500);
                }
            };

            $compiler = pas2jsCompiler();
            if (!is_file($compiler)) {
                $emit([
                    'ok' => false,
                    'output' => "pas2js not found: {$compiler}"
                        . "\nSet the PAS2JS environment variable to the compiler executable.",
                ]);
                break;
            }
            $widgetsDir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'widgets';
            $url = 'projects/' . $id . '/preview/preview.html';

            if ($mode === 'form') {
                $formEntry = findProjectForm($config, trim((string) ($data['form'] ?? '')));
                if ($formEntry === null) {
                    fail('Form not found in project.', 404);
                }
                $meta = formMeta($dir, $formEntry);
                if (isset($meta['error'])) {
                    $emit(['ok' => false, 'output' => $meta['error']]);
                    break;
                }
                if (!$meta['resource']) {
                    $emit([
                        'ok' => false,
                        'output' => "{$formEntry['unit']} does not link its form resource."
                            . "\nAdd {\$R *.lfm} after the implementation keyword and build again.",
                    ]);
                    break;
                }

                $title = trim((string) ($formEntry['title'] ?? ''));
                if ($title === '') {
                    $title = $meta['class'];
                }
                $write('preview.lpr', previewProgram($meta['unit'], $meta['class']));
                $write('preview.html', previewHtml($title, $version, 'preview.js'));
                $write('preview.ico', previewIcon());
                $outputPath = $previewDir . DIRECTORY_SEPARATOR . 'preview.js';
                @unlink($outputPath);

                $command = array_merge(
                    [$compiler],
                    pas2jsPaths($widgetsDir, $dir, $previewDir),
                    ['-Jc', '-o' . $outputPath, $previewDir . DIRECTORY_SEPARATOR . 'preview.lpr'],
                );
                [$code, $output] = runProcess($command, $dir);
                $ok = $code === 0 && is_file($outputPath);
                if ($output === '') {
                    $output = $ok ? 'Build succeeded.' : 'The compiler returned no output.';
                }
                $emit([
                    'ok' => $ok,
                    'mode' => 'form',
                    'form' => $formEntry['form'],
                    'unit' => $formEntry['unit'],
                    'formClass' => $meta['class'],
                    'url' => $url,
                    'output' => $output,
                ]);
                break;
            }

            $missing = missingFormResources($dir, $config);
            if ($missing !== []) {
                $emit([
                    'ok' => false,
                    'output' => 'These units do not link their form resource: '
                        . implode(', ', $missing)
                        . "\nAdd {\$R *.lfm} after the implementation keyword and build again.",
                ]);
                break;
            }

            if ($config['kind'] === 'module') {
                if ($config['program'] !== '') {
                    $programName = $config['program'];
                    $programPath = $dir . DIRECTORY_SEPARATOR . $programName;
                    if (!is_file($programPath)) {
                        $emit(['ok' => false, 'output' => "Program file {$programName} not found."]);
                        break;
                    }
                } else {
                    $unitNames = [];
                    foreach ($config['units'] as $unitFile) {
                        $fallback = ucfirst((string) pathinfo($unitFile, PATHINFO_FILENAME));
                        $unitNames[] = unitDeclaredName($dir . DIRECTORY_SEPARATOR . $unitFile, $fallback);
                    }
                    $programName = 'preview.lpr';
                    $programPath = $previewDir . DIRECTORY_SEPARATOR . $programName;
                    $write($programName, moduleProgramSource($unitNames));
                }

                $outputName = $config['output'] !== ''
                    ? $config['output']
                    : (string) preg_replace('/\.lpr$/i', '.js', basename($programName));
                $manifestName = $config['manifest'] !== '' ? $config['manifest'] : 'modules.json';
                $libDir = $previewDir . DIRECTORY_SEPARATOR . 'lib';
                if (!is_dir($libDir) && !mkdir($libDir, 0775, true) && !is_dir($libDir)) {
                    fail('Cannot create preview/lib.', 500);
                }
                foreach (glob($libDir . DIRECTORY_SEPARATOR . '*.js') ?: [] as $oldFile) {
                    @unlink($oldFile);
                }

                $write('preview.html', previewHtmlModule($config['name'] . ' module', $version, $manifestName));
                $write('preview.ico', previewIcon());
                $outputPath = $libDir . DIRECTORY_SEPARATOR . $outputName;
                $command = array_merge(
                    [$compiler],
                    pas2jsPaths($widgetsDir, $dir, $previewDir),
                    ['-Jc-', '-FU' . $libDir, '-o' . $outputPath, $programPath],
                );
                [$code, $output] = runProcess($command, $dir);
                $ok = $code === 0 && is_file($outputPath);
                if ($ok) {
                    try {
                        $manifest = writeModuleManifest(
                            $libDir,
                            $libDir . DIRECTORY_SEPARATOR . $manifestName,
                            $config['entry'],
                        );
                        $output .= ($output !== '' ? "\n" : '')
                            . 'Wrote ' . $manifestName . ' (' . count($manifest['files']) . ' modules)';
                    } catch (Throwable $error) {
                        $ok = false;
                        $output .= ($output !== '' ? "\n" : '') . $error->getMessage();
                    }
                }
                if ($output === '') {
                    $output = $ok ? 'Build succeeded.' : 'The compiler returned no output.';
                }
                $emit([
                    'ok' => $ok,
                    'kind' => 'module',
                    'url' => $url,
                    'manifest' => 'preview/lib/' . $manifestName,
                    'program' => $config['program'] !== '' ? $config['program'] : $programName,
                    'output' => $output,
                ]);
                break;
            }

            if ($config['program'] !== '') {
                $programName = $config['program'];
                $programPath = $dir . DIRECTORY_SEPARATOR . $programName;
                if (!is_file($programPath)) {
                    $emit(['ok' => false, 'output' => "Program file {$programName} not found."]);
                    break;
                }
            } else {
                $mainForm = findProjectForm($config, '');
                if ($mainForm === null) {
                    $emit([
                        'ok' => false,
                        'output' => 'The project has no program and no main form.'
                            . "\nConfigure a program in the project settings or add a form.",
                    ]);
                    break;
                }
                $meta = formMeta($dir, $mainForm);
                if (isset($meta['error'])) {
                    $emit(['ok' => false, 'output' => $meta['error']]);
                    break;
                }
                if (!$meta['resource']) {
                    $emit([
                        'ok' => false,
                        'output' => "{$mainForm['unit']} does not link its form resource."
                            . "\nAdd {\$R *.lfm} after the implementation keyword and build again.",
                    ]);
                    break;
                }
                $programName = 'preview.lpr';
                $programPath = $previewDir . DIRECTORY_SEPARATOR . $programName;
                $unitNames = [];
                foreach ($config['units'] as $unitFile) {
                    $fallback = ucfirst((string) pathinfo($unitFile, PATHINFO_FILENAME));
                    $unitNames[] = unitDeclaredName($dir . DIRECTORY_SEPARATOR . $unitFile, $fallback);
                }
                $write($programName, previewProgram($meta['unit'], $meta['class'], $unitNames));
            }

            $outputName = $config['output'] !== ''
                ? $config['output']
                : (string) preg_replace('/\.lpr$/i', '.js', basename($programName));
            if ($config['kind'] === 'host') {
                $write('preview.html', previewHtmlHost($config['name'], $version, $outputName, $config['modules']));
            } else {
                $write('preview.html', previewHtml($config['name'], $version, $outputName));
            }
            $write('preview.ico', previewIcon());
            $outputPath = $previewDir . DIRECTORY_SEPARATOR . $outputName;
            @unlink($outputPath);

            $command = array_merge(
                [$compiler],
                pas2jsPaths($widgetsDir, $dir, $previewDir),
                ['-Jc', '-o' . $outputPath, $programPath],
            );
            [$code, $output] = runProcess($command, $dir);
            $ok = $code === 0 && is_file($outputPath);
            if ($output === '') {
                $output = $ok ? 'Build succeeded.' : 'The compiler returned no output.';
            }
            $emit([
                'ok' => $ok,
                'kind' => $config['kind'],
                'url' => $url,
                'program' => $config['program'] !== '' ? $config['program'] : $programName,
                'output' => $output,
            ]);
            break;
        }

        case 'import': {
            if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
                fail('POST required.', 405);
            }
            $data = jsonBody();
            $id = projectId((string) ($data['id'] ?? ''));
            $lfm = $data['lfm'] ?? null;
            $name = trim((string) ($data['name'] ?? $id));
            if (!is_string($lfm) || trim($lfm) === '') {
                fail('Missing LFM text.');
            }
            if (!preg_match('/^\s*(object|inherited|inline)\b/', $lfm)) {
                fail('The uploaded file does not look like an LFM form.');
            }
            $dir = projectDir($projectsDir, $id);
            if (is_dir($dir)) {
                fail('Project already exists.', 409);
            }
            if (!mkdir($dir, 0775, true) && !is_dir($dir)) {
                fail('Cannot create project folder.', 500);
            }
            $config = [
                'name' => $name !== '' ? $name : $id,
                'mainForm' => 'unit1.lfm',
                'forms' => [
                    ['form' => 'unit1.lfm', 'unit' => 'unit1.pas', 'title' => 'Imported form'],
                ],
                'units' => [],
            ];
            if (file_put_contents($dir . DIRECTORY_SEPARATOR . 'unit1.lfm', $lfm) === false ||
                file_put_contents($dir . DIRECTORY_SEPARATOR . 'project.json', json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)) === false) {
                fail('Cannot write imported project.', 500);
            }
            echo json_encode([
                'ok' => true,
                'project' => $config + ['id' => $id],
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            break;
        }

        default:
            fail('Unknown action.', 404);
    }
} catch (Throwable $e) {
    fail($e->getMessage(), 500);
}
