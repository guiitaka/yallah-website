import { NextResponse } from 'next/server';

/**
 * Função para formatar corretamente a chave privada PEM
 */
function formatPrivateKey(privateKey: string): string {
    if (!privateKey) return '';

    let formattedKey = privateKey;

    // 1. Remover aspas extras no início e fim
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

// Firebase Admin removido. Endpoint de debug desativado.
export async function GET() {
    return NextResponse.json({
        status: 'firebase-admin removido do projeto',
        environment: process.env.NODE_ENV
    });
} 