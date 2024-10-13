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

        // Extrai as categorias (letras) dos dados
        const categories = Object.keys(data);

        // Criação do menu
        const menu = document.getElementById('menu');

        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category;
            button.classList.add('category-button');
            button.addEventListener('click', () => showAnimesByCategory(data[category]));

            if (category === 'history') {
                button.id = 'history-button';
            }

            menu.appendChild(button);
        });

        // Remove o botão da categoria "history"
        const historyButton = document.getElementById('history-button');
        if (historyButton) {
            historyButton.remove();
        }

        // Exibir inicialmente a categoria "history" (ou outra categoria desejada)
        const initialCategory = 'history';
        showAnimesByCategory(data[initialCategory]);

        // Criação da caixa de pesquisa
        const searchContainer = document.getElementById('searchContainer');
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Pesquisar Animes';
        searchInput.id = 'searchInput';

        // Adiciona a caixa de pesquisa ao seu container
        searchContainer.appendChild(searchInput);

       // Criação do botão de pesquisa
const searchButton = document.createElement('button');
searchButton.id = 'searchButton';

// Cria o ícone da lupa
const searchIcon = document.createElement('i');
searchIcon.classList.add('fas', 'fa-search'); // Adiciona as classes para o ícone da Font Awesome
searchButton.appendChild(searchIcon); // Adiciona o ícone ao botão de pesquisa

// Adiciona o botão de pesquisa ao seu container
searchContainer.appendChild(searchButton);

// Adiciona evento para pesquisa ao pressionar "Enter"
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                searchByAnime(data);
            }
        });

        // Adiciona evento de clique ao botão de pesquisa
        searchButton.addEventListener('click', function () {
            searchByAnime(data);
        });

    } catch (error) {
        console.error('Erro ao carregar o JSON:', error);
    }
});

// Função para mostrar animes por categoria
function showAnimesByCategory(animes) {
    const animeGrid = document.getElementById('animeGrid');
    animeGrid.innerHTML = '';

    // Obtém a URL armazenada no localStorage
    const urlBase = localStorage.getItem('url');

    if (animes && animes.length > 0) {
        animes.forEach(anime => {
            const animeCard = document.createElement('div');
            animeCard.classList.add('animeCard');

            const title = document.createElement('h3');
            title.textContent = anime.title;

            const imageLink = document.createElement('a');

            // Verifica se a URL base está armazenada
            if (urlBase) {
                // Concatena a URL do localStorage com anime.url
                const fullUrl = urlBase + anime.url;
                imageLink.href = fullUrl; // Define o URL concatenado
            } else {
                console.error("URL base não encontrada no localStorage.");
                imageLink.href = anime.url; // Se não houver URL base, usa a URL do anime
            }

            imageLink.target = "_blank";

            const image = document.createElement('img');
            image.src = anime.image;

            imageLink.appendChild(image);
            animeCard.appendChild(title);
            animeCard.appendChild(imageLink);

            animeGrid.appendChild(animeCard);
        });
    } else {
        const noAnimeMessage = document.createElement('p');
        noAnimeMessage.textContent = 'Nenhum anime encontrado nesta categoria.';
        animeGrid.appendChild(noAnimeMessage);
    }
}


// Função para pesquisar por anime
function searchByAnime(data) {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();

    // Filtra os animes que correspondem ao termo de pesquisa, excluindo a categoria 'history'
    const matchingAnimes = [];

    Object.keys(data).forEach(category => {
        if (category.toLowerCase() !== 'history') {
            data[category].forEach(anime => {
                if (anime.title.toLowerCase().includes(searchTerm)) {
                    matchingAnimes.push(anime);
                }
            });
        }
    });

    // Exibe os animes correspondentes ou uma mensagem se nenhum for encontrado
    showAnimesByCategory(matchingAnimes);
}
