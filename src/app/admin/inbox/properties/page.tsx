'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/utils/AuthContext';
import { deleteCookie } from 'cookies-next';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
    Building, Home, MessageCircle, Bell, ChevronDown,
    Plus, Pencil, Trash2, Search, Filter, ArrowUpDown,
    BedDouble, Bath, Square, MapPin, DollarSign,
    UserCircle, LogOut, Check, Wifi, Tv, ChefHat,
    ParkingCircle, Umbrella, Snowflake, Thermometer,
    Coffee, Fan, Droplet, ShieldAlert, Trees, Flame,
    Dumbbell, Shirt, Utensils, Container, Microwave,
    Sofa, Wrench, Cable, Bike, BellRing, Dog, Lamp,
    Wind, Baby, Mountain, Warehouse, Zap, Lock,
    Clock, Shield, Calendar
} from 'lucide-react';
import { useAirbnbImport } from '@/hooks/useAirbnbImport';
import { normalizeAmenities, categorizeAmenities } from '@/utils/amenities-utils';
import AdminHeader from '@/components/admin/Header';
import { checkScraperStatus } from '@/utils/airbnb-scraper';
import { ApiStatusIndicator } from '@/components/admin/ApiStatus';
import MapboxSearch from '@/components/MapboxSearch';
import {
    saveProperty,
    updateProperty,
    deleteProperty,
    fetchProperties,
    fetchFilteredProperties,
    uploadMultiplePropertyImages
} from '@/services/propertyService';
import { Property } from '@/data/sampleProperties';
import { ArrowUp, ArrowDown, Star } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '@/components/ui/input'; // Adicionar se não estiver lá
import { Checkbox } from '@/components/ui/checkbox'; // Adicionar se não estiver lá
import NewPropertyStepperModal from '@/components/admin/NewPropertyStepperModal'; // <- ADICIONAR IMPORT

// Dinamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

// Adicione a função getAmenityIcon logo após os imports, antes do componente PropertiesPage
const getAmenityIcon = (amenity: string) => {
    const text = amenity.toLowerCase();
    if (text.includes('wi-fi') || text.includes('internet') || text.includes('wifi')) return <Wifi className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('tv') || text.includes('televisão')) return <Tv className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('cozinha')) return <ChefHat className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('estacionamento') || text.includes('garage')) return <ParkingCircle className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('piscina')) return <Umbrella className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('ar-condicionado') || text.includes('ar condicionado')) return <Snowflake className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('aquecimento') || text.includes('calefação')) return <Thermometer className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('café') || text.includes('cafeteira')) return <Coffee className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('ventilador')) return <Fan className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('água quente') || text.includes('água')) return <Droplet className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('segurança') || text.includes('alarme')) return <ShieldAlert className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('varanda') || text.includes('terraço') || text.includes('quintal')) return <Trees className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('jardim')) return <Trees className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('churrasqueira') || text.includes('churrasco')) return <Flame className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('academia') || text.includes('fitness')) return <Dumbbell className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('banheiro') || text.includes('banheira')) return <Bath className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('quarto')) return <BedDouble className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('roupa de cama') || text.includes('roupa')) return <Shirt className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('chuveiro') || text.includes('ducha')) return <Droplet className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('talheres') || text.includes('louça')) return <Utensils className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('geladeira') || text.includes('refrigerador')) return <Container className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('microondas')) return <Microwave className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('sofá') || text.includes('sala')) return <Sofa className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('ferro') || text.includes('passar')) return <Wrench className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('cabos') || text.includes('plugue') || text.includes('eletricidade')) return <Cable className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('bicicleta')) return <Bike className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('detector') || text.includes('alarme') || text.includes('monóxido')) return <BellRing className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('pet') || text.includes('animais') || text.includes('cachorro')) return <Dog className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('lâmpada') || text.includes('iluminação')) return <Lamp className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('secador')) return <Wind className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('xampu') || text.includes('shampoo') || text.includes('sabonete')) return <Baby className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('vista') || text.includes('montanha')) return <Mountain className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('cobertor') || text.includes('travesseiro')) return <Shirt className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('blackout') || text.includes('cortina')) return <Umbrella className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('guarda-roupa') || text.includes('armário')) return <Warehouse className="w-5 h-5 text-[#8BADA4]" />;
    if (text.includes('bluetooth') || text.includes('som')) return <Zap className="w-5 h-5 text-[#8BADA4]" />;
    return <Check className="w-5 h-5 text-[#8BADA4]" />;
};

// Componente para renderizar amenities com ícones
const PropertyAmenityItem = ({ amenity }: { amenity: { text: string; svgIcon?: string; category?: string } }) => {
    // Mapping de texto das comodidades para ícones do Lucide
    const getIconComponent = (amenityText: string) => {
        const text = amenityText.toLowerCase();

        // Mapeamento de termos comuns para ícones
        if (text.includes('wi-fi') || text.includes('internet') || text.includes('wifi')) return <Wifi />;
        if (text.includes('tv') || text.includes('televisão')) return <Tv />;
        if (text.includes('cozinha')) return <ChefHat />;
        if (text.includes('estacionamento') || text.includes('garage')) return <ParkingCircle />;
        if (text.includes('piscina')) return <Umbrella />;
        if (text.includes('ar-condicionado') || text.includes('ar condicionado')) return <Snowflake />;
        if (text.includes('aquecimento') || text.includes('calefação')) return <Thermometer />;
        if (text.includes('café') || text.includes('cafeteira')) return <Coffee />;
        if (text.includes('ventilador')) return <Fan />;
        if (text.includes('água quente') || text.includes('água')) return <Droplet />;
        if (text.includes('segurança') || text.includes('alarme')) return <ShieldAlert />;
        if (text.includes('varanda') || text.includes('terraço') || text.includes('quintal')) return <Trees />;
        if (text.includes('jardim')) return <Trees />;
        if (text.includes('churrasqueira') || text.includes('churrasco')) return <Flame />;
        if (text.includes('academia') || text.includes('fitness')) return <Dumbbell />;
        if (text.includes('banheiro') || text.includes('banheira')) return <Bath />;
        if (text.includes('quarto')) return <BedDouble />;
        if (text.includes('roupa de cama') || text.includes('roupa')) return <Shirt />;
        if (text.includes('chuveiro') || text.includes('ducha')) return <Droplet />;
        if (text.includes('talheres') || text.includes('louça')) return <Utensils />;
        if (text.includes('geladeira') || text.includes('refrigerador')) return <Container />;
        if (text.includes('microondas')) return <Microwave />;
        if (text.includes('sofá') || text.includes('sala')) return <Sofa />;
        if (text.includes('ferro') || text.includes('passar')) return <Wrench />;
        if (text.includes('cabos') || text.includes('plugue') || text.includes('eletricidade')) return <Cable />;
        if (text.includes('bicicleta')) return <Bike />;
        if (text.includes('detector') || text.includes('alarme') || text.includes('monóxido')) return <BellRing />;
        if (text.includes('pet') || text.includes('animais') || text.includes('cachorro')) return <Dog />;
        if (text.includes('lâmpada') || text.includes('iluminação')) return <Lamp />;
        if (text.includes('secador')) return <Wind />;
        if (text.includes('xampu') || text.includes('shampoo') || text.includes('sabonete')) return <Baby />;
        if (text.includes('vista') || text.includes('montanha')) return <Mountain />;
        if (text.includes('cobertor') || text.includes('travesseiro')) return <Shirt />;
        if (text.includes('blackout') || text.includes('cortina')) return <Umbrella />;
        if (text.includes('guarda-roupa') || text.includes('armário')) return <Warehouse />;
        if (text.includes('bluetooth') || text.includes('som')) return <Zap />;

        // Categoria: básico
        if (amenity.category?.toLowerCase().includes('básico')) return <Home />;
        // Categoria: segurança  
        if (amenity.category?.toLowerCase().includes('segurança')) return <Lock />;
        // Categoria: cozinha
        if (amenity.category?.toLowerCase().includes('cozinha')) return <ChefHat />;
        // Categoria: localização/exterior
        if (amenity.category?.toLowerCase().includes('localização') ||
            amenity.category?.toLowerCase().includes('exterior')) return <MapPin />;

        // Ícone padrão para outros casos
        return <Check />;
    };

    return (
        <div className="flex items-center space-x-2">
            <div className="w-6 h-6 flex-shrink-0 text-blue-500">
                {getIconComponent(amenity.text)}
            </div>
            <span className="text-sm text-gray-800">{amenity.text}</span>
        </div>
    );
};

// Define the form data type
interface FormData {
    id: string;
    title: string;
    description: string;
    type: string;
    category: string; // Added category
    location: string;
    coordinates: {
        lat: number;
        lng: number;
    } | null;
    price: number;
    bedrooms: number;
    bathrooms: number;
    beds: number;
    guests: number;
    area: number;
    status: 'available' | 'rented' | 'maintenance';
    featured: boolean;
    images: { file?: File; id: string; url: string }[]; // Updated images type
    amenities: string[];
    categorizedAmenities: {
        [key: string]: string[];
    };
    houseRules: {
        checkIn: string;
        checkOut: string;
        maxGuests: number;
        additionalRules: string[];
    };
    safety: {
        hasCoAlarm: boolean;
        hasSmokeAlarm: boolean;
        hasCameras: boolean;
    };
    cancellationPolicy: string;
    rating: {
        value: number;
        count: number;
    };
    whatWeOffer: string;
    whatYouShouldKnowRichText: string;
    serviceFee: number;
    discountSettings: {
        amount: number;
        type: 'percentage' | 'fixed';
        minNights: number;
        validFrom: string;
        validTo: string;
    };
    whatYouShouldKnowSections: {
        houseRules: string[];
        safetyProperty: string[];
        cancellationPolicy: string[];
    };
    whatYouShouldKnowDynamic: {
        checkInTime?: string;
        checkOutTime?: string;
        maxGuests?: number;
        quietHours?: string;
    };
    pointsOfInterest: string[]; // Adicionado para pontos de interesse
    // additionalFeatures?: string[]; // Optional additional features
}

// Define os valores iniciais para o formulário
const initialFormData: FormData = {
    id: '',
    title: '',
    description: '',
    type: '',
    category: 'Business Ready', // Added category with a default value
    location: '',
    coordinates: null,
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    beds: 1,
    guests: 2,
    area: 0,
    status: 'available',
    featured: false,
    images: [], // Remains empty, will be populated with new structure
    amenities: [],
    categorizedAmenities: {},
    houseRules: {
        checkIn: '15:00',
        checkOut: '11:00',
        maxGuests: 0, // Será atualizado se beds/guests for preenchido
        additionalRules: []
    },
    safety: {
        hasCoAlarm: false,
        hasSmokeAlarm: false,
        hasCameras: false
    },
    cancellationPolicy: '', // Pode ser 'Flexível', 'Moderada', 'Rigorosa'
    rating: { value: 0, count: 0 },
    whatWeOffer: '',
    whatYouShouldKnowRichText: '',
    serviceFee: 0,
    discountSettings: {
        amount: 0,
        type: 'percentage',
        minNights: 0,
        validFrom: '',
        validTo: ''
    },
    whatYouShouldKnowSections: {
        houseRules: [],
        safetyProperty: [],
        cancellationPolicy: []
    },
    whatYouShouldKnowDynamic: {},
    pointsOfInterest: [], // Adicionado para pontos de interesse
    // additionalFeatures: [], // Optional additional features
};

