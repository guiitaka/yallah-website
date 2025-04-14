import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10; // Apenas 10 segundos

/**
 * Endpoint de diagnóstico para testar a conexão com o serviço de scraping
 */
export async function GET() {
    // Verificar e coletar informações do ambiente
    const envInfo = {
        NEXT_PUBLIC_SCRAPER_API_URL: process.env.NEXT_PUBLIC_SCRAPER_API_URL,
        VERCEL_ENV: process.env.VERCEL_ENV,
        isVercel: !!process.env.VERCEL,
        NODE_ENV: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    };

    // URL base do serviço
    const baseUrl = process.env.NEXT_PUBLIC_SCRAPER_API_URL || 'https://airbnb-scraper-api.onrender.com';

    // Testar conexão com a raiz do serviço
    let rootTest = null;
    try {
        const rootResponse = await fetch(baseUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            // Curto timeout para não travar
            signal: AbortSignal.timeout(5000)
        });

        if (rootResponse.ok) {
            try {
                rootTest = {
                    status: rootResponse.status,
                    ok: true,
                    data: await rootResponse.json()
                };
            } catch (e) {
                rootTest = {
                    status: rootResponse.status,
                    ok: true,
                    error: 'Resposta não é JSON válido',
                    text: await rootResponse.text()
                };
            }
        } else {
            rootTest = {
                status: rootResponse.status,
                ok: false,
                statusText: rootResponse.statusText
            };
        }
    } catch (error: any) {
        rootTest = {
            ok: false,
            error: error.message || 'Erro desconhecido'
        };
    }

    // Testar conexão com o endpoint de scraping
    let endpointTest = null;
    try {
        const endpointUrl = `${baseUrl}/scrape-airbnb`;
        // Não executamos scraping real, apenas verificamos se o endpoint existe
        const endpointResponse = await fetch(endpointUrl, {
            method: 'OPTIONS',
            headers: { 'Accept': 'application/json' },
            signal: AbortSignal.timeout(5000)
        });

        endpointTest = {
            url: endpointUrl,
            status: endpointResponse.status,
            ok: endpointResponse.ok,
            statusText: endpointResponse.statusText
        };
    } catch (error: any) {
        endpointTest = {
            ok: false,
            error: error.message || 'Erro desconhecido'
        };
    }

    // Retornar resultado do diagnóstico
    return NextResponse.json({
        environment: envInfo,
        baseUrlTest: rootTest,
        endpointTest: endpointTest
    });
} 