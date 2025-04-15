import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary com suas credenciais
cloudinary.config({
    cloud_name: 'dqbytwump',
    api_key: '269638673457278',
    api_secret: '_LWJ6dsuG27ID7bSHsRJCuWcCpg',
});

/**
 * Função para fazer upload de imagem para o Cloudinary
 * @param file O arquivo de imagem a ser enviado
 * @param folder Pasta opcional no Cloudinary para organizar as imagens
 * @returns URL da imagem carregada
 */
export const uploadImage = async (file: File, folder: string = 'properties'): Promise<string> => {
    try {
        // Converter o arquivo para base64
        const base64data = await convertFileToBase64(file);

        // Fazer o upload para o Cloudinary
        const result = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload(
                base64data,
                {
                    folder: folder,
                    resource_type: 'image',
                    public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}`, // Nome único com timestamp
                    transformation: [
                        { quality: 'auto' }, // Otimização automática de qualidade
                        { fetch_format: 'auto' } // Formato automático baseado no navegador
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
        });

        return result.secure_url;
    } catch (error) {
        console.error('Erro ao fazer upload para o Cloudinary:', error);
        throw new Error('Falha ao fazer upload da imagem');
    }
};

/**
 * Função para excluir uma imagem do Cloudinary
 * @param imageUrl URL da imagem a ser excluída
 */
export const deleteImage = async (imageUrl: string): Promise<void> => {
    try {
        // Extrair o public_id da URL
        const publicId = extractPublicIdFromUrl(imageUrl);

        if (!publicId) {
            console.error('Não foi possível extrair o public_id da URL:', imageUrl);
            return;
        }

        // Excluir a imagem
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
    } catch (error) {
        console.error('Erro ao excluir imagem do Cloudinary:', error);
        throw new Error('Falha ao excluir a imagem');
    }
};

/**
 * Função auxiliar para converter File para base64
 */
const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Função auxiliar para extrair o public_id de uma URL do Cloudinary
 */
const extractPublicIdFromUrl = (url: string): string | null => {
    // URL example: https://res.cloudinary.com/dqbytwump/image/upload/v1234567890/properties/1234567890-image.jpg
    const regex = /\/v\d+\/([^/]+\/[^.]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

// Exportar o objeto cloudinary para uso em outros arquivos
export { cloudinary }; 