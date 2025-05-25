'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
    ArrowRight, CaretLeft, CaretRight, Star, Buildings, MapPin, Lock, Waves, CookingPot,
    WifiHigh, Desktop, Television, Dog, House, Lightning, Fire, Calendar as CalendarIcon, CaretDown
} from '@phosphor-icons/react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import DatePicker from 'react-datepicker'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import "react-datepicker/dist/react-datepicker.css"
import { formatCurrency } from '@/utils/format'

// Importação dinâmica do componente de mapa para evitar erros de SSR
const MapComponent = dynamic(() => import('../MapComponent'), { ssr: false })

// Define a type for the property data
interface PropertyData {
    id: number;
    title: string;
    details: string;
    features: string;
    pricePerNight: number;
    rating: number | { value: number; count: number }; // Pode ser número ou objeto
    reviewCount: number;
    image: string;
    location?: string;
    coordinates?: [number, number];
    type?: string;
    images?: string[];
    description?: string;
    host?: string;
    whatWeOffer?: string;
    whatYouShouldKnow?: string;
    serviceFee?: number;
    discountAmount?: number;
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
    whatYouShouldKnowDynamic?: {
        checkInTime?: string;
        checkOutTime?: string;
        maxGuests?: number;
        quietHours?: string;
    };
    link?: string;
    whatYouShouldKnowRichText?: string;
}

// Interface para o objeto gridProperties
interface GridProperties {
    comfort: PropertyData;
    available: PropertyData;
    experience: PropertyData;
}

// Componente para o botão de favorito
const FavoriteButton = ({ propertyId, className = "" }: { propertyId: number, className?: string }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    // Verificar se o imóvel está nos favoritos ao carregar o componente
    useEffect(() => {
        // Em ambientes de servidor ou quando localStorage não está disponível
        if (typeof window === 'undefined') return;

        const storedFavorites = localStorage.getItem('yallah_favorites');
        if (storedFavorites) {
            const favorites = JSON.parse(storedFavorites);
            setIsFavorite(favorites.includes(propertyId));
        }
    }, [propertyId]);

    // Alternar status de favorito
    const toggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();

        let favorites: number[] = [];
        const storedFavorites = localStorage.getItem('yallah_favorites');

        if (storedFavorites) {
            favorites = JSON.parse(storedFavorites);
        }

        if (isFavorite) {
            // Remover dos favoritos
            favorites = favorites.filter(id => id !== propertyId);
        } else {
            // Adicionar aos favoritos
            favorites.push(propertyId);
        }

        // Salvar no localStorage
        localStorage.setItem('yallah_favorites', JSON.stringify(favorites));
        setIsFavorite(!isFavorite);
    };

    return (
        <button
            className={`p-2 rounded-full border border-gray-200 hover:bg-gray-50 ${className}`}
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill={isFavorite ? "#8BADA4" : "none"}
                viewBox="0 0 24 24"
                stroke={isFavorite ? "#8BADA4" : "currentColor"}
                className={isFavorite ? "" : "stroke-gray-600"}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={isFavorite ? 0 : 1.5}
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
            </svg>
        </button>
    );
};

// Dados de exemplo para o carrossel de destaques
const featuredDeals = [
    {
        id: 1,
        title: 'Apartamentos Premium',
        subtitle: 'Exclusivo Para Você!',
        discount: '20',
        validPeriod: 'Válido apenas de 1 à 15 Mai 2024',
        image: '/recomendado1.jpg',
    },
    {
        id: 2,
        title: 'Explore Moema e Arredores',
        subtitle: 'Nossa Melhor Oferta!',
        discount: '15',
        validPeriod: 'Válido apenas de 10 à 25 Mai 2024',
        image: '/recomendado2.jpg',
    },
    {
        id: 3,
        title: 'Studios em Pinheiros',
        subtitle: 'Estadia Prolongada!',
        discount: '25',
        validPeriod: 'Válido apenas para estadias +30 dias',
        image: '/recomendado3.jpg',
    }
]

// Dados para os cartões do grid de imóveis
const gridProperties: GridProperties = {
    comfort: {
        id: 1,
        title: "Studio RM - Frente ao mar!",
        details: "Espaço inteiro: apartamento em Copacabana, Brasil",
        features: "2 hóspedes · Estúdio · 1 cama · 1 banheiro",
        pricePerNight: 220,
        rating: 4.9,
        reviewCount: 28,
        image: "/card4.jpg",
        link: "/imoveis/studio-rm",
        location: "Copacabana, Brasil",
        coordinates: [-43.1822, -22.9789] as [number, number]
    },
    available: {
        id: 2,
        title: "Loft Jardins - Próximo à Paulista",
        details: "Espaço inteiro: loft em Jardins, São Paulo",
        features: "3 hóspedes · 1 quarto · 2 camas · 1 banheiro",
        pricePerNight: 180,
        rating: 4.8,
        reviewCount: 56,
        image: "/card2.jpg",
        link: "/imoveis/loft-jardins",
        location: "Jardins, São Paulo",
        coordinates: [-46.6554, -23.5646] as [number, number]
    },
    experience: {
        id: 3,
        title: "Apartamento de luxo com vista panorâmica",
        details: "Espaço inteiro: apartamento em Brooklin, São Paulo",
        features: "4 hóspedes · 2 quartos · 2 camas · 2 banheiros",
        pricePerNight: 350,
        rating: 5.0,
        reviewCount: 42,
        image: "/card1.jpg",
        link: "/imoveis/luxo-brooklin",
        location: "Brooklin, São Paulo",
        coordinates: [-46.6869, -23.6109] as [number, number]
    }
};

// Cards de propriedades em destaque
const highlightedProperties = [
    {
        id: 1,
        title: "Loft em Pinheiros",
        location: "Pinheiros, São Paulo",
        pricePerNight: 220,
        rating: 4.9,
        reviewCount: 28,
        features: ["2 quartos", "1 banheiro", "Wi-Fi"],
        image: "/recomendado1.jpg"
    },
    {
        id: 2,
        title: "Studio na Oscar Freire",
        location: "Jardins, São Paulo",
        pricePerNight: 180,
        rating: 4.8,
        reviewCount: 32,
        features: ["1 quarto", "1 banheiro", "Varanda"],
        image: "/recomendado2.jpg"
    }
];

