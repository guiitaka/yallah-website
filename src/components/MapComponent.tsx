'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

interface MapComponentProps {
    center?: [number, number]; // longitude, latitude
    zoom?: number;
    showMarker?: boolean;
    onClick?: () => void; // Novo prop para lidar com cliques
    showControls?: boolean; // Novo prop para controlar a exibição dos controles de navegação
    useCustomMarker?: boolean; // Novo prop para controlar o uso do marcador personalizado
}

// Versão do lado do cliente para NextJS
const ClientSideMap: React.FC<MapComponentProps> = (props) => {
    // Verificar se estamos no navegador
    const [isBrowser, setIsBrowser] = useState(false);

    useEffect(() => {
        setIsBrowser(true);
    }, []);

    if (!isBrowser) {
        return null;
    }

    return <MapComponent {...props} />;
};

const MapComponent: React.FC<MapComponentProps> = ({
    center = [-46.6333, -23.5505], // São Paulo como padrão
    zoom = 12,
    showMarker = true,
    onClick,
    showControls = true, // Por padrão, os controles são exibidos
    useCustomMarker = true, // Por padrão, usa o marcador personalizado
}) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const marker = useRef<mapboxgl.Marker | null>(null);
    const [mapError, setMapError] = useState<string | null>(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        try {
            // Verificar se a API key existe
            if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
                setMapError("Chave de API do Mapbox não configurada");
                return;
            }

            mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

            if (!map.current) {
                // Criar o mapa
                map.current = new mapboxgl.Map({
                    container: mapContainer.current,
                    style: 'mapbox://styles/mapbox/streets-v12',
                    center: center,
                    zoom: zoom,
                    attributionControl: showControls,
                });

                // Adicionar controles de navegação apenas se showControls for true
                if (showControls) {
                    map.current.addControl(
                        new mapboxgl.NavigationControl({
                            showCompass: true,
                            visualizePitch: true,
                        }),
                        'bottom-right'
                    );
                }

                // Adicionar marcador se necessário
                if (showMarker) {
                    if (useCustomMarker) {
                        // Criar um elemento personalizado para o marcador
                        const el = document.createElement('div');
                        el.className = 'custom-marker';
                        el.style.width = '40px';
                        el.style.height = '40px';
                        el.style.backgroundImage = 'url(/home-marker.svg)';
                        el.style.backgroundSize = 'contain';
                        el.style.backgroundRepeat = 'no-repeat';
                        el.style.backgroundPosition = 'center';

                        // Criar marcador no centro do mapa
                        marker.current = new mapboxgl.Marker({
                            element: el,
                            color: '#8BADA4',
                        })
                            .setLngLat(center)
                            .addTo(map.current);

                        // Adicionar círculo indicando a área aproximada
                        map.current.on('load', () => {
                            if (!map.current) return;

                            map.current.addSource('circle-source', {
                                type: 'geojson',
                                data: {
                                    type: 'Feature',
                                    geometry: {
                                        type: 'Point',
                                        coordinates: center,
                                    },
                                    properties: {},
                                },
                            });

                            map.current.addLayer({
                                id: 'circle-layer',
                                type: 'circle',
                                source: 'circle-source',
                                paint: {
                                    'circle-radius': 100,
                                    'circle-color': '#8BADA4',
                                    'circle-opacity': 0.2,
                                    'circle-stroke-width': 1,
                                    'circle-stroke-color': '#8BADA4',
                                },
                            });
                        });
                    } else {
                        // Usar marcador padrão mais simples
                        marker.current = new mapboxgl.Marker({ color: "#8BADA4" })
                            .setLngLat(center)
                            .addTo(map.current);
                    }
                }
            } else {
                // Atualizar o mapa existente
                map.current.setCenter(center);
                map.current.setZoom(zoom);

                // Atualizar o marcador se existir
                if (marker.current) {
                    marker.current.setLngLat(center);
                }
            }
        } catch (error) {
            setMapError("Erro ao carregar o mapa");
            console.error("Erro ao inicializar o mapa:", error);
        }

        // Cleanup function
        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [center, zoom, showMarker, showControls, useCustomMarker]);

    if (mapError) {
        return <div className="h-full flex items-center justify-center bg-gray-100 text-gray-600">{mapError}</div>;
    }

    return (
        <div className="w-full h-full relative">
            <div
                ref={mapContainer}
                className="w-full h-full rounded-xl"
                onClick={onClick && ((e) => {
                    e.stopPropagation();
                    onClick();
                })}
                style={{ cursor: onClick ? 'pointer' : 'grab' }}
            />
        </div>
    );
};

export default ClientSideMap; 