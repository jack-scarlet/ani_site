<?php
// Verifica se a solicitação é do tipo POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtém os dados enviados via POST
    $requestData = json_decode(file_get_contents('php://input'), true);

    // Verifica se os dados necessários foram recebidos
    if (isset($requestData['title']) && isset($requestData['newURL'])) {
        // Caminho para o arquivo JSON a ser atualizado
        $jsonFilePath = '../list/manga_list.json';

        // Carrega o conteúdo do arquivo JSON
        $jsonData = file_get_contents($jsonFilePath);

        // Decodifica o JSON em um array associativo
        $data = json_decode($jsonData, true);

        // Define uma variável para rastrear se uma atualização foi feita
        $updated = false;

        // Itera sobre as categorias e mangas para encontrar o manga com o título correspondente
        foreach ($data as &$category) {
            foreach ($category as &$anime) {
                if ($anime['title'] === $requestData['title']) {
                    // Verifica se o campo da nova URL da imagem não está vazio
                    if (!empty($requestData['newImage'])) {
                        // Atualiza a URL da imagem do manga
                        $anime['image'] = $requestData['newImage'];
                    }

                    // Atualiza a URL do manga
                    $anime['url'] = $requestData['newURL'];
                    
                    // Define a flag de atualização como verdadeira
                    $updated = true;
                }
            }
        }

        // Se uma atualização foi feita, salva o JSON atualizado no arquivo
        if ($updated) {
            // Codifica o array de dados atualizado de volta para JSON
            $updatedJsonData = json_encode($data, JSON_PRETTY_PRINT);
            // Escreve o JSON atualizado de volta no arquivo
            file_put_contents($jsonFilePath, $updatedJsonData);
            // Retorna uma mensagem de sucesso
            echo json_encode(array('message' => 'URL e imagem atualizadas com sucesso.'));
            // Termina a execução do script
            exit;
        }
    }
}

// Se não for uma solicitação POST válida ou se os dados necessários não forem recebidos, retorna um erro
http_response_code(400);
echo json_encode(array('message' => 'Erro: solicitação inválida ou dados ausentes.'));
