<?php
// Verifica se os dados foram recebidos via método POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recebe os dados do cliente
    $data = json_decode(file_get_contents('php://input'), true);

    // Verifica se o token foi recebido
    if (isset ($data['token'])) {
        // Lê o conteúdo atual do arquivo token.json
        $currentData = json_decode(file_get_contents('../list/token.json'), true);

        // Atualiza apenas o valor do token no array atual
        $currentData['token'] = $data['token'];

        // Converte os dados atualizados de volta para JSON
        $updatedJson = json_encode($currentData, JSON_PRETTY_PRINT);

        // Escreve os dados atualizados de volta no arquivo token.json
        file_put_contents('../list/token.json', $updatedJson);

        // Retorna uma resposta de sucesso para o cliente
        http_response_code(200);
        echo 'Token atualizado com sucesso.';
    } else {
        // Retorna uma resposta de erro para o cliente
        http_response_code(400);
        echo 'Token não recebido.';
    }
} else {
    // Retorna uma resposta de erro para o cliente se o método não for POST
    http_response_code(405);
    echo 'Método não permitido.';
}