// Função para mostrar o alerta e armazenar a URL
function solicitarUrl() {
    const urlArmazenada = localStorage.getItem('url');
    if (!urlArmazenada) {
        const url = prompt("Cole o link da nuvem aqui:");
        if (url) {
            localStorage.setItem('url', url);
        }
    }
}

// Chama a função ao carregar a página
window.onload = solicitarUrl;

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('../list/anime_list.json');
        const data = await response.json();

        // Extrai as categorias (letras) dos dados
        const categories = Object.keys(data);

        // Criação do menu de categorias (letras)
        const menu = document.getElementById('menu');
        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category;
            button.classList.add('category-button');
            button.addEventListener('click', () => {
                selectedCategory = category;
                updateFilterAndDisplay(data);
            });

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

        // Criação dos botões de filtro por nacionalidade
        const filterContainer = document.getElementById('filterContainer');
        const filterButtons = ['JP', 'KR', 'CN'];
        filterButtons.forEach(nat => {
            const button = document.createElement('button');
            button.textContent = nat;
            button.classList.add('filter-button');
            button.addEventListener('click', () => {
                selectedNationality = nat;
                updateFilterAndDisplay(data);
            });
            filterContainer.appendChild(button);
        });

        // Exibir 24 animes aleatórios na página inicial
        const randomAnimes = getRandomAnimes(data, 24);
        showAnimesByCategoryAndNationality(randomAnimes);

        // Criação da caixa e botão de pesquisa
        const searchContainer = document.getElementById('searchContainer');
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Pesquisar Animes';
        searchInput.id = 'searchInput';
        searchContainer.appendChild(searchInput);

        const searchButton = document.createElement('button');
        searchButton.id = 'searchButton';
        const searchIcon = document.createElement('i');
        searchIcon.classList.add('fas', 'fa-search');
        searchButton.appendChild(searchIcon);
        searchContainer.appendChild(searchButton);

        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                searchByAnime(data);
            }
        });

        searchButton.addEventListener('click', function () {
            searchByAnime(data);
        });

    } catch (error) {
        console.error('Erro ao carregar o JSON:', error);
    }
});

// Variáveis para armazenar os filtros selecionados
let selectedCategory = null;
let selectedNationality = null;

// Função para exibir animes por categoria e nacionalidade
function showAnimesByCategoryAndNationality(animes) {
    const animeGrid = document.getElementById('animeGrid');
    animeGrid.innerHTML = '';

    const urlBase = localStorage.getItem('url');

    if (animes && animes.length > 0) {
        animes.forEach(anime => {
            const animeCard = document.createElement('div');
            animeCard.classList.add('animeCard');

            const title = document.createElement('h3');
            title.textContent = anime.title;
            title.title = anime.title;

            const imageLink = document.createElement('a');
            const fullUrl = urlBase ? `${urlBase}${anime.url}` : anime.url;
            imageLink.href = fullUrl || '#';
            imageLink.target = "_blank";

            const image = document.createElement('img');
            image.src = anime.image;
            imageLink.appendChild(image);

            const flagImage = document.createElement('img');
            flagImage.classList.add('small-image');
            if (anime.nat === 'JP') {
                flagImage.src = 'https://www.br.emb-japan.go.jp/cultura/bandeira.jpg';
            } else if (anime.nat === 'KR') {
                flagImage.src = 'https://rlv.zcache.com.br/adesivo_redondo_bandeira_da_coreia_do_sul-ra5a8bbb9a2e24f01aed263271e012e0a_0ugmp_8byvr_644.webp';
            } else if (anime.nat === 'CN') {
                flagImage.src = 'https://flagdownload.com/wp-content/uploads/Flag_of_Peoples_Republic_of_China_Flat_Round_Corner-1024x1024.png';
            }

            animeCard.appendChild(title);
            animeCard.appendChild(imageLink);
            if (flagImage.src) {
                animeCard.appendChild(flagImage);
            }

            animeGrid.appendChild(animeCard);
        });
    } else {
        const noAnimeMessage = document.createElement('p');
        noAnimeMessage.textContent = 'Nenhum anime encontrado nesta categoria.';
        animeGrid.appendChild(noAnimeMessage);
    }
}

// Função para atualizar o filtro e exibir os animes filtrados
function updateFilterAndDisplay(data) {
    const filteredAnimes = [];

    if (selectedCategory && selectedNationality) {
        data[selectedCategory].forEach(anime => {
            if (anime.nat === selectedNationality) {
                filteredAnimes.push(anime);
            }
        });
    } else if (selectedCategory) {
        filteredAnimes.push(...data[selectedCategory]);
    } else if (selectedNationality) {
        Object.keys(data).forEach(category => {
            if (category.toLowerCase() !== 'history') {
                data[category].forEach(anime => {
                    if (anime.nat === selectedNationality) {
                        filteredAnimes.push(anime);
                    }
                });
            }
        });
    }

    showAnimesByCategoryAndNationality(filteredAnimes);
}

// Função para buscar animes pelo termo de pesquisa
function searchByAnime(data) {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();

    const matchingAnimes = [];
    Object.keys(data).forEach(category => {
        if (category.toLowerCase() !== 'history') {
            data[category].forEach(anime => {
                const titlesToSearch = [anime.title.toLowerCase()];
                if (anime.alternative_titles) {
                    if (anime.alternative_titles.en) {
                        titlesToSearch.push(anime.alternative_titles.en.toLowerCase());
                    }
                    if (anime.alternative_titles.ja) {
                        titlesToSearch.push(anime.alternative_titles.ja.toLowerCase());
                    }
                    if (anime.alternative_titles.synonyms) {
                        titlesToSearch.push(...anime.alternative_titles.synonyms.map(synonym => synonym.toLowerCase()));
                    }
                }

                if (titlesToSearch.some(title => title.includes(searchTerm))) {
                    matchingAnimes.push(anime);
                }
            });
        }
    });

    showAnimesByCategoryAndNationality(matchingAnimes);
}
