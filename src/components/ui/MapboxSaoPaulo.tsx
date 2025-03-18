'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Dados dos bairros com suas coordenadas
const neighborhoods = [
    {
        id: "vila-mariana",
        name: "Vila Mariana",
        coordinates: [-46.6361, -23.5882] as [number, number],
        rentalValue: 3,
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
        description: "Apartamentos modernos próximos ao metrô, com fácil acesso a universidades e centros culturais."
    },
    {
        id: "pinheiros",
        name: "Pinheiros",
        coordinates: [-46.6821, -23.5646] as [number, number],
        rentalValue: 4,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
        description: "Região vibrante com vida noturna agitada, restaurantes premiados e excelente infraestrutura."
    },
    {
        id: "moema",
        name: "Moema",
        coordinates: [-46.6611, -23.6011] as [number, number],
        rentalValue: 4,
        image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400",
        description: "Bairro nobre com apartamentos de alto padrão, próximo ao Parque Ibirapuera."
    },
    {
        id: "itaim-bibi",
        name: "Itaim Bibi",
        coordinates: [-46.6766, -23.5851] as [number, number],
        rentalValue: 4,
        image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400",
        description: "Centro financeiro com apartamentos luxuosos e próximo às principais empresas."
    },
    {
        id: "jardins",
        name: "Jardins",
        coordinates: [-46.6668, -23.5717] as [number, number],
        rentalValue: 4,
        image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=400",
        description: "Região exclusiva com mansões e apartamentos de luxo, próxima às melhores lojas."
    },
    {
        id: "brooklin",
        name: "Brooklin",
        coordinates: [-46.6897, -23.6207] as [number, number],
        rentalValue: 3,
        image: "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=400",
        description: "Bairro residencial tranquilo com ótima infraestrutura e fácil acesso."
    },
    {
        id: "paraiso",
        name: "Paraíso",
        coordinates: [-46.6425, -23.5717] as [number, number],
        rentalValue: 3,
        image: "https://images.unsplash.com/photo-1475855581690-80accde3ae2b?w=400",
        description: "Localização central com excelente mobilidade e opções de lazer."
    },
    {
        id: "higienopolis",
        name: "Higienópolis",
        coordinates: [-46.6558, -23.5437] as [number, number],
        rentalValue: 3,
        image: "https://images.unsplash.com/photo-1459535653751-d571815e906b?w=400",
        description: "Bairro histórico com arquitetura única e apartamentos clássicos."
    },
    {
        id: "perdizes",
        name: "Perdizes",
        coordinates: [-46.6766, -23.5340] as [number, number],
        rentalValue: 3,
        image: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=400",
        description: "Região familiar com ótimas escolas e qualidade de vida."
    },
    {
        id: "vila-madalena",
        name: "Vila Madalena",
        coordinates: [-46.6877, -23.5559] as [number, number],
        rentalValue: 3,
        image: "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=400",
        description: "Bairro artístico e descolado com vida noturna agitada."
    },
    {
        id: "vila-olimpia",
        name: "Vila Olímpia",
        coordinates: [-46.6877, -23.5951] as [number, number],
        rentalValue: 4,
        image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400",
        description: "Centro empresarial com apartamentos modernos e vida noturna ativa."
    },
    {
        id: "santana",
        name: "Santana",
        coordinates: [-46.6283, -23.5059] as [number, number],
        rentalValue: 2,
        image: "https://images.unsplash.com/photo-1469022563428-aa04fef9f5a2?w=400",
        description: "Bairro tradicional da zona norte com ótimo custo-benefício."
    },
    {
        id: "tatuape",
        name: "Tatuapé",
        coordinates: [-46.5766, -23.5401] as [number, number],
        rentalValue: 2,
        image: "https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?w=400",
        description: "Região em desenvolvimento com shopping centers e infraestrutura completa."
    },
    {
        id: "campo-belo",
        name: "Campo Belo",
        coordinates: [-46.6745, -23.6207] as [number, number],
        rentalValue: 3,
        image: "https://images.unsplash.com/photo-1464890100898-a385f744067f?w=400",
        description: "Bairro residencial nobre próximo ao aeroporto de Congonhas."
    },
    {
        id: "saude",
        name: "Saúde",
        coordinates: [-46.6162, -23.6169] as [number, number],
        rentalValue: 2,
        image: "https://images.unsplash.com/photo-1430285561322-7808604715df?w=400",
        description: "Região tranquila com boa infraestrutura e fácil acesso ao metrô."
    }
];

