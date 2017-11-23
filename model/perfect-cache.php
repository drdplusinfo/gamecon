<?php

/**
 * Popisek TODO
 *
 * Metody:
 *
 *  sestav*() - sestaví zadané soubory, pokud se změnily (cíl se určí
 *    automaticky). Sestavení je odděleno od pridej*() a inline*() proto,
 *    aby se mohlo sestavovat lokálně a na produkci už jen includnout
 *    sestavené soubory (protože na produkci sestavovat nejde).
 *
 *  pridej*() - zapamatuje si, že chceme dané soubory do hlaviček (musely být
 *    ale nejdřív sestaveny). Hlavičky si pak získáme metodou htmlHlavicky().
 *
 *  inline*() - ošetřuje inline kód v případech, kdy se způsob inlinování pro
 *    produkci a vývoj liší.
 *
 * Instalace Babelu (v rootu GC repa):
 *  sudo apt-get install npm
 *  npm install --save-dev babel-cli babel-preset-env babel-preset-react
 */
class PerfectCache {

  private
    $babel,
    $cdn = [],
    $hlavicky = '',
    $nastaveni = [
      'reactVProhlizeci'  =>  true,
      'babelBinarka'      =>  null,
      'logovani'          =>  false,
    ],
    $slozka,
    $sestavene = [],
    $url;

  function __construct($slozka, $url) {
    $this->slozka = $slozka;
    $this->url = $url;
  }

  function babel() {
    if(!$this->babel) {
      $this->babel = new Babel($this->nastaveni['babelBinarka']);
    }
    return $this->babel;
  }

  private static function hash($retezec) {
    $hash = md5($retezec);
    $hash = substr($hash, 0, 16);

    // vymaskovat 1. bit aby se vešlo do 64b signed integeru
    $prvni = hexdec($hash[0]);
    $prvni &= 0b0111;
    $hash[0] = dechex($prvni);

    $hash = sprintf('%019d', hexdec($hash)); // použitelných je 19 číslic

    return $hash;
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
   * Workaround pro inline kód, který se musí spustit až po načtení babelu
   * v případě, že se používá babel v prohlížeči.
   */
  function inlineCekejNaBabel($kod) {
    if($this->nastaveni['reactVProhlizeci']) {
      return '<script type="text/babel">' . $kod . '</script>';
    } else {
      return '<script>' . $kod . '</script>';
    }
  }

  private function loguj($hlaska) {
    if(!$this->nastaveni['logovani']) return;
    echo "$hlaska\n";
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

    if(!$soubory) throw new Exception('zadaným výrazům neodpovídají žádné soubory');
    $soubory = array_diff($soubory, $vyjimky);

    return $soubory;
  }

  function nastav($nazevKonfiguracnihoParametru, $hodnota) {
    if(!array_key_exists($nazevKonfiguracnihoParametru, $this->nastaveni))
      throw new Exception('zadaný konfigurační parametr neexsituje');
    $this->nastaveni[$nazevKonfiguracnihoParametru] = $hodnota;
  }

  private function pridejCdn($url) {
    $this->cdn[$url] = true;
  }

  /**
   * @todo změnit z inline na skutečné linkování souboru
   * @todo upravit $soubor na ...$globVyrazy
   */
  function pridejCss($soubor) {
    $this->hlavicky .= "<style>" . file_get_contents($soubor) . "</style>\n";
  }

  function pridejReact(...$globVyrazy) {
    $this->pridejCdn('https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react.min.js');
    $this->pridejCdn('https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react-dom.min.js');

    $cil = $this->urciCil($globVyrazy);
    if($this->nastaveni['reactVProhlizeci']) {
      $this->pridejCdn('https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.24.0/babel.js');
      $tag = '<script type="text/babel" src="' . $cil->url() . '"></script>';
    } else {
      $tag = '<script src="' . $cil->url() . '"></script>';
    }

    $this->hlavicky .= $tag . "\n";
  }

  function sestavReact(...$globVyrazy) {
    if($this->nastaveni['reactVProhlizeci']) {
      $this->sestavSoubory($globVyrazy);
    } else {
      $this->sestavReactBabel($globVyrazy);
    }
  }

  private function sestavReactBabel($globVyrazy) {
    $babel = $this->babel();
    $this->sestav($globVyrazy, function($zdroje, $cil)use($babel) {
      @unlink($cil);
      file_put_contents($cil, '');
      foreach($zdroje as $zdroj) {
        $kod = $babel->preloz(file_get_contents($zdroj));
        file_put_contents($cil, $kod, FILE_APPEND);
      }
    });
  }

  private function sestavSoubory($globVyrazy) {
    $this->sestav($globVyrazy, function($zdroje, $cil) {
      @unlink($cil);
      file_put_contents($cil, '');
      foreach($zdroje as $zdroj)
        file_put_contents($cil, file_get_contents($zdroj), FILE_APPEND);
    });
  }

  private function sestav($globVyrazy, $sestavovaciFunkce) {
    $this->loguj('sestavuji ' . implode(' + ', $globVyrazy));
    $cil = $this->urciCil($globVyrazy);
    $soubory = $this->nactiSoubory($globVyrazy);
    if($cil->jeStarsiNez($soubory)) {
      $cil->pripravSlozku();
      $sestavovaciFunkce($soubory, $cil->soubor);
    }
    $this->sestavene[] = $cil->soubor;
  }

  private function urciCil($globVyrazy) {
    // cesta musí být relativní, aby fungoval zkompilovaný soubor z localu na produkci
    $slozene = array_map(function($vyraz) {
      if(substr($vyraz, 0, 1) == '!') {
        $vyraz = substr($vyraz, 1) . '!';
      }
      return getRelativePath(__DIR__ . '/', $vyraz);
    }, $globVyrazy);
    sort($slozene);
    $slozene = implode('|', $slozene);

    $pripona = substr($slozene, strrpos($slozene, '.') + 1);
    $pripona = rtrim($pripona, '!');
    if(strlen($pripona) > 4 || strlen($pripona) < 2) throw new Exception;

    if($pripona == 'jsx' && !$this->nastaveni['reactVProhlizeci'])
      $pripona = 'js';

    return new Cil(
      $this->slozka . '/' . self::hash($slozene) . '.' . $pripona,
      $this->url    . '/' . self::hash($slozene) . '.' . $pripona
    );
  }

  /**
   * Vymaže z cílové složky soubory, nad kterými nebylo zavoláno sestav*()
   */
  function vymazNesestavene() {
    $existujici = glob($this->slozka . '/*');
    $existujici = array_map('realpath', $existujici);

    $sestavene = array_map('realpath', $this->sestavene);

    $nesestavene = array_diff($existujici, $sestavene);
    foreach($nesestavene as $soubor) unlink($soubor);
  }

}


class Cil {

