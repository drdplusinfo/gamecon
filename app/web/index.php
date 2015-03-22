<?php
require '../zavadec.php';
require 'tridy/modul.php';
require 'tridy/menu.php';

$u = Uzivatel::zSession();
$menu = new Menu();

// určení modulu, který zpracuje požadavek (router)
$m = Modul::zUrl();
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

// spuštění kódu modulu + buffering výstupu a nastavení
$m->param('u', $u);
$m->param('menu', $menu);
$m->param('url', Url::zAktualni());
$i = (new Info())
  ->obrazek('soubory/styl/og-image.jpg')
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
  $t = new XTemplate('sablony/index.xtpl');
  // templata a nastavení proměnných do glob templaty
  $t->assign(array(
    'u'         => $u,
    'base'      => URL_WEBU.'/',
    'admin'     => URL_ADMIN,
    'obsah'     => $m->vystup(),  // TODO nastavování titulku stránky
    'sponzori'  => Modul::zNazvu('sponzori')->spust()->vystup(),
    'css'       => perfectcache(
      'soubory/styl/flaticon.ttf',
      'soubory/styl/styl.less',
      'soubory/styl/fonty.less',
      'soubory/styl/jquery-ui.min.css'
    ),
    'js'        => perfectcache(
      'soubory/jquery-2.1.1.min.js',
      'soubory/scroll-sneak.js',
      'soubory/aplikace.js',
      GOOGLE_ANALYTICS ? 'soubory/google-analytics.js' : '',
      'soubory/jquery-ui.min.js',
      'soubory/videoLightning.min.js'
    ),
    'jsVyjimkovac'  => Vyjimkovac::js(URL_WEBU.'/ajax-vyjimkovac'),
    'chyba'     => Chyba::vyzvedniHtml(),
    'info'      => $m->info()->html(),
  ));
  // tisk věcí a zdar
  if(!$m->bezMenu())                                $t->assign('menu', $menu->cele());
  if($u && $u->maPravo(P_ADMIN_UVOD))               $t->parse('index.prihlasen.admin');
  elseif($u && $u->maPravo(P_ADMIN_MUJ_PREHLED))    $t->parse('index.prihlasen.mujPrehled');
  if($u && $u->gcPrihlasen() && FINANCE_VIDITELNE)  $t->assign('finance', $u->finance()->stavHr());
  $t->parse( $u ? 'index.prihlasen' : 'index.neprihlasen' );
  $t->parse('index');
  $t->out('index');
  echo profilInfo();
}
