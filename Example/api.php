<?php
/**
 * api.php — Test endpoint for TWWebDBTable progressive loading
 *
 * Usage:
 *   GET api.php?table=Clienti                          → full array
 *   GET api.php?table=Clienti&offset=0&limit=100         → { "data": [...100], "total": 5000 }
 *   GET api.php?table=Clienti&offset=0&limit=100&count=10000  → 10000 records total
 *
 * Deterministic generation: same offset → same data, based on seeded random.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$table   = $_GET['table']  ?? 'Clienti';
$offset  = (int)($_GET['offset'] ?? -1);
$limit   = (int)($_GET['limit']  ?? 0);
$count   = (int)($_GET['count']  ?? 5000);
$paged   = $offset >= 0 && $limit > 0;

// Seeded random for deterministic generation per offset
function seeded_shuffle(array &$arr, int $seed): void {
    mt_srand($seed);
    $len = count($arr);
    for ($i = $len - 1; $i > 0; $i--) {
        $j = mt_rand(0, $i);
        [$arr[$i], $arr[$j]] = [$arr[$j], $arr[$i]];
    }
}

function generateRows(int $offset, int $limit, int $total): array {
    $nomi    = ['Marco','Giulia','Andrea','Sofia','Luca','Alessia','Matteo','Chiara',
                'Davide','Elena','Simone','Francesca','Paolo','Martina','Roberto','Valentina'];
    $cognomi = ['Rossi','Bianchi','Verdi','Neri','Gialli','Ferri','Esposito','Romano',
                'Colombo','Ricci','Marino','Greco','Bruno','Costa','Giordano','Mancini'];
    $citta   = ['Milano','Roma','Napoli','Torino','Palermo','Genova','Bologna','Firenze'];

    $result = [];
    $end = min($offset + $limit, $total);

    for ($i = $offset + 1; $i <= $end; $i++) {
        // Deterministic pick based on row index
        $ni = $i % count($nomi);
        $ci = ($i * 3 + 1) % count($cognomi);
        $ct = ($i * 7 + 2) % count($citta);

        $result[] = [
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
    return $result;
}

// -------------------------------------------------------
// Output
// -------------------------------------------------------

if ($paged) {
    $rows = generateRows((int)$offset, (int)$limit, (int)$count);
    echo json_encode([
        'data'  => $rows,
        'total' => (int)$count
    ], JSON_UNESCAPED_UNICODE);
} else {
    // Full load (not recommended for large datasets)
    $rows = generateRows(0, (int)$count, (int)$count);
    echo json_encode($rows, JSON_UNESCAPED_UNICODE);
}
