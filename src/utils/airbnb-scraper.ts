/**
 * Utilitário para consumir a API de scraping do Airbnb
 */

// URL da API de scraping (será modificada após o deploy)
// Em desenvolvimento, você pode usar uma URL local como http://localhost:8080
const SCRAPER_API_URL = process.env.NEXT_PUBLIC_SCRAPER_API_URL || 'https://airbnb-scraper-api.onrender.com';

/**
 * Extrai dados de um anúncio do Airbnb
 * @param url URL do anúncio do Airbnb
 * @param step Etapa do scraping (1-4)
 */
export async function scrapeAirbnb(url: string, step: number = 1) {
    try {
        console.log(`🔍 Iniciando scraping do Airbnb - URL: ${url}, Etapa: ${step}`);
        console.log(`🌐 API URL: ${SCRAPER_API_URL}/scrape-airbnb`);

        const response = await fetch(`${SCRAPER_API_URL}/scrape-airbnb`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://www.yallah.com.br',
                'Referer': 'https://www.yallah.com.br/'
            },
            body: JSON.stringify({ url, step }),
            // Aumentar o timeout para dar tempo para o scraping
            credentials: 'include',
            cache: 'no-store',
            mode: 'cors'
        });

        console.log(`📊 Status da resposta: ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Erro na resposta da API de scraping: ${response.status}`, errorText);
            throw new Error(`Erro ao fazer scraping: ${response.status} - ${errorText}`);
        }

        const responseData = await response.json();
        console.log(`✅ Resposta recebida da API de scraping:`,
            JSON.stringify(responseData).substring(0, 200) + '...');

        return responseData;
    } catch (error) {
        console.error('❌ Erro ao consumir API de scraping:', error);
        throw error;
    }
}

/**
 * Verifica se a API de scraping está online
 */
export async function checkScraperStatus() {
    try {
        console.log(`🔍 Verificando status da API de scraping: ${SCRAPER_API_URL}`);

        const response = await fetch(`${SCRAPER_API_URL}`, {
            method: 'GET',
            headers: {
                'Origin': 'https://www.yallah.com.br',
                'Referer': 'https://www.yallah.com.br/'
            },
            credentials: 'include',
            cache: 'no-store',
            mode: 'cors'
        });

        console.log(`📊 Status da API: ${response.status}`);

        if (!response.ok) {
            return {
                online: false,
                status: response.status,
                message: `API offline ou indisponível (${response.status})`
            };
        }

        return {
            online: true,
            status: response.status,
            message: 'API online e respondendo'
        };
    } catch (error) {
        console.error('❌ Erro ao verificar status da API de scraping:', error);
        return {
            online: false,
            status: 0,
            message: `Erro ao conectar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
        };
    }
}