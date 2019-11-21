<?php
require_once __DIR__ . '/sdilene-hlavicky.php';

$report = Report::zSql(<<<SQL
SELECT a.nazev_akce,at.typ_1p,SUM(IF(uh.pohlavi="f",1,0)) AS "Počet žen(juhů)",SUM(IF(uh.pohlavi="m",1,0)) AS "Počet mužů"
FROM akce_prihlaseni_spec aps
JOIN akce_seznam a ON a.id_akce=aps.id_akce
JOIN akce_typy at ON at.id_typu=a.typ
JOIN uzivatele_hodnoty uh ON uh.id_uzivatele=aps.id_uzivatele
WHERE aps.id_stavu_prihlaseni = 5 AND a.rok = $1
GROUP BY aps.id_akce
ORDER BY COUNT(aps.id_uzivatele) DESC
SQL
  , [ROK]
);
$report->tFormat(get('format'));
