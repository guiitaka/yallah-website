import { useState } from 'react';
import { normalizeAmenities, categorizeAmenities } from '../utils/amenities-utils';

// Definir tipos para os dados importados do Airbnb
interface AirbnbImportedData {
    title: string;
    description: string;
    type: string;
    location: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    beds: number;
    guests: number;
    area: number;
    amenities: string[];
    categorizedAmenities: {
        basics: string[];
        facilities: string[];
        safety: string[];
        kitchen: string[];
        location: string[];
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
    images: string[];
    coordinates: { lat: number; lng: number } | null;
    sourceUrl: string;
}

// Interface para o resultado do scraping em etapas
interface ScrapingStep {
    step: number;
    totalSteps: number;
    status: 'success' | 'partial' | 'error';
    data: any;
    message?: string;
}

// Adicionar tipos para comodidades com ícones
interface Amenity {
    text: string;      // Texto da comodidade
    svgIcon?: string;  // Ícone SVG da comodidade (opcional)
    category?: string; // Categoria da comodidade (opcional)
}

// Atualizar a interface PropertyData se existir para incluir o novo formato de comodidades
export interface PropertyData {
    // ... outros campos
    amenities?: Array<Amenity> | string[] | string;
    // ... outros campos
}

// Normaliza os nomes das comodidades
const normalizeAmenityNames = (amenities: string[]): string[] => {
    const amenityMapping: Record<string, string> = {
        // Principais comodidades
        'wifi': 'Wi-Fi',
        'wi-fi': 'Wi-Fi',
        'internet': 'Wi-Fi',
        'acesso à internet': 'Wi-Fi',
        'rede sem fio': 'Wi-Fi',
        'wireless internet': 'Wi-Fi',

        'ar-condicionado': 'Ar-condicionado',
        'ar condicionado': 'Ar-condicionado',
        'aire acondicionado': 'Ar-condicionado',

        'tv': 'TV',
        'televisão': 'TV',
        'television': 'TV',
        'cabo tv': 'TV',
        'tv com tv por assinatura padrão': 'TV',

        'cozinha': 'Cozinha',
        'kitchen': 'Cozinha',
        'cozinha completa': 'Cozinha',

        'máquina de lavar': 'Máquina de lavar',
        'lavadora': 'Máquina de lavar',
        'secadora': 'Secadora',
        'dryer': 'Secadora',
        'máquina de secar': 'Secadora',

        'geladeira': 'Geladeira',
        'refrigerador': 'Geladeira',
        'microondas': 'Microondas',
        'forno': 'Forno',
        'fogão': 'Fogão',
        'stove': 'Fogão',
        'oven': 'Forno',

        'piscina': 'Piscina',
        'pool': 'Piscina',
        'piscina compartilhada': 'Piscina',

        'estacionamento': 'Estacionamento',
        'estacionamento gratuito': 'Estacionamento',
        'estacionamento grátis': 'Estacionamento',
        'parking': 'Estacionamento',
        'free parking': 'Estacionamento',
        'estacionamento incluído': 'Estacionamento',

        'água quente': 'Água quente',
        'hot water': 'Água quente',

        'toalhas': 'Toalhas',
        'roupa de cama': 'Roupa de cama',
        'bed linens': 'Roupa de cama',
        'body soap': 'Sabonete para o corpo',

        'aquecimento': 'Aquecimento',
        'heating': 'Aquecimento',
        'secador de cabelo': 'Secador de cabelo',
        'hair dryer': 'Secador de cabelo',
        'hairdryer': 'Secador de cabelo',

        'ferro de passar': 'Ferro de passar',
        'tabua de passar': 'Tábua de passar',
        'tábua de passar': 'Tábua de passar',
        'iron': 'Ferro de passar',

        'pátio': 'Pátio',
        'varanda': 'Varanda',
        'sacada': 'Varanda',
        'balcony': 'Varanda',
        'terraço': 'Terraço',
        'terrace': 'Terraço',
        'jardim': 'Jardim',
        'garden': 'Jardim',

        'churrasqueira': 'Churrasqueira',
        'bbq': 'Churrasqueira',
        'churrasco': 'Churrasqueira',

        'lareira': 'Lareira',
        'fireplace': 'Lareira',

        'banheira de hidromassagem': 'Banheira de hidromassagem',
        'jacuzzi': 'Banheira de hidromassagem',
        'hidromassagem': 'Banheira de hidromassagem',
        'spa': 'Spa',

        'academia': 'Academia',
        'gym': 'Academia',
        'academia compartilhada': 'Academia',

        'elevador': 'Elevador',
        'ascensor': 'Elevador',

        // Entretenimento
        'conexão à ethernet': 'Wi-Fi',
        'sistema de som com bluetooth': 'Som',

        // Alarmes
        'alarme de monóxido de carbono': 'Alarme de monóxido de carbono',
        'detector de monóxido de carbono': 'Alarme de monóxido de carbono',
        'detector de fumaça': 'Detector de fumaça',
        'detector de fumaca': 'Detector de fumaça',
        'alarme de fumaça': 'Detector de fumaça',
        'alarme de fumaca': 'Detector de fumaça',

        // Climatização
        'ar-condicionado split': 'Ar-condicionado',
        'lareira interna': 'Lareira',
        'lareira interna: a lenha': 'Lareira',

        // Animais e fumo
        'animais de estimação são permitidos': 'Permitido animais',
        'animais permitidos': 'Permitido animais',
        'aceita animais': 'Permitido animais',
        'permitido animais': 'Permitido animais',
        'permitido fumar': 'Permitido fumar',
        'fumar é permitido': 'Permitido fumar',

        // Ar livre
        'quintal privado': 'Área externa',
        'quintal privado — totalmente cercado': 'Área externa',
        'área de jantar externa': 'Área externa',
        'área externa privada': 'Área externa',
        'área externa': 'Área externa',

        // Outros
        'entrada privada': 'Entrada privada',
        'piscina privativa': 'Piscina',
        'o anfitrião recebe você': 'Recepção pessoal',
    };

    const result: string[] = [];
    const matchDetails: Record<string, { original: string, matched: string }> = {};

    // Para cada comodidade encontrada, tenta normalizar
    amenities.forEach(amenity => {
        // Remove espaços extras e converte para minúsculas
        const cleanedAmenity = amenity.trim().toLowerCase();

        // Verifica se existe uma normalização direta
        if (amenityMapping[cleanedAmenity]) {
            const normalized = amenityMapping[cleanedAmenity];
            result.push(normalized);
            matchDetails[normalized] = { original: amenity, matched: 'direta' };
            return;
        }

        // Busca por correspondência parcial
        for (const [keyword, normalized] of Object.entries(amenityMapping)) {
            if (cleanedAmenity.includes(keyword)) {
                result.push(normalized);
                matchDetails[normalized] = { original: amenity, matched: keyword };
                return;
            }
        }

        // Se não encontrou correspondência, mantém o original mas com primeira letra maiúscula
        const capitalized = amenity.charAt(0).toUpperCase() + amenity.slice(1);
        result.push(capitalized);
        matchDetails[capitalized] = { original: amenity, matched: 'original' };
    });

    // Remove duplicatas usando Array.from em vez do operador spread
    return Array.from(new Set(result));
};

// Adicionar função para sanitizar e corrigir os SVGs
const sanitizeSvg = (svgString: string): string => {
    if (!svgString) return '';

    // Remover atributos desnecessários ou inseguros
    let sanitized = svgString
        .replace(/\s+on\w+="[^"]*"/g, '') // Remove event handlers (onclick, etc)
        .replace(/\s+style="[^"]*"/g, '') // Remove inline styles
        .replace(/\s+class="[^"]*"/g, '') // Remove classes
        .replace(/width="[^"]*"/g, 'width="100%"') // Padroniza width
        .replace(/height="[^"]*"/g, 'height="100%"') // Padroniza height
        .replace(/fill="none"/g, 'fill="currentColor"'); // Melhora a visibilidade

    // Adicionar atributos necessários se não existirem
    if (!sanitized.includes('viewBox')) {
        sanitized = sanitized.replace(/<svg/i, '<svg viewBox="0 0 24 24"');
    }

    // Força cor via CSS para garantir visibilidade
    sanitized = sanitized.replace(/<svg/i, '<svg style="color: #2563eb;" fill="currentColor"');

    return sanitized;
};

export function useAirbnbImport() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState({ step: 0, total: 4, message: '' });

