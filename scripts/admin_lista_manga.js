document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Carrega os dados do JSON
        const response = await fetch('../../list/manga_list.json');
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
        searchInput.placeholder = 'Pesquisar Manga';
        searchInput.id = 'searchInput';

        // Adiciona a caixa de pesquisa ao seu container
        searchContainer.appendChild(searchInput);

        // Adiciona evento para pesquisa ao pressionar "Enter"
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                searchByAnime(data);
            }
        });

        // Adiciona evento de clique para cada imagem de manga
        const animeGrid = document.getElementById('animeGrid');
        animeGrid.addEventListener('click', function (event) {
            if (event.target.tagName === 'IMG') {
                const newURL = prompt('Insira o novo URL para o manga:');
                if (newURL !== null) { // Verifica se o usuário não cancelou a operação
                    let newImageURL = prompt('Digite "null" para animes que não possuem links no acervo.\nCaso contrario deixar esse campo em branco.');
                    // Verifica se o usuário digitou "null" e, nesse caso, define o URL padrão
                    if (newImageURL === "null") {
                        newImageURL = "https://cdn.icon-icons.com/icons2/2838/PNG/512/action_unavailable_icon_180783.png";
                    }
                    // Se o usuário inseriu um novo URL da imagem, atualize o manga
                    if (newURL.trim() !== '' && newImageURL !== null) {
                        // Obtém o título do manga
                        const animeTitle = event.target.parentElement.previousElementSibling.textContent;
                        // Atualiza a URL do manga no JSON
                        updateAnimeURL(animeTitle, newURL, newImageURL, data);
                    } else {
                        // Exibe uma mensagem de aviso se o novo URL estiver vazio
                        alert('Por favor, insira um novo URL válido para o manga e sua imagem.');
                    }
                }
            }
        });

    } catch (error) {
        console.error('Erro ao carregar o JSON:', error);
    }
});

// Função para mostrar manga por categoria
function showAnimesByCategory(animes) {
    const animeGrid = document.getElementById('animeGrid');
    animeGrid.innerHTML = '';

    if (animes && animes.length > 0) {
        animes.forEach(anime => {
            const animeCard = document.createElement('div');
            animeCard.classList.add('animeCard');

            // Cria o título do manga com um tooltip
            const title = document.createElement('h3');
            title.textContent = anime.title;
            title.title = anime.title; // Define o texto do tooltip como o título do manga

            const imageLink = document.createElement('a');
            imageLink.href = anime.url;
            imageLink.target = "_blank";

            const image = document.createElement('img');
            image.src = anime.image;

            imageLink.appendChild(image);
            imageLink.addEventListener('click', (event) => {
                event.preventDefault(); // Impede o comportamento padrão do link
            });

            animeCard.appendChild(title);
            animeCard.appendChild(imageLink);

            animeGrid.appendChild(animeCard);
        });
    } else {
        const noAnimeMessage = document.createElement('p');
        noAnimeMessage.textContent = 'Nenhum manga encontrado para esta categoria.';
        animeGrid.appendChild(noAnimeMessage);
    }
}

// Função para pesquisar por manga
function searchByAnime(data) {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();

    // Filtra os mangas que correspondem ao termo de pesquisa
    const matchingAnimes = [];

    Object.keys(data).forEach(category => {
        data[category].forEach(anime => {
            if (anime.title.toLowerCase().includes(searchTerm)) {
                matchingAnimes.push(anime);
            }
        });
    });

    // Exibe os mangas correspondentes ou uma mensagem se nenhum for encontrado
    showAnimesByCategory(matchingAnimes);
}

// Função para atualizar a URL do manga no servidor via PHP
async function updateAnimeURL(title, newURL, newImageURL, data) {
    try {
        const response = await fetch('https://anitsuteste.000webhostapp.com/request/atualizar_manga.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                newURL: newURL,
                newImage: newImageURL // Passa o novo URL da imagem
            })
        });

        if (response.ok) {
            // Exibir mensagem de sucesso
            alert(`URL e imagem atualizadas com sucesso para o manga: ${title}`);
        } else {
            // Exibir mensagem de erro
            alert('Erro ao atualizar a URL e imagem do manga');
        }
    } catch (error) {
        console.error('Erro ao atualizar a URL e imagem do manga:', error);
        // Exibir mensagem de erro
        alert('Erro ao atualizar a URL e imagem do manga');
    }
}
