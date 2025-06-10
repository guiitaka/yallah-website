'use client'

import { useState } from 'react'
import Image from 'next/image';
import { Heart, Users } from '@phosphor-icons/react';
import { useProperties } from '@/hooks/useProperties'
import { Property } from '@/data/sampleProperties'; // Correct import
import PropertyDetailModal from '../shared/PropertyDetailModal'
import { useFilter } from '@/context/FilterContext'
import PropertyFilterModal from './PropertyFilterModal'

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

    return (
        <>
            <PropertyFilterModal />
            <div className="p-4 bg-gray-50 min-h-screen">
                <div className="grid grid-cols-1 gap-6">
                    {loading && <div>Carregando imóveis...</div>}
                    {error && <div>Ocorreu um erro ao carregar os imóveis.</div>}
                    {!loading && !error && properties.map((property: Property) => (
                        // Merged PropertyCard logic
                        <div
                            key={property.id}
                            className="relative rounded-3xl overflow-hidden shadow-lg group cursor-pointer"
                            onClick={() => handleOpenModal(property)}
                        >
                            <div className="relative aspect-[4/5]">
                                <Image
                                    src={property.images && property.images.length > 0 ? property.images[0] : '/placeholder.jpg'}
                                    alt={property.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full">
                                    <Heart className="w-5 h-5 text-white" />
                                </div>
                                <div className="absolute bottom-0 left-0 p-5 text-white w-full">
                                    <p className="text-xs font-bold uppercase tracking-wider opacity-90">{property.category || 'Brasil'}</p>
                                    <h3 className="font-bold text-2xl mt-1">{property.title}</h3>
                                    <div className="flex items-center gap-4 mt-2 text-sm opacity-90">
                                        <span>{property.price ? `$${property.price}/noite` : 'Preço a consultar'}</span>
                                        <span className="flex items-center gap-1"><Users size={16} /> {property.guests || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
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