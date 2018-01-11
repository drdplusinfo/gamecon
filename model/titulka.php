<?php

/**
 * Reprezentace informace a stavy na titulní straně
 */
class Titulka {

  static function infopruhUdalost ($var = null) {
    $aktualniDatum = time();
    if ((strtotime(ROK.'-01'.'-01') < $aktualniDatum) && ($aktualniDatum < strtotime(REG_GC_OD))) {
      $var = 'Do spuštění <span class="tooltip">registrace na gamecon<span class="tooltipText">Registrace na GameCon probíhá postupně: Jako první se zaregistrujete na festival samotný a od  '.REG_AKTIVIT_OD.' je možné se registrovat na aktivity samotné. Více se dozvíte v sekci <a href="/jak-to-probiha">Jak to probíhá?</a></span></span> zbývá:';
    }
    return $var;
  }

  function infopruhCas () {
    return false;
  }

}

/*
Do začátku <span class="tooltip">registrace na gamecon<span class="tooltipText">Registraci na aktivity vypouštíme postupně - po vlnách. Další vlny vypustíme v datech X a Y. Více o tomto principu si můžete přečíst v sekci <a href="/jak-to-probiha>">Jak to probíhá?</a></span></span> zbývá:
*/
