<?php
declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'PasSync.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'ModuleManifest.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'SimpleZip.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'ZipWriter.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'PascalSymbols.php';

// Cross-origin access for a static frontend hosted elsewhere. Set
// WCL_CORS_ORIGINS to a comma-separated list of origins (for example
// "https://user.github.io"); when it is empty any origin is accepted.
$corsOrigins = getenv('WCL_CORS_ORIGINS');
if ($corsOrigins === false) {
    $corsOrigins = $_SERVER['WCL_CORS_ORIGINS'] ?? false;
}
$requestOrigin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
if ($corsOrigins === false || trim($corsOrigins) === '') {
    header('Access-Control-Allow-Origin: *');
} elseif ($requestOrigin !== '') {
    $allowedOrigins = array_values(array_filter(array_map('trim', explode(',', $corsOrigins))));
    if (in_array($requestOrigin, $allowedOrigins, true)) {
        header('Access-Control-Allow-Origin: ' . $requestOrigin);
        header('Vary: Origin');
    }
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Expose-Headers: Content-Disposition');
header('Access-Control-Max-Age: 86400');
if (($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_PRIVATE_NETWORK'] ?? '') === 'true') {
    header('Access-Control-Allow-Private-Network: true');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

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

/** Normalize a project-relative path and reject traversal and hidden entries. */
function projectRelativePath(string $value): string
{
    $path = str_replace('\\', '/', trim($value));
    if ($path === '' || strlen($path) > 512 || str_contains($path, "\0")
        || preg_match('/[\x00-\x1F\x7F]/', $path)) {
        fail('Invalid file path.');
    }
    if (preg_match('#^(?:/|[A-Za-z]:)#', $path)) {
        fail('Invalid file path.');
    }
    $parts = explode('/', $path);
    foreach ($parts as $part) {
        if ($part === '' || $part === '.' || $part === '..' || str_starts_with($part, '.')) {
            fail('Invalid file path.');
        }
    }
    if (in_array(strtolower($parts[0]), ['preview', '.snapshots'], true)) {
        fail('Reserved project folder.');
    }
    return implode('/', $parts);
}

function projectFullPath(string $dir, string $relative): string
{
    $relative = projectRelativePath($relative);
    $root = realpath($dir);
    if ($root === false) {
        fail('Project folder not found.', 404);
    }
    $full = $dir . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relative);
    $parent = realpath(dirname($full));
    if ($parent === false) {
        fail('File folder not found.', 404);
    }
    $prefix = rtrim($root, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
    if (strncasecmp($parent, $prefix, strlen($prefix)) !== 0 && strcasecmp($parent, $root) !== 0) {
        fail('Invalid file path.');
    }
    if (is_file($full)) {
        $real = realpath($full);
        if ($real === false || strncasecmp($real, $prefix, strlen($prefix)) !== 0) {
            fail('Invalid file path.');
        }
        return $real;
    }
    return $full;
}

/** Normalize a generated build path: only files below preview/ are accepted. */
function projectOutputPath(string $value): string
{
    $path = str_replace('\\', '/', trim($value));
    if ($path === '' || strlen($path) > 512 || str_contains($path, "\0")
        || preg_match('/[\x00-\x1F\x7F]/', $path)) {
        fail('Invalid build output path.');
    }
    if (preg_match('#^(?:/|[A-Za-z]:)#', $path)) {
        fail('Invalid build output path.');
    }
    $parts = explode('/', $path);
    if (count($parts) < 2 || strcasecmp($parts[0], 'preview') !== 0) {
        fail('Invalid build output path.');
    }
    foreach ($parts as $part) {
        if ($part === '' || $part === '.' || $part === '..' || str_starts_with($part, '.')) {
            fail('Invalid build output path.');
        }
    }
    return implode('/', $parts);
}

function projectOutputFullPath(string $dir, string $relative): string
{
    $relative = projectOutputPath($relative);
    $root = realpath($dir . DIRECTORY_SEPARATOR . 'preview');
    if ($root === false) {
        fail('Build output folder not found.', 404);
    }
    $full = $dir . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relative);
    $parent = realpath(dirname($full));
    $prefix = rtrim($root, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
    if ($parent === false
        || (strncasecmp($parent, $prefix, strlen($prefix)) !== 0 && strcasecmp($parent, $root) !== 0)) {
        fail('Invalid build output path.');
    }
    $real = realpath($full);
    if ($real === false) {
        fail('Build output file not found.', 404);
    }
    if (strncasecmp($real, $prefix, strlen($prefix)) !== 0) {
        fail('Invalid build output path.');
    }
    return $real;
}

function projectOutputTextFile(string $relative): bool
{
    $extension = strtolower((string) pathinfo($relative, PATHINFO_EXTENSION));
    return $extension === 'lpr' || projectTextFile($relative);
}

function projectTextFile(string $relative): bool
{
    $extension = strtolower((string) pathinfo($relative, PATHINFO_EXTENSION));
    return in_array($extension, [
        'html', 'htm', 'css', 'js', 'json', 'txt', 'md', 'ini', 'xml',
        'svg', 'yml', 'yaml', 'csv', 'map', 'inc', 'cfg', 'conf',
    ], true);
}

function projectImageFile(string $relative): bool
{
    $extension = strtolower((string) pathinfo($relative, PATHINFO_EXTENSION));
    return in_array($extension, ['png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'bmp', 'svg'], true);
}

function projectUploadFile(string $relative): bool
{
    $extension = strtolower((string) pathinfo($relative, PATHINFO_EXTENSION));
    return in_array($extension, [
        'png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'bmp', 'svg',
        'woff', 'woff2', 'ttf', 'otf', 'eot', 'pdf',
    ], true);
}

function projectFileKind(string $relative): string
{
    $extension = strtolower((string) pathinfo($relative, PATHINFO_EXTENSION));
    if (strcasecmp($relative, 'project.json') === 0) {
        return 'settings';
    }
    if ($extension === 'lfm') {
        return 'form';
    }
    if ($extension === 'pas' || $extension === 'lpr') {
        return 'source';
    }
    if (projectImageFile($relative)) {
        return 'image';
    }
    if (projectTextFile($relative)) {
        return 'text';
    }
    return 'asset';
}

/** @return list<array{path:string,size:int,mtime:int,kind:string,editable:bool}> */
function listProjectFiles(string $dir): array
{
    $files = [];
    $walk = static function (string $relativeDir) use (&$walk, &$files, $dir): void {
        $fullDir = $relativeDir === ''
            ? $dir
            : $dir . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relativeDir);
        foreach (scandir($fullDir) ?: [] as $entry) {
            if (count($files) >= 2000) {
                return;
            }
            if ($entry === '.' || $entry === '..' || str_starts_with($entry, '.')) {
                continue;
            }
            if ($relativeDir === '' && strcasecmp($entry, 'preview') === 0) {
                continue;
            }
            $relative = $relativeDir === '' ? $entry : $relativeDir . '/' . $entry;
            $full = $fullDir . DIRECTORY_SEPARATOR . $entry;
            if (is_dir($full)) {
                $walk($relative);
                if (count($files) >= 2000) {
                    return;
                }
                continue;
            }
            if (!is_file($full)) {
                continue;
            }
            $kind = projectFileKind($relative);
            $files[] = [
                'path' => $relative,
                'size' => (int) filesize($full),
                'mtime' => (int) filemtime($full),
                'kind' => $kind,
                'editable' => ($kind === 'text' || $kind === 'form' || $kind === 'source'),
            ];
            if (count($files) >= 2000) {
                return;
            }
        }
    };
    $walk('');
    usort($files, static fn(array $a, array $b): int => strnatcasecmp($a['path'], $b['path']));
    return $files;
}

/** @return list<array{path:string,size:int,mtime:int,kind:string,editable:bool,generated:bool}> */
function listBuildFiles(string $dir): array
{
    $root = $dir . DIRECTORY_SEPARATOR . 'preview';
    if (!is_dir($root)) {
        return [];
    }
    $files = [];
    $walk = static function (string $relativeDir) use (&$walk, &$files, $root): void {
        $fullDir = $relativeDir === ''
            ? $root
            : $root . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relativeDir);
        foreach (scandir($fullDir) ?: [] as $entry) {
            if (count($files) >= 500) {
                return;
            }
            if ($entry === '.' || $entry === '..' || str_starts_with($entry, '.')) {
                continue;
            }
            $relative = $relativeDir === '' ? $entry : $relativeDir . '/' . $entry;
            $full = $fullDir . DIRECTORY_SEPARATOR . $entry;
            if (is_dir($full)) {
                $walk($relative);
                if (count($files) >= 500) {
                    return;
                }
                continue;
            }
            if (!is_file($full)) {
                continue;
            }
            $path = 'preview/' . $relative;
            $files[] = [
                'path' => $path,
                'size' => (int) filesize($full),
                'mtime' => (int) filemtime($full),
                'kind' => projectFileKind($path),
                'editable' => false,
                'generated' => true,
            ];
        }
    };
    $walk('');
    usort($files, static fn(array $a, array $b): int => strnatcasecmp($a['path'], $b['path']));
    return $files;
}

/**
 * Add project files to a ZIP, skipping preview/, hidden entries and anything
 * rejected by the filter. Limits the archive to 2000 files / 64 MB.
 *
 * @param callable(string,string):bool|null $filter receives relative and full path
 */
function addProjectFilesToZip(ZipWriter $zip, string $dir, ?callable $filter = null): int
{
    $count = 0;
    $total = 0;
    $walk = static function (string $relativeDir) use (&$walk, &$count, &$total, $zip, $dir, $filter): void {
        $fullDir = $relativeDir === ''
            ? $dir
            : $dir . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relativeDir);
        foreach (scandir($fullDir) ?: [] as $entry) {
            if ($entry === '.' || $entry === '..' || str_starts_with($entry, '.')) {
                continue;
            }
            if ($relativeDir === '' && strcasecmp($entry, 'preview') === 0) {
                continue;
            }
            $relative = $relativeDir === '' ? $entry : $relativeDir . '/' . $entry;
            $full = $fullDir . DIRECTORY_SEPARATOR . $entry;
            if (is_dir($full)) {
                $walk($relative);
                continue;
            }
            if (!is_file($full)) {
                continue;
            }
            if ($filter !== null && !$filter($relative, $full)) {
                continue;
            }
            $size = (int) filesize($full);
            $total += $size;
            if ($count >= 2000 || $total > 64 * 1024 * 1024) {
                throw new RuntimeException('The project is too large to export (limit 2000 files / 64 MB).');
            }
            $content = file_get_contents($full);
            if ($content === false) {
                throw new RuntimeException("Cannot read {$relative} for export.");
            }
            $zip->add($relative, $content, filemtime($full) ?: null);
            $count++;
        }
    };
    $walk('');
    return $count;
}

/** @return array{0:string,1:string} ZIP contents and download suffix. */
function exportProjectSources(string $dir): array
{
    $zip = new ZipWriter();
    if (addProjectFilesToZip($zip, $dir) === 0) {
        throw new RuntimeException('The project has no files to export.');
    }
    return [$zip->finish(), 'sources'];
}

/** @return array{0:string,1:string} ZIP contents and download suffix. */
function exportBuiltProject(string $dir, array $config): array
{
    if (($config['kind'] ?? 'application') !== 'application') {
        throw new RuntimeException('Built export is available for application projects. Export the project sources instead.');
    }

    $programName = $config['program'] !== '' ? $config['program'] : 'preview.lpr';
    $outputName = $config['output'] !== ''
        ? $config['output']
        : (string) preg_replace('/\.lpr$/i', '.js', basename($programName));
    $previewDir = $dir . DIRECTORY_SEPARATOR . 'preview';
    $builtPath = $previewDir . DIRECTORY_SEPARATOR . $outputName;
    if (!is_file($builtPath)) {
        throw new RuntimeException('Build the project before publishing it.');
    }

    $htmlName = $config['html'] !== '' ? $config['html'] : 'index.html';
    $htmlPath = $dir . DIRECTORY_SEPARATOR . $htmlName;
    if ($config['html'] !== '' && is_file($htmlPath)) {
        $html = file_get_contents($htmlPath);
        if ($html === false) {
            throw new RuntimeException("Cannot read {$htmlName} for export.");
        }
    } else {
        $htmlName = 'index.html';
        $html = newApplicationHtml($config['name'], $outputName);
    }

    $zip = new ZipWriter();
    $zip->add($htmlName, $html);
    $built = file_get_contents($builtPath);
    if ($built === false) {
        throw new RuntimeException("Cannot read the compiled JavaScript {$outputName}.");
    }
    $zip->add($outputName, $built, filemtime($builtPath) ?: null);
    $mapName = $outputName . '.map';
    $mapPath = $previewDir . DIRECTORY_SEPARATOR . $mapName;
    if (is_file($mapPath)) {
        $map = file_get_contents($mapPath);
        if ($map === false) {
            throw new RuntimeException("Cannot read the source map {$mapName}.");
        }
        $zip->add($mapName, $map, filemtime($mapPath) ?: null);
    }

    $filter = static function (string $relative) use ($htmlName, $outputName, $mapName): bool {
        if (strcasecmp($relative, 'project.json') === 0) {
            return false;
        }
        $extension = strtolower((string) pathinfo($relative, PATHINFO_EXTENSION));
        if (in_array($extension, [
            'lfm', 'pas', 'lpr', 'lpi', 'lps', 'lpk', 'dpr', 'dpk', 'res', 'compiled',
        ], true)) {
            return false;
        }
        return strcasecmp($relative, $htmlName) !== 0
            && strcasecmp($relative, 'index.html') !== 0
            && strcasecmp($relative, $outputName) !== 0
            && strcasecmp($relative, $mapName) !== 0;
    };
    addProjectFilesToZip($zip, $dir, $filter);

    return [$zip->finish(), 'publish'];
}

function projectSnapshotRoot(string $dir): string
{
    return $dir . DIRECTORY_SEPARATOR . '.snapshots';
}

function projectSnapshotSkip(string $relative): bool
{
    $parts = explode('/', $relative);
    if (in_array(strtolower($parts[0]), ['preview', '.snapshots'], true)) {
        return true;
    }
    foreach ($parts as $part) {
        if (str_starts_with($part, '.')) {
            return true;
        }
    }
    return false;
}

function projectDeletePath(string $path): void
{
    if (is_link($path) || is_file($path)) {
        @unlink($path);
        return;
    }
    if (!is_dir($path)) {
        return;
    }
    foreach (scandir($path) ?: [] as $entry) {
        if ($entry === '.' || $entry === '..') {
            continue;
        }
        projectDeletePath($path . DIRECTORY_SEPARATOR . $entry);
    }
    @rmdir($path);
}

function projectCopyTree(string $source, string $target, ?callable $filter = null, ?array &$stats = null, string $prefix = ''): void
{
    $stats ??= ['files' => 0, 'bytes' => 0];
    foreach (scandir($source) ?: [] as $entry) {
        if ($entry === '.' || $entry === '..') {
            continue;
        }
        $relative = $prefix === '' ? $entry : $prefix . '/' . $entry;
        if ($filter !== null && !$filter($relative)) {
            continue;
        }
        $from = $source . DIRECTORY_SEPARATOR . $entry;
        $to = $target . DIRECTORY_SEPARATOR . $entry;
        if (is_dir($from)) {
            if (!is_dir($to) && !mkdir($to, 0775, true) && !is_dir($to)) {
                fail('Cannot create a snapshot folder.', 500);
            }
            projectCopyTree($from, $to, $filter, $stats, $relative);
            continue;
        }
        if (!is_file($from)) {
            continue;
        }
        if (!copy($from, $to)) {
            fail('Cannot copy a project file into the snapshot.', 500);
        }
        $stats['files']++;
        $stats['bytes'] += (int) filesize($from);
    }
}

function projectPruneSnapshots(string $dir): void
{
    $root = projectSnapshotRoot($dir);
    $entries = glob($root . DIRECTORY_SEPARATOR . '*', GLOB_ONLYDIR) ?: [];
    usort($entries, static fn(string $a, string $b): int => strcmp(basename($b), basename($a)));
    for ($index = 40; $index < count($entries); $index++) {
        projectDeletePath($entries[$index]);
    }
}

/** @return array{id:string,created:int,reason:string,files:int,bytes:int} */
function projectSnapshot(string $dir, string $reason = 'automatic'): array
{
    $root = projectSnapshotRoot($dir);
    if (!is_dir($root) && !mkdir($root, 0775, true) && !is_dir($root)) {
        fail('Cannot create the snapshot folder.', 500);
    }
    $id = date('Ymd-His') . '-' . bin2hex(random_bytes(2));
    $target = $root . DIRECTORY_SEPARATOR . $id;
    if (!mkdir($target, 0775, true) && !is_dir($target)) {
        fail('Cannot create the snapshot.', 500);
    }
    $stats = ['files' => 0, 'bytes' => 0];
    projectCopyTree(
        $dir,
        $target,
        static fn(string $relative): bool => !projectSnapshotSkip($relative),
        $stats,
    );
    $meta = [
        'id' => $id,
        'created' => time(),
        'reason' => $reason,
        'files' => $stats['files'],
        'bytes' => $stats['bytes'],
    ];
    $json = json_encode($meta, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
    if (file_put_contents($target . DIRECTORY_SEPARATOR . 'snapshot.json', $json) === false) {
        fail('Cannot write the snapshot metadata.', 500);
    }
    projectPruneSnapshots($dir);
    return $meta;
}

/** @return list<array{id:string,created:int,reason:string,files:int,bytes:int}> */
function projectSnapshots(string $dir): array
{
    $root = projectSnapshotRoot($dir);
    $snapshots = [];
    foreach (glob($root . DIRECTORY_SEPARATOR . '*', GLOB_ONLYDIR) ?: [] as $entry) {
        $metaFile = $entry . DIRECTORY_SEPARATOR . 'snapshot.json';
        $meta = is_file($metaFile)
            ? json_decode((string) file_get_contents($metaFile), true)
            : null;
        if (!is_array($meta)) {
            $meta = [
                'id' => basename($entry),
                'created' => (int) filemtime($entry),
                'reason' => 'snapshot',
                'files' => 0,
                'bytes' => 0,
            ];
        }
        $meta['id'] = (string) ($meta['id'] ?? basename($entry));
        $meta['created'] = (int) ($meta['created'] ?? filemtime($entry));
        $meta['reason'] = (string) ($meta['reason'] ?? 'snapshot');
        $meta['files'] = (int) ($meta['files'] ?? 0);
        $meta['bytes'] = (int) ($meta['bytes'] ?? 0);
        $snapshots[] = $meta;
    }
    usort($snapshots, static fn(array $a, array $b): int => ($b['created'] <=> $a['created']) ?: strcmp($b['id'], $a['id']));
    return $snapshots;
}

function projectRestoreSnapshot(string $dir, string $id): array
{
    if (!preg_match('/^[A-Za-z0-9._-]{1,100}$/', $id)) {
        fail('Invalid snapshot id.');
    }
    $root = realpath(projectSnapshotRoot($dir));
    $snapshot = realpath(projectSnapshotRoot($dir) . DIRECTORY_SEPARATOR . $id);
    $prefix = $root === false ? '' : rtrim($root, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
    if ($root === false || $snapshot === false || strncasecmp($snapshot, $prefix, strlen($prefix)) !== 0) {
        fail('Snapshot not found.', 404);
    }
    projectSnapshot($dir, 'before restore');
    foreach (scandir($dir) ?: [] as $entry) {
        if ($entry === '.' || $entry === '..' || $entry === '.snapshots' || $entry === 'preview') {
            continue;
        }
        if (str_starts_with($entry, '.')) {
            continue;
        }
        projectDeletePath($dir . DIRECTORY_SEPARATOR . $entry);
    }
    projectCopyTree(
        $snapshot,
        $dir,
        static fn(string $relative): bool => $relative !== 'snapshot.json',
    );
    if (!is_file($dir . DIRECTORY_SEPARATOR . 'project.json')) {
        fail('The snapshot does not contain project.json.', 500);
    }
    return projectSnapshots($dir)[0] ?? [
        'id' => $id,
        'created' => time(),
        'reason' => 'restore',
        'files' => 0,
        'bytes' => 0,
    ];
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

function defaultBuildOptions(): array
{
    return [
        'optimize' => 'default',
        'target' => 'default',
        'sourceMap' => false,
        'sourceMapSources' => false,
        'assertions' => false,
        'rebuild' => false,
        'defines' => '',
    ];
}

/**
 * Normalize the build options stored in project.json. Invalid values fall back
 * to the defaults; the save action uses strict mode to reject them instead.
 */
function normalizeBuildOptions($value, bool $strict = false): array
{
    $options = defaultBuildOptions();
    if (!is_array($value)) {
        return $options;
    }
    $optimize = $value['optimize'] ?? 'default';
    $optimize = is_string($optimize) ? $optimize : '';
    if (in_array($optimize, ['default', 'none', '1', '2'], true)) {
        $options['optimize'] = $optimize;
    } elseif ($strict) {
        fail('Invalid optimization level.');
    }
    $target = $value['target'] ?? 'default';
    $target = is_string($target) ? $target : '';
    if (in_array($target, ['default', 'es5', 'es6'], true)) {
        $options['target'] = $target;
    } elseif ($strict) {
        fail('Invalid JavaScript target.');
    }
    foreach (['sourceMap', 'sourceMapSources', 'assertions', 'rebuild'] as $key) {
        $options[$key] = !empty($value[$key]);
    }
    if (!$options['sourceMap']) {
        $options['sourceMapSources'] = false;
    }
    $defines = $value['defines'] ?? '';
    if (is_string($defines) && trim($defines) !== '') {
        $parts = preg_split('/[\s,;]+/', trim($defines)) ?: [];
        $clean = [];
        foreach ($parts as $part) {
            if ($part === '') {
                continue;
            }
            if (!preg_match('/^[A-Za-z_][A-Za-z0-9_]*(?::=.*)?$/', $part) || strlen($part) > 200) {
                if ($strict) {
                    fail('Invalid define: ' . $part);
                }
                continue;
            }
            $clean[] = $part;
        }
        $options['defines'] = implode(' ', array_values(array_unique($clean)));
    } elseif ($strict && !is_string($defines)) {
        fail('Invalid defines.');
    }
    return $options;
}

/** Compiler flags shared by Compile and Run for every build mode. */
function buildOptionFlags(array $config): array
{
    $options = normalizeBuildOptions($config['build'] ?? []);
    $flags = [];
    switch ($options['optimize']) {
        case 'none':
            $flags[] = '-O-';
            break;
        case '1':
            $flags[] = '-O1';
            break;
        case '2':
            $flags[] = '-O2';
            break;
    }
    if ($options['target'] === 'es5') {
        $flags[] = '-Pecmascript5';
    } elseif ($options['target'] === 'es6') {
        $flags[] = '-Pecmascript6';
    }
    if ($options['sourceMap']) {
        $flags[] = '-Jm';
        if ($options['sourceMapSources']) {
            $flags[] = '-Jminclude';
        }
    } else {
        $flags[] = '-Jm-';
    }
    if ($options['assertions']) {
        $flags[] = '-Sa';
    }
    if ($options['rebuild']) {
        $flags[] = '-B';
    }
    foreach (explode(' ', $options['defines']) as $define) {
        if ($define !== '') {
            $flags[] = '-d' . $define;
        }
    }
    return $flags;
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

    $config['build'] = normalizeBuildOptions($config['build'] ?? []);

    return $config;
}

/**
 * Resolve a source file requested by the editor: a project unit, the project
 * program (.lpr) or, when the request is empty, the main form's unit / program.
 */
function projectSourceFile(array $config, string $requested): string
{
    $requested = trim($requested);
    if ($requested !== '') {
        if (($config['program'] ?? '') !== '' && $requested === $config['program']) {
            return programFile($requested);
        }
        if (in_array($requested, $config['units'], true)) {
            return unitFile($requested);
        }
        fail('Source file not found in project.', 404);
    }
    if (($config['unit'] ?? '') !== '') {
        return unitFile((string) $config['unit']);
    }
    if (($config['program'] ?? '') !== '') {
        return programFile((string) $config['program']);
    }
    fail('The project has no source file.', 404);
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
    $build = $config['build'] ?? [];
    $build = is_array($build) ? $build : [];
    if ($build !== [] && $build !== defaultBuildOptions()) {
        $data['build'] = $build;
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
 * Return the program file to compile. When the program links a Windows .res
 * file, a copy without those directives is written in preview/: pas2js does
 * not need the resource and an imported project may not contain it.
 */
function previewProgramPath(string $programPath, string $previewDir, callable $write): string
{
    $source = file_get_contents($programPath);
    if ($source === false) {
        fail('Cannot read the program file.', 500);
    }
    if (!preg_match('/{\$R\s+[^}]*\.res\s*}/i', $source)) {
        return $programPath;
    }
    $stripped = preg_replace('/{\$R\s+[^}]*\.res\s*}/i', '', $source);
    if ($stripped === null) {
        return $programPath;
    }
    $name = basename($programPath);
    $write($name, $stripped);
    return $previewDir . DIRECTORY_SEPARATOR . $name;
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
        '-Fi' . $dir,
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

/**
 * Extensions accepted by the project import. Server-side scripts are kept out
 * because designer/projects is served by Apache.
 *
 * @return list<string>
 */
function importAllowedExtensions(): array
{
    return [
        'lfm', 'pas', 'lpr', 'lpi', 'lps', 'html', 'htm', 'js', 'css', 'json',
        'map', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'webp', 'woff',
        'woff2', 'ttf', 'eot', 'res', 'txt', 'md',
    ];
}

function importPathIgnored(string $path): bool
{
    foreach (explode('/', strtolower($path)) as $part) {
        if (in_array($part, ['backup', 'backups', '.git', '.svn', 'node_modules', '__macosx'], true)) {
            return true;
        }
    }
    return false;
}

/** @return list<string>|null */
function importEntryPath(string $name): ?string
{
    $name = str_replace('\\', '/', $name);
    $name = ltrim($name, '/');
    if ($name === '' || str_ends_with($name, '/')) {
        return null;
    }
    if (strlen($name) > 240) {
        return null;
    }
    $parts = explode('/', $name);
    foreach ($parts as $part) {
        if ($part === '' || $part === '.' || $part === '..' || strlen($part) > 120) {
            return null;
        }
        if ($part[0] === '.' || rtrim($part, ' .') !== $part) {
            return null;
        }
        if (!preg_match('/^[A-Za-z0-9._ -]+$/', $part)) {
            return null;
        }
        if (preg_match('/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i', $part)) {
            return null;
        }
    }
    return implode('/', $parts);
}

function importEntryAllowed(string $path): bool
{
    $extension = strtolower((string) pathinfo($path, PATHINFO_EXTENSION));
    return $extension !== '' && in_array($extension, importAllowedExtensions(), true);
}

function removeDirectory(string $dir): void
{
    if (!is_dir($dir)) {
        return;
    }
    try {
        $items = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS),
            RecursiveIteratorIterator::CHILD_FIRST,
        );
        foreach ($items as $item) {
            if ($item->isDir()) {
                @rmdir($item->getPathname());
            } else {
                @unlink($item->getPathname());
            }
        }
    } catch (Throwable $error) {
        // Best effort: leave what cannot be removed.
    }
    @rmdir($dir);
}

/**
 * Choose the folder inside the ZIP that holds the project sources.
 *
 * @param list<array{path: string, size: int}> $entries
 */
function importRootPrefix(array $entries): string
{
    $scores = [];
    $hasProgram = [];
    foreach ($entries as $entry) {
        $path = $entry['path'];
        $slash = strrpos($path, '/');
        $dir = $slash === false ? '' : substr($path, 0, $slash);
        $extension = strtolower((string) pathinfo($path, PATHINFO_EXTENSION));
        if (!in_array($extension, ['lpr', 'lfm', 'pas', 'html', 'htm'], true)) {
            continue;
        }
        $scores[$dir] = ($scores[$dir] ?? 0) + 1;
        if ($extension === 'lpr') {
            $hasProgram[$dir] = true;
        }
    }

    if (($scores[''] ?? 0) > 0 || $scores === []) {
        return '';
    }
    $top = [];
    foreach ($scores as $dir => $score) {
        if (!str_contains($dir, '/')) {
            $top[$dir] = $score;
        }
    }
    if (count($top) === 1) {
        return (string) array_key_first($top) . '/';
    }

    $best = '';
    $bestWeight = -1;
    $bestDepth = PHP_INT_MAX;
    foreach ($scores as $dir => $score) {
        $weight = $score + (isset($hasProgram[$dir]) ? 100 : 0);
        $depth = $dir === '' ? 0 : substr_count($dir, '/');
        if ($weight > $bestWeight || ($weight === $bestWeight && $depth < $bestDepth)) {
            $best = $dir;
            $bestWeight = $weight;
            $bestDepth = $depth;
        }
    }
    return $best === '' ? '' : $best . '/';
}

/** @return array{program: string, html: string, output: string, manifest: string, entry: string, modules: list<string>, build: array} */
function importProjectSettings(string $dir): array
{
    $settings = [
        'program' => '',
        'html' => '',
        'output' => '',
        'manifest' => '',
        'entry' => '',
        'modules' => [],
        'build' => defaultBuildOptions(),
    ];
    $file = $dir . DIRECTORY_SEPARATOR . 'project.json';
    if (!is_file($file)) {
        return $settings;
    }
    $raw = (string) file_get_contents($file);
    $raw = (string) preg_replace('/^\xEF\xBB\xBF/', '', $raw);
    $json = json_decode($raw, true);
    if (!is_array($json)) {
        return $settings;
    }

    $program = trim((string) ($json['program'] ?? ''));
    if (preg_match('/^[A-Za-z0-9_.-]+\.lpr$/', $program) && is_file($dir . DIRECTORY_SEPARATOR . $program)) {
        $settings['program'] = $program;
    }
    $html = trim((string) ($json['html'] ?? ''));
    if (preg_match('/^[A-Za-z0-9_.-]+\.html?$/i', $html) && is_file($dir . DIRECTORY_SEPARATOR . $html)) {
        $settings['html'] = $html;
    }
    $output = trim((string) ($json['output'] ?? ''));
    if (preg_match('/^[A-Za-z0-9_.-]+\.js$/i', $output)) {
        $settings['output'] = $output;
    }
    $manifest = trim((string) ($json['manifest'] ?? ''));
    if (preg_match('/^[A-Za-z0-9_.-]+\.json$/i', $manifest)) {
        $settings['manifest'] = $manifest;
    }
    $entry = trim((string) ($json['entry'] ?? ''));
    if (preg_match('/^[A-Za-z_][A-Za-z0-9_]*$/', $entry)) {
        $settings['entry'] = $entry;
    }
    if (isset($json['modules']) && is_array($json['modules'])) {
        $modules = [];
        foreach ($json['modules'] as $module) {
            if (!is_string($module)) {
                continue;
            }
            $module = trim($module);
            if ($module !== '' && strlen($module) <= 1024 && !preg_match('/[\r\n]/', $module)) {
                $modules[] = $module;
            }
        }
        $settings['modules'] = array_values(array_unique($modules));
    }
    $settings['build'] = normalizeBuildOptions($json['build'] ?? []);
    return $settings;
}

/** @return array{name: string, class: string}|null */
function lfmRootInfo(string $lfm): ?array
{
    if (!preg_match('/^\s*(?:object|inherited)\s+([A-Za-z_][A-Za-z0-9_]*)\s*:\s*([A-Za-z_][A-Za-z0-9_]*)/m', $lfm, $match)) {
        return null;
    }
    return ['name' => $match[1], 'class' => $match[2]];
}

function lfmCaption(string $lfm): string
{
    if (preg_match("/^\\s*Caption\\s*=\\s*'((?:[^']|'')*)'/m", $lfm, $match)) {
        return str_replace("''", "'", $match[1]);
    }
    return '';
}

function declaredUnitName(string $source): string
{
    if (preg_match('/^\s*unit\s+([A-Za-z_][A-Za-z0-9_]*)\s*;/mi', $source, $match)) {
        return $match[1];
    }
    return '';
}

function importFormStub(string $unitName, string $className, string $instanceName): string
{
    $source = <<<'PAS'
unit {{UNIT}};

{$mode objfpc}{$H+}

interface

uses
  Classes, Forms, WebCtrls;

type
  {{CLASS}} = class(TWForm)
  end;

var
  {{INSTANCE}}: {{CLASS}};

implementation

{$R *.lfm}

end.
PAS;
    return str_replace(
        ['{{UNIT}}', '{{CLASS}}', '{{INSTANCE}}'],
        [$unitName, $className, $instanceName],
        $source,
    ) . "\n";
}

/**
 * Infer forms, units and the entry point from the extracted files.
 *
 * @param array{program: string, html: string, output: string, manifest: string, entry: string, modules: list<string>} $imported
 * @return array{config: array, warnings: list<string>}
 */
function inferProjectConfig(string $dir, string $id, string $name, string $kind, array $imported): array
{
    $warnings = [];
    $rootFiles = [];
    foreach (scandir($dir) ?: [] as $entry) {
        if ($entry === '.' || $entry === '..') {
            continue;
        }
        if (is_file($dir . DIRECTORY_SEPARATOR . $entry)) {
            $rootFiles[] = $entry;
        }
    }

    $byExtension = ['lpr' => [], 'lfm' => [], 'pas' => [], 'html' => []];
    foreach ($rootFiles as $file) {
        $extension = strtolower((string) pathinfo($file, PATHINFO_EXTENSION));
        if (isset($byExtension[$extension])) {
            $byExtension[$extension][] = $file;
        }
    }
    foreach ($byExtension as &$list) {
        usort($list, 'strcasecmp');
    }
    unset($list);

    $program = '';
    if ($imported['program'] !== '' && in_array($imported['program'], $byExtension['lpr'], true)) {
        $program = $imported['program'];
    } elseif (count($byExtension['lpr']) === 1) {
        $program = $byExtension['lpr'][0];
    } elseif (count($byExtension['lpr']) > 1) {
        $wanted = [
            strtolower($id),
            strtolower((string) preg_replace('/[^A-Za-z0-9_-]+/', '-', $name)),
        ];
        foreach ($byExtension['lpr'] as $candidate) {
            if (in_array(strtolower((string) pathinfo($candidate, PATHINFO_FILENAME)), $wanted, true)) {
                $program = $candidate;
                break;
            }
        }
        if ($program === '') {
            $program = $byExtension['lpr'][0];
        }
        $warnings[] = 'Multiple .lpr files found; using ' . $program . '.';
    }

    $createClasses = [];
    $programUnits = [];
    if ($program !== '') {
        $source = (string) file_get_contents($dir . DIRECTORY_SEPARATOR . $program);
        preg_match_all('/Application\s*\.\s*CreateForm\s*\(\s*([A-Za-z_][A-Za-z0-9_]*)/i', $source, $matches);
        $createClasses = $matches[1];
        if (preg_match('/^\s*uses\b(.*?);/ims', $source, $usesMatch)) {
            foreach (explode(',', $usesMatch[1]) as $unit) {
                $unit = trim($unit);
                if (preg_match('/^[A-Za-z_][A-Za-z0-9_]*$/', $unit)) {
                    $programUnits[] = $unit;
                }
            }
        }
    }

    $pasByBase = [];
    foreach ($byExtension['pas'] as $file) {
        $pasByBase[strtolower((string) pathinfo($file, PATHINFO_FILENAME))] = $file;
    }

    $forms = [];
    $formUnits = [];
    $formByClass = [];
    foreach ($byExtension['lfm'] as $lfmFile) {
        $base = (string) pathinfo($lfmFile, PATHINFO_FILENAME);
        $unitFile = $pasByBase[strtolower($base)] ?? '';
        $lfm = (string) file_get_contents($dir . DIRECTORY_SEPARATOR . $lfmFile);
        $info = lfmRootInfo($lfm);
        if ($info === null) {
            $warnings[] = "Cannot read the root class of {$lfmFile}.";
            continue;
        }
        if ($unitFile === '') {
            $unitName = ucfirst($base);
            $unitFile = $base . '.pas';
            $suffix = 1;
            while (!preg_match('/^[A-Za-z_][A-Za-z0-9_]*$/', $unitName)
                || isset($pasByBase[strtolower((string) preg_replace('/\.pas$/i', '', $unitFile))])
                || is_file($dir . DIRECTORY_SEPARATOR . $unitFile)
            ) {
                $unitName = 'Unit' . $suffix;
                $unitFile = $unitName . '.pas';
                $suffix++;
            }
            if (file_put_contents($dir . DIRECTORY_SEPARATOR . $unitFile, importFormStub($unitName, $info['class'], $info['name'])) === false) {
                $warnings[] = "Cannot create {$unitFile} for {$lfmFile}.";
                continue;
            }
            $warnings[] = "Created {$unitFile} from {$lfmFile} (no unit found).";
        }
        $title = lfmCaption($lfm);
        if ($title === '') {
            $title = $info['class'];
        }
        $entry = ['form' => $lfmFile, 'unit' => $unitFile, 'title' => $title];
        $forms[] = $entry;
        $formUnits[strtolower($unitFile)] = true;
        $formByClass[strtolower($info['class'])] = $entry;
    }

    $main = null;
    foreach ($createClasses as $class) {
        if (isset($formByClass[strtolower($class)])) {
            $main = $formByClass[strtolower($class)];
            break;
        }
    }
    if ($main === null && $forms !== []) {
        $main = $forms[0];
    }
    if ($main !== null) {
        $forms = array_values(array_filter($forms, static fn(array $form): bool => $form['form'] !== $main['form']));
        array_unshift($forms, $main);
    }

    $units = [];
    foreach ($byExtension['pas'] as $file) {
        if (!isset($formUnits[strtolower($file)])) {
            $units[] = $file;
        }
    }

    if ($program === '' && $forms === [] && $units === []) {
        throw new RuntimeException('No .lpr, .lfm or .pas files found in the project root.');
    }

    $html = '';
    if ($imported['html'] !== '' && in_array($imported['html'], $byExtension['html'], true)) {
        $html = $imported['html'];
    } elseif ($program !== '') {
        $jsName = (string) preg_replace('/\.lpr$/i', '.js', $program);
        foreach ($byExtension['html'] as $candidate) {
            $text = (string) file_get_contents($dir . DIRECTORY_SEPARATOR . $candidate);
            if (stripos($text, $jsName) !== false) {
                $html = $candidate;
                break;
            }
        }
    }
    if ($html === '' && count($byExtension['html']) === 1) {
        $html = $byExtension['html'][0];
    }

    $entry = $imported['entry'];
    if ($kind === 'module' && $entry === '') {
        $declaredByFile = [];
        $formUnitFiles = array_column($forms, 'unit');
        foreach (array_merge($units, $formUnitFiles) as $file) {
            $declared = declaredUnitName((string) file_get_contents($dir . DIRECTORY_SEPARATOR . $file));
            if ($declared !== '') {
                $declaredByFile[strtolower($declared)] = $declared;
            }
        }
        foreach (array_reverse($programUnits) as $unit) {
            if (isset($declaredByFile[strtolower($unit)])) {
                $entry = $declaredByFile[strtolower($unit)];
                break;
            }
        }
        if ($entry === '') {
            foreach ($units as $file) {
                $declared = declaredUnitName((string) file_get_contents($dir . DIRECTORY_SEPARATOR . $file));
                if ($declared !== '') {
                    $entry = $declared;
                    break;
                }
            }
        }
        if ($entry === '' && $forms !== []) {
            $declared = declaredUnitName((string) file_get_contents($dir . DIRECTORY_SEPARATOR . $forms[0]['unit']));
            if ($declared !== '') {
                $entry = $declared;
            }
        }
    }

    $nested = 0;
    try {
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS),
        );
        foreach ($iterator as $file) {
            if (!$file->isFile()) {
                continue;
            }
            $relative = (string) substr($file->getPathname(), strlen($dir) + 1);
            if (!str_contains($relative, DIRECTORY_SEPARATOR) && !str_contains($relative, '/')) {
                continue;
            }
            if (in_array(strtolower($file->getExtension()), ['pas', 'lfm', 'lpr'], true)) {
                $nested++;
            }
        }
    } catch (Throwable $error) {
        // A scan failure is not fatal.
    }
    if ($nested > 0) {
        $warnings[] = "{$nested} nested Pascal/LFM files are kept as assets but are not part of the designer project.";
    }

    $config = [
        'name' => $name,
        'kind' => $kind,
        'mainForm' => $main['form'] ?? '',
        'forms' => $forms,
        'units' => $units,
        'program' => $program,
        'html' => $html,
        'output' => $imported['output'],
        'manifest' => $imported['manifest'] !== '' ? $imported['manifest'] : ($kind === 'module' ? 'modules.json' : ''),
        'entry' => $entry,
        'modules' => $imported['modules'],
        'build' => $imported['build'] ?? defaultBuildOptions(),
    ];
    return ['config' => $config, 'warnings' => $warnings];
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
    usort($result, static function (array $a, array $b): int {
        if ($a['id'] === 'demo' && $b['id'] !== 'demo') {
            return -1;
        }
        if ($b['id'] === 'demo' && $a['id'] !== 'demo') {
            return 1;
        }
        return strcasecmp($a['name'], $b['name']);
    });
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
            $selectedUnit = projectSourceFile($config, (string) ($_GET['unit'] ?? ''));
            $file = $dir . DIRECTORY_SEPARATOR . $selectedUnit;
            if (!is_file($file)) {
                fail('Source file not found.', 404);
            }
            $source = file_get_contents($file);
            if ($source === false) {
                fail('Cannot read the source file.', 500);
            }
            echo json_encode([
                'unit' => $selectedUnit,
                'source' => $source,
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
            break;
        }

        case 'files': {
            $id = projectId((string) ($_GET['project'] ?? ''));
            $dir = projectDir($projectsDir, $id);
            if (!is_dir($dir)) {
                fail('Project not found.', 404);
            }
            echo json_encode([
                'files' => listProjectFiles($dir),
                'build' => listBuildFiles($dir),
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            break;
        }

        case 'symbols': {
            $id = projectId((string) ($_GET['project'] ?? ''));
            $dir = projectDir($projectsDir, $id);
            if (!is_dir($dir)) {
                fail('Project not found.', 404);
            }
            $config = readProject($dir, $id);
            $sourceFiles = [];
            foreach ($config['forms'] as $form) {
                $sourceFiles[$form['unit']] = true;
            }
            foreach ($config['units'] as $unit) {
                $sourceFiles[$unit] = true;
            }
            if ($config['program'] !== '') {
                $sourceFiles[$config['program']] = true;
            }

            $units = [];
            $uses = [];
            $classes = [];
            $symbols = [];
            $signatureParts = [];
            foreach (array_keys($sourceFiles) as $relative) {
                $full = $dir . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relative);
                if (!is_file($full)) {
                    continue;
                }
                $size = (int) filesize($full);
                if ($size > 2 * 1024 * 1024) {
                    continue;
                }
                $source = file_get_contents($full);
                if ($source === false) {
                    continue;
                }
                $parsed = PascalSymbols::parse($source, $relative);
                $units[$parsed['unit']] = ['name' => $parsed['unit'], 'file' => $relative];
                foreach ($parsed['uses'] as $unit) {
                    $uses[$unit] = true;
                }
                foreach ($parsed['classes'] as $class) {
                    if (count($classes) < 500) {
                        $classes[] = $class;
                    }
                }
                foreach ($parsed['symbols'] as $symbol) {
                    if ($symbol['name'] !== '' && count($symbols) < 5000) {
                        $symbols[] = $symbol;
                    }
                }
                $signatureParts[] = $relative . '|' . (int) filemtime($full) . '|' . $size;
            }

            echo json_encode([
                'ok' => true,
                'signature' => sha1(implode('|', $signatureParts)),
                'units' => array_values($units),
                'uses' => array_keys($uses),
                'classes' => $classes,
                'symbols' => $symbols,
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            break;
        }

        case 'readFile': {
            $id = projectId((string) ($_GET['project'] ?? ''));
            $dir = projectDir($projectsDir, $id);
            if (!is_dir($dir)) {
                fail('Project not found.', 404);
            }
            $file = projectRelativePath((string) ($_GET['file'] ?? ''));
            if (!projectTextFile($file) || strcasecmp($file, 'project.json') === 0) {
                fail('File type is not editable.');
            }
            $full = projectFullPath($dir, $file);
            if (!is_file($full)) {
                fail('File not found.', 404);
            }
            if (filesize($full) > 2 * 1024 * 1024) {
                fail('File is too large.', 413);
            }
            $source = file_get_contents($full);
            if ($source === false) {
                fail('Cannot read the file.', 500);
            }
            echo json_encode([
                'ok' => true,
                'file' => $file,
                'source' => $source,
                'size' => strlen($source),
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
            break;
        }

        case 'readOutput': {
            $id = projectId((string) ($_GET['project'] ?? ''));
            $dir = projectDir($projectsDir, $id);
            if (!is_dir($dir)) {
                fail('Project not found.', 404);
            }
            $file = projectOutputPath((string) ($_GET['file'] ?? ''));
            if (!projectOutputTextFile($file)) {
                fail('File type is not readable.');
            }
            $full = projectOutputFullPath($dir, $file);
            if (filesize($full) > 8 * 1024 * 1024) {
                fail('File is too large.', 413);
            }
            $source = file_get_contents($full);
            if ($source === false) {
                fail('Cannot read the build output.', 500);
            }
            echo json_encode([
                'ok' => true,
                'file' => $file,
                'generated' => true,
                'source' => $source,
                'size' => strlen($source),
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
            break;
        }

        case 'writeFile': {
            if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
                fail('POST required.', 405);
            }
            $data = jsonBody();
            $id = projectId((string) ($data['project'] ?? ''));
            $dir = projectDir($projectsDir, $id);
            if (!is_dir($dir)) {
                fail('Project not found.', 404);
            }
            $file = projectRelativePath((string) ($data['file'] ?? ''));
            $source = $data['source'] ?? null;
            if (!is_string($source)) {
                fail('Missing file source.');
            }
            if (!projectTextFile($file) || strcasecmp($file, 'project.json') === 0) {
                fail('File type is not editable.');
            }
            if (strlen($source) > 2 * 1024 * 1024) {
                fail('File is too large.', 413);
            }
            $full = projectFullPath($dir, $file);
            if (!is_file($full)) {
                fail('File not found.', 404);
            }
            $current = file_get_contents($full);
            if ($current === $source) {
                echo json_encode(['ok' => true, 'file' => $file, 'bytes' => strlen($source)], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                break;
            }
            projectSnapshot($dir, 'save ' . $file);
            if (file_put_contents($full, $source) === false) {
                fail('Cannot write the file.', 500);
            }
            echo json_encode([
                'ok' => true,
                'file' => $file,
                'bytes' => strlen($source),
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            break;
        }

        case 'uploadFile': {
            if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
                fail('POST required.', 405);
            }
            $data = jsonBody();
            $id = projectId((string) ($data['project'] ?? ''));
            $dir = projectDir($projectsDir, $id);
            if (!is_dir($dir)) {
                fail('Project not found.', 404);
            }
            $name = basename(str_replace('\\', '/', trim((string) ($data['name'] ?? ''))));
            if (!preg_match('/^[A-Za-z0-9][A-Za-z0-9._ -]{0,120}$/', $name) || !projectUploadFile($name)) {
                fail('Invalid asset file name or type.');
            }
            $encoded = $data['data'] ?? null;
            if (!is_string($encoded)) {
                fail('Missing asset data.');
            }
            $binary = base64_decode($encoded, true);
            if ($binary === false) {
                fail('Invalid asset data.');
            }
            if (strlen($binary) > 4 * 1024 * 1024) {
                fail('Asset is too large (maximum 4 MB).', 413);
            }
            $full = projectFullPath($dir, $name);
            if (file_exists($full)) {
                fail('File already exists.', 409);
            }
            projectSnapshot($dir, 'upload ' . $name);
            if (file_put_contents($full, $binary) === false) {
                fail('Cannot write the asset.', 500);
            }
            echo json_encode([
                'ok' => true,
                'file' => $name,
                'size' => strlen($binary),
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            break;
        }

        case 'snapshots': {
            $id = projectId((string) ($_GET['project'] ?? ''));
            $dir = projectDir($projectsDir, $id);
            if (!is_dir($dir)) {
                fail('Project not found.', 404);
            }
            echo json_encode([
                'snapshots' => projectSnapshots($dir),
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            break;
        }

        case 'createSnapshot': {
            if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
                fail('POST required.', 405);
            }
            $data = jsonBody();
            $id = projectId((string) ($data['project'] ?? ''));
            $dir = projectDir($projectsDir, $id);
            if (!is_dir($dir)) {
                fail('Project not found.', 404);
            }
            $reason = trim((string) ($data['reason'] ?? 'manual'));
            $snapshot = projectSnapshot($dir, $reason !== '' ? $reason : 'manual');
            echo json_encode([
                'ok' => true,
                'snapshot' => $snapshot,
                'snapshots' => projectSnapshots($dir),
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            break;
        }

        case 'restoreSnapshot': {
            if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
                fail('POST required.', 405);
            }
            $data = jsonBody();
            $id = projectId((string) ($data['project'] ?? ''));
            $dir = projectDir($projectsDir, $id);
            if (!is_dir($dir)) {
                fail('Project not found.', 404);
            }
            $snapshot = trim((string) ($data['snapshot'] ?? ''));
            $safety = projectRestoreSnapshot($dir, $snapshot);
            echo json_encode([
                'ok' => true,
                'project' => readProject($dir, $id),
                'snapshot' => $safety,
                'snapshots' => projectSnapshots($dir),
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
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
            $selectedUnit = projectSourceFile($config, (string) ($data['unit'] ?? ''));
            $file = $dir . DIRECTORY_SEPARATOR . $selectedUnit;
            if (!is_file($file)) {
                fail('Source file not found.', 404);
            }
            $current = file_get_contents($file);
            if ($current === $source) {
                echo json_encode([
                    'ok' => true,
                    'unit' => $selectedUnit,
                    'bytes' => strlen($source),
                ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                break;
            }
            projectSnapshot($dir, 'save ' . $selectedUnit);
            if (file_put_contents($file, $source) === false) {
                fail('Cannot write the source file.', 500);
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
            projectSnapshot($dir, 'save ' . $formEntry['form']);
            if (file_put_contents($file, $lfm) === false) {
                fail('Cannot write form file.', 500);
            }

            $warnings = [];
            $pasChanged = false;
            $formClass = trim((string) ($data['formClass'] ?? ''));
            $components = $data['components'] ?? [];
            $renames = $data['renames'] ?? [];
            if (!is_array($renames)) {
                $renames = [];
            }
            if ($formClass !== '' && is_array($components)) {
                $unitPath = $dir . DIRECTORY_SEPARATOR . $formEntry['unit'];
                if (is_file($unitPath)) {
                    $pas = file_get_contents($unitPath);
                    if ($pas === false) {
                        $warnings[] = 'Cannot read the unit file; .pas was not synchronized.';
                    } else {
                        $sync = syncPasUnit($pas, $formClass, $components, $renames);
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
            projectSnapshot($dir, 'create ' . $form);
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

            projectSnapshot($dir, 'delete ' . $formEntry['form']);
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
            projectSnapshot($dir, 'create ' . $name);
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

            projectSnapshot($dir, 'delete ' . $unitName);
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

            projectSnapshot($dir, 'project settings');
            writeProject($dir, $config);
            $updated = readProject($dir, $id);
            echo json_encode([
                'ok' => true,
                'project' => $updated,
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            break;
        }

        case 'saveBuildOptions': {
            if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
                fail('POST required.', 405);
            }
            $data = jsonBody();
            $id = projectId((string) ($data['project'] ?? ''));
            $dir = projectDir($projectsDir, $id);
            if (!is_dir($dir)) {
                fail('Project not found.', 404);
            }
            $options = $data['options'] ?? null;
            if (!is_array($options)) {
                fail('Invalid build options.');
            }
            $config = readProject($dir, $id);
            $config['build'] = normalizeBuildOptions($options, true);
            projectSnapshot($dir, 'build options');
            writeProject($dir, $config);
            echo json_encode([
                'ok' => true,
                'build' => $config['build'],
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            break;
        }

        case 'export': {
            if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
                fail('POST required.', 405);
            }
            $data = jsonBody();
            $id = projectId((string) ($data['project'] ?? ''));
            $dir = projectDir($projectsDir, $id);
            if (!is_dir($dir)) {
                fail('Project not found.', 404);
            }
            $contents = (string) ($data['contents'] ?? 'sources');
            $config = readProject($dir, $id);
            try {
                if ($contents === 'built') {
                    [$zip, $suffix] = exportBuiltProject($dir, $config);
                } elseif ($contents === 'sources') {
                    [$zip, $suffix] = exportProjectSources($dir);
                } else {
                    fail('Invalid export contents.');
                }
            } catch (Throwable $error) {
                fail($error->getMessage(), 400);
            }
            $filename = $id . '-' . $suffix . '.zip';
            header('Content-Type: application/zip');
            header('Content-Disposition: attachment; filename="' . $filename . '"');
            header('Content-Length: ' . strlen($zip));
            header('X-Content-Type-Options: nosniff');
            echo $zip;
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
            $buildFlags = buildOptionFlags($config);

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
                    $buildFlags,
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
                $programPath = previewProgramPath($programPath, $previewDir, $write);

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
                    $buildFlags,
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
            $programPath = previewProgramPath($programPath, $previewDir, $write);

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
                $buildFlags,
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

        case 'deleteProject': {
            if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
                fail('POST required.', 405);
            }
            $data = jsonBody();
            $id = projectId((string) ($data['project'] ?? ''));
            $dir = projectDir($projectsDir, $id);
            if (!is_dir($dir)) {
                fail('Project not found.', 404);
            }
            removeDirectory($dir);
            if (is_dir($dir)) {
                fail('Cannot delete the project folder.', 500);
            }
            echo json_encode([
                'ok' => true,
                'removed' => $id,
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            break;
        }

        case 'importProject': {
            if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
                fail('POST required.', 405);
            }
            if (!class_exists('SimpleZip')) {
                fail('The ZIP reader is not available.', 500);
            }
            $id = projectId((string) ($_POST['id'] ?? ''));
            $name = trim((string) ($_POST['name'] ?? ''));
            if ($name === '') {
                $name = $id;
            }
            $kind = strtolower(trim((string) ($_POST['kind'] ?? 'application')));
            if (!in_array($kind, ['application', 'host', 'module'], true)) {
                fail('Invalid project kind.');
            }
            $upload = $_FILES['archive'] ?? null;
            if (!is_array($upload)) {
                if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0 && $_POST === []) {
                    fail('The upload exceeds the PHP post_max_size limit. Increase it or use a smaller ZIP.', 413);
                }
                fail('Missing ZIP archive.');
            }
            $uploadError = (int) ($upload['error'] ?? UPLOAD_ERR_NO_FILE);
            if ($uploadError !== UPLOAD_ERR_OK) {
                $messages = [
                    UPLOAD_ERR_INI_SIZE => 'The ZIP exceeds the PHP upload_max_filesize limit.',
                    UPLOAD_ERR_FORM_SIZE => 'The ZIP exceeds the form size limit.',
                    UPLOAD_ERR_PARTIAL => 'The ZIP upload was interrupted.',
                    UPLOAD_ERR_NO_FILE => 'Choose a ZIP archive.',
                    UPLOAD_ERR_NO_TMP_DIR => 'The PHP temporary folder is missing.',
                    UPLOAD_ERR_CANT_WRITE => 'PHP cannot write the uploaded file.',
                    UPLOAD_ERR_EXTENSION => 'A PHP extension stopped the upload.',
                ];
                fail($messages[$uploadError] ?? 'Upload failed.', 400);
            }
            $tmp = (string) ($upload['tmp_name'] ?? '');
            if (!is_uploaded_file($tmp)) {
                fail('Invalid upload.');
            }
            $uploadSize = (int) ($upload['size'] ?? 0);
            if ($uploadSize <= 0 || $uploadSize > 20 * 1024 * 1024) {
                fail('The ZIP must be between 1 byte and 20 MB.', 413);
            }

            $dir = projectDir($projectsDir, $id);
            if (is_dir($dir)) {
                fail('Project already exists.', 409);
            }
            if (!mkdir($dir, 0775, true) && !is_dir($dir)) {
                fail('Cannot create the project folder.', 500);
            }

            try {
                $zip = SimpleZip::open($tmp);
            } catch (Throwable $error) {
                removeDirectory($dir);
                fail($error->getMessage());
            }
            try {
                $entries = [];
                $names = $zip->entries();
                if (count($names) > 2000) {
                    throw new RuntimeException('The ZIP has too many files.');
                }
                foreach ($names as $rawName) {
                    if ($rawName === '' || str_ends_with(str_replace('\\', '/', $rawName), '/')) {
                        continue;
                    }
                    $relative = importEntryPath($rawName);
                    if ($relative === null || importPathIgnored($relative) || !importEntryAllowed($relative)) {
                        continue;
                    }
                    $stat = $zip->stat($rawName);
                    if ($stat === null) {
                        continue;
                    }
                    $entries[] = [
                        'name' => $rawName,
                        'path' => $relative,
                        'size' => (int) $stat['size'],
                    ];
                }
                if ($entries === []) {
                    throw new RuntimeException('No project files found in the ZIP.');
                }

                $root = importRootPrefix($entries);
                $totalSize = 0;
                $copied = 0;
                $skippedSources = 0;
                foreach ($entries as $entry) {
                    if ($root !== '' && !str_starts_with($entry['path'], $root)) {
                        $extension = strtolower((string) pathinfo($entry['path'], PATHINFO_EXTENSION));
                        if (in_array($extension, ['lpr', 'lfm', 'pas'], true)) {
                            $skippedSources++;
                        }
                        continue;
                    }
                    $relative = $root === '' ? $entry['path'] : substr($entry['path'], strlen($root));
                    if ($relative === '') {
                        continue;
                    }
                    if ($entry['size'] > 10 * 1024 * 1024) {
                        throw new RuntimeException("{$relative} exceeds the 10 MB file limit.");
                    }
                    $totalSize += $entry['size'];
                    if ($totalSize > 50 * 1024 * 1024) {
                        throw new RuntimeException('The extracted project exceeds the 50 MB limit.');
                    }
                    $content = $zip->read($entry['name']);
                    $target = $dir . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relative);
                    $parent = dirname($target);
                    if (!is_dir($parent) && !mkdir($parent, 0775, true) && !is_dir($parent)) {
                        throw new RuntimeException("Cannot create the folder for {$relative}.");
                    }
                    if (file_put_contents($target, $content) === false) {
                        throw new RuntimeException("Cannot write {$relative}.");
                    }
                    $copied++;
                }
                if ($copied === 0) {
                    throw new RuntimeException('No project files found in the ZIP.');
                }

                $imported = importProjectSettings($dir);
                $inferred = inferProjectConfig($dir, $id, $name, $kind, $imported);
                if ($skippedSources > 0) {
                    array_unshift(
                        $inferred['warnings'],
                        "{$skippedSources} source files outside the detected project folder were ignored.",
                    );
                }
                writeProject($dir, $inferred['config']);
                $project = readProject($dir, $id);
                echo json_encode([
                    'ok' => true,
                    'project' => $project,
                    'summary' => [
                        'kind' => $inferred['config']['kind'],
                        'forms' => count($inferred['config']['forms']),
                        'units' => count($inferred['config']['units']),
                        'program' => $inferred['config']['program'],
                    ],
                    'warnings' => $inferred['warnings'],
                ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            } catch (Throwable $error) {
                removeDirectory($dir);
                fail($error->getMessage(), 400);
            }
            break;
        }

        default:
            fail('Unknown action.', 404);
    }
} catch (Throwable $e) {
    fail($e->getMessage(), 500);
}
