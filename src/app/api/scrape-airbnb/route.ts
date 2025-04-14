import { NextResponse } from 'next/server';
import { scrapeAirbnb } from './lib/airbnb-scraper';

// Marcar este arquivo como apenas servidor para evitar que o Next.js tente bundlar no cliente
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Definir tempo máximo mais curto para Vercel, e mais longo para Render
export const maxDuration = 60; // Limite do plano gratuito da Vercel

// Definir o tipo de retorno do scraper para o TypeScript
interface ScraperResult {
    status: string;
    step: number;
    totalSteps: number;
    message: string;
    error?: string;
    data: any;
}

// URL base do serviço de scraping no Render - Usando a variável configurada na Vercel
const RENDER_SCRAPER_BASE_URL = process.env.NEXT_PUBLIC_SCRAPER_API_URL || 'https://airbnb-scraper-api.onrender.com';
// Caminho para o endpoint de scraping
const SCRAPE_ENDPOINT = '/scrape-airbnb';

// Função para verificar se estamos no ambiente Vercel
const isVercelEnvironment = () => {
    return !!process.env.VERCEL || process.env.VERCEL_ENV;
};

// Função para verificar o status da API antes de fazer a requisição
async function checkApiStatus() {
    try {
        // Tenta acessar a raiz da API, não o endpoint de scraping
        const response = await fetch(RENDER_SCRAPER_BASE_URL, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            return { online: true };
        }

        return { online: false, status: response.status };
    } catch (error: any) {  // Especificando o tipo como 'any' para evitar o erro unknown
        console.error('Erro ao verificar status da API:', error);
        return { online: false, error: error.message };
    }
}

export async function POST(request: Request) {
    try {
        const requestData = await request.json();
        const { url, step = 1 } = requestData;

        // Validação mais flexível para URLs do Airbnb
        const isValidUrl = url && (
            url.includes('airbnb.com') ||
            url.includes('airbnb.com.br') ||
            url.includes('airbnb.co.uk')
        ) && url.includes('/rooms/');

        if (!isValidUrl) {
            console.error('URL inválida:', url);
            return NextResponse.json(
                {
                    status: 'error',
                    step: 1,
                    totalSteps: 4,
                    message: 'URL inválida. Por favor, forneça uma URL válida do Airbnb',
                    error: 'The URL did not match the expected Airbnb listing pattern',
                    data: {}
                },
                { status: 400 }
            );
        }

        // Se estamos na Vercel, redirecionar para o Render
        if (isVercelEnvironment()) {
            console.log(`Ambiente Vercel detectado. Verificando disponibilidade da API: ${RENDER_SCRAPER_BASE_URL}`);

            // Verificar se a API está online
            const apiStatus = await checkApiStatus();
            if (!apiStatus.online) {
                console.error('API de scraping offline:', apiStatus);
                return NextResponse.json(
                    {
                        status: 'error',
                        step: 1,
                        totalSteps: 4,
                        message: 'Serviço de scraping indisponível no momento',
                        error: `API offline: ${JSON.stringify(apiStatus)}`,
                        data: {}
                    },
                    { status: 503 }
                );
            }

            console.log(`API online. Redirecionando requisição para: ${RENDER_SCRAPER_BASE_URL}${SCRAPE_ENDPOINT}`);

            try {
                // Combinar URL base com o endpoint para o POST
                const renderResponse = await fetch(`${RENDER_SCRAPER_BASE_URL}${SCRAPE_ENDPOINT}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData),
                    // Aumentar o timeout para permitir que o Render processe a requisição
                    // Observe que o tempo total ainda está limitado pelo maxDuration
                    signal: AbortSignal.timeout(55000), // 55 segundos para deixar margem
                });

                if (!renderResponse.ok) {
                    throw new Error(`Erro na resposta do Render: ${renderResponse.status} ${renderResponse.statusText}`);
                }

                const renderData = await renderResponse.json();
                return NextResponse.json(renderData);
            } catch (error: any) {
                console.error('Erro ao redirecionar para o Render:', error);
                return NextResponse.json(
                    {
                        status: 'error',
                        step: 1,
                        totalSteps: 4,
                        message: 'Erro ao conectar com o serviço de scraping',
                        error: error.message || 'Erro desconhecido na conexão com Render',
                        data: {}
                    },
                    { status: 502 }
                );
            }
        } else {
            // No ambiente Render, executar o scraping localmente
            console.log(`Ambiente Render detectado. Iniciando scraping local para: ${url}, Etapa: ${step}`);

            // Usar nosso scraper local
            const result = await scrapeAirbnb(url, step) as ScraperResult;

            // Verificar se obtivemos dados válidos
            if (result.status === 'error') {
                console.error('Erro durante o scraping:', result.error || 'Erro desconhecido');
                return NextResponse.json(result, { status: 500 });
            }

            // Log de sucesso
            console.log(`Scraping concluído com sucesso para: ${url}`);

            return NextResponse.json(result);
        }
    } catch (error: any) {
        console.error('Erro não tratado durante o scraping:', error);

        // Resposta de erro estruturada
        return NextResponse.json(
            {
                status: 'error',
                step: 1,
                totalSteps: 4,
                message: 'Ocorreu um erro inesperado durante o scraping',
                error: error.message || 'Erro desconhecido',
                data: {}
            },
            { status: 500 }
        );
    }
}
