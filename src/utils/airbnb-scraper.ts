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
        const response = await fetch(`${SCRAPER_API_URL}/scrape-airbnb`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url, step }),
            // Aumentar o timeout para dar tempo para o scraping
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ao fazer scraping: ${response.status} - ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao consumir API de scraping:', error);
        throw error;
    }
}

/**
 * Verifica se a API de scraping está online
 */
export async function checkScraperStatus() {
    try {
        const response = await fetch(SCRAPER_API_URL, {
            method: 'GET',
            cache: 'no-store',
        });

        if (!response.ok) {
            return { online: false, error: `Status: ${response.status}` };
        }

        const data = await response.json();
        return { online: data.status === 'online', data };
    } catch (error) {
        console.error('Erro ao verificar status da API de scraping:', error);
        return { online: false, error: String(error) };
    }
} 