  function __construct($soubor, $url) {
    $this->soubor = $soubor;
    $this->nazevSouboru = basename($soubor);
    $this->timestamp = @filemtime($soubor);
    $this->url = $url;
  }

  function jeStarsiNez($soubory) {
    foreach($soubory as $soubor) if($this->timestamp < filemtime($soubor)) return true;
    return false;
  }

  function pripravSlozku() {
    $slozka = dirname($this->soubor);
    if(is_writable($slozka)) return;
    if(is_dir($slozka)) throw new Exception("Do existující cache složky '$slozka' není možné zapisovat");
    if(!mkdir($slozka)) throw new Exception("Složku '$slozka' se nepodařilo vytvořit");
    chmod($slozka, 0777);
  }

  function url() {
    return $this->url . '?v' . $this->timestamp;
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
function getRelativePath($from, $to) {
    // some compatibility fixes for Windows paths
    //$from = is_dir($from) ? rtrim($from, '\/') . '/' : $from;
    //$to   = is_dir($to)   ? rtrim($to, '\/') . '/'   : $to;
    $from = str_replace('\\', '/', $from);
    $to   = str_replace('\\', '/', $to);
    $from = normalizePath($from);
    $to   = normalizePath($to);

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

/**
 * Pomocná funkce na "reslovnutí" .. v cestě, aniž by bylo potřeba chodit
 * do filesystému.
 */
function normalizePath($cesta) {
  // reg. výraz pro "/něco/.."
  static $vyraz = '/[^/]+/\.\.';

  do {
    $cesta = preg_replace("#$vyraz#", '', $cesta, 1, $pocetZmen);
  } while($pocetZmen > 0);

  return $cesta;
}