// Dados para o catálogo de imóveis recomendados
const recommendedProperties = [
    {
        id: 1,
        title: "Studio RM - Frente ao mar!",
        location: "Copacabana, Brasil",
        details: "Espaço inteiro: apartamento",
        features: "2 hóspedes · Estúdio · 1 cama · 1 banheiro",
        pricePerNight: 220,
        rating: 4.9,
        reviewCount: 28,
        image: "/card4.jpg",
        link: "/imoveis/studio-rm",
        host: "Anfitrião: Ricardo",
        coordinates: [-43.1822, -22.9789] as [number, number]
    },
    {
        id: 2,
        title: "Loft Jardins - Próximo à Paulista",
        location: "Jardins, São Paulo",
        details: "Espaço inteiro: loft",
        features: "3 hóspedes · 1 quarto · 2 camas · 1 banheiro",
        pricePerNight: 180,
        rating: 4.8,
        reviewCount: 56,
        image: "/card2.jpg",
        link: "/imoveis/loft-jardins",
        host: "Anfitrião: Leon",
        coordinates: [-46.6554, -23.5646] as [number, number]
    },
    {
        id: 3,
        title: "Apartamento de luxo com vista panorâmica",
        location: "Brooklin, São Paulo",
        details: "Espaço inteiro: apartamento",
        features: "4 hóspedes · 2 quartos · 2 camas · 2 banheiros",
        pricePerNight: 350,
        rating: 5.0,
        reviewCount: 42,
        image: "/card1.jpg",
        link: "/imoveis/luxo-brooklin",
        host: "Anfitrião: Ana",
        coordinates: [-46.6869, -23.6109] as [number, number]
    },
    {
        id: 4,
        title: "Studio moderno no centro",
        location: "Centro, São Paulo",
        details: "Espaço inteiro: studio",
        features: "2 hóspedes · Studio · 1 cama · 1 banheiro",
        pricePerNight: 150,
        rating: 4.7,
        reviewCount: 35,
        image: "/recomendado1.jpg",
        link: "/imoveis/studio-centro",
        host: "Anfitrião: Marcelo",
        coordinates: [-46.6333, -23.5505] as [number, number]
    },
    {
        id: 5,
        title: "Apartamento com varanda gourmet",
        location: "Vila Olímpia, São Paulo",
        details: "Espaço inteiro: apartamento",
        features: "3 hóspedes · 1 quarto · 1 cama · 1 banheiro",
        pricePerNight: 200,
        rating: 4.6,
        reviewCount: 48,
        image: "/recomendado2.jpg",
        link: "/imoveis/vila-olimpia",
        host: "Anfitrião: Carlos",
        coordinates: [-46.6770, -23.5958] as [number, number]
    },
    {
        id: 6,
        title: "Casa espaçosa próxima à praia",
        location: "Guarujá, São Paulo",
        details: "Espaço inteiro: casa",
        features: "6 hóspedes · 3 quartos · 4 camas · 2 banheiros",
        pricePerNight: 450,
        rating: 4.9,
        reviewCount: 62,
        image: "/recomendado3.jpg",
        link: "/imoveis/guaruja",
        host: "Anfitrião: Roberta",
        coordinates: [-46.6869, -23.6109] as [number, number]
    },
    {
        id: 7,
        title: "Chalé na montanha",
        location: "Campos do Jordão, São Paulo",
        details: "Espaço inteiro: chalé",
        features: "4 hóspedes · 2 quartos · 3 camas · 1 banheiro",
        pricePerNight: 380,
        rating: 4.8,
        reviewCount: 51,
        image: "/card1.jpg",
        link: "/imoveis/chale-montanha",
        host: "Anfitrião: Paulo",
        coordinates: [-46.6869, -23.6109] as [number, number]
    },
    {
        id: 8,
        title: "Kitnet próxima à universidade",
        location: "Butantã, São Paulo",
        details: "Espaço inteiro: kitnet",
        features: "1 hóspede · Studio · 1 cama · 1 banheiro",
        pricePerNight: 120,
        rating: 4.5,
        reviewCount: 39,
        image: "/card2.jpg",
        link: "/imoveis/kitnet-usp",
        host: "Anfitrião: Fernanda",
        coordinates: [-46.6554, -23.5646] as [number, number]
    },
    {
        id: 9,
        title: "Apartamento com vista para o parque",
        location: "Moema, São Paulo",
        details: "Espaço inteiro: apartamento",
        features: "2 hóspedes · 1 quarto · 1 cama · 1 banheiro",
        pricePerNight: 230,
        rating: 4.7,
        reviewCount: 45,
        image: "/card4.jpg",
        link: "/imoveis/moema-parque",
        host: "Anfitrião: Júlia",
        coordinates: [-46.6333, -23.5505] as [number, number]
    },
    {
        id: 10,
        title: "Flat em prédio com infraestrutura completa",
        location: "Itaim Bibi, São Paulo",
        details: "Espaço inteiro: flat",
        features: "2 hóspedes · 1 quarto · 1 cama · 1 banheiro",
        pricePerNight: 260,
        rating: 4.8,
        reviewCount: 58,
        image: "/recomendado1.jpg",
        link: "/imoveis/flat-itaim",
        host: "Anfitrião: Gabriel",
        coordinates: [-46.6333, -23.5505] as [number, number]
    },
    {
        id: 11,
        title: "Estúdio com decoração vintage",
        location: "Vila Madalena, São Paulo",
        details: "Espaço inteiro: estúdio",
        features: "2 hóspedes · Studio · 1 cama · 1 banheiro",
        pricePerNight: 190,
        rating: 4.6,
        reviewCount: 43,
        image: "/recomendado2.jpg",
        link: "/imoveis/vintage-madalena",
        host: "Anfitrião: Beatriz",
        coordinates: [-46.6554, -23.5646] as [number, number]
    },
    {
        id: 12,
        title: "Cobertura com piscina privativa",
        location: "Pinheiros, São Paulo",
        details: "Espaço inteiro: cobertura",
        features: "4 hóspedes · 2 quartos · 2 camas · 2 banheiros",
        pricePerNight: 520,
        rating: 4.9,
        reviewCount: 67,
        image: "/recomendado3.jpg",
        link: "/imoveis/cobertura-piscina",
        host: "Anfitrião: Thiago",
        coordinates: [-43.1822, -22.9789] as [number, number]
    },
    {
        id: 13,
        title: "Apartamento térreo com jardim",
        location: "Perdizes, São Paulo",
        details: "Espaço inteiro: apartamento",
        features: "3 hóspedes · 1 quarto · 2 camas · 1 banheiro",
        pricePerNight: 210,
        rating: 4.7,
        reviewCount: 49,
        image: "/card1.jpg",
        link: "/imoveis/terreo-jardim",
        host: "Anfitrião: Amanda",
        coordinates: [-46.6554, -23.5646] as [number, number]
    },
    {
        id: 14,
        title: "Loft minimalista em região histórica",
        location: "Bela Vista, São Paulo",
        details: "Espaço inteiro: loft",
        features: "2 hóspedes · Studio · 1 cama · 1 banheiro",
        pricePerNight: 170,
        rating: 4.6,
        reviewCount: 41,
        image: "/card2.jpg",
        link: "/imoveis/loft-minimalista",
        host: "Anfitrião: Rafael",
        coordinates: [-46.6554, -23.5646] as [number, number]
    },
    {
        id: 15,
        title: "Casa de campo com lareira",
        location: "Mairiporã, São Paulo",
        details: "Espaço inteiro: casa",
        features: "5 hóspedes · 3 quartos · 3 camas · 2 banheiros",
        pricePerNight: 420,
        rating: 4.8,
        reviewCount: 53,
        image: "/card4.jpg",
        link: "/imoveis/casa-campo",
        host: "Anfitrião: Mariana",
        coordinates: [-46.6869, -23.6109] as [number, number]
    }
];

