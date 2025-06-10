'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FilterState {
    isFilterModalOpen: boolean;
    toggleFilterModal: () => void;
    activeFilters: any; // Consider defining a more specific type
    setActiveFilters: (filters: any) => void;
    // You can add apply and clear functions here if needed
}

const FilterContext = createContext<FilterState | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});

    const toggleFilterModal = () => {
        setIsFilterModalOpen(prev => !prev);
    };

    const value = {
        isFilterModalOpen,
        toggleFilterModal,
        activeFilters,
        setActiveFilters
    };

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilter = (): FilterState => {
    const context = useContext(FilterContext);
    if (context === undefined) {
        throw new Error('useFilter must be used within a FilterProvider');
    }
    return context;
}; 