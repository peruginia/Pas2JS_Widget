<?php
declare(strict_types=1);

/**
 * Builds modules.json for a pas2js project compiled with -Jc-.
 *
 * Usage: php module-manifest.php <output-dir> [manifest-file] [entry-unit]
 */

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..'
    . DIRECTORY_SEPARATOR . 'designer' . DIRECTORY_SEPARATOR . 'lib'
    . DIRECTORY_SEPARATOR . 'ModuleManifest.php';

$dir = rtrim((string) ($argv[1] ?? '.'), "/\\");
$out = (string) ($argv[2] ?? ($dir . DIRECTORY_SEPARATOR . 'modules.json'));
$entry = trim((string) ($argv[3] ?? ''));

if (!is_dir($dir)) {
    fwrite(STDERR, "Directory not found: {$dir}\n");
    exit(1);
}

try {
    $data = writeModuleManifest($dir, $out, $entry);
} catch (Throwable $error) {
    fwrite(STDERR, $error->getMessage() . "\n");
    exit(1);
}

echo "Wrote {$out} (" . count($data['files']) . " modules)\n";
