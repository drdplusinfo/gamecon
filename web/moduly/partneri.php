<?php

$this->bezDekorace(true);

foreach(['normalni', 'hlavni'] as $kategorie) {
  foreach(glob("soubory/obsah/partneri/{$kategorie}/*") as $f) {
    $fn = preg_replace('@.*/(.*)\.(jpg|png|gif|svg)@', '$1', $f, -1, $n);
    if($fn[0] == '_' || $n == 0) continue; // skrývání odebraných sponzorů
    $t->assign([
      'url' => $fn,
      'img' => $f,
    ]);
    $t->parse("partneri.$kategorie");
  }
}
