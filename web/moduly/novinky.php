<?php

$start = (int)get('start') ?: 0;
$stranka = 20;

foreach(Novinka::zNejnovejsich($start, $stranka) as $n) {
  if ($n->typ() == Novinka::NOVINKA) {
    $t->assign([
      'novinka' =>  $n,
    ]);
    $n->obrazek() ? $t->parse('novinky.novinka.SObrazkem') : $t->parse('novinky.novinka.BezObrazku');
    $t->parse('novinky.novinka');
  }
}

$t->assign('url', 'novinky?start='.($start + $stranka));
$t->parse('novinky.starsi');

if($start > 0 ) {
  $novejsi = $start - $stranka;
  $t->assign('url', $novejsi <= 0 ? 'novinky' : 'novinky?start='.$novejsi);
  $t->parse('novinky.novejsi');
}

$this->info()->nazev('Novinky');
