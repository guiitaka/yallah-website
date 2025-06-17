'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { useProperties } from '@/hooks/useProperties';

// Define a type for the property data structure
export interface PropertyCard {
    id: number | string;
    title: string;
    location: string;
    details?: string;
    features: string;
    pricePerNight: number;
    rating: { value: number; count: number };
    image: string;
    link?: string;
    host?: string;
    coordinates?: [number, number];
    description?: string;
    whatWeOffer?: string;
    whatYouShouldKnow?: string;
    whatYouShouldKnowRichText?: string;
    serviceFee?: number;
    discountSettings?: {
        amount: number;
        type: 'percentage' | 'fixed';
        minNights: number;
        validFrom: string;
        validTo: string;
    };
    type?: string;
    category?: string;
    images?: string[];
    rooms?: number;
    bathrooms?: number;
    beds?: number;
    guests?: number;
    amenities?: string[];
    houseRules?: {
        checkIn: string;
        checkOut: string;
        maxGuests: number;
        additionalRules: string[];
    };
    safety?: {
        hasCoAlarm: boolean;
        hasSmokeAlarm: boolean;
        hasCameras: boolean;
    };
    whatYouShouldKnowSections?: {
        houseRules: string[];
        safetyProperty: string[];
        cancellationPolicy: string[];
    };
    pointsOfInterest?: string[];
}

