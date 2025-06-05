'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import {
    ArrowRight, CaretLeft, CaretRight, Star, Buildings, MapPin, Lock, Waves, CookingPot,
    WifiHigh, Desktop, Television, Dog, House, Lightning, Fire, Calendar as CalendarIcon, CaretDown, X, CheckCircle, Heart, Users, Bed, Bathtub, Barbell, Car, Snowflake
} from '@phosphor-icons/react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import DatePicker from 'react-datepicker'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import "react-datepicker/dist/react-datepicker.css"
import { formatCurrency } from '@/utils/format'
import { useProperties } from '@/hooks/useProperties'
import { Property } from '@/data/sampleProperties'

// Importação dinâmica do componente de mapa para evitar erros de SSR
const MapComponent = dynamic(() => import('../MapComponent'), { ssr: false })

// Define a type for the property data - Aligning with AllProperties.tsx's PropertyCard
// This interface will now be named PropertyCard to match AllProperties.tsx for clarity.
interface PropertyCard { // Renamed from PropertyCardDisplayData
    id: string; // Was number | string in AllProperties, using string from Property
    title: string;
    location: string; // From AllProperties.PropertyCard
    details?: string; // From AllProperties.PropertyCard (e.g. "Espaço inteiro: apartamento")
    features: string; // From AllProperties.PropertyCard (e.g. "2 hóspedes · Estúdio · 1 cama · 1 banheiro")
    pricePerNight: number; // From AllProperties.PropertyCard
    rating: { value: number; count: number }; // From AllProperties.PropertyCard
    image: string; // Main image for card, from AllProperties.PropertyCard
    link?: string; // From AllProperties.PropertyCard
    host?: string; // From AllProperties.PropertyCard
    coordinates?: [number, number] | { lat: number; lng: number } | null; // AllProperties uses [lng, lat] for mapbox
    description?: string; // From AllProperties.PropertyCard
    whatWeOffer?: string; // From AllProperties.PropertyCard - often a text summary of amenities
    whatYouShouldKnow?: string; // From AllProperties.PropertyCard (legacy or simple text)
    whatYouShouldKnowRichText?: string; // From AllProperties.PropertyCard
    serviceFee?: number; // From AllProperties.PropertyCard
    discountSettings?: { // From AllProperties.PropertyCard
        amount: number;
        type: 'percentage' | 'fixed';
        minNights: number; // ছিল AllProperties-এ
        validFrom: string; // ISO string, was Date in Property, needs parsing
        validTo: string;   // ISO string, was Date in Property, needs parsing
    };
    type?: string; // From AllProperties.PropertyCard (e.g., "Apartamento", "Casa")
    images?: string[]; // From AllProperties.PropertyCard (gallery images)
    rooms?: number;      // From AllProperties.PropertyCard ( quartos)
    bathrooms?: number;  // From AllProperties.PropertyCard (banheiros)
    beds?: number;       // From AllProperties.PropertyCard (camas)
    guests?: number;     // From AllProperties.PropertyCard (hóspedes)
    amenities?: string[]; // From AllProperties.PropertyCard (list of amenity strings)
    houseRules?: Property['houseRules']; // Match Property type from Firebase
    safety?: Property['safety'];         // Match Property type from Firebase
    whatYouShouldKnowSections?: Property['whatYouShouldKnowSections']; // Match Property type
    pointsOfInterest?: string[]; // From AllProperties.PropertyCard
    // Fields from original Property type that might not be in AllProperties.PropertyCard but useful for internal logic or full data
    category?: string; // From Property
    area?: number; // From Property
    status?: 'available' | 'rented' | 'maintenance'; // From Property
    featured?: boolean; // From Property
    categorizedAmenities?: Property['categorizedAmenities']; // From Property
    cancellationPolicy?: string; // From Property
    sourceUrl?: Property['sourceUrl']; // From Property
    whatYouShouldKnowDynamic?: Property['whatYouShouldKnowDynamic']; // From Property
}

