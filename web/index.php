<?php

require __DIR__ . '/../nastaveni/zavadec.php';
require __DIR__ . '/tridy/modul.php'; // TODO možná přesunout?
// require __DIR__ . '/tridy/menu.php'; // TODO

if(HTTPS_ONLY) httpsOnly();

$u = Uzivatel::zSession();
try {
  $url = Url::zAktualni();
} catch(UrlException $e) {
  $url = null;
}
// $menu = new Menu($u, $url); // TODO

// určení modulu, který zpracuje požadavek (router)
$m = Modul::zNazvu('titulka'); // TODO ošetřit, aby nešlo gamecon.cz/titulka
/* TODO
$m = $url ? Modul::zUrl() : Modul::zNazvu('neexistujici');
if(!$m && ($stranka = Stranka::zUrl())) {
  $m = Modul::zNazvu('stranka');
  $m->param('stranka', $stranka);
}
if(!$m && ( ($typ = Typ::zUrl()) || ($org = Uzivatel::zUrl()) )) {
  $m = Modul::zNazvu('aktivity');
  $m->param('typ', $typ ?: null);
  $m->param('org', !$typ ? $org : null);
}
if(!$m) {
  $m = Modul::zNazvu('neexistujici');
}
*/

// spuštění kódu modulu + buffering výstupu a nastavení
$m->param('u',    $u);
$m->param('url',  $url);
//$m->param('menu', $menu);
$i = (new Info())
  ->obrazek('soubory/styl/og-image.jpg') // TODO takto se to nedá vyhledat grepem - prefixovat url nebo něčím
  ->site('GameCon')
  ->url("http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]");
$m->info($i);
try {
  $m->spust();
} catch(UrlNotFoundException $e) {
  $m = Modul::zNazvu('neexistujici')->spust();
}
if(!$i->titulek())
  if($i->nazev())   $i->titulek($i->nazev().' – GameCon');
  else              $i->titulek('GameCon')->nazev('GameCon');

// výstup (s ohledem na to co modul nastavil)
if($m->bezStranky()) {
  echo $m->vystup();
} else {
  // šablona pro index (obal stránky) a nastavní proměnných pro index
  $t = new XTemplate('sablony/index.xtpl'); // TODO nejde vygrepovat
  $t->assign([
    'base'          =>  URL_WEBU . '/',
    'info'          =>  $m->info()->html(),
    'obsah'         =>  $m->vystup(),

    //'jsVyjimkovac'  =>  Vyjimkovac::js(URL_WEBU . '/ajax-vyjimkovac'), // TODO
    'chyba'         =>  Chyba::vyzvedniHtml(), // TODO možná brát jen text a řídit si html elementy sami

    // TODO
    'css'           =>  '', // TODO
    'js'            =>  '', // TODO
  ]);

  // tisk věcí a zdar
  if(ANALYTICS)                                     $t->parse('index.analytics');

  /*
  // TODO věci související s ne/přihlášeným uživatelem
  if(!$m->bezMenu())                                $t->assign('menu', $menu->cele());
  if($u && $u->maPravo(P_ADMIN_UVOD))               $t->parse('index.prihlasen.admin');
  elseif($u && $u->maPravo(P_ADMIN_MUJ_PREHLED))    $t->parse('index.prihlasen.mujPrehled');
  if($u && $u->gcPrihlasen() && FINANCE_VIDITELNE)  $t->assign('finance', $u->finance()->stavHr());
  if($u && $u->gcPrihlasen())                       $t->parse('index.prihlasen.gcPrihlasen');
  elseif($u && REG_GC)                              $t->parse('index.prihlasen.gcNeprihlasen');
  $t->parse( $u ? 'index.prihlasen' : 'index.neprihlasen' );
  */

  $t->parse('index');
  $t->out('index');
  echo profilInfo(); // TODO vykreslí se jak má?
}
