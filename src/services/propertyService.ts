import {
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    getDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    DocumentData,
    onSnapshot,
    Unsubscribe
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db, propertiesCollection } from '@/utils/firebase';
import { uploadImage, deleteImage } from '@/utils/cloudinary';
import { Property } from '@/data/sampleProperties';

// Interface para os dados de upload e progresso
interface UploadProgress {
    progress: number;
    url: string | null;
    error: string | null;
}

/**
 * Salva uma propriedade no Firestore
 * @param property Dados da propriedade a ser salva
 * @returns ID do documento criado
 */
export const saveProperty = async (property: Omit<Property, 'id'>): Promise<string> => {
    try {
        const propertyWithTimestamp = {
            ...property,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(propertiesCollection, propertyWithTimestamp);
        console.log('Propriedade salva com ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Erro ao salvar propriedade:', error);
        throw error;
    }
};

/**
 * Atualiza uma propriedade existente no Firestore
 * @param id ID da propriedade
 * @param propertyData Dados atualizados da propriedade
 */
export const updateProperty = async (id: string, propertyData: Partial<Property>): Promise<void> => {
    try {
        const propertyRef = doc(db, 'properties', id);

        const updateData = {
            ...propertyData,
            updatedAt: serverTimestamp()
        };

        await updateDoc(propertyRef, updateData);
        console.log('Propriedade atualizada:', id);
    } catch (error) {
        console.error('Erro ao atualizar propriedade:', error);
        throw error;
    }
};

/**
 * Remove uma propriedade do Firestore
 * @param id ID da propriedade
 */
export const deleteProperty = async (id: string): Promise<void> => {
    try {
        const propertyRef = doc(db, 'properties', id);

        // Primeiro, obter a propriedade para verificar se há imagens para excluir
        const propertySnap = await getDoc(propertyRef);
        if (propertySnap.exists()) {
            const propertyData = propertySnap.data() as Property;

            // Excluir imagens associadas
            if (propertyData.images && propertyData.images.length > 0) {
                await Promise.all(
                    propertyData.images.map(async (imageUrl) => {
                        try {
                            await deleteImage(imageUrl);
                            console.log('Imagem excluída:', imageUrl);
                        } catch (error) {
                            console.warn('Erro ao excluir imagem:', error);
                        }
                    })
                );
            }
        }

        // Excluir o documento da propriedade
        await deleteDoc(propertyRef);
        console.log('Propriedade excluída:', id);
    } catch (error) {
        console.error('Erro ao excluir propriedade:', error);
        throw error;
    }
};

/**
 * Busca todas as propriedades
 * @returns Lista de propriedades
 */
export const fetchProperties = async (): Promise<Property[]> => {
    try {
        const querySnapshot = await getDocs(propertiesCollection);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<Property, 'id'>
        }));
    } catch (error) {
        console.error('Erro ao buscar propriedades:', error);
        throw error;
    }
};

/**
 * Busca propriedades com filtros
 * @param filters Filtros a serem aplicados
 * @param sortBy Campo para ordenação
 * @param sortDirection Direção da ordenação
 * @param limitCount Limite de resultados
 * @returns Lista de propriedades filtradas
 */
export const fetchFilteredProperties = async (
    filters: Record<string, any>,
    sortBy: string = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc',
    limitCount: number = 20
): Promise<Property[]> => {
    try {
        let q = query(propertiesCollection);

        // Adicionar filtros
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                q = query(q, where(key, '==', value));
            }
        });

        // Adicionar ordenação
        q = query(q, orderBy(sortBy, sortDirection));

        // Adicionar limite
        if (limitCount > 0) {
            q = query(q, limit(limitCount));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<Property, 'id'>
        }));
    } catch (error) {
        console.error('Erro ao buscar propriedades filtradas:', error);
        throw error;
    }
};

/**
 * Escuta por mudanças nas propriedades em tempo real
 * @param callback Função a ser chamada quando houver mudanças
 * @returns Função para cancelar a escuta
 */
export const listenToProperties = (callback: (properties: Property[]) => void): Unsubscribe => {
    const q = query(propertiesCollection, orderBy('updatedAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
        const properties = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<Property, 'id'>
        }));
        callback(properties);
    }, (error) => {
        console.error('Erro na escuta de propriedades:', error);
    });
};

/**
 * Faz upload de uma imagem para o Cloudinary
 * @param file Arquivo a ser enviado
 * @param propertyId ID da propriedade (para organização)
 * @param onProgress Callback para monitorar o progresso
 * @returns Promise com a URL da imagem
 */
export const uploadPropertyImage = async (
    file: File,
    propertyId: string,
    onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
    try {
        if (onProgress) {
            onProgress({
                progress: 10,
                url: null,
                error: null
            });
        }

        // Upload para o Cloudinary
        const folder = `properties/${propertyId}/images`;
        const imageUrl = await uploadImage(file, folder);

        if (onProgress) {
            onProgress({
                progress: 100,
                url: imageUrl,
                error: null
            });
        }

        return imageUrl;
    } catch (error: any) {
        console.error('Erro no upload da imagem:', error);

        if (onProgress) {
            onProgress({
                progress: 0,
                url: null,
                error: error.message
            });
        }

        throw error;
    }
};

/**
 * Faz upload de múltiplas imagens para o Cloudinary
 * @param files Array de arquivos a serem enviados
 * @param propertyId ID da propriedade
 * @param onProgress Callback para monitorar o progresso geral
 * @returns Promise com array de URLs das imagens
 */
export const uploadMultiplePropertyImages = async (
    files: File[],
    propertyId: string,
    onProgress?: (overallProgress: number, urls: string[]) => void
): Promise<string[]> => {
    try {
        const urls: string[] = [];
        const totalFiles = files.length;

        for (let i = 0; i < totalFiles; i++) {
            const file = files[i];
            const folder = `properties/${propertyId}/images`;
            const imageUrl = await uploadImage(file, folder);

            urls.push(imageUrl);

            if (onProgress) {
                const overallProgress = Math.round(((i + 1) / totalFiles) * 100);
                onProgress(overallProgress, [...urls]);
            }
        }

        return urls;
    } catch (error) {
        console.error('Erro no upload múltiplo de imagens:', error);
        throw error;
    }
};

/**
 * Busca uma propriedade pelo ID
 * @param id ID da propriedade
 * @returns Dados da propriedade ou null se não existir
 */
export const fetchPropertyById = async (id: string): Promise<Property | null> => {
    try {
        const propertyRef = doc(db, 'properties', id);
        const propertySnap = await getDoc(propertyRef);

        if (propertySnap.exists()) {
            return {
                id: propertySnap.id,
                ...propertySnap.data() as Omit<Property, 'id'>
            };
        }

        return null;
    } catch (error) {
        console.error('Erro ao buscar propriedade por ID:', error);
        throw error;
    }
}; 