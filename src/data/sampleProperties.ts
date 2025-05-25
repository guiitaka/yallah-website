// Definição da interface Property
export interface Property {
    id: string;
    title: string;
    description?: string;
    type: string;
    location: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    beds?: number;
    guests?: number;
    area: number;
    status: 'available' | 'rented' | 'maintenance';
    images: string[];
    featured: boolean;
    amenities?: string[];
    categorizedAmenities?: {
        [key: string]: string[];
    };
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
    cancellationPolicy?: string;
    coordinates?: { lat: number; lng: number } | null;
    sourceUrl?: string;
    rating?: {
        value: number;
        count: number;
    };
    whatWeOffer?: string;
    whatYouShouldKnow?: string;
    whatYouShouldKnowRichText?: string;
    serviceFee?: number;
    discountSettings?: {
        amount: number;
        type: 'percentage' | 'fixed';
        minNights?: number;
        validFrom?: Date;
        validTo?: Date;
    };
    // Novos campos para as seções "O que você deve saber"
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
    pointsOfInterest?: string[];
}

// Dados de exemplo para as propriedades
export const sampleProperties: Property[] = [
    {
        id: '1',
        title: 'Apartamento de luxo com vista panorâmica',
        price: 350,
        location: 'Brooklin, São Paulo',
        type: 'Apartamento',
        bedrooms: 2,
        bathrooms: 2,
        beds: 2,
        guests: 4,
        area: 120,
        status: 'available',
        images: ['/card1.jpg'],
        featured: true,
        description: 'Luxuoso apartamento com vista panorâmica da cidade, totalmente mobiliado e decorado.',
        amenities: ['Wi-Fi', 'TV', 'Ar condicionado', 'Cozinha completa'],
        houseRules: {
            checkIn: '15:00',
            checkOut: '11:00',
            maxGuests: 4,
            additionalRules: ['Não é permitido festas', 'Não é permitido fumar']
        },
        safety: {
            hasCoAlarm: true,
            hasSmokeAlarm: true,
            hasCameras: false
        }
    },
    {
        id: '2',
        title: 'Casa espaçosa com jardim',
        price: 500,
        location: 'Vila Mariana, São Paulo',
        type: 'Casa',
        bedrooms: 3,
        bathrooms: 2,
        beds: 3,
        guests: 6,
        area: 200,
        status: 'rented',
        images: ['/card2.jpg'],
        featured: false,
        description: 'Casa espaçosa com jardim privativo, perfeita para famílias.',
        amenities: ['Wi-Fi', 'TV', 'Jardim', 'Churrasqueira'],
        houseRules: {
            checkIn: '14:00',
            checkOut: '12:00',
            maxGuests: 6,
            additionalRules: ['Pets são permitidos', 'Não é permitido fumar dentro da casa']
        },
        safety: {
            hasCoAlarm: false,
            hasSmokeAlarm: true,
            hasCameras: true
        }
    },
    {
        id: '3',
        title: 'Studio moderno no centro',
        price: 280,
        location: 'Centro, São Paulo',
        type: 'Studio',
        bedrooms: 1,
        bathrooms: 1,
        beds: 1,
        guests: 2,
        area: 60,
        status: 'available',
        images: ['/card3.jpg'],
        featured: true,
        description: 'Studio moderno e compacto, localizado no coração da cidade.',
        amenities: ['Wi-Fi', 'TV', 'Cozinha compacta'],
        houseRules: {
            checkIn: '15:00',
            checkOut: '11:00',
            maxGuests: 2,
            additionalRules: ['Não é permitido festas', 'Silêncio após 22h']
        },
        safety: {
            hasCoAlarm: true,
            hasSmokeAlarm: true,
            hasCameras: false
        }
    },
    {
        id: '4',
        title: 'Flat com serviços integrados',
        price: 320,
        location: 'Pinheiros, São Paulo',
        type: 'Flat',
        bedrooms: 1,
        bathrooms: 1,
        beds: 1,
        guests: 2,
        area: 70,
        status: 'maintenance',
        images: ['/card4.jpg'],
        featured: false,
        description: 'Flat moderno com serviços de hotel inclusos.',
        amenities: ['Wi-Fi', 'TV', 'Serviço de quarto', 'Academia'],
        houseRules: {
            checkIn: '14:00',
            checkOut: '12:00',
            maxGuests: 2,
            additionalRules: ['Café da manhã incluso', 'Serviço de limpeza diário']
        },
        safety: {
            hasCoAlarm: true,
            hasSmokeAlarm: true,
            hasCameras: true
        }
    },
    {
        id: '5',
        title: 'Cobertura com terraço',
        price: 650,
        location: 'Moema, São Paulo',
        type: 'Cobertura',
        bedrooms: 3,
        bathrooms: 3,
        beds: 3,
        guests: 6,
        area: 230,
        status: 'available',
        images: ['/card1.jpg'],
        featured: true,
        description: 'Luxuosa cobertura duplex com terraço panorâmico e piscina privativa.',
        amenities: ['Wi-Fi', 'TV', 'Piscina privativa', 'Churrasqueira'],
        houseRules: {
            checkIn: '15:00',
            checkOut: '11:00',
            maxGuests: 6,
            additionalRules: ['Não é permitido festas', 'Adequado para famílias']
        },
        safety: {
            hasCoAlarm: true,
            hasSmokeAlarm: true,
            hasCameras: false
        }
    }
]; 