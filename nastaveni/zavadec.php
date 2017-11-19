<?php

/**
 * Soubor který připraví prostředí aplikace: autoloadery, konstanty, logování, ...
 */

require_once __DIR__ . '/zavadec-zaklad.php';

// nastavení cache složky pro třídy, které ji potřebují
if(PHP_SAPI != 'cli') (new Vyjimkovac(SPEC . '/chyby.sqlite'))->aktivuj();
pripravCache(SPEC . '/xtpl');
XTemplate::cache(SPEC . '/xtpl');

// automatické sestavování souborů při změně (pokud ho chceme)
if(AUTOMATICKE_SESTAVENI) {
  $proProdukci = false;
  require_once __DIR__ . '/../udrzba/sestav.php'; // aby se neincludovaly křížově
}
