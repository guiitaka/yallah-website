'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin } from '@phosphor-icons/react';
import { useProperties } from '@/hooks/useProperties';

// Função para extrair e formatar o bairro do endereço completo
const formatLocationForPublic = (fullAddress: string): string => {
    // Dividir o endereço por vírgulas e remover espaços extras
    const parts = fullAddress.split(',').map(part => part.trim());

    // Se tiver partes suficientes, pegar apenas o bairro (geralmente o segundo elemento)
    if (parts.length >= 2) {
        // Verificar se há um número no primeiro elemento (rua com número)
        const hasStreetNumber = /\d/.test(parts[0]);

        // Se tiver número, pegar apenas o bairro, caso contrário pode ser apenas um bairro/região
        if (hasStreetNumber) {
            return parts[1]; // Geralmente o bairro
        } else {
            return parts[0]; // Se não tiver número, pode ser apenas o bairro
        }
    }

    // Se não conseguir separar, retornar apenas "Localização em São Paulo"
    return 'São Paulo';
};

/**
 * PropertiesList - A simplified component that displays properties from Firebase
 * This can be used to replace or complement existing property listing components
 */
export default function PropertiesList() {
    const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

    // Use the properties hook to fetch data in real-time
    const { properties, loading, error } = useProperties({
        realtime: true,
        sortBy: 'updatedAt',
        sortDirection: 'desc'
    });

    // Handle loading state
    if (loading) {
        return (
            <div className="container mx-auto py-16">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" role="status">
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                            Carregando...
                        </span>
                    </div>
                    <p className="mt-2 text-gray-600">Carregando imóveis...</p>
                </div>
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <div className="container mx-auto py-16">
                <div className="text-center">
                    <p className="text-red-500">Erro ao carregar imóveis. Por favor, tente novamente mais tarde.</p>
                </div>
            </div>
        );
    }

    // Handle empty state
    if (properties.length === 0) {
        return (
            <div className="container mx-auto py-16">
                <div className="text-center">
                    <p className="text-gray-500">Nenhum imóvel encontrado.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Imóveis</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((property) => (
                    <div
                        key={property.id}
                        className="relative group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                    >
                        {/* Property Image */}
                        <div className="relative h-48 w-full overflow-hidden">
                            <Image
                                src={property.images && property.images.length > 0 ? property.images[0] : '/card1.jpg'}
                                alt={property.title}
                                width={500}
                                height={300}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = '/card1.jpg';
                                }}
                            />
                            {property.featured && (
                                <div className="absolute top-2 left-2 bg-[#8BADA4] text-white text-xs px-2 py-1 rounded-full">
                                    Destaque
                                </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                                <div className="flex items-center text-white">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    <p className="text-sm truncate">{formatLocationForPublic(property.location)}, São Paulo</p>
                                </div>
                            </div>
                        </div>

                        {/* Property Details */}
                        <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{property.title}</h3>

                            <p className="text-sm text-gray-600 mb-2 truncate">
                                {property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'} • {property.bathrooms} {property.bathrooms === 1 ? 'banheiro' : 'banheiros'} • {property.area}m²
                            </p>

                            <div className="flex items-center justify-between mt-2">
                                <div className="text-[#8BADA4]">
                                    <span className="font-bold text-lg">R$ {property.price}</span>
                                    <span className="text-gray-500 text-sm">/noite</span>
                                </div>

                                <Link
                                    href={`/imoveis/${property.id}`}
                                    className="bg-[#8BADA4] text-white px-3 py-1 rounded-md text-sm hover:bg-[#7a9a93] transition-colors"
                                >
                                    Ver detalhes
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 