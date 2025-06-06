'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { PropertyCard } from './AllProperties'; // Assuming PropertyCard is exported or defined elsewhere accessible

// Import directly from the ui directory that's in the same directory
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

// For other components, continue to use the original imports
import { Slider } from "../../components/ui/slider";
import { Label } from "../../components/ui/label";
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
  onClearFilters?: () => void;
}

const FilterPopover: React.FC<{
  label: string;
  value: string | undefined;
  options: { value: string; label: string }[];
  onValueChange: (value: string) => void;
  placeholder: string;
  className?: string;
}> = ({ label, value, options, onValueChange, placeholder, className }) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      <Label className="text-sm font-semibold text-[#8BADA4]">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="w-auto justify-center text-gray-800 font-medium text-base p-1 h-auto hover:bg-stone-200 rounded-md"
          >
            {selectedOption ? selectedOption.label : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder={`Buscar ${label.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue: string) => {
                      onValueChange(currentValue === value ? '' : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  properties,
  activeFilters,
  setActiveFilters,
  onFilterChange,
  onClearFilters,
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

  const createOptions = (keys: (string | number | undefined)[]) => {
    const uniqueKeys = Array.from(new Set(keys.filter(Boolean))) as string[];
    const options = uniqueKeys.sort().map(key => ({ value: key, label: key }));
    options.unshift({ value: 'all', label: `Todos os Tipos` });
    return options;
  };

  const createGroupedNumericOptions = (keys: (number | undefined)[]) => {
    const uniqueKeys = Array.from(new Set(keys.filter((k): k is number => typeof k === 'number' && k > 0)));
    const options: { value: string; label: string }[] = [];
    const threshold = 5;

    uniqueKeys.forEach(key => {
      if (key < threshold) {
        options.push({ value: key.toString(), label: key.toString() });
      }
    });

    if (uniqueKeys.some(key => key >= threshold)) {
      options.push({ value: threshold.toString(), label: `${threshold}+` });
    }

    options.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));

    options.unshift({ value: 'all', label: `Todos` });

    return options;
  };

  const availableTypes = createOptions(properties.map(p => p.type));
  availableTypes[0].label = "Todos os Tipos";
  const availableCategories = createOptions(properties.map(p => p.category));
  availableCategories[0].label = "Todas as Categorias";
  const availableRoomCounts = createGroupedNumericOptions(properties.map(p => p.rooms));
  const availableBathroomCounts = createGroupedNumericOptions(properties.map(p => p.bathrooms));
  const availableBedCounts = createGroupedNumericOptions(properties.map(p => p.beds));
  const availableGuestCounts = createGroupedNumericOptions(properties.map(p => p.guests));

  const ratingOptions = [
    { value: 'all', label: "Todas" },
    { value: '5', label: "5" },
    { value: '4.5', label: "4.5+" },
    { value: '4', label: "4+" },
    { value: '3.5', label: "3.5+" },
    { value: '3', label: "3+" },
  ];

  const promotionOptions = [
    { value: 'all', label: 'Todas' },
    { value: 'true', label: 'Sim' }
  ]

  const handleFilterChange = (filterKey: string, value: string) => {
    const isAll = value === 'all' || value === '';
    let processedValue;
    if (isAll) {
      processedValue = undefined;
    } else if (filterKey === 'hasPromotion') {
      processedValue = (value === 'true');
    } else if (filterKey.match(/rooms|bathrooms|beds|guests|minRating/)) {
      processedValue = parseFloat(value);
    } else {
      processedValue = value;
    }

    const newFilters = {
      ...activeFilters,
      [filterKey]: processedValue
    };
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

  const areFiltersActive = Object.values(activeFilters).some(v => v !== undefined);

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-around gap-x-4 gap-y-4">
        <FilterPopover label="Tipo de Imóvel" value={activeFilters.type} options={availableTypes} onValueChange={(v) => handleFilterChange('type', v)} placeholder="Todos os Tipos" />
        <FilterPopover label="Categorias" value={activeFilters.category} options={availableCategories} onValueChange={(v) => handleFilterChange('category', v)} placeholder="Todas as Categorias" />
        <FilterPopover label="Quartos" value={activeFilters.rooms?.toString()} options={availableRoomCounts} onValueChange={(v) => handleFilterChange('rooms', v)} placeholder="Todos" />
        <FilterPopover label="Banheiros" value={activeFilters.bathrooms?.toString()} options={availableBathroomCounts} onValueChange={(v) => handleFilterChange('bathrooms', v)} placeholder="Todos" />
        <FilterPopover label="Camas" value={activeFilters.beds?.toString()} options={availableBedCounts} onValueChange={(v) => handleFilterChange('beds', v)} placeholder="Todos" />
        <FilterPopover label="Hóspedes" value={activeFilters.guests?.toString()} options={availableGuestCounts} onValueChange={(v) => handleFilterChange('guests', v)} placeholder="Todos" />
        <FilterPopover label="Avaliações" value={activeFilters.minRating?.toString()} options={ratingOptions} onValueChange={(v) => handleFilterChange('minRating', v)} placeholder="Todas" />
        {/* Price Range Slider */}
        <div className="flex flex-col items-center space-y-2">
          <Label htmlFor="price-range-slider" className="text-sm font-semibold text-[#8BADA4]">Preço por Noite</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="w-auto justify-center text-gray-800 font-medium text-base p-1 h-auto hover:bg-stone-200 rounded-md">
                {`${formatCurrency(currentPriceRange[0])} - ${formatCurrency(currentPriceRange[1])}`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-4">
              <div className="space-y-4">
                <Label>Selecione o intervalo de preço</Label>
                <Slider
                  id="price-range-slider"
                  min={minPrice}
                  max={maxPrice}
                  step={10}
                  value={currentPriceRange}
                  onValueChange={handlePriceChange}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formatCurrency(currentPriceRange[0])}</span>
                  <span>{formatCurrency(currentPriceRange[1])}</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <FilterPopover label="Promoção" value={activeFilters.hasPromotion?.toString()} options={promotionOptions} onValueChange={(v) => handleFilterChange('hasPromotion', v)} placeholder="Todas" />
        {areFiltersActive && onClearFilters && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            className="text-sm font-semibold text-red-500 hover:bg-red-50"
          >
            Limpar Filtros
          </Button>
        )}
      </div>
    </div>
  );
};

export default PropertyFilters; 