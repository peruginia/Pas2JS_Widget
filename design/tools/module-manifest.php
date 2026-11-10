<?php
declare(strict_types=1);

/**
 * Builds modules.json for a pas2js project compiled with -Jc-.
 *
 * Usage: php module-manifest.php <output-dir> [manifest-file] [entry-unit]
 *
 * The manifest lists the unit JavaScript files in dependency order. The main
 * file (the "program" or "library" module) is reported separately because it
 * must be loaded first: it contains the RTL (when -Jirtl.js is used) and the
 * entry point. The optional entry unit is the unit a host runs with
 * rtl.run(entry) after loading the modules (the module main is not used by
 * the host).
 */

$dir = rtrim((string) ($argv[1] ?? '.'), "/\\");
$out = (string) ($argv[2] ?? ($dir . DIRECTORY_SEPARATOR . 'modules.json'));
$entry = trim((string) ($argv[3] ?? ''));

if (!is_dir($dir)) {
    fwrite(STDERR, "Directory not found: {$dir}\n");
    exit(1);
}

$modules = [];
$main = null;

foreach (glob($dir . DIRECTORY_SEPARATOR . '*.js') ?: [] as $file) {
    $source = file_get_contents($file);
    if ($source === false) {
        continue;
    }
    if (!preg_match('/rtl\.module\(\s*"([^"]+)"\s*,\s*\[([^\]]*)\]/', $source, $match)) {
        continue;
    }

    $name = $match[1];
    $deps = [];
    foreach (explode(',', $match[2]) as $dep) {
        $dep = trim($dep, " \t\n\r\0\x0B\"");
        if ($dep !== '') {
            $deps[] = $dep;
        }
    }

    $modules[$name] = ['file' => basename($file), 'deps' => $deps];
    if (($name === 'program' || $name === 'library') && $main === null) {
        $main = basename($file);
    }
}

if ($modules === []) {
    fwrite(STDERR, "No rtl.module() calls found in {$dir}\n");
    exit(1);
}

$order = [];
$added = [];
$state = [];
$visit = function (string $name) use (&$visit, &$order, &$added, &$state, $modules): void {
    if (($state[$name] ?? '') !== '') {
        return;
    }
    $state[$name] = 'visiting';
    foreach ($modules[$name]['deps'] as $dep) {
        if (isset($modules[$dep])) {
            $visit($dep);
        }
    }
    $state[$name] = 'done';
    if ($name !== 'program' && $name !== 'library' && !isset($added[$name])) {
        $added[$name] = true;
        $order[] = ['name' => $name, 'file' => $modules[$name]['file']];
    }
};

foreach (array_keys($modules) as $name) {
    $visit($name);
}

$data = [
    'generated' => date('c'),
    'main' => $main,
    'entry' => $entry !== '' ? $entry : null,
    'files' => $order,
];

if (file_put_contents($out, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n") === false) {
    fwrite(STDERR, "Cannot write {$out}\n");
    exit(1);
}

echo "Wrote {$out} (" . count($data['files']) . " modules)\n";
