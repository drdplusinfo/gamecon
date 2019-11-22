<?php
require_once __DIR__ . '/sdilene-hlavicky.php';

$report = Report::zSql(<<<SQL
SELECT u.jmeno_uzivatele, u.prijmeni_uzivatele, u.email1_uzivatele, a.typ, at.typ_1pmn
FROM akce_seznam a
JOIN akce_organizatori ao ON ao.id_akce = a.id_akce
JOIN uzivatele_hodnoty u ON u.id_uzivatele = ao.id_uzivatele
JOIN akce_typy at ON at.id_typu = a.typ
WHERE a.rok = $1
GROUP BY u.id_uzivatele, a.typ
ORDER BY a.typ, u.jmeno_uzivatele, u.prijmeni_uzivatele
SQL
  , [ROK]
);
$report->tFormat(get('format'));
