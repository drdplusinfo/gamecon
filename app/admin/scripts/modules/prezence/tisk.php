<?php

/** 
 * Přehled aktivit, které se mají tisknout, a link, který je vytiskne
 *
 * nazev: Tisk prezenčních listů
 * pravo: 103
 */

$t = new XTemplate('tisk.xtpl');

require('_casy.php'); // vhackování vybírátka času
$t->assign('casy', _casy($zacatek, true));

$aktivity = $zacatek ? Aktivita::zRozmezi($zacatek, $zacatek) : array();
$ids = array();

foreach($aktivity as $a) {
  $ids[] = $a->id();
  $problem = false;
  $t->assign('a', $a);
  foreach($a->prihlaseni() as $uc) {
    if(!$uc->gcPritomen()) {
      $t->assign('u', $uc);
      $t->parse('tisk.aktivity.aktivita.nepritomen');
      $problem = true;
    }
  }
  $t->parse('tisk.aktivity.aktivita.' . ($problem ? 'problem' : 'ok'));
  $t->parse('tisk.aktivity.aktivita');
}

$t->assign('ids', implode(',', $ids));

if($aktivity) $t->parse('tisk.aktivity');
if($zacatek && !$aktivity) $t->parse('tisk.zadneAktivity');
if(!$zacatek) $t->parse('tisk.nevybrano');
$t->parse('tisk');
$t->out('tisk');
