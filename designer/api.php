<?php
declare(strict_types=1);

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

function projectDir(string $projectsDir, string $id): string
{
    return $projectsDir . DIRECTORY_SEPARATOR . $id;
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
        $config = ['name' => $id, 'form' => 'unit1.lfm', 'unit' => 'unit1.pas'];
    }
    $config['id'] = $id;
    $config['name'] = (string) ($config['name'] ?? $id);
    $config['form'] = formFile((string) ($config['form'] ?? 'unit1.lfm'));
    $config['unit'] = (string) ($config['unit'] ?? 'unit1.pas');
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
            $file = $dir . DIRECTORY_SEPARATOR . $config['form'];
            if (!is_file($file)) {
                fail('Form file not found.', 404);
            }
            $lfm = file_get_contents($file);
            if ($lfm === false) {
                fail('Cannot read form file.', 500);
            }
            echo json_encode([
                'project' => $config,
                'lfm' => $lfm,
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
            $file = $dir . DIRECTORY_SEPARATOR . $config['form'];
            if (file_put_contents($file, $lfm) === false) {
                fail('Cannot write form file.', 500);
            }
            echo json_encode(['ok' => true, 'bytes' => strlen($lfm)]);
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
                'form' => 'unit1.lfm',
                'unit' => 'unit1.pas',
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