// Itens para "O que você deve saber" (aba do imóvel)
// Estes são os itens que aparecem como checkboxes no painel admin
const HOUSE_RULES_ITEMS = [
    "Check-in após {time}",
    "Checkout antes das {time}",
    "Self check-in com fechadura inteligente",
    "Máximo de {guests} hóspedes",
    "Não é permitido animais de estimação",
    "Horário de silêncio: {hours}",
    "Não são permitidas festas ou eventos",
    "Não é permitido fotografia comercial",
    "Proibido fumar",
    "Tire o lixo",
    "Desligue tudo",
    "Tranque tudo"
];

const SAFETY_PROPERTY_ITEMS = [
    "Detector de monóxido de carbono instalado",
    "Detector de fumaça instalado",
    "Câmeras de segurança na propriedade",
    "Piscina/spa sem portão ou proteção",
    "Poço/corpo d'água próximo sem cerca",
    "Escadaria sem corrimão",
    "Superfícies escorregadias"
];

const CANCELLATION_POLICY_ITEMS = [
    "Reembolso integral: Receba o valor integral que você pagou até 48 horas depois da reserva.",
    "Reembolso parcial: Receba 50% do valor de todas as noites. Sem reembolso integral da taxa de serviço.",
    "Sem reembolso: Esta reserva não é reembolsável.",
    "Política de Grandes Eventos Disruptivos aplicável."
];

// Helper para identificar placeholders
const getPlaceholderDetails = (rule: string) => {
    const match = rule.match(/\{([^}]+)\}/);
    if (!match || typeof match.index === 'undefined') return null; // Check if match or match.index is null/undefined
    const placeholder = match[0]; // e.g., "{time}"
    const placeholderKey = match[1]; // e.g., "time"
    const base = rule.substring(0, match.index); // e.g., "Check-in após "
    const suffix = rule.substring(match.index + placeholder.length); // ADDED: e.g., "" or " hóspedes"
    let inputType = "text";
    if (placeholderKey === "time" || placeholderKey === "hours") inputType = "time"; // Ajustado para hours também
    if (placeholderKey === "guests") inputType = "number";
    return { placeholder, placeholderKey, base, suffix, inputType }; // MODIFIED: return suffix
};

// ADDED: MASTER_RULES_MAP to centralize master rule lists
const MASTER_RULES_MAP = {
    houseRules: HOUSE_RULES_ITEMS,
    safetyProperty: SAFETY_PROPERTY_ITEMS,
    cancellationPolicy: CANCELLATION_POLICY_ITEMS,
};

// ADDED: Helper function to reconstruct whatYouShouldKnowSections and dynamicInputValues for editing
const reconstructWhatYouShouldKnowForEdit = (
    savedSections: FormData['whatYouShouldKnowSections'] | undefined,
    masterRulesMap: typeof MASTER_RULES_MAP,
    getDetailsFn: typeof getPlaceholderDetails
) => {
    const sectionsForFormData: FormData['whatYouShouldKnowSections'] = {
        houseRules: [],
        safetyProperty: [],
        cancellationPolicy: [],
    };
    const parsedDynamicValues: Record<string, string> = {};

    if (!savedSections) {
        return { sectionsForFormData, parsedDynamicValues };
    }

    for (const sectionKey of Object.keys(savedSections) as Array<keyof FormData['whatYouShouldKnowSections']>) {
        const savedRulesInSection = savedSections[sectionKey] || [];
        // Ensure masterRulesForSection is treated as readonly string array or regular string array
        const masterRulesForSection = masterRulesMap[sectionKey] as readonly string[] || [];

        const currentSectionForFormData: string[] = [];

        for (const savedRule of savedRulesInSection) {
            let matchedMasterRule = null;
            let extractedValue = null;

            for (const masterRule of masterRulesForSection) {
                const details = getDetailsFn(masterRule);
                if (details) { // masterRule has a placeholder
                    // MODIFIED: Improved logic to handle base and suffix
                    if (savedRule.startsWith(details.base) && savedRule.endsWith(details.suffix) && savedRule.length >= details.base.length + details.suffix.length) {
                        const dynamicPart = savedRule.substring(details.base.length, savedRule.length - details.suffix.length);
                        // Check if the extracted part is not empty or just whitespace if it's a required part of the placeholder rule
                        // For example, if a rule absolutely needs a value for the placeholder
                        if (dynamicPart.trim() !== '' || details.placeholderKey) { // Allow empty if placeholderKey implies optionality (not handled here, but good to note)
                            matchedMasterRule = masterRule;
                            extractedValue = dynamicPart;
                            break;
                        }
                    }
                } else if (savedRule === masterRule) { // Static rule match
                    matchedMasterRule = masterRule;
                    break;
                }
            }

            if (matchedMasterRule) {
                currentSectionForFormData.push(matchedMasterRule); // Add the template rule
                if (extractedValue !== null && getDetailsFn(matchedMasterRule)) {
                    parsedDynamicValues[matchedMasterRule] = extractedValue;
                }
            } else {
                // If a saved rule doesn't match any master template, it might be a custom static rule
                // or an old rule. For now, only add it if it's a known static rule.
                // This assumes custom rules not in master lists are not editable via this dynamic system.
                // If it's a static rule present in the master list, it should have been matched above.
                // This console.warn can help identify rules that are stored but not mapping back.
                console.warn(`Rule from DB "${savedRule}" in section "${sectionKey}" did not map to a master template with placeholder or a static master rule.`);
                // Optionally, decide if unmapped saved rules should still be added to sectionsForFormData
                // For example, if it's a static rule that should just be checked:
                if (!getDetailsFn(savedRule) && masterRulesForSection.includes(savedRule)) {
                    currentSectionForFormData.push(savedRule);
                }
            }
        }
        sectionsForFormData[sectionKey] = currentSectionForFormData;
    }
    return { sectionsForFormData, parsedDynamicValues };
};

interface ImportProgress {
    step: number;
    total: number;
    message: string;
}

// Define a set of local placeholder images for properties
const localPlaceholderImages = [
    '/card1.jpg',
    '/card2.jpg',
    '/card3.jpg',
    '/card4.jpg',
    '/card1.jpg', // Reuse the first image for additional slots
    '/card2.jpg',
    '/card3.jpg',
    '/card4.jpg',
    '/card1.jpg'
];

// Get a consistent placeholder image based on property ID
const getLocalPlaceholderImage = (propertyId: string) => {
    // Use the property ID to deterministically select a placeholder image
    const numericId = parseInt(propertyId.replace(/\D/g, '').slice(0, 5)) || 0;
    const index = numericId % localPlaceholderImages.length;
    return localPlaceholderImages[index];
};

// Função utilitária para garantir que só exibe placeholder se não houver imagem válida
function getValidImage(images: (string | { id: string; url: string })[] | undefined, fallback: string, idx?: number) {
    if (images && images.length > 0) {
        // Se idx for fornecido, tenta pegar a imagem do índice
        const imgEntry = typeof idx === 'number' ? images[idx] : images[0];

        if (imgEntry) {
            const imgUrl = typeof imgEntry === 'string' ? imgEntry : imgEntry.url;
            if (imgUrl && typeof imgUrl === 'string' && imgUrl.trim() !== '') return imgUrl;
        }
    }
    return fallback;
}

// Função utilitária para normalizar imagens
function normalizeImages(images: any[]): { id: string, url: string }[] {
    return images.map((img, idx) => {
        if (typeof img === 'string') {
            return { id: uuidv4(), url: img };
        }
        if (img && typeof img === 'object' && img.url) {
            return { id: img.id || uuidv4(), url: img.url };
        }
        return { id: uuidv4(), url: '' };
    });
}

// Adicione ao tipo Property:
// (Se não puder editar o arquivo de tipos, crie um type local)
type PropertyWithList = Property & { whatYouShouldKnowList?: string[] };

// Adicione no topo do arquivo, após os imports principais
import './quill-overrides.css';

// Helper function to process dynamic values in whatYouShouldKnowSections
const processDynamicKnowSections = (
    sections: FormData['whatYouShouldKnowSections'],
    dynamicValues: Record<string, string>,
    getDetailsFn: typeof getPlaceholderDetails // Pass getPlaceholderDetails as an argument
): FormData['whatYouShouldKnowSections'] => {
    // Deep copy to avoid mutating the original formData state directly
    const processedSections = JSON.parse(JSON.stringify(sections));

    for (const sectionKey in processedSections) {
        if (Object.prototype.hasOwnProperty.call(processedSections, sectionKey)) {
            const key = sectionKey as keyof FormData['whatYouShouldKnowSections'];
            processedSections[key] = processedSections[key].map((rule: string) => {
                const details = getDetailsFn(rule);
                // Check if the rule itself is a key in dynamicValues
                if (details && typeof dynamicValues[rule] === 'string') {
                    return rule.replace(details.placeholder, dynamicValues[rule]);
                }
                return rule;
            });
        }
    }
    return processedSections;
};

