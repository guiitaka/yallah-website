const puppeteer = require('puppeteer-core');
const chrome = require('@sparticuz/chromium');

// Função para limpar e simplificar a URL do Airbnb antes do scraping
function cleanAirbnbUrl(url) {
    try {
        // Verificar se é uma URL válida
        const urlObj = new URL(url);

        // Manter apenas o caminho principal e os parâmetros essenciais
        let cleanUrl = `${urlObj.origin}${urlObj.pathname}`;

        // Adicionar apenas check_in e check_out se existirem
        const checkIn = urlObj.searchParams.get('check_in');
        const checkOut = urlObj.searchParams.get('check_out');

        if (checkIn && checkOut) {
            cleanUrl += `?check_in=${checkIn}&check_out=${checkOut}`;
        }

        console.log(`URL original: ${url}`);
        console.log(`URL limpa: ${cleanUrl}`);
        return cleanUrl;
    } catch (e) {
        console.error('Erro ao limpar URL:', e);
        return url; // Retornar a URL original em caso de erro
    }
}

// Helper function para esperas
const safeWaitForTimeout = async (page, timeout) => {
    if (typeof page.waitForTimeout === 'function') {
        await page.waitForTimeout(timeout);
    } else {
        await new Promise(resolve => setTimeout(resolve, timeout));
    }
};

// Função principal de scraping
export async function scrapeAirbnb(url, step = 1) {
    let browser = null;

    try {
        // Limpar a URL para melhorar as chances de carregamento
        const cleanUrl = cleanAirbnbUrl(url);

        console.log(`Iniciando scraping da URL: ${cleanUrl}, Etapa: ${step}`);

        // Usando fetch para chamar o serviço de scraping externo em vez de executar localmente
        try {
            // Configurar URL da API externa (de preferência use uma variável de ambiente)
            const SCRAPER_API_URL = process.env.SCRAPER_API_URL || 'https://airbnb-scraper-api.onrender.com';

            console.log(`Chamando API externa: ${SCRAPER_API_URL}/scrape-airbnb`);

            const response = await fetch(`${SCRAPER_API_URL}/scrape-airbnb`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: cleanUrl, step }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro na API externa: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao chamar serviço externo:', error);

            // Retornar erro estruturado
            return {
                status: 'error',
                step: step,
                totalSteps: 4,
                message: error.message || 'Erro desconhecido ao chamar o serviço de scraping.',
                error: error.toString(),
                data: {}
            };
        }

        // O código abaixo está comentado, pois estamos usando a API externa
        /*
        // Configurar Chromium para Vercel Serverless
        const executablePath = await chrome.executablePath;

        // Iniciar o browser usando puppeteer-core e chromium do @sparticuz/chromium
        browser = await puppeteer.launch({
            args: [
                ...chrome.args,
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--disable-extensions',
                '--disable-component-extensions-with-background-pages',
                '--disable-default-apps',
                '--mute-audio',
                '--no-default-browser-check',
                '--no-first-run',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--disable-background-timer-throttling',
                '--disable-ipc-flooding-protection'
            ],
            defaultViewport: chrome.defaultViewport,
            executablePath,
            headless: chrome.headless,
            ignoreHTTPSErrors: true
        });
        
        // ... rest of original code
        */

    } catch (error) {
        console.error('Erro durante o scraping:', error);

        // Retornar erro estruturado
        return {
            status: 'error',
            step: step,
            totalSteps: 4,
            message: error.message || 'Erro desconhecido durante o scraping',
            error: error.toString(),
            data: {} // Dados vazios em caso de erro
        };
    } finally {
        // Sempre fechar o browser para evitar memory leaks
        if (browser) {
            try {
                await browser.close();
                console.log('Browser fechado com sucesso');
            } catch (closeError) {
                console.error('Erro ao fechar o browser:', closeError);
            }
        }
    }
} 