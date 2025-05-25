'use client'

import Image from 'next/image';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
    CaretLeft, CaretRight, Buildings, MapPin, Lock, Waves, CookingPot,
    WifiHigh, Desktop, Television, Dog, House, Lightning, Fire, Calendar as CalendarIcon, CaretDown,
    Clock, X, CookingPot as Coffee, Snowflake, Users, Bed, ArrowRight, Star, Heart, CheckCircle,
    Shield, Calendar
} from '@phosphor-icons/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { useProperties } from '@/hooks/useProperties';
import { Property } from '@/data/sampleProperties';
import { formatCurrency } from '@/utils/format';

// Importação dinâmica do componente de mapa para evitar erros de SSR
const MapComponent = dynamic(() => import('../MapComponent'), { ssr: false })

// Componente FavoriteButton
const FavoriteButton = ({ propertyId }: { propertyId: number | string }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const storedFavorites = localStorage.getItem('yallah_favorites');
        if (storedFavorites) {
            const favorites = JSON.parse(storedFavorites);
            setIsFavorite(favorites.includes(propertyId));
        }
    }, [propertyId]);

    const toggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        let favorites: (number | string)[] = [];
        const storedFavorites = localStorage.getItem('yallah_favorites');

        if (storedFavorites) {
            favorites = JSON.parse(storedFavorites);
        }

        if (isFavorite) {
            favorites = favorites.filter(id => id !== propertyId);
        } else {
            favorites.push(propertyId);
        }

        localStorage.setItem('yallah_favorites', JSON.stringify(favorites));
        setIsFavorite(!isFavorite);
    };

    return (
        <button
            onClick={toggleFavorite}
            className="bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300"
            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
            <Heart
                className="w-5 h-5"
                weight={isFavorite ? "fill" : "regular"}
                color={isFavorite ? "#8BADA4" : "#4B5563"}
            />
        </button>
    );
};

// Define a type for the property data structure
interface PropertyCard {
    id: number | string;
    title: string;
    location: string;
    details?: string;
    features: string;
    pricePerNight: number;
    rating: number | { value: number; count: number }; // Pode ser número ou objeto
    reviewCount: number;
    image: string;
    link?: string;
    host?: string;
    coordinates?: [number, number];
    description?: string;
    whatWeOffer?: string;
    whatYouShouldKnow?: string; // Corrigido para ser opcional novamente
    whatYouShouldKnowRichText?: string; // Campo para o conteúdo do editor rico
    serviceFee?: number;
    discountAmount?: number;
    type?: string;
    images?: string[];
    rooms?: number;      // Adicionar campo para quartos
    bathrooms?: number;  // Adicionar campo para banheiros
    beds?: number;       // Adicionar campo para camas
    guests?: number;     // Adicionar campo para hóspedes
    amenities?: string[]; // Adicionar campo para comodidades
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
    pointsOfInterest?: string[]; // Novo campo para pontos de interesse
}

