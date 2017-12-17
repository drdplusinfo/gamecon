<?php

class Menu {

  protected static $linie;

  protected $OGameConu = [
    'co-je-gamecon' => 'Co je GameCon?',
    'jak-to-probiha' => 'Jak to probíhá?',
    'organizacni-vypomoc' => 'Pomoz nám s přípravou',
    'blog' => 'Blog',
    'sponzori' => 'Sponzoři',
    'kontakt' => 'Kontakt'
  ];

  protected $Prakticke = [
    'kdy-a-kde' => 'Kdy a kde?',
    'ubytovani' => 'Ubytování',
    'stravovani' => 'Stravování',
    'na-miste' => 'Na místě',
    'deti' => 'Děti'
  ];

  //TO-DO: Toto je potřeba refaktorovat
    protected $stranky = [
      'prihlaska'           =>  'Přihláška:&ensp;',
      'o-gameconu'          =>  'Co je GameCon?',
      'o-parconu'           =>  'Co je ParCon?',
      'organizacni-vypomoc'     =>  'Organizační výpomoc',
      'chci-se-prihlasit'   =>  'Chci se přihlásit',
      'en'                  =>  'English program',
      'prakticke-informace' =>  'Praktické informace',
      'kontakty'            =>  'Kontakty',
      'https://www.facebook.com/pg/gamecon/photos/?tab=album&album_id=1646393038705358' => 'Fotogalerie',
    ];

  protected $url;

  function __construct(Uzivatel $u = null, Url $url = null) {
    // personalizace seznamu stránek
    $a = $u ? $u->koncA() : '';
    if(po(REG_GC_OD)) {
      $this->stranky['prihlaska'] .= $u && $u->gcPrihlasen() ?
        '<img src="soubory/styl/ok.png" style="margin-bottom:-3px"> přihlášen'.$a.' na GC':
        '<img src="soubory/styl/error.png" style="margin-bottom:-3px"> nepřihlášen'.$a.' na GC';
    } else {
      $this->stranky['prihlaska'] .= 'přihlašování ještě nezačalo';
    }
    $this->url = $url;
  }

  /** Celý kód menu (html) */
  function cele() {
    $a = $this->url ? $this->url->cast(0) : null;
    $t = new XTemplate('sablony/menu.xtpl');
    $t->assign(['ogameconu' => $this->polozkyDropdown('OGameConu'), 'prakticke' => $this->polozkyDropdown('Prakticke'), 'aktivity' => $this->polozkyDropdown('Aktivity') ]
    );

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
    case 'OGameConu':
      foreach($this->OGameConu as $a => $l) {
        $o .= '<a class="dropdown-item" href="'.$a.'">'.$l.'</a>';
      };
      break;
    case 'Prakticke':
    foreach($this->Prakticke as $a => $l) {
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
