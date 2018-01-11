<?php

class Menu {

  protected static $linie;

  protected $ogameconu = [
    'co-je-gamecon' => 'Co je GameCon?',
    'jak-to-probiha' => 'Jak to probíhá?',
    'organizacni-vypomoc' => 'Pomoz nám s přípravou',
    'blog' => 'Blog',
    'sponzori' => 'Sponzoři',
    'kontakt' => 'Kontakt'
  ];

  protected $prakticke = [
    'kdy-a-kde' => 'Kdy a kde?',
    'ubytovani' => 'Ubytování',
    'stravovani' => 'Stravování',
    'na-miste' => 'Na místě',
    'deti' => 'Děti'
  ];

  protected $url;

  function __construct(Uzivatel $u = null, Url $url = null) {
    // personalizace seznamu stránek
    $a = $u ? $u->koncA() : '';
    $this->url = $url;
  }

  /** Celý kód menu (html) */
  function cele() {
    $a = $this->url ? $this->url->cast(0) : null;
    $t = new XTemplate('sablony/menu.xtpl');
    $t->assign(['ogameconu' => $this->polozkyDropdown('ogameconu'), 'prakticke' => $this->polozkyDropdown('prakticke'), 'aktivity' => $this->polozkyDropdown('Aktivity') ]
    );

    /* --------------------------- POŘEŠIT AŽ S PŘIHLÁŠENÝM UŽIVATELEM ----------------------------------*/
    /*if(po(REG_GC_OD) && $u && $u->gcPrihlasen()) {
      $t->parse('menu.prihlasen');
    } else {
      $t->parse('menu.neprihlasen');
    }*/
    $t->parse('menu');
    return $t->text('menu');
  }

  /** Asoc. pole url linie => název */
  static function linieSeznam() {
    if(!isset(self::$linie)) { // TODO cacheování
      $typy = Typ::zViditelnych();
      usort($typy, function($a, $b) { return $a->poradi() - $b->poradi(); });
      foreach($typy as $typ) {
        self::$linie[$typ->url()] = mb_ucfirst($typ->nazev());
      }
    }
    return self::$linie;
  }

  /** Seznam stránek s prokliky (html) */
  function polozkyDropdown($submenu) {
    $o = '';
    switch ($submenu) {
    case 'ogameconu':
      foreach($this->ogameconu as $a => $l) {
        $o .= '<a class="dropdown-item" href="'.$a.'">'.$l.'</a>';
      };
      break;
    case 'prakticke':
    foreach($this->prakticke as $a => $l) {
      $o .= '<a class="dropdown-item" href="'.$a.'">'.$l.'</a>';
    };
    break;
    case 'Aktivity':
      //if(PROGRAM_VIDITELNY && !isset($linie['program']))  $linie = ['program' => 'Program'] + $linie; //Nějaký pohrobek (Manik)
    $linie = self::linieSeznam();
    foreach($linie as $a => $l) {
      $o .= '<a class="dropdown-item" href="'.$a.'">'.$l.'</a>';
    };
    break;
}
    return $o;
  }

}