    const importFromAirbnb = async (url: string) => {
        setIsLoading(true);
        setError(null);
        setProgress({ step: 1, total: 4, message: 'Obtendo informações básicas...' });
        console.log('Importando do URL:', url);

        let allData: any = {};

        try {
            // Validação mais flexível para URLs do Airbnb
            const isValidUrl = url && (
                url.includes('airbnb.com') ||
                url.includes('airbnb.com.br')
            ) && url.includes('/rooms/');

            if (!isValidUrl) {
                throw new Error('URL inválida. Por favor, insira uma URL válida do Airbnb no formato: https://www.airbnb.com.br/rooms/NÚMERO_DO_ANÚNCIO');
            }

            // Remover parâmetros de query desnecessários que podem atrapalhar o scraping
            let cleanUrl = url;
            if (url.includes('?')) {
                const urlObj = new URL(url);
                // Manter apenas o parâmetro "check_in" e "check_out" se existirem
                const checkIn = urlObj.searchParams.get('check_in');
                const checkOut = urlObj.searchParams.get('check_out');

                // Limpar todos os parâmetros
                cleanUrl = url.split('?')[0];

                // Adicionar de volta apenas os parâmetros essenciais
                if (checkIn && checkOut) {
                    cleanUrl += `?check_in=${checkIn}&check_out=${checkOut}`;
                }
            }

            console.log('URL limpa para scraping:', cleanUrl);

            // ETAPA 1: Título, descrição e tipo do imóvel
            console.log('Etapa 1: Obtendo título, descrição e tipo do imóvel');
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 55000); // 55 segundos de timeout

                const step1Response = await fetch('/api/scrape-airbnb', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: cleanUrl, step: 1 }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!step1Response.ok) {
                    const errorData = await step1Response.json();
                    if (step1Response.status === 504 || errorData.message?.includes('timeout')) {
                        throw new Error('Os servidores do Airbnb estão congestionados e não foi possível obter os dados neste momento. Por favor, tente novamente mais tarde.');
                    }
                    throw new Error(errorData.error || errorData.message || 'Os servidores do Airbnb estão congestionados e não foi possível obter os dados neste momento. Por favor, tente novamente mais tarde.');
                }

