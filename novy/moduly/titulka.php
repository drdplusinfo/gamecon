<?php

$this->bezMenu(true);
$this->bezDekorace(true);

$t->assign(array(
  'menu'    =>  $menu,
  'blog'    =>  Novinka::zNejnovejsi(Novinka::BLOG),
  'novinka' =>  Novinka::zNejnovejsi(Novinka::NOVINKA),
));
