import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';

// Configurar Cloudinary com credenciais
cloudinary.config({
    cloud_name: 'dqbytwump',
    api_key: '269638673457278',
    api_secret: '_LWJ6dsuG27ID7bSHsRJCuWcCpg',
});

// Função auxiliar para extrair o public_id de uma URL do Cloudinary
function extractPublicIdFromUrl(url: string): string | null {
    // URL example: https://res.cloudinary.com/dqbytwump/image/upload/v1234567890/properties/1234567890-image.jpg
    const regex = /\/v\d+\/([^/]+\/[^.]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Função para tratar a requisição de exclusão
export async function POST(request: NextRequest) {
    try {
        // Obter a URL da imagem do corpo da requisição
        const { imageUrl } = await request.json();

        if (!imageUrl) {
            return NextResponse.json(
                { error: 'URL da imagem não fornecida' },
                { status: 400 }
            );
        }

        // Extrair o public_id da URL
        const publicId = extractPublicIdFromUrl(imageUrl);

        if (!publicId) {
            return NextResponse.json(
                { error: 'Não foi possível extrair o ID da imagem a partir da URL' },
                { status: 400 }
            );
        }

        // Excluir a imagem do Cloudinary
        await new Promise<void>((resolve, reject) => {
            cloudinary.uploader.destroy(
                publicId,
                { resource_type: 'image' },
                (error) => {
                    if (error) reject(error);
                    else resolve();
                }
            );
        });

        // Retornar sucesso
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro no servidor ao excluir imagem do Cloudinary:', error);
        return NextResponse.json(
            { error: 'Falha ao excluir a imagem' },
            { status: 500 }
        );
    }
} 