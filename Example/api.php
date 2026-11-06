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

/**
 * Fake login endpoint used by the multi-form demo (Example/uLogin.pas).
 *
 *   GET api.php?cmd=Login&UserName=demo&Password=demo
 *   -> {"result":true,"userId":1,"SessionId":"...","scade":"...","Name":"Demo User"}
 *   -> {"result":false} for anything else
 *
 * The client falls back to a local demo/demo check when the API is not
 * reachable (e.g. the demo is served as static files by GitHub Pages).
 */
$cmd = $_GET['cmd'] ?? '';

if ($cmd === 'Login') {
    $user = $_GET['UserName'] ?? '';
    $pass = $_GET['Password'] ?? '';

    if ($user === 'demo' && $pass === 'demo') {
        echo json_encode([
            'result'    => true,
            'userId'    => 1,
            'SessionId' => bin2hex(random_bytes(8)),
            'scade'     => date('Y-m-d H:i:s', strtotime('+1 day')),
            'Name'      => 'Demo User',
        ]);
    } else {
        echo json_encode(['result' => false]);
    }
    exit;
}

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
        $sortFields = explode(',', $sort);
        usort($allMatches, function($a, $b) use ($sortFields, $order) {
            foreach ($sortFields as $field) {
                $va = $a[$field] ?? '';
                $vb = $b[$field] ?? '';
                if (is_numeric($va) && is_numeric($vb)) {
                    $cmp = $va - $vb;
                } else {
                    $cmp = strcmp((string)$va, (string)$vb);
                }
                if ($cmp !== 0) {
                    return $order === 'asc' ? $cmp : -$cmp;
                }
            }
            return 0;
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
