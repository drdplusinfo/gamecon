<?php

require_once __DIR__ . '/../nastaveni/zavadec-zaklad.php';

$am = new Godric\AssetManager\AssetManager(CACHE . '/sestavene', URL_CACHE . '/sestavene');
$am->setConfig(__DIR__ . '/../assety.json');
$am->buildClean();