// Static property data as fallback
const staticAllProperties: PropertyCard[] = [
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
        host: "Anfitrião: Clara",
        coordinates: [-46.6872, -23.5504] as [number, number],
        type: "Estúdio"
    },
    {
        id: 12,
        title: "Apartamento próximo ao shopping",
        location: "Morumbi, São Paulo",
        details: "Espaço inteiro: apartamento",
        features: "3 hóspedes · 2 quartos · 2 camas · 1 banheiro",
        pricePerNight: 210,
        rating: 4.7,
        reviewCount: 52,
        image: "/recomendado3.jpg",
        link: "/imoveis/morumbi-shopping",
        host: "Anfitrião: Francisco",
        coordinates: [-46.7234, -23.6170] as [number, number],
        type: "Apartamento"
    },
    {
        id: 13,
        title: "Casa com piscina privativa",
        location: "Riviera de São Lourenço, São Paulo",
        details: "Espaço inteiro: casa",
        features: "8 hóspedes · 4 quartos · 5 camas · 3 banheiros",
        pricePerNight: 580,
        rating: 4.9,
        reviewCount: 67,
        image: "/card4.jpg",
        link: "/imoveis/riviera-piscina",
        host: "Anfitrião: Tatiana",
        coordinates: [-45.9863, -23.7964] as [number, number]
    },
    {
        id: 14,
        title: "Loft industrial reformado",
        location: "Barra Funda, São Paulo",
        details: "Espaço inteiro: loft",
        features: "3 hóspedes · 1 quarto · 2 camas · 1 banheiro",
        pricePerNight: 175,
        rating: 4.5,
        reviewCount: 38,
        image: "/card1.jpg",
        link: "/imoveis/loft-industrial",
        host: "Anfitrião: Diego",
        coordinates: [-46.6620, -23.5308] as [number, number]
    },
    {
        id: 15,
        title: "Penthouse com vista panorâmica",
        location: "Higienópolis, São Paulo",
        details: "Espaço inteiro: penthouse",
        features: "4 hóspedes · 2 quartos · 2 camas · 2 banheiros",
        pricePerNight: 450,
        rating: 4.9,
        reviewCount: 61,
        image: "/recomendado1.jpg",
        link: "/imoveis/penthouse-higienopolis",
        host: "Anfitrião: Laura",
        coordinates: [-46.6513, -23.5366] as [number, number]
    },
    {
        id: 16,
        title: "Cabana rústica na serra",
        location: "São Roque, São Paulo",
        details: "Espaço inteiro: cabana",
        features: "2 hóspedes · 1 quarto · 1 cama · 1 banheiro",
        pricePerNight: 320,
        rating: 4.8,
        reviewCount: 49,
        image: "/recomendado2.jpg",
        link: "/imoveis/cabana-serra",
        host: "Anfitrião: Roberto",
        coordinates: [-47.1358, -23.5271] as [number, number]
    },
    {
        id: 17,
        title: "Apartamento com varanda e home office",
        location: "Perdizes, São Paulo",
        details: "Espaço inteiro: apartamento",
        features: "3 hóspedes · 2 quartos · 2 camas · 1 banheiro",
        pricePerNight: 240,
        rating: 4.7,
        reviewCount: 55,
        image: "/card2.jpg",
        link: "/imoveis/perdizes-office",
        host: "Anfitrião: Isabela",
        coordinates: [-46.6688, -23.5366] as [number, number]
    },
    {
        id: 18,
        title: "Casa de campo com lareira",
        location: "Atibaia, São Paulo",
        details: "Espaço inteiro: casa",
        features: "6 hóspedes · 3 quartos · 4 camas · 2 banheiros",
        pricePerNight: 390,
        rating: 4.8,
        reviewCount: 64,
        image: "/recomendado3.jpg",
        link: "/imoveis/atibaia-lareira",
        host: "Anfitrião: Henrique",
        coordinates: [-46.5571, -23.1275] as [number, number]
    },
    {
        id: 19,
        title: "Studio minimalista e moderno",
        location: "Pinheiros, São Paulo",
        details: "Espaço inteiro: studio",
        features: "2 hóspedes · Studio · 1 cama · 1 banheiro",
        pricePerNight: 200,
        rating: 4.6,
        reviewCount: 41,
        image: "/card4.jpg",
        link: "/imoveis/studio-minimalista",
        host: "Anfitrião: Marcia",
        coordinates: [-46.6835, -23.5643] as [number, number]
    },
    {
        id: 20,
        title: "Apartamento com terraço gourmet",
        location: "Tatuapé, São Paulo",
        details: "Espaço inteiro: apartamento",
        features: "4 hóspedes · 2 quartos · 2 camas · 2 banheiros",
        pricePerNight: 280,
        rating: 4.7,
        reviewCount: 47,
        image: "/recomendado1.jpg",
        link: "/imoveis/tatuape-terraco",
        host: "Anfitrião: Renato",
        coordinates: [-46.5763, -23.5371] as [number, number]
    },
    {
        id: 21,
        title: "Cobertura com vista para o parque",
        location: "Paraíso, São Paulo",
        details: "Espaço inteiro: cobertura",
        features: "6 hóspedes · 3 quartos · 4 camas · 2 banheiros",
        pricePerNight: 420,
        rating: 4.8,
        reviewCount: 58,
        image: "/card1.jpg",
        link: "/imoveis/cobertura-paraiso",
        host: "Anfitrião: Miguel",
        coordinates: [-46.6513, -23.5716] as [number, number]
    },
    {
        id: 22,
        title: "Studio design na Vila Nova",
        location: "Vila Nova Conceição, São Paulo",
        details: "Espaço inteiro: studio",
        features: "2 hóspedes · Studio · 1 cama · 1 banheiro",
        pricePerNight: 230,
        rating: 4.7,
        reviewCount: 45,
        image: "/card2.jpg",
        link: "/imoveis/studio-vila-nova",
        host: "Anfitrião: Paula",
        coordinates: [-46.6713, -23.5916] as [number, number]
    },
    {
        id: 23,
        title: "Apartamento com jardim privativo",
        location: "Alto de Pinheiros, São Paulo",
        details: "Espaço inteiro: apartamento",
        features: "4 hóspedes · 2 quartos · 3 camas · 2 banheiros",
        pricePerNight: 350,
        rating: 4.9,
        reviewCount: 62,
        image: "/card3.jpg",
        link: "/imoveis/jardim-pinheiros",
        host: "Anfitrião: Ricardo",
        coordinates: [-46.7013, -23.5516] as [number, number]
    },
    {
        id: 24,
        title: "Loft contemporâneo",
        location: "Vila Olímpia, São Paulo",
        details: "Espaço inteiro: loft",
        features: "3 hóspedes · 1 quarto · 2 camas · 1 banheiro",
        pricePerNight: 280,
        rating: 4.6,
        reviewCount: 39,
        image: "/card4.jpg",
        link: "/imoveis/loft-olimpia",
        host: "Anfitrião: Beatriz",
        coordinates: [-46.6813, -23.5916] as [number, number]
    },
    {
        id: 25,
        title: "Casa moderna com piscina",
        location: "Granja Viana, São Paulo",
        details: "Espaço inteiro: casa",
        features: "8 hóspedes · 4 quartos · 6 camas · 3 banheiros",
        pricePerNight: 650,
        rating: 4.9,
        reviewCount: 71,
        image: "/recomendado1.jpg",
        link: "/imoveis/casa-granja",
        host: "Anfitrião: Fernando",
        coordinates: [-46.8313, -23.5916] as [number, number]
    },
    {
        id: 26,
        title: "Apartamento próximo ao metrô",
        location: "Santa Cecília, São Paulo",
        details: "Espaço inteiro: apartamento",
        features: "4 hóspedes · 2 quartos · 2 camas · 1 banheiro",
        pricePerNight: 220,
        rating: 4.7,
        reviewCount: 48,
        image: "/recomendado2.jpg",
        link: "/imoveis/metro-cecilia",
        host: "Anfitrião: Amanda",
        coordinates: [-46.6513, -23.5366] as [number, number]
    },
    {
        id: 27,
        title: "Estúdio com varanda gourmet",
        location: "Brooklin, São Paulo",
        details: "Espaço inteiro: studio",
        features: "2 hóspedes · Studio · 1 cama · 1 banheiro",
        pricePerNight: 195,
        rating: 4.5,
        reviewCount: 35,
        image: "/recomendado3.jpg",
        link: "/imoveis/studio-brooklin",
        host: "Anfitrião: Lucas",
        coordinates: [-46.6913, -23.6216] as [number, number]
    },
    {
        id: 28,
        title: "Cobertura duplex com terraço",
        location: "Itaim Bibi, São Paulo",
        details: "Espaço inteiro: cobertura",
        features: "6 hóspedes · 3 quartos · 4 camas · 3 banheiros",
        pricePerNight: 580,
        rating: 4.9,
        reviewCount: 64,
        image: "/card1.jpg",
        link: "/imoveis/duplex-itaim",
        host: "Anfitrião: Carolina",
        coordinates: [-46.6713, -23.5816] as [number, number]
    },
    {
        id: 29,
        title: "Casa de campo moderna",
        location: "Cotia, São Paulo",
        details: "Espaço inteiro: casa",
        features: "10 hóspedes · 5 quartos · 7 camas · 4 banheiros",
        pricePerNight: 720,
        rating: 4.8,
        reviewCount: 53,
        image: "/card2.jpg",
        link: "/imoveis/casa-cotia",
        host: "Anfitrião: Roberto",
        coordinates: [-46.9213, -23.6016] as [number, number]
    },
    {
        id: 30,
        title: "Apartamento com vista para o parque",
        location: "Moema, São Paulo",
        details: "Espaço inteiro: apartamento",
        features: "4 hóspedes · 2 quartos · 3 camas · 2 banheiros",
        pricePerNight: 340,
        rating: 4.7,
        reviewCount: 49,
        image: "/card3.jpg",
        link: "/imoveis/vista-moema",
        host: "Anfitrião: Patricia",
        coordinates: [-46.6613, -23.6016] as [number, number]
    },
    {
        id: 31,
        title: "Studio minimalista",
        location: "República, São Paulo",
        details: "Espaço inteiro: studio",
        features: "2 hóspedes · Studio · 1 cama · 1 banheiro",
        pricePerNight: 180,
        rating: 4.6,
        reviewCount: 41,
        image: "/card4.jpg",
        link: "/imoveis/studio-republica",
        host: "Anfitrião: Thiago",
        coordinates: [-46.6413, -23.5416] as [number, number]
    },
    {
        id: 32,
        title: "Apartamento com home office",
        location: "Vila Mariana, São Paulo",
        details: "Espaço inteiro: apartamento",
        features: "3 hóspedes · 2 quartos · 2 camas · 1 banheiro",
        pricePerNight: 250,
        rating: 4.7,
        reviewCount: 46,
        image: "/recomendado1.jpg",
        link: "/imoveis/office-mariana",
        host: "Anfitrião: Juliana",
        coordinates: [-46.6313, -23.5816] as [number, number]
    },
    {
        id: 33,
        title: "Cobertura com vista 360°",
        location: "Jardins, São Paulo",
        details: "Espaço inteiro: cobertura",
        features: "6 hóspedes · 3 quartos · 4 camas · 3 banheiros",
        pricePerNight: 620,
        rating: 4.9,
        reviewCount: 68,
        image: "/recomendado2.jpg",
        link: "/imoveis/cobertura-jardins",
        host: "Anfitrião: Marcelo",
        coordinates: [-46.6613, -23.5716] as [number, number]
    },
    {
        id: 34,
        title: "Casa com área de lazer",
        location: "Santana, São Paulo",
        details: "Espaço inteiro: casa",
        features: "8 hóspedes · 4 quartos · 5 camas · 3 banheiros",
        pricePerNight: 480,
        rating: 4.8,
        reviewCount: 57,
        image: "/recomendado3.jpg",
        link: "/imoveis/casa-santana",
        host: "Anfitrião: Rafael",
        coordinates: [-46.6213, -23.5016] as [number, number]
    },
    {
        id: 35,
        title: "Loft industrial moderno",
        location: "Berrini, São Paulo",
        details: "Espaço inteiro: loft",
        features: "4 hóspedes · 2 quartos · 2 camas · 2 banheiros",
        pricePerNight: 380,
        rating: 4.7,
        reviewCount: 52,
        image: "/card1.jpg",
        link: "/imoveis/loft-berrini",
        host: "Anfitrião: Gabriela",
        coordinates: [-46.6913, -23.6116] as [number, number]
    }
]

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

