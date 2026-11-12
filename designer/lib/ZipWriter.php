<?php
declare(strict_types=1);

/**
 * Minimal ZIP writer for project export.
 *
 * Uses zlib's gzdeflate when available and falls back to stored entries, so the
 * API keeps the same zlib-only requirement as the ZIP reader.
 */
final class ZipWriter
{
    private string $local = '';
    private string $central = '';
    private int $offset = 0;
    private int $count = 0;

    public function add(string $name, string $content, ?int $mtime = null): void
    {
        $name = ltrim(str_replace('\\', '/', $name), '/');
        if ($name === '' || strlen($name) > 255 || str_contains($name, "\0")
            || preg_match('#(?:^|/)\.\.?(?:/|$)#', $name)) {
            throw new InvalidArgumentException('Invalid ZIP entry name.');
        }

        $size = strlen($content);
        $crc = crc32($content);
        $compressed = function_exists('gzdeflate') ? gzdeflate($content, 9) : false;
        $method = 8;
        $payload = $compressed;
        if ($compressed === false || strlen($compressed) >= $size) {
            $method = 0;
            $payload = $content;
        }

        [$time, $date] = self::dosTime($mtime ?? time());
        $flags = 0x0800; // UTF-8 names.
        $nameLength = strlen($name);
        $localOffset = $this->offset;

        $this->local .= pack(
            'VvvvvvVVVvv',
            0x04034b50,
            20,
            $flags,
            $method,
            $time,
            $date,
            $crc,
            strlen($payload),
            $size,
            $nameLength,
            0,
        );
        $this->local .= $name . $payload;
        $this->offset += 30 + $nameLength + strlen($payload);

        $this->central .= pack(
            'VvvvvvvVVVvvvvvVV',
            0x02014b50,
            20,
            20,
            $flags,
            $method,
            $time,
            $date,
            $crc,
            strlen($payload),
            $size,
            $nameLength,
            0,
            0,
            0,
            0,
            0,
            $localOffset,
        );
        $this->central .= $name;
        $this->count++;
    }

    public function finish(): string
    {
        $offset = $this->offset;
        $central = $this->central;
        return $this->local . $central . pack(
            'VvvvvVVv',
            0x06054b50,
            0,
            0,
            $this->count,
            $this->count,
            strlen($central),
            $offset,
            0,
        );
    }

    /** @return array{0:int,1:int} DOS time and date. */
    private static function dosTime(int $timestamp): array
    {
        $parts = getdate($timestamp);
        $year = max(1980, min(2107, (int) $parts['year']));
        $time = ((int) $parts['hours'] << 11) | ((int) $parts['minutes'] << 5) | intdiv((int) $parts['seconds'], 2);
        $date = (($year - 1980) << 9) | ((int) $parts['mon'] << 5) | (int) $parts['mday'];
        return [$time, $date];
    }
}
