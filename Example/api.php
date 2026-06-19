<?php
/**
 * api.php — Test endpoint for TWWebDBTable progressive loading
 *
 * Usage:
 *   GET api.php?table=Clienti&offset=0&limit=100
 *   GET api.php?table=Clienti&offset=0&limit=100&filter=marco
 *   GET api.php?table=Clienti&offset=0&limit=100&sort=Nome&order=asc
 *   GET api.php?table=Clienti&offset=0&limit=100&filter=marco&sort=Cognome&order=desc
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$table   = $_GET['table']  ?? 'Clienti';
$offset  = (int)($_GET['offset'] ?? -1);
$limit   = (int)($_GET['limit']  ?? 0);
$count   = (int)($_GET['count']  ?? 5000);
$filter  = $_GET['filter'] ?? '';
$sort    = $_GET['sort']   ?? '';
$order   = strtolower($_GET['order'] ?? 'asc');
$paged   = $offset >= 0 && $limit > 0;

if ($order !== 'desc') $order = 'asc';

function generateRow(int $i): array {
    static $nomi    = ['Marco','Giulia','Andrea','Sofia','Luca','Alessia','Matteo','Chiara',
                       'Davide','Elena','Simone','Francesca','Paolo','Martina','Roberto','Valentina'];
    static $cognomi = ['Rossi','Bianchi','Verdi','Neri','Gialli','Ferri','Esposito','Romano',
                       'Colombo','Ricci','Marino','Greco','Bruno','Costa','Giordano','Mancini'];
    static $citta   = ['Milano','Roma','Napoli','Torino','Palermo','Genova','Bologna','Firenze'];

    $ni = $i % count($nomi);
    $ci = ($i * 3 + 1) % count($cognomi);
    $ct = ($i * 7 + 2) % count($citta);

    return [
        'ID'        => $i,
        'Nome'      => $nomi[$ni],
        'Cognome'   => $cognomi[$ci],
        'Citta'     => $citta[$ct],
        'Eta'       => 20 + ($i * 13) % 51,
        'Email'     => strtolower($nomi[$ni] . '.' . $cognomi[$ci] . '@example.com'),
        'Importo'   => round((($i * 173) % 99773) / 100 + 1, 2),
        'Attivo'    => ($i % 3 !== 0) ? 'Sì' : 'No',
        'DataReg'   => date('Y-m-d', strtotime('-' . ($i * 7 % 3650) . ' days')),
    ];
}

function rowMatches(array $row, string $filter): bool {
    if ($filter === '') return true;
    $f = mb_strtolower($filter, 'UTF-8');
    foreach ($row as $value) {
        if (mb_strpos(mb_strtolower((string)$value, 'UTF-8'), $f) !== false) {
            return true;
        }
    }
    return false;
}

// Build all matching rows (only when filtering or sorting)
$allMatches = [];
$matchCount = 0;

if ($filter !== '' || $sort !== '') {
    for ($i = 1; $i <= $count; $i++) {
        $row = generateRow($i);
        if (rowMatches($row, $filter)) {
            $allMatches[] = $row;
            $matchCount++;
        }
    }
    // Sort if requested
    if ($sort !== '') {
        usort($allMatches, function($a, $b) use ($sort, $order) {
            $va = $a[$sort] ?? '';
            $vb = $b[$sort] ?? '';
            if (is_numeric($va) && is_numeric($vb)) {
                return $order === 'asc' ? $va - $vb : $vb - $va;
            }
            $cmp = strcmp((string)$va, (string)$vb);
            return $order === 'asc' ? $cmp : -$cmp;
        });
    }
    // Paginate
    if ($paged) {
        $allMatches = array_slice($allMatches, $offset, $limit);
    }
} else {
    // No filter/sort: generate only the requested page
    if ($paged) {
        $end = min($offset + $limit, $count);
        for ($i = $offset + 1; $i <= $end; $i++) {
            $allMatches[] = generateRow($i);
        }
        $matchCount = $count;
    } else {
        for ($i = 1; $i <= $count; $i++) {
            $allMatches[] = generateRow($i);
        }
    }
}

// Output
if ($paged) {
    echo json_encode([
        'data'  => $allMatches,
        'total' => $filter !== '' ? $matchCount : (int)$count
    ], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode($allMatches, JSON_UNESCAPED_UNICODE);
}
