<?php

/**
 * Pomocná fce pro vykreslení seznamu linků na základě organizátorů
 */
function orgUrls($organizatori) {
  $vystup = [];
  foreach($organizatori as $o) {
    if(!$o->url()) continue;
    $vystup[] = '<a href="'.$o->url().'">'.$o->jmenoNick().'</a>';
  }
  return $vystup;
}

// Načtení organizátora, pokud je zadán přes ID
if(get('vypravec')) {
  $this->param('org', Uzivatel::zId(get('vypravec')));
}

// Přesměrování na kanonickou URL pokud existuje pro daný dotaz
if(get('rok') == ROK) unset($_GET['rok']);
if(array_keys($_GET) == ['req', 'typ'] && $_GET['typ']) {
  back($_GET['typ']);
}

// Statické stránky (tj. obsah vztahující ke konkrétní linii, např. "Jak si vybrat RPG hru")
// TODO hack
// TODO nejasné načítání typu
$stranky = [];
$prefixy = ['drd', 'legendy', 'rpg'];
if(isset($typ) && $typ && in_array($typ->url(), $prefixy))
  $stranky = Stranka::zUrlPrefixu($typ->url());
usort($stranky, function($a, $b){ return $a->poradi() - $b->poradi(); });
//$t->parseEach($stranky, 'stranka', 'aktivity.stranka');

// Vyfiltrování aktivit
$filtr = [];
$filtr['rok'] = ROK;
if($this->param('typ')) $filtr['typ'] = $this->param('typ')->id();
elseif(get('typ') && ($typ = Typ::zUrl(get('typ')))) $filtr['typ'] = $typ->id();
$filtr['jenViditelne'] = true;
$aktivity = Aktivita::zFiltru($filtr, ['nazev_akce', 'patri_pod', 'zacatek']);

/* ----------------------------- ZOBRAZENÍ SEKCE O LINII ----------------------------- */
if(isset($typ)) {
  $t->assign([
    'oLinii'        => $typ->oTypu(),
    'hlavniNadpis'          => ucfirst($typ->nazev()),
    'ikona'         => $typ->ikona(),
    'ilustracni_obrazek' => $typ->obrazek()
  ]);
  $t->parse('aktivity.zahlavi');
  // Manik: Co je kufa tohle?
  /*$this->info()
    ->nazev(mb_ucfirst($typ->nazevDlouhy()))
    ->popis($typ->bezNazvu())
    ->obrazek(null);
  */
}

/* ----------------------------- ZOBRAZENÍ AKTIVIT ----------------------------- */
$a = reset($aktivity);
$dalsi = next($aktivity);
$orgUrls = [];
while($a) {

  //TODO hack přeskočení drd a lkd druhých kol
  if(($a->typId() == Typ::LKD || $a->typId() == Typ::DRD) && $a->cenaZaklad() == 0) {
    $a = $dalsi;
    $dalsi = next($aktivity);
    continue;
  }

  // vlastnosti per termín
  $t->assign([
    'a'             =>  $a,
    'prihlasovatko' =>  $a->prihlasovatko($u), //Manik: Zjistit, co to přesně dělá
    'denAktivity'     => $a->zacatek() ? $a->zacatek()->format('l').': ' : '',
    'casAktivity'     => $a->zacatek() ? $a->zacatek()->format('H:i') : ''
    //TODO ne/přihlašovatelnost odlišená vzhledem (třídou?) termínu aktivity
    //TODO ajax na zobrazení bubliny ne/úspěšného přihlášení
  ]);
  $t->parse('aktivity.aktivita.termin');

  // vlastnosti per skupina (hack)
  if(!$dalsi || !$dalsi->patriPod() || $dalsi->patriPod() != $a->patriPod()) {
    if(CENY_VIDITELNE && $a->cena()) {
      $do = new DateTime(SLEVA_DO);
      $t->assign([
        'cena' => $a->cena($u),
        'stdCena' => $a->cena(),
        'zakladniCena' => $a->cenaZaklad().'&thinsp;Kč',
        'rozhodneDatum' => $do->format('j.n.'),
        //TODO způsob načtení a zobrazení orgů (per termín, per aktivita, proklik na jejich osobní stránku, ...?)
        //TODO optimalizace načítání popisků (do jiné tabulky, jeden dotaz, pokud bude výkonnostně problém)
      ]);
      /*if($a->bezSlevy())                $t->parse('aktivity.aktivita.cena.fixni');
      elseif($u && $u->gcPrihlasen())   $t->parse('aktivity.aktivita.cena.moje');
      else                              $t->parse('aktivity.aktivita.cena.obecna');*/
      //$t->parse('aktivity.aktivita.cena');
      //TODO Manik: Jakmile Honza dodělá funkci cena, toto je potřeba upravit
    }
    foreach($a->tagy() as $tag) {
      $vlajeckoveTagy = ['i pro nováčky','deluxe','pro pokročilé']; //které štítky(tagy) se mají zobrazit ve vlaječce (a nemají se zobrazit ve standardních štítcích)
      if (in_array($tag, $vlajeckoveTagy)) {
        $t->assign('tagVlajecka', $tag);
        $t->parse('aktivity.aktivita.vlajecka');
      }
      else {
        $t->assign('tag', $tag);
        $t->parse('aktivity.aktivita.tag');
      }
    }
    $popis = $a->popis();
    if(!$a->teamova()) {
      $orgUrls = array_merge($orgUrls, orgUrls($a->organizatori()));
      $t->assign('orgJmena', implode(', ', array_unique($orgUrls)));
      $t->parse('aktivity.aktivita.organizatori');
      $orgUrls = [];
    }
    $t->assign([
      'popis'   => $popis
      ]);
    $t->parse('aktivity.aktivita');
  }

  // bižuterie pro běh cyklu
  $a = $dalsi;
  $dalsi = next($aktivity);

}

/* ----------------------------- ZOBRAZENÍ VYPRAVĚČE ----------------------------- */
//Manik: Asi se bude vypouštět
if($org = $this->param('org')) {
  $t->assign([
    'jmeno'   =>  $org->jmenoNick(),
    'oSobe'   =>  $org->oSobe() ?: '<p><em>popisek od vypravěče nemáme</em></p>',
    'profil'  =>  $org->drdProfil(),
    'fotka'   =>  $org->fotkaAuto()->kvalita(85)->pokryjOrez(300,300),
  ]);
  $this->info()
    ->popis(
      substr(strip_tags($org->oSobe()), 0, 500) ?:
      'Stránka vypravěč'.($org->pohlavi()=='f'?'ky':'e'))
    ->nazev($org->jmenoNick())
    ->obrazek($org->fotka()); // cíleně null, pokud nemá fotku
  if($org->oSobe()) //$t->parse('aktivity.zahlavi.vypravec.viceLink');
  if($org->drdProfil()) {
    //$t->parse('aktivity.zahlavi.vypravec.profilLink');
    //$t->parse('aktivity.zahlavi.vypravec.profil');
  }
  //$t->parse('aktivity.zahlavi.vypravec');
  //$t->parse('aktivity.zahlavi');
}
