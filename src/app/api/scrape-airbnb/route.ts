import { NextResponse } from 'next/server';
import { scrapeAirbnb } from './lib/airbnb-scraper';

// Marcar este arquivo como apenas servidor para evitar que o Next.js tente bundlar no cliente
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Aumentar o tempo máximo para 5 minutos (300 segundos)

// Definir o tipo de retorno do scraper para o TypeScript
interface ScraperResult {
    status: string;
    step: number;
    totalSteps: number;
    message: string;
    error?: string;
    data: any;
}

export async function POST(request: Request) {
    try {
        const { url, step = 1 } = await request.json();

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

        console.log(`Iniciando scraping do Airbnb: ${url}, Etapa: ${step}`);

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