// Função auxiliar para extrair números de uma string com verificação segura de null
const extractNumberFromFeature = (featureText: string, pattern: string, propertyValue?: number): string => {
    // Se um valor específico da propriedade for fornecido, use-o diretamente
    if (propertyValue !== undefined) {
        return propertyValue.toString();
    }

    if (!featureText) return '1';

    const regex = new RegExp(`\\d+\\s*${pattern}`);
    const match = featureText.match(regex);

    if (match && match[0]) {
        const numberMatch = match[0].match(/\d+/);
        return numberMatch && numberMatch[0] ? numberMatch[0] : '1';
    }

    return '1';
};

// Adicionar uma função para extrair o número de hóspedes com valor padrão diferente
const extractGuestsFromFeature = (featureText: string, guestsValue?: number): string => {
    // Se um valor específico de hóspedes for fornecido, use-o diretamente
    if (guestsValue !== undefined) {
        return guestsValue.toString();
    }

    if (!featureText) return '2';

    const regex = /\d+\s*hóspede/;
    const match = featureText.match(regex);

    if (match && match[0]) {
        const numberMatch = match[0].match(/\d+/);
        return numberMatch && numberMatch[0] ? numberMatch[0] : '2';
    }

    return '2';
};

// Adicione a função getAmenityIcon antes do componente principal
const getAmenityIcon = (amenity: string) => {
    const text = amenity.toLowerCase();
    if (text.includes('wi-fi') || text.includes('internet') || text.includes('wifi')) return <WifiHigh className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('tv') || text.includes('televisão')) return <Television className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('cozinha')) return <CookingPot className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('estacionamento')) return <Waves className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('piscina')) return <Waves className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('ar-condicionado')) return <Snowflake className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('aquecimento')) return <Fire className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('café') || text.includes('cafeteira')) return <Coffee className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('ventilador')) return <Desktop className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('água quente') || text.includes('água')) return <Waves className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('segurança') || text.includes('alarme')) return <Lock className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('varanda') || text.includes('terraço') || text.includes('quintal')) return <House className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('jardim')) return <House className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('churrasqueira')) return <Fire className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('academia')) return <Desktop className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('banheiro')) return <Bed className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('quarto')) return <Bed className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('roupa de cama') || text.includes('roupa')) return <Bed className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('chuveiro') || text.includes('ducha')) return <Waves className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('talheres') || text.includes('louça')) return <CookingPot className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('geladeira') || text.includes('refrigerador')) return <CookingPot className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('microondas')) return <CookingPot className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('sofá') || text.includes('sala')) return <House className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('ferro') || text.includes('passar')) return <Lightning className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('cabos') || text.includes('plugue') || text.includes('eletricidade')) return <Lightning className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('bicicleta')) return <House className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('detector') || text.includes('alarme') || text.includes('monóxido')) return <Lock className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('pet') || text.includes('animais') || text.includes('cachorro')) return <Dog className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('lâmpada') || text.includes('iluminação')) return <Lightning className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('secador')) return <Lightning className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('xampu') || text.includes('shampoo') || text.includes('sabonete')) return <Bed className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('vista') || text.includes('montanha')) return <House className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('cobertor') || text.includes('travesseiro')) return <Bed className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('blackout') || text.includes('cortina')) return <House className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('guarda-roupa') || text.includes('armário')) return <House className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('bluetooth') || text.includes('som')) return <Lightning className="w-5 h-5 text-[#8BADA4]" />;
    return <CheckCircle className="w-5 h-5 text-[#8BADA4]" />;
};

// Adicionar uma função para mapear as propriedades reais a partir do Firebase para o formato PropertyCard usado pelo frontend
const mapFirebaseToPropertyCard = (properties: any[]): PropertyCard[] => {
    if (!properties || properties.length === 0) return staticAllProperties;

    return properties.map(property => {
        // Debug para verificar estrutura dos dados - REMOVIDO
        // console.log("[MAPPER DEBUG] Dados originais da propriedade recebidos:", JSON.stringify(property, null, 2)); 
        // console.log("[MAPPER DEBUG] property.what_you_should_know_rich_text (snake):", property.what_you_should_know_rich_text);
        // console.log("[MAPPER DEBUG] property.whatYouShouldKnowRichText (camel):", property.whatYouShouldKnowRichText);
        // console.log("[MAPPER DEBUG] property.what_you_should_know_sections (snake):", JSON.stringify(property.what_you_should_know_sections, null, 2));
        // console.log("[MAPPER DEBUG] property.whatYouShouldKnowSections (camel):", JSON.stringify(property.whatYouShouldKnowSections, null, 2));

        // Verificar qual campo de preço está disponível
        const price = property.price || property.pricePerNight || 0;

        // Generate features string from property details
        const rooms = property.bedrooms || property.rooms || 0;
        const bathrooms = property.bathrooms || 0;
        const beds = property.beds || 0;
        const guests = property.maxGuests || property.guests || 0;

        // Format features string in the format: "X hóspedes · Y quartos · Z camas · W banheiros"
        let featuresString = "";
        if (guests > 0) featuresString += `${guests} ${guests === 1 ? 'hóspede' : 'hóspedes'}`;

        // If it's a studio, use "Studio" instead of "0 quartos"
        if (property.type === 'Studio' || property.type === 'Estúdio' || !rooms) {
            featuresString += featuresString ? ' · Studio' : 'Studio';
        } else {
            featuresString += featuresString ? ` · ${rooms} ${rooms === 1 ? 'quarto' : 'quartos'}` : `${rooms} ${rooms === 1 ? 'quarto' : 'quartos'}`;
        }

        if (beds > 0) featuresString += featuresString ? ` · ${beds} ${beds === 1 ? 'cama' : 'camas'}` : `${beds} ${beds === 1 ? 'cama' : 'camas'}`;
        if (bathrooms > 0) featuresString += featuresString ? ` · ${bathrooms} ${bathrooms === 1 ? 'banheiro' : 'banheiros'}` : `${bathrooms} ${bathrooms === 1 ? 'banheiro' : 'banheiros'}`;

        // If no details are available, use a default string
        if (!featuresString) {
            featuresString = property.features || "Detalhes não disponíveis";
        }

        return {
            id: property.id,
            title: property.title || "Sem título",
            location: property.location || "Localização não especificada",
            details: property.details || "",
            features: featuresString,
            pricePerNight: price,
            rating: property.rating || 4.5,
            reviewCount: property.reviewCount || 0,
            image: property.image || "/card1.jpg",
            coordinates: property.coordinates || [-46.6333, -23.5505],
            description: property.description || "",
            whatWeOffer: property.whatWeOffer || "",
            whatYouShouldKnow: property.what_you_should_know || "",
            whatYouShouldKnowRichText: property.what_you_should_know_rich_text || "",
            type: property.type || "",
            images: property.images || [], // Garantir que images está sendo transferido corretamente
            rooms: rooms,
            bathrooms: bathrooms,
            beds: beds,
            guests: guests,
            amenities: property.amenities || [],
            // Adicionar os dados das novas seções
            houseRules: property.house_rules || { // Ler de snake_case para o objeto principal houseRules
                checkIn: '15:00',
                checkOut: '11:00',
                maxGuests: property.guests || 2,
                additionalRules: []
            },
            safety: property.safety || {
                hasCoAlarm: false,
                hasSmokeAlarm: false,
                hasCameras: false
            },
            whatYouShouldKnowSections: property.what_you_should_know_sections || {
                houseRules: [],
                safetyProperty: [],
                cancellationPolicy: []
            },
            pointsOfInterest: property.points_of_interest || [] // Novo campo para pontos de interesse
        };
    });
};

