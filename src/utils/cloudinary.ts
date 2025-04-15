'use client';

// Versão cliente do Cloudinary que não usa módulos exclusivos de servidor
// Usa a API pública do Cloudinary em vez de SDK no cliente

/**
 * Função para fazer upload de imagem para o Cloudinary
 * @param file O arquivo de imagem a ser enviado
 * @param folder Pasta opcional no Cloudinary para organizar as imagens
 * @returns URL da imagem carregada
 */
export const uploadImage = async (file: File, folder: string = 'properties'): Promise<string> => {
    try {
        // Convertemos para FormData para enviar para nossa API
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        // Chamamos nossa própria API que usa o SDK do Cloudinary no servidor
        const response = await fetch('/api/cloudinary/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Falha ao fazer upload da imagem');
        }

        const data = await response.json();
        return data.url;
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
        // Chamamos nossa própria API para excluir
        const response = await fetch('/api/cloudinary/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageUrl }),
        });

        if (!response.ok) {
            throw new Error('Falha ao excluir a imagem');
        }
    } catch (error) {
        console.error('Erro ao excluir imagem do Cloudinary:', error);
        throw new Error('Falha ao excluir a imagem');
    }
}; 