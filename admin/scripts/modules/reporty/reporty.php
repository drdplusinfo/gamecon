<?php

/**
 * Stránka s linky na reporty
 *
 * Reporty jsou obecně neoptimalizovaný kód (cyklické db dotazy apod.), nepočítá
 * se s jejich časově kritickým použitím.
 *
 * nazev: Reporty
 * pravo: 104
 */

$t = new XTemplate('reporty.xtpl');

$univerzalniReporty = dbFetchAll(<<<SQL
SELECT reporty.*, reporty_log_pouziti.id_uzivatele AS id_posledniho_uzivatele, reporty_log_pouziti.cas_pouziti AS cas_posledniho_pouziti,
       reporty_log_pouziti.casova_zona AS casova_zona_posledniho_pouziti
FROM
(SELECT skript, nazev, format_csv, format_html,
       COUNT(reporty_log_pouziti.id) AS pocet_pouziti, MAX(reporty_log_pouziti.id) AS id_posledniho_logu
FROM reporty
LEFT JOIN reporty_log_pouziti ON reporty.id = reporty_log_pouziti.id_reportu
LEFT JOIN uzivatele_hodnoty ON reporty_log_pouziti.id_uzivatele = uzivatele_hodnoty.id_uzivatele
WHERE reporty.viditelny
GROUP BY reporty.id) AS reporty
LEFT JOIN reporty_log_pouziti ON id = id_posledniho_logu
SQL
);

foreach ($univerzalniReporty as $r) {
  $pouziti = [
    'jmeno_posledniho_uzivatele' => $r['id_posledniho_uzivatele']
      ? (new Uzivatel(dbOneLine('SELECT * FROM uzivatele_hodnoty WHERE id_uzivatele=' . $r['id_posledniho_uzivatele'])))->jmenoNick()
      : '',
    'cas_posledniho_pouziti' => $r['cas_posledniho_pouziti']
      ? new DateTime($r['cas_posledniho_pouziti'], new DateTimeZone($r['casova_zona_posledniho_pouziti']))
      : '',
    'pocet_pouziti' => $r['pocet_pouziti']
  ];
  $kontext = [
    'nazev' => str_replace('{ROK}', ROK, $r['nazev']),
    'html' => $r['format_html']
      ? '<a href="reporty/' . $r['skript'] . (strpos('?', $r['skript']) === false ? '?' : '&') . 'format=html" target="_blank">html</a>'
      : '',
    'csv' => $r['format_csv']
      ? '<a href="reporty/' . $r['skript'] . (strpos('?', $r['skript']) === false ? '?' : '&') . 'format=csv">csv</a>'
      : '',
    'pouziti' => $pouziti
  ];
  $t->assign($kontext);
  $t->parse('reporty.report');
}

$quickReporty = dbFetchAll('SELECT id, nazev FROM reporty_quick ORDER BY nazev');
foreach ($quickReporty as $r) {
  $t->assign($r);
  $t->parse('reporty.quick');
}

$t->parse('reporty');
$t->out('reporty');
