<?php
declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'ZipWriter.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'SimpleZip.php';

function check(bool $condition, string $message): void
{
    if (!$condition) {
        fwrite(STDERR, "FAIL: {$message}\n");
        exit(1);
    }
}

$files = [
    'index.html' => "<!doctype html>\n<html><body>ok</body></html>\n",
    'assets/app.js' => str_repeat("console.log('wcl');\n", 200),
    'empty.txt' => '',
];
$zip = new ZipWriter();
$zip->add('index.html', $files['index.html']);
$zip->add('assets/app.js', $files['assets/app.js']);
$zip->add('empty.txt', '');
$data = $zip->finish();
check(str_starts_with($data, "PK\x03\x04"), 'ZIP local header');

$temp = tempnam(sys_get_temp_dir(), 'wclzip');
check($temp !== false, 'temporary file');
check(file_put_contents($temp, $data) !== false, 'write temporary ZIP');
try {
    $reader = SimpleZip::open($temp);
    $names = $reader->entries();
    sort($names);
    check($names === ['assets/app.js', 'empty.txt', 'index.html'], 'entry names');
    foreach ($files as $name => $content) {
        check($reader->read($name) === $content, "round-trip {$name}");
    }
} finally {
    @unlink($temp);
}

$invalid = new ZipWriter();
try {
    $invalid->add('../escape.txt', 'nope');
    check(false, 'path traversal must be rejected');
} catch (InvalidArgumentException $error) {
    check(true, 'path traversal rejected');
}

echo "ZIP writer tests passed.\n";
