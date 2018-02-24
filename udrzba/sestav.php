<?php

/**
 * Sestaví styly a skripty pro nasazení do produkce
 */

require_once __DIR__ . '/../nastaveni/zavadec-zaklad.php';

// konfigurační proměnná, kterou může nastavit volající skript
$proProdukci = isset($proProdukci) ? (bool) $proProdukci : true;

// načtení a nastavení cache
$cache = new PerfectCache(CACHE . '/sestavene', URL_CACHE . '/sestavene');
$cache->nastav('babelBinarka', BABEL_BINARKA);
if($proProdukci) {
  $cache->nastav('reactVProhlizeci', false);
  $cache->nastav('logovani', true);
} else {
  $cache->nastav('reactVProhlizeci', REACT_V_PROHLIZECI);
}

// sestavení souborů
$cache->sestavReact(__DIR__ . '/../model/program/*.jsx');
$cache->sestavReact(__DIR__ . '/../model/program/tlacitka-a-modaly/*.jsx');

// úklid
if($proProdukci) {
  $cache->vymazNesestavene();
}
