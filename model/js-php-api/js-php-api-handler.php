<?php

require_once __DIR__ . '/js-php-api-odpoved.php';
require_once __DIR__ . '/zmena-dat.php';

/**
 * Třída, která z php kódu vygeneruje js api s odpovídajícími metodami a umí
 * volání z tohoto api zpracovat v php.
 */
class JsPhpApiHandler {

  private
    $api,
    $jsPromenna,
    $maZakladniData = false,
    $metody = [];

  private static
    $sablonaApi,
    $sablonaMetody;

  function __construct(JsPhpApi $api) {
    $this->api = $api;
    $this->nactiSablony();

    $hashTridy = substr(md5(get_class($api)), 0, 10);
    $this->jsPromenna = 'cJsPhpApiHandler_' . $hashTridy;

    $reflection = new ReflectionClass($this->api);
    foreach($reflection->getMethods(ReflectionMethod::IS_PUBLIC) as $metoda) {
      $nazev = $metoda->getName();
      if($nazev == '__construct') continue;
      if($nazev == 'zakladniData') {
        $this->maZakladniData = true;
        continue;
      }
      $this->metody[$metoda->getName()] = $metoda;
    }
  }

  /**
   * Vrátí JS kód objektu s metodami, které odpovídají metodám vloženého php
   * objektu plus případně datům z metody zakladniData.
   */
  function jsApiObjekt() {
    $zakladniData = 'null';
    if($this->maZakladniData) {
      $zakladniData = json_encode($this->api->zakladniData(), JSON_UNESCAPED_UNICODE);
    }

    return strtr(self::$sablonaApi, [
      '<vyhrazenaPromenna>' =>  $this->jsPromenna,
      '<metody>'            =>  $this->jsMetody(),
      '<zakladniData>'      =>  $zakladniData,
    ]);
  }

  private function jsMetody() {
    $metody = array_map(function($metoda) {
      $parametry = array_map(function($parametr) {
        return $parametr->getName();
      }, $metoda->getParameters());
      $parametry = implode(', ', $parametry);

      return strtr(self::$sablonaMetody, [
        '<nazev>'     =>  $metoda->getName(),
        '<parametry>' =>  $parametry ? ($parametry . ',') : '',
        '<poleParametru>' => '[' . $parametry . ']',
      ]);
    }, $this->metody);

    return implode(',', $metody);
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
   * Zavolá na api metodu s názvem daným prvním parametrem a parametry danými
   * parametry 2 až N. Výsledek zaobalí jako JsPhpApiOdpoved pro jednodušší
   * zpracování.
   * @return JsPhpApiOdpoved
   */
  function zavolej($metoda, ...$parametry) {
    if(!isset($this->metody[$metoda]))
      throw new Exception('Volaná metoda v api neexistuje');

    // TODO kontrola počtu a typu parametrů

    $vysledek = $this->api->$metoda(...$parametry);

    if($vysledek instanceof ZmenaDat)
      $odpoved = new JsPhpApiOdpoved(null, $vysledek->pole());
    else
      $odpoved = new JsPhpApiOdpoved($vysledek);

    return $odpoved;
  }

  /**
   * Pokud byla v JS zavolána nějaká funkce získaná pomocí jsApiObjekt výš,
   * potom toto provede php kód, vytiskne json výsledek a **ukončí skript**.
   * Pokud funkce zavolána nebyla, neprovede se nic.
   */
  function zpracujVolani() {
    if(!isset($_POST[$this->jsPromenna])) return;
    $data = json_decode($_POST[$this->jsPromenna]);

    try {
      $odpoved = $this->zavolej($data->metoda, ...$data->parametry);
    } catch(Chyba $e) {
      http_response_code(400);
      $odpoved = new JsPhpApiOdpoved(['chyba' => $e->getMessage()]);
    }

    header('Content-Type: application/json');
    echo $odpoved->json();

    die();
  }

}
