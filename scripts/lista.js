 // Função para mostrar o alerta e armazenar a URL
        function solicitarUrl() {
            // Verifica se a URL já está armazenada
            const urlArmazenada = localStorage.getItem('url');
            if (!urlArmazenada) {
                const url = prompt("Digite uma URL:");
                if (url) {
                    // Armazena a URL no localStorage
                    localStorage.setItem('url', url);
                }
            }
        }

        // Chama a função ao carregar a página
        window.onload = solicitarUrl;

document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Carrega os dados do JSON
        const response = await fetch('../list/anime_list.json');
        const data = await response.json();
<!DOCTYPE html>
<html lang="en">

        // Extrai as categorias (letras) dos dados
        const categories = Object.keys(data);
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menu</title>
    <link rel="stylesheet" type="text/css" href="style/estilo.css" media="screen" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <script src="scripts/lista.js?v=20240315" defer></script>

        // Criação do menu
        const menu = document.getElementById('menu');
</head>

        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category;
            button.classList.add('category-button');
            button.addEventListener('click', () => showAnimesByCategory(data[category]));
<body>

            if (category === 'history') {
                button.id = 'history-button';
            }

            menu.appendChild(button);
        });
    <div id="botop">
        <a href='/pages/manga_list_index'><button id="botaoMangas" class="botao-mangas botao">Mangas</button></a>
        <a href='/pages/desenho_index'><button id="botaoDesenhos" class="botao-desenhos botao">Desenhos</button></a>
    </div>

        // Remove o botão da categoria "history"
        const historyButton = document.getElementById('history-button');
        if (historyButton) {
            historyButton.remove();
        }
    <div id="menu"></div>

        // Criação da caixa de pesquisa
        const searchContainer = document.getElementById('searchContainer');
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Pesquisar Anime';
        searchInput.id = 'searchInput';
    <div id="searchContainer"></div>

        // Adiciona a caixa de pesquisa ao seu container
        searchContainer.appendChild(searchInput);
    <button id="botaoDesenhos" class="botao-desenhos botao">Nuvem</button>

        // Criação do botão de pesquisa
        const searchButton = document.createElement('button');
        searchButton.id = 'searchButton';
    <div id="animeGrid"></div>

        // Cria o ícone da lupa
        const searchIcon = document.createElement('i');
        searchIcon.classList.add('fas', 'fa-search'); // Adiciona as classes para o ícone da Font Awesome
        searchButton.appendChild(searchIcon); // Adiciona o ícone ao botão de pesquisa
    <!-- Botão para apagar a URL do localStorage -->
    <button id="apagarUrlButton">Apagar URL Armazenada</button>

        // Adiciona o botão de pesquisa ao seu container
        searchContainer.appendChild(searchButton);
    <script>
  
        // Garante que o script só seja executado após o carregamento do DOM
        document.addEventListener('DOMContentLoaded', function() {
            // Função para apagar a URL do localStorage e recarregar a página
            function apagarUrl() {
                // Remove a URL armazenada no localStorage
                localStorage.removeItem('url');
                alert("URL removida do localStorage.");

        // Adiciona evento para pesquisa ao pressionar "Enter"
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                searchByAnime(data);
                // Recarrega a página
                location.reload();
}
        });

        // Adiciona evento de clique ao botão de pesquisa
        searchButton.addEventListener('click', function () {
            searchByAnime(data);
        });

        // Exibir inicialmente a categoria "history" (ou outra categoria desejada)
        const initialCategory = 'history';
        showAnimesByCategory(data[initialCategory]);
    } catch (error) {
        console.error('Erro ao carregar o JSON:', error);
    }
});

// Função para mostrar animes por categoria
function showAnimesByCategory(animes) {
    const animeGrid = document.getElementById('animeGrid');
    animeGrid.innerHTML = '';

    if (animes && animes.length > 0) {
        animes.forEach(anime => {
            const animeCard = document.createElement('div');
            animeCard.classList.add('animeCard');

            // Cria o título do anime com um tooltip
            const title = document.createElement('h3');
            title.textContent = anime.title;
            title.title = anime.title; // Define o texto do tooltip como o título do anime

            const imageLink = document.createElement('a');
            imageLink.href = `pages/anime_list.html?id=${anime.id}`; // Passa o id do anime como parâmetro de consulta na URL

            imageLink.target = "_blank";

            const image = document.createElement('img');
            image.src = anime.image;

            imageLink.appendChild(image);

            animeCard.appendChild(title);
            animeCard.appendChild(imageLink);

            animeGrid.appendChild(animeCard);
            // Associa a função ao botão (verifica se o botão com ID 'apagarUrlButton' existe)
            const apagarUrlButton = document.getElementById('apagarUrlButton');
            if (apagarUrlButton) {
                apagarUrlButton.addEventListener('click', apagarUrl);
            }
});
    } else {
        const noAnimeMessage = document.createElement('p');
        noAnimeMessage.textContent = 'Nenhum anime encontrado nestaa categoria.';
        animeGrid.appendChild(noAnimeMessage);
    }
}

// Função para pesquisar por anime
function searchByAnime(data) {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();

    // Filtra os animes que correspondem ao termo de pesquisa, excluindo a categoria 'history'
    const matchingAnimes = [];
    </script>

    Object.keys(data).forEach(category => {
        if (category.toLowerCase() !== 'history') {
            data[category].forEach(anime => {
                if (anime.title.toLowerCase().includes(searchTerm)) {
                    matchingAnimes.push(anime);
                }
            });
        }
    });
</body>

    // Exibe os animes correspondentes ou uma mensagem se nenhum for encontrado
    showAnimesByCategory(matchingAnimes);
}
</html>
