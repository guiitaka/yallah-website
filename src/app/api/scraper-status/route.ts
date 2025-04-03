import { NextResponse } from 'next/server';
import { checkScraperStatus } from '../../../utils/airbnb-scraper';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const status = await checkScraperStatus();

        return NextResponse.json({
            status: status.online ? 'online' : 'offline',
            apiStatus: status,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Erro ao verificar status do scraper:', error);

        return NextResponse.json({
            status: 'error',
            message: error?.message || 'Erro desconhecido',
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
} 