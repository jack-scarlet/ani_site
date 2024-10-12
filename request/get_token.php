<?php
// Caminho para o arquivo JSON contendo o token
$json_file = '../list/token.json';

// Ler o conteúdo do arquivo JSON
$json_data = file_get_contents($json_file);

// Enviar o JSON de volta como resposta
header('Content-Type: application/json');
echo $json_data;