// Função auxiliar para calcular o número de dias entre duas datas
const calculateNights = (checkIn: Date | null, checkOut: Date | null): number => {
    if (!checkIn || !checkOut) return 3; // Valor padrão

    // Cálculo da diferença em milissegundos
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    // Conversão para dias
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};

// Função para extrair e formatar o bairro do endereço completo
const formatLocationForPublic = (fullAddress: string): string => {
    if (!fullAddress) return 'São Paulo';

    // Remove país e CEP se existirem
    let address = fullAddress.replace(/,?\s*Brasil/i, '').replace(/,?\s*\d{5}-\d{3}/, '');

    // Divide por vírgula
    const parts = address.split(',').map(part => part.trim());

    // Procura por um padrão de bairro e cidade
    for (let i = 0; i < parts.length; i++) {
        // Se encontrar um termo com " - ", provavelmente é "bairro - cidade"
        if (parts[i].includes(' - ')) {
            return parts[i];
        }
    }

    // Se não encontrar, tenta pegar os dois últimos termos (bairro, cidade)
    if (parts.length >= 2) {
        return `${parts[parts.length - 2]}, ${parts[parts.length - 1]}`;
    }

    // Se não houver vírgula, retorna a última palavra (cidade)
    const words = address.split(' ').map(w => w.trim()).filter(Boolean);
    if (words.length > 0) {
        return words[words.length - 1];
    }

    return 'São Paulo';
};

