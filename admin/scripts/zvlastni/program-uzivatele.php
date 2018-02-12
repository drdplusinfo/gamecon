<?php

if(!$uPracovni) {
  echo 'Není vybrán uživatel.';
  return;
}

if(post('ajaxZustatek')) {
  echo $uPracovni->finance()->stavHr();
  return;
}

// TODO měnění počtu lidí v družinách i kde nejsem přihlášen - možná zatím ne, ale info bude pičovat, že neumí / nechce hledat člověka přihlášeného v družině

$program = new Program($uPracovni, [
  'technicke' =>  true,
  'zpetne'    =>  $uPracovni->maPravo(P_ZMENA_HISTORIE),
]);
$program->pridejJsObserver('aktualizujZustatek');
$program->zpracujAjax();

?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Program uživatele</title>
  <?=$program->htmlHlavicky()?>
  <script>
    function aktualizujZustatek() {
      var data = new FormData()
      data.append('ajaxZustatek', true)
      var xhr = new XMLHttpRequest()
      xhr.onreadystatechange = function () {
        if (this.readyState != 4 || this.status != 200) return
        document.getElementById('stavUctu').innerHTML = this.responseText
      }
      xhr.open('POST', window.location.href)
      xhr.send(data)
    }
  </script>
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
    <div id="stavUctu"><?=$uPracovni->finance()->stavHr()?></div>
  </div>

  <?=$program->htmlObsah()?>

  <?php profilInfo(); ?>

</body>
</html>
