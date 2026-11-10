<?php
declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'PasSync.php';

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
    if ($forms === []) {
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

    $program = trim((string) ($config['program'] ?? ''));
    $config['program'] = $program !== '' ? programFile($program) : '';

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
