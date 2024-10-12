<?php
// Caminho para o arquivo JSON
$jsonFile = '../list/desenho_list.json';

// Função para converter a primeira letra de uma string para maiúscula
function capitalizeFirstLetter($string)
{
    return ucfirst($string);
}

// Função para ordenar os dados do JSON por título
function sortJsonByTitle($jsonArray)
{
    // Verifica se a categoria "history" existe no array
    $historyCategory = null;
    foreach ($jsonArray as $key => $category) {
        if ($key === 'history') {
            $historyCategory = $category;
            unset($jsonArray[$key]); // Remove a categoria "history" temporariamente para não ser reordenada
            break;
        }
    }

    // Verifica se a categoria "history" foi encontrada
    if ($historyCategory !== null) {
        // Adiciona a categoria "history" de volta ao array sem reordenar
        $jsonArray['history'] = $historyCategory;
    }

    // Ordena apenas as categorias que não são "history"
    foreach ($jsonArray as $categoryKey => &$category) {
        if ($categoryKey !== 'history') {
            usort($category, function ($a, $b) {
                return strcmp($a['title'], $b['title']);
            });
        }
    }

    return $jsonArray;
}

// Função para verificar se o título já existe
function checkTitleExists($title, $jsonArray) {
    foreach ($jsonArray as $category) {
        foreach ($category as $node) {
            if ($node['title'] === $title) {
                return true;
            }
        }
    }
    return false;
}

// Verifica o método da solicitação
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recebe os dados do formulário
    $data = json_decode(file_get_contents('php://input'), true);

    // Verifica se os dados foram recebidos corretamente
    if ($data && is_array($data) && isset ($data['title']) && isset ($data['image']) && isset ($data['url'])) {
        // Converte a primeira letra do título para maiúscula
        $title = capitalizeFirstLetter($data['title']);

        // Verifica se o título já existe
        $jsonContent = file_get_contents($jsonFile);
        $jsonArray = json_decode($jsonContent, true);
        if (checkTitleExists($title, $jsonArray)) {
            // Retorna uma resposta de erro se o título já existir
            http_response_code(400);
            echo json_encode(array('message' => 'Título já existe.'));
            exit; // Termina a execução do script aqui, já que encontramos um título duplicado
        }

        // Obtém a primeira letra do título para determinar a categoria
        $firstLetter = mb_substr($title, 0, 1);

        // Verifica se a primeira letra é alfabética
        if (preg_match('/[A-Za-z]/', $firstLetter)) {
            // Converte a primeira letra para maiúscula
            $firstLetter = strtoupper($firstLetter);
        } else {
            // Se não for alfabética, define a categoria como '#'
            $firstLetter = '#';
        }

        // Lê o conteúdo atual do JSON
        $jsonContent = file_get_contents($jsonFile);

        // Decodifica o conteúdo JSON para um array PHP
        $jsonArray = json_decode($jsonContent, true);

        // Verifica se a categoria existe no JSON
        if (array_key_exists($firstLetter, $jsonArray)) {
            // Adiciona os novos dados à categoria correspondente
            $jsonArray[$firstLetter][] = array(
                'title' => $title,
                'image' => $data['image'],
                'url' => $data['url']
            );

            // Ordena os dados por título
            $jsonArray = sortJsonByTitle($jsonArray);

            // Verifica se a categoria "history" atingiu o limite de tamanho desejado
            $maxHistoryNodes = 10; // Defina o número máximo de nós na categoria "history"
            if (isset ($jsonArray['history']) && count($jsonArray['history']) >= $maxHistoryNodes) {
                // Remove o último nó da categoria "history"
                array_pop($jsonArray['history']);
            }

            // Adiciona o novo nó no topo da categoria "history"
            array_unshift(
                $jsonArray['history'],
                array(
                    'title' => $title,
                    'image' => $data['image'],
                    'url' => $data['url']
                )
            );


            // Codifica o array PHP de volta para JSON
            $newJsonContent = json_encode($jsonArray, JSON_PRETTY_PRINT);

            // Escreve o novo conteúdo no arquivo JSON
            file_put_contents($jsonFile, $newJsonContent);

            // Retorna uma resposta de sucesso
            http_response_code(200);
            echo json_encode(array('message' => 'Conteúdo adicionado com sucesso.'));
        } else {
            // Retorna uma resposta de erro se a categoria não existir
            http_response_code(400);
            echo json_encode(array('message' => 'Categoria inválida.'));
        }
    } else {
        // Retorna uma resposta de erro se os dados forem inválidos ou incompletos
        http_response_code(400);
        echo json_encode(array('message' => 'Dados inválidos ou incompletos.'));
    }
} else {
    // Retorna uma resposta de erro para métodos de solicitação diferentes de POST
    http_response_code(405);
    echo json_encode(array('message' => 'Método não permitido.'));
}