interface FilterContextType {
    allProperties: PropertyCard[];
    filteredProperties: PropertyCard[];
    activeFilters: any;
    handleFilterChange: (newFilters: any) => void;
    loading: boolean;
    error: any;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Static property data as fallback
const staticAllProperties: PropertyCard[] = [
    {
        id: 11,
        title: "Estúdio com decoração vintage",
        location: "Vila Madalena, São Paulo",
        details: "Espaço inteiro: estúdio",
        features: "2 hóspedes · Studio · 1 cama · 1 banheiro",
        pricePerNight: 190,
        rating: { value: 4.6, count: 43 },
        image: "/recomendado2.jpg",
        link: "/imoveis/vintage-madalena",
        host: "Anfitrião: Clara",
        coordinates: [-46.6872, -23.5504] as [number, number],
        type: "Estúdio"
    },
    {
        id: 12,
        title: "Apartamento próximo ao shopping",
        location: "Morumbi, São Paulo",
        details: "Espaço inteiro: apartamento",
        features: "3 hóspedes · 2 quartos · 2 camas · 1 banheiro",
        pricePerNight: 210,
        rating: { value: 4.7, count: 52 },
        image: "/recomendado3.jpg",
        link: "/imoveis/morumbi-shopping",
        host: "Anfitrião: Francisco",
        coordinates: [-46.7234, -23.6170] as [number, number],
        type: "Apartamento"
    },
];

const mapFirebaseToPropertyCard = (properties: any[]): PropertyCard[] => {
    if (!Array.isArray(properties)) {
        console.error("Data received for mapping is not an array:", properties);
        return [];
    }
    return properties.map(p => ({
        id: p.id,
        title: p.title || "No title",
        location: p.location?.fullAddress || "No location",
        details: `${p.type || 'N/A'} · ${p.bedrooms || 0} quartos`,
        features: `${p.maxGuests || 1} hóspedes · ${p.bedrooms || 0} quarto(s) · ${p.beds || 0} cama(s) · ${p.bathrooms || 0} banheiro(s)`,
        pricePerNight: p.price || 0,
        rating: {
            value: p.rating?.average ? parseFloat(p.rating.average.toFixed(1)) : 0,
            count: p.rating?.count || 0
        },
        image: (p.images && p.images.length > 0) ? p.images[0].url : "/placeholder.jpg",
        images: p.images?.map((img: any) => img.url) || [],
        link: `/imoveis/${p.id}`,
        host: p.host?.name || "Anfitrião não informado",
        coordinates: p.location?.coordinates ? [p.location.coordinates.latitude, p.location.coordinates.longitude] : undefined,
        description: p.description || "Sem descrição.",
        whatWeOffer: p.amenities?.join(', ') || "Comodidades não listadas.",
        whatYouShouldKnowRichText: p.whatYouShouldKnow || "Informações adicionais não fornecidas.",
        serviceFee: p.serviceFee || 0,
        discountSettings: p.discountSettings,
        type: p.type || "Não especificado",
        category: p.category,
        rooms: p.bedrooms,
        bathrooms: p.bathrooms,
        beds: p.beds,
        guests: p.maxGuests,
        amenities: p.amenities,
        houseRules: p.houseRules,
        safety: p.safety,
        whatYouShouldKnowSections: p.whatYouShouldKnowSections,
        pointsOfInterest: p.pointsOfInterest,
    }));
};

export const FilterProvider = ({ children }: { children: ReactNode }) => {
    const { properties: fetchedProperties, loading, error } = useProperties();

    const allProperties = useMemo(() => {
        if (!fetchedProperties) return staticAllProperties;
        return mapFirebaseToPropertyCard(fetchedProperties);
    }, [fetchedProperties]);

    const [filteredProperties, setFilteredProperties] = useState<PropertyCard[]>([]);
    const [activeFilters, setActiveFilters] = useState({
        propertyType: 'all',
        priceRange: { min: 0, max: 3000 },
        amenities: [] as string[],
        roomsAndBeds: { rooms: 0, beds: 0 },
        rating: 0,
        searchTerm: '',
        dateRange: [null, null] as [Date | null, Date | null],
    });

    useEffect(() => {
        const applyFilters = () => {
            let updatedProperties = [...allProperties];

            if (activeFilters.propertyType !== 'all') {
                updatedProperties = updatedProperties.filter(p => p.type === activeFilters.propertyType);
            }

            updatedProperties = updatedProperties.filter(p =>
                p.pricePerNight >= activeFilters.priceRange.min &&
                p.pricePerNight <= activeFilters.priceRange.max
            );

            if (activeFilters.amenities.length > 0) {
                updatedProperties = updatedProperties.filter(p =>
                    activeFilters.amenities.every(amenity => p.amenities?.includes(amenity))
                );
            }

            if (activeFilters.roomsAndBeds.rooms > 0) {
                updatedProperties = updatedProperties.filter(p => (p.rooms || 0) >= activeFilters.roomsAndBeds.rooms);
            }
            if (activeFilters.roomsAndBeds.beds > 0) {
                updatedProperties = updatedProperties.filter(p => (p.beds || 0) >= activeFilters.roomsAndBeds.beds);
            }

            if (activeFilters.rating > 0) {
                updatedProperties = updatedProperties.filter(p => p.rating.value >= activeFilters.rating);
            }

            if (activeFilters.searchTerm) {
                const searchTermLower = activeFilters.searchTerm.toLowerCase();
                updatedProperties = updatedProperties.filter(p =>
                    p.title.toLowerCase().includes(searchTermLower) ||
                    p.location.toLowerCase().includes(searchTermLower) ||
                    (p.description && p.description.toLowerCase().includes(searchTermLower))
                );
            }

            if (activeFilters.dateRange[0] && activeFilters.dateRange[1]) {
                // Placeholder for availability logic
                updatedProperties = updatedProperties.filter(p => {
                    return true;
                });
            }

            setFilteredProperties(updatedProperties);
        };

        applyFilters();
    }, [activeFilters, allProperties]);

    const handleFilterChange = (newFilters: any) => {
        setActiveFilters(prev => ({ ...prev, ...newFilters }));
    };

    return (
        <FilterContext.Provider value={{ allProperties, filteredProperties, activeFilters, handleFilterChange, loading, error }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilters = () => {
    const context = useContext(FilterContext);
    if (context === undefined) {
        throw new Error('useFilters must be used within a FilterProvider');
    }
    return context;
}; 