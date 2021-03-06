<?php

class Lokace extends DbObject {

  protected static $tabulka = 'akce_lokace';
  protected static $pk = 'id_lokace';

  function __toString() {
    return $this->r['nazev'] . ', ' . $this->r['dvere'];
  }

  function nazev() {
    return $this->r['nazev'];
  }

  function poradi() {
    return $this->r['poradi'];
  }

}
