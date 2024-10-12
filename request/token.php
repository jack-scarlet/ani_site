<?php
// Verifica se os dados foram recebidos via método POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recebe os dados do cliente
    $data = json_decode(file_get_contents('php://input'), true);

    // Verifica se o token foi recebido
    if (isset ($data['token'])) {
        // Salva o token em um arquivo (por exemplo, "token.txt")
        file_put_contents('../list/token.json', $data['token']);
        // Retorna uma resposta de sucesso para o cliente
        http_response_code(200);
        echo 'Token salvo com sucesso.';
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