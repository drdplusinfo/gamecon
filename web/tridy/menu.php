<?php

class Menu {

  protected static $linie;

  protected $ogameconu = [
    'co-je-gamecon' => 'Co je GameCon?',
    'jak-to-probiha' => 'Jak to probíhá?',
    'chci-se-zapojit' => 'Pomoz nám s přípravou',
    'blog' => 'Blog',
    'partneri' => 'Partneři',
    'kontakt' => 'Kontakt'
  ];

  protected $prakticke = [
    'novinky' => 'Novinky',
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
    $linie = self::linieSeznam();
    $t->assign([
      'ogameconu' => $this->polozkyDropdown('ogameconu'),
      'prakticke' => $this->polozkyDropdown('prakticke'),
    ]);

    /* --------------------------- POŘEŠIT AŽ S PŘIHLÁŠENÝM UŽIVATELEM ----------------------------------*/
    /*if(po(REG_GC_OD) && $u && $u->gcPrihlasen()) {
      $t->parse('menu.prihlasen');
    } else {
      $t->parse('menu.neprihlasen');
    }*/
    $this->polozkyMegaDropdown($linie,$t);
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

  /** Seznam položek do dropdown menu s prokliky (html) */
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
}
    return $o;
  }

  /** Seznam položek do mega dropdown menu (linií) s prokliky */
  function polozkyMegaDropdown($linie,$t) {
    $stolniHry = ['deskoherna', 'epic', 'wargaming', 'turnaje'];
    $hryNaHrdiny = ['drd', 'legendy', 'rpg'];
    $ostatniHry = ['larpy', 'prednasky', 'doprovodny-program', 'bonusy'];
    $hlavniLinie = [
      'stolniHry'   => 'stolní hry',
      'hryNaHrdiny' => 'hry na hrdiny',
      'ostatniHry'  => 'ostatní hry',
    ];
    foreach($hlavniLinie as $hlavniLinieKlic => $hlavniLinieNazev) { //cyklus pro parsing hlavních (nadřízených) linií
      foreach($linie as $linieUrl => $linieNazev) { //cyklus pro parsing normálních linií
        if(in_array($linieUrl, ${$hlavniLinieKlic})) {
          $t->assign([
            'nazev' => $linieNazev,
            'url'   => $linieUrl,
          ]);
          $t->parse('menu.hlavniLinie.linie');
        }
      }
      $t->assign('hlavniLinie', $hlavniLinieNazev);
      $t->parse('menu.hlavniLinie');
    }
  }

}
