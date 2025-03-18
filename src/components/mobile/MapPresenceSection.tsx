'use client';

import React, { useState, useRef, useEffect } from 'react';
import MapboxSaoPaulo from '@/components/ui/MapboxSaoPaulo';

// Dados dos bairros
const neighborhoods = [
    { id: "vila-mariana", name: "Vila Mariana", properties: 3, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400" },
    { id: "pinheiros", name: "Pinheiros", properties: 4, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400" },
    { id: "moema", name: "Moema", properties: 2, image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400" },
    { id: "itaim-bibi", name: "Itaim Bibi", properties: 3, image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400" },
    { id: "jardins", name: "Jardins", properties: 4, image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=400" },
    { id: "brooklin", name: "Brooklin", properties: 2, image: "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=400" },
    { id: "paraiso", name: "Paraíso", properties: 3, image: "https://images.unsplash.com/photo-1475855581690-80accde3ae2b?w=400" },
    { id: "higienopolis", name: "Higienópolis", properties: 2, image: "https://images.unsplash.com/photo-1459535653751-d571815e906b?w=400" },
    { id: "perdizes", name: "Perdizes", properties: 3, image: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=400" },
    { id: "vila-madalena", name: "Vila Madalena", properties: 2, image: "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=400" },
    { id: "vila-olimpia", name: "Vila Olímpia", properties: 4, image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400" },
    { id: "santana", name: "Santana", properties: 2, image: "https://images.unsplash.com/photo-1469022563428-aa04fef9f5a2?w=400" },
    { id: "tatuape", name: "Tatuapé", properties: 3, image: "https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?w=400" },
];

export default function MapPresenceSection() {
    const [hoveredNeighborhood, setHoveredNeighborhood] = useState<string | null>(null);
    const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<{ showPopup: (id: string) => void } | null>(null);

    const handleNeighborhoodHover = (id: string | null) => {
        setHoveredNeighborhood(id);
    };

    const handleNeighborhoodClick = (id: string) => {
        setSelectedNeighborhood(id);
        if (mapRef.current) {
            mapRef.current.showPopup(id);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const scrollAmount = clientWidth * 0.8;
            const newScrollLeft = direction === 'left'
                ? scrollLeft - scrollAmount
                : scrollLeft + scrollAmount;

            requestAnimationFrame(() => {
                scrollContainerRef.current?.scrollTo({
                    left: newScrollLeft,
                    behavior: 'smooth'
                });
            });
        }
    };

    return (
        <div className="w-full bg-gradient-to-b from-white to-[#FAFBFC] py-12">
            <div className="px-4">
                {/* Title and Description - Moved above the map */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                        Presente em toda
                        <span className="text-primary block">São Paulo</span>
                    </h2>
                    <p className="mt-4 text-gray-600 leading-relaxed">
                        Com mais de 30 imóveis distribuídos pelos principais bairros de São Paulo,
                        a Yallah está transformando a maneira como as pessoas alugam e gerenciam seus imóveis.
                    </p>
                </div>

                {/* Map Container */}
                <div className="relative h-[450px] w-full mb-6">
                    <div className="absolute inset-0 bg-white rounded-2xl shadow-lg overflow-hidden">
                        <MapboxSaoPaulo
                            hoveredNeighborhood={hoveredNeighborhood}
                            selectedNeighborhood={selectedNeighborhood}
                            onNeighborhoodHover={handleNeighborhoodHover}
                            onNeighborhoodClick={handleNeighborhoodClick}
                            mapRef={mapRef}
                        />
                    </div>
                </div>

                {/* Interactive neighborhood list */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-[#8BADA4]">Nossos Bairros</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => scroll('left')}
                                className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-primary flex items-center justify-center transition-colors"
                                aria-label="Rolar para a esquerda"
                            >
                                <svg className="w-5 h-5 text-gray-600 hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-primary flex items-center justify-center transition-colors"
                                aria-label="Rolar para a direita"
                            >
                                <svg className="w-5 h-5 text-gray-600 hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div
                        ref={scrollContainerRef}
                        className="overflow-x-auto hide-scrollbar"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            overscrollBehavior: 'contain',
                            touchAction: 'pan-x'
                        }}
                    >
                        <div className="flex gap-3 pb-4" style={{ minWidth: 'min-content' }}>
                            {neighborhoods.map((neighborhood) => (
                                <div
                                    key={neighborhood.id}
                                    id={`neighborhood-${neighborhood.id}`}
                                    className={`flex-none p-4 rounded-xl cursor-pointer transition-all duration-300 min-w-[200px] ${hoveredNeighborhood === neighborhood.id || selectedNeighborhood === neighborhood.id
                                        ? 'bg-[#2A9D8F]'
                                        : 'bg-white hover:bg-gray-50'
                                        }`}
                                    onMouseEnter={() => handleNeighborhoodHover(neighborhood.id)}
                                    onMouseLeave={() => handleNeighborhoodHover(null)}
                                    onClick={() => handleNeighborhoodClick(neighborhood.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-100">
                                            <img
                                                src={neighborhood.image}
                                                alt={neighborhood.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className={`font-medium text-lg ${hoveredNeighborhood === neighborhood.id || selectedNeighborhood === neighborhood.id
                                                ? 'text-white'
                                                : 'text-gray-900'
                                                }`}>{neighborhood.name}</span>
                                            <span className={`text-sm ${hoveredNeighborhood === neighborhood.id || selectedNeighborhood === neighborhood.id
                                                ? 'text-white'
                                                : 'text-gray-500'
                                                }`}>
                                                {neighborhood.properties} imóveis
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
} 