// Componente para o botão de favorito
const FavoriteButton = ({ propertyId, className = "" }: { propertyId: string, className?: string }) => {
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

        let favorites: string[] = [];
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
            onClick={toggleFavorite}
            className={`bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300 ${className}`}
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

// Dados de exemplo para o carrossel de destaques
// const featuredDeals = [
//     {
//         id: "1",
//         title: "Apartamentos Premium",
//         subtitle: "Exclusivo Para Você!",
//         discount: "20",
//         validPeriod: "Válido apenas de 1 à 15 Mai 2024",
//         image: "/recomendado1.jpg",
//     },
//     {
//         id: "2",
//         title: "Explore Moema e Arredores",
//         subtitle: "Nossa Melhor Oferta!",
//         discount: "15",
//         validPeriod: "Válido apenas de 10 à 25 Mai 2024",
//         image: "/recomendado2.jpg",
//     },
//     {
//         id: "3",
//         title: "Studios em Pinheiros",
//         subtitle: "Estadia Prolongada!",
//         discount: "25",
//         validPeriod: "Válido apenas para estadias +30 dias",
//         image: "/recomendado3.jpg",
//     }
// ]

export default function FeaturedProperties() {
    // const [currentDealIndex, setCurrentDealIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<PropertyCard | null>(null);
    const [checkInDate, setCheckInDate] = useState<Date | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
    const [showFullGallery, setShowFullGallery] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const [consultationMessage, setConsultationMessage] = useState('');
    const [activeModalTab, setActiveModalTab] = useState('descricao');

    const {
        properties: featuredFirebaseProperties,
        loading: featuredLoading,
        error: featuredError,
    } = useProperties({ filters: { featured: true }, limit: 3, sortBy: 'title', sortDirection: 'asc' });

    // Map Firebase Property to PropertyCard (new name for PropertyCardDisplayData)
    // This mapping is crucial for the modal.
    const gridProperties: PropertyCard[] = React.useMemo(() => {
        if (!featuredFirebaseProperties) return [];
        return featuredFirebaseProperties.map((prop: Property): PropertyCard => {
            // Helper to format features string, similar to AllProperties if it has one
            const formatFeaturesString = (p: Property) => {
                const parts = [];
                if (p.guests) parts.push(`${p.guests} hóspedes`);
                if (p.bedrooms) parts.push(`${p.bedrooms} ${p.bedrooms > 1 ? 'quartos' : 'quarto'}`);
                if (p.beds) parts.push(`${p.beds} ${p.beds > 1 ? 'camas' : 'cama'}`);
                if (p.bathrooms) parts.push(`${p.bathrooms} ${p.bathrooms > 1 ? 'banheiros' : 'banheiro'}`);
                return parts.join(' · ') || 'Detalhes não especificados';
            };

            return {
                id: prop.id,
                title: prop.title,
                location: prop.location, // Directly from Property
                details: `${prop.type || 'Imóvel'} em ${prop.location.split(',')[0]}`, // Example detail string
                features: formatFeaturesString(prop), // Use helper for consistent feature string
                pricePerNight: prop.price,
                rating: prop.rating || { value: 0, count: 0 },
                image: prop.images && prop.images.length > 0 ? prop.images[0] : '/placeholder-image.jpg',
                link: `/imoveis/${prop.id}`, // Example link
                coordinates: prop.coordinates, //Lng, Lat from Property
                description: prop.description,
                whatWeOffer: prop.whatWeOffer, // Usually a text summary of amenities
                whatYouShouldKnow: prop.whatYouShouldKnow,
                whatYouShouldKnowRichText: prop.whatYouShouldKnowRichText,
                serviceFee: prop.serviceFee,
                discountSettings: prop.discountSettings ? {
                    ...prop.discountSettings,
                    // Ensure validFrom and validTo are ISO strings if Date objects in Property
                    validFrom: prop.discountSettings.validFrom instanceof Date ? prop.discountSettings.validFrom.toISOString() : String(prop.discountSettings.validFrom),
                    validTo: prop.discountSettings.validTo instanceof Date ? prop.discountSettings.validTo.toISOString() : String(prop.discountSettings.validTo),
                    minNights: prop.discountSettings.minNights ?? 0, // Default minNights if undefined
                } : undefined,
                type: prop.type,
                images: prop.images,
                rooms: prop.bedrooms, // Map bedrooms to rooms
                bathrooms: prop.bathrooms,
                beds: prop.beds,
                guests: prop.guests,
                amenities: prop.amenities,
                houseRules: prop.houseRules,
                safety: prop.safety,
                whatYouShouldKnowSections: prop.whatYouShouldKnowSections,
                pointsOfInterest: prop.pointsOfInterest,
                // Pass through other fields from Property if they were part of the original PropertyCardDisplayData/PropertyCard definition
                category: prop.category,
                area: prop.area,
                status: prop.status,
                featured: prop.featured,
                categorizedAmenities: prop.categorizedAmenities,
                cancellationPolicy: prop.cancellationPolicy,
                sourceUrl: prop.sourceUrl,
                whatYouShouldKnowDynamic: prop.whatYouShouldKnowDynamic,
            };
        });
    }, [featuredFirebaseProperties]);

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

    useEffect(() => {
        if (isExpanded || showFullGallery) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isExpanded, showFullGallery]);

    const handleEscKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            if (showFullGallery) {
                closeFullGallery();
            } else if (isExpanded) {
                // Cast event.target to HTMLElement to check classList
                const targetElement = event.target as HTMLElement;
                // Check if the event target is not an input or textarea within the modal
                if (!targetElement.matches('input, textarea, [contenteditable="true"]')) {
                    closeExpandedCard(event as unknown as React.MouseEvent);
                }
            }
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isExpanded, showFullGallery]);

    const expandCard = (propertyId: string) => {
        const propertyToExpand = gridProperties.find(p => p.id === propertyId);
        if (propertyToExpand) {
            setSelectedProperty(propertyToExpand);
            setIsExpanded(true);
            setCheckInDate(null);
            setCheckOutDate(null);
            setConsultationMessage('');
            setActiveModalTab('descricao');
        } else {
            console.warn(`Property with id ${propertyId} not found in gridProperties.`);
        }
    };

    const closeExpandedCard = (e: React.MouseEvent | KeyboardEvent) => {
        // Check if the event is a mouse event and if the click is on the backdrop
        if (e.type === 'click') {
            const clickTarget = e.target as HTMLElement;
            if (!clickTarget.classList.contains('modal-backdrop-custom')) {
                // If the click is not on the backdrop, don't close if it's inside the modal content
                if (clickTarget.closest('.modal-content-custom')) {
                    return;
                }
            }
        }
        // For ESC key or backdrop click
        setIsExpanded(false);
        setSelectedProperty(null);
        setCheckInDate(null);
        setCheckOutDate(null);
        setConsultationMessage('');
    };

    const openFullGallery = () => {
        if (selectedProperty && selectedProperty.images && selectedProperty.images.length > 0) {
            setCurrentImageIndex(0);
            setShowFullGallery(true);
        }
    };

    const closeFullGallery = () => {
        setShowFullGallery(false);
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedProperty && selectedProperty.images) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedProperty.images!.length);
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedProperty && selectedProperty.images) {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedProperty.images!.length) % selectedProperty.images!.length);
        }
    };

    const calculateNights = (checkIn: Date | null, checkOut: Date | null): number => {
        if (!checkIn || !checkOut) return 0;
        const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const handleAvailabilityConsultation = (property: PropertyCard | null) => {
        if (!property || !checkInDate || !checkOutDate) {
            setConsultationMessage('Por favor, selecione as datas de check-in e check-out.');
            return;
        }
        const nights = calculateNights(checkInDate, checkOutDate);
        setConsultationMessage(
            `Consulta para ${property.title} de ${format(checkInDate, 'dd/MM/yyyy', { locale: ptBR })} a ${format(checkOutDate, 'dd/MM/yyyy', { locale: ptBR })} (${nights} noites). Entraremos em contato.`
        );
        // console.log('Consultation data:', { propertyId: property.id, checkInDate, checkOutDate, nights });
        // Here you would typically send data to a backend or an email service.
    };

    // Helper from AllProperties.tsx (if needed for modal, e.g. discount calculation)
    const calculateActualDiscount = (basePrice: number, discountSettings?: PropertyCard['discountSettings']): number => {
        if (!discountSettings || !discountSettings.validFrom || !discountSettings.validTo) return 0;

        const now = new Date();
        // Parse ISO strings from discountSettings to Date objects for comparison
        const validFrom = parseISO(discountSettings.validFrom);
        const validTo = parseISO(discountSettings.validTo);

        if (now < validFrom || now > validTo) return 0;

        if (discountSettings.minNights && checkInDate && checkOutDate) {
            const nights = calculateNights(checkInDate, checkOutDate);
            if (nights < discountSettings.minNights) return 0;
        } else if (discountSettings.minNights && (!checkInDate || !checkOutDate)) {
            return 0;
        }

        if (discountSettings.type === 'percentage') {
            return basePrice * (discountSettings.amount / 100);
        } else if (discountSettings.type === 'fixed') {
            return discountSettings.amount;
        }
        return 0;
    };

    // Copied from AllProperties.tsx (around line 576) - getAmenityIcon
    const getAmenityIcon = (amenity: string): JSX.Element => {
        const lowerAmenity = amenity.toLowerCase();
        // Prioritize specific keywords
        if (lowerAmenity.includes('wifi') || lowerAmenity.includes('wi-fi')) return <WifiHigh size={20} className="text-gray-700 mr-2 flex-shrink-0" />;
        if (lowerAmenity.includes('cozinha')) return <CookingPot size={20} className="text-gray-700 mr-2 flex-shrink-0" />;
        if (lowerAmenity.includes('tv') || lowerAmenity.includes('televisão')) return <Television size={20} className="text-gray-700 mr-2 flex-shrink-0" />;
        if (lowerAmenity.includes('ar condicionado') || lowerAmenity.includes('ac')) return <Snowflake size={20} className="text-gray-700 mr-2 flex-shrink-0" />;
        if (lowerAmenity.includes('estacionamento')) return <Car size={20} className="text-gray-700 mr-2 flex-shrink-0" />;
        if (lowerAmenity.includes('piscina')) return <Waves size={20} className="text-gray-700 mr-2 flex-shrink-0" />;
        if (lowerAmenity.includes('academia')) return <Buildings size={20} className="text-gray-700 mr-2 flex-shrink-0" />;
        if (lowerAmenity.includes('jacuzzi') || lowerAmenity.includes('banheira de hidromassagem')) return <Bathtub size={20} className="text-gray-700 mr-2 flex-shrink-0" />;
        if (lowerAmenity.includes('lareira')) return <Fire size={20} className="text-gray-700 mr-2 flex-shrink-0" />;
        if (lowerAmenity.includes('churrasqueira')) return <Fire size={20} className="text-gray-700 mr-2 flex-shrink-0" />; // Placeholder, could be more specific
        if (lowerAmenity.includes('escrivaninha') || lowerAmenity.includes('espaço de trabalho')) return <Desktop size={20} className="text-gray-700 mr-2 flex-shrink-0" />;
        if (lowerAmenity.includes('pet') || lowerAmenity.includes('animal')) return <Dog size={20} className="text-gray-700 mr-2 flex-shrink-0" />;

        // Default icon
        return <CheckCircle size={16} weight="fill" className="text-[#8BADA4] mr-2 flex-shrink-0" />;
    };

    // Copied from AllProperties.tsx (around line 504) - formatLocationForPublic
    const formatLocationForPublic = (fullAddress: string | undefined): string => {
        if (!fullAddress) return 'Localização não fornecida';

        // Remove país e CEP se existirem
        let address = fullAddress.replace(/,?\s*Brasil/i, '').replace(/,?\s*\d{5}-\d{3}/, '');

        const parts = address.split(',').map(part => part.trim());

        // Prioritize "Bairro - Cidade" if available
        const neighborhoodCityPattern = parts.find(part => part.includes(' - '));
        if (neighborhoodCityPattern) return neighborhoodCityPattern;

        // Attempt to return "Bairro, Cidade" or just "Cidade"
        if (parts.length >= 2) {
            // Heuristic: if the second to last part is short, it might be a state abbreviation, take 3 parts
            if (parts[parts.length - 2].length <= 3 && parts.length >= 3) {
                return `${parts[parts.length - 3]}, ${parts[parts.length - 1]}`; // Bairro, Cidade (pulando estado)
            }
            return `${parts[parts.length - 2]}, ${parts[parts.length - 1]}`; // Bairro, Cidade
        }
        if (parts.length === 1 && parts[0]) return parts[0]; // Apenas Cidade ou Bairro

        // Fallback if parsing is difficult
        const words = address.split(' ').map(w => w.trim()).filter(Boolean);
        if (words.length > 0) return words.slice(-2).join(', '); // Last two words as a fallback

        return 'Localização detalhada após reserva'; // Final fallback
    };

    return (
        <>
            <GlobalStyle />
            <div className="w-full mx-auto">
                {/* Hero Section Start REMOVED FROM HERE */}
                {/* <Hero /> */}
                {/* Hero Section End */}

                {/* Grid de imóveis dinâmico REMOVED */}
                {/* <div className="text-center mt-8 mb-4">
                    <h2 className="text-3xl font-bold text-gray-800">Imóveis em Destaque para Você</h2>
                    <p className="text-gray-600">Descubra acomodações incríveis selecionadas especialmente.</p>
                </div>

                {featuredLoading && (
                    <div className="text-center py-10">
                        <p className="text-lg text-gray-500">Carregando imóveis em destaque...</p>
                    </div>
                )}

                {featuredError && (
                    <div className="text-center py-10 text-red-500">
                        <p>Erro ao carregar os imóveis. Tente novamente mais tarde.</p>
                    </div>
                )}

                {!featuredLoading && !featuredError && gridProperties.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-lg text-gray-500">Nenhum imóvel em destaque no momento.</p>
                    </div>
                )}

                {!featuredLoading && !featuredError && gridProperties.length > 0 && (
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-8 max-w-7xl mx-auto mb-12 ${isExpanded ? 'filter blur-sm' : ''}`}>
                        {gridProperties.map((property, index) => (
                            <div
                                key={property.id}
                                className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col cursor-pointer ${index === 2 ? 'md:col-span-2' : ''}`}
                                onClick={() => expandCard(property.id)}
                            >
                                <div className="relative h-64 md:h-72 w-full group">
                                    <Image
                                        src={property.image || '/placeholder-image.jpg'}
                                        alt={property.title}
                                        layout="fill"
                                        objectFit="cover"
                                        className="transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <FavoriteButton propertyId={property.id} className="bg-white/80 hover:bg-white" />
                                    </div>
                                    <div className="absolute bottom-3 left-3 bg-black/50 text-white px-3 py-1 rounded-md text-xs backdrop-blur-sm">
                                        {property.type || 'Imóvel'}
                                    </div>
                                    {property.rating && property.rating.value > 0 && (
                                        <div className="absolute top-3 left-3 bg-yellow-400 text-black px-2 py-1 rounded-md text-xs font-semibold flex items-center">
                                            <Star size={14} weight="fill" className="mr-1" />
                                            {property.rating.value.toFixed(1)} ({property.rating.count})
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-1 truncate" title={property.title}>
                                        {property.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-2 truncate" title={property.details}>
                                        {property.details}
                                    </p>
                                    <p className="text-xs text-gray-500 mb-3 flex-grow line-clamp-2" title={property.features}>
                                        {property.features}
                                    </p>
                                    <div className="flex justify-between items-center mt-auto">
                                        <p className="text-lg font-bold text-[#8BADA4]">
                                            {formatCurrency(property.pricePerNight)} <span className="text-sm font-normal text-gray-500">/noite</span>
                                        </p>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); expandCard(property.id); }}
                                            className="text-sm font-medium text-[#8BADA4] hover:text-[#7A9A8D] flex items-center transition-colors"
                                        >
                                            Ver detalhes <ArrowRight size={16} className="ml-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )} */}

                {/* Modal de Detalhes do Imóvel (Card Expandido) */}
                {isExpanded && selectedProperty && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto modal-backdrop-custom"
                        onClick={closeExpandedCard}
                    >
                        <div
                            className="bg-white rounded-xl shadow-2xl w-full max-w-5xl mx-auto my-8 overflow-hidden relative max-h-[95vh] flex flex-col modal-content-custom"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button - Copied from AllProperties style */}
                            <button
                                onClick={closeExpandedCard}
                                className="absolute top-3 right-3 md:top-4 md:right-4 z-[60] p-2 bg-white/80 hover:bg-white rounded-full text-gray-600 hover:text-gray-900 transition-all shadow-md"
                                aria-label="Fechar detalhes do imóvel"
                            >
                                <X size={20} weight="bold" />
                            </button>

                            {/* Full Screen Image Gallery (from AllProperties.tsx) */}
                            {showFullGallery && selectedProperty.images && selectedProperty.images.length > 0 && (
                                <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center" onClick={(e) => { e.stopPropagation(); closeFullGallery(); }}>
                                    <button onClick={(e) => { e.stopPropagation(); closeFullGallery(); }} className="absolute top-5 right-5 text-white p-3 rounded-full bg-black/60 hover:bg-black/80 z-[110] transition-opacity">
                                        <X size={28} weight="bold" />
                                    </button>
                                    {selectedProperty.images.length > 1 && (
                                        <>
                                            <button onClick={(e) => { e.stopPropagation(); prevImage(e); }} className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 text-white p-3 md:p-4 rounded-full bg-black/50 hover:bg-black/70 z-[110] transition-transform hover:scale-105">
                                                <CaretLeft size={28} weight="bold" />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); nextImage(e); }} className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 text-white p-3 md:p-4 rounded-full bg-black/50 hover:bg-black/70 z-[110] transition-transform hover:scale-105">
                                                <CaretRight size={28} weight="bold" />
                                            </button>
                                        </>
                                    )}
                                    <div className="relative w-full h-full flex items-center justify-center p-5 md:p-10">
                                        <Image
                                            src={selectedProperty.images[currentImageIndex]}
                                            alt={`Imagem ${currentImageIndex + 1} de ${selectedProperty.title}`}
                                            layout="intrinsic"
                                            width={1600}
                                            height={900}
                                            objectFit="contain"
                                            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    {selectedProperty.images.length > 1 && (
                                        <p className="absolute bottom-5 text-white text-base bg-black/60 px-3 py-1 rounded-full shadow-lg">
                                            {currentImageIndex + 1} / {selectedProperty.images.length}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Main Modal Content Scrollable Area */}
                            <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 scrollbar-thumb-rounded-full">

                                {/* Image Grid Header (from AllProperties.tsx) */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5 md:gap-1 max-h-[400px] md:max-h-[500px] overflow-hidden bg-gray-200">
                                    {selectedProperty.images && selectedProperty.images.slice(0, 5).map((img, idx) => (
                                        <div
                                            key={idx}
                                            className={`relative cursor-pointer group overflow-hidden 
                                            ${idx === 0 ? 'md:col-span-2 md:row-span-2 h-full min-h-[200px] md:min-h-[300px]' : 'h-[100px] md:h-full'}`}
                                            onClick={() => { setCurrentImageIndex(idx); setShowFullGallery(true); }}
                                        >
                                            <Image src={img} alt={`${selectedProperty.title} - imagem ${idx + 1}`} layout="fill" objectFit="cover" className="group-hover:scale-105 transition-transform duration-300" />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                                            {idx === 4 && selectedProperty.images && selectedProperty.images.length > 5 && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                                    <p className="text-white text-xl font-semibold">+{selectedProperty.images.length - 5} mais</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {(!selectedProperty.images || selectedProperty.images.length === 0) && (
                                        <div className="md:col-span-2 md:row-span-2 h-full min-h-[200px] md:min-h-[300px] bg-gray-200 flex items-center justify-center">
                                            <House size={64} className="text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Content Area (Below Images) */}
                                <div className="p-5 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                                    {/* Left Column (Details) */}
                                    <div className="md:col-span-2 space-y-6">
                                        {/* Header: Title, Location, Rating, Actions */}
                                        <div>
                                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">{selectedProperty.title}</h1>
                                            <div className="flex flex-wrap items-center text-sm text-gray-600 gap-x-3 gap-y-1 mb-3">
                                                {selectedProperty.rating && selectedProperty.rating.value > 0 && (
                                                    <span className="flex items-center">
                                                        <Star weight="fill" className="text-yellow-500 mr-1" size={18} />
                                                        {selectedProperty.rating.value.toFixed(1)} ({selectedProperty.rating.count} avaliações)
                                                    </span>
                                                )}
                                                {/* Use formatLocationForPublic for display consistency */}
                                                <span className="flex items-center"><MapPin size={18} className="mr-1 text-gray-500" /> {formatLocationForPublic(selectedProperty.location)}</span>
                                                {selectedProperty.type && <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{selectedProperty.type}</span>}
                                            </div>
                                            {/* Action buttons like Favorite, Share can be added here if needed */}
                                        </div>

                                        {/* Property Details: Guests, Rooms, Beds, Bathrooms */}
                                        <div className="border-t border-b border-gray-200 py-4">
                                            <h2 className="text-xl font-semibold text-gray-800 mb-3">Detalhes do Imóvel</h2>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-700">
                                                <div className="flex items-center"><Users size={20} className="text-[#8BADA4] mr-2" /> {selectedProperty.guests || 'N/A'} Hóspedes</div>
                                                <div className="flex items-center"><Bed size={20} className="text-[#8BADA4] mr-2" /> {selectedProperty.rooms || 'N/A'} Quartos</div>
                                                <div className="flex items-center"><Bed size={20} className="text-[#8BADA4] mr-2" /> {selectedProperty.beds || 'N/A'} Camas</div> {/* Assuming Bed icon for beds */}
                                                <div className="flex items-center"><Bathtub size={20} className="text-[#8BADA4] mr-2" /> {selectedProperty.bathrooms || 'N/A'} Banheiros</div>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {selectedProperty.description && (
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-800 mb-2">Sobre este espaço</h2>
                                                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{selectedProperty.description}</p>
                                            </div>
                                        )}

                                        {/* Amenities (O que oferecemos) */}
                                        {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-800 mb-3">O que este lugar oferece</h2>
                                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700">
                                                    {selectedProperty.amenities.slice(0, 10).map(amenity => ( // Show up to 10
                                                        <li key={amenity} className="flex items-center">
                                                            {getAmenityIcon(amenity)}
                                                            {amenity}
                                                        </li>
                                                    ))}
                                                </ul>
                                                {/* Could add a "Show all amenities" button if many */}
                                            </div>
                                        )}

                                        {/* What you should know (Rich Text or Sections) */}
                                        {(selectedProperty.whatYouShouldKnowRichText || selectedProperty.whatYouShouldKnowSections) && (
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-800 mb-3">O que você deve saber</h2>
                                                {selectedProperty.whatYouShouldKnowRichText ? (
                                                    <div
                                                        className="prose prose-sm max-w-none text-gray-700 link-styling"
                                                        dangerouslySetInnerHTML={{ __html: selectedProperty.whatYouShouldKnowRichText }}
                                                    />
                                                ) : (
                                                    <div className="space-y-3 text-sm text-gray-700">
                                                        {selectedProperty.whatYouShouldKnowSections?.houseRules && selectedProperty.whatYouShouldKnowSections.houseRules.length > 0 && (
                                                            <div>
                                                                <h3 className="font-semibold text-gray-700 mb-1">Regras da Casa:</h3>
                                                                <ul className="list-disc list-inside pl-1 space-y-0.5">
                                                                    {selectedProperty.whatYouShouldKnowSections.houseRules.map((rule, i) => <li key={`hr-${i}`}>{rule}</li>)}
                                                                </ul>
                                                            </div>
                                                        )}
                                                        {selectedProperty.whatYouShouldKnowSections?.safetyProperty && selectedProperty.whatYouShouldKnowSections.safetyProperty.length > 0 && (
                                                            <div>
                                                                <h3 className="font-semibold text-gray-700 mb-1">Segurança e Propriedade:</h3>
                                                                <ul className="list-disc list-inside pl-1 space-y-0.5">
                                                                    {selectedProperty.whatYouShouldKnowSections.safetyProperty.map((item, i) => <li key={`sp-${i}`}>{item}</li>)}
                                                                </ul>
                                                            </div>
                                                        )}
                                                        {selectedProperty.whatYouShouldKnowSections?.cancellationPolicy && selectedProperty.whatYouShouldKnowSections.cancellationPolicy.length > 0 && (
                                                            <div>
                                                                <h3 className="font-semibold text-gray-700 mb-1">Política de Cancelamento:</h3>
                                                                <ul className="list-disc list-inside pl-1 space-y-0.5">
                                                                    {selectedProperty.whatYouShouldKnowSections.cancellationPolicy.map((policy, i) => <li key={`cp-${i}`}>{policy}</li>)}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Map */}
                                        {selectedProperty.coordinates && (
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-800 mb-3">Onde você vai estar</h2>
                                                {selectedProperty.location && <p className="text-sm text-gray-600 mb-3">{formatLocationForPublic(selectedProperty.location)}</p>}
                                                <div className="h-72 md:h-80 rounded-xl overflow-hidden shadow-md">
                                                    <MapComponent
                                                        center={
                                                            typeof selectedProperty.coordinates === 'object' && selectedProperty.coordinates && 'lat' in selectedProperty.coordinates && 'lng' in selectedProperty.coordinates
                                                                ? [selectedProperty.coordinates.lng, selectedProperty.coordinates.lat]
                                                                : (Array.isArray(selectedProperty.coordinates)
                                                                    ? [selectedProperty.coordinates[0], selectedProperty.coordinates[1]]
                                                                    : [-46.633308, -23.55052])
                                                        }
                                                        zoom={15}
                                                        showMarker={true}
                                                        useCustomMarker={true}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Column (Booking Card) */}
                                    <div className="md:col-span-1">
                                        <div className="sticky top-5 bg-white border border-gray-200 p-5 rounded-xl shadow-lg space-y-4">
                                            <div className="flex justify-between items-baseline">
                                                <div>
                                                    <span className="text-2xl font-bold text-gray-800">{formatCurrency(selectedProperty.pricePerNight)}</span>
                                                    <span className="text-sm text-gray-600"> / noite</span>
                                                </div>
                                                {selectedProperty.rating && selectedProperty.rating.value > 0 && (
                                                    <span className="text-sm flex items-center">
                                                        <Star weight="fill" size={16} className="text-yellow-500 mr-1" />
                                                        {selectedProperty.rating.value.toFixed(1)} ({selectedProperty.rating.count})
                                                    </span>
                                                )}
                                            </div>

                                            {/* Date Pickers */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="relative">
                                                    <DatePicker
                                                        selected={checkInDate}
                                                        onChange={(date) => setCheckInDate(date)}
                                                        selectsStart
                                                        startDate={checkInDate}
                                                        endDate={checkOutDate}
                                                        minDate={new Date()}
                                                        placeholderText="Check-in"
                                                        locale={ptBR}
                                                        dateFormat="dd/MM/yy"
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BADA4] focus:border-[#8BADA4] transition-shadow text-sm"
                                                        popperPlacement="bottom-start"
                                                    />
                                                    <CalendarIcon size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                </div>
                                                <div className="relative">
                                                    <DatePicker
                                                        selected={checkOutDate}
                                                        onChange={(date) => setCheckOutDate(date)}
                                                        selectsEnd
                                                        startDate={checkInDate}
                                                        endDate={checkOutDate}
                                                        minDate={checkInDate ? new Date(new Date(checkInDate).setDate(checkInDate.getDate() + 1)) : new Date(new Date().setDate(new Date().getDate() + 1))}
                                                        placeholderText="Check-out"
                                                        locale={ptBR}
                                                        dateFormat="dd/MM/yy"
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BADA4] focus:border-[#8BADA4] transition-shadow text-sm"
                                                        disabled={!checkInDate}
                                                        popperPlacement="bottom-start"
                                                    />
                                                    <CalendarIcon size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                </div>
                                            </div>

                                            {/* Price Calculation (if dates selected) */}
                                            {checkInDate && checkOutDate && (
                                                <div className="text-sm text-gray-700 space-y-1 border-t pt-3">
                                                    <div className="flex justify-between">
                                                        <span>{formatCurrency(selectedProperty.pricePerNight)} x {calculateNights(checkInDate, checkOutDate)} noites</span>
                                                        <span>{formatCurrency(selectedProperty.pricePerNight * calculateNights(checkInDate, checkOutDate))}</span>
                                                    </div>
                                                    {selectedProperty.serviceFee && selectedProperty.serviceFee > 0 && (
                                                        <div className="flex justify-between">
                                                            <span>Taxa de serviço</span>
                                                            <span>{formatCurrency(selectedProperty.serviceFee)}</span>
                                                        </div>
                                                    )}
                                                    {/* Discount Calculation */}
                                                    {selectedProperty.discountSettings && calculateActualDiscount(selectedProperty.pricePerNight * calculateNights(checkInDate, checkOutDate), selectedProperty.discountSettings) > 0 && (
                                                        <div className="flex justify-between text-green-600">
                                                            <span>Desconto aplicado</span>
                                                            <span>-{formatCurrency(calculateActualDiscount(selectedProperty.pricePerNight * calculateNights(checkInDate, checkOutDate), selectedProperty.discountSettings))}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                                                        <span>Total</span>
                                                        <span>
                                                            {formatCurrency(
                                                                (selectedProperty.pricePerNight * calculateNights(checkInDate, checkOutDate)) +
                                                                (selectedProperty.serviceFee || 0) -
                                                                (selectedProperty.discountSettings ? calculateActualDiscount(selectedProperty.pricePerNight * calculateNights(checkInDate, checkOutDate), selectedProperty.discountSettings) : 0)
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            <button
                                                onClick={() => handleAvailabilityConsultation(selectedProperty)}
                                                disabled={!checkInDate || !checkOutDate}
                                                className="w-full bg-[#8BADA4] hover:bg-[#7A9A8D] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                            >
                                                Consultar disponibilidade <ArrowRight size={18} className="ml-2" />
                                            </button>
                                            {consultationMessage && <p className="text-xs text-center text-gray-600">{consultationMessage}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

const GlobalStyle = () => (
    <style jsx global>{`
        .link-styling a {
            color: #8BADA4;
            text-decoration: underline;
        }
        .link-styling a:hover {
            color: #7A9A8D;
        }
        .modal-backdrop-custom {}
        .modal-content-custom {}

        .scrollbar-thin::-webkit-scrollbar {
            width: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: #a1a1a1;
        }
    `}</style>
);
