import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10; // Apenas 10 segundos para este endpoint simples

/**
 * Endpoint para verificar informações do ambiente atual
 * Útil para depuração e verificação de variáveis de ambiente
 */
export async function GET() {
    const environment = {
        // Informações gerais
        nodeEnv: process.env.NODE_ENV || 'não definido',
        nodeVersion: process.version,
        platform: process.platform,

        // Vercel
        isVercel: !!process.env.VERCEL,
        vercelEnv: process.env.VERCEL_ENV || 'não definido',

        // Render
        isRender: !!process.env.RENDER,
        renderEnv: process.env.RENDER_ENV || 'não definido',

        // Outras variáveis específicas para o scraper
        scraperUrl: process.env.RENDER_SCRAPER_URL || 'não definido',

        // Timestamp para verificar cache
        timestamp: new Date().toISOString()
    };

    return NextResponse.json(environment);
} 