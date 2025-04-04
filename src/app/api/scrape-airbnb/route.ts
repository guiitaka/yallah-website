import { NextResponse } from 'next/server';
import { scrapeAirbnb } from './lib/airbnb-scraper';

// Marcar este arquivo como apenas servidor para evitar que o Next.js tente bundlar no cliente
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Aumentar o tempo máximo para 60 segundos

export async function POST(request: Request) {
    try {
        const { url, step = 1 } = await request.json();

        // Validação mais flexível para URLs do Airbnb
        const isValidUrl = url && (
            url.includes('airbnb.com') ||
            url.includes('airbnb.com.br')
        ) && url.includes('/rooms/');

        if (!isValidUrl) {
            return NextResponse.json(
                { error: 'URL inválida. Por favor, forneça uma URL válida do Airbnb', message: 'The string did not match the expected pattern.' },
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
