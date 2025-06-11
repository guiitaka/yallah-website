'use client'

import React, { useState, useEffect } from 'react';
import { X } from '@phosphor-icons/react';
import { useFilter } from '@/context/FilterContext';
import { useProperties } from '@/hooks/useProperties';
import { formatCurrency } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Property } from '@/data/sampleProperties';

// Type for the filters
interface FilterValues {
    minPrice?: number;
    maxPrice?: number;
    type?: string;
    category?: string;
    bedrooms?: number;
    bathrooms?: number;
    beds?: number;
    guests?: number;
    minRating?: number;
    hasPromotion?: boolean;
}

// Mobile-friendly option selector
const FilterOption = ({ label, isSelected, onClick }: { label: string, isSelected: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={cn(
            "px-4 py-2 rounded-full border text-sm font-medium transition-colors",
            isSelected ? "bg-[#8BADA4] text-white border-[#8BADA4]" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
        )}
    >
        {label}
    </button>
);

// Helper to get unique string values from properties
const getUniqueOptions = (properties: Property[], key: keyof Property): string[] => {
    if (!properties) return [];
    const allValues = properties.map(p => p[key]).filter(Boolean) as string[];
    return Array.from(new Set(allValues));
}

// Helper to find min/max price
const getPriceRange = (properties: Property[]) => {
    if (!properties || properties.length === 0) return [0, 2000];
    const prices = properties.map(p => p.price).filter((p): p is number => typeof p === 'number');
    if (prices.length === 0) return [0, 2000];
    return [Math.min(...prices), Math.max(...prices)];
};

export default function PropertyFilterModal() {
    const { isFilterModalOpen, toggleFilterModal, activeFilters, setActiveFilters } = useFilter();
    const { properties } = useProperties({});

    const [tempFilters, setTempFilters] = useState<FilterValues>(activeFilters);
    const [minPrice, maxPrice] = getPriceRange(properties);
    const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);

    // Generate dynamic options from properties
    const typeOptions = getUniqueOptions(properties, 'type');
    const categoryOptions = getUniqueOptions(properties, 'category');

    useEffect(() => {
        setTempFilters(activeFilters);
        const [min, max] = getPriceRange(properties);
        setPriceRange([activeFilters.minPrice ?? min, activeFilters.maxPrice ?? max]);
    }, [isFilterModalOpen, activeFilters, properties]);

    const handleApplyFilters = () => {
        setActiveFilters(tempFilters);
        toggleFilterModal();

        // Adiciona um pequeno delay para garantir que o modal fechou antes de rolar
        setTimeout(() => {
            const section = document.getElementById('imoveis-disponiveis');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Close modal if the click is on the overlay itself, not its children
        if (e.target === e.currentTarget) {
            toggleFilterModal();
        }
    };

    const handleClearFilters = () => {
        const [min, max] = getPriceRange(properties);
        setTempFilters({});
        setPriceRange([min, max]);
    };

    const handleSelectChange = (key: keyof FilterValues, value: string | number | boolean) => {
        setTempFilters((prev: FilterValues) => ({
            ...prev,
            [key]: prev[key] === value ? undefined : value
        }));
    };

    const handlePriceChange = (value: [number, number]) => {
        setPriceRange(value);
        setTempFilters((prev: FilterValues) => ({
            ...prev,
            minPrice: value[0],
            maxPrice: value[1]
        }));
    };

    if (!isFilterModalOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-end animate-fadeIn"
            onClick={handleOverlayClick}
        >
            <div className="w-full bg-white rounded-t-2xl shadow-xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>

                {/* Header: Always visible, not part of the scroll. */}
                <div className="flex-shrink-0 flex items-center justify-between p-4 border-b">
                    <button onClick={toggleFilterModal} className="p-1 rounded-full hover:bg-gray-100">
                        <X size={24} className="text-gray-800" />
                    </button>
                    <h2 className="font-bold text-lg">Filtros</h2>
                    <button onClick={handleClearFilters} className="text-sm font-medium text-gray-700 hover:text-black px-3 py-1 rounded-md hover:bg-gray-100">
                        Limpar
                    </button>
                </div>

                {/* Main: This is the only scrollable area. */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4">
                        {/* Price Range */}
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">Preço por Noite</h3>
                            <Slider
                                min={minPrice}
                                max={maxPrice}
                                step={10}
                                value={priceRange}
                                onValueChange={handlePriceChange}
                            />
                            <div className="flex justify-between text-sm text-gray-500 mt-2">
                                <span>{formatCurrency(priceRange[0])}</span>
                                <span>{formatCurrency(priceRange[1])}</span>
                            </div>
                        </div>

                        {/* Property Type */}
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">Tipo de Imóvel</h3>
                            <div className="flex flex-wrap gap-2">
                                {typeOptions.map(type => (
                                    <FilterOption
                                        key={type}
                                        label={type}
                                        isSelected={tempFilters.type === type}
                                        onClick={() => handleSelectChange('type', type)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Category */}
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">Categorias</h3>
                            <div className="flex flex-wrap gap-2">
                                {categoryOptions.map(cat => (
                                    <FilterOption
                                        key={cat}
                                        label={cat}
                                        isSelected={tempFilters.category === cat}
                                        onClick={() => handleSelectChange('category', cat)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Rooms */}
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">Quartos</h3>
                            <div className="flex flex-wrap gap-2">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <FilterOption
                                        key={`bedrooms-${n}`}
                                        label={n === 5 ? '5+' : `${n}`}
                                        isSelected={tempFilters.bedrooms === n}
                                        onClick={() => handleSelectChange('bedrooms', n)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Bathrooms */}
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">Banheiros</h3>
                            <div className="flex flex-wrap gap-2">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <FilterOption
                                        key={`bathrooms-${n}`}
                                        label={n === 5 ? '5+' : `${n}`}
                                        isSelected={tempFilters.bathrooms === n}
                                        onClick={() => handleSelectChange('bathrooms', n)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Beds */}
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">Camas</h3>
                            <div className="flex flex-wrap gap-2">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <FilterOption
                                        key={`beds-${n}`}
                                        label={n === 5 ? '5+' : `${n}`}
                                        isSelected={tempFilters.beds === n}
                                        onClick={() => handleSelectChange('beds', n)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Guests */}
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">Hóspedes</h3>
                            <div className="flex flex-wrap gap-2">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                    <FilterOption
                                        key={`guests-${n}`}
                                        label={n === 8 ? '8+' : `${n}`}
                                        isSelected={tempFilters.guests === n}
                                        onClick={() => handleSelectChange('guests', n)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">Avaliações</h3>
                            <div className="flex flex-wrap gap-2">
                                {[5, 4, 3].map(n => (
                                    <FilterOption
                                        key={`rating-${n}`}
                                        label={n === 5 ? `${n} ★` : `${n}+ ★`}
                                        isSelected={tempFilters.minRating === n}
                                        onClick={() => handleSelectChange('minRating', n)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Promotion */}
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">Promoção</h3>
                            <div className="flex flex-wrap gap-2">
                                <FilterOption
                                    label="Em promoção"
                                    isSelected={tempFilters.hasPromotion === true}
                                    onClick={() => handleSelectChange('hasPromotion', true)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer: Always visible, not part of the scroll. */}
                <div className="flex-shrink-0 p-4 bg-white border-t">
                    <Button onClick={handleApplyFilters} className="w-full bg-[#8BADA4] h-12 text-lg hover:bg-[#7a998e]">
                        Aplicar Filtros
                    </Button>
                </div>
            </div>
        </div>
    );
} 