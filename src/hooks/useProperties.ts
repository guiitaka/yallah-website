import { useState, useEffect } from 'react';
import { Property } from '@/data/sampleProperties';
import {
    fetchProperties,
    fetchFilteredProperties,
    listenToProperties
} from '@/services/propertyService';

interface UsePropertiesOptions {
    filters?: Record<string, any>;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    limit?: number;
    realtime?: boolean;
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
        sortBy = 'updatedAt',
        sortDirection = 'desc',
        limit = 100,
        realtime = true
    } = options;

    useEffect(() => {
        setLoading(true);
        setError(null);

        // Função para busca inicial
        const loadInitialData = async () => {
            try {
                let propertiesData: Property[];

                if (Object.keys(filters).length > 0) {
                    // Com filtros
                    propertiesData = await fetchFilteredProperties(
                        filters,
                        sortBy,
                        sortDirection,
                        limit
                    );
                } else {
                    // Sem filtros
                    propertiesData = await fetchProperties();
                }

                setProperties(propertiesData);
                setLoading(false);
            } catch (err) {
                console.error('Erro detalhado ao carregar propriedades:', JSON.stringify(err));

                // Verificar tipo do erro antes de acessar propriedades
                if (err && typeof err === 'object') {
                    const errorObj = err as any;
                    if ('message' in errorObj) console.error('Mensagem do erro:', errorObj.message);
                    if ('code' in errorObj) console.error('Código do erro:', errorObj.code);
                }

                setError(err instanceof Error ? err : new Error('Erro desconhecido'));
                setLoading(false);
            }
        };

        // Carregar dados iniciais
        loadInitialData();

        // Se realtime estiver habilitado, configurar a escuta em tempo real
        let unsubscribe: () => void = () => { };

        if (realtime) {
            try {
                unsubscribe = listenToProperties((updatedProperties) => {
                    // Se houver filtros, aplicar os filtros localmente também
                    if (Object.keys(filters).length > 0) {
                        const filteredProperties = updatedProperties.filter(property => {
                            return Object.entries(filters).every(([key, value]) => {
                                if (value === undefined || value === null || value === '') {
                                    return true;
                                }

                                const propertyValue = (property as any)[key];
                                return propertyValue === value;
                            });
                        });

                        setProperties(filteredProperties);
                    } else {
                        setProperties(updatedProperties);
                    }

                    setLoading(false);
                });
            } catch (err) {
                console.error('Erro ao configurar escuta em tempo real:', err);

                // Verificar tipo do erro antes de logar detalhes
                if (err && typeof err === 'object') {
                    const errorObj = err as any;
                    if ('message' in errorObj) console.error('Mensagem do erro:', errorObj.message);
                    if ('code' in errorObj) console.error('Código do erro:', errorObj.code);
                }

                setError(err instanceof Error ? err : new Error('Erro ao configurar escuta em tempo real'));
            }
        }

        // Cleanup: cancelar a escuta ao desmontar
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [JSON.stringify(filters), sortBy, sortDirection, limit, realtime]);

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
                // Verificar tipo do erro antes de tratar
                if (err && typeof err === 'object') {
                    const errorObj = err as any;
                    if ('message' in errorObj) console.error('Mensagem do erro ao atualizar:', errorObj.message);
                }

                setError(err instanceof Error ? err : new Error('Erro ao atualizar propriedades'));
            } finally {
                setLoading(false);
            }
        }
    };
}; 