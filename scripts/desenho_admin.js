    document.getElementById("addNodeForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Evita o envio padrão do formulário

    // Obtém os valores do formulário
    var title = document.getElementById("title").value;
    var image = document.getElementById("image").value;
    var url = document.getElementById("url").value;

    // Cria um objeto com os dados do formulário
    var data = {
        title: title,
    image: image,
    url: url
            };

    // Envia os dados para o script PHP via AJAX
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://anitsuteste.000webhostapp.com/request/atualizar_desenho.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
        // Limpa o formulário
        document.getElementById("addNodeForm").reset();

    // Exibe a mensagem de sucesso
    document.getElementById("message").innerHTML = JSON.parse(xhr.responseText).message;
                    } else {
        // Exibe a mensagem de erro
        document.getElementById("message").innerHTML = "Erro: " + JSON.parse(xhr.responseText).message
                        document.getElementById("addNodeForm").reset();
                    }
                }
            };
    xhr.send(JSON.stringify(data));
        });