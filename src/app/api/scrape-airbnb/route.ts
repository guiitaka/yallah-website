import { NextResponse } from 'next/server';
import { scrapeAirbnb } from '../../../utils/airbnb-scraper';

// Marcar este arquivo como apenas servidor para evitar que o Next.js tente bundlar no cliente
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { url, step = 1 } = await request.json();

        if (!url || !url.includes('airbnb.com')) {
            return NextResponse.json(
                { error: 'URL inválida. Por favor, forneça uma URL válida do Airbnb' },
                { status: 400 }
            );
        }

        console.log(`Redirecionando requisição de scraping para a API externa: ${url}, Etapa: ${step}`);

        // Chamar a API externa de scraping
        const result = await scrapeAirbnb(url, step);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Erro durante o redirecionamento para API de scraping:', error);
        return NextResponse.json(
            {
                error: 'Ocorreu um erro durante o scraping',
                message: error.message || 'Erro desconhecido'
            },
            { status: 500 }
        );
    }
}
