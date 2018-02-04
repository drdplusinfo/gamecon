<?php

class ProgramApi implements JsPhpApi {

  private
    $uzivatel; // uživatel, který s API komunikuje (null, pokud nepřihlášen)

  function __construct(?Uzivatel $uzivatel) {
    $this->uzivatel = $uzivatel;
  }

  /**
   * Převede aktivitu $a na formát, jak má vypadat v API.
   */
  private function aktivitaFormat($a) {
    $r = $a->rawDb(); // TODO pro údaje načítané přímo z DB řádku, smazat nebo nějak převést

    return [
      'id'            =>  (int) $a->id(),
      'nazev'         =>  $a->nazev(),
      'linie'         =>  (int) $a->typId(),
      'zacatek'       =>  $a->zacatek()->formatJs(),
      'konec'         =>  $a->konec()->formatJs(),
      'organizatori'  =>  array_map(function($o) { return $o->jmenoNick(); }, $a->organizatori()),
      'stitky'        =>  array_map(function($t) { return (string) $t; }, $a->tagy()),
      'prihlasenoMuzu'=>  $a->prihlasenoMuzu(),
      'prihlasenoZen' =>  $a->prihlasenoZen(),
      'otevrenoPrihlasovani' => $a->prihlasovatelna(),
      'vDalsiVlne'    =>  $a->vDalsiVlne(),
      'probehnuta'    =>  $a->probehnuta(),
      'organizuje'    =>  $this->uzivatel ? $this->uzivatel->organizuje($a) : null,
      'prihlasen'     =>  $this->uzivatel ? $a->prihlasen($this->uzivatel)  : null,
      'tymovaData'    =>  $this->tymovaDataFormat($a),
      'popisKratky'   =>  rand(0, 99) >= 10 ? 'Naprosto skvělá záležitost. To chceš.' : 'Sračka.', // TODO test data
      'kapacitaMuzi'  =>  (int) $r['kapacita_m'],
      'kapacitaZeny'  =>  (int) $r['kapacita_f'],
      'kapacitaUniverzalni' =>  (int) $r['kapacita'],
      'sdruzit'       =>  $a->typId() == Typ::DRD && $a->tymova(), // základní kola DrD
    ];
  }

  /**
   * Vrátí pole všech aktivit v programu. Formát aktivit viz aktivitaFormat.
   */
  private function aktivity() {
    // TODO listovat tech. aktivity jenom tomu, kdo je může vidět
    $aktivity = Aktivita::zProgramu();
    return array_map([$this, 'aktivitaFormat'], $aktivity);
  }

  /**
   * Vrátí pole všech existujících programových linií.
   */
  private function linie() {
    return dbQuery('
      SELECT
        t.id_typu as "id",
        t.typ_1pmn as "nazev",
        t.poradi
      FROM akce_typy t
    ')->fetch_all(MYSQLI_ASSOC);
  }

  /**
   * Doplní do základních dat dlouhý popisek aktivity.
   */
  function nactiDetail($aktivitaId) {
    $a = Aktivita::zId($aktivitaId);
    return new ZmenaDat([
      "aktivity[id=$aktivitaId].popisDlouhy" => $a->popis(),
    ]);
  }

  /**
   * Doplní do základních dat kompletní informace o týmu.
   *
   * Lze zavolat pouze, pokud je uživatel na danou aktivitu přihlášen.
   */
  function nactiDetailTymu($aktivitaId) {
    $a = Aktivita::zId($aktivitaId);

    if(!$a->prihlasen($this->uzivatel))
      throw new Chyba('Nejsi přihlášen na danou aktivitu.');
    if(!$a->tymova())
      throw new Exception('Aktivita není týmová.');

    $dalsiKola = [];
    $dalsiKolo = [$a];
    while($dalsiKolo = current($dalsiKolo)->deti()) {
      $dalsiKola[] = array_map(function($varianta) {
        return [
          'id'    =>  $varianta->id(),
          'nazev' =>  $varianta->nazev() . ': ' . $varianta->denCas(),
        ];
      }, $dalsiKolo);
    }

    $hraci = array_map(function($hrac) {
      return $hrac->jmenoNick();
    }, $a->prihlaseni());

    return new ZmenaDat([
      "aktivity[id=$aktivitaId].tymovaData.hraci"     =>  $hraci,
      "aktivity[id=$aktivitaId].tymovaData.vyberKol"  =>  $dalsiKola,
    ]);
  }

  /**
   * Vrátí pole uživatelů, kteří odpovídají vyhledávanému výrazu.
   */
  function najdiHrace($castJmena) {
    if(!$this->uzivatel)
      throw new Exception('Uživatel musí být přihlášen.');

    return array_map(function($u) {
      return [
        'id'    =>  $u->id(),
        'jmeno' =>  $u->jmenoNick(),
      ];
    }, Uzivatel::zHledani($castJmena, [
      'mail'  =>  false,
      'id'    =>  false,
      'min'   =>  3,
      'limit' =>  5,
    ]));
  }

  /**
   * Nastaví kapacitu v rámci limitů daných min a max kapacitou týmu.
   *
   * Nelze snížit pod počet přihlášených hráčů. Uživatel musí být na aktivitu
   * přihlášen.
   */
  function nastavKapacituTymu($aktivitaId, $kapacita) {
    $a = Aktivita::zId($aktivitaId);

    if(!$a->prihlasen($this->uzivatel))
      throw new Exception('Je nutné být přihlášen na danou aktivitu.');

    $a->tym()->kapacita($kapacita);

    return new ZmenaDat([
      "aktivity[id=$aktivitaId].kapacitaUniverzalni" => (int) $kapacita,
    ]);
  }

  /**
   * Odhlásí aktuálního uživatele z aktivity.
   */
  function odhlas($aktivitaId) {
    $a = Aktivita::zId($aktivitaId);
    $a->odhlas($this->uzivatel);
    return new ZmenaDat([
      "aktivity[id=$aktivitaId]" => $this->aktivitaFormat($a)
    ]);
  }

  /**
   * Přihlásí aktuálního uživatele na aktivitu.
   */
  function prihlas($aktivitaId) {
    $a = Aktivita::zId($aktivitaId);
    $a->prihlas($this->uzivatel);
    return new ZmenaDat([
      "aktivity[id=$aktivitaId]" => $this->aktivitaFormat($a)
    ]);
  }

  /**
   * Vrátí strukturu s detaily o týmové aktivitě nebo null, pokud aktivita
   * týmová není.
   */
  private function tymovaDataFormat($a, $detail = false) {
    if(!$a->tymova()) return null;

    $tym = $a->tym();
    $zamcenaDo = $a->tymZamcenyDo();

    return [
      'nazevTymu'   =>  $tym ? $tym->nazev() : null,
      'maxKapacita' =>  (int) $a->tymMaxKapacita(),
      'minKapacita' =>  (int) $a->tymMinKapacita(),
      'hraci'       =>  null,
      'vyberKol'    =>  null,
      'zamcenaDo'   =>  $zamcenaDo ? $zamcenaDo->formatJs() : null,
    ];
  }

  /**
   * Vrátí základní datovou strukturu pro react komponentu.
   */
  function zakladniData() {
    return [
      'aktivity'          =>  $this->aktivity(),
      'linie'             =>  $this->linie(),
      'notifikace'        =>  [], // TODO
      'uzivatelPrihlasen' =>  (bool) $this->uzivatel,
      'uzivatelPohlavi'   =>  $this->uzivatel ? $this->uzivatel->pohlavi() : null,
    ];
  }

}
