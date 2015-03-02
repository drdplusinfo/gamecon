<?php

/**
 * Třída pro zpracování menu v hlavní stránce
 */ 

class Menu
{
  
  protected static $menu=array();
  protected static $hry=array();
  protected static $aktivniNazev='';
  
  /** Konstruktor to načte všechno */
  public function __construct()
  {
    $a=dbQuery('
      SELECT 
        nazev_akce as nazev, 
        CONCAT(url_typu,"/",MAX(url_akce)) as url, 
        typ,
        IF(patri_pod,-patri_pod,a.id_akce) as gid,
        COUNT(p.id_uzivatele) as prihlaseno,
        MAX(a.kapacita+a.kapacita_m+a.kapacita_f)*COUNT(DISTINCT a.id_akce) as kapacita
      FROM akce_seznam a
      JOIN akce_typy ON(id_typu=typ)
      LEFT JOIN akce_prihlaseni p ON(p.id_akce=a.id_akce)
      WHERE rok='.ROK.'
      AND (stav=1 OR stav=2 OR stav=4) 
      GROUP BY gid');
    $hry=array();
    while($r=mysql_fetch_assoc($a))
    {
      $typ=$r['typ'];
      unset($r['typ']);
      $r['priorita']=0;
      $hry[$typ][]=$r;
    }
    self::$hry=$hry; //hry uložíme pro možnost dalšího použití z venčí
    $a=dbQuery('
      SELECT m.*, a.*, IF(navazana_stranka,url_stranky,m.url) as url, a.url_typu as urlb 
      FROM menu m
      LEFT JOIN akce_typy a ON(navazana_aktivita=id_typu)
      LEFT JOIN stranky s ON(navazana_stranka=id_stranky)
      WHERE NOT m.skryta');
    $klice=array('nazev'=>0,'url'=>0,'priorita'=>0);
    while($r=mysql_fetch_assoc($a))
    {
      if($r['navazana_aktivita'] && !$r['nazev'])
      {
        $r['nazev']=ucfirst($r['typ_1pmn']);
        $r['url']=null; //nemuselo by tu být
      }
      $prvek=array_intersect_key($r,$klice);
      if($r['rodic'])
        self::$menu[$r['rodic']]['potomci'][]=$prvek;
      else
        self::$menu[$r['id_menu']]=$prvek;
      if($r['navazana_aktivita'])
      {
        if(!isset(self::$menu[$r['id_menu']]['potomci']))
          self::$menu[$r['id_menu']]['potomci']=array();
        self::$menu[$r['id_menu']]['potomci']=array_merge(isset($hry[$r['id_typu']])?$hry[$r['id_typu']]:array(),
          self::$menu[$r['id_menu']]['potomci']);
      }
    }
    self::seradit(self::$menu);
  }
  
  /** vrátí název (z menu) aktivní stránky */
  public function aktivniNazev()
  { return self::$aktivniNazev; }
  
  /** vrátí html kód menu */
  public function html($aktivniUrl=null)
  {
    $out='<ul>';
    foreach(self::$menu as $l1)
    {
      $aktivni=false;
      $l2kod='';
      if(isset($l1['potomci'])) //l2 zpracování ------------
      {
        $l2kod2='';
        foreach($l1['potomci'] as $l2)
        {
          if($l2['url'])
          {
            if($aktivniUrl && $l2['url']==$aktivniUrl)
            {
              $l2kod2.='<li><a href="'.$l2['url'].'" class="aktivni">'.$l2['nazev'].'</a></li>';
              self::$aktivniNazev=$l2['nazev'];
              $aktivni=true;
            }
            else
            {
              $l2kod2.='<li><a href="'.$l2['url'].'">'.$l2['nazev'].'</a></li>';
            }
          }
          else
          {
            $l2kod2.='<li>'.$l2['nazev'].'</li>';
          }
        }
        $l2kod='<ul'.($aktivni?' class="aktivni"':'').'><li class="submenuVrch"></li>'.$l2kod2.'<li class="submenuSpod"></li></ul>';
      } //konec l2 zpracování ------------------------------
      $vnitrekAktivni=$aktivni;
      $aktivni=($aktivniUrl && $l1['url'] && $l1['url']==$aktivniUrl);
      $maPotomky=isset($l1['potomci']);
      if($l1['url'])
      {
        if($aktivni)
          $out.='<li><a href="'.$l1['url'].'" class="aktivni">'.$l1['nazev'].$l2kod.'</a></li>';
        else
          $out.='<li><a href="'.$l1['url'].'">'.$l1['nazev'].$l2kod.'</a></li>';
      }
      else
      {
        if(/*$vnitrekAktivni &&*/ $maPotomky)
          $out.='<li class="rozbalovaci"><a onclick="rozbalit(this);return false">'.$l1['nazev'].'</a>'.$l2kod.'</li>';
        /* elseif(!$aktivni && $maPotomky)
          $out.='<li>'.$l1['nazev'].$l2kod.'</li>'; */ //zprovoznit, pokud je potřeba registrovat rozdíl
        else
          $out.='<li>'.$l1['nazev'].$l2kod.'</li>';
      }
    }
    $out.='</ul>';
    //javascriptové rozbalovátko
    $rozbalovatko="<script>
      function rozbalit(e){
        $(e).next().toggle();
      }
    </script>\n";
    return $rozbalovatko.$out;
  }
  
  /** vrací seznam všech her aktuálního roku, jak se načetly z DB */
  public function seznamHer()
  {
    return self::$hry;
  }
    
  /** seřadí to */
  static protected function seradit(&$cast)
  {
    foreach($cast as $k=>$i)
      if(isset($cast[$k]['potomci']))
        self::seradit($cast[$k]['potomci']);
    usort($cast,function($a,$b){
      $delta=$b['priorita']-$a['priorita'];
      if($delta===0)
      {
        if(substr($a['nazev'],0,-4)==substr($b['nazev'],0,-4))
        { //pokud se až na poslední 4 znaky shodnou (na konci může být rok => opačné řazení)
          $delta=(int)substr($b['nazev'],-4)-(int)substr($a['nazev'],-4);
          if($delta===0) //4 poslední znaky nejdou převést na int nebo jsou stejné, porovnáme tedy textově celé
            return strcmp($a['nazev'],$b['nazev']);
          else
            return $delta;
        }
        else
          return strcmp($a['nazev'],$b['nazev']);
      }
      else
        return $delta;
    });
  }
        
}

?>