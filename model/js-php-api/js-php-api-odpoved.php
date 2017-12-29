<?php

class JsPhpApiOdpoved {

  private
    $surovaOdpoved;

  /**
   * @param mixed $odpoved odpověď z api třídy určená pro převod do jsonu
   *  (typicky asociativní pole, ale obecně libovolný json-serializovatelný
   *  typ)
   */
  function __construct($odpoved) {
    $this->surovaOdpoved = $odpoved;
  }

  /**
   * @return string data odpovědi jako kompaktní utf-8 JSON řetězec
   */
  function json() {
    return json_encode($this->surovaOdpoved, JSON_UNESCAPED_UNICODE);
  }

}
