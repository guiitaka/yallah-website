import { NextResponse } from 'next/server';

export async function GET() {
    // Verificar valores das variáveis de ambiente (com redação das chaves privadas)
    const privateKey = process.env.FIREBASE_PRIVATE_KEY || '';

    // Analisar detalhes do formato da chave
    const keyDetails = {
        length: privateKey.length,
        startsWithQuote: privateKey.startsWith('"'),
        endsWithQuote: privateKey.endsWith('"'),
        containsEscapedNewlines: privateKey.includes('\\n'),
        containsRealNewlines: privateKey.includes('\n'),
        first20Chars: privateKey.substring(0, 20) + '...',
        last20Chars: '...' + privateKey.substring(privateKey.length - 20),
        hasBeginMarker: privateKey.includes('BEGIN PRIVATE KEY'),
        hasEndMarker: privateKey.includes('END PRIVATE KEY')
    };

    const envVars = {
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || 'não definido',
        FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || 'não definido',
        FIREBASE_PRIVATE_KEY_DEFINED: privateKey ? 'definido' : 'não definido',
        FIREBASE_PRIVATE_KEY_LENGTH: privateKey.length || 0,
        FIREBASE_PRIVATE_KEY_DETAILS: keyDetails
    };

    return NextResponse.json({
        message: 'Informações de debug',
        envVars
    });
} 