export default function PropertiesPage() {
    const { user, loading, signOut } = useAuthContext();
    const router = useRouter();
    const pathname = usePathname();
    const [username, setUsername] = useState<string>('');
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loadingProperties, setLoadingProperties] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [currentProperty, setCurrentProperty] = useState<Property | null>(null);
    const [showImportModal, setShowImportModal] = useState<boolean>(false);
    const [importUrl, setImportUrl] = useState<string>('');
    const [importError, setImportError] = useState<string | null>(null);
    const { importFromAirbnb, isLoading, error, progress } = useAirbnbImport();
    const [isImporting, setIsImporting] = useState<boolean>(false);
    const [importProgress, setImportProgress] = useState<ImportProgress>({ step: 0, total: 3, message: '' });
    const [importedData, setImportedData] = useState<any>(null);
    const [imageUploadProgress, setImageUploadProgress] = useState<number>(0);
    const [isUploadingImages, setIsUploadingImages] = useState<boolean>(false);
    const [localImages, setLocalImages] = useState<(File | { id: string, url: string })[]>([]); // Allow File or object type
    const [showNewPropertyModal, setShowNewPropertyModal] = useState(false);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null); // Added notification state

    const [formData, setFormData] = useState<FormData>({
        id: '',
        title: '',
        description: '',
        type: '',
        category: 'Business Ready', // Added category with a default value
        location: '',
        coordinates: null,
        price: 0,
        bedrooms: 0,
        bathrooms: 0,
        beds: 0,
        guests: 0,
        area: 0,
        status: 'available',
        featured: false,
        images: [],
        amenities: [],
        categorizedAmenities: {},
        houseRules: {
            checkIn: '',
            checkOut: '',
            maxGuests: 0,
            additionalRules: []
        },
        safety: {
            hasCoAlarm: false,
            hasSmokeAlarm: false,
            hasCameras: false
        },
        cancellationPolicy: '',
        rating: {
            value: 0,
            count: 0
        },
        whatWeOffer: '',
        whatYouShouldKnowRichText: '',
        serviceFee: 0,
        discountSettings: {
            amount: 0,
            type: 'percentage',
            minNights: 0,
            validFrom: '',
            validTo: ''
        },
        whatYouShouldKnowSections: {
            houseRules: [],
            safetyProperty: [],
            cancellationPolicy: []
        },
        whatYouShouldKnowDynamic: {},
        pointsOfInterest: [], // Adicionado para pontos de interesse
        // additionalFeatures: [], // Optional additional features
    });

    const [dynamicInputValues, setDynamicInputValues] = useState<Record<string, string>>({});

    const [propertyTypes, setPropertyTypes] = useState<string[]>([
        'Apartamento', 'Casa', 'Cobertura', 'Studio', 'Flat', 'Kitnet', 'Loft'
    ]);

    const [amenitiesDropdownOpen, setAmenitiesDropdownOpen] = useState(false);
    const amenitiesDropdownRef = useRef<HTMLDivElement>(null);

    // Adicionar antes do componente PropertiesPage:
    const whatYouShouldKnowDropdownRef = useRef<HTMLDivElement>(null);
    const [whatYouShouldKnowDropdownOpen, setWhatYouShouldKnowDropdownOpen] = useState(false);

    // Defina as categorias e suas comodidades
    const AMENITIES_BY_CATEGORY = [
        {
            category: 'Cozinha',
            items: [
                'Cafeteira',
                'Cozinha', // Corrected: 'Cozinha (espaço)' can be simplified to 'Cozinha' if it refers to the space
                'Microondas',
                'Louças e talheres',
                'Frigobar',
                'Fogão por indução',
            ],
        },
        {
            category: 'Banheiro',
            items: [
                'Shampoo', // Changed from Xampu and included here
                'Condicionador',
                'Sabonete para o corpo',
                'Água quente',
                'Básico (Toalhas, lençóis, sabonete e papel higiênico)',
            ],
        },
        {
            category: 'Quarto',
            items: [
                'Cabides',
                'Local para guardar as roupas: guarda-roupa',
                'Roupas de cama',
                'Cobertores e travesseiros extras',
                'Blackout nas cortinas',
            ],
        },
        {
            category: 'Sala',
            items: [
                'TV',
                'Wi-Fi',
                'Pátio ou varanda (Privativa)',
                'Cadeira espreguiçadeira',
                'Espaço de trabalho exclusivo',
            ],
        },
        {
            category: 'Segurança',
            items: [
                'Detector de fumaça',
                'Alarme de monóxido de carbono',
                'Extintor de incêndio',
                'Kit de primeiros socorros',
            ],
        },
        {
            category: 'Outros',
            items: [
                'Produtos de limpeza',
                'Secadora',
                'Máquina de lavar',
                'Móveis externos',
                'Estacionamento gratuito na rua',
                'Elevador',
                'Academia compartilhada (no prédio)',
                'Estacionamento pago fora da propriedade',
                'Ar-condicionado', // Moved from Quarto
                'Ar-condicionado central', // Moved from Quarto
                'Aquecimento central', // Moved from Quarto
            ],
        },
    ];

    // Adicionar um novo state para controlar animações de confirmação
    const [confirmationAnimation, setConfirmationAnimation] = useState<{ [key: string]: boolean }>({});

    // Função auxiliar para mostrar uma animação de confirmação
    const showConfirmationAnimation = (field: string) => {
        setConfirmationAnimation(prev => ({ ...prev, [field]: true }));
        setTimeout(() => {
            setConfirmationAnimation(prev => ({ ...prev, [field]: false }));
        }, 500);
    };

    // Handlers para o MapboxSearch
    const handleLocationSelect = (locationData: { address: string; coordinates: [number, number] }) => {
        setFormData(prev => ({
            ...prev,
            location: locationData.address,
            coordinates: {
                lat: locationData.coordinates[1],
                lng: locationData.coordinates[0]
            }
        }));
    };

    // Funções para gerenciar imagens no modal de edição
    const handleImageUploadLocal = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.files) {
                const newFiles = Array.from(target.files);
                setLocalImages(prev => [...prev, ...newFiles]); // Store File objects directly
            }
        };
        input.click();
    };

    const handleRemoveImageLocal = (index: number) => {
        setLocalImages(prev => prev.filter((_, i) => i !== index));
    };

    // Funções para reordenar imagens via botões
    const moveImageUp = (index: number) => {
        if (index === 0) return; // Já está no topo
        setLocalImages(prev => {
            const newImages = [...prev];
            const temp = newImages[index];
            newImages[index] = newImages[index - 1];
            newImages[index - 1] = temp;
            return newImages;
        });
    };

    const moveImageDown = (index: number) => {
        setLocalImages(prev => {
            if (index === prev.length - 1) return prev; // Já está no final
            const newImages = [...prev];
            const temp = newImages[index];
            newImages[index] = newImages[index + 1];
            newImages[index + 1] = temp;
            return newImages;
        });
    };

    const moveImageToFirst = (index: number) => {
        if (index === 0) return; // Já é a primeira
        setLocalImages(prev => {
            const newImages = [...prev];
            const [imageToMove] = newImages.splice(index, 1);
            newImages.unshift(imageToMove);
            return newImages;
        });
    };

    // Form handling functions
    const resetForm = () => {
        // Reset form to initial state
        setFormData({
            id: '',
            title: '',
            description: '',
            type: 'Apartamento',
            category: 'Business Ready', // Added category with a default value
            location: '',
            coordinates: null,
            price: 0,
            bedrooms: 1,
            bathrooms: 1,
            beds: 1,
            guests: 2,
            area: 0,
            status: 'available',
            featured: false,
            images: [],
            amenities: [],
            categorizedAmenities: {},
            houseRules: {
                checkIn: '15:00',
                checkOut: '11:00',
                maxGuests: 2,
                additionalRules: [],
            },
            safety: {
                hasCoAlarm: false,
                hasSmokeAlarm: false,
                hasCameras: false,
            },
            cancellationPolicy: 'Flexível',
            rating: {
                value: 0,
                count: 0
            },
            whatWeOffer: '',
            whatYouShouldKnowRichText: '',
            serviceFee: 0,
            discountSettings: {
                amount: 0,
                type: 'percentage',
                minNights: 0,
                validFrom: '',
                validTo: ''
            },
            whatYouShouldKnowSections: {
                houseRules: [],
                safetyProperty: [],
                cancellationPolicy: []
            },
            whatYouShouldKnowDynamic: {
                checkInTime: '14:00',
                checkOutTime: '11:00',
                maxGuests: 3,
                quietHours: '22:00 - 08:00'
            },
            pointsOfInterest: [], // Adicionado para pontos de interesse
            // additionalFeatures: [], // Optional additional features
        });
        setLocalImages([]);
        setImageUploadProgress(0);
    };

    const handleAddProperty = async () => {
        // Basic validation
        if (!formData.title || !formData.type || formData.price <= 0) {
            alert('Por favor, preencha todos os campos obrigatórios: Título, Tipo e Preço.');
            return;
        }

        // Process dynamic sections before saving
        const processedWhatYouShouldKnowSections = processDynamicKnowSections(
            formData.whatYouShouldKnowSections,
            dynamicInputValues,
            getPlaceholderDetails // Pass the actual getPlaceholderDetails function
        );

        try {
            setIsUploadingImages(true); // Indicate upload start
            setImageUploadProgress(0); // Reset progress

            const filesToUpload = formData.images
                .map(imgEntry => imgEntry.file)
                .filter(file => file instanceof File) as File[];

            let uploadedImageUrls: string[] = [];
            const propertyUploadId = uuidv4(); // ID for grouping images in storage

            if (filesToUpload.length > 0) {
                // Pass progress callback to uploadMultiplePropertyImages
                uploadedImageUrls = await uploadMultiplePropertyImages(
                    filesToUpload,
                    propertyUploadId,
                    (progress) => setImageUploadProgress(progress)
                );
            }

            // Combine with any existing URLs (e.g., if editing, though this function is for add)
            // For pure add, existingImageUrls would be empty.
            // This primarily ensures we only save permanent string URLs.
            const existingImageUrls = formData.images
                .filter(imgEntry => !imgEntry.file && typeof imgEntry.url === 'string')
                .map(imgEntry => imgEntry.url);

            const finalImageUrls = [...existingImageUrls, ...uploadedImageUrls];

            const propertyData: Omit<Property, 'id'> = { // Ensure type matches saveProperty
                title: formData.title,
                description: formData.description,
                type: formData.type,
                category: formData.category,
                location: formData.location,
                coordinates: formData.coordinates,
                price: formData.price,
                bedrooms: formData.bedrooms,
                bathrooms: formData.bathrooms,
                beds: formData.beds || 1,
                guests: formData.guests || 2,
                area: formData.area,
                status: formData.status,
                featured: formData.featured,
                images: finalImageUrls, // Save only permanent string URLs
                amenities: formData.amenities || [],
                categorizedAmenities: formData.categorizedAmenities || {},
                houseRules: formData.houseRules || {
                    checkIn: '15:00',
                    checkOut: '11:00',
                    maxGuests: 2,
                    additionalRules: [],
                },
                safety: formData.safety || {
                    hasCoAlarm: false,
                    hasSmokeAlarm: false,
                    hasCameras: false,
                },
                cancellationPolicy: formData.cancellationPolicy || 'Flexível',
                // Ensure all other fields from Omit<Property, 'id'> are present and correctly typed
                rating: formData.rating,
                whatWeOffer: formData.whatWeOffer,
                whatYouShouldKnowRichText: formData.whatYouShouldKnowRichText,
                serviceFee: formData.serviceFee,
                discountSettings: {
                    amount: formData.discountSettings.amount,
                    type: formData.discountSettings.type,
                    minNights: formData.discountSettings.minNights,
                    validFrom: formData.discountSettings.validFrom ? new Date(formData.discountSettings.validFrom) : undefined,
                    validTo: formData.discountSettings.validTo ? new Date(formData.discountSettings.validTo) : undefined,
                },
                whatYouShouldKnowSections: processedWhatYouShouldKnowSections, // Use processed data
                whatYouShouldKnowDynamic: formData.whatYouShouldKnowDynamic, // Keep as is, or enhance later
                pointsOfInterest: formData.pointsOfInterest,
                // additionalFeatures: formData.additionalFeatures,
                // created_at and updated_at will be handled by Supabase
            };

            const savedPropertyId = await saveProperty(propertyData);

            // Update the UI with the new property, using the savedPropertyId
            // and the finalImageUrls that were actually saved.
            const newPropertyDisplay: Property = {
                ...propertyData, // Spread the data that was saved
                id: savedPropertyId, // Use the ID returned from the save operation
                images: finalImageUrls, // Ensure this is the array of string URLs
            };

            setProperties(prev => [newPropertyDisplay, ...prev]);
            setShowNewPropertyModal(false);
            resetForm();
            setNotification({ message: 'Propriedade adicionada com sucesso!', type: 'success' });

        } catch (error) {
            console.error("Erro ao adicionar propriedade:", error);
            setNotification({ message: 'Erro ao adicionar propriedade. Tente novamente.', type: 'error' });
        } finally {
            setIsUploadingImages(false); // Reset upload indicator
        }
    };

    const handleUpdateProperty = async () => {
        if (!currentProperty) return;

        // Process dynamic sections before saving
        const processedWhatYouShouldKnowSections = processDynamicKnowSections(
            formData.whatYouShouldKnowSections,
            dynamicInputValues,
            getPlaceholderDetails // Pass the actual getPlaceholderDetails function
        );

        try {
            setIsUploadingImages(true);
            setImageUploadProgress(0);

            const filesToUpload = formData.images
                .map(imgEntry => imgEntry.file)
                .filter(file => file instanceof File) as File[];

            let newlyUploadedImageUrls: string[] = [];

            if (filesToUpload.length > 0) {
                newlyUploadedImageUrls = await uploadMultiplePropertyImages(
                    filesToUpload,
                    currentProperty.id, // Use existing property ID for storage path
                    (progress) => setImageUploadProgress(progress)
                );
            }

            // Get existing image URLs that were not removed (i.e., don't have a .file property)
            const existingKeptImageUrls = formData.images
                .filter(imgEntry => !imgEntry.file && typeof imgEntry.url === 'string')
                .map(imgEntry => imgEntry.url);

            const finalImageUrls = [...existingKeptImageUrls, ...newlyUploadedImageUrls];

            const propertyData: Partial<Property> = {
                title: formData.title,
                description: formData.description,
                type: formData.type,
                category: formData.category,
                location: formData.location,
                coordinates: formData.coordinates,
                price: parseFloat(formData.price.toString()),
                bedrooms: parseInt(formData.bedrooms.toString()),
                bathrooms: parseInt(formData.bathrooms.toString()),
                beds: parseInt(formData.beds.toString()),
                guests: parseInt(formData.guests.toString()),
                area: parseFloat(formData.area.toString()),
                status: formData.status,
                featured: formData.featured,
                images: finalImageUrls, // Array of final string URLs
                amenities: formData.amenities,
                categorizedAmenities: formData.categorizedAmenities,
                houseRules: formData.houseRules,
                safety: formData.safety,
                cancellationPolicy: formData.cancellationPolicy,
                rating: formData.rating,
                whatWeOffer: formData.whatWeOffer,
                whatYouShouldKnowRichText: formData.whatYouShouldKnowRichText,
                serviceFee: formData.serviceFee,
                discountSettings: {
                    amount: formData.discountSettings.amount,
                    type: formData.discountSettings.type,
                    minNights: formData.discountSettings.minNights,
                    validFrom: formData.discountSettings.validFrom ? new Date(formData.discountSettings.validFrom) : undefined,
                    validTo: formData.discountSettings.validTo ? new Date(formData.discountSettings.validTo) : undefined,
                },
                whatYouShouldKnowSections: processedWhatYouShouldKnowSections, // Use processed data
                pointsOfInterest: formData.pointsOfInterest,
                // additionalFeatures: formData.additionalFeatures,
                // updated_at will be handled by Supabase
            };

            await updateProperty(currentProperty.id, propertyData);

            // Update properties in local state with the new data, ensuring images are string URLs
            setProperties(prevProperties =>
                prevProperties.map(p =>
                    p.id === currentProperty.id ? {
                        ...p,
                        ...propertyData,
                        id: currentProperty.id, // Ensure ID is present
                        images: finalImageUrls // Ensure images are the final string URLs
                    } : p
                )
            );
            setShowNewPropertyModal(false); // Assuming edit also uses this modal now
            resetForm();
            setNotification({ message: 'Propriedade atualizada com sucesso!', type: 'success' });

        } catch (error) {
            console.error("Erro ao atualizar propriedade:", error);
            setNotification({ message: 'Erro ao atualizar propriedade. Tente novamente.', type: 'error' });
        } finally {
            setIsUploadingImages(false);
        }
    };

    const handleEditProperty = (property: Property) => {
        setCurrentProperty(property);

        // MODIFIED: Use reconstructWhatYouShouldKnowForEdit
        const { sectionsForFormData, parsedDynamicValues } = reconstructWhatYouShouldKnowForEdit(
            property.whatYouShouldKnowSections,
            MASTER_RULES_MAP,
            getPlaceholderDetails
        );
        setDynamicInputValues(parsedDynamicValues);

        const normalizedExistingImages = (property.images || []).map(imgUrl => {
            if (typeof imgUrl === 'string') {
                return { id: uuidv4(), url: imgUrl, file: undefined };
            } else if (imgUrl && typeof imgUrl === 'object' && 'url' in imgUrl) {
                return { id: (imgUrl as any).id || uuidv4(), url: (imgUrl as any).url, file: undefined };
            }
            return { id: uuidv4(), url: '', file: undefined };
        }).filter(img => img.url);

        setFormData({
            id: property.id,
            title: property.title || '',
            description: property.description || '',
            type: property.type || '',
            category: property.category || 'Business Ready',
            location: property.location || '',
            coordinates: property.coordinates || null,
            price: property.price || 0,
            bedrooms: property.bedrooms || 0,
            bathrooms: property.bathrooms || 0,
            beds: property.beds || 1,
            guests: property.guests || 2,
            area: property.area || 0,
            status: property.status || 'available',
            featured: property.featured || false,
            images: normalizedExistingImages, // Correctly structured
            amenities: property.amenities || [],
            categorizedAmenities: property.categorizedAmenities || {},
            houseRules: property.houseRules || initialFormData.houseRules,
            safety: property.safety || initialFormData.safety,
            cancellationPolicy: property.cancellationPolicy || initialFormData.cancellationPolicy,
            rating: property.rating || initialFormData.rating,
            whatWeOffer: property.whatWeOffer || '',
            whatYouShouldKnowRichText: property.whatYouShouldKnowRichText || '',
            serviceFee: property.serviceFee || 0,
            discountSettings: property.discountSettings ? {
                amount: property.discountSettings.amount,
                type: property.discountSettings.type,
                minNights: property.discountSettings.minNights !== undefined ? property.discountSettings.minNights : initialFormData.discountSettings.minNights,
                validFrom: typeof property.discountSettings.validFrom === 'string' ? property.discountSettings.validFrom : (property.discountSettings.validFrom ? new Date(property.discountSettings.validFrom).toISOString().split('T')[0] : initialFormData.discountSettings.validFrom),
                validTo: typeof property.discountSettings.validTo === 'string' ? property.discountSettings.validTo : (property.discountSettings.validTo ? new Date(property.discountSettings.validTo).toISOString().split('T')[0] : initialFormData.discountSettings.validTo),
            } : initialFormData.discountSettings,
            whatYouShouldKnowSections: sectionsForFormData, // MODIFIED: Use sectionsForFormData
            whatYouShouldKnowDynamic: property.whatYouShouldKnowDynamic || initialFormData.whatYouShouldKnowDynamic, // This might need review if it's used for similar dynamic inputs
            pointsOfInterest: property.pointsOfInterest || [],
            // additionalFeatures: property.additionalFeatures || [],
        });
        // console.log('DEBUG: formData.pointsOfInterest set to:', property.pointsOfInterest || []);

        // Resetar o estado do editor para o conteúdo atualizado
        setShowNewPropertyModal(true);
    };

    const handleSaveFromStepperModal = async (): Promise<boolean> => {
        try {
            if (formData.id) { // Se tem ID, é uma edição
                await handleUpdateProperty();
            } else { // Sem ID, é uma adição
                await handleAddProperty();
            }
            // As funções handleAddProperty e handleUpdateProperty já cuidam de fechar
            // os modais relevantes (se necessário), resetar o formulário (resetForm),
            // e recarregar as propriedades.
            // O NewPropertyStepperModal se fechará por conta própria através da sua prop onClose
            // se o salvamento for bem-sucedido, e o resetForm é chamado nesse onClose.
            return true; // Indica sucesso
        } catch (error) {
            console.error("Erro ao salvar propriedade pelo stepper modal:", error);
            // Os alertas de erro específicos já devem ser tratados dentro de
            // handleAddProperty e handleUpdateProperty.
            return false; // Indica falha
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    // Add the amenity toggle handler function
    const handleAmenityToggle = (amenity: string, isChecked: boolean) => {
        setFormData(prev => {
            if (isChecked) {
                return {
                    ...prev,
                    amenities: [...prev.amenities, amenity]
                };
            } else {
                return {
                    ...prev,
                    amenities: prev.amenities.filter(a => a !== amenity)
                };
            }
        });
    };

    const handleImageUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.files) {
                const newImageEntries = Array.from(target.files).map(file => ({
                    file: file, // Store the actual File object
                    id: uuidv4(),
                    url: URL.createObjectURL(file) // For preview
                }));
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, ...newImageEntries]
                }));
            }
        };
        input.click();
    };

    const handleRemoveImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    // Funções para reordenar imagens via botões no modal de adicionar
    const moveFormImageUp = (index: number) => {
        if (index === 0) return; // Já está no topo
        setFormData(prev => {
            const newImages = [...prev.images];
            const temp = newImages[index];
            newImages[index] = newImages[index - 1];
            newImages[index - 1] = temp;
            return {
                ...prev,
                images: newImages
            };
        });
    };

    const moveFormImageDown = (index: number) => {
        setFormData(prev => {
            if (index === prev.images.length - 1) return prev; // Já está no final
            const newImages = [...prev.images];
            const temp = newImages[index];
            newImages[index] = newImages[index + 1];
            newImages[index + 1] = temp;
            return {
                ...prev,
                images: newImages
            };
        });
    };

    const moveFormImageToFirst = (index: number) => {
        if (index === 0) return; // Já é a primeira
        setFormData(prev => {
            const newImages = [...prev.images];
            const [imageToMove] = newImages.splice(index, 1);
            newImages.unshift(imageToMove);
            return {
                ...prev,
                images: newImages
            };
        });
    };

    useEffect(() => {
        // Só verificar redirecionamento quando loading for false
        if (!loading) {
            if (!user) {
                router.push('/admin');
            } else {
                const email = user.email || '';
                setUsername(email.split('@')[0]);
            }
        }
    }, [user, loading, router]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.profile-menu-container')) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (error) {
            setImportError(error);
        }
    }, [error]);

    useEffect(() => {
        if (progress.step > 0) {
            setImportProgress(progress);
        }
    }, [progress]);

    useEffect(() => {
        if (showEditModal && currentProperty) {
            setLocalImages(normalizeImages(currentProperty.images || []));
        }
    }, [showEditModal, currentProperty]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (amenitiesDropdownRef.current && !amenitiesDropdownRef.current.contains(event.target as Node)) {
                setAmenitiesDropdownOpen(false);
            }
            if (whatYouShouldKnowDropdownRef.current && !whatYouShouldKnowDropdownRef.current.contains(event.target as Node)) {
                setWhatYouShouldKnowDropdownOpen(false);
            }
        }
        if (amenitiesDropdownOpen || whatYouShouldKnowDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [amenitiesDropdownOpen, whatYouShouldKnowDropdownOpen]);

    const handleSignOut = async () => {
        try {
            await signOut();
            deleteCookie('admin_session');
            router.push('/admin');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    const filteredProperties = properties.filter(property => {
        const matchesSearch =
            property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.type.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'all' || property.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const getStatusText = (status: string) => {
        switch (status) {
            case 'available':
                return 'Disponível';
            case 'rented':
                return 'Alugado';
            case 'maintenance':
                return 'Em Manutenção';
            default:
                return 'Desconhecido';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'rented':
                return 'bg-blue-100 text-blue-800';
            case 'maintenance':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Fix the image loading issue by adding better error handling
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.currentTarget;
        const currentSrc = target.src;

        // Se a fonte atual já é um placeholder, não faz nada
        if (currentSrc.includes('/card')) {
            return;
        }

        // Encontra o índice com base na ordem do elemento
        let index = 0;
        try {
            // Tenta extrair o índice do elemento-pai
            const parent = target.parentElement;
            if (parent) {
                const key = parent.getAttribute('key');
                if (key) {
                    index = parseInt(key);
                }
            }
        } catch (err) {
            console.error('Erro ao determinar índice para fallback de imagem:', err);
        }

        // Garante que o índice é válido
        index = index % localPlaceholderImages.length;

        console.log(`Substituindo imagem com erro ${currentSrc} por ${localPlaceholderImages[index]}`);
        target.src = localPlaceholderImages[index];
    };

    // Fix the Airbnb import functionality
    const handleImportProperty = async () => {
        try {
            setIsImporting(true);
            setImportError(null);

            // Clear imported data before starting
            setImportedData(null);

            console.log('Verificando status da API de scraping...');
            const apiStatus = await checkScraperStatus();

            // Se a API estiver offline ou não conseguir obter dados do Airbnb
            if (!apiStatus.online) {
                console.log('API de scraping offline ou servidores Airbnb congestionados.');

                // Mostrar mensagem de erro ao usuário
                setImportError('Os servidores do Airbnb estão congestionados e não foi possível obter os dados neste momento. Por favor, tente novamente mais tarde.');
                setIsImporting(false);
                return;
            }

            console.log('Starting Airbnb import for URL:', importUrl);
            // Import data from Airbnb using the real API
            const result = await importFromAirbnb(importUrl);

            if (!result) {
                console.error('No result returned from scraping');
                setImportError('Os servidores do Airbnb estão congestionados e não foi possível obter os dados neste momento. Por favor, tente novamente mais tarde.');
                return;
            }

            // Verificar se os dados retornados são válidos/completos
            const hasValidData = result.title &&
                result.title.trim() !== '' &&
                result.pricePerNight > 0 &&
                (result.images && result.images.length > 0);

            if (!hasValidData) {
                console.error('Dados incompletos ou inválidos retornados pelo scraping:', result);
                setImportError('Os servidores do Airbnb estão congestionados e não foi possível obter os dados completos neste momento. Por favor, tente novamente mais tarde.');
                setIsImporting(false);
                return;
            }

            console.log('Dados importados do Airbnb:', result);

            // Process the imported data
            let processedImages: string[] = [];
            if (result.images && Array.isArray(result.images) && result.images.length > 0) {
                // Usar as URLs reais das imagens do Airbnb em vez dos placeholders
                processedImages = result.images;
                console.log(`Usando ${processedImages.length} imagens reais do Airbnb`);
            } else {
                console.warn('No images received from scraping');
                // Em vez de usar imagens locais, informar erro
                setImportError('Os servidores do Airbnb estão congestionados e não foi possível obter as imagens do imóvel. Por favor, tente novamente mais tarde.');
                setIsImporting(false);
                return;
            }

            // Store imported data with processed images
            const enhancedResult = {
                ...result,
                images: processedImages
            };

            console.log('Enhanced data to store:', enhancedResult);
            setImportedData(enhancedResult);
        } catch (error) {
            console.error('Error during Airbnb import:', error);
            setImportError('Os servidores do Airbnb estão congestionados e não foi possível obter os dados neste momento. Por favor, tente novamente mais tarde.');
        } finally {
            setIsImporting(false);
        }
    };

    // Fix the use imported data function
    const handleUseImportedData = () => {
        if (!importedData) return;

        console.log('Processing imported data for form', importedData);

        // Reset form to default values
        resetForm();

        // Usar as imagens reais em vez de placeholders
        const processedImages = importedData.images && importedData.images.length > 0
            ? importedData.images
            : ['/card1.jpg', '/card2.jpg', '/card3.jpg', '/card4.jpg'];
        console.log('Usando imagens importadas para a propriedade:', processedImages);

        // Normalize amenities
        const normalizedAmenities = normalizeAmenities(importedData.amenities || []);

        // Categorize amenities
        const categorizedAmenities = categorizeAmenities(normalizedAmenities);

        // Extract coordinates if available
        let coordinates = null;
        if (importedData.coordinates) {
            coordinates = importedData.coordinates;
        } else if (importedData.lat && importedData.lng) {
            coordinates = {
                lat: importedData.lat,
                lng: importedData.lng
            };
        }

        // Update form state with imported data
        const processedImagesWithId = normalizeImages(processedImages);

        setFormData({
            id: '',
            title: importedData.title || '',
            description: importedData.description || '',
            type: importedData.type || 'Apartamento',
            category: importedData.category || 'Business Ready', // Added category
            location: importedData.address || importedData.location || '',
            coordinates: coordinates,
            price: importedData.pricePerNight || 0,
            bedrooms: importedData.bedrooms || 1,
            bathrooms: importedData.bathrooms || 1,
            beds: importedData.beds || 1,
            guests: importedData.guests || 2,
            area: importedData.area || 0,
            status: 'available',
            featured: false,
            amenities: normalizedAmenities,
            categorizedAmenities: categorizedAmenities,
            images: processedImagesWithId,
            houseRules: {
                checkIn: importedData.houseRules?.checkIn || '15:00',
                checkOut: importedData.houseRules?.checkOut || '12:00',
                maxGuests: importedData.guests || 2,
                additionalRules: []
            },
            safety: {
                hasCoAlarm: normalizedAmenities.includes('Alarme de monóxido de carbono'),
                hasSmokeAlarm: normalizedAmenities.includes('Detector de fumaça'),
                hasCameras: normalizedAmenities.includes('Câmeras de segurança')
            },
            cancellationPolicy: importedData.cancellationPolicy || 'Flexível',
            // Novos campos adicionados
            rating: {
                value: importedData.rating?.value || 4.5, // Valor padrão ou do Airbnb quando disponível
                count: importedData.rating?.count || Math.floor(Math.random() * 40) + 10 // Gerar um valor aleatório entre 10 e 50
            },
            whatWeOffer: importedData.whatWeOffer || (importedData.description ? `${importedData.description.substring(0, 100)}...` : ''),
            whatYouShouldKnowRichText: importedData.whatYouShouldKnowRichText || '', // Novo campo para o editor de texto rico
            serviceFee: importedData.serviceFee || 35, // Taxa de serviço padrão
            discountSettings: {
                amount: importedData.discountSettings?.amount || 50,
                type: importedData.discountSettings?.type || 'fixed',
                minNights: importedData.discountSettings?.minNights || 3,
                validFrom: importedData.discountSettings?.validFrom || '',
                validTo: importedData.discountSettings?.validTo || ''
            },
            whatYouShouldKnowSections: {
                houseRules: importedData.houseRules?.additionalRules || [],
                safetyProperty: importedData.amenities?.filter((amenity: string) => SAFETY_PROPERTY_ITEMS.includes(amenity)) || [],
                cancellationPolicy: importedData.cancellationPolicy ? CANCELLATION_POLICY_ITEMS.filter(policy => policy.toLowerCase().includes(importedData.cancellationPolicy.toLowerCase())) : []
            },
            whatYouShouldKnowDynamic: {},
            pointsOfInterest: importedData.pointsOfInterest || [], // Adicionado e mapeado de pointsOfInterest
            // additionalFeatures: importedData.additionalFeatures || [], // Optional additional features
        });

        // Close modal and clear data
        setShowImportModal(false);
        setImportUrl('');
        setImportedData(null);
    };

    // Carregar propriedades do Firebase ao iniciar
    useEffect(() => {
        if (!loading && user) {
            fetchProperties().then(data => {
                // Aplicar o mesmo processamento que existia em loadPropertiesFromFirebase
                const processedProperties: Property[] = data.map(propertyDataFromDb => {
                    const propertyForFrontend: any = { ...propertyDataFromDb };

                    // @ts-ignore // Manter ts-ignore existente se necessário para a lógica antiga
                    if (propertyForFrontend.what_you_should_know_sections) {
                        // @ts-ignore
                        propertyForFrontend.whatYouShouldKnowSections = propertyForFrontend.what_you_should_know_sections;
                        // @ts-ignore
                        delete propertyForFrontend.what_you_should_know_sections;
                    }
                    if (!propertyForFrontend.whatYouShouldKnowSections) {
                        propertyForFrontend.whatYouShouldKnowSections = {
                            houseRules: [],
                            safetyProperty: [],
                            cancellationPolicy: []
                        };
                    }
                    if (!Array.isArray(propertyForFrontend.whatYouShouldKnowSections.houseRules)) {
                        propertyForFrontend.whatYouShouldKnowSections.houseRules = [];
                    }
                    if (!Array.isArray(propertyForFrontend.whatYouShouldKnowSections.safetyProperty)) {
                        propertyForFrontend.whatYouShouldKnowSections.safetyProperty = [];
                    }
                    if (!Array.isArray(propertyForFrontend.whatYouShouldKnowSections.cancellationPolicy)) {
                        propertyForFrontend.whatYouShouldKnowSections.cancellationPolicy = [];
                    }

                    // Mapear what_you_should_know_rich_text (existente, mas pode precisar de ajuste)
                    // @ts-ignore
                    if (propertyForFrontend.what_you_should_know_rich_text) {
                        // @ts-ignore
                        propertyForFrontend.whatYouShouldKnowRichText = propertyForFrontend.what_you_should_know_rich_text;
                        // @ts-ignore
                        delete propertyForFrontend.what_you_should_know_rich_text; // Consistência ao remover snake_case
                    } else {
                        propertyForFrontend.whatYouShouldKnowRichText = '';
                    }

                    return propertyForFrontend as Property; // Cast de volta para o tipo Property
                });
                setProperties(processedProperties);
                setLoadingProperties(false);
            }).catch(error => {
                console.error('Erro ao carregar propriedades do Supabase:', error);
                setProperties([]);
                setLoadingProperties(false);
            });
        }
    }, [loading, user]);

    // Função para remover propriedade
    const handleDeleteProperty = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta propriedade?')) {
            try {
                await deleteProperty(id);

                // Atualizar a lista localmente
                setProperties(properties.filter(p => p.id !== id));
            } catch (error) {
                console.error('Erro ao excluir propriedade:', error);
                alert('Erro ao excluir propriedade. Tente novamente.');
            }
        }
    };

    const handleWYSLCheckboxChange = (item: string, checked: boolean, sectionKey: 'houseRules' | 'safetyProperty' | 'cancellationPolicy') => {
        setFormData(prev => {
            const currentSectionItems = prev.whatYouShouldKnowSections[sectionKey] || [];
            let newSectionItems;
            if (checked) {
                newSectionItems = currentSectionItems.includes(item) ? currentSectionItems : [...currentSectionItems, item];
            } else {
                newSectionItems = currentSectionItems.filter((i: string) => i !== item);
            }

            const placeholderDetails = getPlaceholderDetails(item);
            if (!checked && placeholderDetails) {
                setDynamicInputValues(prevDynamicValues => {
                    const newDynamicValues = { ...prevDynamicValues };
                    delete newDynamicValues[item];
                    return newDynamicValues;
                });
            }
            return {
                ...prev,
                whatYouShouldKnowSections: {
                    ...prev.whatYouShouldKnowSections,
                    [sectionKey]: newSectionItems
                }
            };
        });
    };

    // ... (outras funções)

    // Renderização condicionada à carga de propriedades
    if (loading || loadingProperties) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-xl">Carregando...</div>
            </div>
        );
    }

    // Start of the JSX
    return (
        <div className="min-h-screen relative"
            style={{
                backgroundImage: "url('/background-dashboard.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 z-0"></div>

            {/* Content Container */}
            <div className="relative z-10 min-h-screen">
                {/* Substituir o cabeçalho pelo componente */}
                <AdminHeader />

                <main className="py-6">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-2">Gerenciamento de Imóveis</h1>
                                <p className="text-white/80">Gerencie os imóveis disponíveis na plataforma</p>
                            </div>
                            <div className="flex space-x-2"> {/* Adicionado div para alinhar botões */}
                                <button
                                    onClick={() => setShowNewPropertyModal(true)} // Aciona o novo modal
                                    className="inline-flex items-center px-4 py-2 bg-[#8BADA4] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                                >
                                    <Plus className="mr-2 h-5 w-5" />
                                    Adicionar Imóvel (Novo)
                                </button>
                            </div>
                        </div>

                        <div className="bg-white/25 backdrop-blur-lg rounded-xl shadow-lg p-4 mb-6 border border-white/20">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="col-span-2 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 bg-white/20 border border-white/20 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                        placeholder="Buscar por título, local ou tipo..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Filter className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <select
                                        className="w-full pl-10 pr-3 py-2 bg-white/20 border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                    >
                                        <option value="all">Todos os status</option>
                                        <option value="available">Disponível</option>
                                        <option value="rented">Alugado</option>
                                        <option value="maintenance">Em Manutenção</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <ChevronDown className="h-4 w-4 text-gray-500" />
                                    </div>
                                </div>

                                <div className="relative">
                                    <button className="w-full flex items-center justify-center px-4 py-2 bg-white/20 border border-white/20 rounded-lg text-gray-900 hover:bg-white/30 transition-colors">
                                        <ArrowUpDown className="h-5 w-5 mr-2" />
                                        <span>Ordenar</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProperties.map((property, idx) => (
                                <div key={property.id} className="bg-white/25 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-white/20">
                                    <div className="relative h-48">
                                        <Image
                                            src={getValidImage(property.images, localPlaceholderImages[idx % localPlaceholderImages.length], 0)}
                                            alt={property.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover" // w-full h-full is implicit with fill
                                            onError={handleImageError}
                                            data-property-id={property.id}
                                            priority
                                        />
                                        {property.featured && (
                                            <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                                                Destaque
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 flex space-x-1">
                                            <button
                                                onClick={() => handleEditProperty(property)}
                                                className="bg-white/80 hover:bg-white text-gray-800 rounded-full p-1.5"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProperty(property.id)}
                                                className="bg-white/80 hover:bg-white text-red-600 rounded-full p-1.5"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="absolute bottom-2 left-2">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                                                {getStatusText(property.status)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-white truncate">{property.title}</h3>
                                        <div className="flex items-center mt-1 text-white/80">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            <p className="text-sm">{property.location}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center text-white/80">
                                                <DollarSign className="h-4 w-4" />
                                                <span className="text-lg font-bold text-white">R$ {property.price}</span>
                                                <span className="text-xs ml-1">/noite</span>
                                            </div>
                                            <div className="flex space-x-3">
                                                <div className="flex items-center text-white/70">
                                                    <BedDouble className="h-4 w-4 mr-1" />
                                                    <span className="text-xs">{property.bedrooms}</span>
                                                </div>
                                                <div className="flex items-center text-white/70">
                                                    <Bath className="h-4 w-4 mr-1" />
                                                    <span className="text-xs">{property.bathrooms}</span>
                                                </div>
                                                <div className="flex items-center text-white/70">
                                                    <Square className="h-4 w-4 mr-1" />
                                                    <span className="text-xs">{property.area}m²</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredProperties.length === 0 && (
                            <div className="bg-white/25 backdrop-blur-lg rounded-xl shadow-lg p-8 text-center border border-white/20">
                                <Building className="h-12 w-12 text-white/50 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-white mb-2">Nenhum imóvel encontrado</h3>
                                <p className="text-white/70 mb-6">Não encontramos imóveis com os critérios selecionados.</p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterStatus('all');
                                    }}
                                    className="inline-flex items-center px-4 py-2 bg-[#8BADA4] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                                >
                                    Limpar filtros
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Add Modal - placeholder for now */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
                        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">Adicionar Novo Imóvel</h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Botão de importar do Airbnb */}
                            <div className="mb-6">
                                <button
                                    onClick={() => setShowImportModal(true)}
                                    className="flex items-center px-4 py-2 bg-[#8BADA4] text-white rounded-md hover:bg-opacity-90"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Importar do Airbnb
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-4">Informações Básicas</h4>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Título do Imóvel *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                            placeholder="Ex: Apartamento de luxo com vista panorâmica"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Descrição
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleFormChange}
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                            placeholder="Descreva o imóvel detalhadamente..."
                                        ></textarea>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tipo de Imóvel *
                                        </label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                        >
                                            <option value="">Selecione um tipo</option>
                                            {propertyTypes.map((type) => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Localização *
                                        </label>
                                        <MapboxSearch
                                            initialValue={formData.location}
                                            onLocationSelect={handleLocationSelect}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Status *
                                        </label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                        >
                                            <option value="available">Disponível</option>
                                            <option value="rented">Alugado</option>
                                            <option value="maintenance">Em Manutenção</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-700 mb-4">Características e Preço</h4>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Preço por Noite (R$) *
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                                                R$
                                            </span>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleFormChange}
                                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Quartos
                                            </label>
                                            <div className="relative">
                                                <BedDouble className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                                <input
                                                    type="number"
                                                    name="bedrooms"
                                                    value={formData.bedrooms}
                                                    onChange={handleFormChange}
                                                    className="pl-10 w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Banheiros
                                            </label>
                                            <div className="relative">
                                                <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                                <input
                                                    type="number"
                                                    name="bathrooms"
                                                    value={formData.bathrooms}
                                                    onChange={handleFormChange}
                                                    className="pl-10 w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Camas
                                            </label>
                                            <div className="relative">
                                                <BedDouble className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                                <input
                                                    type="number"
                                                    name="beds"
                                                    value={formData.beds}
                                                    onChange={handleFormChange}
                                                    className="pl-10 w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Hóspedes
                                            </label>
                                            <div className="relative">
                                                <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                                <input
                                                    type="number"
                                                    name="guests"
                                                    value={formData.guests}
                                                    onChange={handleFormChange}
                                                    className="pl-10 w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="featured"
                                                name="featured"
                                                checked={formData.featured}
                                                onChange={handleCheckboxChange}
                                                className="h-4 w-4 text-[#8BADA4] focus:ring-[#8BADA4] border-gray-300 rounded"
                                            />
                                            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                                                Destacar este imóvel na plataforma
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <button
                                            type="button"
                                            onClick={handleImageUpload}
                                            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                            </svg>
                                            Adicionar Imagem
                                        </button>

                                        {formData.images.length > 0 && (
                                            <div className="mt-4 mb-10">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Organize a ordem das imagens:</h4>
                                                <div className="grid grid-cols-3 gap-4">
                                                    {formData.images.map((img, index) => {
                                                        // Determine src and unoptimized based on whether img is a File or an object with a URL
                                                        const imgSrc = img.file ? URL.createObjectURL(img.file) : img.url;
                                                        const isExternalOrBlob = !!img.file || (typeof img.url === 'string' && !img.url.startsWith('/'));

                                                        return (
                                                            <div key={img.id} className="relative"> {/* Use img.id for key */}
                                                                <div className="h-20 w-full bg-gray-200 rounded-md overflow-hidden relative">
                                                                    <Image
                                                                        src={imgSrc}
                                                                        alt={`Imagem ${index + 1}`}
                                                                        fill
                                                                        sizes="100px"
                                                                        className="object-cover"
                                                                        onError={handleImageError}
                                                                        unoptimized={isExternalOrBlob ? true : undefined}
                                                                        priority={index === 0}
                                                                    />
                                                                </div>
                                                                <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded-br">
                                                                    #{index + 1}
                                                                </div>
                                                                <div className="absolute right-1 top-1 flex flex-col space-y-1">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => moveFormImageToFirst(index)}
                                                                        disabled={index === 0}
                                                                        className={`bg-white rounded-full p-1 shadow-sm ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                        title="Mover para primeiro"
                                                                    >
                                                                        <Star size={12} className="text-yellow-500" />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => moveFormImageUp(index)}
                                                                        disabled={index === 0}
                                                                        className={`bg-white rounded-full p-1 shadow-sm ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                        title="Mover para cima"
                                                                    >
                                                                        <ArrowUp size={12} className="text-gray-700" />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => moveFormImageDown(index)}
                                                                        disabled={index === formData.images.length - 1}
                                                                        className={`bg-white rounded-full p-1 shadow-sm ${index === formData.images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                        title="Mover para baixo"
                                                                    >
                                                                        <ArrowDown size={12} className="text-gray-700" />
                                                                    </button>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveImage(index)} // This should be handleRemoveImage, not handleRemoveImageLocal for formData.images
                                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                                                >
                                                                    &times;
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Novos campos para informações do frontend */}
                            <div className="mt-8 border-t pt-6 border-gray-200">
                                <h4 className="font-medium text-gray-700 mb-4">Informações do Frontend</h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Avaliação (de 0 a 5)
                                            </label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <input
                                                        type="number"
                                                        name="rating.value"
                                                        value={formData.rating.value}
                                                        onChange={(e) => setFormData({
                                                            ...formData,
                                                            rating: {
                                                                ...formData.rating,
                                                                value: parseFloat(e.target.value)
                                                            }
                                                        })}
                                                        min="0"
                                                        max="5"
                                                        step="0.1"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                                        placeholder="Ex: 4.5"
                                                    />
                                                    <label className="text-xs text-gray-500 mt-1">Valor (0-5)</label>
                                                </div>
                                                <div>
                                                    <input
                                                        type="number"
                                                        name="rating.count"
                                                        value={formData.rating.count}
                                                        onChange={(e) => setFormData({
                                                            ...formData,
                                                            rating: {
                                                                ...formData.rating,
                                                                count: parseInt(e.target.value)
                                                            }
                                                        })}
                                                        min="0"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                                        placeholder="Ex: 42"
                                                    />
                                                    <label className="text-xs text-gray-500 mt-1">Número de avaliações</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Taxa de serviço (R$)
                                            </label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                                                    R$
                                                </span>
                                                <input
                                                    type="number"
                                                    name="serviceFee"
                                                    value={formData.serviceFee}
                                                    onChange={handleFormChange}
                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                                    min="0"
                                                    step="0.01"
                                                    placeholder="Ex: 35"
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h5 className="text-sm font-medium text-gray-700 mb-2">Configuração de Desconto</h5>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Valor</label>
                                                    <input
                                                        type="number"
                                                        name="discountSettings.amount"
                                                        value={formData.discountSettings.amount}
                                                        onChange={(e) => setFormData({
                                                            ...formData,
                                                            discountSettings: {
                                                                ...formData.discountSettings,
                                                                amount: parseFloat(e.target.value)
                                                            }
                                                        })}
                                                        min="0"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                                        placeholder="Ex: 50"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Tipo</label>
                                                    <select
                                                        name="discountSettings.type"
                                                        value={formData.discountSettings.type}
                                                        onChange={(e) => setFormData({
                                                            ...formData,
                                                            discountSettings: {
                                                                ...formData.discountSettings,
                                                                type: e.target.value as 'percentage' | 'fixed'
                                                            }
                                                        })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                                    >
                                                        <option value="fixed">Valor fixo (R$)</option>
                                                        <option value="percentage">Percentual (%)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 mt-2">
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Mínimo de noites</label>
                                                    <input
                                                        type="number"
                                                        name="discountSettings.minNights"
                                                        value={formData.discountSettings.minNights}
                                                        onChange={(e) => setFormData({
                                                            ...formData,
                                                            discountSettings: {
                                                                ...formData.discountSettings,
                                                                minNights: parseInt(e.target.value)
                                                            }
                                                        })}
                                                        min="0"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                                        placeholder="Ex: 3"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Válido de</label>
                                                    <input
                                                        type="date"
                                                        name="discountSettings.validFrom"
                                                        value={formData.discountSettings.validFrom}
                                                        onChange={(e) => setFormData({
                                                            ...formData,
                                                            discountSettings: {
                                                                ...formData.discountSettings,
                                                                validFrom: e.target.value
                                                            }
                                                        })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Válido até</label>
                                                    <input
                                                        type="date"
                                                        name="discountSettings.validTo"
                                                        value={formData.discountSettings.validTo}
                                                        onChange={(e) => setFormData({
                                                            ...formData,
                                                            discountSettings: {
                                                                ...formData.discountSettings,
                                                                validTo: e.target.value
                                                            }
                                                        })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                O que oferecemos (aba do imóvel)
                                            </label>
                                            <div className="relative" ref={amenitiesDropdownRef}>
                                                <button
                                                    type="button"
                                                    className="w-full flex flex-wrap items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#8BADA4] text-left min-h-[44px]"
                                                    onClick={() => setAmenitiesDropdownOpen((open) => !open)}
                                                    aria-haspopup="listbox"
                                                    aria-expanded={amenitiesDropdownOpen}
                                                >
                                                    {formData.amenities.length === 0 ? (
                                                        <span className="text-gray-400">Selecione as comodidades...</span>
                                                    ) : (
                                                        <div className="flex flex-wrap gap-2">
                                                            {formData.amenities.map((amenity) => (
                                                                <span key={amenity} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                                                                    {getAmenityIcon(amenity)}
                                                                    {amenity}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <svg className={`ml-auto w-4 h-4 transition-transform ${amenitiesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                                </button>
                                                {amenitiesDropdownOpen && (
                                                    <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg p-3 max-h-72 overflow-y-auto animate-fade-in">
                                                        {formData.amenities.length > 0 && (
                                                            <button
                                                                type="button"
                                                                className="mb-2 text-xs text-[#8BADA4] hover:underline focus:outline-none"
                                                                onClick={() => setFormData(prev => ({ ...prev, amenities: [] }))}
                                                            >
                                                                Limpar comodidades
                                                            </button>
                                                        )}
                                                        {AMENITIES_BY_CATEGORY.map(({ category, items }) => (
                                                            <div key={category} className="mb-3">
                                                                <div className="font-semibold text-xs text-gray-500 mb-1 uppercase tracking-wide">{category}</div>
                                                                <ul className="space-y-1">
                                                                    {items.map((amenity) => (
                                                                        <li key={amenity}>
                                                                            <label className="flex items-center space-x-2 cursor-pointer px-2 py-1 rounded hover:bg-gray-50">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={formData.amenities.includes(amenity)}
                                                                                    onChange={e => {
                                                                                        const checked = e.target.checked;
                                                                                        setFormData(prev => ({
                                                                                            ...prev,
                                                                                            amenities: checked
                                                                                                ? [...prev.amenities, amenity]
                                                                                                : prev.amenities.filter(a => a !== amenity)
                                                                                        }));
                                                                                    }}
                                                                                    className="form-checkbox h-4 w-4 text-[#8BADA4] border-gray-300 rounded"
                                                                                />
                                                                                {getAmenityIcon(amenity)}
                                                                                <span className="text-sm text-gray-700">{amenity}</span>
                                                                            </label>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* O campo "O que você deve saber (aba do imóvel)" foi removido */}

                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="border-t border-gray-200 p-6 flex justify-end space-x-4 bg-white">
                            <button
                                onClick={() => {
                                    resetForm();
                                    setShowAddModal(false);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAddProperty}
                                className="px-6 py-2 bg-[#8BADA4] text-white rounded-lg hover:bg-opacity-90"
                                disabled={!formData.title || !formData.location || formData.price <= 0}
                            >
                                Adicionar Imóvel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Import Modal */}
            {showImportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] flex flex-col">
                        <div className="p-6 flex-grow overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {isImporting
                                        ? "Importando do Airbnb..."
                                        : importedData
                                            ? "Dados Importados"
                                            : "Importar do Airbnb"
                                    }
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowImportModal(false);
                                        setImportedData(null);
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Show loader if importing */}
                            {isImporting && (
                                <div>
                                    <p className="text-gray-600 mb-4">
                                        Importando dados do Airbnb. Isso pode levar alguns segundos...
                                    </p>

                                    <div className="flex items-center">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-[#8BADA4] h-2.5 rounded-full transition-all duration-300"
                                                style={{ width: `${(importProgress.step / importProgress.total) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="ml-2 text-sm text-gray-500 min-w-[60px]">{importProgress.step}/{importProgress.total}</span>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-2 animate-pulse">
                                        {importProgress.message || 'Extraindo dados do Airbnb...'}
                                    </div>
                                </div>
                            )}

                            {/* Show imported data */}
                            {!isImporting && importedData && (
                                <div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <p className="text-gray-700"><span className="font-medium">Título:</span> {importedData.title}</p>
                                            <p className="text-gray-700"><span className="font-medium">Tipo:</span> {importedData.type || "Não especificado"}</p>
                                            <p className="text-gray-700"><span className="font-medium">Preço por noite:</span> R$ {importedData.pricePerNight?.toFixed(2) || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-700"><span className="font-medium">Quartos:</span> {importedData.bedrooms || 1}</p>
                                            <p className="text-gray-700"><span className="font-medium">Banheiros:</span> {importedData.bathrooms || 1}</p>
                                            <p className="text-gray-700"><span className="font-medium">Hóspedes:</span> {importedData.guests || 1}</p>
                                        </div>
                                    </div>

                                    {/* Display images */}
                                    {importedData.images && importedData.images.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="text-md font-medium mb-2">Imagens encontradas: {importedData.images.length}</h4>
                                            <div className="grid grid-cols-3 gap-2 mt-2">
                                                {importedData.images.slice(0, 6).map((imgStr: string, index: number) => {
                                                    const isValidUrl = typeof imgStr === 'string' && imgStr.startsWith('http');
                                                    const imgSrc = isValidUrl ? imgStr : getValidImage(undefined, localPlaceholderImages[index % localPlaceholderImages.length]);
                                                    const isExternal = isValidUrl && !imgStr.startsWith('/');
                                                    return (
                                                        <div key={index} className="relative h-20 bg-gray-200 rounded-md overflow-hidden">
                                                            <Image
                                                                src={imgSrc}
                                                                alt={`Imagem importada ${index + 1}`}
                                                                fill
                                                                sizes="100px"
                                                                className="object-cover"
                                                                onError={handleImageError}
                                                                unoptimized={isExternal ? true : undefined}
                                                                priority={index === 0}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {importedData.images.length > 6 && (
                                                <p className="text-xs text-gray-500 mt-2">
                                                    + {importedData.images.length - 6} imagens adicionais
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Show URL form if not importing and no imported data */}
                            {!isImporting && !importedData && (
                                <div>
                                    <div className="flex justify-between mb-4">
                                        <p className="text-gray-600">
                                            Cole a URL do anúncio do Airbnb para importar os dados do imóvel automaticamente.
                                        </p>
                                        <ApiStatusIndicator />
                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="importUrl" className="block text-gray-700 mb-2">URL do Airbnb</label>
                                        <input
                                            type="text"
                                            id="importUrl"
                                            value={importUrl}
                                            onChange={(e) => setImportUrl(e.target.value)}
                                            placeholder="https://www.airbnb.com.br/rooms/12345678"
                                            className={`w-full px-4 py-2 border ${importError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]`}
                                            disabled={isImporting}
                                        />
                                        {importError && (
                                            <p className="text-red-500 text-sm mt-2">{importError}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Botões fixos no fundo */}
                        {!isImporting && (
                            <div className="border-t border-gray-200 p-6 flex justify-end space-x-4 bg-white">
                                {importedData ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                setImportedData(null);
                                                setImportUrl('');
                                            }}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleUseImportedData}
                                            className="px-6 py-2 bg-[#8BADA4] text-white rounded-lg hover:bg-opacity-90"
                                        >
                                            Usar Estes Dados
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setShowImportModal(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleImportProperty}
                                            className="px-6 py-2 bg-[#8BADA4] text-white rounded-lg hover:bg-opacity-90 flex items-center justify-center min-w-[140px]"
                                            disabled={!importUrl.trim() || !importUrl.includes('airbnb')}
                                        >
                                            Importar Imóvel
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
                        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">Editar Imóvel</h2>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-4">Informações Básicas</h4>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Título do Imóvel *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                            placeholder="Ex: Apartamento de luxo com vista panorâmica"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Descrição
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleFormChange}
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                            placeholder="Descreva o imóvel detalhadamente..."
                                        ></textarea>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tipo de Imóvel *
                                        </label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                        >
                                            <option value="">Selecione um tipo</option>
                                            {propertyTypes.map((type) => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Localização *
                                        </label>
                                        <MapboxSearch
                                            initialValue={formData.location}
                                            onLocationSelect={handleLocationSelect}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Status *
                                        </label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                        >
                                            <option value="available">Disponível</option>
                                            <option value="rented">Alugado</option>
                                            <option value="maintenance">Em Manutenção</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-700 mb-4">Características e Preço</h4>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Preço por Noite (R$) *
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                                                R$
                                            </span>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleFormChange}
                                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Quartos
                                            </label>
                                            <div className="relative">
                                                <BedDouble className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                                <input
                                                    type="number"
                                                    name="bedrooms"
                                                    value={formData.bedrooms}
                                                    onChange={handleFormChange}
                                                    className="pl-10 w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Banheiros
                                            </label>
                                            <div className="relative">
                                                <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                                <input
                                                    type="number"
                                                    name="bathrooms"
                                                    value={formData.bathrooms}
                                                    onChange={handleFormChange}
                                                    className="pl-10 w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Camas
                                            </label>
                                            <div className="relative">
                                                <BedDouble className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                                <input
                                                    type="number"
                                                    name="beds"
                                                    value={formData.beds}
                                                    onChange={handleFormChange}
                                                    className="pl-10 w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Hóspedes
                                            </label>
                                            <div className="relative">
                                                <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                                <input
                                                    type="number"
                                                    name="guests"
                                                    value={formData.guests}
                                                    onChange={handleFormChange}
                                                    className="pl-10 w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="featured"
                                                name="featured"
                                                checked={formData.featured}
                                                onChange={handleCheckboxChange}
                                                className="h-4 w-4 text-[#8BADA4] focus:ring-[#8BADA4] border-gray-300 rounded"
                                            />
                                            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                                                Destacar este imóvel na plataforma
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <button
                                            type="button"
                                            onClick={handleImageUploadLocal}
                                            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                            </svg>
                                            Adicionar Imagem
                                        </button>

                                        {formData.images.length > 0 && (
                                            <div className="mt-4 mb-10">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Organize a ordem das imagens:</h4>
                                                <div className="grid grid-cols-3 gap-4">
                                                    {formData.images.map((img, index) => {
                                                        // Determine src and unoptimized based on whether img is a File or an object with a URL
                                                        const imgSrc = img.file ? URL.createObjectURL(img.file) : img.url;
                                                        const isExternalOrBlob = !!img.file || (typeof img.url === 'string' && !img.url.startsWith('/'));

                                                        return (
                                                            <div key={img.id} className="relative"> {/* Use img.id for key */}
                                                                <div className="h-20 w-full bg-gray-200 rounded-md overflow-hidden relative">
                                                                    <Image
                                                                        src={imgSrc}
                                                                        alt={`Imagem ${index + 1}`}
                                                                        fill
                                                                        sizes="100px"
                                                                        className="object-cover"
                                                                        onError={handleImageError}
                                                                        unoptimized={isExternalOrBlob ? true : undefined}
                                                                        priority={index === 0}
                                                                    />
                                                                </div>
                                                                <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded-br">
                                                                    #{index + 1}
                                                                </div>
                                                                <div className="absolute right-1 top-1 flex flex-col space-y-1">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => moveFormImageToFirst(index)}
                                                                        disabled={index === 0}
                                                                        className={`bg-white rounded-full p-1 shadow-sm ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                        title="Mover para primeiro"
                                                                    >
                                                                        <Star size={12} className="text-yellow-500" />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => moveFormImageUp(index)}
                                                                        disabled={index === 0}
                                                                        className={`bg-white rounded-full p-1 shadow-sm ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                        title="Mover para cima"
                                                                    >
                                                                        <ArrowUp size={12} className="text-gray-700" />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => moveFormImageDown(index)}
                                                                        disabled={index === formData.images.length - 1}
                                                                        className={`bg-white rounded-full p-1 shadow-sm ${index === formData.images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                        title="Mover para baixo"
                                                                    >
                                                                        <ArrowDown size={12} className="text-gray-700" />
                                                                    </button>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveImage(index)} // This should be handleRemoveImage, not handleRemoveImageLocal for formData.images
                                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                                                >
                                                                    &times;
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Novos campos para informações do frontend */}
                            <div className="mt-8 border-t pt-6 border-gray-200">
                                <h4 className="font-medium text-gray-700 mb-4">Informações do Frontend</h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Avaliação (de 0 a 5)
                                            </label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <input
                                                        type="number"
                                                        name="rating.value"
                                                        value={formData.rating.value}
                                                        onChange={(e) => setFormData({
                                                            ...formData,
                                                            rating: {
                                                                ...formData.rating,
                                                                value: parseFloat(e.target.value)
                                                            }
                                                        })}
                                                        min="0"
                                                        max="5"
                                                        step="0.1"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                                        placeholder="Ex: 4.5"
                                                    />
                                                    <label className="text-xs text-gray-500 mt-1">Valor (0-5)</label>
                                                </div>
                                                <div>
                                                    <input
                                                        type="number"
                                                        name="rating.count"
                                                        value={formData.rating.count}
                                                        onChange={(e) => setFormData({
                                                            ...formData,
                                                            rating: {
                                                                ...formData.rating,
                                                                count: parseInt(e.target.value)
                                                            }
                                                        })}
                                                        min="0"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                                        placeholder="Ex: 42"
                                                    />
                                                    <label className="text-xs text-gray-500 mt-1">Número de avaliações</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Taxa de serviço (R$)
                                            </label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                                                    R$
                                                </span>
                                                <input
                                                    type="number"
                                                    name="serviceFee"
                                                    value={formData.serviceFee}
                                                    onChange={handleFormChange}
                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                                    min="0"
                                                    step="0.01"
                                                    placeholder="Ex: 35"
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h5 className="text-sm font-medium text-gray-700 mb-2">Configuração de Desconto</h5>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Valor</label>
                                                    <input
                                                        type="number"
                                                        name="discountSettings.amount"
                                                        value={formData.discountSettings.amount}
                                                        onChange={(e) => setFormData({
                                                            ...formData,
                                                            discountSettings: {
                                                                ...formData.discountSettings,
                                                                amount: parseFloat(e.target.value)
                                                            }
                                                        })}
                                                        min="0"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                                        placeholder="Ex: 50"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Tipo</label>
                                                    <select
                                                        name="discountSettings.type"
                                                        value={formData.discountSettings.type}
                                                        onChange={(e) => setFormData({
                                                            ...formData,
                                                            discountSettings: {
                                                                ...formData.discountSettings,
                                                                type: e.target.value as 'percentage' | 'fixed'
                                                            }
                                                        })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                                    >
                                                        <option value="fixed">Valor fixo (R$)</option>
                                                        <option value="percentage">Percentual (%)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 mt-2">
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Mínimo de noites</label>
                                                    <input
                                                        type="number"
                                                        name="discountSettings.minNights"
                                                        value={formData.discountSettings.minNights}
                                                        onChange={(e) => setFormData({
                                                            ...formData,
                                                            discountSettings: {
                                                                ...formData.discountSettings,
                                                                minNights: parseInt(e.target.value)
                                                            }
                                                        })}
                                                        min="0"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                                        placeholder="Ex: 3"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Válido de</label>
                                                    <input
                                                        type="date"
                                                        name="discountSettings.validFrom"
                                                        value={formData.discountSettings.validFrom}
                                                        onChange={(e) => setFormData({
                                                            ...formData,
                                                            discountSettings: {
                                                                ...formData.discountSettings,
                                                                validFrom: e.target.value
                                                            }
                                                        })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Válido até</label>
                                                    <input
                                                        type="date"
                                                        name="discountSettings.validTo"
                                                        value={formData.discountSettings.validTo}
                                                        onChange={(e) => setFormData({
                                                            ...formData,
                                                            discountSettings: {
                                                                ...formData.discountSettings,
                                                                validTo: e.target.value
                                                            }
                                                        })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                O que oferecemos (aba do imóvel)
                                            </label>
                                            <div className="relative" ref={amenitiesDropdownRef}>
                                                <button
                                                    type="button"
                                                    className="w-full flex flex-wrap items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#8BADA4] text-left min-h-[44px]"
                                                    onClick={() => setAmenitiesDropdownOpen((open) => !open)}
                                                    aria-haspopup="listbox"
                                                    aria-expanded={amenitiesDropdownOpen}
                                                >
                                                    {formData.amenities.length === 0 ? (
                                                        <span className="text-gray-400">Selecione as comodidades...</span>
                                                    ) : (
                                                        <div className="flex flex-wrap gap-2">
                                                            {formData.amenities.map((amenity) => (
                                                                <span key={amenity} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                                                                    {getAmenityIcon(amenity)}
                                                                    {amenity}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <svg className={`ml-auto w-4 h-4 transition-transform ${amenitiesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                                </button>
                                                {amenitiesDropdownOpen && (
                                                    <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg p-3 max-h-72 overflow-y-auto animate-fade-in">
                                                        {formData.amenities.length > 0 && (
                                                            <button
                                                                type="button"
                                                                className="mb-2 text-xs text-[#8BADA4] hover:underline focus:outline-none"
                                                                onClick={() => setFormData(prev => ({ ...prev, amenities: [] }))}
                                                            >
                                                                Limpar comodidades
                                                            </button>
                                                        )}
                                                        {AMENITIES_BY_CATEGORY.map(({ category, items }) => (
                                                            <div key={category} className="mb-3">
                                                                <div className="font-semibold text-xs text-gray-500 mb-1 uppercase tracking-wide">{category}</div>
                                                                <ul className="space-y-1">
                                                                    {items.map((amenity) => (
                                                                        <li key={amenity}>
                                                                            <label className="flex items-center space-x-2 cursor-pointer px-2 py-1 rounded hover:bg-gray-50">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={formData.amenities.includes(amenity)}
                                                                                    onChange={e => {
                                                                                        const checked = e.target.checked;
                                                                                        setFormData(prev => ({
                                                                                            ...prev,
                                                                                            amenities: checked
                                                                                                ? [...prev.amenities, amenity]
                                                                                                : prev.amenities.filter(a => a !== amenity)
                                                                                        }));
                                                                                    }}
                                                                                    className="form-checkbox h-4 w-4 text-[#8BADA4] border-gray-300 rounded"
                                                                                />
                                                                                {getAmenityIcon(amenity)}
                                                                                <span className="text-sm text-gray-700">{amenity}</span>
                                                                            </label>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* O campo "O que você deve saber (aba do imóvel)" foi removido */}

                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="border-t border-gray-200 p-6 flex justify-end space-x-4 bg-white">
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleUpdateProperty}
                                className="px-6 py-2 bg-[#8BADA4] text-white rounded-lg hover:bg-opacity-90"
                                disabled={!formData.title || !formData.location || formData.price <= 0}
                            >
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Adicionar indicador de progresso de upload nos modais de adição e edição */}
            {isUploadingImages && (
                <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                        Enviando imagens...
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-[#8BADA4] h-2.5 rounded-full"
                            style={{ width: `${imageUploadProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {Math.round(imageUploadProgress)}% concluído
                    </p>
                </div>
            )}

            {/* NOVO MODAL STEPPER */}
            <NewPropertyStepperModal
                isOpen={showNewPropertyModal}
                onClose={() => {
                    setShowNewPropertyModal(false);
                    resetForm(); // <- CHAMAR resetForm AQUI
                }}
                onSaveAttempt={handleSaveFromStepperModal} // <- PASSAR A NOVA FUNÇÃO
                formData={formData}
                setFormData={setFormData}
                handleChange={handleFormChange}
                propertyTypes={propertyTypes}
                handleLocationSelect={handleLocationSelect}
                handleImageUpload={handleImageUpload}
                handleRemoveImage={handleRemoveImage}
                moveFormImageUp={moveFormImageUp}
                moveFormImageDown={moveFormImageDown}
                moveFormImageToFirst={moveFormImageToFirst}
                // Props para "O que você deve saber"
                handleWYSLCheckboxChange={handleWYSLCheckboxChange}
                dynamicInputValues={dynamicInputValues}
                setDynamicInputValues={setDynamicInputValues}
                HOUSE_RULES_ITEMS={HOUSE_RULES_ITEMS}
                SAFETY_PROPERTY_ITEMS={SAFETY_PROPERTY_ITEMS}
                CANCELLATION_POLICY_ITEMS={CANCELLATION_POLICY_ITEMS}
                getPlaceholderDetails={getPlaceholderDetails}
                // Props para Amenities (novas)
                AMENITIES_BY_CATEGORY={AMENITIES_BY_CATEGORY}
                handleAmenityToggle={handleAmenityToggle} // Reutilizando a função existente
                getAmenityIcon={getAmenityIcon} // Passando a função de ícone
            />
        </div>
    );
} 