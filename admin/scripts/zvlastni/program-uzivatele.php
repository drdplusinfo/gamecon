<?php

if(!$uPracovni) {
  echo 'Není vybrán uživatel.';
  return;
}

// TODO měnění počtu lidí v družinách i kde nejsem přihlášen - možná zatím ne, ale info bude pičovat, že neumí / nechce hledat člověka přihlášeného v družině
// TODO 'zpetne' - zpětné měnění účasti na aktivitách

$program = new Program($uPracovni, ['technicke' => true]);

$program->zpracujAjax();

?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Program uživatele</title>
  <?=$program->htmlHlavicky()?>
  <style>
    .detailUzivatele {
      text-align: left;
      font-size: 16px;
      position: fixed;
      top: 0; left: 0;
      width: 350px;
      padding: 10px;
      color: #fff;
      background-color: rgba(0,0,0,0.8);
      border-bottom-right-radius: 12px;
      z-index: 10;
    }
    .zavrit {
      float: right;
      width: 100px;
      height: 40px;
    }
  </style>
</head>
<body>

  <div class="detailUzivatele">
    <input type="button" value="Zavřít" onclick="window.location = '<?=URL_ADMIN?>/uvod'" class="zavrit">
    <div><?=$uPracovni->jmenoNick()?></div>
    <div id="stavUctu">TODO stav účtu</div>
    <!-- TODO: stav se musí dynamicky načítat při změně přihlášení, na což je potřeba rozchodit callbacky v programu -->
  </div>

  <?=$program->htmlObsah()?>

  <?php profilInfo(); ?>

</body>
</html>
