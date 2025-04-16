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
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${token}&country=br&types=address&language=pt`
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

            const locationData = {
                address: result.place_name,
                coordinates
            };

            setSelectedLocation(locationData);
            onLocationSelect(locationData);
            setAddressInput(result.place_name);
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
        <div className="relative w-full h-full">
            {/* Map container */}
            <div
                ref={mapContainer}
                className="h-60 w-full rounded-lg overflow-hidden mb-2"
            />

            {/* Search overlay */}
            <div className="relative w-full z-10">
                <div className="relative">
                    <form
                        className="relative w-full bg-white rounded-md shadow-sm flex items-stretch overflow-hidden border border-gray-300"
                        onSubmit={handleAddressSubmit}
                    >
                        <div className="flex-1">
                            <input
                                placeholder="Digite o endereço do imóvel"
                                className="w-full px-3 py-2 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8BADA4] text-base"
                                value={addressInput}
                                onChange={handleManualAddressInput}
                                onFocus={() => {
                                    if (searchResults.length > 0) {
                                        setShowResults(true);
                                    }
                                }}
                            />
                        </div>
                        <div className="flex-none">
                            <button
                                type="submit"
                                className="h-full px-3 bg-[#8BADA4] text-white hover:bg-[#7A9B94] transition-colors flex items-center"
                            >
                                {isSearching ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <MagnifyingGlass size={20} weight="bold" />
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Search Results Dropdown */}
                    {showResults && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto z-20">
                            <ul>
                                {searchResults.map((result) => (
                                    <li
                                        key={result.id}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0"
                                        onClick={() => handleAddressSelect(result)}
                                    >
                                        <p className="text-gray-800">{result.place_name}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="text-xs text-gray-500 mt-1">
                Selecione o endereço exato para a listagem. Este será mantido privado até a reserva.
            </div>
        </div>
    );
};

export default ClientSideMapboxSearch; 