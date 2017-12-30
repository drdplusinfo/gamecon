<?php

$this->bezStranky(true);

$uzivatel = $this->param('u');
$program = new Program($uzivatel);

$program->zpracujAjax();

?>
<!DOCTYPE html>
<html>
<head>
  <title>My First React Example</title>
  <script>
    function mojeNotifikace() {
      alert('něco se stalo');
    }
  </script>
  <?php $program->zaregistrujJsObserver('mojeNotifikace') ?>
  <?=$program->htmlHlavicky()?>
</head>
<body style="margin-top: 4em;">

  <div style="background-color: #000; color: #fff; position: fixed; top: 0; left: 0; width: 100%; line-height: 3em;">
    <div style="margin: 0 1em">
      Přihlášen: <?=$uzivatel ? $uzivatel->jmenoNick() : '<i>nikdo</i>'?>
    </div>
  </div>

  <?=$program->htmlObsah()?>

</body>
</html>
