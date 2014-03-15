<?php

/**
 * Datum a čas s českými názvy dnů a měsíců + další vychytávky
 */ 

class DateTimeCz extends DateTime
{

  protected static $dny = array(
    'Monday'    => 'pondělí',
    'Tuesday'   => 'úterý',
    'Wednesday' => 'středa',
    'Thursday'  => 'čtvrtek',
    'Friday'    => 'pátek',
    'Saturday'  => 'sobota',
    'Sunday'    => 'neděle'
  );

  /** Formát data s upravenými dny česky */
  function format($f)
  {
    return strtr(parent::format($f), self::$dny);
  }

  /** Vrací formát kompatibilní s mysql */
  function formatDb()
  {
    return $this->format('Y-m-d H:i:s');
  }

  /** Zvýší časový údaj o jeden den. Upravuje objekt. */
  function plusDen()
  {
    $this->add(new DateInterval('P1D'));
  }

  /** Jestli je tento okamžik před okamžikem $d2 */
  function pred($d2)
  {
    if($d2 instanceof DateTime)
      return $this->getTimestamp() < $d2->getTimestamp();
    else
      return $this->getTimestamp() < strtotime($d2);
  }

  /** Vrací relativní formát času vůči současnému okamžiku */
  function relativni()
  {
    $rozdil = time() - $this->getTimestamp();
    if($rozdil < 0)
      return 'v budoucnosti';
    if($rozdil < 60)
      return "před $rozdil vteřinami";
    if($rozdil < 60*60)
      return 'před '.round($rozdil/60).' minutami';
    if(!$dny = $this->rozdilDne(new self())) // dnes
      return $this->format('G:i');
    else
      return $dny;
  }
  
  /**
   * Vrátí „včera“, „předevčírem“, „pozítří“ apod. (místo dnes vrací emptystring)
   */     
  function rozdilDne(DateTime $od)
  {
    $od=clone $od; // nutné znulování času pro funkční porovnání počtu dní
    $od->setTime(0,0);
    $do=clone $this;
    $do->setTime(0,0);
    $diff=(int)$od->diff($do)->format('%r%a');
    switch($diff)
    {
      case -2: return 'předevčírem';
      case -1: return 'včera';
      case 0: return '';
      case 1: return 'zítra';
      case 2: return 'pozítří';
      default:
        if($diff<0)
          return 'před '.(-$diff).' dny';
        else if($diff<5)
          return "za $diff dny";
        else
          return "za $diff dní";
    }
  }

  /** Jestli tento den je stejný s $d2 v formátu DateTime nebo string s časem */
  function stejnyDen($d2)
  {
    if(!($d2 instanceof DateTime))
      $d2 = new self($d2);
    return $this->format('Y-m-d') == $d2->format('Y-m-d');
  }
  
  /** Zaokrouhlí nahoru na nejbližší vyšší jednotku */
  function zaokrouhlitNahoru($jednotka='H')
  {
    //TODO jednotka
    if($this->format('is')==='0000')
      return $this->modify($this->format('Y-m-d H:00:00'));
    else
      return $this->modify($this->format('Y-m-d H:00:00'))->add(new DateInterval('PT1H'));
  }
          
}
