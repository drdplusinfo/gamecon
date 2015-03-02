<?php

/**
 * Boční sloupek na hlavní uživatelské stránce
 */ 

class Sloupek
{
  protected $hry;
  protected $typy;
  
  /**
   * @param array $hry index 1 je id typu, vnitřek obsahuje řádky z tabulky
   * @todo výhledově přidělat volbu zobrazovaných typů aktivit (koliduje zas
   * s sloučením bonusů a larpů a věci)
   */        
  function __construct($hry)
  {
    $this->hry=$hry;
    //načtení informací o typech z db - kovbojové mohou zakomentovat a napráskat ručně
    $o=dbQuery('
      SELECT t.*, s.url_stranky as url_o
      FROM akce_typy t
      LEFT JOIN stranky s ON(stranka_o=id_stranky)');
    while($r=mysql_fetch_assoc($o))
      $this->typy[$r['id_typu']]=$r;
  }
  
  /**
   * Naplní zadanou šablonu políčky a vyrenderuje.
   * @param string $template cesta k šabloně   
   */     
  function zXtpl($template)
  {
    $tpl=new XTemplate($template);
    $tpl->assign($this->policko(2,7));
    $tpl->parse('sloupek.bunka');
    $tpl->assign($this->policko(4,8));
    $tpl->parse('sloupek.bunka');
    $tpl->assign($this->policko(3,5));
    $tpl->parse('sloupek.bunka');
    $tpl->assign($this->policko(1,6));
    $tpl->parse('sloupek.bunka');
    $tpl->parse('sloupek');
    return $tpl->text('sloupek');
  }
  
  /**
   * Vrátí náplň pro políčko (hru, pokud jsou daného typu a běží reg nebo 
   * obecný obsah na "o typu aktivity na GC" pokud ne)      
   */        
  protected function policko($typa,$typb=null)
  {
    if($typb)
    { 
      $hry=array();
      $hrya=isset($this->hry[$typa]) ? $this->hry[$typa] : array();
      $hryavc=0; //počet volných her A
      for($i=count($hrya)-1;$i>=0;$i--)
        if(!$hrya[$i]['kapacita'] || $hrya[$i]['kapacita']>$hrya[$i]['prihlaseno']) { $hry[]=$i; $hryavc++; }
      $hryb=isset($this->hry[$typb]) ? $this->hry[$typb] : array();
      for($i=count($hryb)-1;$i>=0;$i--)
        if(!$hryb[$i]['kapacita'] || $hryb[$i]['kapacita']>$hryb[$i]['prihlaseno'])   $hry[]=$i;
      $i=rand(-2,count($hry)-1);
      if($i<0)            $hra=$i;
      elseif($i<$hryavc)  $hra=$hrya[$hry[$i]];
      else                $hra=$hryb[$hry[$i]];
      return $this->polickoHra($hra,$typa,$typb);
    }
    else
    { //z jedné kategorie
      $poca=isset($this->hry[$typa])?count($this->hry[$typa]):0;
      $i=rand(0,$poca-1+1); //-1 jako index do pole, +1 za "o aktivitě na GC"
      if($i<$poca)
        return $this->polickoHra($this->hry[$typa][$i],$typa);
      else
        return $this->polickoHra(-1,$typa);
    }
  }
  
  /**
   * Vrací naformátované pole hodnot pro políčko konkrétního typu (typů) a hry.
   * -1 znamená obecné info pro typA, -2 pro typB   
   */     
  protected function polickoHra($hra,$typa,$typb=null)
  {
    $nadpis=''.ucfirst($this->typy[$typa]['typ_1pmn']).($typb?' & '.
      ucfirst($this->typy[$typb]['typ_1pmn']):'');
    if(is_array($hra))
    {
      return array(
        'nadpis'=>$nadpis,
        'nazev'=>$hra['nazev'],
        'url'=>$hra['url'],
        'urlObrazku'=>'files/systemove/aktivity/'.
          substr($hra['url'], strrpos($hra['url'],'/')).'.jpg');
    }
    elseif($hra==-1)
    {
      return array(
        'nadpis'=>$nadpis,
        'nazev'=>ucfirst($this->typy[$typa]['typ_1pmn']),
        'url'=>$this->typy[$typa]['url_o'],
        'urlObrazku'=>'files/systemove/o-typu/'.$typa.'.jpg');
    }
    elseif($hra==-2)
    {
      return array(
        'nadpis'=>$nadpis,
        'nazev'=>ucfirst($this->typy[$typb]['typ_1pmn']),
        'url'=>$this->typy[$typb]['url_o'],
        'urlObrazku'=>'files/systemove/o-typu/'.$typb.'.jpg');
    }
  }  
     
}