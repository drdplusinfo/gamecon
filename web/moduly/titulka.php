<?php

/* ------------------------------ INFOPRUH ------------------------------*/
$aktualniDatum = time();
$zacatekRoku = strtotime(ROK.'-01'.'-01');
$zacatekRegu = strtotime(REG_GC_OD);
$prvniVlna = strtotime(REG_AKTIVIT_OD);
$druhaVlna = strtotime(DRUHA_VLNA);
$tretiVlna = strtotime(TRETI_VLNA);
$zacatekGC = strtotime(GC_BEZI_OD);
$konecGC = strtotime(GC_BEZI_DO);
$cas = null;

//TO-DO: Check na stránku infopruh v databázi (stránky)
if ($zacatekRoku < $aktualniDatum && $aktualniDatum < $zacatekRegu) { // Datum mezi začátkem roku a spuštění registrace
  $t->parse('titulka.predZacatkemRegu');
  $cas = REG_GC_OD;
}
elseif ($zacatekRegu < $aktualniDatum && $aktualniDatum < $prvniVlna) { // Datum mezi začátkem spuštěním registrace a první vlnou aktivit
  $t->parse('titulka.predPrnvniVlnou');
  $cas = REG_AKTIVIT_OD;
}
elseif ($prvniVlna < $aktualniDatum && $aktualniDatum < $druhaVlna) { // Datum mezi první a druhou vlnou aktivit
  $t->parse('titulka.predDruhouVlnou');
  $cas = DRUHA_VLNA;
}
elseif ($druhaVlna < $aktualniDatum && $aktualniDatum < $tretiVlna) { // Datum mezi druhou a třetí vlnou aktivit
  $t->parse('titulka.predTretiVlnou');
  $cas = TRETI_VLNA;
}
elseif ($tretiVlna < $aktualniDatum && $aktualniDatum < $zacatekGC) { // Datum mezi třetí vlnou aktivit a začátkem GC
  $t->parse('titulka.predZacatkemGC');
  $cas = GC_BEZI_OD;
}
elseif ($zacatekGC < $aktualniDatum && $aktualniDatum < $konecGC) { // Datum mezi začátkem GC a koncem GC
  $t->parse('titulka.vPrubehuGC');
}
elseif ($konecGC < $aktualniDatum) { // Datum mezi koncem GC a začátkem roku
  $t->parse('titulka.poKonciGC');
}

/* ------------------------------ DOPORUČENÉ AKTIVITY ------------------------------*/
$poleAktivit = Aktivita::zDoporucenych();
echo '<h1>'.count($poleAktivit).'</h1>';

foreach ($poleAktivit as $value) {
  $cas = substr($value->denCas(), 0, strpos($value->denCas(), "–"));
  $t->assign([
    'obrazek' => $value->obrazek(),
    'linie'   => $value->typ()->nazev(),
    'nazev'   => $value->nazev(),
    'kratkyPopis'   => $value->kratkyPopis(),
    'cas'     => $cas
  ]);
  $t->parse('titulka.aktivita');
}





/* ------------------------------ PROMĚNNÉ DO ŠABLONY ------------------------------*/

$t->assign([
  'menu'      =>  $menu,
  'a'         =>  $u ? $u->koncA() : '', //koncovka u slovesa (v šabloně užito jako nepřihlášen{a})
  'cas'       =>  $cas,
  'prvniVlna' => (new DateTimeCz(REG_GC_OD))->formatBlog(),
  'druhaVlna' => (new DateTimeCz(DRUHA_VLNA))->formatBlog(),
  'tretiVlna' => (new DateTimeCz(TRETI_VLNA))->formatBlog()
]);

/* --------------------------- STARÉ: POŘEŠIT AŽ S PŘIHLÁŠENÝM UŽIVATELEM ----------------------------------*/
/*
if($u && $u->gcPrihlasen() && REG_GC)   $t->parse('titulka.prihlasen');
elseif($u && REG_GC)                    $t->parse('titulka.neprihlasen');
else                                    $t->parse('titulka.info'); */
$t->parse('titulka.info');

if(PROGRAM_VIDITELNY)   $t->parse('titulka.program');
else                    $t->parse('titulka.pripravujeme');

$this->info()
  ->titulek('GameCon – největší festival nepočítačových her')
  ->nazev('GameCon – největší festival nepočítačových her')
  ->popis('GameCon je největší festival nepočítačových her v České republice, který se každoročně koná třetí víkend v červenci. Opět se můžete těšit na desítky RPGček, deskovek, larpů, akčních her, wargaming, přednášky, klání v Příbězích Impéria, tradiční mistrovství v DrD a v neposlední řadě úžasné lidi a vůbec zážitky, které ve vás přetrvají minimálně do dalšího roku.')
  ->url(URL_WEBU);
