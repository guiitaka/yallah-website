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

// URL do serviço de scraping no Render
const RENDER_SCRAPER_URL = process.env.RENDER_SCRAPER_URL || 'https://yallah-airbnb-scraper.onrender.com/api/scrape-airbnb';

// Função para verificar se estamos no ambiente Vercel
const isVercelEnvironment = () => {
    return !!process.env.VERCEL || process.env.VERCEL_ENV;
};

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
            console.log(`Ambiente Vercel detectado. Redirecionando requisição para Render: ${RENDER_SCRAPER_URL}`);

            try {
                const renderResponse = await fetch(RENDER_SCRAPER_URL, {
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
