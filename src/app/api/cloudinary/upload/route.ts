import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';

// Configurar Cloudinary com credenciais
cloudinary.config({
    cloud_name: 'dqbytwump',
    api_key: '269638673457278',
    api_secret: '_LWJ6dsuG27ID7bSHsRJCuWcCpg',
});

// Função auxiliar para converter buffer/blob para base64
async function bufferToBase64(buffer: ArrayBuffer) {
    const uint8Array = new Uint8Array(buffer);
    const base64 = Buffer.from(uint8Array).toString('base64');
    return `data:image/png;base64,${base64}`;
}

// Função para tratar a requisição de upload
export async function POST(request: NextRequest) {
    try {
        // Obter o FormData da requisição
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || 'properties';

        if (!file) {
            return NextResponse.json(
                { error: 'Nenhum arquivo enviado' },
                { status: 400 }
            );
        }

        // Ler o arquivo como ArrayBuffer
        const bytes = await file.arrayBuffer();
        const base64data = await bufferToBase64(bytes);

        // Gerar um nome único para a imagem
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        const publicId = `${folder}/${Date.now()}-${fileName}`;

        // Fazer upload para o Cloudinary
        const uploadResult = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload(
                base64data,
                {
                    public_id: publicId,
                    folder: '', // Já incluído no publicId
                    resource_type: 'image',
                    transformation: [
                        { quality: 'auto' },
                        { fetch_format: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
        });

        // Retornar a URL da imagem carregada
        return NextResponse.json({
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id
        });
    } catch (error) {
        console.error('Erro no servidor ao fazer upload para Cloudinary:', error);
        return NextResponse.json(
            { error: 'Falha ao processar o upload da imagem' },
            { status: 500 }
        );
    }
} 