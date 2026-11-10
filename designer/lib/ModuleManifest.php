<?php
declare(strict_types=1);

/**
 * Build the manifest of a pas2js project compiled with -Jc-.
 *
 * The manifest lists the unit JavaScript files in dependency order. The main
 * file (the "program" or "library" module) is reported separately because it
 * must be loaded first: it contains the RTL (when -Jirtl.js is used) and the
 * entry point. The optional entry unit is the unit a host runs with
 * rtl.run(entry) after loading the modules (the module main is not used by
 * the host).
 */

/**
 * @return array{generated: string, main: ?string, entry: ?string, files: list<array{name: string, file: string}>}
 */
function collectModuleManifest(string $dir, string $entry = ''): array
{
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
        throw new RuntimeException("No rtl.module() calls found in {$dir}");
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

    return [
        'generated' => date('c'),
        'main' => $main,
        'entry' => $entry !== '' ? $entry : null,
        'files' => $order,
    ];
}

/**
 * @return array{generated: string, main: ?string, entry: ?string, files: list<array{name: string, file: string}>}
 */
function writeModuleManifest(string $dir, string $out, string $entry = ''): array
{
    $data = collectModuleManifest($dir, $entry);
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
    if (file_put_contents($out, $json) === false) {
        throw new RuntimeException("Cannot write {$out}");
    }
    return $data;
}
