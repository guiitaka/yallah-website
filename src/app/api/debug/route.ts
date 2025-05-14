import { NextResponse } from 'next/server';

export async function GET() {
    // Verificar valores das variáveis de ambiente (com redação das chaves privadas)
    const envVars = {
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || 'não definido',
        FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || 'não definido',
        FIREBASE_PRIVATE_KEY_DEFINED: process.env.FIREBASE_PRIVATE_KEY ? 'definido' : 'não definido',
        FIREBASE_PRIVATE_KEY_LENGTH: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
        FIREBASE_PRIVATE_KEY_PREVIEW: process.env.FIREBASE_PRIVATE_KEY?.substring(0, 20) + '...' || 'vazio',
    };

    return NextResponse.json({
        message: 'Informações de debug',
        envVars
    });
} 