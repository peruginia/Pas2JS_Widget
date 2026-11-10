<?php
declare(strict_types=1);

/**
 * Minimal, read-only ZIP reader.
 *
 * Only the central directory and the stored/deflate entries are decoded; the
 * PHP zip extension is not required. ZIP64, encryption, multi-disk archives
 * and compression methods other than store/deflate are rejected.
 */
final class SimpleZip
{
    private string $data;

    /** @var array<string, array{offset: int, compressed: int, size: int, method: int, flags: int, crc: int}> */
    private array $entries = [];

    public static function open(string $file): self
    {
        if (!function_exists('gzinflate')) {
            throw new RuntimeException('The PHP zlib extension is required to import a project.');
        }
        $data = file_get_contents($file);
        if ($data === false) {
            throw new RuntimeException('Cannot read the ZIP archive.');
        }
        return new self($data);
    }

    private function __construct(string $data)
    {
        $this->data = $data;
        $this->readCentralDirectory();
    }

    /** @return list<string> */
    public function entries(): array
    {
        return array_keys($this->entries);
    }

    /** @return array{offset: int, compressed: int, size: int, method: int, flags: int, crc: int}|null */
    public function stat(string $name): ?array
    {
        return $this->entries[$name] ?? null;
    }

    public function read(string $name): string
    {
        $entry = $this->entries[$name] ?? null;
        if ($entry === null) {
            throw new RuntimeException("Entry {$name} not found in the ZIP archive.");
        }
        $offset = $entry['offset'];
        $length = strlen($this->data);
        if ($offset < 0 || $offset + 30 > $length || substr($this->data, $offset, 4) !== "\x50\x4b\x03\x04") {
            throw new RuntimeException("Invalid local header for {$name}.");
        }
        $local = unpack(
            'vversion/vflags/vmethod/vtime/vdate/Vcrc/Vcompressed/Vsize/vnameLength/vextraLength',
            substr($this->data, $offset + 4, 26),
        );
        if ($local === false) {
            throw new RuntimeException("Invalid local header for {$name}.");
        }
        $dataOffset = $offset + 30 + $local['nameLength'] + $local['extraLength'];
        $compressed = $entry['compressed'];
        if ($compressed < 0 || $dataOffset + $compressed > $length) {
            throw new RuntimeException("Truncated ZIP entry {$name}.");
        }
        if ($compressed === 0 && $entry['size'] === 0) {
            return '';
        }

        $raw = substr($this->data, $dataOffset, $compressed);
        if ($entry['method'] === 0) {
            $content = $raw;
        } elseif ($entry['method'] === 8) {
            $content = @gzinflate($raw);
            if ($content === false) {
                throw new RuntimeException("Cannot inflate {$name}.");
            }
        } else {
            throw new RuntimeException("Unsupported compression for {$name}.");
        }
        if (strlen($content) !== $entry['size']) {
            throw new RuntimeException("Unexpected size for {$name}.");
        }
        if ((crc32($content) & 0xFFFFFFFF) !== ($entry['crc'] & 0xFFFFFFFF)) {
            throw new RuntimeException("Checksum mismatch for {$name}.");
        }
        return $content;
    }

    private function readCentralDirectory(): void
    {
        $length = strlen($this->data);
        if ($length < 22) {
            throw new RuntimeException('Not a ZIP archive.');
        }
        $searchStart = max(0, $length - 65557);
        $position = strrpos(substr($this->data, $searchStart), "\x50\x4b\x05\x06");
        if ($position === false) {
            throw new RuntimeException('Not a ZIP archive.');
        }
        $end = $searchStart + $position;
        if ($end + 22 > $length) {
            throw new RuntimeException('Invalid ZIP end record.');
        }
        $record = unpack(
            'vdisk/vcdDisk/ventriesOnDisk/ventries/VcdSize/VcdOffset/vcommentLength',
            substr($this->data, $end + 4, 18),
        );
        if ($record === false) {
            throw new RuntimeException('Invalid ZIP end record.');
        }
        if ($record['disk'] !== 0 || $record['cdDisk'] !== 0 || $record['entriesOnDisk'] !== $record['entries']) {
            throw new RuntimeException('Multi-disk ZIP archives are not supported.');
        }
        if ($record['entries'] === 0xFFFF || $record['cdSize'] === 0xFFFFFFFF || $record['cdOffset'] === 0xFFFFFFFF) {
            throw new RuntimeException('ZIP64 archives are not supported.');
        }

        $offset = $record['cdOffset'];
        for ($index = 0; $index < $record['entries']; $index++) {
            if ($offset + 46 > $length || substr($this->data, $offset, 4) !== "\x50\x4b\x01\x02") {
                throw new RuntimeException('Invalid ZIP central directory.');
            }
            $header = unpack(
                'vversionMade/vversionNeeded/vflags/vmethod/vtime/vdate/Vcrc/Vcompressed/Vsize'
                . '/vnameLength/vextraLength/vcommentLength/vdiskStart/vinternal/Vexternal/Voffset',
                substr($this->data, $offset + 4, 42),
            );
            if ($header === false) {
                throw new RuntimeException('Invalid ZIP central directory.');
            }
            $name = substr($this->data, $offset + 46, $header['nameLength']);
            if ($name === false || strlen($name) !== $header['nameLength']) {
                throw new RuntimeException('Invalid ZIP entry name.');
            }
            $offset += 46 + $header['nameLength'] + $header['extraLength'] + $header['commentLength'];

            if (($header['flags'] & 0x0001) !== 0) {
                throw new RuntimeException('Encrypted ZIP entries are not supported.');
            }
            if (!in_array($header['method'], [0, 8], true)) {
                throw new RuntimeException('Unsupported ZIP compression method.');
            }
            if ($header['compressed'] === 0xFFFFFFFF
                || $header['size'] === 0xFFFFFFFF
                || $header['offset'] === 0xFFFFFFFF
            ) {
                throw new RuntimeException('ZIP64 archives are not supported.');
            }
            if (str_ends_with(str_replace('\\', '/', $name), '/')) {
                continue;
            }
            $this->entries[$name] = [
                'offset' => $header['offset'],
                'compressed' => $header['compressed'],
                'size' => $header['size'],
                'method' => $header['method'],
                'flags' => $header['flags'],
                'crc' => $header['crc'],
            ];
        }
    }
}
