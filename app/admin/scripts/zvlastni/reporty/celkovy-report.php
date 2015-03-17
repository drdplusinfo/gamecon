<?php

require_once('sdilene-hlavicky.hhp');

function ed($datum) { // excel datum
  if(!$datum) return null;
  return date('j.n.Y G:i', strtotime($datum));
}

function ec($cislo) { // excel číslo
  return str_replace('.', ',', $cislo);
}

function ut($typ) { // ubytování typ - z názvu předmětu odhadne typ
  return preg_replace('@ ?(pondělí|úterý|středa|čtvrtek|pátek|sobota|neděle) ?@i', '', $typ);
}

$gcDoted = array();
$maxRok = po(REG_GC_DO) ? ROK : ROK - 1;
for($i = 2009; $i <= $maxRok; $i++) {
  $gcDoted[$i] = 'účast '.$i;
}

$hlavicka1=array_merge(
  array('Účastník','','','','','','','','Datum narození','','','Bydliště','','','',
  'Ubytovací informace','','',''),
  array_fill(0,count($gcDoted),''),
  array('Celkové náklady','','',
  'Ostatní platby','','','','','','','','','','','')
);
$hlavicka2=array_merge(
  array('ID','Příjmení','Jméno','Přezdívka','Mail','Pozice','Datum registrace','Prošel infopultem','Den','Měsíc','Rok','Stát','Město','Ulice',
  'PSČ','První noc','Poslední noc (počátek)','Typ','Dorazil na GC'),
  $gcDoted,
  array(
  'Celkem dní','Cena / den','Ubytování','Předměty',
  'Aktivity','vypravěčská sleva využitá','vypravěčská sleva přiznaná','stav','zůstatek z minula','připsané platby','první blok','poslední blok','Slevy','Objednávky','Škola')
);
$o=dbQuery('
  SELECT 
    u.*,
    z.posazen,
    ( SELECT MIN(p.ubytovani_den) FROM shop_nakupy n JOIN shop_predmety p USING(id_predmetu) WHERE n.rok='.ROK.' AND n.id_uzivatele=z.id_uzivatele AND p.typ=2 ) den_prvni, 
    ( SELECT MAX(p.ubytovani_den) FROM shop_nakupy n JOIN shop_predmety p USING(id_predmetu) WHERE n.rok='.ROK.' AND n.id_uzivatele=z.id_uzivatele AND p.typ=2 ) as den_posledni,
    ( SELECT MAX(p.nazev) FROM shop_nakupy n JOIN shop_predmety p USING(id_predmetu) WHERE n.rok='.ROK.' AND n.id_uzivatele=z.id_uzivatele AND p.typ=2 ) as ubytovani_typ,
    pritomen.posazen as prosel_info
  FROM r_uzivatele_zidle z
  JOIN uzivatele_hodnoty u ON(z.id_uzivatele=u.id_uzivatele)
  LEFT JOIN r_uzivatele_zidle pritomen ON(pritomen.id_zidle = $1 AND pritomen.id_uzivatele = u.id_uzivatele)
  WHERE z.id_zidle='.Z_PRIHLASEN.'
  ', [Z_PRITOMEN]);
if(mysql_num_rows($o)==0) 
  exit('V tabulce nejsou žádná data.');

$obsah[] = $hlavicka2;
while($r=mysql_fetch_assoc($o))
{
  $un=new Uzivatel($r);
  $un->nactiPrava(); //sql subdotaz, zlo
  $stav='účastník';
  if($un->maZidli(Z_ORG))                                 $stav = 'organizátor';
  elseif($un->maZidli(Z_INFO) || $un->maZidli(Z_ZAZEMI))  $stav = 'zázemí/infopult';
  elseif($un->maZidli(Z_ORG_AKCI))                        $stav = 'vypravěč';
  elseif($un->maZidli(Z_PARTNER))                         $stav = 'partner';
  $ucastiHistorie=array();
  foreach($gcDoted as $rok => $nul)
    $ucastiHistorie[]=$un->maPravo((int)( '-'.substr($rok,2).'02' ))?'ano':'ne';
  //datum
  $denPrvni=new DateTime(DEN_PRVNI_DATE);
  $stat = '';
  try { $stat = $un->stat(); } catch(Exception $e) {}
  $obsah[] = array_merge(
    array(
      $r['id_uzivatele'],
      $r['prijmeni_uzivatele'],
      $r['jmeno_uzivatele'],
      $r['login_uzivatele'],
      $r['email1_uzivatele'],
      $stav,
      ed($r['posazen']),
      ed($r['prosel_info']),
      date('j',strtotime($r['datum_narozeni'])),
      date('n',strtotime($r['datum_narozeni'])),
      date('Y',strtotime($r['datum_narozeni'])),
      $stat,
      $r['mesto_uzivatele'],
      $r['ulice_a_cp_uzivatele'],
      $r['psc_uzivatele'],
      $r['den_prvni']!==null ? $denPrvni->add( DateInterval::createFromDateString(($r['den_prvni']-1).' days') )->format('j.n.Y') : '-',
      $r['den_posledni'] ? $denPrvni->add(new DateInterval('P'.($r['den_posledni']-$r['den_prvni']).'D'))->format('j.n.Y') : '-',
      ut($r['ubytovani_typ']),
      $un->gcPritomen()?'ano':'ne'
    ),
    $ucastiHistorie,
    array(
      $pobyt=( $r['den_prvni']!==null ? $r['den_posledni']-$r['den_prvni']+1 : 0 ),
      $pobyt ? $un->finance()->cenaUbytovani()/$pobyt : 0,
      $un->finance()->cenaUbytovani(),
      $un->finance()->cenaPredmety(),
      $un->finance()->cenaAktivity(),
      $un->finance()->slevaVypravecVyuzita(),
      $un->finance()->slevaVypravecMax(),
      ec($un->finance()->stav()),
      ec($r['zustatek']),
      ec($un->finance()->platby()),
      ed($un->prvniBlok()),
      ed($un->posledniBlok()),
      implode(", ",array_merge($un->finance()->slevyVse(),$un->finance()->slevyAktivity())),
      strip_tags(strtr($un->finance()->prehledHtml(),array('</tr>'=>", ", '</td>'=>' '))),
      $r['skola']
    )
  );
}

$report = Report::zPoli($hlavicka1, $obsah); // TODO druhá hlavička
$report->tCsv();
