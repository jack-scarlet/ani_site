document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Carrega os dados do JSON
        const response = await fetch('../list/desenho_list.json');
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
        searchInput.placeholder = 'Pesquisar Desenhos';
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

    if (animes && animes.length > 0) {
        animes.forEach(anime => {
            const animeCard = document.createElement('div');
            animeCard.classList.add('animeCard');

            const title = document.createElement('h3');
            title.textContent = anime.title;

            const imageLink = document.createElement('a');
            imageLink.href = anime.url;
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
        noAnimeMessage.textContent = 'Nenhum Desenho encontrado nesta categoria.';
        animeGrid.appendChild(noAnimeMessage);
    }
}

// Função para pesquisar por manga
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

    // Exibe os mangas correspondentes ou uma mensagem se nenhum for encontrado
    showAnimesByCategory(matchingAnimes);
}

