'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
    ArrowRight, CaretLeft, CaretRight, Star, Buildings, MapPin, Lock, Waves, CookingPot,
    WifiHigh, Desktop, Television, Dog, House, Lightning, Fire
} from '@phosphor-icons/react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Importação dinâmica do componente de mapa para evitar erros de SSR
const MapComponent = dynamic(() => import('../MapComponent'), { ssr: false })

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
const gridProperties = {
    comfort: {
        id: 1,
        title: "Studio RM - Frente ao mar!",
        details: "Espaço inteiro: apartamento em Copacabana, Brasil",
        features: "2 hóspedes · Estúdio · 1 cama · 1 banheiro",
        pricePerNight: 220,
        rating: 4.9,
        reviewCount: 28,
        image: "/card4.jpg",
        link: "/imoveis/studio-rm"
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
        link: "/imoveis/loft-jardins"
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
        link: "/imoveis/luxo-brooklin"
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
const calculateNights = (checkIn: string, checkOut: string): number => {
    if (!checkIn || !checkOut) return 3; // Valor padrão

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    // Cálculo da diferença em milissegundos
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    // Conversão para dias
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
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
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [consultationMessage, setConsultationMessage] = useState('');
    // Estado para controlar a aba ativa
    const [activeTab, setActiveTab] = useState('descricao');
    // Estado para controlar o tópico ativo na aba "O que você deve saber"
    const [activeInfoTopic, setActiveInfoTopic] = useState('regras');

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
            // Se clicar no mesmo card já expandido, colapsa
            setIsClosing(true);
            setIsTransitioning(true);
            setTimeout(() => {
                setExpandedCard(null);
                setIsTransitioning(false);
                setIsClosing(false);
                // Resetar campos de formulário
                setCheckInDate('');
                setCheckOutDate('');
                setConsultationMessage('');
            }, 300);
        } else {
            // Expande o card
            setIsTransitioning(true);
            setIsClosing(false);
            setExpandedCard(propertyId);
            // Resetar mensagem caso abra outro card
            setConsultationMessage('');
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
                // Resetar campos de formulário
                setCheckInDate('');
                setCheckOutDate('');
                setConsultationMessage('');
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
                    // Resetar campos de formulário
                    setCheckInDate('');
                    setCheckOutDate('');
                    setConsultationMessage('');
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
        if (!checkInDate || !checkOutDate) {
            setConsultationMessage('Por favor, selecione as datas de check-in e check-out.');
            return;
        }

        const nights = calculateNights(checkInDate, checkOutDate);

        // Aqui você poderia enviar os dados para um endpoint ou fazer qualquer outra coisa

        // Mostrar mensagem de sucesso
        setConsultationMessage(`Obrigado! Recebemos sua consulta para ${property.title} de ${checkInDate} a ${checkOutDate} (${nights} noites). Entraremos em contato em breve.`);

        // Limpar as datas após alguns segundos
        setTimeout(() => {
            setCheckInDate('');
            setCheckOutDate('');
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
                                    <span className="text-sm font-medium text-black">{gridProperties.comfort.rating}</span>
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
                                        R$ {gridProperties.comfort.pricePerNight} / Noite
                                    </div>
                                    <Link
                                        href={gridProperties.comfort.link}
                                        className="inline-flex items-center justify-center bg-white text-black px-6 py-3 rounded-full hover:bg-white/90 transition-colors text-sm font-medium w-fit"
                                    >
                                        Agendar Visita <ArrowRight className="ml-2 w-4 h-4" weight="bold" />
                                    </Link>
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
                                    <span className="text-sm font-medium text-black">{gridProperties.available.rating}</span>
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
                                        R$ {gridProperties.available.pricePerNight} / Noite
                                    </div>
                                    <Link
                                        href={gridProperties.available.link}
                                        className="inline-flex items-center justify-center bg-white text-black px-6 py-2 rounded-full hover:bg-white/90 transition-colors text-sm font-medium w-fit"
                                    >
                                        Agendar Visita <ArrowRight className="ml-2 w-4 h-4" weight="bold" />
                                    </Link>
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
                                <span className="text-sm font-medium text-black">{gridProperties.experience.rating}</span>
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
                                    R$ {gridProperties.experience.pricePerNight} / Noite
                                </div>
                                <Link
                                    href={gridProperties.experience.link}
                                    className="inline-flex items-center justify-center bg-white text-black px-6 py-3 rounded-full hover:bg-white/90 transition-colors text-sm md:text-base font-medium w-fit"
                                >
                                    Agendar Visita <ArrowRight className="ml-2 w-4 h-4" weight="bold" />
                                </Link>
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
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                    {recommendedProperties.slice(row * 5, (row + 1) * 5).map((property) => (
                                        <div
                                            key={property.id}
                                            className={`relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 
                                                       hover:transform hover:-translate-y-2 cursor-pointer
                                                       ${expandedCard === property.id ? 'opacity-0 pointer-events-none' : 'z-10'}`}
                                            onClick={() => expandCard(property.id)}
                                        >
                                            {/* Imagem do imóvel */}
                                            <div className="relative h-48 w-full">
                                                <Image
                                                    src={property.image}
                                                    alt={property.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                                {/* Botão de favorito */}
                                                <div className="absolute top-2 right-2">
                                                    <FavoriteButton propertyId={property.id} className="bg-white/80 hover:bg-white" />
                                                </div>
                                                {/* Badge de avaliação */}
                                                <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                                                    <Star weight="fill" className="w-3.5 h-3.5 text-yellow-500" />
                                                    <span className="text-xs font-medium text-black">{property.rating}</span>
                                                    <span className="text-xs text-gray-500">({property.reviewCount})</span>
                                                </div>
                                            </div>

                                            {/* Conteúdo do card */}
                                            <div className="p-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex justify-between">
                                                        <h3 className="text-base font-medium text-gray-900 line-clamp-1">{property.title}</h3>
                                                    </div>
                                                    <p className="text-sm text-gray-600">{property.location}</p>
                                                    <p className="text-sm text-gray-600">{property.details}</p>
                                                    <p className="text-xs text-gray-500">{property.features}</p>
                                                    <p className="text-xs text-gray-500">{property.host}</p>
                                                    <div className="mt-2 flex justify-between items-center">
                                                        <div className="flex items-baseline">
                                                            <span className="text-base font-bold text-gray-900">R$ {property.pricePerNight}</span>
                                                            <span className="text-sm text-gray-600 ml-1">/ noite</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Card Expandido Overlay */}
                        {expandedCard !== null && (
                            <div
                                className={`fixed inset-0 overlay-backdrop bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-8
                                           ${isTransitioning && !isClosing ? 'animate-fade-in' : ''}
                                           ${isClosing ? 'animate-fade-out' : ''}`}
                                onClick={closeExpandedCard}
                            >
                                {recommendedProperties.filter(p => p.id === expandedCard).map(property => (
                                    <div
                                        key={`expanded-${property.id}`}
                                        className={`bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl
                                                  ${isTransitioning && !isClosing ? 'animate-scale-in' : ''}
                                                  ${isClosing ? 'animate-scale-out' : ''}`}
                                        onClick={(e) => e.stopPropagation()} // Previne que feche ao clicar no card
                                    >
                                        {/* Galeria de Imagens */}
                                        <div className="grid grid-cols-12 gap-2 p-2">
                                            {/* Imagem principal (maior) */}
                                            <div className="col-span-6 relative h-[300px] rounded-l-xl overflow-hidden">
                                                <Image
                                                    src={property.image}
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
                                                        src={property.image}
                                                        alt={property.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>

                                                {/* Duas imagens inferiores */}
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="relative h-[146px] overflow-hidden">
                                                        <Image
                                                            src={property.image}
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

                                        {/* Botão de fechar - agora posicionado no canto superior direito absoluto */}
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
                                                <div className="col-span-12 md:col-span-8">
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
                                                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">{property.details}</span>
                                                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">{property.location}</span>
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
                                                                className={`py-2 whitespace-nowrap ${activeTab === 'oferecemos' ? 'border-b-2 border-[#8BADA4] text-[#8BADA4] font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                                                                onClick={() => setActiveTab('oferecemos')}
                                                            >
                                                                O que oferecemos
                                                            </button>
                                                            <button
                                                                className={`py-2 whitespace-nowrap ${activeTab === 'deve_saber' ? 'border-b-2 border-[#8BADA4] text-[#8BADA4] font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                                                                onClick={() => setActiveTab('deve_saber')}
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
                                                            <h3 className="text-xl font-semibold mb-3">Nosso imóvel</h3>
                                                            <p className="text-gray-700 mb-4">
                                                                Este charmoso imóvel localizado em {property.location} oferece um ambiente aconchegante e moderno.
                                                                Com {property.features.split('·').join(', ')}, o espaço é perfeito para uma estadia confortável.
                                                            </p>
                                                            <p className="text-gray-700">
                                                                Próximo a restaurantes, comércio e transporte público. O imóvel conta com Wi-Fi de alta velocidade,
                                                                ar-condicionado e todas as comodidades para uma estadia perfeita.
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Conteúdo do que oferecemos */}
                                                    {activeTab === 'oferecemos' && (
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-4">O que esse lugar oferece</h3>
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
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 flex items-center justify-center">
                                                                        <Dog className="w-6 h-6 text-gray-700" />
                                                                    </div>
                                                                    <span className="text-gray-700">Permitido animais</span>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 flex items-center justify-center">
                                                                        <House className="w-6 h-6 text-gray-700" />
                                                                    </div>
                                                                    <span className="text-gray-700">Pátio ou varanda</span>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 flex items-center justify-center">
                                                                        <Lightning className="w-6 h-6 text-gray-400 line-through" />
                                                                    </div>
                                                                    <span className="text-gray-400 line-through">Alarme de monóxido de carbono</span>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 flex items-center justify-center">
                                                                        <Fire className="w-6 h-6 text-gray-400 line-through" />
                                                                    </div>
                                                                    <span className="text-gray-400 line-through">Detector de fumaça</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Conteúdo "O que você deve saber" substituindo o conteúdo de avaliações */}
                                                    {activeTab === 'deve_saber' && (
                                                        <div>
                                                            {/* Controle de navegação entre tópicos */}
                                                            <div className="mb-6 border-b border-gray-200">
                                                                <div className="flex flex-wrap gap-4 text-sm">
                                                                    <button
                                                                        className={`py-2 ${activeInfoTopic === 'regras' ? 'font-medium text-[#8BADA4] border-b-2 border-[#8BADA4]' : 'text-gray-600 hover:text-gray-900'}`}
                                                                        onClick={() => setActiveInfoTopic('regras')}
                                                                    >
                                                                        Regras da casa
                                                                    </button>
                                                                    <button
                                                                        className={`py-2 ${activeInfoTopic === 'seguranca' ? 'font-medium text-[#8BADA4] border-b-2 border-[#8BADA4]' : 'text-gray-600 hover:text-gray-900'}`}
                                                                        onClick={() => setActiveInfoTopic('seguranca')}
                                                                    >
                                                                        Segurança e propriedade
                                                                    </button>
                                                                    <button
                                                                        className={`py-2 ${activeInfoTopic === 'cancelamento' ? 'font-medium text-[#8BADA4] border-b-2 border-[#8BADA4]' : 'text-gray-600 hover:text-gray-900'}`}
                                                                        onClick={() => setActiveInfoTopic('cancelamento')}
                                                                    >
                                                                        Política de cancelamento
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Conteúdo de Regras da casa */}
                                                            {activeInfoTopic === 'regras' && (
                                                                <div>
                                                                    <h3 className="text-xl font-semibold mb-4">Regras da casa</h3>
                                                                    <p className="text-gray-700 mb-6">
                                                                        Leia atentamente as regras do anfitrião para garantir uma estadia tranquila.
                                                                    </p>

                                                                    <div className="space-y-6">
                                                                        <div className="flex items-start gap-4">
                                                                            <div className="mt-1">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                                                                                    <circle cx="12" cy="12" r="10"></circle>
                                                                                    <polyline points="12 6 12 12 16 14"></polyline>
                                                                                </svg>
                                                                            </div>
                                                                            <div>
                                                                                <h5 className="font-medium text-gray-900">Check-in: Após 15:00</h5>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex items-start gap-4">
                                                                            <div className="mt-1">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                                                                                    <circle cx="12" cy="12" r="10"></circle>
                                                                                    <polyline points="12 6 12 12 16 14"></polyline>
                                                                                </svg>
                                                                            </div>
                                                                            <div>
                                                                                <h5 className="font-medium text-gray-900">Check-out: 11:00</h5>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex items-start gap-4">
                                                                            <div className="mt-1">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                                                                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                                                    <circle cx="9" cy="7" r="4"></circle>
                                                                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                                                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                                                                </svg>
                                                                            </div>
                                                                            <div>
                                                                                <h5 className="font-medium text-gray-900">Máximo de 4 hóspedes</h5>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex items-start gap-4">
                                                                            <div className="mt-1">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                                                                                    <path d="M21 12V7H5v5"></path>
                                                                                    <path d="M3 16h18"></path>
                                                                                    <path d="M18 12v4"></path>
                                                                                    <path d="M6 12v4"></path>
                                                                                </svg>
                                                                            </div>
                                                                            <div>
                                                                                <h5 className="font-medium text-gray-900">Proibido festas ou eventos</h5>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex items-start gap-4">
                                                                            <div className="mt-1">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                                                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                                                </svg>
                                                                            </div>
                                                                            <div>
                                                                                <h5 className="font-medium text-gray-900">Proibido fumar</h5>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Conteúdo de Segurança e propriedade */}
                                                            {activeInfoTopic === 'seguranca' && (
                                                                <div>
                                                                    <h3 className="text-xl font-semibold mb-4">Segurança e propriedade</h3>
                                                                    <p className="text-gray-700 mb-6">
                                                                        Evite surpresas ao conferir estas informações importantes sobre a propriedade do seu anfitrião.
                                                                    </p>

                                                                    <div className="space-y-8">
                                                                        {/* Dispositivos de segurança */}
                                                                        <div>
                                                                            <h4 className="text-lg font-medium mb-4">Dispositivos de segurança</h4>

                                                                            <div className="space-y-6">
                                                                                <div className="flex items-start gap-4">
                                                                                    <div className="mt-1">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                                                                            <path d="M2 12c0 5.5 4.5 10 10 10s10-4.5 10-10S17.5 2 12 2 2 6.5 2 12z" />
                                                                                            <path d="M7 12l5 5 5-5M7 12l5-5 5 5" />
                                                                                        </svg>
                                                                                    </div>
                                                                                    <div>
                                                                                        <h5 className="font-medium text-gray-900">Alarme de monóxido de carbono não informado</h5>
                                                                                        <p className="text-gray-600 mt-1">O anfitrião não informou que a propriedade tem um detector de monóxido de carbono. Sugerimos levar um detector portátil para sua viagem.</p>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="flex items-start gap-4">
                                                                                    <div className="mt-1">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                                                                            <path d="M2 12c0 5.5 4.5 10 10 10s10-4.5 10-10S17.5 2 12 2 2 6.5 2 12z" />
                                                                                            <path d="M7 12l5 5 5-5M7 12l5-5 5 5" />
                                                                                        </svg>
                                                                                    </div>
                                                                                    <div>
                                                                                        <h5 className="font-medium text-gray-900">Detector de fumaça não informado</h5>
                                                                                        <p className="text-gray-600 mt-1">O anfitrião não informou que a propriedade tem um detector de fumaça. Sugerimos levar um detector portátil para sua viagem.</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Informações da propriedade */}
                                                                        <div>
                                                                            <h4 className="text-lg font-medium mb-4">Informações da propriedade</h4>

                                                                            <div className="space-y-6">
                                                                                <div className="flex items-start gap-4">
                                                                                    <div className="mt-1">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                                                                                            <rect x="2" y="5" width="20" height="14" rx="2" />
                                                                                            <path d="M2 10h20" />
                                                                                        </svg>
                                                                                    </div>
                                                                                    <div>
                                                                                        <h5 className="font-medium text-gray-900">Alguns espaços são compartilhados</h5>
                                                                                        <p className="text-gray-600 mt-1">"Cozinha coletiva"</p>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="flex items-start gap-4">
                                                                                    <div className="mt-1">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                                                                                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                                                                            <polyline points="9 22 9 12 15 12 15 22" />
                                                                                        </svg>
                                                                                    </div>
                                                                                    <div>
                                                                                        <h5 className="font-medium text-gray-900">Deve subir escadas</h5>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="flex items-start gap-4">
                                                                                    <div className="mt-1">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                                                                                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                                                                                            <polyline points="22 4 12 14.01 9 11.01" />
                                                                                        </svg>
                                                                                    </div>
                                                                                    <div>
                                                                                        <h5 className="font-medium text-gray-900">Não há estacionamento na propriedade</h5>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="flex items-start gap-4">
                                                                                    <div className="mt-1">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                                                                                            <circle cx="12" cy="12" r="10" />
                                                                                            <line x1="12" y1="8" x2="12" y2="16" />
                                                                                            <line x1="8" y1="12" x2="16" y2="12" />
                                                                                        </svg>
                                                                                    </div>
                                                                                    <div>
                                                                                        <h5 className="font-medium text-gray-900">Limitações de comodidades</h5>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Conteúdo de Política de cancelamento */}
                                                            {activeInfoTopic === 'cancelamento' && (
                                                                <div>
                                                                    <h3 className="text-xl font-semibold mb-4">Política de cancelamento</h3>
                                                                    <p className="text-gray-700 mb-6">
                                                                        Revise a política de cancelamento do anfitrião para entender suas opções.
                                                                    </p>

                                                                    <div className="space-y-6">
                                                                        <div className="flex items-start gap-4">
                                                                            <div className="mt-1">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                                                                                    <circle cx="12" cy="12" r="10"></circle>
                                                                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                                                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                                                                </svg>
                                                                            </div>
                                                                            <div>
                                                                                <h5 className="font-medium text-gray-900">Cancelamento gratuito por 48 horas</h5>
                                                                                <p className="text-gray-600 mt-1">Após esse período, o anfitrião estipula suas condições de cancelamento.</p>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex items-start gap-4">
                                                                            <div className="mt-1">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                                                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                                                    <circle cx="12" cy="7" r="4"></circle>
                                                                                </svg>
                                                                            </div>
                                                                            <div>
                                                                                <h5 className="font-medium text-gray-900">Política moderada</h5>
                                                                                <p className="text-gray-600 mt-1">Cancelamento gratuito até 5 dias antes do check-in. Após esse período, será cobrada uma taxa.</p>
                                                                            </div>
                                                                        </div>

                                                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 mt-6">
                                                                            <p className="text-gray-700">
                                                                                Revise a política completa do anfitrião que se aplicará mesmo se você cancelar por doença, interrupções causadas por COVID-19 ou circunstâncias atenuantes.
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Conteúdo sobre a localização */}
                                                    {activeTab === 'localizacao' && (
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-4 text-[#8BADA4]">Onde você estará</h3>
                                                            <p className="text-gray-700 mb-4">
                                                                {property.location}, Brasil
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
                                                                    <p className="font-medium text-gray-800">O local exato é fornecido depois da reserva.</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-gray-700">
                                                                <p className="mb-3">
                                                                    Este imóvel está localizado em uma área privilegiada de {property.location.split(",")[0]}, oferecendo fácil acesso a:
                                                                </p>
                                                                <ul className="list-disc pl-5 space-y-1">
                                                                    <li>Transporte público a 200m</li>
                                                                    <li>Restaurantes e cafés a 5 minutos a pé</li>
                                                                    <li>Supermercados e farmácias próximos</li>
                                                                    <li>Parques e áreas de lazer nas redondezas</li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Coluna lateral (direita) - Reserva */}
                                                <div className="col-span-12 md:col-span-4">
                                                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-md">
                                                        {/* Preço e avaliação */}
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div>
                                                                <span className="text-2xl font-bold text-gray-900">R$ {property.pricePerNight}</span>
                                                                <span className="text-gray-600 ml-1">/ noite</span>
                                                            </div>
                                                            <div className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm">
                                                                <Star weight="fill" className="w-4 h-4 text-yellow-500" />
                                                                <span className="text-sm font-medium text-black">{property.rating}</span>
                                                                <span className="text-xs text-gray-500">({property.reviewCount})</span>
                                                            </div>
                                                        </div>

                                                        {/* Campos de data */}
                                                        <div className="mb-4">
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div>
                                                                    <label className="block text-sm text-gray-600 mb-1">Check-in</label>
                                                                    <input
                                                                        type="date"
                                                                        className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-[#8BADA4] focus:border-transparent"
                                                                        value={checkInDate}
                                                                        onChange={(e) => setCheckInDate(e.target.value)}
                                                                        min={new Date().toISOString().split('T')[0]}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm text-gray-600 mb-1">Check-out</label>
                                                                    <input
                                                                        type="date"
                                                                        className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-[#8BADA4] focus:border-transparent"
                                                                        value={checkOutDate}
                                                                        onChange={(e) => setCheckOutDate(e.target.value)}
                                                                        min={checkInDate || new Date().toISOString().split('T')[0]}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Resumo de valores */}
                                                        <div className="border-t border-gray-200 py-4 space-y-2">
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">R$ {property.pricePerNight} x {calculateNights(checkInDate, checkOutDate)} noites</span>
                                                                <span className="text-black">R$ {property.pricePerNight * calculateNights(checkInDate, checkOutDate)}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Desconto</span>
                                                                <span className="text-green-600">-R$ 50</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Taxa de serviço</span>
                                                                <span className="text-black">R$ 35</span>
                                                            </div>
                                                        </div>

                                                        {/* Total */}
                                                        <div className="border-t border-gray-200 pt-4 mb-4">
                                                            <div className="flex justify-between font-bold">
                                                                <span>Total</span>
                                                                <span className="text-black">R$ {(property.pricePerNight * calculateNights(checkInDate, checkOutDate)) - 50 + 35}</span>
                                                            </div>
                                                        </div>

                                                        {/* Mensagem de feedback */}
                                                        {consultationMessage && (
                                                            <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg">
                                                                {consultationMessage}
                                                            </div>
                                                        )}

                                                        {/* Botão de consulta */}
                                                        <button className="w-full py-3 px-4 bg-[#8BADA4] hover:bg-[#7A9D94] text-white font-medium rounded-full transition-colors flex items-center justify-center gap-2" onClick={() => handleAvailabilityConsultation(property)}>
                                                            Consultar disponibilidade <ArrowRight weight="bold" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 