<?php

class Program {

  private
    $cacheSouboru,
    $jsElementId = 'cProgramElement', // TODO v případě použití více instancí řešit příslušnost k instancím
    $jsPromenna = 'cProgramPromenna',
    $jsObserveri = [];

  function __construct() {
    $this->cacheSouboru = new PerfectCache(CACHE . '/sestavene', URL_CACHE . '/sestavene');
    $this->cacheSouboru->nastav('reactVProhlizeci', REACT_V_PROHLIZECI);
    $this->cacheSouboru->nastav('babelBinarka', BABEL_BINARKA);
    $this->cacheSouboru->pridejReact(__DIR__ . '/*.jsx');
  }

  /**
   * @todo toto by mohla být statická metoda (pro případ více programů v
   * stránce), ovšem může být problém s více komponentami vkládajícími
   * opakovaně react a s více daty (např. jiné aktivity pro dvě instance
   * programu)
   */
  function htmlHlavicky() {
    return $this->cacheSouboru->htmlHlavicky();
  }

  function htmlObsah() {
    return
      '<div id="'.$this->jsElementId.'"></div>' .
      $this->jsData() .
      $this->jsRender();
  }

  private function jsData() {
    return '
      <script>
        var '.$this->jsPromenna.' = {
          "aktivity": '.$this->jsonAktivity().',
          "linie": '.$this->jsonLinie().',
          "notifikace": '.$this->jsonNotifikace().'
        }
      </script>
    ';
  }

  private function jsRender() {
    return $this->cacheSouboru->inlineCekejNaBabel('
      ReactDOM.render(
        React.createElement(Program, { data: '.$this->jsPromenna.' }),
        document.getElementById("'.$this->jsElementId.'")
      );
    ');
  }

  private function jsonAktivity() {
    // TODO aktuální rok
    // TODO listovat tech. aktivity jenom tomu, kdo je může vidět

    $aktivity = Aktivita::zProgramu();
    $aktivity = array_map(function($a) {
      $r = $a->rawDb();
      return [
        'id'            =>  (int) $a->id(),
        'nazev'         =>  $a->nazev(),
        'linie'         =>  (int) $a->typId(),
        'zacatek'       =>  $a->zacatek()->formatJs(),
        'konec'         =>  $a->konec()->formatJs(),
        'organizatori'  =>  array_map(function($o) { return $o->jmenoNick(); }, $a->organizatori()),
        'stitky'        =>  array_map(function($t) { return (string) $t; }, $a->tagy()),
        'prihlaseno_m'  =>  $a->prihlasenoMuzu(),
        'prihlaseno_f'  =>  $a->prihlasenoZen(),

        // TODO údaje načítané přímo z DB řádku, smazat nebo nějak převést
        'kapacita_m'    =>  (int) $r['kapacita_m'],
        'kapacita_f'    =>  (int) $r['kapacita_f'],
        'kapacita_u'    =>  (int) $r['kapacita'],

        /* TODO:
        týmová
        přihlášen/nepřihlášen
        přihlašovatelná / jsem přihlášen / organizuji
        krátká anotace
        */
      ];
    }, $aktivity->getArrayCopy());

    return json_encode(array_values($aktivity), JSON_UNESCAPED_UNICODE);
  }

  private function jsonLinie() {
    $q = dbQuery('
      SELECT
        t.id_typu as "id",
        t.typ_1pmn as "nazev",
        t.poradi
      FROM akce_typy t
    ');

    return json_encode($q->fetch_all(MYSQLI_ASSOC), JSON_UNESCAPED_UNICODE);
  }

  private function jsonNotifikace() {
    return '[' . implode(',', $this->jsObserveri) . ']';
  }

  function zaregistrujJsObserver($nazevFunkce) {
    $this->jsObserveri[] = $nazevFunkce;
  }

}
