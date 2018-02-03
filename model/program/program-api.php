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
      'tymova'        =>  (bool) $a->tymova(),
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

    return array_map(
      [$this, 'aktivitaFormat'],
      array_values($aktivity->getArrayCopy())
    );
  }

  /**
   * Vrátí detail aktivity.
   */
  function detail($aktivitaId) {
    // TODO upravit načtení detailu na změnu (doplnění) základních dat
    return [
      'popis'     =>  rand(0,1) ? 'Moc dobrá aktivita. Doporučuji.' : 'Sračka.',
      'mistnost'  =>  ['nazev' => 'Holobyt na AB/B/2 v kukani.', 'dvere' => 123],
      'hraci'     =>  ['Pepa', 'Jarin'],
    ];
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