// Função utilitária para garantir que só exibe placeholder se não houver imagem válida
function getValidImage(images: (string | { id: string; url: string })[] | undefined, fallback: string, idx?: number) {
    if (images && images.length > 0) {
        const imgEntry = typeof idx === 'number' ? images[idx] : images[0];

        if (imgEntry) {
            const imgUrl = typeof imgEntry === 'string' ? imgEntry : imgEntry.url;
            // Adicionar uma verificação extra para imgUrl não ser null ou undefined
            if (imgUrl && typeof imgUrl === 'string' && imgUrl.trim() !== '') {
                return imgUrl;
            }
        }
    }
    return fallback;
}

// Defina as categorias e suas comodidades para segmentação
const AMENITIES_BY_CATEGORY = [
    {
        category: 'Cozinha',
        items: [
            'Cafeteira',
            'Produtos de limpeza',
            'Cozinha',
            'Microondas',
            'Louças e talheres',
            'Frigobar',
            'Fogão por indução',
            'Móveis externos',
        ],
    },
    {
        category: 'Banheiro',
        items: [
            'Xampu',
            'Condicionador',
            'Sabonete para o corpo',
            'Água quente',
            'Secadora',
            'Básico (Toalhas, lençóis, sabonete e papel higiênico)',
            'Roupas de cama',
            'Cobertores e travesseiros extras',
            'Blackout nas cortinas',
            'Detector de fumaça',
            'Alarme de monóxido de carbono',
            'Extintor de incêndio',
            'Kit de primeiros socorros',
        ],
    },
    {
        category: 'Quarto',
        items: [
            'Cabides',
            'Local para guardar as roupas: guarda-roupa',
            'Ar-condicionado',
            'Ar-condicionado central',
            'Aquecimento central',
            'Máquina de lavar',
            'Espaço de trabalho exclusivo',
        ],
    },
    {
        category: 'Sala',
        items: [
            'TV',
            'Wi-Fi',
            'Pátio ou varanda (Privativa)',
            'Cadeira espreguiçadeira',
            'Estacionamento gratuito na rua',
            'Elevador',
            'Academia compartilhada (no prédio)',
            'Estacionamento pago fora da propriedade',
        ],
    },
    {
        category: 'Segurança',
        items: [
            'Produtos de limpeza',
            'Detector de fumaça',
            'Alarme de monóxido de carbono',
            'Extintor de incêndio',
            'Kit de primeiros socorros',
        ],
    },
    {
        category: 'Outros',
        items: [
            'Sabonete para o corpo',
            'Cobertores e travesseiros extras',
            'Móveis externos',
            'Cadeira espreguiçadeira',
        ],
    },
];

const getIconComponent = (amenityText: string) => {
    const text = amenityText.toLowerCase();
    if (text.includes('wi-fi') || text.includes('internet') || text.includes('wifi')) return <WifiHigh className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('tv') || text.includes('televisão')) return <Television className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('cozinha')) return <CookingPot className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('estacionamento')) return <Waves className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('piscina')) return <Waves className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('ar-condicionado')) return <Snowflake className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('aquecimento')) return <Fire className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('café') || text.includes('cafeteira')) return <Coffee className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('ventilador')) return <Desktop className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('água quente') || text.includes('água')) return <Waves className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('segurança') || text.includes('alarme')) return <Lock className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('varanda') || text.includes('terraço') || text.includes('quintal')) return <House className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('jardim')) return <House className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('churrasqueira')) return <Fire className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('academia')) return <Desktop className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('banheiro')) return <Bed className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('quarto')) return <Bed className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('roupa de cama') || text.includes('roupa')) return <Bed className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('chuveiro') || text.includes('ducha')) return <Waves className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('talheres') || text.includes('louça')) return <CookingPot className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('geladeira') || text.includes('refrigerador')) return <CookingPot className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('microondas')) return <CookingPot className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('sofá') || text.includes('sala')) return <House className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('ferro') || text.includes('passar')) return <Lightning className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('cabos') || text.includes('plugue') || text.includes('eletricidade')) return <Lightning className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('bicicleta')) return <House className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('detector') || text.includes('alarme') || text.includes('monóxido')) return <Lock className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('pet') || text.includes('animais') || text.includes('cachorro')) return <Dog className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('lâmpada') || text.includes('iluminação')) return <Lightning className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('secador')) return <Lightning className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('xampu') || text.includes('shampoo') || text.includes('sabonete')) return <Bed className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('vista') || text.includes('montanha')) return <House className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('cobertor') || text.includes('travesseiro')) return <Bed className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('blackout') || text.includes('cortina')) return <House className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('guarda-roupa') || text.includes('armário')) return <House className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('bluetooth') || text.includes('som')) return <Lightning className="w-5 h-5 text-[#8BADA4]" />;
    return <CheckCircle className="w-5 h-5 text-[#8BADA4]" />;
};