export default function FeaturedProperties() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [touchStart, setTouchStart] = useState(0)
    const [touchEnd, setTouchEnd] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    // Estados para controlar a expansão de cards
    const [expandedCard, setExpandedCard] = useState<null | number>(null)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    // Estados para inputs de data
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
    const [startDate, endDate] = dateRange
    const [consultationMessage, setConsultationMessage] = useState('');
    // Estado para controlar a aba ativa
    const [activeTab, setActiveTab] = useState('descricao');

    // Detectar viewport ao carregar e ao redimensionar
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Verificar inicialmente
        checkIfMobile();

        // Adicionar listener para redimensionamento
        window.addEventListener('resize', checkIfMobile);

        // Limpar listener
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientX)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.touches[0].clientX)
    }

    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 75) {
            // Swipe left
            nextSlide()
        }
        if (touchStart - touchEnd < -75) {
            // Swipe right
            prevSlide()
        }
    }

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % featuredDeals.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? featuredDeals.length - 1 : prev - 1
        )
    }

    // Gerar array com o número repetido de "YALLAH" baseado no tamanho da tela
    const yallahArray = new Array(20).fill("YALLAH");

    // Função para expandir um card
    const expandCard = (propertyId: number) => {
        if (expandedCard === propertyId) {
            setIsClosing(true);
            setIsTransitioning(true);
            setTimeout(() => {
                setExpandedCard(null);
                setIsTransitioning(false);
                setIsClosing(false);
            }, 300);
        } else {
            setIsTransitioning(true);
            setIsClosing(false);
            setExpandedCard(propertyId);
            setTimeout(() => {
                setIsTransitioning(false);
            }, 300);
        }
    };

    // Função para fechar o card expandido quando clicar fora
    const closeExpandedCard = (e: React.MouseEvent) => {
        // Apenas fecha se o clique foi no overlay e não dentro do card
        if ((e.target as HTMLElement).classList.contains('overlay-backdrop')) {
            setIsClosing(true);
            setIsTransitioning(true);
            setTimeout(() => {
                setExpandedCard(null);
                setIsTransitioning(false);
                setIsClosing(false);
            }, 300);
        }
    };

    // Função para lidar com o pressionamento da tecla ESC para fechar o card expandido
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && expandedCard !== null) {
                setIsClosing(true);
                setIsTransitioning(true);
                setTimeout(() => {
                    setExpandedCard(null);
                    setIsTransitioning(false);
                    setIsClosing(false);
                }, 300);
            }
        };

        // Adicionar listener para a tecla ESC
        document.addEventListener('keydown', handleEscKey);

        // Remover listener quando o componente for desmontado
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [expandedCard]); // Re-adiciona o listener quando o expandedCard mudar

    // Bloquear o scroll do body quando um card estiver expandido
    useEffect(() => {
        if (expandedCard !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        // Limpar o estilo quando o componente for desmontado
        return () => {
            document.body.style.overflow = '';
        };
    }, [expandedCard]);

    // Handler para consulta de disponibilidade
    const handleAvailabilityConsultation = (property: any) => {
        if (!startDate || !endDate) {
            setConsultationMessage('Por favor, selecione as datas de check-in e check-out.');
            return;
        }

        const nights = calculateNights(startDate, endDate);

        // Aqui você poderia enviar os dados para um endpoint ou fazer qualquer outra coisa

        // Mostrar mensagem de sucesso
        setConsultationMessage(
            `Obrigado! Recebemos sua consulta para ${property.title} de ${format(startDate, 'dd/MM/yyyy')} a ${format(endDate, 'dd/MM/yyyy')} (${nights} noites). Entraremos em contato em breve.`
        );

        // Limpar as datas após alguns segundos
        setTimeout(() => {
            setDateRange([null, null]);
        }, 5000);
    };

    return (
        <div className="w-full py-12 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Seção de Ofertas em Destaque */}
                <div className="mb-8 md:mb-16">
                    <div className="flex items-center justify-between mb-6 md:mb-8">
                        <h2 className="text-xl md:text-4xl font-semibold text-gray-900">Ofertas exclusivas de imóveis para você!</h2>
                        <Link href="/imoveis" className="text-gray-700 hover:text-gray-900 flex items-center text-sm md:text-base">
                            Ver Todos <ArrowRight className="ml-1 w-4 h-4 md:w-5 md:h-5" />
                        </Link>
                    </div>

                    {/* Carrossel */}
                    <div className="relative">
                        <div className="hidden md:flex gap-2 absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                            <button
                                onClick={prevSlide}
                                className="p-2 rounded-full border border-gray-200 bg-white shadow-md hover:bg-gray-50 transition-colors"
                            >
                                <CaretLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="p-2 rounded-full border border-gray-200 bg-white shadow-md hover:bg-gray-50 transition-colors"
                            >
                                <CaretRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Cards do Carrossel - Apenas 1 visível no mobile, 2 no desktop */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            {featuredDeals.slice(currentIndex, currentIndex + (isMobile ? 1 : 2)).map((deal) => (
                                <div
                                    key={deal.id}
                                    className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-lg h-[300px] md:h-[400px]"
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                >
                                    <Image
                                        src={deal.image}
                                        alt={deal.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

                                    {/* Badge */}
                                    <div className="absolute top-4 md:top-6 left-4 md:left-6">
                                        <div className="bg-[#FFD700] rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                                            <Star weight="fill" className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                        </div>
                                    </div>

                                    {/* Validade */}
                                    <div className="absolute top-4 md:top-6 right-4 md:right-6 bg-gray-800/60 backdrop-blur-sm text-white text-xs md:text-sm py-1 px-2 md:px-3 rounded-full">
                                        {deal.validPeriod}
                                    </div>

                                    {/* Conteúdo */}
                                    <div className="absolute bottom-0 left-0 p-5 md:p-8 text-white">
                                        <h3 className="text-base md:text-xl font-medium mb-1">{deal.title}</h3>
                                        <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">{deal.subtitle}</h2>
                                        <div className="mb-4 md:mb-6">
                                            <span className="text-5xl md:text-7xl font-bold">{deal.discount}%</span>
                                        </div>
                                        <p className="text-xs md:text-sm opacity-80">*com Termos e Condições</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile Navigation Dots */}
                        <div className="flex md:hidden justify-center mt-4 gap-2">
                            {featuredDeals.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-colors ${currentIndex === index ? 'bg-gray-800' : 'bg-gray-300'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Seção de Marca d'água YALLAH */}
                <div className="py-8 md:py-12 mb-8 md:mb-16 border-t border-b border-gray-200 overflow-hidden bg-gray-50 relative">
                    {/* Linha única de YALLAH - mais clara */}
                    <div className="flex items-center justify-center">
                        <div className="whitespace-nowrap animate-marquee">
                            {yallahArray.map((_, index) => (
                                <span key={`row1-${index}`} className="text-4xl md:text-7xl font-bold text-gray-100 mx-6 select-none tracking-widest">
                                    YALLAH
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Grid Inferior - Nova estrutura com formato de catálogo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* Coluna 1 - Dois cards empilhados */}
                    <div className="flex flex-col gap-4 md:gap-6">
                        {/* Card 1 - Primeiro imóvel */}
                        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-lg h-[250px] md:h-[350px]">
                            <Image
                                src={gridProperties.comfort.image}
                                alt={gridProperties.comfort.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                            {/* Badge de avaliação */}
                            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                                <div className="flex items-center gap-1">
                                    <Star weight="fill" className="w-4 h-4 text-yellow-500" />
                                    <span className="text-sm font-medium text-black">{typeof gridProperties.comfort.rating === 'object' && gridProperties.comfort.rating !== null && 'value' in gridProperties.comfort.rating ? (gridProperties.comfort.rating as { value: number }).value : gridProperties.comfort.rating}</span>
                                    <span className="text-xs text-gray-500">({gridProperties.comfort.reviewCount})</span>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 p-6 md:p-6 flex flex-col w-full">
                                <h3 className="text-lg md:text-2xl font-medium text-white mb-1">
                                    {gridProperties.comfort.title}
                                </h3>
                                <p className="text-base text-white/90 mb-1">
                                    {gridProperties.comfort.details}
                                </p>
                                <p className="text-sm text-white/80 mb-2">
                                    {gridProperties.comfort.features}
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="bg-white px-4 py-2 rounded-full shadow-md text-black text-sm font-medium">
                                        {formatCurrency(gridProperties.comfort.pricePerNight)}/noite
                                    </div>
                                    <button
                                        onClick={() => expandCard(gridProperties.comfort.id)}
                                        className="inline-flex items-center justify-center bg-white text-black px-6 py-3 rounded-full hover:bg-white/90 transition-colors text-sm font-medium w-fit"
                                    >
                                        Ver detalhes <ArrowRight className="ml-2 w-4 h-4" weight="bold" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 - Segundo imóvel */}
                        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-lg h-[200px] md:h-[230px]">
                            <Image
                                src={gridProperties.available.image}
                                alt={gridProperties.available.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                            {/* Badge de avaliação */}
                            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                                <div className="flex items-center gap-1">
                                    <Star weight="fill" className="w-4 h-4 text-yellow-500" />
                                    <span className="text-sm font-medium text-black">{typeof gridProperties.available.rating === 'object' && gridProperties.available.rating !== null && 'value' in gridProperties.available.rating ? (gridProperties.available.rating as { value: number }).value : gridProperties.available.rating}</span>
                                    <span className="text-xs text-gray-500">({gridProperties.available.reviewCount})</span>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 p-4 md:p-6 flex flex-col w-full">
                                <h3 className="text-lg md:text-xl font-medium text-white mb-1">
                                    {gridProperties.available.title}
                                </h3>
                                <p className="text-sm md:text-base text-white/90 mb-1">
                                    {gridProperties.available.details}
                                </p>
                                <p className="text-sm text-white/80 mb-2">
                                    {gridProperties.available.features}
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="bg-white px-4 py-2 rounded-full shadow-md text-black text-sm font-medium">
                                        {formatCurrency(gridProperties.available.pricePerNight)}/noite
                                    </div>
                                    <button
                                        onClick={() => expandCard(gridProperties.available.id)}
                                        className="inline-flex items-center justify-center bg-white text-black px-6 py-2 rounded-full hover:bg-white/90 transition-colors text-sm font-medium w-fit"
                                    >
                                        Ver detalhes <ArrowRight className="ml-2 w-4 h-4" weight="bold" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coluna 2 - Card de altura completa */}
                    <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-lg h-[450px] md:h-[600px]">
                        <Image
                            src={gridProperties.experience.image}
                            alt={gridProperties.experience.title}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

                        {/* Badge de avaliação */}
                        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                            <div className="flex items-center gap-1">
                                <Star weight="fill" className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm font-medium text-black">{typeof gridProperties.experience.rating === 'object' && gridProperties.experience.rating !== null && 'value' in gridProperties.experience.rating ? (gridProperties.experience.rating as { value: number }).value : gridProperties.experience.rating}</span>
                                <span className="text-xs text-gray-500">({gridProperties.experience.reviewCount})</span>
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 p-6 md:p-8 flex flex-col w-full">
                            <h3 className="text-2xl md:text-3xl font-medium text-white mb-2">
                                {gridProperties.experience.title}
                            </h3>
                            <p className="text-base md:text-lg text-white/90 mb-1">
                                {gridProperties.experience.details}
                            </p>
                            <p className="text-base text-white/80 mb-4">
                                {gridProperties.experience.features}
                            </p>
                            <div className="flex justify-between items-center">
                                <div className="bg-white px-4 py-2 rounded-full shadow-md text-black text-sm font-medium">
                                    {formatCurrency(gridProperties.experience.pricePerNight)}/noite
                                </div>
                                <button
                                    onClick={() => expandCard(gridProperties.experience.id)}
                                    className="inline-flex items-center justify-center bg-white text-black px-6 py-3 rounded-full hover:bg-white/90 transition-colors text-sm md:text-base font-medium w-fit"
                                >
                                    Ver detalhes <ArrowRight className="ml-2 w-4 h-4" weight="bold" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Espaço reservado para o novo componente que será adicionado posteriormente */}
                <div className="mt-12 md:mt-16">
                    {/* Seção de Imóveis Recomendados */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6 md:mb-8">
                            <h2 className="text-xl md:text-3xl font-semibold text-gray-900">Imóveis recomendados para você</h2>
                            <Link href="/imoveis" className="text-gray-700 hover:text-gray-900 flex items-center text-sm md:text-base">
                                Ver Todos <ArrowRight className="ml-1 w-4 h-4 md:w-5 md:h-5" />
                            </Link>
                        </div>

                        {/* Catálogo de Imóveis - 3 fileiras de 5 cards */}
                        {[0, 1, 2].map((row) => (
                            <div key={`row-${row}`} className="mb-8">
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
                                    {recommendedProperties.slice(row * 5, (row + 1) * 5).map((property) => (
                                        <div
                                            key={property.id}
                                            className={`group relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1
                                                       ${expandedCard === property.id ? 'opacity-0 pointer-events-none' : 'z-10'}`}
                                            onClick={() => expandCard(property.id)}
                                            style={{ borderRadius: '1.5rem' }}
                                        >
                                            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden">
                                                <Image
                                                    src={property.image}
                                                    alt={property.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                                />

                                                {/* Overlay com gradiente */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                                                {/* Botão de favorito */}
                                                <div className="absolute top-4 right-4 z-10">
                                                    <FavoriteButton propertyId={property.id} className="bg-white/80 hover:bg-white" />
                                                </div>

                                                {/* Badge com preço */}
                                                <div className="absolute top-3 left-3 bg-white/95 px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                                                    {formatCurrency(property.pricePerNight)}/noite
                                                </div>

                                                {/* Conteúdo do card */}
                                                <div className="absolute bottom-0 left-0 w-full p-5">
                                                    {/* Título */}
                                                    <h3 className="text-lg text-white font-semibold">{property.title}</h3>

                                                    {/* Características */}
                                                    <p className="text-white/80 text-sm mb-2 line-clamp-1">
                                                        {property.features}
                                                    </p>

                                                    {/* Avaliações */}
                                                    <div className="flex items-center mb-3">
                                                        <Star weight="fill" className="w-4 h-4 text-yellow-400 mr-1" />
                                                        <span className="text-white text-sm font-medium">
                                                            {typeof property.rating === 'object' && property.rating !== null && 'value' in property.rating
                                                                ? (property.rating as { value: number }).value
                                                                : property.rating} <span className="text-white/70">({property.reviewCount})</span>
                                                        </span>
                                                    </div>

                                                    {/* Botão de ação - substituído pelo comportamento de clique no card inteiro */}
                                                    <button className="w-full flex items-center justify-center gap-2 bg-white text-black px-4 py-2 rounded-full hover:bg-[#8BADA4] hover:text-white transition-colors duration-300 text-sm">
                                                        Ver detalhes
                                                        <ArrowRight className="w-4 h-4" weight="bold" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Card Expandido Overlay */}
            {expandedCard !== null && (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center p-4 overlay-backdrop ${isTransitioning ? (isClosing ? 'animate-fadeOut' : 'animate-fadeIn') : ''
                        }`}
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    onClick={closeExpandedCard}
                >
                    <div
                        className={`bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-scroll-container ${isTransitioning ? (isClosing ? 'animate-slideOut' : 'animate-slideIn') : ''
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Conteúdo do card expandido */}
                        {[...recommendedProperties, gridProperties.comfort, gridProperties.available, gridProperties.experience]
                            .filter(property => property.id === expandedCard)
                            .slice(0, 1) // Pegar apenas o primeiro resultado, evitando duplicações
                            .map(property => (
                                <div key={`expanded-${property.id}`}>
                                    {/* Galeria de Imagens */}
                                    <div className="grid grid-cols-12 gap-2 p-2">
                                        {/* Imagem principal (maior) */}
                                        <div className="col-span-6 relative h-[300px] rounded-l-xl overflow-hidden">
                                            <Image
                                                src={(property as any).images && (property as any).images.length > 0
                                                    ? (property as any).images[0]
                                                    : property.image}
                                                alt={property.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Coluna direita com 2 imagens */}
                                        <div className="col-span-6 grid grid-rows-2 gap-2">
                                            {/* Imagem superior direita */}
                                            <div className="relative h-[146px] rounded-tr-xl overflow-hidden">
                                                <Image
                                                    src={(property as any).images && (property as any).images.length > 1
                                                        ? (property as any).images[1]
                                                        : property.image}
                                                    alt={property.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            {/* Duas imagens inferiores */}
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="relative h-[146px] overflow-hidden">
                                                    <Image
                                                        src={(property as any).images && (property as any).images.length > 2
                                                            ? (property as any).images[2]
                                                            : property.image}
                                                        alt={property.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>

                                                {/* Mapa ou última imagem com botão de expandir */}
                                                <div className="relative h-[146px] rounded-br-xl overflow-hidden">
                                                    <MapComponent
                                                        center={property.coordinates as [number, number]}
                                                        zoom={16}
                                                        showMarker={true}
                                                        onClick={() => setActiveTab('localizacao')}
                                                        showControls={false}
                                                        useCustomMarker={false}
                                                    />
                                                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(0deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%)' }}></div>
                                                    <button
                                                        className="absolute bottom-2 right-2 p-1.5 bg-white rounded-md shadow-md z-10 transition-all hover:bg-gray-100"
                                                        aria-label="Expandir mapa"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveTab('localizacao');
                                                        }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#8BADA4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5-5-5m5 5v-4m0 4h-4" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botão de fechar - posicionado no canto superior direito absoluto */}
                                    <button
                                        className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-gray-100 transition-all z-10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            expandCard(property.id);
                                        }}
                                        aria-label="Fechar"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="stroke-gray-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                    <div className="p-6">
                                        {/* Layout de duas colunas para o conteúdo principal */}
                                        <div className="grid grid-cols-12 gap-6">
                                            {/* Coluna principal (esquerda) */}
                                            <div className="col-span-12 md:col-span-7">
                                                {/* Cabeçalho do imóvel */}
                                                <div className="mb-6">
                                                    {/* Badge de destaque */}
                                                    <div className="mb-2 inline-flex items-center text-green-600 gap-1">
                                                        <span className="inline-block w-4 h-4 rounded-full bg-green-600"></span>
                                                        <span className="text-sm font-medium">Destaque</span>
                                                    </div>

                                                    {/* Cabeçalho com ações */}
                                                    <div className="flex justify-between items-start">
                                                        <h2 className="text-2xl font-bold text-gray-900">{property.title}</h2>

                                                        <div className="flex gap-2">
                                                            <FavoriteButton propertyId={property.id} />
                                                            <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50" aria-label="Compartilhar">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="stroke-gray-600">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Informações básicas */}
                                                    <div className="flex gap-2 items-center text-gray-700 mt-2">
                                                        <span>{property.features}</span>
                                                    </div>

                                                    {/* Categorias/Tags */}
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {(property as any).type && (
                                                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">{(property as any).type}</span>
                                                        )}
                                                        {property.details && property.details !== (property as any).type && (
                                                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">{property.details}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Navegação por abas */}
                                                <div className="border-b border-gray-200 mb-4">
                                                    <div className="flex gap-6 overflow-x-auto scrollbar-hide">
                                                        <button
                                                            className={`py-2 whitespace-nowrap ${activeTab === 'descricao' ? 'border-b-2 border-[#8BADA4] text-[#8BADA4] font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                                                            onClick={() => setActiveTab('descricao')}
                                                        >
                                                            Descrição
                                                        </button>
                                                        <button
                                                            className={`py-2 whitespace-nowrap ${activeTab === 'fotos' ? 'border-b-2 border-[#8BADA4] text-[#8BADA4] font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                                                            onClick={() => setActiveTab('fotos')}
                                                        >
                                                            Fotos
                                                        </button>
                                                        <button
                                                            className={`py-2 whitespace-nowrap ${activeTab === 'oferecemos' ? 'border-b-2 border-[#8BADA4] text-[#8BADA4] font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                                                            onClick={() => setActiveTab('oferecemos')}
                                                        >
                                                            O que oferecemos
                                                        </button>
                                                        <button
                                                            className={`py-2 whitespace-nowrap ${activeTab === 'saber' ? 'border-b-2 border-[#8BADA4] text-[#8BADA4] font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                                                            onClick={() => setActiveTab('saber')}
                                                        >
                                                            O que você deve saber
                                                        </button>
                                                        <button
                                                            className={`py-2 whitespace-nowrap ${activeTab === 'localizacao' ? 'border-b-2 border-[#8BADA4] text-[#8BADA4] font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                                                            onClick={() => setActiveTab('localizacao')}
                                                        >
                                                            Localização
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Conteúdo da descrição */}
                                                {activeTab === 'descricao' && (
                                                    <div>
                                                        <h3 className="text-xl font-semibold mb-3 text-[#8BADA4]">Nosso imóvel</h3>
                                                        {(property as any).description ? (
                                                            <p className="text-gray-700 mb-4">
                                                                {(property as any).description}
                                                            </p>
                                                        ) : (
                                                            <>
                                                                <p className="text-gray-700 mb-4">
                                                                    Este charmoso imóvel localizado em {formatLocationForPublic(property.location ?? "")} oferece um ambiente aconchegante e moderno. Com {property.features.split('·').join(', ')}, o espaço é perfeito para uma estadia confortável.
                                                                </p>
                                                                <p className="text-gray-700">
                                                                    Próximo a restaurantes, comércio e transporte público. O imóvel conta com Wi-Fi de alta velocidade,
                                                                    ar-condicionado e todas as comodidades para uma estadia perfeita.
                                                                </p>
                                                            </>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Conteúdo da galeria de fotos */}
                                                {activeTab === 'fotos' && (
                                                    <div>
                                                        <h3 className="text-xl font-semibold mb-4 text-[#8BADA4]">Fotos do imóvel</h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {(property as any).images && (property as any).images.length > 0 ? (
                                                                // Se o imóvel tem múltiplas imagens, exiba todas
                                                                (property as any).images.map((image: string, index: number) => (
                                                                    <div key={`image-${index}`} className="relative aspect-video rounded-lg overflow-hidden">
                                                                        <Image
                                                                            src={image}
                                                                            alt={`${property.title} - Imagem ${index + 1}`}
                                                                            fill
                                                                            className="object-cover hover:scale-105 transition-transform duration-300"
                                                                        />
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                // Fallback: se não houver imagens no array 'images', use a imagem padrão
                                                                <div className="relative aspect-video rounded-lg overflow-hidden">
                                                                    <Image
                                                                        src={property.image}
                                                                        alt={property.title}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Conteúdo do que oferecemos */}
                                                {activeTab === 'oferecemos' && (
                                                    <div>
                                                        <h3 className="text-xl font-semibold mb-4 text-[#8BADA4]">O que esse lugar oferece</h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 flex items-center justify-center">
                                                                    <Lock className="w-6 h-6 text-gray-700" />
                                                                </div>
                                                                <span className="text-gray-700">Tranca na porta do quarto</span>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 flex items-center justify-center">
                                                                    <Waves className="w-6 h-6 text-gray-700" />
                                                                </div>
                                                                <span className="text-gray-700">Vista para a praia</span>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 flex items-center justify-center">
                                                                    <CookingPot className="w-6 h-6 text-gray-700" />
                                                                </div>
                                                                <span className="text-gray-700">Cozinha</span>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 flex items-center justify-center">
                                                                    <WifiHigh className="w-6 h-6 text-gray-700" />
                                                                </div>
                                                                <span className="text-gray-700">Wi-Fi</span>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 flex items-center justify-center">
                                                                    <Desktop className="w-6 h-6 text-gray-700" />
                                                                </div>
                                                                <span className="text-gray-700">Espaço de trabalho exclusivo</span>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 flex items-center justify-center">
                                                                    <Television className="w-6 h-6 text-gray-700" />
                                                                </div>
                                                                <span className="text-gray-700">TV</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Conteúdo do que você deve saber */}
                                                {activeTab === 'saber' && (
                                                    <div className="space-y-8">
                                                        {/* Regras da Casa */}
                                                        {(property as any).houseRules?.additionalRules?.length > 0 || (property as any).whatYouShouldKnowSections?.houseRules?.length > 0 ? (
                                                            <div>
                                                                <h3 className="text-xl font-semibold mb-3 text-[#8BADA4]">Regras da Casa</h3>
                                                                {(property as any).houseRules && (
                                                                    <p className="text-gray-700 mb-3">
                                                                        Check-in: após {(property as any).houseRules.checkIn || '15:00'}<br />
                                                                        Check-out: até {(property as any).houseRules.checkOut || '11:00'}<br />
                                                                        Máximo de {(property as any).houseRules.maxGuests || 4} hóspedes<br />
                                                                    </p>
                                                                )}

                                                                {(property as any).whatYouShouldKnowSections?.houseRules?.length > 0 ? (
                                                                    <ul className="text-gray-700 mb-3 space-y-2">
                                                                        {(property as any).whatYouShouldKnowSections.houseRules.map((rule: string, index: number) => (
                                                                            <li key={`house-rule-${index}`}>• {rule}</li>
                                                                        ))}
                                                                    </ul>
                                                                ) : (property as any).houseRules?.additionalRules?.length > 0 ? (
                                                                    <ul className="text-gray-700 mb-3 space-y-2">
                                                                        {(property as any).houseRules.additionalRules.map((rule: string, index: number) => (
                                                                            <li key={`add-rule-${index}`}>• {rule}</li>
                                                                        ))}
                                                                    </ul>
                                                                ) : (
                                                                    <p className="text-gray-700 mb-3">
                                                                        Não é permitido festas ou eventos<br />
                                                                        Proibido fumar dentro do imóvel
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <h3 className="text-xl font-semibold mb-3 text-[#8BADA4]">Regras da Casa</h3>
                                                                <p className="text-gray-700 mb-3">
                                                                    Check-in: após as 15:00h<br />
                                                                    Check-out: até as 11:00h<br />
                                                                    Máximo de 4 hóspedes<br />
                                                                    Não é permitido festas ou eventos<br />
                                                                    Proibido fumar dentro do imóvel
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Segurança e Propriedade */}
                                                        {(property as any).whatYouShouldKnowSections?.safetyProperty?.length > 0 && (
                                                            <div>
                                                                <h3 className="text-xl font-semibold mb-3 text-[#8BADA4]">Segurança e Propriedade</h3>
                                                                <ul className="text-gray-700 mb-3 space-y-2">
                                                                    {(property as any).whatYouShouldKnowSections.safetyProperty.map((item: string, index: number) => (
                                                                        <li key={`safety-${index}`}>• {item}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {/* Política de Cancelamento */}
                                                        {(property as any).whatYouShouldKnowSections?.cancellationPolicy?.length > 0 ? (
                                                            <div>
                                                                <h3 className="text-xl font-semibold mb-3 text-[#8BADA4]">Política de cancelamento</h3>
                                                                <ul className="text-gray-700 mb-3 space-y-2">
                                                                    {(property as any).whatYouShouldKnowSections.cancellationPolicy.map((policy: string, index: number) => (
                                                                        <li key={`cancel-policy-${index}`}>• {policy}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <h3 className="text-xl font-semibold mb-3 text-[#8BADA4]">Política de cancelamento</h3>
                                                                <p className="text-gray-700 mb-3">
                                                                    {(property as any).cancellationPolicy || 'Cancelamento gratuito até 48 horas antes do check-in. Após esse período, será cobrada uma taxa equivalente a 50% do valor total da reserva.'}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Informações adicionais */}
                                                        {(property as any).whatYouShouldKnowRichText && (
                                                            <div>
                                                                <h3 className="text-xl font-semibold mb-3 text-[#8BADA4]">Informações Adicionais</h3>
                                                                <div
                                                                    className="text-gray-700 mb-3 prose prose-sm max-w-none"
                                                                    dangerouslySetInnerHTML={{ __html: (property as any).whatYouShouldKnowRichText }}
                                                                />
                                                            </div>
                                                        )}

                                                        {/* Informações adicionais (fallback para o campo antigo) */}
                                                        {!((property as any).whatYouShouldKnowRichText) && (property as any).whatYouShouldKnow && (
                                                            <div>
                                                                <h3 className="text-xl font-semibold mb-3 text-[#8BADA4]">Informações Adicionais</h3>
                                                                <p className="text-gray-700 mb-3">
                                                                    {(property as any).whatYouShouldKnow}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Conteúdo sobre a localização */}
                                                {activeTab === 'localizacao' && (
                                                    <div>
                                                        <h3 className="text-xl font-semibold mb-4 text-[#8BADA4]">Onde você estará</h3>
                                                        <p className="text-gray-700 mb-4">
                                                            {formatLocationForPublic(property.location ?? "")}, São Paulo, Brasil
                                                        </p>
                                                        <div className="h-[350px] rounded-xl overflow-hidden relative mb-4">
                                                            <MapComponent
                                                                center={property.coordinates as [number, number]}
                                                                zoom={13}
                                                                showMarker={true}
                                                                showControls={true}
                                                                useCustomMarker={true}
                                                            />
                                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white py-2 px-4 rounded-lg shadow-md text-center max-w-xs">
                                                                <p className="font-medium text-gray-800">Localização exata do imóvel após reserva</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Coluna lateral (direita) - Reserva */}
                                            <div className="col-span-12 md:col-span-5">
                                                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-md">
                                                    {/* Preço e avaliação */}
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="font-bold text-xl mb-1 text-gray-900">{formatCurrency(property.pricePerNight)} <span className="text-gray-500 text-base font-normal">/ noite</span></h3>
                                                            <div className="flex items-center">
                                                                <Star className="h-4 w-4 text-[#8BADA4] mr-1" />
                                                                <span className="text-sm text-gray-700">{typeof property.rating === 'object' && property.rating !== null && 'value' in property.rating ? (property.rating as { value: number }).value : property.rating} ({property.reviewCount} avaliações)</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Campos de data */}
                                                    <div className="mb-4">
                                                        <label className="block text-sm text-gray-600 mb-1">Datas</label>
                                                        <div className="relative">
                                                            <DatePicker
                                                                selectsRange={true}
                                                                startDate={startDate}
                                                                endDate={endDate}
                                                                onChange={(update) => {
                                                                    setDateRange(update);
                                                                }}
                                                                isClearable={false}
                                                                placeholderText="dd/mm/yyyy"
                                                                dateFormat="dd/MM/yyyy"
                                                                locale={ptBR}
                                                                className="w-full appearance-none bg-transparent border border-gray-200 rounded-xl p-3 text-gray-700 pr-10"
                                                                calendarClassName="rounded-lg shadow-xl border-0"
                                                                showPopperArrow={false}
                                                                monthsShown={2}
                                                                popperPlacement="bottom"
                                                                popperProps={{
                                                                    strategy: "fixed"
                                                                }}
                                                                customInput={
                                                                    <div className="flex items-center justify-center cursor-pointer">
                                                                        <input
                                                                            type="text"
                                                                            value={startDate ? `${format(startDate, 'dd/MM/yyyy')}${endDate ? ` - ${format(endDate, 'dd/MM/yyyy')}` : ''}` : ''}
                                                                            placeholder="dd/mm/yyyy"
                                                                            className="w-full text-ellipsis appearance-none bg-transparent text-gray-700 text-sm cursor-pointer text-center px-10"
                                                                            readOnly
                                                                        />
                                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex gap-1 items-center text-gray-400">
                                                                            <div className="w-5 h-5 relative">
                                                                                <CalendarIcon weight="regular" className="w-5 h-5 text-gray-400" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                }
                                                            />
                                                        </div>
                                                        <style jsx global>{`
                                                            .react-datepicker-popper {
                                                                z-index: 9999 !important;
                                                                position: fixed !important;
                                                            }
                                                            .react-datepicker-wrapper {
                                                                width: 100% !important;
                                                            }
                                                            .react-datepicker {
                                                                font-family: inherit !important;
                                                                border-radius: 0.75rem !important;
                                                                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
                                                                border: none !important;
                                                                background-color: white !important;
                                                            }
                                                            .react-datepicker__month-container {
                                                                background: white !important;
                                                                border-radius: 0.5rem !important;
                                                                padding: 8px !important;
                                                            }
                                                            .react-datepicker__day--selected, 
                                                            .react-datepicker__day--range-start, 
                                                            .react-datepicker__day--range-end {
                                                                background-color: #8BADA4 !important;
                                                            }
                                                            .react-datepicker__day--in-range, 
                                                            .react-datepicker__day--in-selecting-range {
                                                                background-color: rgba(139, 173, 164, 0.2) !important;
                                                            }
                                                            .react-datepicker__day--keyboard-selected {
                                                                background-color: rgba(139, 173, 164, 0.5) !important;
                                                            }
                                                            .react-datepicker__header {
                                                                background-color: white !important;
                                                                border-bottom: 1px solid #f0f0f0 !important;
                                                                padding-top: 8px !important;
                                                            }
                                                            .react-datepicker__triangle {
                                                                display: none !important;
                                                            }
                                                        `}</style>
                                                    </div>

                                                    {/* Resumo de valores */}
                                                    <div className="border-t border-gray-200 py-4 space-y-2">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">{formatCurrency(property.pricePerNight)} x {calculateNights(startDate, endDate)} noites</span>
                                                            <span className="text-gray-900">{formatCurrency(property.pricePerNight * calculateNights(startDate, endDate))}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Desconto</span>
                                                            <span className="text-green-600">-{formatCurrency(50)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Taxa de serviço</span>
                                                            <span className="text-gray-900">{formatCurrency(35)}</span>
                                                        </div>
                                                    </div>

                                                    {/* Total */}
                                                    <div className="border-t border-gray-200 pt-4 mb-4">
                                                        <div className="flex justify-between font-bold">
                                                            <span className="text-gray-900">Total</span>
                                                            <span className="text-gray-900">{formatCurrency((property.pricePerNight * calculateNights(startDate, endDate)) - 50 + 35)}</span>
                                                        </div>
                                                    </div>

                                                    {/* Mensagem de feedback */}
                                                    {consultationMessage && (
                                                        <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg">
                                                            {consultationMessage}
                                                        </div>
                                                    )}

                                                    {/* Botão de consulta */}
                                                    <button
                                                        className="w-full py-3 px-4 bg-[#8BADA4] hover:bg-[#7A9D94] text-white font-medium rounded-full transition-colors flex items-center justify-center gap-2 text-sm whitespace-nowrap"
                                                        onClick={() => handleAvailabilityConsultation(property)}
                                                    >
                                                        Consultar disponibilidade <ArrowRight weight="bold" className="min-w-4 min-h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}
