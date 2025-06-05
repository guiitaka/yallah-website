'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { PropertyCard } from './AllProperties'; // Assuming PropertyCard is exported or defined elsewhere accessible
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { formatCurrency } from '@/utils/format';

// TODO: Import ShadCN components as needed (e.g., Select, Slider, Checkbox, etc.)
// import {
// Select,
// SelectContent,
// SelectItem,
// SelectTrigger,
// SelectValue,
// } from "@/components/ui/select";

// Define the props for the PropertyFilters component
interface PropertyFiltersProps {
  properties: PropertyCard[]; // Pass all properties to extract filter options
  activeFilters: any; // Replace 'any' with a specific filter type later
  setActiveFilters: React.Dispatch<React.SetStateAction<any>>; // Replace 'any'
  onFilterChange: (filters: any) => void; // Callback to apply filters // Replace 'any'
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  properties,
  activeFilters,
  setActiveFilters,
  onFilterChange,
}) => {
  const [minPrice, maxPrice] = useMemo(() => {
    if (!properties || properties.length === 0) return [0, 1000]; // Default range
    const prices = properties.map(p => p.pricePerNight);
    return [Math.min(...prices), Math.max(...prices)];
  }, [properties]);

  // Local state for the current price range displayed on the slider
  const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([minPrice, maxPrice]);

  // Update local slider range when minPrice/maxPrice props change (e.g. on initial load)
  useEffect(() => {
    setCurrentPriceRange([activeFilters.minPrice ?? minPrice, activeFilters.maxPrice ?? maxPrice]);
  }, [minPrice, maxPrice, activeFilters.minPrice, activeFilters.maxPrice]);

  const availableTypes = useMemo(() => {
    const types = new Set(properties.map(p => p.type).filter(Boolean) as string[]);
    return Array.from(types).sort();
  }, [properties]);

  const availableCategories = useMemo(() => {
    const categories = new Set(properties.map(p => p.category).filter(Boolean) as string[]);
    return Array.from(categories).sort();
  }, [properties]);

  const availableRoomCounts = useMemo(() => {
    if (!properties || properties.length === 0) return [];
    const counts = new Set(properties.map(p => p.rooms).filter(r => typeof r === 'number' && r > 0) as number[]);
    const sortedCounts = Array.from(counts).sort((a, b) => a - b);
    // Group larger room counts into a "X+" option if needed, e.g., 5+
    // For now, let's list all unique counts. Can be refined later.
    return sortedCounts;
  }, [properties]);

  const availableBathroomCounts = useMemo(() => {
    if (!properties || properties.length === 0) return [];
    const counts = new Set(properties.map(p => p.bathrooms).filter(b => typeof b === 'number' && b > 0) as number[]);
    return Array.from(counts).sort((a, b) => a - b);
  }, [properties]);

  const availableBedCounts = useMemo(() => {
    if (!properties || properties.length === 0) return [];
    const counts = new Set(properties.map(p => p.beds).filter(b => typeof b === 'number' && b > 0) as number[]);
    return Array.from(counts).sort((a, b) => a - b);
  }, [properties]);

  const availableGuestCounts = useMemo(() => {
    if (!properties || properties.length === 0) return [];
    const counts = new Set(properties.map(p => p.guests).filter(g => typeof g === 'number' && g > 0) as number[]);
    return Array.from(counts).sort((a, b) => a - b);
  }, [properties]);

  // Define rating options
  const ratingOptions = [
    { value: 5, label: "5 estrelas" },
    { value: 4.5, label: "4.5 estrelas ou mais" },
    { value: 4, label: "4 estrelas ou mais" },
    { value: 3.5, label: "3.5 estrelas ou mais" },
    { value: 3, label: "3 estrelas ou mais" },
  ];

  const handleTypeChange = (value: string) => {
    const newFilters = { ...activeFilters, type: value === 'all' ? undefined : value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryChange = (value: string) => {
    const newFilters = { ...activeFilters, category: value === 'all' ? undefined : value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRoomsChange = (value: string) => {
    const roomValue = value === 'all' ? undefined : parseInt(value, 10);
    const newFilters = { ...activeFilters, rooms: roomValue };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBathroomChange = (value: string) => {
    const bathroomValue = value === 'all' ? undefined : parseInt(value, 10);
    const newFilters = { ...activeFilters, bathrooms: bathroomValue };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBedChange = (value: string) => {
    const bedValue = value === 'all' ? undefined : parseInt(value, 10);
    const newFilters = { ...activeFilters, beds: bedValue };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleGuestChange = (value: string) => {
    const guestValue = value === 'all' ? undefined : parseInt(value, 10);
    const newFilters = { ...activeFilters, guests: guestValue };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (value: string) => {
    const ratingValue = value === 'all' ? undefined : parseFloat(value);
    const newFilters = { ...activeFilters, minRating: ratingValue };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePromotionChange = (value: string) => {
    const newFilters = { ...activeFilters, hasPromotion: value === 'true' ? true : undefined };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (newRange: [number, number]) => {
    setCurrentPriceRange(newRange);
    const newFilters = {
      ...activeFilters,
      minPrice: newRange[0],
      maxPrice: newRange[1],
    };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4 md:space-y-0">
      <div className="flex flex-wrap items-end justify-center gap-x-3 gap-y-3 md:gap-x-4 md:gap-y-4">
        {/* Filtro Tipo de Imóvel */}
        <div className="space-y-1 flex-shrink-0">
          <Label htmlFor="property-type-select" className="text-xs font-semibold text-white text-center w-full">Tipo de Imóvel</Label>
          <Select
            onValueChange={handleTypeChange}
            value={activeFilters.type || 'all'}
            name="property-type-select"
            aria-label="Selecionar tipo de imóvel"
          >
            <SelectTrigger className="w-full bg-transparent text-white font-semibold border-white/70 hover:border-white focus:ring-white/50">
              <SelectValue placeholder="Selecione um tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              {availableTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro Categoria do Imóvel */}
        <div className="space-y-1 flex-shrink-0">
          <Label htmlFor="property-category-select" className="text-xs font-semibold text-white text-center w-full">Categoria</Label>
          <Select
            onValueChange={handleCategoryChange}
            value={activeFilters.category || 'all'}
            name="property-category-select"
            aria-label="Selecionar categoria do imóvel"
          >
            <SelectTrigger className="w-full bg-transparent text-white font-semibold border-white/70 hover:border-white focus:ring-white/50">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Categorias</SelectItem>
              {availableCategories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro Quartos */}
        <div className="space-y-1 flex-shrink-0">
          <Label htmlFor="property-rooms-select" className="text-xs font-semibold text-white text-center w-full">Quartos</Label>
          <Select
            onValueChange={handleRoomsChange}
            value={activeFilters.rooms?.toString() || 'all'}
            name="property-rooms-select"
            aria-label="Selecionar número de quartos"
          >
            <SelectTrigger className="w-full bg-transparent text-white font-semibold border-white/70 hover:border-white focus:ring-white/50">
              <SelectValue placeholder="Nº de Quartos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {availableRoomCounts.map(count => (
                <SelectItem key={count} value={count.toString()}>{count} {count === 1 ? 'quarto' : 'quartos'}</SelectItem>
              ))}
              {/* Optionally, add a X+ option, e.g., if max rooms is high */}
              {/* <SelectItem value="5+">5+ quartos</SelectItem> */}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro Banheiros */}
        <div className="space-y-1 flex-shrink-0">
          <Label htmlFor="property-bathrooms-select" className="text-xs font-semibold text-white text-center w-full">Banheiros</Label>
          <Select
            onValueChange={handleBathroomChange}
            value={activeFilters.bathrooms?.toString() || 'all'}
            name="property-bathrooms-select"
            aria-label="Selecionar número de banheiros"
          >
            <SelectTrigger className="w-full bg-transparent text-white font-semibold border-white/70 hover:border-white focus:ring-white/50">
              <SelectValue placeholder="Nº de Banheiros" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {availableBathroomCounts.map(count => (
                <SelectItem key={count} value={count.toString()}>{count} {count === 1 ? 'banheiro' : 'banheiros'}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro Camas */}
        <div className="space-y-1 flex-shrink-0">
          <Label htmlFor="property-beds-select" className="text-xs font-semibold text-white text-center w-full">Camas</Label>
          <Select
            onValueChange={handleBedChange}
            value={activeFilters.beds?.toString() || 'all'}
            name="property-beds-select"
            aria-label="Selecionar número de camas"
          >
            <SelectTrigger className="w-full bg-transparent text-white font-semibold border-white/70 hover:border-white focus:ring-white/50">
              <SelectValue placeholder="Nº de Camas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {availableBedCounts.map(count => (
                <SelectItem key={count} value={count.toString()}>{count} {count === 1 ? 'cama' : 'camas'}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro Hóspedes */}
        <div className="space-y-1 flex-shrink-0">
          <Label htmlFor="property-guests-select" className="text-xs font-semibold text-white text-center w-full">Hóspedes</Label>
          <Select
            onValueChange={handleGuestChange}
            value={activeFilters.guests?.toString() || 'all'}
            name="property-guests-select"
            aria-label="Selecionar número de hóspedes"
          >
            <SelectTrigger className="w-full bg-transparent text-white font-semibold border-white/70 hover:border-white focus:ring-white/50">
              <SelectValue placeholder="Nº de Hóspedes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {availableGuestCounts.map(count => (
                <SelectItem key={count} value={count.toString()}>{count} {count === 1 ? 'hóspede' : 'hóspedes'}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro Avaliações */}
        <div className="space-y-1 flex-shrink-0">
          <Label htmlFor="property-rating-select" className="text-xs font-semibold text-white text-center w-full">Avaliações</Label>
          <Select
            onValueChange={handleRatingChange}
            value={activeFilters.minRating?.toString() || 'all'}
            name="property-rating-select"
            aria-label="Selecionar avaliação mínima"
          >
            <SelectTrigger className="w-full bg-transparent text-white font-semibold border-white/70 hover:border-white focus:ring-white/50">
              <SelectValue placeholder="Avaliação Mínima" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {ratingOptions.map(option => (
                <SelectItem key={option.value} value={option.value.toString()}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro Preço por Noite with Popover */}
        <div className="space-y-1 flex-shrink-0">
          <Label htmlFor="property-price-popover-trigger" className="text-xs font-semibold text-white text-center w-full">Preço por Noite</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="property-price-popover-trigger"
                variant="outline"
                className="w-full justify-start text-left font-semibold text-white bg-transparent border-white/70 hover:border-white hover:bg-white/10 focus:ring-white/50 min-w-[180px]"
              >
                {formatCurrency(currentPriceRange[0])} - {formatCurrency(currentPriceRange[1])}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-4 bg-white" align="start">
              <div className="space-y-4">
                <Slider
                  id="property-price-range"
                  min={minPrice}
                  max={maxPrice}
                  step={10}
                  value={currentPriceRange}
                  onValueChange={handlePriceChange}
                  className="w-full"
                  aria-label="Selecionar faixa de preço por noite"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{formatCurrency(currentPriceRange[0])}</span>
                  <span>{formatCurrency(currentPriceRange[1])}</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Filtro Promoção - Changed to Select component */}
        <div className="space-y-1 flex-shrink-0">
          <Label htmlFor="property-promotion-select" className="text-xs font-semibold text-white text-center w-full">Promoção</Label>
          <Select
            onValueChange={handlePromotionChange} // Reusing and adapting the handler
            value={activeFilters.hasPromotion === true ? 'true' : 'all'}
            name="property-promotion-select"
            aria-label="Filtrar por promoção"
          >
            <SelectTrigger className="w-full bg-transparent text-white font-semibold border-white/70 hover:border-white focus:ring-white/50 min-w-[150px]">
              <SelectValue placeholder="Promoção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="true">Em Promoção</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters; 