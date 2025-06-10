import { useState, useEffect } from 'react';
import { Property } from '@/data/sampleProperties';
import {
    fetchProperties,
    fetchFilteredProperties
} from '@/services/propertyService';

interface UsePropertiesOptions {
    filters?: Record<string, any>;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    limit?: number;
}

/**
 * Hook para buscar e sincronizar dados de propriedades do Firebase
 */
export const useProperties = (options: UsePropertiesOptions = {}) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const {
        filters = {},
        sortBy = 'updated_at',
        sortDirection = 'desc',
        limit = 100
    } = options;

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);

        // Debounce para evitar fetchs excessivos
        const timeout = setTimeout(() => {
            const loadInitialData = async () => {
                try {
                    let propertiesData: Property[];

                    if (Object.keys(filters).length > 0) {
                        propertiesData = await fetchFilteredProperties(
                            filters,
                            sortBy,
                            sortDirection,
                            limit
                        );
                    } else {
                        propertiesData = await fetchProperties(limit);
                    }

                    if (isMounted) {
                        setProperties(propertiesData);
                        setLoading(false);
                    }
                } catch (err) {
                    console.error('Erro ao buscar propriedades:', err);
                    if (isMounted) {
                        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
                        setLoading(false);
                    }
                }
            };
            loadInitialData();
        }, 300); // 300ms debounce

        return () => {
            isMounted = false;
            clearTimeout(timeout);
        };
    }, [JSON.stringify(filters), sortBy, sortDirection, limit]);

    return {
        properties,
        loading,
        error,
        refresh: async () => {
            setLoading(true);
            try {
                const freshData = await fetchProperties();
                setProperties(freshData);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Erro ao atualizar propriedades'));
            } finally {
                setLoading(false);
            }
        }
    };
}; 