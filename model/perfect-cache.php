<?php

/**
 * Popisek TODO
 *
 * Instalace Babelu (v rootu GC repa):
 *  sudo apt-get install npm
 *  npm install --save-dev babel-cli babel-preset-env babel-preset-react
 */
class PerfectCache {

  private
    $cdn = [],
    $hlavicky = '',
    $nastaveni = [
      'reactVProhlizeci'  =>  true,
      'sledovatZmeny'     =>  true,
      'babelBinarka'      =>  __DIR__ . '/../node_modules/.bin/babel',
    ],
    $slozka,
    $url;

  function __construct($slozka, $url) {
    $this->slozka = $slozka;
    $this->url = $url;

    if(!$this->nastaveni['reactVProhlizeci'] && $this->nastaveni['sledovatZmeny'])
      $this->babel = new Babel(realpath($this->nastaveni['babelBinarka']));
  }

  /**
   * @return string html kód s <script> tagy pro vložení do html hlaviček
   */
  function htmlHlavicky() {
    $cdnHlavicky = array_keys($this->cdn);
    $cdnHlavicky = array_map(function($url) { return "<script src=\"$url\"></script>"; }, $cdnHlavicky);
    $cdnHlavicky = implode("\n", $cdnHlavicky);
    return "\n" . $cdnHlavicky . "\n" . $this->hlavicky . "\n";
  }

  /**
   * Zkompiluje react kód $kod (pokud je potřeba) a vrátí zkompilovaný výsledek
   * včetně html tagů <script>.
   *
   * V devel módu nevkládá inline, ale jako soubor (nutné, aby fungoval babel v
   * prohlížeči).
   */
  function inlineReact($kod) {
    if($this->nastaveni['reactVProhlizeci']) {
      $nazev = substr(md5($kod), 0, 8) . '.jsx';
      $soubor = $this->slozka . '/' . $nazev;
      if(!is_file($soubor)) file_put_contents($soubor, $kod);
      return '<script type="text/babel" src="' . $this->url . '/' . $nazev . '"></script>';
    } else {
      $nazev = substr(md5($kod), 0, 8) . '.js';
      $soubor = $this->slozka . '/' . $nazev;
      if(!is_file($soubor)) file_put_contents($soubor, $this->babel->preloz($kod));
      return '<script>' . file_get_contents($soubor) . '</script>';
    }
  }

  private function nactiSoubory($globVyrazy) {
    $soubory = [];
    $vyjimky = [];

    foreach($globVyrazy as $vyraz) {
      if($vyraz[0] == '!')
        $vyjimky = array_merge($vyjimky, glob(substr($vyraz, 1)));
      else
        $soubory = array_merge($soubory, glob($vyraz));
    }

    $soubory = array_diff($soubory, $vyjimky);

    return $soubory;
  }

  private function pridejCdn($url) {
    $this->cdn[$url] = true;
  }

  function pridejReact(...$globVyrazy) {
    $this->pridejCdn('https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react.min.js');
    $this->pridejCdn('https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react-dom.min.js');

    if($this->nastaveni['reactVProhlizeci']) {
      $this->pridejCdn('https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.24.0/babel.js');
      $sestaveni = $this->sestavSoubory($globVyrazy);
      $tag = '<script type="text/babel" src="' . $sestaveni->url . '"></script>';
    } else {
      $sestaveni = $this->sestavReact($globVyrazy);
      $tag = '<script src="' . $sestaveni->url . '"></script>';
    }

    $this->hlavicky .= $tag . "\n";
  }

  private function sestavReact($globVyrazy) {
    $cil = $this->urciCil($globVyrazy);

    if($this->nastaveni['sledovatZmeny']) {
      $soubory = $this->nactiSoubory($globVyrazy);
      if($cil->jeStarsiNez($soubory)) {

        $kod = '';
        foreach($soubory as $soubor) {
          $kod .= file_get_contents($soubor) . "\n\n";
        }

        $cil->vymaz();
        $cil->pridej($this->babel->preloz($kod));
      }
    }

    $sestaveni = new stdClass;
    $sestaveni->url = $this->url . '/' . $cil->nazevSouboru . '?v' . $cil->timestamp;
    return $sestaveni;
  }

