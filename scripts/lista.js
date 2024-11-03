 // Função para mostrar o alerta e armazenar a URL
        function solicitarUrl() {
            // Verifica se a URL já está armazenada
            const urlArmazenada = localStorage.getItem('url');
            if (!urlArmazenada) {
                const url = prompt("Cole o link da nuvem aqui:");
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

// Função para selecionar 24 animes aleatórios de todas as categorias
function getRandomAnimes(data, count = 24) {
    const allAnimes = [];

    // Coletar todos os animes de todas as categorias, exceto 'history'
    Object.keys(data).forEach(category => {
        if (category.toLowerCase() !== 'history') {
            allAnimes.push(...data[category]);
        }
    });

    // Embaralhar os animes e selecionar a quantidade desejada
    const shuffledAnimes = allAnimes.sort(() => 0.5 - Math.random());
    return shuffledAnimes.slice(0, count);
}

// Exibir 24 animes aleatórios na página inicial
const randomAnimes = getRandomAnimes(data, 24);
showAnimesByCategory(randomAnimes);


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
            title.title = anime.title;

            const imageLink = document.createElement('a');
            const fullUrl = urlBase ? `${urlBase}${anime.url}` : anime.url;
            imageLink.href = fullUrl || '#';
            imageLink.target = "_blank";

            const image = document.createElement('img');
            image.src = anime.image;
            imageLink.appendChild(image);

            // Adiciona a imagem da bandeira dependendo do valor de "nat"
            const flagImage = document.createElement('img');
            flagImage.classList.add('small-image'); // Classe para estilizar a imagem da bandeira

            if (anime.nat === 'JP') {
                flagImage.src = 'https://media.istockphoto.com/id/1332466002/pt/vetorial/flag-of-japan-vector.jpg?s=612x612&w=0&k=20&c=O-wJw5Zvo0IFq_g6S48pAKHBsmKvjtWvuKYFbJxK5yU='; // URL da bandeira do Japão
            } else if (anime.nat === 'KR') {
                flagImage.src = 'https://rlv.zcache.com.br/adesivo_redondo_bandeira_da_coreia_do_sul-ra5a8bbb9a2e24f01aed263271e012e0a_0ugmp_8byvr_644.webp'; // URL da bandeira da Coreia do Sul
            } else if (anime.nat === 'CN') {
                flagImage.src = 'https://flagdownload.com/wp-content/uploads/Flag_of_Peoples_Republic_of_China_Flat_Round_Corner-1024x1024.png'; // URL da bandeira da China
            } else {
                flagImage.src = ''; // Opcional: uma bandeira padrão ou nenhuma imagem se "nat" não corresponder a nenhum valor
            }

            // Adiciona os elementos ao card de anime
            animeCard.appendChild(title);
            animeCard.appendChild(imageLink);
            if (flagImage.src) {
                animeCard.appendChild(flagImage); // Adiciona a bandeira ao card somente se houver uma URL válida
            }

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
                // Concatena o título principal com os alternative_titles e synonyms
                const titlesToSearch = [anime.title.toLowerCase()];

                if (anime.alternative_titles) {
                    // Adiciona alternative_titles à lista
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

                // Verifica se o termo de pesquisa está em algum dos títulos
                if (titlesToSearch.some(title => title.includes(searchTerm))) {
                    matchingAnimes.push(anime);
                }
            });
        }
    });

    // Chama a função para mostrar os animes encontrados
    showAnimesByCategory(matchingAnimes);
}