                const step1Result: ScrapingStep = await step1Response.json();
                allData = { ...allData, ...step1Result.data };
                console.log('Etapa 1 concluída:', step1Result);
            } catch (error: any) {
                if (error.name === 'AbortError' || error.message?.includes('aborted')) {
                    throw new Error('Os servidores do Airbnb estão congestionados e não foi possível obter os dados neste momento. Por favor, tente novamente mais tarde.');
                }
                throw error;
            }

            // ETAPA 2: Preço, quartos, banheiros, camas e hóspedes
            setProgress({ step: 2, total: 4, message: 'Obtendo preço e capacidade...' });
            console.log('Etapa 2: Obtendo preço e capacidade');

            try {
                const controller2 = new AbortController();
                const timeoutId2 = setTimeout(() => controller2.abort(), 55000);

                const step2Response = await fetch('/api/scrape-airbnb', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: cleanUrl, step: 2 }),
                    signal: controller2.signal
                });

                clearTimeout(timeoutId2);

                if (!step2Response.ok) {
                    const errorData = await step2Response.json();
                    if (step2Response.status === 504 || errorData.message?.includes('timeout')) {
                        throw new Error('Os servidores do Airbnb estão congestionados e não foi possível obter os dados neste momento. Por favor, tente novamente mais tarde.');
                    }
                    throw new Error(errorData.error || errorData.message || 'Os servidores do Airbnb estão congestionados e não foi possível obter os dados neste momento. Por favor, tente novamente mais tarde.');
                }

                const step2Result: ScrapingStep = await step2Response.json();
                allData = { ...allData, ...step2Result.data };
                console.log('Etapa 2 concluída:', step2Result);
            } catch (error: any) {
                if (error.name === 'AbortError' || error.message?.includes('aborted')) {
                    throw new Error('Os servidores do Airbnb estão congestionados e não foi possível obter os dados neste momento. Por favor, tente novamente mais tarde.');
                }

                // Em caso de erro na etapa 2, não prosseguir com dados incompletos
                throw new Error('Os servidores do Airbnb estão congestionados e não foi possível obter os dados neste momento. Por favor, tente novamente mais tarde.');
            }

            // ETAPA 3: Comodidades
            setProgress({ step: 3, total: 4, message: 'Obtendo comodidades...' });
            console.log('Etapa 3: Obtendo comodidades');

            try {
                const controller3 = new AbortController();
                const timeoutId3 = setTimeout(() => controller3.abort(), 55000);

                const step3Response = await fetch('/api/scrape-airbnb', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: cleanUrl, step: 3 }),
                    signal: controller3.signal
                });

                clearTimeout(timeoutId3);

                if (!step3Response.ok) {
                    const errorData = await step3Response.json();
                    if (step3Response.status === 504 || errorData.message?.includes('timeout')) {
                        throw new Error('Os servidores do Airbnb estão congestionados e não foi possível obter os dados neste momento. Por favor, tente novamente mais tarde.');
                    }
                    throw new Error(errorData.error || errorData.message || 'Os servidores do Airbnb estão congestionados e não foi possível obter os dados neste momento. Por favor, tente novamente mais tarde.');
                }

                const step3Result: ScrapingStep = await step3Response.json();
                allData = { ...allData, ...step3Result.data };
                console.log('Etapa 3 concluída:', step3Result);
            } catch (error: any) {
                if (error.name === 'AbortError' || error.message?.includes('aborted')) {
                    throw new Error('Os servidores do Airbnb estão congestionados e não foi possível obter os dados neste momento. Por favor, tente novamente mais tarde.');
                }

                throw new Error('Os servidores do Airbnb estão congestionados e não foi possível obter os dados neste momento. Por favor, tente novamente mais tarde.');
            }

            // ETAPA 4: Fotos do anúncio
            setProgress({ step: 4, total: 4, message: 'Obtendo fotos do anúncio...' });
            console.log('Etapa 4: Obtendo fotos do anúncio');

            try {
                const controller4 = new AbortController();
                const timeoutId4 = setTimeout(() => controller4.abort(), 55000);

                const step4Response = await fetch('/api/scrape-airbnb', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: cleanUrl, step: 4 }),
                    signal: controller4.signal
                });

                clearTimeout(timeoutId4);

                if (!step4Response.ok) {
                    const errorData = await step4Response.json();
                    if (step4Response.status === 504 || errorData.message?.includes('timeout')) {
                        throw new Error('Os servidores do Airbnb estão congestionados e não foi possível obter os dados neste momento. Por favor, tente novamente mais tarde.');
                    }
                    throw new Error(errorData.error || errorData.message || 'Os servidores do Airbnb estão congestionados e não foi possível obter os dados neste momento. Por favor, tente novamente mais tarde.');
                }

                const step4Result: ScrapingStep = await step4Response.json();
                allData = { ...allData, ...step4Result.data };
                console.log('Etapa 4 concluída:', step4Result);
            } catch (error: any) {
                if (error.name === 'AbortError' || error.message?.includes('aborted')) {
                    throw new Error('Os servidores do Airbnb estão congestionados e não foi possível obter os dados neste momento. Por favor, tente novamente mais tarde.');
                }

                throw new Error('Os servidores do Airbnb estão congestionados e não foi possível obter os dados neste momento. Por favor, tente novamente mais tarde.');
            }

            setProgress({ step: 4, total: 4, message: 'Processando dados...' });

            // Processar todos os dados coletados
            console.log('Todos os dados coletados:', allData);

            // Verificar e tratar as comodidades
            let amenities: string[] = [];
            let amenitiesWithIcons: Amenity[] = [];
            let hasIconsData = false;

            if (allData.amenities) {
                // Verificar se é o novo formato com ícones
                if (Array.isArray(allData.amenities) && allData.amenities.length > 0 &&
                    typeof allData.amenities[0] === 'object' && 'text' in allData.amenities[0]) {

                    hasIconsData = true;
                    const amenityObjects = allData.amenities as Amenity[];

                    // Filtros adicionais para garantir que não importamos itens indesejados
                    amenitiesWithIcons = amenityObjects.filter(item => {
                        const text = item.text;
                        // Remover itens indisponíveis
                        if (text.includes('Indisponível') ||
                            text.includes('indisponível') ||
                            text.includes('Não disponível')) {
                            return false;
                        }

                        // Remover botões "mostrar todas as X comodidades"
                        if (text.match(/Mostrar todas as \d+ comodidades/) ||
                            text.match(/Show all \d+ amenities/)) {
                            return false;
                        }

                        // Remover título "O que esse lugar oferece" 
                        if (text === 'O que esse lugar oferece' ||
                            text === 'What this place offers' ||
                            text === 'O que este lugar oferece') {
                            return false;
                        }

                        return true;
                    });

                    // Extrair textos para compatibilidade com código legado
                    amenities = amenitiesWithIcons.map(item => item.text);
                    console.log(`Recebidas ${amenities.length} comodidades com ícones do scraper`);
                }
                // Formato antigo de array de strings
                else if (Array.isArray(allData.amenities)) {
                    // Filtros adicionais para garantir que não importamos itens indesejados
                    amenities = (allData.amenities as string[]).filter((item: string) => {
                        // Remover itens indisponíveis
                        if (item.includes('Indisponível') ||
                            item.includes('indisponível') ||
                            item.includes('Não disponível')) {
                            return false;
                        }

                        // Remover botões "mostrar todas as X comodidades"
                        if (item.match(/Mostrar todas as \d+ comodidades/) ||
                            item.match(/Show all \d+ amenities/)) {
                            return false;
                        }

                        // Remover título "O que esse lugar oferece" 
                        if (item === 'O que esse lugar oferece' ||
                            item === 'What this place offers' ||
                            item === 'O que este lugar oferece') {
                            return false;
                        }

                        return true;
                    });
                }
                // Formato de string única
                else if (typeof allData.amenities === 'string') {
                    const item = allData.amenities;
                    // Aplicar os mesmos filtros para o caso de ser uma string única
                    if (!item.includes('Indisponível') &&
                        !item.includes('indisponível') &&
                        !item.includes('Não disponível') &&
                        !item.match(/Mostrar todas as \d+ comodidades/) &&
                        !item.match(/Show all \d+ amenities/) &&
                        item !== 'O que esse lugar oferece' &&
                        item !== 'What this place offers' &&
                        item !== 'O que este lugar oferece') {
                        amenities = [item];
                    }
                }

                console.log(`Recebidas ${amenities.length} comodidades do scraper`);

                // Normalizar as comodidades
                amenities = normalizeAmenities(amenities);
                console.log('Comodidades normalizadas:', amenities);

                // Se temos os dados com ícones, normalizar também esses objetos
                if (hasIconsData && amenitiesWithIcons.length > 0) {
                    // Atualizar os textos das comodidades com ícones para usar os normalizados
                    // e sanitizar os SVGs
                    amenitiesWithIcons = amenitiesWithIcons.map((item, index) => ({
                        ...item,
                        text: index < amenities.length ? amenities[index] : item.text,
                        svgIcon: item.svgIcon ? sanitizeSvg(item.svgIcon) : undefined
                    }));

                    console.log('Comodidades com ícones normalizadas:',
                        amenitiesWithIcons.map(a => ({
                            text: a.text,
                            hasIcon: !!a.svgIcon,
                            category: a.category
                        }))
                    );
                }
            } else {
                console.log('Nenhuma comodidade recebida do scraper');
            }

            // Processar fotos obtidas na etapa 4
            let photos: string[] = [];
            if (allData.photos && Array.isArray(allData.photos)) {
                photos = allData.photos;
                console.log(`Recebidas ${photos.length} fotos do scraper`);
            } else {
                console.log('Nenhuma foto recebida do scraper');
            }

            // Filtrar fotos duplicadas e de baixa resolução
            if (photos.length > 0) {
                // Remover fotos com resolução muito baixa (geralmente thumbnails)
                const filteredPhotos = photos.filter(photoUrl => {
                    // Verificar se a URL contém indicadores de resolução baixa
                    const isLowRes = photoUrl.includes('small') ||
                        photoUrl.includes('thumb') ||
                        photoUrl.includes('tiny') ||
                        photoUrl.includes('x_small');
                    return !isLowRes;
                });

                // Se após a filtragem ainda temos muitas fotos, podemos limitar
                const maxPhotos = 20; // Limite de fotos para não sobrecarregar
                if (filteredPhotos.length > maxPhotos) {
                    photos = filteredPhotos.slice(0, maxPhotos);
                    console.log(`Limitando para ${maxPhotos} fotos de alta resolução`);
                } else {
                    photos = filteredPhotos;
                }
            }

            // Categorizar as comodidades para organização
            const categorizedAmenities = amenities.length > 0 ? categorizeAmenities(amenities) : {};

            // Preparar o resultado final
            const result = {
                title: allData.title || '',
                description: allData.description || '',
                type: allData.type || '',
                address: '',
                bedrooms: allData.bedrooms || 1,
                bathrooms: allData.bathrooms || 1,
                beds: allData.beds || 1,
                pricePerNight: allData.price || 0,
                guests: allData.guests || 2,
                amenities,
                amenitiesWithIcons: hasIconsData ? amenitiesWithIcons : undefined,
                categorizedAmenities,
                safetyFeatures: [],
                houseRules: [],
                images: photos,
                sourceUrl: url
            };

            console.log('Resultado final da importação:', result);
            console.log(`Número final de comodidades: ${result.amenities.length}`);
            console.log(`Número final de fotos: ${result.images.length}`);

            setIsLoading(false);
            setProgress({ step: 0, total: 4, message: '' });
            return result;
        } catch (err: any) {
            console.error('Erro durante a importação:', err);
            setError(err.message || 'Erro desconhecido ao importar dados');
            setIsLoading(false);
            setProgress({ step: 0, total: 4, message: '' });
            return null;
        }
    };

    return { importFromAirbnb, isLoading, error, progress };
} 