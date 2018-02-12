<?php

$program = new Program();

// zvětšení - nelze použít css vlastnost zoom (protože není podporována všemi
// prohlížeči) ani transform: scale (obsah vyteče mimo obraz)
$zoom = (int) get('zoom') ?: 100;
$fontSize = (int) floor($zoom * 0.16);

?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Program</title>
  <?=$program->htmlHlavicky()?>
  <style>
    body {
      font-family: tahoma, sans;
      font-size: <?=$fontSize?>px;
      text-align: center;
      background-color: #f0f0f0;
    }
    .lupa { display: block; width: 48px; height: 48px; position: absolute; background-size: 100%; opacity: 0.2; }
    .lupa.plus { background-image: url('files/design/lupa-plus.png'); }
    .lupa.minus { background-image: url('files/design/lupa-minus.png'); }
    .lupa:hover { opacity:1.0; }
  </style>
  <meta http-equiv="refresh" content="30">
</head>
<body>

  <a href="?zoom=<?=$zoom+10?>" class="lupa plus" style="top:0;left:0"></a>
  <a href="?zoom=<?=$zoom-10?>" class="lupa minus" style="top:48px;left:0"></a>

  <?=$program->htmlObsah()?>

</body>
</html>
