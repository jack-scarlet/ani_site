const puppeteer = require('puppeteer');
const fs = require('fs');  // Módulo para manipular arquivos

async function captureHref() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Navega até a página de login
    await page.goto('https://snusnu.click');

    // Preenche o formulário de login
    await page.type('input[name="username"]', 'SEU_USUARIO');  // Ajuste o seletor para o campo correto de username
    await page.type('input[name="password"]', 'SUA_SENHA');    // Ajuste o seletor para o campo correto de password

    // Submete o formulário
    await Promise.all([
        page.click('button[type="submit"]'),  // Ajuste o seletor do botão de login
        page.waitForNavigation(),
    ]);

    // Acesse a página onde está o <a> que você quer capturar
    await page.goto('https://cloud.snusnu.click/nextcloud/s/BriDXHdTjMrRMtB');

    // Espera o link carregar e captura o href
    const hrefValue = await page.evaluate(() => {
        const linkElement = document.querySelector('a.mantine-Anchor-root');
        return linkElement ? linkElement.href : null;
    });

    if (hrefValue) {
        console.log('Href capturado:', hrefValue);

        // Cria um objeto JSON para armazenar o href
        const data = {
            href: hrefValue,
            capturedAt: new Date().toISOString()
        };

        // Salva o JSON no arquivo anitsu.json
        fs.writeFileSync('anitsu.json', JSON.stringify(data, null, 2));
        console.log('Href salvo em anitsu.json');
    } else {
        console.log('Nenhum href foi capturado.');
    }

    await browser.close();
}

// Função para rodar a cada 6 horas
function startAutomation() {
    captureHref();
    setInterval(captureHref, 6 * 60 * 60 * 1000);  // 6 horas em milissegundos
}

startAutomation();
