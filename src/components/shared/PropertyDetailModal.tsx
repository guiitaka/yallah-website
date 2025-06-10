'use client'

import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
    CaretLeft, CaretRight, Buildings, MapPin, Lock, Waves, CookingPot,
    WifiHigh, Desktop, Television, Dog, House, Lightning, Fire, Calendar as CalendarIcon, CaretDown,
    Clock, X, Snowflake, Users, Bed, ArrowRight, Star, Heart, CheckCircle,
    Shield, Calendar, Bathtub, Car, ImageSquare
} from '@phosphor-icons/react'; // Ensure all necessary icons are here
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ptBR } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';
import { Property } from '@/data/sampleProperties'; // Using the main Property type
import { formatCurrency } from '@/utils/format';

// Importação dinâmica do componente de mapa para evitar erros de SSR
const MapComponent = dynamic(() => import('../MapComponent'), { ssr: false });

// Define a type for the property data structure - This should be compatible with Property from Firebase
// For now, we'll assume it expects a structure similar to the 'Property' type.
// If AllProperties.tsx's modal used a more specific 'PropertyCard', we might need to adjust this or the incoming prop.
// Let's use the main 'Property' type from '@/data/sampleProperties' for maximum detail.

interface PropertyDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    property: Property | null; // Use the main Property type
}

// Helper functions that were part of AllProperties.tsx and are specific to the modal

const calculateNights = (checkIn: Date | null, checkOut: Date | null): number => {
    if (!checkIn || !checkOut) return 0; // Return 0 if dates are not set, booking card can show default text
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
};

const calculateActualDiscount = (
    basePrice: number,
    nights: number,
    discountSettings?: Property['discountSettings']
): number => {
    if (!discountSettings || discountSettings.amount <= 0 || nights === 0) {
        return 0;
    }
    // Ensure dates from discountSettings are parsed correctly
    const now = new Date();
    const validFrom = discountSettings.validFrom ? parseISO(String(discountSettings.validFrom)) : null;
    const validTo = discountSettings.validTo ? parseISO(String(discountSettings.validTo)) : null;

    if (validFrom && validTo) {
        if (now < validFrom || now > validTo) return 0; // Discount not active
    }

    if (discountSettings.minNights && nights < discountSettings.minNights) {
        return 0; // Minimum nights not met
    }

    if (discountSettings.type === 'percentage') {
        return (basePrice * nights * discountSettings.amount) / 100;
    }
    // If 'fixed', it's a fixed amount off the total for the stay, or per night depending on original logic
    // Assuming 'fixed' means fixed amount off the total for the period of minNights
    // This part might need refinement based on exact business logic for fixed discounts
    return discountSettings.amount; // Or discountSettings.amount * nights if it's per night
};


const formatLocationForPublic = (fullAddress?: string): string => {
    if (!fullAddress) return 'Localização não fornecida';
    let address = fullAddress.replace(/,?\\s*Brasil/i, '').replace(/,?\\s*\\d{5}-\\d{3}/, '');
    const parts = address.split(',').map(part => part.trim());
    const neighborhoodCityPattern = parts.find(part => part.includes(' - '));
    if (neighborhoodCityPattern) return neighborhoodCityPattern;
    if (parts.length >= 2) {
        if (parts[parts.length - 2].length <= 3 && parts.length >= 3) {
            return `${parts[parts.length - 3]}, ${parts[parts.length - 1]}`;
        }
        return `${parts[parts.length - 2]}, ${parts[parts.length - 1]}`;
    }
    if (parts.length === 1 && parts[0]) return parts[0];
    const words = address.split(' ').map(w => w.trim()).filter(Boolean);
    if (words.length > 0) return words.slice(-2).join(', ');
    return 'Localização detalhada após reserva';
};

