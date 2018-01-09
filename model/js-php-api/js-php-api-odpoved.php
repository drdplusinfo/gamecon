<?php

class JsPhpApiOdpoved {

  private
    $surovaOdpoved,
    $zmenaDat;

  /**
   * @param mixed $odpoved odpověď z api třídy určená pro převod do jsonu
   *  (typicky asociativní pole, ale obecně libovolný json-serializovatelný
   *  typ)
   * @param mixed $zmenaDat úpravy dat, které se mají provést, pokud je api
   *  svázané s nějakým vstupním JS datovým objektem
   */
  function __construct($odpoved, $zmenaDat = null) {
    $this->surovaOdpoved = $odpoved;
    $this->zmenaDat = $zmenaDat;
  }

  /**
   * @return string data odpovědi jako kompaktní utf-8 JSON řetězec
   */
  function json() {
    return json_encode([
      'obsah'     =>  $this->surovaOdpoved,
      'zmenaDat'  =>  $this->zmenaDat,
    ], JSON_UNESCAPED_UNICODE);
  }

  function jsonObsah() {
    return json_encode($this->surovaOdpoved, JSON_UNESCAPED_UNICODE);
  }

}