  private function sestavSoubory($globVyrazy) {
    $cil = $this->urciCil($globVyrazy);

    if($this->nastaveni['sledovatZmeny']) {
      $soubory = $this->nactiSoubory($globVyrazy);
      if($cil->jeStarsiNez($soubory)) {
        $cil->vymaz();
        foreach($soubory as $soubor) $cil->pridej(file_get_contents($soubor));
      }
    }

    $sestaveni = new stdClass;
    $sestaveni->url = $this->url . '/' . $cil->nazevSouboru . '?v' . $cil->timestamp;
    return $sestaveni;
  }

  private function urciCil($globVyrazy) {
    // cesta musí být relativní, aby fungoval zkompilovaný soubor z localu na produkci
    $slozene = array_map(function($vyraz) {
      return getRelativePath(__DIR__ . '/', $vyraz);
    }, $globVyrazy);
    $slozene = implode('|', $slozene);

    $pripona = substr($slozene, strrpos($slozene, '.') + 1);
    if(strlen($pripona) > 4 || strlen($pripona) < 2) throw new Exception;

    if($pripona == 'jsx' && !$this->nastaveni['reactVProhlizeci'])
      $pripona = 'js';

    return new Cil($this->slozka . '/' . substr(md5($slozene), 0, 8) . '.' . $pripona);
  }

}


class Cil {

  function __construct($soubor) {
    $this->soubor = $soubor;
    $this->nazevSouboru = basename($soubor);
    $this->timestamp = @filemtime($soubor);
  }

  function jeStarsiNez($soubory) {
    foreach($soubory as $soubor) if($this->timestamp < filemtime($soubor)) return true;
    return false;
  }

  function pridej($retezec) {
    file_put_contents($this->soubor, $retezec . "\n\n", FILE_APPEND);
    $this->timestamp = @filemtime($this->soubor);
  }

  function vymaz() {
    file_put_contents($this->soubor, '');
    $this->timestamp = @filemtime($this->soubor);
  }

}


class Babel {

  private
    $binarka,
    $pracovniSlozka;

  function __construct($binarka) {
    $this->binarka = $binarka;

    // určení pracovní složky, kde se musí pustit babel
    $pos = strpos($this->binarka, 'node_modules');
    if(!$pos) throw new Exception('binárka není v složce node_modules');
    $this->pracovniSlozka = substr($this->binarka, 0, $pos - 1);
  }

  function preloz($kod) {
    $puvodniSlozka = getcwd();
    chdir($this->pracovniSlozka);

    $output = sys_get_temp_dir() . '/output' . mt_rand();

    $proces = popen(implode(' ', [
      escapeshellarg($this->binarka),
      '--no-babelrc',
      '--presets=env,react',
      '--out-file ' . escapeshellarg($output),
    ]), 'w');
    fwrite($proces, $kod);
    fclose($proces);
    $vystup = file_get_contents($output);

    @unlink($output);

    chdir($puvodniSlozka);

    return $vystup;
  }

}


/**
 * Pomocná funkce pro určení relativní cesty od jednoho souboru k druhému
 * @see https://stackoverflow.com/a/2638272
 */
function getRelativePath($from, $to)
{
    // some compatibility fixes for Windows paths
    //$from = is_dir($from) ? rtrim($from, '\/') . '/' : $from;
    //$to   = is_dir($to)   ? rtrim($to, '\/') . '/'   : $to;
    $from = str_replace('\\', '/', $from);
    $to   = str_replace('\\', '/', $to);

    $from     = explode('/', $from);
    $to       = explode('/', $to);
    $relPath  = $to;

    foreach($from as $depth => $dir) {
        // find first non-matching dir
        if($dir === $to[$depth]) {
            // ignore this directory
            array_shift($relPath);
        } else {
            // get number of remaining dirs to $from
            $remaining = count($from) - $depth;
            if($remaining > 1) {
                // add traversals up to first matching dir
                $padLength = (count($relPath) + $remaining - 1) * -1;
                $relPath = array_pad($relPath, $padLength, '..');
                break;
            } else {
                $relPath[0] = './' . $relPath[0];
            }
        }
    }
    return implode('/', $relPath);
}
