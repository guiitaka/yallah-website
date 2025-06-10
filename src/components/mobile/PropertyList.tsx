'use client'

import { useState } from 'react'
import Image from 'next/image';
import { Heart, Users, Star, ArrowRight } from '@phosphor-icons/react';
import { useProperties } from '@/hooks/useProperties'
import { Property } from '@/data/sampleProperties'; // Correct import
import PropertyDetailModal from '../shared/PropertyDetailModal'
import { useFilter } from '@/context/FilterContext'
import PropertyFilterModal from './PropertyFilterModal'
import { formatCurrency } from '@/utils/format'

export default function PropertyList() {
    const { activeFilters } = useFilter();
    const { properties, loading, error } = useProperties({ filters: activeFilters });
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    const handleOpenModal = (property: Property) => {
        setSelectedProperty(property);
    }

    const handleCloseModal = () => {
        setSelectedProperty(null);
    }

    const formatFeaturesString = (p: Property) => {
        const parts = [];
        if (p.guests) parts.push(`${p.guests} hóspedes`);
        if (p.bedrooms) parts.push(`${p.bedrooms} ${p.bedrooms > 1 ? 'quartos' : 'quarto'}`);
        if (p.beds) parts.push(`${p.beds} ${p.beds > 1 ? 'camas' : 'cama'}`);
        if (p.bathrooms) parts.push(`${p.bathrooms} ${p.bathrooms > 1 ? 'banheiros' : 'banheiro'}`);
        return parts.join(' · ') || 'Detalhes não especificados';
    };

    return (
        <>
            <PropertyFilterModal />
            <div className="p-4 bg-gray-50 min-h-screen">
                <div className="grid grid-cols-1 gap-6">
                    {loading && <div className="text-center text-gray-500 mt-8">Carregando imóveis...</div>}
                    {error && <div className="text-center text-red-500 mt-8">Ocorreu um erro ao carregar os imóveis.</div>}
                    {!loading && !error && properties.length > 0 && properties.map((property: Property) => (
                        <div
                            key={property.id}
                            className="bg-white rounded-3xl overflow-hidden shadow-lg group cursor-pointer flex flex-col"
                            onClick={() => handleOpenModal(property)}
                        >
                            <div className="relative aspect-[4/5] w-full">
                                <Image
                                    src={property.images && property.images.length > 0 ? property.images[0] : '/placeholder.jpg'}
                                    alt={property.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300">
                                    <Heart className="w-5 h-5 text-gray-700" />
                                </div>
                                <div className="absolute top-4 left-4 bg-white text-gray-800 px-3 py-1.5 rounded-full shadow-md">
                                    <span className="font-bold text-sm">{formatCurrency(property.price)}</span>
                                    <span className="text-xs">/noite</span>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                                <div>
                                    <p className="text-sm text-gray-500">{property.location}</p>
                                    <h3 className="font-bold text-xl mt-1 text-gray-800">{property.title}</h3>
                                    <p className="text-sm text-gray-600 mt-2">{formatFeaturesString(property)}</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <Star weight="fill" className="text-yellow-400" />
                                        <span className="text-sm text-gray-800 font-semibold">{property.rating?.value || 0}</span>
                                        <span className="text-sm text-gray-500">({property.rating?.count || 0})</span>
                                    </div>
                                </div>
                                <div className="mt-auto pt-4">
                                    <button className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-colors">
                                        <span>Ver detalhes</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {!loading && !error && properties.length === 0 && (
                        <div className="text-center text-gray-500 mt-8">
                            <p>Nenhum imóvel encontrado baseado nos filtros aplicados.</p>
                        </div>
                    )}
                </div>

                {selectedProperty && (
                    <PropertyDetailModal
                        isOpen={!!selectedProperty}
                        onClose={handleCloseModal}
                        property={selectedProperty}
                    />
                )}
            </div>
        </>
    )
} 