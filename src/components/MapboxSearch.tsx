'use client'

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MagnifyingGlass } from '@phosphor-icons/react';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxSearchProps {
    onLocationSelect: (location: { address: string; coordinates: [number, number] }) => void;
    initialValue?: string;
}

// Componente wrapper que só renderiza no cliente
const ClientSideMapboxSearch: React.FC<MapboxSearchProps> = (props) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="w-full h-full bg-gray-100 flex items-center justify-center p-4 rounded-lg">
            <div className="text-gray-500">Carregando busca...</div>
        </div>;
    }

    return <MapboxSearch {...props} />;
};

const MapboxSearch: React.FC<MapboxSearchProps> = ({ onLocationSelect, initialValue = '' }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const marker = useRef<mapboxgl.Marker | null>(null);
    const [mapError, setMapError] = useState<string | null>(null);
    const [addressInput, setAddressInput] = useState(initialValue);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<{
        address: string;
        coordinates: [number, number];
    } | null>(null);

    // Atualiza o addressInput quando o initialValue muda
    useEffect(() => {
        if (initialValue && initialValue !== addressInput) {
            setAddressInput(initialValue);
        }
    }, [initialValue]);

    useEffect(() => {
        if (!mapContainer.current) return;

        try {
            const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

            if (!token) {
                setMapError('Token do Mapbox não encontrado');
                return;
            }

            mapboxgl.accessToken = token;

            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [-46.6333, -23.5505], // São Paulo coordinates
                zoom: 12
            });

            // Create a default marker
            marker.current = new mapboxgl.Marker({
                color: '#8BADA4'
            });

            // Adicionar tratamento de erros
            map.current.on('error', (e) => {
                console.error('Mapbox error:', e);
                setMapError('Erro ao carregar o mapa');
            });

        } catch (error) {
            console.error('Error initializing map:', error);
            setMapError('Erro ao inicializar o mapa');
        }

        return () => {
            try {
                map.current?.remove();
            } catch (error) {
                console.error('Error removing map:', error);
            }
        };
    }, []);

    const handleManualAddressInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const address = e.target.value;
        setAddressInput(address);

        if (address.length > 3) {
            searchAddress(address);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    };

    const searchAddress = async (query: string) => {
        try {
            setIsSearching(true);
            const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

            if (!token) {
                console.error('Mapbox token not found');
                return;
            }

            // Adicionar "São Paulo, Brasil" ao final da consulta para melhorar os resultados
            const searchQuery = `${query}, São Paulo, Brasil`;

            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${token}&country=br&types=address,neighborhood&language=pt&autocomplete=true&limit=5`
            );

            if (!response.ok) {
                throw new Error('Falha na busca de endereço');
            }

            const data = await response.json();
            setSearchResults(data.features || []);
            setShowResults(true);
        } catch (error) {
            console.error('Error searching address:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddressSelect = (result: any) => {
        if (!map.current || !marker.current) return;

        try {
            const coordinates: [number, number] = [
                result.center[0],
                result.center[1]
            ];

            // Update marker position
            marker.current.setLngLat(coordinates).addTo(map.current);

            // Center map on selected location
            map.current.flyTo({
                center: coordinates,
                zoom: 15
            });

            // Extract neighborhood from context if available
            let neighborhood = '';
            if (result.context) {
                const neighborhoodContext = result.context.find((ctx: any) =>
                    ctx.id.startsWith('neighborhood')
                );
                if (neighborhoodContext) {
                    neighborhood = neighborhoodContext.text;
                }
            }

            // Format address to include neighborhood if available
            let formattedAddress = result.place_name;

            // If neighborhood is found but not already in the address, add it
            if (neighborhood && !formattedAddress.includes(neighborhood)) {
                // Try to insert neighborhood before the city
                const parts = formattedAddress.split(',');
                if (parts.length >= 2) {
                    // Insert neighborhood after street address, before city
                    parts.splice(1, 0, ` ${neighborhood}`);
                    formattedAddress = parts.join(',');
                } else {
                    // Just append neighborhood if can't determine proper position
                    formattedAddress = `${formattedAddress}, ${neighborhood}`;
                }
            }

            const locationData = {
                address: formattedAddress,
                coordinates
            };

            setSelectedLocation(locationData);
            onLocationSelect(locationData);
            setAddressInput(formattedAddress);
            setShowResults(false);
        } catch (error) {
            console.error('Error selecting address:', error);
        }
    };

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!addressInput) return;

        searchAddress(addressInput);
    };

    // Se houver erro, mostrar mensagem de erro
    if (mapError) {
        return (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center p-4 rounded-lg">
                <div className="text-center">
                    <p className="text-red-500 mb-2">Não foi possível carregar o mapa</p>
                    <p className="text-gray-500 text-sm">Por favor, digite o endereço manualmente abaixo:</p>
                    <input
                        type="text"
                        placeholder="Digite o endereço completo"
                        className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg"
                        value={addressInput}
                        onChange={(e) => {
                            setAddressInput(e.target.value);
                            onLocationSelect({
                                address: e.target.value,
                                coordinates: [-46.6333, -23.5505] // Coordenadas padrão de São Paulo
                            });
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full flex flex-col h-full">
            <form onSubmit={handleAddressSubmit} className="relative mb-2 flex-shrink-0">
                <input
                    placeholder="Digite o endereço do imóvel"
                    className="w-full pl-3 pr-12 py-3 bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-full focus:outline-none focus:ring-0 focus:border-white/40 text-base transition-colors"
                    value={addressInput}
                    onChange={handleManualAddressInput}
                    onFocus={() => {
                        if (searchResults.length > 0) {
                            setShowResults(true);
                        }
                    }}
                />
                <button type="submit" className="absolute right-0 top-0 bottom-0 px-4 flex items-center bg-transparent">
                    <MagnifyingGlass size={22} className="text-white/60" />
                </button>
            </form>

            {showResults && searchResults.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-[150px] overflow-y-auto mt-12 flex-shrink-0">
                    {searchResults.map((result) => {
                        // Extract neighborhood from context if available
                        let neighborhood = '';
                        if (result.context) {
                            const neighborhoodContext = result.context.find((ctx: any) =>
                                ctx.id.startsWith('neighborhood')
                            );
                            if (neighborhoodContext) {
                                neighborhood = neighborhoodContext.text;
                            }
                        }

                        return (
                            <li
                                key={result.id}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0"
                                onClick={() => handleAddressSelect(result)}
                            >
                                <p className="text-gray-800">{result.place_name}</p>
                                {neighborhood && !result.place_name.includes(neighborhood) && (
                                    <p className="text-gray-500 text-xs mt-1">
                                        Bairro: {neighborhood}
                                    </p>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}

            {mapError && <div className="text-red-500 text-sm p-2 bg-red-100 rounded-md">{mapError}</div>}

            <div ref={mapContainer} className="map-container w-full h-[350px] rounded-lg flex-grow" />
        </div>
    );
};

export default ClientSideMapboxSearch; 