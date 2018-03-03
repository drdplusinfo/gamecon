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
$casOdpoctu = null;

$t->assign([
  'prvniVlna' => (new DateTimeCz(REG_GC_OD))->format('j.n.'),
  'druhaVlna' => (new DateTimeCz(DRUHA_VLNA))->format('j.n.'),
  'tretiVlna' => (new DateTimeCz(TRETI_VLNA))->format('j.n.'),
  'zacatekGC' => (new DateTimeCz(GC_BEZI_OD))->format('j.n.'),
]);

if ($zacatekRoku < $aktualniDatum && $aktualniDatum < $zacatekRegu) { // Datum mezi začátkem roku a spuštění registrace
  $t->parse('titulka.uzkyOdpocet');
  $t->parse('titulka.predZacatkemRegu');
  $t->parse('titulka.uzkyVlny.predZacatkemReguVlny');
  $t->parse('titulka.uzkyVlny');
  $casOdpoctu = REG_GC_OD;
}
elseif ($zacatekRegu < $aktualniDatum && $aktualniDatum < $prvniVlna) { // Datum mezi začátkem spuštěním registrace a první vlnou aktivit
  $t->parse('titulka.uzkyOdpocet');
  $t->parse('titulka.predPrvniVlnou');
  $t->parse('titulka.uzkyVlny.predPrvniVlnouVlny');
  $t->parse('titulka.uzkyVlny');
  $casOdpoctu = REG_AKTIVIT_OD;
}
elseif ($prvniVlna < $aktualniDatum && $aktualniDatum < $druhaVlna) { // Datum mezi první a druhou vlnou aktivit
  $t->parse('titulka.uzkyOdpocet');
  $t->parse('titulka.predDruhouVlnouOdpocet');
  $t->parse('titulka.uzkyVlny.predDruhouVlnouVlny');
  $t->parse('titulka.uzkyVlny');
  $casOdpoctu = DRUHA_VLNA;
}
elseif ($druhaVlna < $aktualniDatum && $aktualniDatum < $tretiVlna) { // Datum mezi druhou a třetí vlnou aktivit
  $t->parse('titulka.uzkyOdpocet');
  $t->parse('titulka.predTretiVlnou');
  $t->parse('titulka.uzkyVlny.predTretiVlnouVlny');
  $t->parse('titulka.uzkyVlny');
  $casOdpoctu = TRETI_VLNA;
}
elseif ($tretiVlna < $aktualniDatum && $aktualniDatum < $zacatekGC) { // Datum mezi třetí vlnou aktivit a začátkem GC
  $t->parse('titulka.uzkyOdpocet');
  $t->parse('titulka.predZacatkemGC');
  $t->parse('titulka.uzkyVlny.predZacatkemGCVlny');
  $t->parse('titulka.uzkyVlny');
  $casOdpoctu = GC_BEZI_OD;
}
elseif ($zacatekGC < $aktualniDatum && $aktualniDatum < $konecGC) { // Datum mezi začátkem GC a koncem GC
  $t->parse('titulka.sirokyOdpocet');
  $t->parse('titulka.vPrubehuGC');
}
elseif ($konecGC < $aktualniDatum) { // Datum mezi koncem GC a začátkem roku
  $t->parse('titulka.sirokyOdpocet');
  $t->parse('titulka.poKonciGC');
}

/* ------------------------------ PROMĚNNÉ DO INFOPRUHU ------------------------------*/
$t->assign('casOdpoctu',$casOdpoctu);

/* ------------------------------ ROZŠÍŘENÉ INFO ------------------------------*/
$poleRozsireneInfo = [
  ['Akce<br> pro všechny', 'jsme otevření, vítáme všechny mezi 0 a 99 lety a tykáme si', 'akce_pro_vsechny.svg'],
  ['Festival<br> aktivní zábavy', 'na všech aktivitách je potřeba zapojit tělo, mozek či obojí', 'festival_aktivni_zabavy.svg'],
  ['Volná<br> deskoherna', 'stovky deskových her zdarma k vyzkoušení, hry Vás rádi naučíme', 'volna_deskoherna.svg'],
];
foreach($poleRozsireneInfo as $polozka) {
  $t->assign([
    'nadpisRozsireneInfo' => $polozka[0],
    'popisRozsireneInfo' => $polozka[1],
    'ikonaRozsireneInfo' => $polozka[2],
  ]);
  $t->parse('titulka.polozkaRozsireneInfo');
}

/* ------------------------------ DOPORUČENÉ AKTIVITY ------------------------------*/
$poleAktivit = Aktivita::zDoporucenych();

foreach ($poleAktivit as $a) {
  $t->assign([
    'a'               => $a,
    'linieAktivity'   => $a->typ()->nazev(),
    'denAktivity'     => $a->zacatek() ? $a->zacatek()->format('l').': ' : '',
    'casAktivity'     => $a->zacatek() ? $a->zacatek()->format('H:i') : '',
  ]);
  if($a->zacatek()) {
    $t->parse('titulka.aktivita.info.termin');
    $t->parse('titulka.aktivita.info');
  }
  $t->parse('titulka.aktivita');
}

/* ------------------------------ PARTNEŘI ------------------------------*/
// TODO Nedělat jako modul ale jako include jedné šablony do druhé
Modul::bezPaticky(true);
$t->assign('partneri', Modul::zNazvu('partneri')->spust()->vystup());



/* --------------------------- STARÉ: POŘEŠIT AŽ S PŘIHLÁŠENÝM UŽIVATELEM ----------------------------------*/
/*
if($u && $u->gcPrihlasen() && REG_GC)   $t->parse('titulka.prihlasen');
elseif($u && REG_GC)                    $t->parse('titulka.neprihlasen');
else                                    $t->parse('titulka.info'); */
$t->assign([
  'menu'      =>  $menu,
  'a'         =>  $u ? $u->koncA() : '', //koncovka u slovesa (v šabloně užito jako nepřihlášen{a})
]);
$t->parse('titulka.info');

if(PROGRAM_VIDITELNY)   $t->parse('titulka.program');
else                    $t->parse('titulka.pripravujeme');

$this->info()
  ->titulek('GameCon – největší festival nepočítačových her')
  ->nazev('GameCon – největší festival nepočítačových her')
  ->popis('GameCon je největší festival nepočítačových her v České republice, který se každoročně koná třetí víkend v červenci. Opět se můžete těšit na desítky RPGček, deskovek, larpů, akčních her, wargaming, přednášky, klání v Příbězích Impéria, tradiční mistrovství v DrD a v neposlední řadě úžasné lidi a vůbec zážitky, které ve vás přetrvají minimálně do dalšího roku.')
  ->url(URL_WEBU);
