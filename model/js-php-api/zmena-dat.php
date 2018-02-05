<?php

class ZmenaDat {

  private
    $pole;

  function __construct($pole) {
    $this->pole = $pole;
  }

  function pole() {
    return $this->pole;
  }

  function pridej(self $dalsiZmena) {
    $this->pole = array_merge($this->pole, $dalsiZmena->pole);
  }

}
