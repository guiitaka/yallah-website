import { NextResponse } from 'next/server';

/**
 * Função para formatar corretamente a chave privada PEM
 * Lida com vários formatos possíveis da chave privada
 */
function formatPrivateKey(privateKey: string): string {
    if (!privateKey) return '';

    let formattedKey = privateKey;

    // 1. Remover aspas extras no início e fim (comum em variáveis de ambiente)
    if (formattedKey.startsWith('"') && formattedKey.endsWith('"')) {
        formattedKey = formattedKey.slice(1, -1);
    }

    // 2. Substituir literais \n por quebras de linha reais
    if (formattedKey.includes('\\n')) {
        formattedKey = formattedKey.replace(/\\n/g, '\n');
    }

    // 3. Verificar se a chave tem os marcadores PEM necessários
    const hasBeginMarker = formattedKey.includes('-----BEGIN PRIVATE KEY-----');
    const hasEndMarker = formattedKey.includes('-----END PRIVATE KEY-----');

    // 4. Verificar se a chave está em formato base64 sem marcadores PEM e adicionar se necessário
    if (!hasBeginMarker || !hasEndMarker) {
        console.warn('Chave privada sem marcadores PEM detectada, tentando corrigir...');
        // Remover quaisquer caracteres não-base64 que possam estar presentes
        const base64Content = formattedKey.replace(/[^A-Za-z0-9+/=]/g, '');

        // Adicionar marcadores PEM e quebras de linha a cada 64 caracteres
        let pemKey = '-----BEGIN PRIVATE KEY-----\n';
        for (let i = 0; i < base64Content.length; i += 64) {
            pemKey += base64Content.substring(i, i + 64) + '\n';
        }
        pemKey += '-----END PRIVATE KEY-----\n';
        formattedKey = pemKey;
    }

    // 5. Verificar se há quebras de linha entre os marcadores e o conteúdo
    if (formattedKey.includes('-----BEGIN PRIVATE KEY-----') &&
        !formattedKey.includes('-----BEGIN PRIVATE KEY-----\n')) {
        formattedKey = formattedKey.replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n');
    }

    if (formattedKey.includes('-----END PRIVATE KEY-----') &&
        !formattedKey.includes('\n-----END PRIVATE KEY-----')) {
        formattedKey = formattedKey.replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----');
    }

    // 6. Garantir que a chave termina com uma quebra de linha
    if (!formattedKey.endsWith('\n')) {
        formattedKey += '\n';
    }

    return formattedKey;
}

export async function GET() {
    const originalKey = process.env.FIREBASE_PRIVATE_KEY || '';
    const formattedKey = formatPrivateKey(originalKey);

    // Análise detalhada da chave para debugging
    const originalKeyAnalysis = {
        length: originalKey.length,
        startsWithQuote: originalKey.startsWith('"'),
        endsWithQuote: originalKey.endsWith('"'),
        containsEscapedNewlines: originalKey.includes('\\n'),
        containsRealNewlines: originalKey.includes('\n'),
        hasBeginMarker: originalKey.includes('-----BEGIN PRIVATE KEY-----'),
        hasEndMarker: originalKey.includes('-----END PRIVATE KEY-----'),
        firstFewChars: originalKey.substring(0, 30) + '...',
        lastFewChars: '...' + originalKey.substring(originalKey.length - 30),
    };

    const formattedKeyAnalysis = {
        length: formattedKey.length,
        startsWithNewline: formattedKey.startsWith('\n'),
        endsWithNewline: formattedKey.endsWith('\n'),
        containsRealNewlines: formattedKey.includes('\n'),
        hasBeginMarker: formattedKey.includes('-----BEGIN PRIVATE KEY-----'),
        hasEndMarker: formattedKey.includes('-----END PRIVATE KEY-----'),
        beginMarkerFollowedByNewline: formattedKey.includes('-----BEGIN PRIVATE KEY-----\n'),
        newlineBeforeEndMarker: formattedKey.includes('\n-----END PRIVATE KEY-----'),
        correctPEMFormat: formattedKey.includes('-----BEGIN PRIVATE KEY-----\n') &&
            formattedKey.includes('\n-----END PRIVATE KEY-----') &&
            formattedKey.endsWith('\n'),
        firstFewChars: formattedKey.substring(0, 30) + '...',
        lastFewChars: '...' + formattedKey.substring(formattedKey.length - 30),
        // Contar número de quebras de linha
        newlineCount: (formattedKey.match(/\n/g) || []).length,
    };

    return NextResponse.json({
        message: 'Diagnóstico da chave privada Firebase',
        originalKeyAnalysis,
        formattedKeyAnalysis,
        sugestaoParaVercel: "Certifique-se de que a FIREBASE_PRIVATE_KEY está formatada corretamente. Deve incluir as marcações BEGIN/END e todas as quebras de linha. Exemplo: '-----BEGIN PRIVATE KEY-----\\nMIIE...\\n-----END PRIVATE KEY-----\\n'"
    });
} 