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
    images: { id: string, url: string }[];
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
}

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
    if (!match) return null;
    const placeholder = match[0]; // e.g., "{time}"
    const placeholderKey = match[1]; // e.g., "time"
    const base = rule.substring(0, match.index); // e.g., "Check-in após "
    let inputType = "text";
    if (placeholderKey === "time" || placeholderKey === "hours") inputType = "time"; // Ajustado para hours também
    if (placeholderKey === "guests") inputType = "number";
    return { placeholder, placeholderKey, base, inputType };
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
function getValidImage(images: string[] | undefined, fallback: string, idx?: number) {
    if (images && images.length > 0) {
        // Se idx for fornecido, tenta pegar a imagem do índice
        const img = typeof idx === 'number' ? images[idx] : images[0];
        if (img && img.trim() !== '') return img;
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
    const [localImages, setLocalImages] = useState<{ id: string, url: string }[]>([]);
    const [showNewPropertyModal, setShowNewPropertyModal] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        id: '',
        title: '',
        description: '',
        type: '',
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
            type: 'fixed',
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
                const newImages = Array.from(target.files).map(file => ({
                    id: uuidv4(),
                    url: URL.createObjectURL(file)
                }));
                setLocalImages(prev => [...prev, ...newImages]);
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
                type: 'fixed',
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
        });
        setLocalImages([]);
        setImageUploadProgress(0);
    };

    const handleAddProperty = async () => {
        try {
            // Preparar os dados da propriedade (sem o ID, que será gerado pelo Firebase)
            const propertyData: any = {
                title: formData.title,
                description: formData.description,
                type: formData.type,
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
                images: formData.images.map(img => img.url),
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
                what_you_should_know_sections: {
                    house_rules: formData.whatYouShouldKnowSections.houseRules.map(rule => {
                        const placeholderDetails = getPlaceholderDetails(rule);
                        if (placeholderDetails && dynamicInputValues[rule]) {
                            return placeholderDetails.base + dynamicInputValues[rule];
                        }
                        return rule;
                    }),
                    safety_property: formData.whatYouShouldKnowSections.safetyProperty,
                    cancellation_policy: formData.whatYouShouldKnowSections.cancellationPolicy
                },
                rating: {
                    value: formData.rating.value,
                    count: formData.rating.count
                },
                whatWeOffer: formData.whatWeOffer,
                whatYouShouldKnowRichText: formData.whatYouShouldKnowRichText,
                serviceFee: formData.serviceFee,
                discountSettings: {
                    amount: formData.discountSettings.amount,
                    type: formData.discountSettings.type,
                    minNights: formData.discountSettings.minNights,
                    validFrom: formData.discountSettings.validFrom ? new Date(formData.discountSettings.validFrom) : undefined,
                    validTo: formData.discountSettings.validTo ? new Date(formData.discountSettings.validTo) : undefined
                },
                whatYouShouldKnowDynamic: {
                    checkInTime: formData.whatYouShouldKnowDynamic?.checkInTime,
                    checkOutTime: formData.whatYouShouldKnowDynamic?.checkOutTime,
                    maxGuests: formData.whatYouShouldKnowDynamic?.maxGuests,
                    quietHours: formData.whatYouShouldKnowDynamic?.quietHours
                },
            };

            // Salvar a propriedade no Firebase
            const propertyId = await saveProperty(propertyData);

            // Converter as URLs de objeto para arquivos (se estiverem na memória)
            // ou manter as URLs remotas
            const imageFiles: File[] = [];
            const remoteUrls: string[] = [];

            // Processar as imagens na ordem correta
            if (formData.images && formData.images.length > 0) {
                setIsUploadingImages(true);

                // Mapa para rastrear a ordem original das imagens
                const imagePositionMap = new Map();

                // Primeiro passo: mapear todas as imagens com sua posição original
                formData.images.forEach((img, index) => {
                    imagePositionMap.set(img.id, {
                        index,
                        isLocal: img.url.startsWith('blob:') || img.url.startsWith('data:')
                    });
                });

                // Segundo passo: separar imagens locais e remotas mantendo rastreamento
                const imageInfo: { id: string, file?: File, url: string, index: number }[] = [];

                for (const img of formData.images) {
                    const originalIndex = imagePositionMap.get(img.id)?.index || 0;

                    // Se for uma URL de objeto local
                    if (img.url.startsWith('blob:') || img.url.startsWith('data:')) {
                        try {
                            // Converter para arquivo
                            const response = await fetch(img.url);
                            const blob = await response.blob();
                            const file = new File([blob], `image-${Date.now()}-${img.id}.jpg`, { type: 'image/jpeg' });
                            imageFiles.push(file);

                            // Rastrear este arquivo para preservar sua ordem
                            imageInfo.push({
                                id: img.id,
                                file,
                                url: img.url,
                                index: originalIndex
                            });

                        } catch (error) {
                            console.error('Erro ao processar imagem local:', error);
                        }
                    } else {
                        // Se for uma URL remota, adicionar diretamente
                        remoteUrls.push(img.url);

                        // Rastrear esta URL para preservar sua ordem
                        imageInfo.push({
                            id: img.id,
                            url: img.url,
                            index: originalIndex
                        });
                    }
                }

                // Fazer upload das imagens
                if (imageFiles.length > 0) {
                    const uploadedUrls = await uploadMultiplePropertyImages(
                        imageFiles,
                        propertyId,
                        (progress) => {
                            setImageUploadProgress(progress);
                        }
                    );

                    // Associar URLs enviadas com as imagens originais para manter a ordem correta
                    let localFileIndex = 0;
                    const orderedImageUrls = imageInfo
                        .sort((a, b) => a.index - b.index) // Ordena pela posição original
                        .map(info => {
                            // Se for uma imagem local que acabou de ser enviada
                            if (info.file) {
                                const url = uploadedUrls[localFileIndex++] || '';
                                return url;
                            }
                            // Se for uma URL remota, mantém a mesma
                            return info.url;
                        });

                    // Atualizar a propriedade com as URLs das imagens na ordem correta
                    await updateProperty(propertyId, {
                        images: orderedImageUrls
                    });
                } else if (remoteUrls.length > 0) {
                    // Se só tiver URLs remotas, ainda garante a ordem correta
                    const orderedRemoteUrls = imageInfo
                        .sort((a, b) => a.index - b.index)
                        .map(info => info.url);

                    await updateProperty(propertyId, { images: orderedRemoteUrls });
                }

                setIsUploadingImages(false);
            }

            // Atualizar a lista na interface
            const newProperty: Property = {
                ...propertyData,
                id: propertyId,
                // Usar as URLs das imagens já processadas
                images: [...remoteUrls, ...imageFiles.map(() => '')]
            };

            setProperties(prev => [...prev, newProperty]);
            resetForm();
            setShowAddModal(false);

            // Recarregar as propriedades para ter os dados atualizados
            loadPropertiesFromFirebase();
        } catch (error) {
            console.error('Erro ao adicionar propriedade:', error);
            alert('Erro ao adicionar propriedade. Tente novamente.');
        }
    };

    // Função para editar uma propriedade
    const handleEditProperty = (property: Property) => {
        setCurrentProperty(property);

        const images: { id: string; url: string }[] = normalizeImages(property.images || []);

        const whatYouShouldKnowSectionsFromDb = (property as any).whatYouShouldKnowSections;
        const processedHouseRulesForForm: string[] = [];
        const initialDynamicValues: Record<string, string> = {};

        // Process House Rules
        if (whatYouShouldKnowSectionsFromDb?.house_rules && Array.isArray(whatYouShouldKnowSectionsFromDb.house_rules)) {
            whatYouShouldKnowSectionsFromDb.house_rules.forEach((filledRule: string) => {
                let matchedTemplate = false;
                for (const templateRule of HOUSE_RULES_ITEMS) {
                    const placeholderDetails = getPlaceholderDetails(templateRule);
                    if (placeholderDetails && filledRule.startsWith(placeholderDetails.base) && filledRule.length > placeholderDetails.base.length) {
                        if (!processedHouseRulesForForm.includes(templateRule)) {
                            processedHouseRulesForForm.push(templateRule);
                        }
                        const dynamicValue = filledRule.replace(placeholderDetails.base, '').trim();
                        if (dynamicValue) {
                            initialDynamicValues[templateRule] = dynamicValue;
                        }
                        matchedTemplate = true;
                        break;
                    }
                }
                if (!matchedTemplate) {
                    if (HOUSE_RULES_ITEMS.includes(filledRule) && !processedHouseRulesForForm.includes(filledRule)) {
                        processedHouseRulesForForm.push(filledRule);
                    }
                }
            });
        }

        // Process Safety Property
        const processedSafetyPropertyForForm: string[] = [];
        if (whatYouShouldKnowSectionsFromDb?.safety_property && Array.isArray(whatYouShouldKnowSectionsFromDb.safety_property)) {
            whatYouShouldKnowSectionsFromDb.safety_property.forEach((item: string) => {
                // Assuming safety items don't have complex dynamic parts like house rules for now
                // So, if the item from DB is one of the predefined SAFETY_PROPERTY_ITEMS, we add that predefined item.
                if (SAFETY_PROPERTY_ITEMS.includes(item) && !processedSafetyPropertyForForm.includes(item)) {
                    processedSafetyPropertyForForm.push(item);
                }
            });
        }

        // Process Cancellation Policy
        const processedCancellationPolicyForForm: string[] = [];
        if (whatYouShouldKnowSectionsFromDb?.cancellation_policy && Array.isArray(whatYouShouldKnowSectionsFromDb.cancellation_policy)) {
            whatYouShouldKnowSectionsFromDb.cancellation_policy.forEach((item: string) => {
                // Assuming cancellation policies don't have complex dynamic parts for now
                if (CANCELLATION_POLICY_ITEMS.includes(item) && !processedCancellationPolicyForForm.includes(item)) {
                    processedCancellationPolicyForForm.push(item);
                }
            });
        }

        setDynamicInputValues(initialDynamicValues);

        const whatYouShouldKnowSectionsForForm = {
            houseRules: processedHouseRulesForForm,
            safetyProperty: processedSafetyPropertyForForm,
            cancellationPolicy: processedCancellationPolicyForForm
        };

        console.log("[handleEditProperty] whatYouShouldKnowSectionsForForm:", JSON.stringify(whatYouShouldKnowSectionsForForm, null, 2));
        console.log("[handleEditProperty] dynamicInputValues para ser setado:", JSON.stringify(initialDynamicValues, null, 2));

        setFormData({
            id: property.id,
            title: property.title,
            description: property.description || '',
            type: property.type,
            location: property.location,
            coordinates: property.coordinates || null,
            price: property.price,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            beds: property.beds || 1,
            guests: property.guests || 2,
            area: property.area,
            status: property.status,
            featured: property.featured,
            images, // Já normalizadas
            amenities: property.amenities || [],
            categorizedAmenities: property.categorizedAmenities || {},
            houseRules: property.houseRules || {
                checkIn: '15:00',
                checkOut: '11:00',
                maxGuests: 2,
                additionalRules: [],
            },
            safety: property.safety || {
                hasCoAlarm: false,
                hasSmokeAlarm: false,
                hasCameras: false,
            },
            cancellationPolicy: property.cancellationPolicy || 'Flexível',
            rating: property.rating || {
                value: 0,
                count: 0
            },
            whatWeOffer: property.whatWeOffer || '',
            whatYouShouldKnowRichText: (property as any).what_you_should_know_rich_text || '',
            serviceFee: property.serviceFee || 0,
            whatYouShouldKnowSections: whatYouShouldKnowSectionsForForm,
            whatYouShouldKnowDynamic: property.whatYouShouldKnowDynamic || {
                checkInTime: '14:00',
                checkOutTime: '11:00',
                maxGuests: property.guests || 2,
                quietHours: '22:00 - 08:00'
            },
            discountSettings: {
                amount: property.discountSettings?.amount ?? 0,
                type: property.discountSettings?.type ?? 'fixed',
                minNights: property.discountSettings?.minNights ?? 0,
                // Garantir que as datas sejam strings no formato YYYY-MM-DD ou vazias
                validFrom: property.discountSettings?.validFrom
                    ? new Date(property.discountSettings.validFrom).toISOString().split('T')[0]
                    : '',
                validTo: property.discountSettings?.validTo
                    ? new Date(property.discountSettings.validTo).toISOString().split('T')[0]
                    : '',
            }
        });

        setLocalImages(normalizeImages(property.images || [])); // Isso é para o modal antigo, pode não ser necessário para o novo se ele usar formData.images
        // setShowEditModal(true); // Comentar ou remover esta linha (modal antigo)
        setShowNewPropertyModal(true); // Adicionar esta linha para abrir o novo modal stepper
    };

    const handleUpdateProperty = async () => {
        if (!currentProperty) return;

        // console.log("[FINAL DEBUG] FormData no início de handleUpdateProperty:", JSON.stringify(formData, null, 2));

        // Log detalhado do estado antes do submit
        // console.log("[DEBUG] Estado do formData no submit:", JSON.stringify(formData, null, 2));

        // Blindagem: garantir que o campo whatYouShouldKnowSections está sempre populado corretamente
        const whatYouShouldKnowSections = {
            houseRules: Array.isArray(formData.whatYouShouldKnowSections?.houseRules) ? formData.whatYouShouldKnowSections.houseRules : [],
            safetyProperty: Array.isArray(formData.whatYouShouldKnowSections?.safetyProperty) ? formData.whatYouShouldKnowSections.safetyProperty : [],
            cancellationPolicy: Array.isArray(formData.whatYouShouldKnowSections?.cancellationPolicy) ? formData.whatYouShouldKnowSections.cancellationPolicy : []
        };

        const whatYouShouldKnowSectionsProcessed = {
            houseRules: (formData.whatYouShouldKnowSections?.houseRules || []).map(rule => {
                const placeholderDetails = getPlaceholderDetails(rule);
                if (placeholderDetails && dynamicInputValues[rule]) {
                    return placeholderDetails.base + dynamicInputValues[rule];
                }
                return rule;
            }),
            safetyProperty: formData.whatYouShouldKnowSections?.safetyProperty || [],
            cancellationPolicy: formData.whatYouShouldKnowSections?.cancellationPolicy || []
        };

        try {
            // Log para debug
            // console.log("DEBUG: whatYouShouldKnowSections antes de salvar:", JSON.stringify(formData.whatYouShouldKnowSections, null, 2));
            // console.log("DEBUG: whatYouShouldKnowDynamic antes de salvar:", JSON.stringify(formData.whatYouShouldKnowDynamic, null, 2));

            // Verificar se há itens selecionados
            const hasSelectedItems =
                whatYouShouldKnowSections.houseRules.length > 0 ||
                whatYouShouldKnowSections.safetyProperty.length > 0 ||
                whatYouShouldKnowSections.cancellationPolicy.length > 0;

            // Preparar os dados atualizados
            // IMPORTANTE: Use localImages que contém a ordem correta das imagens definida pelo usuário
            const propertyData: any = {
                title: formData.title,
                price: formData.price,
                location: formData.location,
                coordinates: formData.coordinates,
                type: formData.type,
                bedrooms: formData.bedrooms,
                bathrooms: formData.bathrooms,
                area: formData.area,
                status: formData.status,
                featured: formData.featured,
                description: formData.description || '',
                beds: formData.beds || 1,
                guests: formData.guests || 2,
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
                // Usamos localImages.map para garantir que a ordem definida pelo usuário seja mantida
                images: localImages.map(img => img.url),
                // CORREÇÃO: Usar a versão garantida das seções para evitar undefined
                what_you_should_know_sections: whatYouShouldKnowSectionsProcessed, // Usar a variável processada aqui
                whatYouShouldKnowDynamic: {
                    checkInTime: formData.whatYouShouldKnowDynamic?.checkInTime,
                    checkOutTime: formData.whatYouShouldKnowDynamic?.checkOutTime,
                    maxGuests: formData.whatYouShouldKnowDynamic?.maxGuests,
                    quietHours: formData.whatYouShouldKnowDynamic?.quietHours
                },
                // Também adicionamos os outros campos do frontend que podem ser úteis
                rating: formData.rating,
                whatWeOffer: formData.whatWeOffer,
                whatYouShouldKnowRichText: formData.whatYouShouldKnowRichText, // Novo campo para o editor de texto rico
                serviceFee: formData.serviceFee,
                discountSettings: {
                    amount: formData.discountSettings.amount,
                    type: formData.discountSettings.type,
                    minNights: formData.discountSettings.minNights,
                    validFrom: formData.discountSettings.validFrom ? new Date(formData.discountSettings.validFrom) : undefined,
                    validTo: formData.discountSettings.validTo ? new Date(formData.discountSettings.validTo) : undefined
                }
            };

            // Log para debug do objeto final que será enviado
            // console.log("DEBUG: Objeto propertyData enviado ao Supabase:", JSON.stringify(propertyData, null, 2));

            // Processar as imagens, mantendo a ordem definida pelo usuário
            const imageFiles: File[] = [];
            const remoteUrls: string[] = [];
            const imageIndexMap = new Map(); // Mapa para manter a ordem original

            if (localImages && localImages.length > 0) {
                setIsUploadingImages(true);

                // Primeiro passo: identificar e mapear todas as imagens com seu índice original
                localImages.forEach((img, index) => {
                    if (img.url.startsWith('blob:') || img.url.startsWith('data:')) {
                        // Marca a posição das imagens locais para preservar a ordem
                        imageIndexMap.set(img.id, { index, type: 'local' });
                    } else {
                        // Marca a posição das imagens remotas para preservar a ordem
                        remoteUrls.push(img.url);
                        imageIndexMap.set(img.id, { index, type: 'remote', url: img.url });
                    }
                });

                // Segundo passo: processar os uploads de imagens novas/locais
                for (const img of localImages) {
                    if (img.url.startsWith('blob:') || img.url.startsWith('data:')) {
                        try {
                            const response = await fetch(img.url);
                            const blob = await response.blob();
                            const file = new File([blob], `image-${Date.now()}-${img.id}.jpg`, { type: 'image/jpeg' });
                            imageFiles.push(file);
                        } catch (error) {
                            console.error('Erro ao processar imagem local:', error);
                        }
                    }
                }

                // Fazer upload apenas das novas imagens
                if (imageFiles.length > 0) {
                    const uploadedUrls = await uploadMultiplePropertyImages(
                        imageFiles,
                        currentProperty.id,
                        (progress) => {
                            setImageUploadProgress(progress);
                        }
                    );

                    // Construir o array final de imagens na ordem correta de localImages
                    let newImageUploadIndex = 0;
                    propertyData.images = localImages.map(img => {
                        if (img.url.startsWith('blob:') || img.url.startsWith('data:')) {
                            // Esta é uma nova imagem que foi carregada
                            // Pega a próxima URL da lista de URLs carregadas
                            if (newImageUploadIndex < uploadedUrls.length) {
                                return uploadedUrls[newImageUploadIndex++];
                            }
                            // Fallback, embora não devesse acontecer se tudo estiver correto
                            return img.url;
                        }
                        // Esta é uma imagem existente (URL remota), mantém a URL
                        return img.url;
                    });
                } else {
                    // Se não houver novos uploads, usa as URLs na ordem definida em localImages
                    propertyData.images = localImages.map(img => img.url);
                }

                setIsUploadingImages(false);
            }

            // Verificar os dados sendo enviados para o Supabase
            // console.log('DEBUG: Enviando para o Supabase:', JSON.stringify(propertyData, null, 2));

            // Atualizar no Supabase
            await updateProperty(currentProperty.id, propertyData);

            // Atualizar a lista localmente com a ordem correta das imagens
            const updatedProperties = properties.map(p => {
                if (p.id === currentProperty.id) {
                    return {
                        ...p,
                        ...propertyData,
                        // Garantir que a propriedade images tenha o valor correto de propertyData.images
                        // que contém a ordem definida pelo usuário
                        images: propertyData.images || []
                    };
                }
                return p;
            });

            setProperties(updatedProperties);
            // console.log("DEBUG: Propriedade atualizada com sucesso. Ordem das imagens salva:", propertyData.images);
            setShowEditModal(false);

            // Recarregar as propriedades para ter os dados atualizados
            loadPropertiesFromFirebase();
        } catch (error) {
            console.error('Erro ao atualizar propriedade:', error);
            alert('Erro ao atualizar propriedade. Tente novamente.');
        }
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
                const newImages = Array.from(target.files).map(file => ({
                    id: uuidv4(),
                    url: URL.createObjectURL(file)
                }));
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, ...newImages]
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
        });

        // Close modal and clear data
        setShowImportModal(false);
        setImportUrl('');
        setImportedData(null);
    };

    // Carregar propriedades do Firebase ao iniciar
    useEffect(() => {
        if (!loading && user) {
            loadPropertiesFromFirebase();
        }
    }, [loading, user]);

    // Função para carregar propriedades do Firebase
    const loadPropertiesFromFirebase = async () => {
        try {
            setLoadingProperties(true);
            const propertiesData = await fetchProperties();

            // Verificar se cada propriedade tem o campo whatYouShouldKnowSections
            const processedProperties = propertiesData.map(property => {
                // Verificar se existe a versão em snake_case do campo 
                // @ts-ignore - O campo pode existir nos dados do Supabase mesmo não estando no tipo
                if (property.what_you_should_know_sections) {
                    // Converter de snake_case para camelCase para manter consistência
                    // @ts-ignore - O campo pode existir nos dados do Supabase
                    property.whatYouShouldKnowSections = property.what_you_should_know_sections;
                    // @ts-ignore - O campo pode existir nos dados do Supabase
                    delete property.what_you_should_know_sections;
                }

                // Garantir que o campo whatYouShouldKnowSections exista
                if (!property.whatYouShouldKnowSections) {
                    property.whatYouShouldKnowSections = {
                        houseRules: [],
                        safetyProperty: [],
                        cancellationPolicy: []
                    };
                }

                // Garantir que todas as subseções existam e sejam arrays
                if (!Array.isArray(property.whatYouShouldKnowSections.houseRules)) {
                    property.whatYouShouldKnowSections.houseRules = [];
                }
                if (!Array.isArray(property.whatYouShouldKnowSections.safetyProperty)) {
                    property.whatYouShouldKnowSections.safetyProperty = [];
                }
                if (!Array.isArray(property.whatYouShouldKnowSections.cancellationPolicy)) {
                    property.whatYouShouldKnowSections.cancellationPolicy = [];
                }

                return property;
            });

            setProperties(processedProperties);
            // console.log("DEBUG: Propriedades carregadas e processadas com sucesso");
        } catch (error) {
            console.error('Erro ao carregar propriedades:', error);
            setProperties([]); // Não usar sampleProperties
        } finally {
            setLoadingProperties(false);
        }
    };

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
                                    onClick={() => setShowAddModal(true)}
                                    className="inline-flex items-center px-4 py-2 bg-[#8BADA4] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                                >
                                    <Plus className="mr-2 h-5 w-5" />
                                    Adicionar Imóvel
                                </button>
                                <button
                                    onClick={() => setShowNewPropertyModal(true)} // Aciona o novo modal
                                    className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
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
                                            width={500}
                                            height={300}
                                            className="w-full h-full object-cover"
                                            onError={handleImageError}
                                            data-property-id={property.id}
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
                                                    {formData.images.map((img, index) => (
                                                        <div key={`image-${index}`} className="relative">
                                                            <div className="h-20 w-full bg-gray-200 rounded-md overflow-hidden">
                                                                <Image
                                                                    src={img.url}
                                                                    alt={`Imagem ${index + 1}`}
                                                                    width={100}
                                                                    height={80}
                                                                    className="w-full h-full object-cover"
                                                                    onError={handleImageError}
                                                                    unoptimized={img.url && !img.url.startsWith('/') ? true : undefined}
                                                                    priority={index === 0}
                                                                    style={{ width: '100%', height: 'auto', aspectRatio: '5/4' }}
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
                                                                onClick={() => handleRemoveImage(index)}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                                            >
                                                                &times;
                                                            </button>
                                                        </div>
                                                    ))}
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
                                                {importedData.images.slice(0, 6).map((img: string, index: number) => (
                                                    <div key={index} className="relative h-20 bg-gray-200 rounded-md overflow-hidden">
                                                        <Image
                                                            src={getValidImage(importedData.images, localPlaceholderImages[index % localPlaceholderImages.length], index)}
                                                            alt={`Imagem ${index + 1}`}
                                                            width={100}
                                                            height={80}
                                                            className="w-full h-full object-cover"
                                                            onError={handleImageError}
                                                            unoptimized={img && !img.startsWith('/') ? true : undefined}
                                                        />
                                                    </div>
                                                ))}
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

                                        {localImages.length > 0 && (
                                            <div className="mt-4 mb-10">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Organize a ordem das imagens:</h4>
                                                <div className="grid grid-cols-3 gap-4">
                                                    {localImages.map((img, index) => (
                                                        <div key={`image-${index}`} className="relative">
                                                            <div className="h-20 w-full bg-gray-200 rounded-md overflow-hidden">
                                                                <Image
                                                                    src={img.url}
                                                                    alt={`Imagem ${index + 1}`}
                                                                    width={100}
                                                                    height={80}
                                                                    className="w-full h-full object-cover"
                                                                    onError={handleImageError}
                                                                    unoptimized={img.url && !img.url.startsWith('/') ? true : undefined}
                                                                    priority={index === 0}
                                                                    style={{ width: '100%', height: 'auto', aspectRatio: '5/4' }}
                                                                />
                                                            </div>
                                                            <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded-br">
                                                                #{index + 1}
                                                            </div>
                                                            <div className="absolute right-1 top-1 flex flex-col space-y-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => moveImageToFirst(index)}
                                                                    disabled={index === 0}
                                                                    className={`bg-white rounded-full p-1 shadow-sm ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                    title="Mover para primeiro"
                                                                >
                                                                    <Star size={12} className="text-yellow-500" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => moveImageUp(index)}
                                                                    disabled={index === 0}
                                                                    className={`bg-white rounded-full p-1 shadow-sm ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                    title="Mover para cima"
                                                                >
                                                                    <ArrowUp size={12} className="text-gray-700" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => moveImageDown(index)}
                                                                    disabled={index === localImages.length - 1}
                                                                    className={`bg-white rounded-full p-1 shadow-sm ${index === localImages.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                    title="Mover para baixo"
                                                                >
                                                                    <ArrowDown size={12} className="text-gray-700" />
                                                                </button>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveImageLocal(index)}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                                            >
                                                                &times;
                                                            </button>
                                                        </div>
                                                    ))}
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

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    O que você deve saber (aba do imóvel)
                                </label>
                                <div className="relative" ref={whatYouShouldKnowDropdownRef}>
                                    <button
                                        type="button"
                                        className="w-full flex flex-wrap items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#8BADA4] text-left min-h-[44px]"
                                        onClick={() => setWhatYouShouldKnowDropdownOpen((open) => !open)}
                                        aria-haspopup="listbox"
                                        aria-expanded={whatYouShouldKnowDropdownOpen}
                                    >
                                        {formData.whatYouShouldKnowSections.houseRules.length === 0 &&
                                            formData.whatYouShouldKnowSections.safetyProperty.length === 0 &&
                                            formData.whatYouShouldKnowSections.cancellationPolicy.length === 0 ? (
                                            <span className="text-gray-400">Selecione regras, segurança e políticas...</span>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {formData.whatYouShouldKnowSections.houseRules.map((rule) => (
                                                    <span key={rule} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                                                        <Clock className="w-3 h-3" />
                                                        {rule}
                                                    </span>
                                                ))}
                                                {formData.whatYouShouldKnowSections.safetyProperty.map((item) => (
                                                    <span key={item} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                                                        <Shield className="w-3 h-3" />
                                                        {item}
                                                    </span>
                                                ))}
                                                {formData.whatYouShouldKnowSections.cancellationPolicy.map((policy) => (
                                                    <span key={policy} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                                                        <Calendar className="w-3 h-3" />
                                                        {typeof policy === 'string' && policy.length > 30 ? policy.substring(0, 30) + '...' : policy}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <svg className={`ml-auto w-4 h-4 transition-transform ${whatYouShouldKnowDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                    {whatYouShouldKnowDropdownOpen && (
                                        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg p-3 max-h-72 overflow-y-auto animate-fade-in">
                                            {(formData.whatYouShouldKnowSections.houseRules.length > 0 ||
                                                formData.whatYouShouldKnowSections.safetyProperty.length > 0 ||
                                                formData.whatYouShouldKnowSections.cancellationPolicy.length > 0) && (
                                                    <button
                                                        type="button"
                                                        className="mb-2 text-xs text-[#8BADA4] hover:underline focus:outline-none"
                                                        onClick={() => setFormData(prev => ({
                                                            ...prev,
                                                            whatYouShouldKnowSections: {
                                                                houseRules: [],
                                                                safetyProperty: [],
                                                                cancellationPolicy: []
                                                            }
                                                        }))}
                                                    >
                                                        Limpar seleções
                                                    </button>
                                                )}

                                            {/* Regras da Casa */}
                                            <div className="mb-6">
                                                <h4 className="font-semibold mb-2 text-gray-700">Regras da Casa</h4>
                                                <div className="space-y-1">
                                                    {HOUSE_RULES_ITEMS.map((ruleItem) => {
                                                        // Correctly check if the item is in the houseRules array
                                                        const isChecked = formData.whatYouShouldKnowSections.houseRules.includes(ruleItem);
                                                        const placeholderDetails = getPlaceholderDetails(ruleItem);

                                                        return (
                                                            <div key={ruleItem} className="p-2 border rounded-md bg-gray-50">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center">
                                                                        <Checkbox
                                                                            id={`hr-${ruleItem}`}
                                                                            checked={isChecked}
                                                                            onCheckedChange={(checkedState: boolean | 'indeterminate') => {
                                                                                handleWYSLCheckboxChange(ruleItem, !!checkedState, 'houseRules');
                                                                            }}
                                                                            className="mr-3 flex-shrink-0"
                                                                        />
                                                                        {isChecked && <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />}
                                                                        <label htmlFor={`hr-${ruleItem}`} className="text-sm text-gray-800 cursor-pointer">
                                                                            {placeholderDetails ? placeholderDetails.base : ruleItem}
                                                                            {placeholderDetails && !isChecked && (
                                                                                <span className="ml-1 text-xs text-gray-400 italic">
                                                                                    {placeholderDetails.placeholder} (customizável ao marcar)
                                                                                </span>
                                                                            )}
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                {isChecked && placeholderDetails && (
                                                                    <div className="mt-2 pl-8 flex items-center space-x-2">
                                                                        <Input
                                                                            type={placeholderDetails.inputType}
                                                                            placeholder={placeholderDetails.placeholderKey}
                                                                            value={dynamicInputValues[ruleItem] || ""}
                                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDynamicInputValues(prev => ({ // Tipado explicitamente
                                                                                ...prev,
                                                                                [ruleItem]: e.target.value
                                                                            }))}
                                                                            className="p-1.5 border rounded-md text-sm h-9 flex-grow min-w-0"
                                                                        />
                                                                        {dynamicInputValues[ruleItem] && (
                                                                            <span className="text-xs text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis flex items-center">
                                                                                <Check className="w-4 h-4 text-green-500 mr-1 flex-shrink-0" />
                                                                                Final: {placeholderDetails.base}<span className="font-medium">{dynamicInputValues[ruleItem]}</span>
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Segurança e Propriedade */}
                                            <div className="mb-3">
                                                <div className="font-semibold text-xs text-gray-500 mb-1 uppercase tracking-wide">SEGURANÇA E PROPRIEDADE</div>
                                                <ul className="space-y-1">
                                                    {SAFETY_PROPERTY_ITEMS.map((item) => {
                                                        const isChecked = formData.whatYouShouldKnowSections.safetyProperty.includes(item);
                                                        return (
                                                            <li key={item}>
                                                                <label className="flex items-center space-x-2 cursor-pointer px-2 py-1 rounded hover:bg-gray-50">
                                                                    <Checkbox // Usando o componente Checkbox
                                                                        id={`safety-${item}`}
                                                                        checked={isChecked}
                                                                        onCheckedChange={(checkedState: boolean | 'indeterminate') => {
                                                                            handleWYSLCheckboxChange(item, !!checkedState, 'safetyProperty');
                                                                        }}
                                                                        className="mr-1 flex-shrink-0" // Ajustado mr-1 e adicionado flex-shrink-0
                                                                    />
                                                                    {isChecked && <Check className="w-4 h-4 text-green-500 mr-1 flex-shrink-0" />}
                                                                    <Shield className="w-4 h-4 text-gray-500 mr-1 flex-shrink-0" />
                                                                    <span className="text-sm text-gray-700">{item}</span>
                                                                </label>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>

                                            {/* Política de Cancelamento */}
                                            <div className="mb-3">
                                                <div className="font-semibold text-xs text-gray-500 mb-1 uppercase tracking-wide">POLÍTICA DE CANCELAMENTO</div>
                                                <ul className="space-y-1">
                                                    {CANCELLATION_POLICY_ITEMS.map((policy) => {
                                                        const isChecked = formData.whatYouShouldKnowSections.cancellationPolicy.includes(policy);
                                                        return (
                                                            <li key={policy}>
                                                                <label className="flex items-center space-x-2 cursor-pointer px-2 py-1 rounded hover:bg-gray-50">
                                                                    <Checkbox // Usando o componente Checkbox
                                                                        id={`cancel-${policy}`}
                                                                        checked={isChecked}
                                                                        onCheckedChange={(checkedState: boolean | 'indeterminate') => {
                                                                            handleWYSLCheckboxChange(policy, !!checkedState, 'cancellationPolicy');
                                                                        }}
                                                                        className="mr-1 flex-shrink-0"
                                                                    />
                                                                    {isChecked && <Check className="w-4 h-4 text-green-500 mr-1 flex-shrink-0" />}
                                                                    <Calendar className="w-4 h-4 text-gray-500 mr-1 flex-shrink-0" />
                                                                    <span className="text-sm text-gray-700">{policy}</span>
                                                                </label>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Novo campo: Editor de Texto Rico para "O que você deve saber" */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Conteúdo Adicional - O que você deve saber (Editor Rico)
                                </label>
                                <div className="text-xs text-gray-500 mb-2">
                                    Use este editor para adicionar informações personalizadas e formatadas que aparecerão na aba "O que você deve saber" do frontend.
                                </div>
                                <div className="border border-gray-300 rounded-md overflow-hidden">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.whatYouShouldKnowRichText}
                                        onChange={(content, delta, source, editor) => {
                                            // console.log("ReactQuill content:", content);
                                            setFormData(prev => ({
                                                ...prev,
                                                whatYouShouldKnowRichText: content
                                            }));
                                        }}
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, 3, false] }],
                                                ['bold', 'italic', 'underline'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                ['link'],
                                                ['clean']
                                            ],
                                        }}
                                        formats={[
                                            'header',
                                            'bold', 'italic', 'underline',
                                            'list', 'bullet',
                                            'link'
                                        ]}
                                        placeholder="Digite informações adicionais que os hóspedes devem saber..."
                                        style={{ minHeight: '150px' }}
                                    />
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