interface MapboxSaoPauloProps {
    className?: string;
    onNeighborhoodHover?: (id: string | null) => void;
    onNeighborhoodClick?: (id: string) => void;
    hoveredNeighborhood?: string | null;
    selectedNeighborhood?: string | null;
    mapRef?: React.MutableRefObject<{
        showPopup: (id: string) => void;
    } | null>;
}

// Componente wrapper que só renderiza no cliente
const ClientSideMapbox: React.FC<MapboxSaoPauloProps> = (props) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-gray-500">Carregando mapa...</div>
        </div>;
    }

    return <MapboxSaoPaulo {...props} />;
};

const MapboxSaoPaulo: React.FC<MapboxSaoPauloProps> = ({
    className = '',
    onNeighborhoodHover,
    onNeighborhoodClick,
    hoveredNeighborhood,
    selectedNeighborhood,
    mapRef
}) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});
    const popups = useRef<{ [key: string]: mapboxgl.Popup }>({});

    // Função para calcular os limites do mapa baseado em todas as coordenadas
    const calculateBounds = () => {
        const bounds = new mapboxgl.LngLatBounds();
        neighborhoods.forEach(neighborhood => {
            bounds.extend(neighborhood.coordinates);
        });
        return bounds;
    };

    // Função para ajustar a posição do mapa quando um popup é aberto
    const adjustMapForPopup = (coordinates: [number, number]) => {
        if (!map.current) return;

        // Calcula o offset baseado no tamanho do container
        const containerHeight = mapContainer.current?.clientHeight || 0;
        const verticalOffset = containerHeight * 0.2; // 20% da altura do container

        map.current.easeTo({
            center: [
                coordinates[0],
                coordinates[1] - (verticalOffset / map.current.transform.scale) / 5000
            ],
            duration: 800,
            zoom: 14,
            offset: [0, -verticalOffset]
        });
    };

    // Função para mostrar o popup de um bairro específico
    const showPopup = (id: string) => {
        const neighborhood = neighborhoods.find(n => n.id === id);
        const marker = markers.current[id];
        const popup = popups.current[id];

        // Fecha todos os popups abertos primeiro
        Object.values(popups.current).forEach(p => p.remove());

        if (neighborhood && marker && popup && map.current) {
            marker.setPopup(popup);
            popup.addTo(map.current);
            adjustMapForPopup(neighborhood.coordinates);
        }
    };

    // Expõe a função showPopup através da ref
    useEffect(() => {
        if (mapRef) {
            mapRef.current = {
                showPopup
            };
        }
    }, [mapRef]);

    useEffect(() => {
        if (!mapContainer.current) return;

        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/light-v11',
            center: [-46.6333, -23.5505],
            zoom: 11,
            scrollZoom: false // Disable scroll zoom
        });

        // Adiciona controles de zoom
        const navigationControl = new mapboxgl.NavigationControl({
            showCompass: false // Desabilita a bússola, mantendo apenas os botões de zoom
        });
        map.current.addControl(navigationControl, 'bottom-right');

        // Adiciona controle de geolocalização
        const geolocateControl = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: false,
            showAccuracyCircle: false
        });
        map.current.addControl(geolocateControl, 'bottom-right');

        // Create a MutationObserver to remove aria-hidden from close buttons
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
                    const closeButton = mutation.target as HTMLElement;
                    if (closeButton.classList.contains('mapboxgl-popup-close-button')) {
                        closeButton.removeAttribute('aria-hidden');
                    }
                }
            });
        });

        // Start observing the document with the configured parameters
        observer.observe(document.body, {
            attributes: true,
            subtree: true,
            attributeFilter: ['aria-hidden']
        });

        map.current.on('load', () => {
            // Ajusta o mapa para mostrar todos os markers
            const bounds = calculateBounds();
            map.current?.fitBounds(bounds, {
                padding: {
                    top: 100,
                    bottom: 100,
                    left: 100,
                    right: 100
                },
                duration: 0
            });

            neighborhoods.forEach((neighborhood) => {
                const el = document.createElement('div');
                el.className = 'marker-container';

                const markerContent = document.createElement('div');
                markerContent.className = 'neighborhood-marker';

                const img = document.createElement('img');
                img.src = neighborhood.image;
                img.className = 'property-image';
                markerContent.appendChild(img);

                el.appendChild(markerContent);

                // Cria o popup
                const popup = new mapboxgl.Popup({
                    offset: 25,
                    closeButton: true,
                    maxWidth: '300px',
                    className: 'neighborhood-popup',
                    closeOnClick: false,
                    focusAfterOpen: false
                })
                    .setHTML(`
                    <div class="popup-content">
                        <div class="popup-header">
                            <img src="${neighborhood.image}" alt="${neighborhood.name}" class="property-preview" />
                        </div>
                        <div class="popup-info">
                            <h3>${neighborhood.name}</h3>
                            <div class="rental-value">
                                <span class="rental-label">Rentabilidade:</span>
                                ${Array(neighborhood.rentalValue).fill('$').join('')}
                            </div>
                            <p class="description">${neighborhood.description}</p>
                        </div>
                    </div>
                `);

                // Remove aria-hidden from close button when popup is added
                popup.on('open', () => {
                    const closeButton = document.querySelector('.mapboxgl-popup-close-button');
                    if (closeButton) {
                        closeButton.removeAttribute('aria-hidden');
                    }
                });

                // Armazena o popup para referência futura
                popups.current[neighborhood.id] = popup;

                const marker = new mapboxgl.Marker({
                    element: el,
                    anchor: 'center'
                })
                    .setLngLat(neighborhood.coordinates)
                    .setPopup(popup)
                    .addTo(map.current!);

                markers.current[neighborhood.id] = marker;

                el.addEventListener('mouseenter', () => onNeighborhoodHover?.(neighborhood.id));
                el.addEventListener('mouseleave', () => onNeighborhoodHover?.(null));
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Fecha todos os popups abertos primeiro
                    Object.values(popups.current).forEach(p => p.remove());

                    // Ajusta o mapa primeiro
                    adjustMapForPopup(neighborhood.coordinates);

                    // Então mostra o popup
                    marker.setPopup(popup);
                    popup.addTo(map.current!);

                    // Por último, notifica o componente pai
                    onNeighborhoodClick?.(neighborhood.id);
                });

                // Adiciona listener para quando o popup é fechado
                popup.on('close', () => {
                    const bounds = calculateBounds();
                    map.current?.fitBounds(bounds, {
                        padding: {
                            top: 100,
                            bottom: 100,
                            left: 100,
                            right: 100
                        },
                        duration: 800
                    });
                });
            });
        });

        return () => {
            observer.disconnect();
            map.current?.remove();
        };
    }, []);

    // Atualiza o estilo dos markers baseado no hover/seleção
    useEffect(() => {
        Object.entries(markers.current).forEach(([id, marker]) => {
            const el = marker.getElement();
            const circle = el.querySelector('.neighborhood-marker') as HTMLElement;
            const isActive = hoveredNeighborhood === id || selectedNeighborhood === id;

            if (circle) {
                circle.style.backgroundColor = isActive ? '#2A9D8F' : '#8BADA4';
                circle.style.transform = isActive ? 'scale(1.2)' : 'scale(1)';
                circle.style.boxShadow = isActive ? '0 0 0 2px rgba(42, 157, 143, 0.3)' : 'none';
            }
        });
    }, [hoveredNeighborhood, selectedNeighborhood]);

    return (
        <div className={`relative w-full h-full rounded-3xl overflow-hidden ${className}`}>
            <div ref={mapContainer} className="w-full h-full" />
            <style jsx global>{`
                .marker-container {
                    width: 64px;
                    height: 64px;
                    cursor: pointer;
                }

                .neighborhood-marker {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    border-radius: 50%;
                    overflow: hidden;
                    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
                    border: 2px solid white;
                    transition: all 0.3s ease;
                }

                .property-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .rental-value {
                    font-size: 16px;
                    color: #2A9D8F;
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .rental-label {
                    color: rgba(255, 255, 255, 0.7);
                }

                .mapboxgl-popup {
                    max-width: 300px;
                }

                .mapboxgl-popup-content {
                    padding: 0;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                }

                .popup-content {
                    background: #1A1A1A;
                    color: white;
                }

                .popup-header {
                    position: relative;
                    width: 100%;
                }

                .property-preview {
                    width: 100%;
                    height: 180px;
                    object-fit: cover;
                }

                .popup-info {
                    padding: 16px;
                }

                .popup-info h3 {
                    font-size: 20px;
                    font-weight: 600;
                    color: white;
                    margin: 0 0 8px;
                }

                .description {
                    font-size: 14px;
                    line-height: 1.5;
                    color: rgba(255, 255, 255, 0.7);
                    margin: 0;
                }

                /* Updated popup styles */
                .neighborhood-popup {
                    position: absolute;
                    z-index: 1000;
                }

                .neighborhood-popup .mapboxgl-popup-content {
                    position: relative;
                    pointer-events: auto;
                }

                .mapboxgl-popup {
                    position: absolute;
                    top: 0;
                    left: 0;
                    pointer-events: none;
                }

                .mapboxgl-popup-close-button {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    padding: 8px;
                    font-size: 24px;
                    color: white;
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: 50%;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 1;
                    z-index: 2;
                    cursor: pointer;
                    border: none;
                    outline: none;
                    pointer-events: auto;
                }

                .mapboxgl-popup-close-button:hover {
                    background: rgba(0, 0, 0, 0.7);
                }

                .mapboxgl-popup-close-button:focus {
                    outline: 2px solid #2A9D8F;
                    outline-offset: 2px;
                }

                /* Prevent page scroll when interacting with popup */
                .mapboxgl-popup-content {
                    overscroll-behavior: contain;
                    touch-action: none;
                }

                /* Estilos para os controles do mapa */
                .mapboxgl-ctrl-group {
                    border: none !important;
                    background: white !important;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
                    border-radius: 12px !important;
                    overflow: hidden;
                }

                .mapboxgl-ctrl-group button {
                    width: 40px !important;
                    height: 40px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    border: none !important;
                    background-color: white !important;
                    transition: all 0.2s ease !important;
                }

                .mapboxgl-ctrl-group button:hover {
                    background-color: #f3f4f6 !important;
                }

                .mapboxgl-ctrl-group button:focus {
                    outline: 2px solid #2A9D8F !important;
                    outline-offset: -2px !important;
                }

                .mapboxgl-ctrl-group button + button {
                    border-top: 1px solid #e5e7eb !important;
                }

                /* Estilo específico para o botão de geolocalização */
                .mapboxgl-ctrl-geolocate {
                    margin-top: 8px;
                }

                /* Ícones dos controles */
                .mapboxgl-ctrl-icon {
                    filter: none !important;
                    opacity: 0.7;
                }

                .mapboxgl-ctrl-zoom-in .mapboxgl-ctrl-icon {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='12' y1='5' x2='12' y2='19'%3E%3C/line%3E%3Cline x1='5' y1='12' x2='19' y2='12'%3E%3C/line%3E%3C/svg%3E") !important;
                }

                .mapboxgl-ctrl-zoom-out .mapboxgl-ctrl-icon {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='5' y1='12' x2='19' y2='12'%3E%3C/line%3E%3C/svg%3E") !important;
                }

                .mapboxgl-ctrl-geolocate .mapboxgl-ctrl-icon {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='3'%3E%3C/circle%3E%3Cpath d='M19.5 12h2.5'%3E%3C/path%3E%3Cpath d='M2 12h2.5'%3E%3C/path%3E%3Cpath d='M12 2v2.5'%3E%3C/path%3E%3Cpath d='M12 19.5V22'%3E%3C/path%3E%3C/svg%3E") !important;
                }

                /* Estados ativos dos controles */
                .mapboxgl-ctrl-geolocate-active .mapboxgl-ctrl-icon,
                .mapboxgl-ctrl-geolocate-waiting .mapboxgl-ctrl-icon {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232A9D8F' stroke='%232A9D8F' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='3'%3E%3C/circle%3E%3Cpath d='M19.5 12h2.5'%3E%3C/path%3E%3Cpath d='M2 12h2.5'%3E%3C/path%3E%3Cpath d='M12 2v2.5'%3E%3C/path%3E%3Cpath d='M12 19.5V22'%3E%3C/path%3E%3C/svg%3E") !important;
                }

                /* Ajuste da posição dos controles */
                .mapboxgl-control-container .mapboxgl-ctrl-bottom-right {
                    right: 16px;
                    bottom: 16px;
                }
            `}</style>
        </div>
    );
};

// Exportamos o wrapper em vez do componente original
export default ClientSideMapbox; 