<?php

require_once __DIR__ . '/program-api.php';

class Program {

  private
    $api,
    $cacheSouboru,
    $jsElementId = 'cProgramElement'; // TODO v případě použití více instancí řešit příslušnost k instancím

  function __construct(Uzivatel $uzivatel = null, $nastaveni = []) {
    // TODO cache v okamžiku dokončení přesunout mimo program a předávat parametrem
    $this->cacheSouboru = new PerfectCache(CACHE . '/sestavene', URL_CACHE . '/sestavene');
    $this->cacheSouboru->nastav('reactVProhlizeci', REACT_V_PROHLIZECI);
    $this->cacheSouboru->nastav('babelBinarka', BABEL_BINARKA);
    $this->cacheSouboru->pridejReact(__DIR__ . '/*.jsx');

    // TODO přidat do elementu něco jako `class=cProgramCssClass` a v css
    // souboru pak dávat `.cProgramCssClass něco {`, nebo to celé obalit
    // pomocí lessu
    $this->cacheSouboru->pridejCss(__DIR__ . '/program.css');

    $this->api = new JsPhpApiHandler(new ProgramApi($uzivatel, $nastaveni));
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
    // TODO vyhodit atribut data
    return
      '<div id="'.$this->jsElementId.'"></div>' .
      $this->cacheSouboru->inlineCekejNaBabel('
        ReactDOM.render(
          React.createElement(Program, {
            api: '.$this->api->jsApiObjekt().'
          }),
          document.getElementById("'.$this->jsElementId.'")
        )
      ');
  }

  function pridejJsObserver($nazevFunkce) {
    $this->api->pridejJsObserver($nazevFunkce);
  }

  function zpracujAjax() {
    $this->api->zpracujVolani();
  }

}
