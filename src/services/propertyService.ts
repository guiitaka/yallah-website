import { supabase } from '@/utils/supabaseClient';
import { uploadImageToSupabase, uploadMultipleImagesToSupabase } from '@/utils/supabaseStorage';
import { Property } from '@/data/sampleProperties';

// Utilitário melhorado para converter camelCase para snake_case
function toSnakeCase(obj: any): any {
    if (obj === null || obj === undefined) {
        return obj;
    }

    // Se for um array, converte cada item recursivamente
    if (Array.isArray(obj)) {
        return obj.map(item => toSnakeCase(item));
    }

    // Se for um objeto, converte cada propriedade e recursivamente converte valores
    if (typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Object]') {
        const result: any = {};

        Object.entries(obj).forEach(([key, value]) => {
            // Converter a chave para snake_case
            const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

            // Tratamento especial para whatYouShouldKnowSections / what_you_should_know_sections
            // e whatYouShouldKnowRichText / what_you_should_know_rich_text
            if (key === 'whatYouShouldKnowSections' || key === 'what_you_should_know_sections' ||
                key === 'whatYouShouldKnowRichText' || key === 'what_you_should_know_rich_text') {
                // Se for um objeto (para sections), converte as chaves internas para snake_case
                if (key.toLowerCase().includes('sections') && value && typeof value === 'object' && !Array.isArray(value)) {
                    const nestedResult: any = {};
                    Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                        const nestedSnakeKey = nestedKey.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
                        nestedResult[nestedSnakeKey] = nestedValue; // Mantém o valor (ex: booleano para toggle)
                    });
                    result[snakeKey] = nestedResult;
                } else {
                    // Para rich_text (string) ou outros casos dentro de sections (ex: array direto)
                    result[snakeKey] = value;
                }
            }
            // Para amenities, preservar o array
            else if (key === 'amenities') {
                // Preservar arrays como estão
                result[snakeKey] = Array.isArray(value) ? value : value;
            }
            // Adicionando uma verificação para tipos primitivos para evitar recursão desnecessária
            else if (typeof value !== 'object' || value === null) {
                result[snakeKey] = value; // Não fazer chamada recursiva para primitivos
            }
            else {
                // Para todos os outros campos, usamos a conversão recursiva normal
                result[snakeKey] = toSnakeCase(value);
            }
        });

        return result;
    }

    // Para tipos primitivos, retornar como está
    return obj;
}

// Novo: Utilitário para converter snake_case para camelCase
function toCamelCase(obj: any): any {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => toCamelCase(item));
    }

    if (typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Object]') {
        const result: any = {};
        Object.entries(obj).forEach(([key, value]) => {
            const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
            // Se o valor for um objeto (e não uma data, por exemplo), aplicar recursivamente
            // Evitar converter Date objects ou outros tipos especiais que são objetos mas não devem ter chaves convertidas
            if (value instanceof Date) {
                result[camelKey] = value;
            } else {
                result[camelKey] = toCamelCase(value);
            }
        });
        return result;
    }
    return obj;
}

// Salva uma propriedade no Supabase
export const saveProperty = async (property: Omit<Property, 'id'>): Promise<string> => {
    const snakeProperty = toSnakeCase(property);
    const { data, error } = await supabase
        .from('properties')
        .insert([snakeProperty])
        .select('id')
        .single();
    if (error) throw error;
    return data.id;
};

// Atualiza uma propriedade existente no Supabase
export const updateProperty = async (id: string, propertyData: Partial<Property>): Promise<void> => {
    const snakeProperty = toSnakeCase(propertyData);
    const { error } = await supabase
        .from('properties')
        .update(snakeProperty)
        .eq('id', id);

    if (error) {
        console.error("Erro ao atualizar no Supabase:", error);
        throw error;
    }
};

// Remove uma propriedade do Supabase
export const deleteProperty = async (id: string): Promise<void> => {
    // Opcional: buscar e deletar imagens do storage se necessário
    const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
    if (error) throw error;
};

// Busca todas as propriedades
export const fetchProperties = async (limit: number = 100): Promise<Property[]> => {
    const { data, error } = await supabase
        .from('properties')
        .select('*, what_you_should_know_sections, what_you_should_know_rich_text, points_of_interest')
        .order('created_at', { ascending: false })
        .limit(limit);
    if (error) throw error;

    // DEBUG: Log raw data from Supabase
    // console.log('DEBUG fetchProperties - Raw data from Supabase:', data);

    const result = data.map(item => {
        const converted = toCamelCase(item);
        // DEBUG: Log each conversion
        // console.log('DEBUG fetchProperties - Original item:', item);
        // console.log('DEBUG fetchProperties - After toCamelCase:', converted);
        return converted;
    }) as Property[];

    return result;
};

// Busca propriedades com filtros
export const fetchFilteredProperties = async (
    filters: Record<string, any>,
    sortBy: string = 'created_at',
    sortDirection: 'asc' | 'desc' = 'desc',
    limitCount: number = 100
): Promise<Property[]> => {
    let query = supabase.from('properties').select('*, what_you_should_know_sections, what_you_should_know_rich_text, points_of_interest');

    const processFilters = { ...filters };

    // Handle price range
    if (processFilters.minPrice !== undefined) {
        query = query.gte('price', processFilters.minPrice);
        delete processFilters.minPrice;
    }
    if (processFilters.maxPrice !== undefined) {
        query = query.lte('price', processFilters.maxPrice);
        delete processFilters.maxPrice;
    }

    // Handle 'hasPromotion' by mapping to the 'featured' column
    if (processFilters.hasPromotion === true) {
        query = query.eq('featured', true);
        delete processFilters.hasPromotion;
    }

    // Handle 'minRating' by mapping to the 'rating' column
    if (processFilters.minRating !== undefined) {
        query = query.gte('rating', processFilters.minRating);
        delete processFilters.minRating;
    }

    // Handle "or more" numeric filters
    const gteFilters: Record<string, number> = {
        bedrooms: 5,
        bathrooms: 5,
        beds: 5,
        guests: 8,
    };

    Object.keys(gteFilters).forEach(key => {
        const threshold = gteFilters[key];
        if (processFilters[key] !== undefined && processFilters[key] >= threshold) {
            query = query.gte(key, processFilters[key]);
            delete processFilters[key];
        }
    });

    // Process all remaining filters with .eq()
    Object.entries(processFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            query = query.eq(key, value);
        }
    });

    query = query.order(sortBy, { ascending: sortDirection === 'asc' });
    if (limitCount > 0) {
        query = query.limit(limitCount);
    }

    const { data, error } = await query;
    if (error) {
        console.error("Error fetching filtered properties:", error);
        throw error;
    }

    return data.map(item => toCamelCase(item)) as Property[];
};

// Busca uma propriedade pelo ID
export const fetchPropertyById = async (id: string): Promise<Property | null> => {
    const { data, error } = await supabase
        .from('properties')
        .select('*, what_you_should_know_sections, what_you_should_know_rich_text, points_of_interest')
        .eq('id', id)
        .single();
    if (error) {
        console.error(`Erro ao buscar propriedade com ID ${id}:`, error);
        throw error;
    }
    if (!data) return null;
    return toCamelCase(data) as Property;
};

// Upload de uma imagem para o Supabase Storage
export const uploadPropertyImage = uploadImageToSupabase;

// Upload de múltiplas imagens para o Supabase Storage
export const uploadMultiplePropertyImages = uploadMultipleImagesToSupabase; 