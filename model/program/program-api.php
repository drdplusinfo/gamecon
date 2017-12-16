<?php

class ProgramApi implements JsPhpApi {

  /**
   * Vrátí detail aktivity.
   */
  function detail($aktivitaId) {
    $necoSpocitat = 'něco spočítat zde.';

    return [
      'popis'     =>  rand(0,1) ? 'Moc dobrá aktivita. Doporučuji.' : 'Sračka.',
      'mistnost'  =>  ['nazev' => 'Holobyt na AB/B/2 v kukani.', 'dvere' => 123],
      'hraci'     =>  ['Pepa', 'Jarin'],
    ];
  }

  /**
   * Přihlásí aktuálního uživatele na aktivitu.
   */
  function prihlas($aktivitaId) {
    throw new Chyba('v daném čase už máš jinou aktivitu.');
  }

  /**
   * Jenom metoda s víc parametrama na test.
   */
  function test($foo, $bar, $baz) {
    return " $foo $bar $baz ";
  }

}
