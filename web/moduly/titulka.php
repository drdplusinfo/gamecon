<?php

function infopruh () {
  $aktualniDatum = time();
  $zacatekRoku = strtotime(ROK.'-01'.'-01');
  $zacatekRegu = strtotime(REG_GC_OD);
  $prvniVlna = strtotime(REG_AKTIVIT_OD);
  $druhaVlna = strtotime(DRUHA_VLNA);
  $tretiVlna = strtotime(TRETI_VLNA);
  $zacatekGC = strtotime(GC_BEZI_OD);
  $konecGC = strtotime(GC_BEZI_DO);
  $text = '';
  $cas = null;
  //TO-DO: Check na stránku infopruh v databázi (stránky)
  if ($zacatekRoku < $aktualniDatum && $aktualniDatum < $zacatekRegu) { // Datum mezi začátkem roku a spuštění registrace
    $text = 'Do spuštění <span class="tooltip">registrace<span class="tooltipText">Registrace na GameCon probíhá postupně: Jako první se zaregistrujete na festival samotný a od  <b>'.(new DateTimeCz(REG_GC_OD))->formatBlog().'</b> je možné se registrovat na aktivity samotné. Více se dozvíte v sekci <a href="/jak-to-probiha">Jak to probíhá?</a></span></span> na gamecon zbývá:';
    $cas = REG_GC_OD;
  }
  elseif ($zacatekRegu < $aktualniDatum && $aktualniDatum < $prvniVlna) { // Datum mezi začátkem spuštěním registrace a první vlnou aktivit
    $text = 'Do <span class="tooltip">první vlny <span class="tooltipText">Registraci na aktivity vypouštíme postupně - po vlnách. Další vlny vypustíme <b>'.(new DateTimeCz(DRUHA_VLNA))->formatBlog().' a '.(new DateTimeCz(TRETI_VLNA))->formatBlog().'</b>. Více se dozvíte v sekci <a href="/jak-to-probiha">Jak to probíhá?</a></span></span> aktivit zbývá:';
    $cas = REG_AKTIVIT_OD;
  }
  elseif ($prvniVlna < $aktualniDatum && $aktualniDatum < $druhaVlna) { // Datum mezi první a druhou vlnou aktivit
    $text = 'Do <span class="tooltip">druhé vlny <span class="tooltipText">Registraci na aktivity vypouštíme postupně - po vlnách. Třetí vlnu vypustíme <b>'.(new DateTimeCz(TRETI_VLNA))->formatBlog().'</b>. Více se dozvíte v sekci <a href="/jak-to-probiha">Jak to probíhá?</a></span></span> aktivit zbývá:';
    $cas = DRUHA_VLNA;
  }
  elseif ($druhaVlna < $aktualniDatum && $aktualniDatum < $tretiVlna) { // Datum mezi druhou a třetí vlnou aktivit
    $text = 'Do <span class="tooltip">třetí vlny <span class="tooltipText">Registraci na aktivity vypouštíme postupně - po vlnách. Třetí vlna je poslední, dále budou přibývat aktivity v programu postupně. Více se dozvíte v sekci <a href="/jak-to-probiha">Jak to probíhá?</a></span></span>aktivit zbývá:';
    $cas = TRETI_VLNA;
  }
  elseif ($tretiVlna < $aktualniDatum && $aktualniDatum < $zacatekGC) { // Datum mezi třetí vlnou aktivit a začátkem GC
    $text = 'Do začátku gameconu zbývá:';
    $cas = GC_BEZI_OD;
  }
  elseif ($zacatekGC < $aktualniDatum && $aktualniDatum < $konecGC) { // Datum mezi začátkem GC a koncem GC
    $text = 'GameCon právě probíhá. Ještě stále se můžete zaregistrovat na místě a užít si spoustu her.';
  }
  elseif ($konecGC < $aktualniDatum) { // Datum mezi koncem GC a začátkem roku
    $text = 'GameCon již skončil. Děkujeme všem za atmosféru, kterou jste mu vdechli.';
  }
  return array(
    'text' => $text,
    'cas' => $cas);
}

$t->assign([
  'menu'    =>  $menu,
  'a'       =>  $u ? $u->koncA() : '', //koncovka u slovesa (v šabloně užito jako nepřihlášen{a})
  'infopruh'  => infopruh()["text"],
  'cas'     =>  infopruh()["cas"]
]);

/* --------------------------- POŘEŠIT AŽ S PŘIHLÁŠENÝM UŽIVATELEM ----------------------------------*/
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
