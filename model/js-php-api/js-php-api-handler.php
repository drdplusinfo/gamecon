<?php

/**
 * Třída, která z php kódu vygeneruje js api s odpovídajícími metodami a umí
 * volání z tohoto api zpracovat v php.
 */
class JsPhpApiHandler {

  private
    $api,
    $jsPromenna;

  private static
    $sablonaApi,
    $sablonaMetody;

  function __construct(JsPhpApi $api) {
    $this->api = $api;
    $this->nactiSablony();

    $hashTridy = substr(md5(get_class($api)), 0, 10);
    $this->jsPromenna = 'cJsPhpApiHandler_' . $hashTridy;

    $this->metody = [];
    $reflection = new ReflectionClass($this->api);
    foreach($reflection->getMethods(ReflectionMethod::IS_PUBLIC) as $metoda) {
      $this->metody[$metoda->getName()] = $metoda;
    }
  }

  /**
   * Vrátí JS kód objektu s metodami, které odpovídají metodám vloženého php
   * objektu.
   */
  function jsApiObjekt() {
    return strtr(self::$sablonaApi, [
      '<vyhrazenaPromenna>' =>  $this->jsPromenna,
      '<metody>'            =>  $this->jsMetody(),
    ]);
  }

  private function jsMetody() {
    $metody = array_map(function($metoda) {
      $parametry = array_map(function($parametr) {
        return $parametr->getName();
      }, $metoda->getParameters());
      $parametry = implode(',', $parametry);

      return strtr(self::$sablonaMetody, [
        '<nazev>'     =>  $metoda->getName(),
        '<parametry>' =>  $parametry,
      ]);
    }, $this->metody);

    return '{' . implode(',', $metody) . "\n}";
  }

  private function nactiSablony() {
    if(!isset(self::$sablonaApi)) {
      self::$sablonaApi = file_get_contents(__DIR__ . '/js-php-api-handler.js');
    }

    if(!isset(self::$sablonaMetody)) {
      self::$sablonaMetody = "\n" . trim(file_get_contents(__DIR__ . '/js-php-api-handler-metoda.js'));
    }
  }

  /**
   * Pokud byla v JS zavolána nějaká funkce získaná pomocí jsApiObjekt výš,
   * potom toto provede php kód, vytiskne json výsledek a **ukončí skript**.
   * Pokud funkce zavolána nebyla, neprovede se nic.
   */
  function zpracujVolani() {
    if(!isset($_POST[$this->jsPromenna])) return;
    $data = json_decode($_POST[$this->jsPromenna]);

    $volanaMetoda = $data->metoda;
    if(!isset($this->metody[$volanaMetoda]))
      throw new Exception('Volaná metoda v api neexistuje');

    $volaneParametry = $data->parametry;
    // TODO kontrolovat počet parametrů, případně typ

    try {
      $vystup = $this->api->$volanaMetoda(...$volaneParametry);
    } catch(Chyba $e) {
      http_response_code(400);
      $vystup = ['chyba' => $e->getMessage()];
    }

    header('Content-Type: application/json');
    echo json_encode($vystup);

    die();
  }

}
