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

        console.log('Browser iniciado com sucesso');

        const page = await browser.newPage();

        // Configurar timeout e viewport
        await page.setDefaultNavigationTimeout(120000); // 2 minutos
        await page.setViewport({ width: 1920, height: 1080 });

        // User agent moderno para evitar detecção
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        // Interceptar e bloquear recursos desnecessários
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            const resourceType = req.resourceType();
            // Etapa 4 precisa de imagens, outras etapas não
            if ((resourceType === 'image' || resourceType === 'font' || resourceType === 'media' || resourceType === 'stylesheet') && step !== 4) {
                req.abort();
            } else {
                req.continue();
            }
        });

        // Definir um timeout para a navegação com promise racing
        const navigationPromise = new Promise(async (resolve, reject) => {
            try {
                console.log('Acessando a página...');
                await page.goto(cleanUrl, {
                    waitUntil: 'domcontentloaded', // Mais rápido que networkidle2
                    timeout: 100000 // 100 segundos específicos para navegação
                });

                console.log('Conteúdo DOM carregado, aguardando scripts...');
                await safeWaitForTimeout(page, 3000);

                console.log('Página carregada, extraindo dados...');
                resolve();
            } catch (e) {
                reject(e);
            }
        });

        // Promise de timeout absoluto
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout absoluto ao carregar a página')), 110000)
        );

        // Corrida entre navegação e timeout
        await Promise.race([navigationPromise, timeoutPromise]);

        // Inicializar resultado
        let result = {
            status: 'partial',
            data: {},
            step: step,
            totalSteps: 4
        };

        // ETAPA 1: Título, descrição e tipo de imóvel
        if (step === 1) {
            console.log('Executando Etapa 1: Título, descrição e tipo de imóvel');

            // Extrair dados básicos
            const basicInfoData = await page.evaluate(() => {
                // Título (tentar diferentes seletores)
                let title = '';
                const titleSelectors = ['h1', '[data-section-id="TITLE_DEFAULT"] h1', '[data-plugin-in-point-id="TITLE_DEFAULT"] h1'];
                for (const selector of titleSelectors) {
                    const element = document.querySelector(selector);
                    if (element) {
                        title = element.textContent.trim();
                        break;
                    }
                }

                // Descrição (tentar diferentes seletores)
                let description = '';
                const descSelectors = [
                    '[data-section-id="DESCRIPTION_DEFAULT"]',
                    '[data-plugin-in-point-id="DESCRIPTION_DEFAULT"]',
                    '[aria-labelledby="listing-title-descriptor"]'
                ];

                for (const selector of descSelectors) {
                    const element = document.querySelector(selector);
                    if (element) {
                        description = element.textContent.trim();
                        break;
                    }
                }

                // Tipo de imóvel (extrair do título/descrição)
                let type = 'outro'; // valor padrão

                const typeKeywords = {
                    'apartamento': ['apartamento', 'apto', 'flat', 'loft', 'condomínio', 'condominio'],
                    'casa': ['casa', 'chácara', 'sítio', 'fazenda', 'rancho', 'moradia'],
                    'chalé': ['chalé', 'chale', 'cabana', 'cabin', 'chalés'],
                    'quarto': ['quarto', 'suíte', 'suite', 'room', 'bedroom'],
                    'hotel': ['hotel', 'pousada', 'hostel', 'inn', 'resort']
                };

                const combinedText = (title + ' ' + description).toLowerCase();

                for (const [propertyType, keywords] of Object.entries(typeKeywords)) {
                    if (keywords.some(keyword => combinedText.includes(keyword))) {
                        type = propertyType;
                        break;
                    }
                }

                return { title, description, type };
            });

            result.data = basicInfoData;
            result.status = 'success';
            result.message = 'Informações básicas extraídas com sucesso';
        }

        return result;

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