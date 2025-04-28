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

        // Compatibilidade: aceita tanto 'files' (múltiplo) quanto 'file' (singular)
        let files: File[] = [];

        // Verifica se tem arquivos no campo 'files' (múltiplo)
        const multipleFiles = formData.getAll('files') as File[];
        if (multipleFiles && multipleFiles.length > 0) {
            files = multipleFiles;
        }
        // Verifica se tem arquivo no campo 'file' (singular)
        else {
            const singleFile = formData.get('file') as File;
            if (singleFile) {
                files = [singleFile];
            }
        }

        const folder = formData.get('folder') as string || 'properties';

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'Nenhum arquivo enviado' },
                { status: 400 }
            );
        }

        // Processar todos os arquivos com limite de tamanho
        const uploadResults = await Promise.all(files.map(async (file) => {
            // Verificar tamanho do arquivo (limite 10MB)
            if (file.size > 10 * 1024 * 1024) {
                throw new Error(`Arquivo ${file.name} excede o limite de 10MB`);
            }

            // Ler o arquivo como ArrayBuffer
            const bytes = await file.arrayBuffer();
            const base64data = await bufferToBase64(bytes);

            // Gerar um nome único para a imagem
            const fileName = file.name.replace(/\.[^/.]+$/, "");
            const publicId = `${folder}/${Date.now()}-${fileName}`;

            // Fazer upload para o Cloudinary com compressão e otimização
            const uploadResult = await new Promise<any>((resolve, reject) => {
                cloudinary.uploader.upload(
                    base64data,
                    {
                        public_id: publicId,
                        folder: '', // Já incluído no publicId
                        resource_type: 'image',
                        transformation: [
                            { width: 1200, crop: "limit" }, // Limita o tamanho máximo para 1200px
                            { quality: "auto:good" }, // Otimização automática de qualidade
                            { fetch_format: "auto" }, // Formato automático (WebP se o navegador suportar)
                        ]
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
            });
            return {
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id
            };
        }));

        // Retornar array de URLs/public_ids ou objeto único dependendo da entrada
        return NextResponse.json(
            files.length === 1
                ? { url: uploadResults[0].url, public_id: uploadResults[0].public_id } // Compatibilidade com código antigo
                : { images: uploadResults }
        );
    } catch (error) {
        console.error('Erro no servidor ao fazer upload para Cloudinary:', error);
        return NextResponse.json(
            { error: 'Falha ao processar o upload da imagem' },
            { status: 500 }
        );
    }
} 