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
    message: string;
    error?: string;
    data: any;
}

// Verificar e logar variáveis de ambiente disponíveis
console.log('[DIAGNÓSTICO] Variáveis de ambiente disponíveis:', {
    NEXT_PUBLIC_SCRAPER_API_URL: process.env.NEXT_PUBLIC_SCRAPER_API_URL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    isVercel: !!process.env.VERCEL
});

// URL base do serviço de scraping no Render - Usando a variável configurada na Vercel
const RENDER_SCRAPER_BASE_URL = process.env.NEXT_PUBLIC_SCRAPER_API_URL || 'https://airbnb-scraper-api.onrender.com';
// Caminho para o endpoint de scraping
const SCRAPE_ENDPOINT = '/scrape-airbnb';

console.log('[DIAGNÓSTICO] URLs configuradas:', {
    baseUrl: RENDER_SCRAPER_BASE_URL,
    endpoint: SCRAPE_ENDPOINT,
    fullUrl: `${RENDER_SCRAPER_BASE_URL}${SCRAPE_ENDPOINT}`
});

// Função para verificar se estamos no ambiente Vercel
const isVercelEnvironment = () => {
    return !!process.env.VERCEL || process.env.VERCEL_ENV;
};

// Função para verificar o status da API antes de fazer a requisição
async function checkApiStatus() {
    console.log('[DIAGNÓSTICO] Verificando status da API:', RENDER_SCRAPER_BASE_URL);
    try {
        // Tenta acessar a raiz da API, não o endpoint de scraping
        const response = await fetch(RENDER_SCRAPER_BASE_URL, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        console.log('[DIAGNÓSTICO] Resposta da verificação:', {
            status: response.status,
            ok: response.ok,
            statusText: response.statusText
        });

        if (response.ok) {
            try {
                const data = await response.json();
                console.log('[DIAGNÓSTICO] Resposta JSON:', data);
            } catch (e) {
                console.log('[DIAGNÓSTICO] Não foi possível ler resposta como JSON');
            }
            return { online: true };
        }

        return { online: false, status: response.status };
    } catch (error: any) {  // Especificando o tipo como 'any' para evitar o erro unknown
        console.error('[DIAGNÓSTICO] Erro ao verificar status da API:', error);
        return { online: false, error: error.message };
    }
}

// Adiciona trailing slash à URL base se não existir
function ensureTrailingSlash(url: string): string {
    if (!url.endsWith('/') && !SCRAPE_ENDPOINT.startsWith('/')) {
        return `${url}/`;
    }
    return url;
}

// Remove barras duplicadas entre base e endpoint
function combineUrls(base: string, endpoint: string): string {
    // Normaliza a base para terminar com uma barra, se o endpoint não começar com uma
    const normalizedBase = base.endsWith('/') || endpoint.startsWith('/')
        ? base
        : `${base}/`;

    // Normaliza o endpoint para não começar com barra se a base já terminar com uma
    const normalizedEndpoint = base.endsWith('/') && endpoint.startsWith('/')
        ? endpoint.slice(1)
        : endpoint;

    return `${normalizedBase}${normalizedEndpoint}`;
}

export async function POST(request: Request) {
    try {
        console.log('[DIAGNÓSTICO] Iniciando processamento de requisição POST');
        const requestData = await request.json();
        const { url } = requestData;

        console.log('[DIAGNÓSTICO] Dados da requisição:', { url });

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
                    message: 'URL inválida. Por favor, forneça uma URL válida do Airbnb',
                    error: 'The URL did not match the expected Airbnb listing pattern',
                    data: {}
                },
                { status: 400 }
            );
        }

        // Se estamos na Vercel, redirecionar para o Render
        if (isVercelEnvironment()) {
            console.log(`[DIAGNÓSTICO] Ambiente Vercel detectado. Verificando disponibilidade da API: ${RENDER_SCRAPER_BASE_URL}`);

            // Verificar se a API está online
            const apiStatus = await checkApiStatus();
            console.log('[DIAGNÓSTICO] Status da API:', apiStatus);

            if (!apiStatus.online) {
                console.error('[DIAGNÓSTICO] API de scraping offline:', apiStatus);
                return NextResponse.json(
                    {
                        status: 'error',
                        message: 'Serviço de scraping indisponível no momento',
                        error: `API offline: ${JSON.stringify(apiStatus)}`,
                        data: {}
                    },
                    { status: 503 }
                );
            }

            // Construir URL completa garantindo que não haja problemas com barras
            const fullUrl = combineUrls(RENDER_SCRAPER_BASE_URL, SCRAPE_ENDPOINT);
            console.log(`[DIAGNÓSTICO] API online. Redirecionando requisição para: ${fullUrl}`);

            try {
                // Combinar URL base com o endpoint para o POST
                const renderResponse = await fetch(fullUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Adicionar headers para evitar problemas de CORS
                        'Origin': 'https://www.yallah.com.br'
                    },
                    body: JSON.stringify(requestData),
                    // Aumentar o timeout para permitir que o Render processe a requisição
                    // Observe que o tempo total ainda está limitado pelo maxDuration
                    signal: AbortSignal.timeout(55000), // 55 segundos para deixar margem
                });

                console.log('[DIAGNÓSTICO] Resposta do Render:', {
                    status: renderResponse.status,
                    ok: renderResponse.ok,
                    statusText: renderResponse.statusText
                });

                if (!renderResponse.ok) {
                    throw new Error(`Erro na resposta do Render: ${renderResponse.status} ${renderResponse.statusText}`);
                }

                const renderData = await renderResponse.json();
                console.log('[DIAGNÓSTICO] Dados recebidos do Render:', renderData);
                return NextResponse.json(renderData);
            } catch (error: any) {
                console.error('[DIAGNÓSTICO] Erro ao redirecionar para o Render:', error);
                return NextResponse.json(
                    {
                        status: 'error',
                        message: 'Erro ao conectar com o serviço de scraping',
                        error: error.message || 'Erro desconhecido na conexão com Render',
                        data: {}
                    },
                    { status: 502 }
                );
            }
        } else {
            // No ambiente Render, executar o scraping localmente
            console.log(`Ambiente Render detectado. Iniciando scraping local para: ${url}`);

            // Usar nosso scraper local
            const result = await scrapeAirbnb(url) as ScraperResult;

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
        console.error('[DIAGNÓSTICO] Erro não tratado durante o scraping:', error);

        // Resposta de erro estruturada
        return NextResponse.json(
            {
                status: 'error',
                message: 'Ocorreu um erro inesperado durante o scraping',
                error: error.message || 'Erro desconhecido',
                data: {}
            },
            { status: 500 }
        );
    }
}
