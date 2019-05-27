<?php

/**
 * Vhackovaný code snippet na zobrazení vybírátka času
 * @param DateTimeCz $zacatekDt do tohoto se přiřadí vybraný čas začátku aktivit
 * @param bool $pred true jestli se má vybírat hodina před vybraným časem a false jestli vybraná hodina
 * @return string html kód vybírátka
 */
function _casy(&$zacatekDt, bool $pred = false) {

  $t = new XTemplate(__DIR__ . '/_casy.xtpl');

  $ted = new DateTimeCz();
  //$ted = new DateTimeCz('2016-07-21 14:10'); // debug
  $t->assign('datum', $ted->format('j.n.'));
  $t->assign('casAktualni', $ted->format('H:i:s'));

  $zacatkyAktivit = Aktivita::zacatkyAktivit(new DateTimeCz(PROGRAM_OD), new DateTimeCz(PROGRAM_DO), 0, ['zacatek']);

  $vybrany = null;
  if (get('cas')) {
    // čas zvolený manuálně
    try {
      $vybrany = new DateTimeCz(get('cas'));
    } catch (Throwable $throwable) {
      $t->assign('chybnyCas', get('cas'));
      $t->parse('casy.chybaCasu');
    }
  } elseif (new DateTime(PROGRAM_OD) <= $ted && $ted <= (new DateTime(PROGRAM_DO))->setTime(23, 59, 59)) {
    // nejspíš GC právě probíhá, čas předvolit automaticky
    $vybrany = clone $ted;
    $vybrany->zaokrouhlitNahoru('H');
    if ($pred) $vybrany->sub(new DateInterval('PT1H'));
    $t->parse('casy.casAuto');
  } else { // zvolíme první cas, ve kterém je nějaká aktivita
    /** @var DateTimeCz $prvniZacatek */
    $prvniZacatek = reset($zacatkyAktivit);
    if ($prvniZacatek) {
      $vybrany = $prvniZacatek;
      $t->parse('casy.casAutoPrvni');
    }
  }

  foreach ($zacatkyAktivit as $zacatek) {
    $t->assign('cas', $zacatek->format('l') . ' ' . $zacatek->format('H') . ':00');
    $t->assign('val', $zacatek->format('Y-m-d') . ' ' . $zacatek->format('H') . ':00');
    $t->assign('sel', $vybrany && $vybrany->format('Y-m-d H') === $zacatek->format('Y-m-d H') ? 'selected' : '');
    $t->parse('casy.cas');
  }

  $zacatekDt = $vybrany ? clone $vybrany : null;

  $t->parse('casy');
  return $t->text('casy');

}
