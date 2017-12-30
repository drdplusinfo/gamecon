<?php

require __DIR__ . '/../nastaveni/zavadec.php';

if(HTTPS_ONLY) httpsOnly();

header('Content-Type: text/plain');

// migrace databáze (případně zobrazí formulář a zastaví)
(new Flee([
  'migrationFolder' =>  __DIR__ . '/../migrace',
  'backupFolder'    =>  SPEC . '/db-backup',
  'user'            =>  DBM_USER,
  'password'        =>  DBM_PASS,
  'server'          =>  DBM_SERV,
  'database'        =>  DBM_NAME,
]))
  ->strategy(Flee::DB_VARS_TABLE)
  ->autorollback(false)
  ->promptmigrate(MIGRACE_HESLO);

// vytvoření demo dat v databázi, pokud to chceme
if(defined('MIGRACE_DEMO_DATA') && MIGRACE_DEMO_DATA) {
  (new Flee([
    'migrationFolder' =>  __DIR__ . '/../migrace/dev',
    'backupFolder'    =>  SPEC . '/db-backup-dev',
    'user'            =>  DBM_USER,
    'password'        =>  DBM_PASS,
    'server'          =>  DBM_SERV,
    'database'        =>  DBM_NAME,
    'branch'          =>  'development'
  ]))
    ->autorollback(true)
    ->automigrate();
}

echo "Zadne zmeny\n"; // bez diakritiky kvůli výpisům např. v git-gui