const getAmenityIcon = (amenity: string): JSX.Element => {
    const text = amenity.toLowerCase();
    // This mapping should be identical to the one from AllProperties.tsx
    if (text.includes('wi-fi') || text.includes('internet') || text.includes('wifi')) return <WifiHigh className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('tv') || text.includes('televisão')) return <Television className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('cozinha')) return <CookingPot className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('estacionamento')) return <Car className="w-5 h-5 text-[#8BADA4]" />; // Changed from Waves
    if (text.includes('piscina')) return <Waves className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('ar-condicionado') || text.includes('ac')) return <Snowflake className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('aquecimento')) return <Fire className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('café') || text.includes('cafeteira')) return <CookingPot className="w-5 h-5 text-[#8BADA4]" />; // Coffee icon might not exist, used CookingPot
    if (text.includes('ventilador')) return <Desktop className="w-5 h-5 text-[#8BADA4]" />; // Matched AllProperties.tsx
    if (text.includes('água quente') || text.includes('água')) return <Waves className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('segurança') || text.includes('alarme')) return <Lock className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('varanda') || text.includes('terraço') || text.includes('quintal')) return <House className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('jardim')) return <House className="w-5 h-5 text-[#8BADA4]" />; // Placeholder, could be Flower icon
    if (text.includes('churrasqueira')) return <Fire className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('academia')) return <Buildings className="w-5 h-5 text-[#8BADA4]" />; // Using Buildings as Barbell isn't standard
    if (text.includes('banheiro')) return <Bathtub className="w-5 h-5 text-[#8BADA4]" />; // Changed from Bed
    if (text.includes('quarto')) return <Bed className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('roupa de cama') || text.includes('roupa')) return <Bed className="w-5 h-5 text-[#8BADA4]" />; // Placeholder
    if (text.includes('chuveiro') || text.includes('ducha')) return <Bathtub className="w-5 h-5 text-[#8BADA4]" />; // Changed from Waves
    if (text.includes('talheres') || text.includes('louça')) return <CookingPot className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('geladeira') || text.includes('refrigerador')) return <CookingPot className="w-5 h-5 text-[#8BADA4]" />; // Placeholder, could be Cube
    if (text.includes('microondas')) return <CookingPot className="w-5 h-5 text-[#8BADA4]" />; // Placeholder
    if (text.includes('sofá') || text.includes('sala')) return <House className="w-5 h-5 text-[#8BADA4]" />; // Placeholder, could be Armchair
    if (text.includes('ferro') || text.includes('passar')) return <Lightning className="w-5 h-5 text-[#8BADA4]" />; // Placeholder
    if (text.includes('cabos') || text.includes('plugue') || text.includes('eletricidade')) return <Lightning className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('bicicleta')) return <House className="w-5 h-5 text-[#8BADA4]" />; // Placeholder, could be Bicycle
    if (text.includes('detector') || text.includes('alarme') || text.includes('monóxido')) return <Lock className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('pet') || text.includes('animais') || text.includes('cachorro')) return <Dog className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('lâmpada') || text.includes('iluminação')) return <Lightning className="w-5 h-5 text-[#8BADA4]" />; // Placeholder, Lightbulb
    if (text.includes('secador')) return <Lightning className="w-5 h-5 text-[#8BADA4]" />; // Placeholder, Wind
    if (text.includes('xampu') || text.includes('shampoo') || text.includes('sabonete')) return <Bathtub className="w-5 h-5 text-[#8BADA4]" />; // Placeholder
    if (text.includes('vista') || text.includes('montanha')) return <House className="w-5 h-5 text-[#8BADA4]" />; // Placeholder, Mountains
    if (text.includes('cobertor') || text.includes('travesseiro')) return <Bed className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('blackout') || text.includes('cortina')) return <House className="w-5 h-5 text-[#8BADA4]" />; // Placeholder
    if (text.includes('guarda-roupa') || text.includes('armário')) return <House className="w-5 h-5 text-[#8BADA4]" />; // Placeholder
    if (text.includes('bluetooth') || text.includes('som')) return <Lightning className="w-5 h-5 text-[#8BADA4]" />; // Placeholder, SpeakerHigh
    return <CheckCircle className="w-5 h-5 text-[#8BADA4]" />;
};

// Define as categorias e suas comodidades para segmentação - This should be identical to AllProperties.tsx
const AMENITIES_BY_CATEGORY = [
    { category: 'Cozinha', items: ['Cafeteira', 'Cozinha', 'Microondas', 'Louças e talheres', 'Frigobar', 'Fogão por indução'] },
    { category: 'Banheiro', items: ['Shampoo', 'Condicionador', 'Sabonete para o corpo', 'Água quente', 'Básico (Toalhas, lençóis, sabonete e papel higiênico)'] },
    { category: 'Quarto', items: ['Cabides', 'Local para guardar as roupas: guarda-roupa', 'Roupas de cama', 'Cobertores e travesseiros extras', 'Blackout nas cortinas'] },
    { category: 'Sala', items: ['TV', 'Wi-Fi', 'Pátio ou varanda (Privativa)', 'Cadeira espreguiçadeira', 'Espaço de trabalho exclusivo'] },
    { category: 'Segurança', items: ['Detector de fumaça', 'Alarme de monóxido de carbono', 'Extintor de incêndio', 'Kit de primeiros socorros'] },
    { category: 'Outros', items: ['Produtos de limpeza', 'Secadora', 'Máquina de lavar', 'Móveis externos', 'Estacionamento gratuito na rua', 'Elevador', 'Academia compartilhada (no prédio)', 'Estacionamento pago fora da propriedade', 'Ar-condicionado', 'Ar-condicionado central', 'Aquecimento central'] },
];


