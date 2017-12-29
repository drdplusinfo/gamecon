<?php

$this->bezStranky(true);

$uzivatel = rand(0,1) ? Uzivatel::zId(407) : null; // TODO demo data
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
<body>

  <?=$program->htmlObsah()?>

</body>
</html>
