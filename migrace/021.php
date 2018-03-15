<?php

$this->q("

ALTER TABLE akce_seznam ADD doporucena TINYINT NOT NULL AFTER popis_kratky;

");