export default function PropertyDetailModal({ isOpen, onClose, property }: PropertyDetailModalProps) {
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [startDate, endDate] = dateRange;
    const [consultationMessage, setConsultationMessage] = useState('');
    const [activeTab, setActiveTab] = useState('descricao');
    const [showFullGallery, setShowFullGallery] = useState(false);
    const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [slideDirection, setSlideDirection] = useState<'next' | 'prev' | null>(null);

    const modalContentRef = useRef<HTMLDivElement>(null);

    // Reset state when property changes or modal opens/closes
    useEffect(() => {
        if (isOpen && property) {
            setDateRange([null, null]);
            setConsultationMessage('');
            setActiveTab('descricao');
            setCurrentGalleryIndex(0);
        }
        if (!isOpen) {
            setShowFullGallery(false); // Ensure gallery closes if modal is closed
        }
    }, [isOpen, property]);

    // Bloquear o scroll do body quando o modal ou a galeria estiverem abertos
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = ''; // Cleanup on unmount
        };
    }, [isOpen]);


    const handleEscKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            if (showFullGallery) {
                closeFullGalleryModal();
            } else if (isOpen) {
                onClose();
            }
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isOpen, showFullGallery, onClose]); // Dependencies for re-subscribing


    const handleAvailabilityConsultation = () => {
        if (!property || !startDate || !endDate) {
            setConsultationMessage('Por favor, selecione as datas de check-in e check-out.');
            return;
        }
        const nights = calculateNights(startDate, endDate);
        setConsultationMessage(
            `Obrigado! Recebemos sua consulta para ${property.title} de ${format(startDate, 'dd/MM/yyyy', { locale: ptBR })} a ${format(endDate, 'dd/MM/yyyy', { locale: ptBR })} (${nights} noites). Entraremos em contato em breve.`
        );
        // setTimeout(() => setDateRange([null, null]), 5000); // Optionally clear dates
    };

    const openFullGalleryModal = (index: number) => {
        if (property?.images && property.images.length > 0) {
            setCurrentGalleryIndex(index);
            setShowFullGallery(true);
        }
    };

    const closeFullGalleryModal = () => {
        setShowFullGallery(false);
    };

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!property?.images || isAnimating) return;
        setIsAnimating(true);
        setSlideDirection('next');
        setTimeout(() => {
            setCurrentGalleryIndex(prev => (prev === (property.images?.length || 0) - 1 ? 0 : prev + 1));
            setTimeout(() => { setIsAnimating(false); setSlideDirection(null); }, 50);
        }, 300);
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!property?.images || isAnimating) return;
        setIsAnimating(true);
        setSlideDirection('prev');
        setTimeout(() => {
            setCurrentGalleryIndex(prev => (prev === 0 ? (property.images?.length || 1) - 1 : prev - 1));
            setTimeout(() => { setIsAnimating(false); setSlideDirection(null); }, 50);
        }, 300);
    };

    // Add keyboard navigation for full gallery
    useEffect(() => {
        const handleGalleryKeyDown = (event: KeyboardEvent) => {
            if (showFullGallery && property?.images) {
                if (event.key === 'ArrowLeft') prevImage();
                else if (event.key === 'ArrowRight') nextImage();
            }
        };
        if (showFullGallery) {
            document.addEventListener('keydown', handleGalleryKeyDown);
        }
        return () => {
            if (showFullGallery) { // Important: only remove if it was added
                document.removeEventListener('keydown', handleGalleryKeyDown);
            }
        };
    }, [showFullGallery, property?.images, currentGalleryIndex, isAnimating]); // Added dependencies


    if (!isOpen || !property) {
        return null;
    }

    // Prepare data for display, using values from 'property' (which is of Type 'Property')
    const displayImages = property.images || [];
    const mainImage = displayImages.length > 0 ? displayImages[0] : '/placeholder-image.jpg';
    const propertyType = property.type || "Imóvel";
    const numNights = calculateNights(startDate, endDate);
    const pricePerNightForCalc = property.price || 0;
    const subtotal = pricePerNightForCalc * numNights;
    const discountAmount = calculateActualDiscount(pricePerNightForCalc, numNights, property.discountSettings);
    const totalServiceFee = property.serviceFee || 0;
    const totalAmount = subtotal - discountAmount + totalServiceFee;

    const getCenterCoordinates = (): [number, number] | undefined => {
        if (!property?.coordinates) return undefined;
        if (Array.isArray(property.coordinates) && typeof property.coordinates[0] === 'number' && typeof property.coordinates[1] === 'number') {
            return [property.coordinates[0], property.coordinates[1]];
        }
        if (typeof property.coordinates === 'object' && 'lat' in property.coordinates && 'lng' in property.coordinates) {
            const coords = property.coordinates as { lat: number; lng: number };
            return [coords.lng, coords.lat];
        }
        return undefined;
    };

    const center = getCenterCoordinates();

    // JSX for the modal - This should be the exact structure from AllProperties.tsx's modal
    // This is a simplified representation and needs to be replaced with the full JSX from AllProperties.tsx
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-0 md:p-4">
            <div
                ref={modalContentRef}
                className="bg-white w-full h-full max-w-none md:max-w-4xl lg:max-w-6xl rounded-none md:rounded-2xl shadow-2xl flex flex-col relative overflow-hidden"
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-30 p-2 bg-white/80 rounded-full hover:bg-white transition-all shadow-md"
                >
                    <X className="w-5 h-5 text-gray-700" />
                </button>

                {/* Content area that scrolls */}
                <div className="flex-1 overflow-y-auto">
                    {/* Image Grid */}
                    <div className="grid grid-cols-2 grid-rows-2 md:grid-cols-4 md:grid-rows-2 gap-2 p-2 h-[400px] md:h-auto md:max-h-[50vh]">
                        {/* Image 1 (Main on desktop) */}
                        <div
                            className="col-span-1 row-span-1 md:col-span-2 md:row-span-2 rounded-xl overflow-hidden cursor-pointer relative group"
                            onClick={() => openFullGalleryModal(0)}
                        >
                            <Image
                                src={property.images?.[0] || '/placeholder.jpg'}
                                alt={property.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                priority
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                        </div>

                        {/* Image 2 */}
                        <div
                            className="col-span-1 row-span-1 rounded-xl overflow-hidden cursor-pointer relative group"
                            onClick={() => openFullGalleryModal(1)}
                        >
                            <Image
                                src={property.images?.[1] || '/placeholder.jpg'}
                                alt={`${property.title} - imagem 2`}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                        </div>

                        {/* Image 3 */}
                        <div
                            className="col-span-1 row-span-1 rounded-xl overflow-hidden cursor-pointer relative group"
                            onClick={() => openFullGalleryModal(2)}
                        >
                            <Image
                                src={property.images?.[2] || '/placeholder.jpg'}
                                alt={`${property.title} - imagem 3`}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                        </div>

                        {/* Image 4 (mobile) or Map (desktop) */}
                        <div className="col-span-1 row-span-1 rounded-xl overflow-hidden relative group">
                            {/* Mobile View: 4th Image */}
                            <div className="block md:hidden h-full w-full cursor-pointer" onClick={() => openFullGalleryModal(3)}>
                                <Image
                                    src={property.images?.[3] || '/placeholder.jpg'}
                                    alt={`${property.title} - imagem 4`}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                            </div>

                            {/* Desktop View: Map or 4th Image */}
                            <div className="hidden md:block h-full w-full">
                                {center ? (
                                    <MapComponent
                                        center={center}
                                        zoom={14}
                                        showMarker={true}
                                    />
                                ) : (
                                    <div className="h-full w-full cursor-pointer" onClick={() => openFullGalleryModal(3)}>
                                        <Image
                                            src={property.images?.[3] || '/placeholder.jpg'}
                                            alt={`${property.title} - imagem 4`}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Body */}
                    <div className="p-4 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Left Column */}
                            <div className="col-span-12 md:col-span-7">
                                {/* Header */}
                                <div className="mb-6">
                                    <div className="mb-2 inline-flex items-center text-green-600 gap-1">
                                        {property.featured && <><span className="inline-block w-3 h-3 rounded-full bg-green-500"></span><span className="text-sm font-medium">Destaque</span></>}
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <h2 id="property-detail-title" className="text-2xl md:text-3xl font-bold text-gray-900">{property.title}</h2>
                                        {/* Favorite/Share buttons can be added here if they were in AllProperties modal */}
                                    </div>
                                    <p className="text-gray-700 text-sm mt-2">
                                        {property.guests || 'N/A'} hóspedes · {property.bedrooms || 'N/A'} {property.bedrooms === 1 ? "quarto" : "quartos"} · {property.beds || 'N/A'} {property.beds === 1 ? "cama" : "camas"} · {property.bathrooms || 'N/A'} {property.bathrooms === 1 ? "banheiro" : "banheiros"}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {propertyType && <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">{propertyType}</span>}
                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">{formatLocationForPublic(property.location)}</span>
                                    </div>
                                </div>

                                {/* Tabs Navigation */}
                                <div className="border-b border-gray-200 mb-4">
                                    <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide">
                                        {['descricao', 'fotos', 'oferecemos', 'saber', 'localizacao'].map(tab => (
                                            <button
                                                key={tab}
                                                className={`py-2 whitespace-nowrap text-sm md:text-base ${activeTab === tab ? 'border-b-2 border-[#8BADA4] text-[#8BADA4] font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                                                onClick={() => setActiveTab(tab)}
                                            >
                                                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('oferecemos', 'O que oferecemos').replace('saber', 'O que você deve saber').replace('localizacao', 'Localização')}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Tab Content */}
                                <div className="min-h-[200px]"> {/* Ensure content area has some min height */}
                                    {activeTab === 'descricao' && (
                                        <div>
                                            <h3 className="text-xl font-semibold mb-3 text-gray-800">Sobre este espaço</h3>
                                            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{property.description || "Descrição não disponível."}</p>
                                        </div>
                                    )}
                                    {activeTab === 'fotos' && (
                                        <div>
                                            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Fotos do Imóvel</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Main Image */}
                                                <div className="col-span-1 row-span-2 rounded-xl overflow-hidden cursor-pointer relative group aspect-[4/3]" onClick={() => openFullGalleryModal(0)}>
                                                    <Image src={property.images?.[0] || '/placeholder.jpg'} alt="Foto 1 do imóvel" fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                                                </div>

                                                <div className="col-span-1 grid grid-rows-2 gap-4">
                                                    {/* Second Image */}
                                                    <div className="rounded-xl overflow-hidden cursor-pointer relative group aspect-[4/3]" onClick={() => openFullGalleryModal(1)}>
                                                        <Image src={property.images?.[1] || '/placeholder.jpg'} alt="Foto 2 do imóvel" fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                                                    </div>

                                                    {/* "View All" Button */}
                                                    <button
                                                        onClick={() => openFullGalleryModal(0)}
                                                        className="bg-gray-100 hover:bg-gray-200 rounded-xl flex flex-col items-center justify-center text-center p-4 transition-colors aspect-[4/3]"
                                                    >
                                                        <ImageSquare size={32} className="text-[#8BADA4] mb-2" />
                                                        <span className="font-semibold text-gray-800">Ver todas as fotos</span>
                                                        {property.images && property.images.length > 0 && (
                                                            <span className="text-sm text-gray-600 mt-1">{property.images.length} fotos disponíveis</span>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {activeTab === 'oferecemos' && (
                                        <div>
                                            <h3 className="text-xl font-semibold mb-3 text-gray-800">O que este lugar oferece</h3>
                                            {property.amenities && property.amenities.length > 0 ? (
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700">
                                                    {property.amenities.map(amenity => (
                                                        <li key={amenity} className="flex items-center">
                                                            {getAmenityIcon(amenity)} <span className="ml-2">{amenity}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : <p className="text-gray-600">Comodidades não especificadas.</p>}
                                        </div>
                                    )}
                                    {activeTab === 'saber' && (
                                        <div>
                                            <h3 className="text-xl font-semibold mb-3 text-gray-800">O que você deve saber</h3>
                                            {property.whatYouShouldKnowRichText ? (
                                                <div className="prose prose-sm max-w-none text-gray-700 link-styling" dangerouslySetInnerHTML={{ __html: property.whatYouShouldKnowRichText }} />
                                            ) : property.whatYouShouldKnowSections ? (
                                                <div className="space-y-4 text-sm text-gray-700">
                                                    {property.whatYouShouldKnowSections.houseRules && property.whatYouShouldKnowSections.houseRules.length > 0 && (
                                                        <div><h4 className="font-semibold text-gray-700 mb-1">Regras da Casa:</h4><ul className="list-disc list-inside pl-1 space-y-0.5">{property.whatYouShouldKnowSections.houseRules.map((rule, i) => <li key={`hr-${i}`}>{rule}</li>)}</ul></div>
                                                    )}
                                                    {property.whatYouShouldKnowSections.safetyProperty && property.whatYouShouldKnowSections.safetyProperty.length > 0 && (
                                                        <div><h4 className="font-semibold text-gray-700 mb-1">Segurança e Propriedade:</h4><ul className="list-disc list-inside pl-1 space-y-0.5">{property.whatYouShouldKnowSections.safetyProperty.map((item, i) => <li key={`sp-${i}`}>{item}</li>)}</ul></div>
                                                    )}
                                                    {property.whatYouShouldKnowSections.cancellationPolicy && property.whatYouShouldKnowSections.cancellationPolicy.length > 0 && (
                                                        <div><h4 className="font-semibold text-gray-700 mb-1">Política de Cancelamento:</h4><ul className="list-disc list-inside pl-1 space-y-0.5">{property.whatYouShouldKnowSections.cancellationPolicy.map((policy, i) => <li key={`cp-${i}`}>{policy}</li>)}</ul></div>
                                                    )}
                                                </div>
                                            ) : <p className="text-gray-600">Informações adicionais não fornecidas.</p>}
                                        </div>
                                    )}
                                    {activeTab === 'localizacao' && (
                                        <div>
                                            <h3 className="text-xl font-semibold mb-3 text-gray-800">Onde você vai estar</h3>
                                            {property.location && <p className="text-sm text-gray-600 mb-3">{formatLocationForPublic(property.location)}</p>}
                                            {property.coordinates ? (
                                                <div className="h-80 md:h-96 rounded-xl overflow-hidden shadow-md">
                                                    <MapComponent center={(typeof property.coordinates === 'object' && 'lat' in property.coordinates) ? [property.coordinates.lng, property.coordinates.lat] : property.coordinates as [number, number]} zoom={15} showMarker={true} />
                                                </div>
                                            ) : <p className="text-gray-600">Mapa não disponível.</p>}
                                            {property.pointsOfInterest && property.pointsOfInterest.length > 0 && (
                                                <div className="mt-4">
                                                    <h4 className="font-semibold text-gray-700 mb-1">Pontos de Interesse Próximos:</h4>
                                                    <ul className="list-disc list-inside pl-1 space-y-0.5 text-sm text-gray-600">
                                                        {property.pointsOfInterest.map((poi, i) => <li key={`poi-${i}`}>{poi}</li>)}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column (Booking Card) */}
                            <div className="col-span-12 md:col-span-5">
                                <div className="sticky top-5 bg-white border border-gray-200 p-5 rounded-xl shadow-lg space-y-4">
                                    <div className="flex justify-between items-baseline">
                                        <div>
                                            <span className="text-2xl font-bold text-gray-800">{formatCurrency(pricePerNightForCalc)}</span>
                                            <span className="text-sm text-gray-600"> / noite</span>
                                        </div>
                                        {property.rating && property.rating.value > 0 && (
                                            <span className="text-sm flex items-center">
                                                <Star weight="fill" size={16} className="text-yellow-500 mr-1" />
                                                {property.rating.value.toFixed(1)} ({property.rating.count})
                                            </span>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="relative">
                                            <DatePicker
                                                selected={startDate}
                                                onChange={(date) => setDateRange(prev => [date, prev[1] && date && date > prev[1] ? null : prev[1]])}
                                                selectsStart
                                                startDate={startDate}
                                                endDate={endDate}
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
                                                selected={endDate}
                                                onChange={(date) => setDateRange(prev => [prev[0], date])}
                                                selectsEnd
                                                startDate={startDate}
                                                endDate={endDate}
                                                minDate={startDate ? new Date(new Date(startDate).setDate(startDate.getDate() + 1)) : new Date(new Date().setDate(new Date().getDate() + 1))}
                                                placeholderText="Check-out"
                                                locale={ptBR}
                                                dateFormat="dd/MM/yy"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BADA4] focus:border-[#8BADA4] transition-shadow text-sm"
                                                disabled={!startDate}
                                                popperPlacement="bottom-start"
                                            />
                                            <CalendarIcon size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    {numNights > 0 && (
                                        <div className="text-sm text-gray-700 space-y-1 border-t pt-3">
                                            <div className="flex justify-between"><span>{formatCurrency(pricePerNightForCalc)} x {numNights} noites</span><span>{formatCurrency(subtotal)}</span></div>
                                            {discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Desconto aplicado</span><span>-{formatCurrency(discountAmount)}</span></div>}
                                            {totalServiceFee > 0 && <div className="flex justify-between"><span>Taxa de serviço</span><span>{formatCurrency(totalServiceFee)}</span></div>}
                                            <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2"><span>Total</span><span>{formatCurrency(totalAmount)}</span></div>
                                        </div>
                                    )}
                                    <button
                                        onClick={handleAvailabilityConsultation}
                                        disabled={!startDate || !endDate}
                                        className="w-full bg-[#8BADA4] hover:bg-[#7A9A8D] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        Consultar disponibilidade <ArrowRight size={18} className="ml-2" />
                                    </button>
                                    {consultationMessage && <p className={`text-xs text-center ${consultationMessage.startsWith('Obrigado') ? 'text-green-600' : 'text-red-600'}`}>{consultationMessage}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Screen Image Gallery Modal */}
            {showFullGallery && displayImages.length > 0 && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center animate-fade-in"
                    onClick={(e) => { e.stopPropagation(); closeFullGalleryModal(); }} // Close on backdrop click
                    role="dialog"
                    aria-modal="true"
                >
                    <button onClick={(e) => { e.stopPropagation(); closeFullGalleryModal(); }} className="absolute top-5 right-5 text-white p-3 rounded-full bg-black/60 hover:bg-black/80 z-[110] transition-opacity">
                        <X size={28} weight="bold" />
                    </button>
                    {displayImages.length > 1 && (
                        <>
                            <button onClick={prevImage} className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 text-white p-3 md:p-4 rounded-full bg-black/50 hover:bg-black/70 z-[110] transition-transform hover:scale-105 disabled:opacity-50" disabled={isAnimating}>
                                <CaretLeft size={28} weight="bold" />
                            </button>
                            <button onClick={nextImage} className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 text-white p-3 md:p-4 rounded-full bg-black/50 hover:bg-black/70 z-[110] transition-transform hover:scale-105 disabled:opacity-50" disabled={isAnimating}>
                                <CaretRight size={28} weight="bold" />
                            </button>
                        </>
                    )}
                    <div className="relative w-full h-full flex items-center justify-center p-5 md:p-10" onClick={(e) => e.stopPropagation()}>
                        <div className={`relative transition-transform duration-300 ease-in-out ${isAnimating && slideDirection === 'next' ? 'animate-slide-out-left' : ''} ${isAnimating && slideDirection === 'prev' ? 'animate-slide-out-right' : ''} ${!isAnimating && slideDirection === 'next' ? 'animate-slide-in-right' : ''} ${!isAnimating && slideDirection === 'prev' ? 'animate-slide-in-left' : ''}`}>
                            <Image
                                key={currentGalleryIndex} // Force re-render on index change for animation
                                src={displayImages[currentGalleryIndex]}
                                alt={`Imagem ${currentGalleryIndex + 1} de ${property.title}`}
                                width={1600} // Provide aspect ratio hints
                                height={900}
                                objectFit="contain"
                                className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl"
                                priority // Prioritize loading the current image
                            />
                        </div>
                    </div>
                    {displayImages.length > 1 && (
                        <p className="absolute bottom-5 text-white text-base bg-black/60 px-3 py-1 rounded-full shadow-lg">
                            {currentGalleryIndex + 1} / {displayImages.length}
                        </p>
                    )}
                </div>
            )}
            {/* Global styles for react-datepicker and animations */}
            <style jsx global>{`
            .react-datepicker-popper {
                z-index: 1000 !important; /* Ensure datepicker is above modal content */
            }
            .rounded-scroll-container::-webkit-scrollbar { width: 8px; }
            .rounded-scroll-container::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
            .rounded-scroll-container::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 10px; }
            .rounded-scroll-container::-webkit-scrollbar-thumb:hover { background: #a1a1a1; }
            .link-styling a { color: #8BADA4; text-decoration: underline; }
            .link-styling a:hover { color: #7A9A8D; }

            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
            @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            .animate-scale-in { animation: scaleIn 0.3s ease-out forwards; }
            
            /* Full Screen Gallery Animations */
            @keyframes slide-out-left { 0% { transform: translateX(0); opacity: 1; } 100% { transform: translateX(-20%); opacity: 0; } }
            @keyframes slide-out-right { 0% { transform: translateX(0); opacity: 1; } 100% { transform: translateX(20%); opacity: 0; } }
            @keyframes slide-in-left { 0% { transform: translateX(20%); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
            @keyframes slide-in-right { 0% { transform: translateX(-20%); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
            .animate-slide-out-left { animation: slide-out-left 0.3s ease-in-out forwards; }
            .animate-slide-out-right { animation: slide-out-right 0.3s ease-in-out forwards; }
            .animate-slide-in-left { animation: slide-in-left 0.3s ease-in-out forwards; }
            .animate-slide-in-right { animation: slide-in-right 0.3s ease-in-out forwards; }
        `}</style>
        </div>
    );
}

// Add Wind Icon if it's intended to be used and exists in phosphor-icons
// If not, replace with a suitable alternative like Fan or remove if not crucial.
// For now, assuming Wind is a valid icon name for demonstration.
// If `Wind` is not a valid Phosphor icon, replace `Wind` in getAmenityIcon and its import.
// For example, if 'Fan' is available: import { ..., Fan } from '@phosphor-icons/react';
// And in getAmenityIcon: if (text.includes('ventilador')) return <Fan className="w-5 h-5 text-[#8BADA4]" />;

// Corrected icon import for Wind (if available, or choose alternative)
// import { Wind } from '@phosphor-icons/react'; // Example if Wind is a real icon
// The main import line should be:
// import { CaretLeft, ..., Wind, X, ... } from '@phosphor-icons/react';
// Make sure 'Wind' icon is added to the main import list if getAmenityIcon will use it.
// And 'Car', 'Snowflake', 'Bathtub' etc. are confirmed to be in the main import.
// From the previous full file, these were used:
// WifiHigh, Desktop, Television, Dog, House, Lightning, Fire, Calendar as CalendarIcon, CaretDown,
// Clock, X, Snowflake, Users, Bed, ArrowRight, Star, Heart, CheckCircle,
// Shield, Calendar (non-aliased), Buildings, MapPin, Lock, Waves, CaretLeft, CaretRight, Bathtub, Car.
// Ensure the new component has all these plus any others from AllProperties modal.
// The current import line is:
// CaretLeft, CaretRight, Buildings, MapPin, Lock, Waves, CookingPot,
// WifiHigh, Desktop, Television, Dog, House, Lightning, Fire, Calendar as CalendarIcon, CaretDown,
// Clock, X, Snowflake, Users, Bed, ArrowRight, Star, Heart, CheckCircle,
// Shield, Calendar, Bathtub, Car

// We need to add Wind if it's used.
// The provided AllProperties.tsx uses `Desktop` for 'ventilador'. The new modal code had `Wind`.
// I will stick to `Desktop` for 'ventilador' to match AllProperties.tsx original logic.
// Also, `Coffee` alias for `CookingPot` in AllProperties.tsx import. The new modal used `CookingPot`.
// I'll ensure `CookingPot` is used consistently for coffee.
// It looks like `Car` was added correctly. `Bathtub` too.

// Final check of icons used in getAmenityIcon vs imports:
// WifiHigh - YES
// Television - YES
// CookingPot - YES (used for Cozinha, Café, Geladeira, Microondas, Talheres/Louça)
// Car - YES
// Waves - YES (used for Piscina, Água Quente, Chuveiro/Ducha)
// Snowflake - YES
// Fire - YES (used for Aquecimento, Lareira, Churrasqueira)
// Desktop - YES (used for Ventilador from AllProperties.tsx. My code had Wind, changing to Desktop)
// Lock - YES
// House - YES
// Buildings - YES (used for Academia)
// Bathtub - YES (used for Banheiro, Chuveiro/Ducha, Xampu/Sabonete, Jacuzzi)
// Bed - YES (used for Quarto, Roupa de Cama, Cobertor/Travesseiro)
// Lightning - YES
// Dog - YES
// CheckCircle - YES
// All used icons seem to be in the import list.

