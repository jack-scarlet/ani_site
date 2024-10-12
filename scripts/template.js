document.addEventListener('DOMContentLoaded', function () {
    fetch('../list/anime_list.json')
        .then(response => response.json())
        .then(data => {
            // Obtém o id do anime da URL
            const urlParams = new URLSearchParams(window.location.search);
            const animeId = urlParams.get('id');

            let anime = null;

            // Procura o anime em todas as categorias no JSON pelo id
            for (const category in data) {
                if (data.hasOwnProperty(category)) {
                    anime = data[category].find(anime => anime.id === parseInt(animeId));
                    if (anime) break; // Se o anime for encontrado, sai do loop
                }
            }

            function formatarDadosAnime(anime) {
                function formatarData(data) {
                    return data ? `${data.split('-')[2]}/${data.split('-')[1]}/${data.split('-')[0]}` : "Indefinido";
                }

                function traduzirStatus(status) {
                    switch (status) {
                        case "finished_airing":
                            return "Finalizado";
                        case "currently_airing":
                            return "Atualmente em exibição";
                        case "not_yet_aired":
                            return "Ainda não exibido";
                        default:
                            return "Indefinido";
                    }
                }

                function traduzirStatusAnime(status_anime) {
                    switch (status_anime) {
                        case "watching":
                            return "Em Lançamento";
                        case "completed":
                            return "Completo";
                        case "on_hold":
                            return "Incompleto";
                        case "dropped":
                            return "Incompleto";
                        case "plan_to_watch":
                            return "A ser Adicionado";
                        default:
                            return "Indefinido";
                    }
                }

                function formatarNumEpisodios(numEpisodios) {
                    return numEpisodios !== 0 ? numEpisodios : "??";
                }

                function traduzirTemporada(temporada) {
                    switch (temporada) {
                        case "winter":
                            return "Inverno";
                        case "spring":
                            return "Primavera";
                        case "summer":
                            return "Verão";
                        case "fall":
                            return "Outono";
                        default:
                            return " -- ";
                    }
                }

                function formatarFonte(fonte) {
                    return fonte ? fonte.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "Indefinido";
                }

                function formatarEstudios(estudios) {
                    return estudios.length > 0 ? estudios.map(studio => studio.name).join('\n') : 'Estúdio desconhecido';
                }

                function traduzirTipoRelacao(tipoRelacao) {
                    switch (tipoRelacao) {
                        case "Sequel":
                            return "Sequência";
                        case "Prequel":
                            return "Prequela";
                        case "Alternative setting":
                            return "História Alternativa";
                        case "Alternative version":
                            return "Versão Alternativa";
                        case "Side story":
                            return "História Paralela";
                        case "Parent story":
                            return "História Principal";
                        case "Summary":
                            return "Resumo";
                        case "Other":
                            return "Outros";
                        case "Spin-off":
                            return "Spin-off";
                        case "Full story":
                            return "História Completa";
                        default:
                            return tipoRelacao;
                    }
                }

                return {
                    formatarData: formatarData,
                    traduzirStatus: traduzirStatus,
                    formatarNumEpisodios: formatarNumEpisodios,
                    traduzirTemporada: traduzirTemporada,
                    formatarFonte: formatarFonte,
                    formatarEstudios: formatarEstudios,
                    traduzirTipoRelacao: traduzirTipoRelacao,
                    traduzirStatusAnime: traduzirStatusAnime
                };
            }

            if (anime) {
                // Preenche os detalhes do anime com os dados
                const formatacao = formatarDadosAnime(anime);
                document.getElementById('title').innerText = anime.title;
                document.getElementById('image').src = anime.image;
                document.getElementById('alternative_titles').innerHTML = `${anime.alternative_titles.en}<br>${anime.alternative_titles.synonyms.join('<br>')}${anime.alternative_titles.ja ? '<br>' + anime.alternative_titles.ja : ''}`;
                document.getElementById('start_date').innerText = formatacao.formatarData(anime.start_date);
                document.getElementById('end_date').innerText = formatacao.formatarData(anime.end_date);
                document.getElementById('synopsis').innerText = anime.synopsis;
                document.getElementById('status').innerText = formatacao.traduzirStatus(anime.status);
                document.getElementById('start_season').innerText = `${formatacao.traduzirTemporada(anime.start_season.season)} ${anime.start_season.year}`;
                document.getElementById('studios').innerText = formatacao.formatarEstudios(anime.studios);
                document.getElementById('source').innerText = formatacao.formatarFonte(anime.source);
                document.getElementById('status').innerText = formatacao.traduzirStatus(anime.status);

                document.getElementById('fansub').innerText = anime.fansub || 'Não especificado';
                document.getElementById('qualidade').innerText = anime.qualidade || 'Não especificada';
                document.getElementById('num_episodes').innerText = formatacao.formatarNumEpisodios(anime.num_episodes);
                document.getElementById('genres').innerText = anime.genres.map(genre => genre.name).join(', ');
                document.getElementById('num_episodes_watched').innerText = anime.num_episodes_watched || 'Não especificada';
                document.getElementById('status_anime').innerText = formatacao.traduzirStatusAnime(anime.status_anime);

                // Exibe os animes relacionados
                fetch('../list/metadados.json')
                    .then(response => response.json())
                    .then(metadata => {
                        const relatedAnime = metadata['#'].find(anime => anime.id === parseInt(animeId)).related_anime;

                        const relatedAnimeList = document.getElementById('related_anime_list');
                        relatedAnime.forEach(animeData => {
                            const relatedAnimeId = animeData.node.id;

                            // Verifica se o ID do anime relacionado está presente no anime_list.json
                            let isPresentInAnimeList = false;
                            for (const category in data) {
                                if (data.hasOwnProperty(category)) {
                                    isPresentInAnimeList = data[category].some(anime => anime.id === relatedAnimeId);
                                    if (isPresentInAnimeList) {
                                        break; // Sai do loop se o anime for encontrado
                                    }
                                }
                            }

                            if (!isPresentInAnimeList) {
                                return; // Ignora a criação do link se o anime não estiver presente
                            }

                            const listItem = document.createElement('li');
                            const animeTitle = animeData.node.title;

                            // Cria o link dinamicamente usando o ID do anime
                            const link = document.createElement('a');
                            link.textContent = animeTitle;
                            link.href = `anime_list.html?id=${relatedAnimeId}`; // Use o nome real da página dinâmica aqui
                            link.classList.add('related-anime-link'); // Opcional: adicione uma classe CSS ao link para estilizá-lo

                            // Adiciona o link ao item da lista
                            listItem.textContent = formatacao.traduzirTipoRelacao(animeData.relation_type_formatted) + ": ";
                            listItem.appendChild(link);
                            relatedAnimeList.appendChild(listItem);

                            // Agora, defina os URLs nos botões
                            const cloudButton = document.getElementById('cloudButton');
                            const nzbButton = document.getElementById('nzbButton');
                            const animeUrl = anime.url; // Obtém o URL do anime
                            cloudButton.dataset.url = animeUrl; // Define o URL no atributo data-url do botão Cloud
                            nzbButton.dataset.url = animeUrl; // Define o URL no atributo data-url do botão NZB
                        });
                    })
                    .catch(error => {
                        console.error('Erro ao carregar os metadados:', error);
                    });
            } else {
                console.error('Anime não encontrado.');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar os detalhes do anime:', error);
        });
});

function redirectToUrl(button) {
    // Obtém o link associado ao botão
    const url = button.dataset.url;
    if (url) {
        // Redireciona para o URL associado ao botão
        window.location.href = url;
    } else {
        console.error('URL não encontrado.');
    }
}