export default function AllProperties() {
    // Estados para controlar a expansão de cards
    const [expandedCard, setExpandedCard] = useState<number | string | null>(null)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    // Estados para inputs de data
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [startDate, endDate] = dateRange;
    const [consultationMessage, setConsultationMessage] = useState('');
    // Estado para controlar a aba ativa
    const [activeTab, setActiveTab] = useState('descricao');
    // Estado para controlar o slide atual
    const [currentSlide, setCurrentSlide] = useState(0);
    const itemsPerPage = 10; // 5 cards por linha, 2 linhas
    const totalSlides = Math.ceil(staticAllProperties.length / itemsPerPage);
    // Adicionar novos estados para o controle da galeria
    const [showFullGallery, setShowFullGallery] = useState(false);
    const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
    const [selectedProperty, setSelectedProperty] = useState<PropertyCard | null>(null);
    // Estado para controlar a direção da transição de slide
    const [slideDirection, setSlideDirection] = useState<'next' | 'prev' | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    // Função para atualizar o intervalo de datas
    const updateDateRange = (update: [Date | null, Date | null]) => {
        setDateRange(update);
    };

    // Usar o hook useProperties e mapear os resultados
    const { properties, loading, error } = useProperties({
        sortBy: 'updatedAt',
        sortDirection: 'desc'
    });

    // Mapear propriedades do Supabase para o formato do frontend
    const allProperties = useMemo(() =>
        properties && properties.length > 0 ? mapFirebaseToPropertyCard(properties) : [],
        [properties]);

    // Função para navegar para o próximo slide
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    // Função para navegar para o slide anterior
    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    };

    // Função para ir para um slide específico
    const goToSlide = (slideIndex: number) => {
        setCurrentSlide(slideIndex);
    };

    // Função para expandir um card
    const expandCard = (propertyId: number | string) => {
        if (expandedCard === propertyId) {
            // Se clicar no mesmo card já expandido, colapsa
            setIsClosing(true);
            setIsTransitioning(true);
            setTimeout(() => {
                setExpandedCard(null);
                setIsTransitioning(false);
                setIsClosing(false);
                // Resetar campos de formulário
                updateDateRange([null, null]);
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
                updateDateRange([null, null]);
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
                    updateDateRange([null, null]);
                    setConsultationMessage('');
                }, 300);
            }
        };

        // Adicionar listener para a tecla ESC
        document.addEventListener('keydown', handleEscKey);

        // Remover listener quando o componente for desmontado
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [expandedCard]); // Re-adiciona o listener quando o expandedCard mudar

    // Adicionar controle de teclado para navegação da galeria
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (showFullGallery && selectedProperty) {
                // Navegar com setas esquerda/direita
                if (event.key === 'ArrowLeft') {
                    prevImage(new MouseEvent('click') as unknown as React.MouseEvent);
                } else if (event.key === 'ArrowRight') {
                    nextImage(new MouseEvent('click') as unknown as React.MouseEvent);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [showFullGallery, selectedProperty, currentGalleryIndex]);

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

    // Debug das propriedades expandidas
    useEffect(() => {
        if (expandedCard !== null) {
            const expandedProperty = allProperties.find(p => p.id === expandedCard);
            if (expandedProperty) {
                console.log("Dados da propriedade expandida:", expandedProperty);
                console.log("Imagens:", (expandedProperty as any).images);
                console.log("Número de imagens:", (expandedProperty as any).images?.length || 0);
            }
        }
    }, [expandedCard, allProperties]);

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
            updateDateRange([null, null]);
        }, 5000);
    };

    // Função para abrir a galeria
    const openFullGallery = (property: PropertyCard) => {
        setSelectedProperty(property);
        setCurrentGalleryIndex(0);
        setShowFullGallery(true);
        // Prevenir o scroll da página quando a galeria estiver aberta
        document.body.style.overflow = 'hidden';
    };

    // Função para fechar a galeria
    const closeFullGallery = () => {
        setShowFullGallery(false);
        setSelectedProperty(null);
        // Restaurar o scroll da página
        document.body.style.overflow = '';
    };

    // Função para avançar imagem com animação
    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedProperty?.images || isAnimating) return;

        setIsAnimating(true);
        setSlideDirection('next');

        setTimeout(() => {
            setCurrentGalleryIndex(prev =>
                prev === selectedProperty.images!.length - 1 ? 0 : prev + 1
            );

            // Permitir um tempo para a nova imagem entrar antes de resetar
            setTimeout(() => {
                setIsAnimating(false);
                setSlideDirection(null);
            }, 50);
        }, 300); // Tempo de animação de saída
    };

    // Função para retroceder imagem com animação
    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedProperty?.images || isAnimating) return;

        setIsAnimating(true);
        setSlideDirection('prev');

        setTimeout(() => {
            setCurrentGalleryIndex(prev =>
                prev === 0 ? selectedProperty.images!.length - 1 : prev - 1
            );

            // Permitir um tempo para a nova imagem entrar antes de resetar
            setTimeout(() => {
                setIsAnimating(false);
                setSlideDirection(null);
            }, 50);
        }, 300); // Tempo de animação de saída
    };

    // Handle loading state
    if (loading) {
        return (
            <div className="container mx-auto py-16">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" role="status">
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                            Carregando...
                        </span>
                    </div>
                    <p className="mt-2 text-gray-600">Carregando imóveis...</p>
                </div>
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <div className="container mx-auto py-16">
                <div className="text-center">
                    <p className="text-red-500">Erro ao carregar imóveis. Por favor, tente novamente mais tarde.</p>
                </div>
            </div>
        );
    }

    // Handle empty state
    if (allProperties.length === 0) {
        return (
            <div className="container mx-auto py-16">
                <div className="text-center">
                    <p className="text-gray-500">Nenhum imóvel encontrado.</p>
                </div>
            </div>
        );
    }

    return (
        <div id="all-properties" className="w-full py-12 md:py-16 -mt-8 md:-mt-16 bg-white overflow-hidden relative">
            <div className="max-w-[1600px] mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-900">
                            Confira todos os imóveis da Yallah
                        </h2>
                        <p className="text-gray-600 max-w-2xl">
                            Nossa coleção completa de propriedades premium em localizações estratégicas com excelente custo-benefício
                        </p>
                    </div>
                    <Link href="/imoveis" className="hidden md:flex items-center text-[#8BADA4] hover:text-[#6d8a84] font-medium">
                        Ver catálogo completo <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>

                {/* Container dos slides com controles de navegação */}
                <div className="relative">
                    {/* Botão Anterior */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 w-12 h-12 rounded-full bg-[#8BADA4] shadow-lg flex items-center justify-center hover:bg-[#7A9D94] transition-colors"
                        aria-label="Slide anterior"
                    >
                        <CaretLeft className="w-6 h-6 text-white" />
                    </button>

                    {/* Container dos cards com transição suave */}
                    <div className="overflow-hidden">
                        <div
                            className="transition-transform duration-300 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            <div className="flex">
                                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                                    <div key={`slide-${slideIndex}`} className="w-full flex-none">
                                        <div className="grid grid-rows-2 gap-6">
                                            <div className="grid grid-cols-5 gap-4">
                                                {allProperties
                                                    .slice(slideIndex * itemsPerPage, slideIndex * itemsPerPage + 5)
                                                    .map((property) => (
                                                        <div
                                                            key={property.id}
                                                            className={`group relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1
                                                              ${expandedCard === property.id ? 'opacity-0 pointer-events-none' : 'z-10'}`}
                                                            onClick={() => expandCard(property.id)}
                                                            style={{ borderRadius: '1.5rem' }}
                                                        >
                                                            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden">
                                                                <Image
                                                                    src={getValidImage((property as any).images, property.image)}
                                                                    alt={property.title}
                                                                    fill
                                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                                                />

                                                                {/* Overlay com gradiente */}
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                                                                {/* Botão de favoritos */}
                                                                <div className="absolute top-4 right-4 z-10">
                                                                    <FavoriteButton propertyId={property.id} />
                                                                </div>

                                                                {/* Badge com preço */}
                                                                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-full shadow-md text-sm font-medium text-black">
                                                                    {formatCurrency(property.pricePerNight)}/noite
                                                                </div>

                                                                {/* Conteúdo do card */}
                                                                <div className="absolute bottom-0 left-0 w-full p-4">
                                                                    {/* Localização */}
                                                                    <div className="text-white/80 text-sm mb-1">{property.location}</div>

                                                                    {/* Título */}
                                                                    <h3 className="text-base md:text-lg text-white font-bold mb-1 line-clamp-2">
                                                                        {property.title}
                                                                    </h3>

                                                                    {/* Características */}
                                                                    <div className="flex gap-4 items-center text-white/80 mt-2">
                                                                        {property.features ? (
                                                                            <div className="flex items-center w-full">
                                                                                <p className="text-white/80 text-sm">
                                                                                    {property.features}
                                                                                </p>
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-sm">Acomodações disponíveis mediante consulta</span>
                                                                        )}
                                                                    </div>

                                                                    {/* Avaliações */}
                                                                    <div className="flex items-center mb-2">
                                                                        <Star className="w-4 h-4 text-yellow-400 mr-1" weight="fill" />
                                                                        <span className="text-white text-sm font-medium">
                                                                            {typeof property.rating === 'object' && property.rating !== null
                                                                                ? property.rating.value
                                                                                : property.rating} <span className="text-white/70">({property.reviewCount})</span>
                                                                        </span>
                                                                    </div>

                                                                    {/* Botão de ação */}
                                                                    <button
                                                                        className="w-full flex items-center justify-center gap-2 bg-white text-black px-4 py-2 rounded-full hover:bg-[#8BADA4] hover:text-white transition-colors duration-300 text-sm"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            expandCard(property.id);
                                                                        }}
                                                                    >
                                                                        Ver detalhes
                                                                        <ArrowRight className="w-4 h-4" weight="bold" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                            <div className="grid grid-cols-5 gap-4">
                                                {allProperties
                                                    .slice(slideIndex * itemsPerPage + 5, slideIndex * itemsPerPage + 10)
                                                    .map((property) => (
                                                        <div
                                                            key={property.id}
                                                            className={`group relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1
                                                                  ${expandedCard === property.id ? 'opacity-0 pointer-events-none' : 'z-10'}`}
                                                            onClick={() => expandCard(property.id)}
                                                            style={{ borderRadius: '1.5rem' }}
                                                        >
                                                            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden">
                                                                <Image
                                                                    src={getValidImage((property as any).images, property.image)}
                                                                    alt={property.title}
                                                                    fill
                                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                                                />

                                                                {/* Overlay com gradiente */}
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                                                                {/* Botão de favoritos */}
                                                                <div className="absolute top-4 right-4 z-10">
                                                                    <FavoriteButton propertyId={property.id} />
                                                                </div>

                                                                {/* Badge com preço */}
                                                                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-full shadow-md text-sm font-medium text-black">
                                                                    {formatCurrency(property.pricePerNight)}/noite
                                                                </div>

                                                                {/* Conteúdo do card */}
                                                                <div className="absolute bottom-0 left-0 w-full p-4">
                                                                    {/* Localização */}
                                                                    <div className="text-white/80 text-sm mb-1">{property.location}</div>

                                                                    {/* Título */}
                                                                    <h3 className="text-base md:text-lg text-white font-bold mb-1 line-clamp-2">
                                                                        {property.title}
                                                                    </h3>

                                                                    {/* Características */}
                                                                    <div className="flex gap-4 items-center text-white/80 mt-2">
                                                                        {property.features ? (
                                                                            <div className="flex items-center w-full">
                                                                                <p className="text-white/80 text-sm">
                                                                                    {property.features}
                                                                                </p>
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-sm">Acomodações disponíveis mediante consulta</span>
                                                                        )}
                                                                    </div>

                                                                    {/* Avaliações */}
                                                                    <div className="flex items-center mb-2">
                                                                        <Star className="w-4 h-4 text-yellow-400 mr-1" weight="fill" />
                                                                        <span className="text-white text-sm font-medium">
                                                                            {typeof property.rating === 'object' && property.rating !== null
                                                                                ? property.rating.value
                                                                                : property.rating} <span className="text-white/70">({property.reviewCount})</span>
                                                                        </span>
                                                                    </div>

                                                                    {/* Botão de ação */}
                                                                    <button
                                                                        className="w-full py-3 px-4 bg-[#8BADA4] hover:bg-[#7A9D94] text-white font-medium rounded-full transition-colors flex items-center justify-center gap-2 text-sm whitespace-nowrap" onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            expandCard(property.id);
                                                                        }}>
                                                                        Consultar disponibilidade <ArrowRight weight="bold" className="min-w-4 min-h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Botão Próximo */}
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 w-12 h-12 rounded-full bg-[#8BADA4] shadow-lg flex items-center justify-center hover:bg-[#7A9D94] transition-colors"
                        aria-label="Próximo slide"
                    >
                        <CaretRight className="w-6 h-6 text-white" />
                    </button>

                    {/* Dots de navegação */}
                    <div className="flex justify-center items-center gap-2 mt-6">
                        {Array.from({ length: totalSlides }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === index
                                    ? 'bg-[#8BADA4] w-4'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                aria-label={`Ir para slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Botão móvel */}
                <div className="flex md:hidden justify-center mt-4">
                    <Link
                        href="/imoveis"
                        className="flex items-center justify-center gap-2 bg-[#8BADA4] text-white px-6 py-3 rounded-full hover:bg-[#6d8a84] transition-colors duration-300 w-full sm:w-auto"
                    >
                        Ver catálogo completo
                        <ArrowRight className="w-5 h-5" weight="bold" />
                    </Link>
                </div>

                {/* Card Expandido Overlay */}
                {expandedCard !== null && (
                    <div
                        className={`fixed inset-0 overlay-backdrop bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-8
                                  ${isTransitioning && !isClosing ? 'animate-fade-in' : ''}
                                  ${isClosing ? 'animate-fade-out' : ''}`}
                        onClick={closeExpandedCard}
                    >
                        {allProperties.filter(p => p.id === expandedCard).map(property => (
                            <div
                                key={`expanded-${property.id}`}
                                className={`bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl rounded-scroll-container
                                          ${isTransitioning && !isClosing ? 'animate-scale-in' : ''}
                                          ${isClosing ? 'animate-scale-out' : ''}`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Galeria de Imagens */}
                                <div className="grid grid-cols-12 gap-2 p-2">
                                    {/* Imagem principal (maior) */}
                                    <div className="col-span-6 relative h-[300px] rounded-l-xl overflow-hidden">
                                        <Image
                                            src={getValidImage((property as any).images, property.image, 0)}
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
                                                src={getValidImage((property as any).images, property.image, 1)}
                                                alt={property.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Duas imagens inferiores */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="relative h-[146px] overflow-hidden">
                                                <Image
                                                    src={getValidImage((property as any).images, property.image, 2)}
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
                                                        <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50" aria-label="Adicionar aos favoritos">
                                                            <Heart className="w-5 h-5 text-gray-700" weight="regular" />
                                                        </button>
                                                        <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50" aria-label="Compartilhar">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="stroke-gray-600">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Informações básicas */}
                                                <div className="flex gap-4 items-center text-gray-700 mt-2">
                                                    {property.features ? (
                                                        <div className="flex items-center w-full">
                                                            <p className="text-gray-700 text-sm">
                                                                {property.features}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm">Acomodações disponíveis mediante consulta</span>
                                                    )}
                                                </div>

                                                {/* Categorias/Tags */}
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {(property as PropertyCard).type && (
                                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">{(property as PropertyCard).type}</span>
                                                    )}
                                                    {property.details && property.details !== (property as any).description && (
                                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">{property.details}</span>
                                                    )}
                                                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">{formatLocationForPublic(property.location ?? "")}, São Paulo</span>
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
                                                                Este charmoso imóvel localizado em {formatLocationForPublic(property.location ?? "")} oferece um ambiente aconchegante e moderno.
                                                                Com {property.features.split('·').join(', ')}, o espaço é perfeito para uma estadia confortável.
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
                                                    <div className="space-y-2">
                                                        {/* Remover o grid de fotos antigo e implementar o novo grid */}
                                                        <div className="grid grid-cols-4 gap-2">
                                                            {/* Primeira foto (maior) */}
                                                            {property.images && property.images.length > 0 && (
                                                                <div
                                                                    className="relative overflow-hidden rounded-lg col-span-2 row-span-2 cursor-pointer group"
                                                                    onClick={() => {
                                                                        openFullGallery(property as PropertyCard);
                                                                        setCurrentGalleryIndex(0);
                                                                    }}
                                                                >
                                                                    <div className="aspect-square">
                                                                        <Image
                                                                            src={getValidImage(property.images, property.image)}
                                                                            alt={`${property.title} - Imagem 1`}
                                                                            fill
                                                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 40vw"
                                                                        />
                                                                    </div>
                                                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                                </div>
                                                            )}

                                                            {/* Fotos 2-7 (menores) + botão na última célula */}
                                                            {property.images && (
                                                                Array.from({ length: Math.min(6, property.images.length - 1) }).map((_, index, arr) => {
                                                                    // Se for a última célula do grid, renderiza o botão no lugar da última foto
                                                                    const isLast = index === arr.length - 1;
                                                                    if (isLast) {
                                                                        return (
                                                                            <div
                                                                                key={`photo-grid-btn`}
                                                                                className="relative overflow-hidden rounded-lg cursor-pointer group"
                                                                                onClick={() => openFullGallery(property as PropertyCard)}
                                                                            >
                                                                                <div className="aspect-square bg-[#8BADA4] flex items-center justify-center p-4 hover:bg-[#7A9D94] transition-colors">
                                                                                    <div className="text-center text-white">
                                                                                        <svg className="w-8 h-8 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                                        </svg>
                                                                                        <span className="font-medium text-sm">Ver todas as fotos</span>
                                                                                        <div className="mt-2 text-xs">
                                                                                            {property.images && property.images.length > 0
                                                                                                ? `${property.images.length} fotos disponíveis`
                                                                                                : '1 foto disponível'}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                    // Renderiza as miniaturas normalmente
                                                                    return (
                                                                        <div
                                                                            key={`photo-grid-${index + 1}`}
                                                                            className="relative overflow-hidden rounded-lg cursor-pointer group"
                                                                            onClick={() => {
                                                                                openFullGallery(property as PropertyCard);
                                                                                setCurrentGalleryIndex(index + 1);
                                                                            }}
                                                                        >
                                                                            <div className="aspect-square">
                                                                                <Image
                                                                                    src={getValidImage(property.images, property.image, index + 1)}
                                                                                    alt={`${property.title} - Imagem ${index + 2}`}
                                                                                    fill
                                                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                                                                                />
                                                                            </div>
                                                                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                                        </div>
                                                                    );
                                                                })
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Conteúdo do que oferecemos */}
                                            {activeTab === 'oferecemos' && (
                                                <div>
                                                    <h3 className="text-xl font-semibold mb-3 text-[#8BADA4]">O que oferecemos</h3>
                                                    <p className="text-gray-700 mb-4">
                                                        {(property as any).whatWeOffer || `Nosso imóvel em ${formatLocationForPublic(property.location ?? "")} oferece as seguintes comodidades:`}
                                                    </p>
                                                    {(() => {
                                                        if (!property.amenities || property.amenities.length === 0) return null;

                                                        // Filtra apenas categorias com pelo menos uma comodidade selecionada
                                                        const visibleCategories = AMENITIES_BY_CATEGORY
                                                            .map(({ category, items }) => {
                                                                const amenitiesInCategory = items.filter((amenity: string) => (property.amenities ?? []).includes(amenity));
                                                                return amenitiesInCategory.length > 0 ? { category, amenitiesInCategory } : null;
                                                            })
                                                            .filter(Boolean) as { category: string; amenitiesInCategory: string[] }[];

                                                        // Divide ao meio para duas colunas equilibradas
                                                        const mid = Math.ceil(visibleCategories.length / 2);
                                                        const col1 = visibleCategories.slice(0, mid);
                                                        const col2 = visibleCategories.slice(mid);

                                                        return (
                                                            <div className="mb-4">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    {[col1, col2].map((col, idx) => (
                                                                        <div key={idx}>
                                                                            {col.map(({ category, amenitiesInCategory }) => (
                                                                                <div key={category} className="mb-3">
                                                                                    <div className="font-semibold text-base text-[#8BADA4] mb-2 uppercase tracking-wide">{category}</div>
                                                                                    <ul className="space-y-3">
                                                                                        {amenitiesInCategory.map((amenity) => (
                                                                                            <li key={amenity}>
                                                                                                <div className="flex items-center space-x-2">
                                                                                                    {getAmenityIcon(amenity)}
                                                                                                    <span className="text-gray-700">{amenity}</span>
                                                                                                </div>
                                                                                            </li>
                                                                                        ))}
                                                                                    </ul>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            )}

                                            {/* Conteúdo do que você deve saber */}
                                            {activeTab === 'saber' && (
                                                <div>
                                                    <h3 className="text-xl font-semibold mb-4 text-[#8BADA4]">O que você deve saber</h3>

                                                    {/* Exibe o conteúdo do editor rico se existir */}
                                                    {(property as any).whatYouShouldKnowRichText && (
                                                        <div
                                                            className="text-gray-700 mb-6 prose prose-sm max-w-none"
                                                            dangerouslySetInnerHTML={{ __html: (property as any).whatYouShouldKnowRichText }}
                                                        />
                                                    )}

                                                    {/* Seções dinâmicas (toggles) */}
                                                    <div className="space-y-6">
                                                        {/* Regras da Casa */}
                                                        {((property as any).whatYouShouldKnowSections?.house_rules?.length > 0 ||  // Acessar com snake_case
                                                            (property as any).houseRules?.checkIn ||
                                                            (property as any).houseRules?.checkOut) && (
                                                                <div className="mb-6">
                                                                    <h4 className="font-semibold text-base text-gray-800 mb-3 uppercase tracking-wide">Regras da casa</h4>
                                                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                                                        {/* Check-in e Check-out do objeto principal houseRules */}
                                                                        {(property as any).houseRules?.checkIn && (
                                                                            <li className="flex items-center space-x-2 text-gray-700">
                                                                                <Clock className="h-5 w-5 text-[#8BADA4] flex-shrink-0" />
                                                                                <span>Check-in: A partir das {(property as any).houseRules.checkIn}</span>
                                                                            </li>
                                                                        )}
                                                                        {(property as any).houseRules?.checkOut && (
                                                                            <li className="flex items-center space-x-2 text-gray-700">
                                                                                <Clock className="h-5 w-5 text-[#8BADA4] flex-shrink-0" />
                                                                                <span>Check-out: Até {(property as any).houseRules.checkOut}</span>
                                                                            </li>
                                                                        )}
                                                                        {/* Itens de whatYouShouldKnowSections.house_rules */}
                                                                        {(property as any).whatYouShouldKnowSections?.house_rules?.map((rule: string, index: number) => ( // Acessar com snake_case
                                                                            <li key={`house-rule-${index}`} className="flex items-center space-x-2 text-gray-700">
                                                                                <CheckCircle className="h-5 w-5 text-[#8BADA4] flex-shrink-0" />
                                                                                <span>{rule.replace("{time}", "").replace("{guests}", "").replace("{hours}", "")}</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}

                                                        {/* Segurança e Propriedade */}
                                                        {(property as any).whatYouShouldKnowSections?.safety_property?.length > 0 && (
                                                            <div className="mb-6">
                                                                <h4 className="font-semibold text-base text-gray-800 mb-3 uppercase tracking-wide">Segurança e propriedade</h4>
                                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                                                    {(property as any).whatYouShouldKnowSections.safety_property.map((item: string, index: number) => ( // Acessar com snake_case
                                                                        <li key={`safety-${index}`} className="flex items-center space-x-2 text-gray-700">
                                                                            <Shield className="h-5 w-5 text-[#8BADA4] flex-shrink-0" />
                                                                            <span>{item}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {/* Política de Cancelamento */}
                                                        {((property as any).whatYouShouldKnowSections?.cancellation_policy?.length > 0 || (property as any).cancellationPolicy) && ( // Acessar com snake_case
                                                            <div className="mb-6">
                                                                <h4 className="font-semibold text-base text-gray-800 mb-3 uppercase tracking-wide">Política de Cancelamento</h4>
                                                                {(property as any).whatYouShouldKnowSections?.cancellation_policy?.length > 0 ? ( // Acessar com snake_case
                                                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                                                        {(property as any).whatYouShouldKnowSections.cancellation_policy.map((policy: string, index: number) => ( // Acessar com snake_case
                                                                            <li key={`cancel-policy-${index}`} className="flex items-center space-x-2 text-gray-700">
                                                                                <Calendar className="h-5 w-5 text-[#8BADA4] flex-shrink-0" />
                                                                                <span>{policy}</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                ) : (
                                                                    (property as any).cancellationPolicy && (
                                                                        <p className="text-gray-700">
                                                                            {(property as any).cancellationPolicy}
                                                                        </p>
                                                                    )
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
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
                                                            <p className="font-medium text-gray-800">O local exato é fornecido depois da reserva.</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-gray-700">
                                                        <p className="mb-3">
                                                            Este imóvel está localizado em uma área privilegiada de {formatLocationForPublic(property.location ?? "")}, oferecendo fácil acesso a:
                                                        </p>
                                                        {(property.pointsOfInterest && property.pointsOfInterest.length > 0) ? (
                                                            <ul className="list-disc pl-5 space-y-1">
                                                                {property.pointsOfInterest.map((poi, index) => (
                                                                    <li key={`poi-${index}`}>{poi}</li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <ul className="list-disc pl-5 space-y-1">
                                                                <li>Transporte público a 200m</li>
                                                                <li>Restaurantes e cafés a 5 minutos a pé</li>
                                                                <li>Supermercados e farmácias próximos</li>
                                                                <li>Parques e áreas de lazer nas redondezas</li>
                                                            </ul>
                                                        )}
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
                                                            <span className="text-sm text-gray-700">{typeof property.rating === 'object' && property.rating !== null ? property.rating.value : property.rating} ({property.reviewCount} avaliações)</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-500">Preço para 3 noites</p>
                                                        <div className="font-medium text-gray-900">{formatCurrency(property.pricePerNight * 3)}</div>
                                                        {(property as any).discountAmount && (
                                                            <div className="text-green-600 text-sm">-{formatCurrency((property as any).discountAmount)}</div>
                                                        )}
                                                        {(property as any).serviceFee && (
                                                            <div className="text-sm text-gray-500">Taxa de serviço: {formatCurrency((property as any).serviceFee)}</div>
                                                        )}
                                                        <div className="font-bold mt-1 text-gray-900">
                                                            Total: {formatCurrency(property.pricePerNight * 3 - ((property as any).discountAmount || 0) + ((property as any).serviceFee || 0))}
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
                                                                updateDateRange(update);
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
                                                                <div className="flex items-center justify-between cursor-pointer">
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
                                                <button className="w-full py-3 px-4 bg-[#8BADA4] hover:bg-[#7A9D94] text-white font-medium rounded-full transition-colors flex items-center justify-center gap-2 text-sm whitespace-nowrap" onClick={() => handleAvailabilityConsultation(property)}>
                                                    Consultar disponibilidade <ArrowRight weight="bold" className="min-w-4 min-h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de galeria em tela cheia */}
            {showFullGallery && selectedProperty && (
                <div
                    className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center"
                    onClick={closeFullGallery}
                    role="dialog"
                    aria-modal="true"
                    data-no-native-controls="true"
                    tabIndex={-1}
                >
                    {/* Cabeçalho com título e informações */}
                    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/70 to-transparent">
                        <div className="flex flex-col">
                            <h3 className="text-xl font-medium text-white">{selectedProperty?.title}</h3>
                            <p className="text-white/80 text-sm">
                                {formatLocationForPublic(selectedProperty?.location || "São Paulo")}
                            </p>
                        </div>

                        {/* Botão de fechar redesenhado com efeito glassmorphism */}
                        <button
                            className="p-3 rounded-full backdrop-blur-lg bg-white/10 hover:bg-white/20 text-white shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none"
                            onClick={(e) => {
                                e.stopPropagation();
                                closeFullGallery();
                            }}
                            aria-label="Fechar galeria"
                        >
                            <X weight="bold" className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Imagem atual com animação de slide */}
                    <div
                        className="relative w-full h-full flex items-center justify-center overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className={`relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-in-out ${slideDirection === 'next' ? 'animate-slide-out-left' :
                                slideDirection === 'prev' ? 'animate-slide-out-right' : ''
                                }`}
                        >
                            {selectedProperty?.images && selectedProperty.images.length > 0 ? (
                                <Image
                                    src={selectedProperty.images[currentGalleryIndex]}
                                    alt={`${selectedProperty.title} - Imagem ${currentGalleryIndex + 1}`}
                                    fill
                                    className="object-contain"
                                    sizes="100vw"
                                />
                            ) : (
                                <Image
                                    src={selectedProperty?.image || ''}
                                    alt={selectedProperty?.title || 'Imagem do imóvel'}
                                    fill
                                    className="object-contain"
                                    sizes="100vw"
                                />
                            )}
                        </div>

                        {/* Removendo as setas laterais que aparecem nas extremidades */}
                    </div>

                    {/* Controles de navegação na parte inferior */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent">
                        {/* Miniaturas para rápida navegação */}
                        <div className="px-4 pt-4 pb-2 overflow-x-auto hide-scrollbar">
                            <div className="flex space-x-2 justify-center">
                                {selectedProperty?.images && selectedProperty.images.length > 1 && selectedProperty.images.map((img, idx) => (
                                    <div
                                        key={`thumb-${idx}`}
                                        className={`relative h-16 w-24 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${currentGalleryIndex === idx
                                            ? 'border-2 border-white opacity-100 scale-105'
                                            : 'opacity-60 hover:opacity-90'
                                            }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentGalleryIndex(idx);
                                        }}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Miniatura ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Barra de navegação estilo Apple Photos */}
                        <div className="flex justify-center py-4 px-8">
                            <div className="flex rounded-full bg-black/50 backdrop-blur-sm p-1">
                                <button
                                    className={`px-6 py-2 rounded-full text-white text-sm font-medium transition-colors ${currentGalleryIndex > 0 ? 'hover:bg-white/20' : 'opacity-50 cursor-not-allowed'
                                        }`}
                                    disabled={currentGalleryIndex === 0 || isAnimating}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prevImage(e);
                                    }}
                                >
                                    Anterior
                                </button>

                                <div className="px-4 py-2 text-white text-sm flex items-center">
                                    <span>{currentGalleryIndex + 1}</span>
                                    <span className="mx-1">/</span>
                                    <span>{selectedProperty?.images?.length || 1}</span>
                                </div>

                                <button
                                    className={`px-6 py-2 rounded-full text-white text-sm font-medium transition-colors ${selectedProperty?.images && currentGalleryIndex < selectedProperty.images.length - 1
                                        ? 'hover:bg-white/20'
                                        : 'opacity-50 cursor-not-allowed'
                                        }`}
                                    disabled={!selectedProperty?.images || currentGalleryIndex >= selectedProperty.images.length - 1 || isAnimating}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextImage(e);
                                    }}
                                >
                                    Próxima
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* CSS para esconder scrollbar mas manter funcionalidade e adicionar animações de slide */}
                    <style jsx global>{`
                        .hide-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                        .hide-scrollbar {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                        /* Esconder controles de navegação nativos do navegador */
                        body:has(.fixed.inset-0.z-\\[60\\].bg-black) .fixed.inset-y-0:not(.z-\\[60\\]) {
                            display: none !important;
                        }
                        /* Esconder setas de navegação laterais */
                        @media (min-width: 640px) {
                            .fixed.inset-0.z-\\[60\\].bg-black > button.absolute:not(.top-0):not(.bottom-0) {
                                opacity: 0 !important;
                                pointer-events: none !important;
                            }
                        }
                        /* Animações de slide */
                        @keyframes slide-out-left {
                            0% { transform: translateX(0); opacity: 1; }
                            100% { transform: translateX(-10%); opacity: 0; }
                        }
                        @keyframes slide-out-right {
                            0% { transform: translateX(0); opacity: 1; }
                            100% { transform: translateX(10%); opacity: 0; }
                        }
                        @keyframes slide-in-left {
                            0% { transform: translateX(10%); opacity: 0; }
                            100% { transform: translateX(0); opacity: 1; }
                        }
                        @keyframes slide-in-right {
                            0% { transform: translateX(-10%); opacity: 0; }
                            100% { transform: translateX(0); opacity: 1; }
                        }
                        .animate-slide-out-left {
                            animation: slide-out-left 300ms ease-in-out forwards;
                        }
                        .animate-slide-out-right {
                            animation: slide-out-right 300ms ease-in-out forwards;
                        }
                        .animate-slide-in-left {
                            animation: slide-in-left 300ms ease-in-out forwards;
                        }
                        .animate-slide-in-right {
                            animation: slide-in-right 300ms ease-in-out forwards;
                        }
                    `}</style>
                </div>
            )}
        </div>
    )
} 