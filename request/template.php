<?php
// Permitir acesso de qualquer origem
header("Access-Control-Allow-Origin: *");

// Ler o conteúdo do arquivo anime_list.json e exibi-lo
echo file_get_contents('anime_list.json');
?>
