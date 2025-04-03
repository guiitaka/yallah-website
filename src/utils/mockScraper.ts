/**
 * Simulador de scraping do Airbnb para desenvolvimento e quando a API estiver offline
 */

interface MockScraperResult {
    title: string;
    description: string;
    type: string;
    address: string;
    bedrooms: number;
    bathrooms: number;
    beds: number;
    pricePerNight: number;
    guests: number;
    amenities: string[];
    amenitiesWithIcons?: any[];
    categorizedAmenities: Record<string, string[]>;
    images: string[];
    sourceUrl: string;
}

// Lista de amenidades simuladas
const mockAmenities = [
    'Wi-Fi', 'TV', 'Cozinha completa', 'Máquina de lavar',
    'Ar condicionado', 'Aquecimento', 'Jacuzzi', 'Piscina',
    'Estacionamento gratuito', 'Academia', 'Secador de cabelo',
    'Ferro de passar', 'Itens essenciais', 'Berço', 'Elevador',
    'Café da manhã', 'Espaço de trabalho', 'Alarme de incêndio',
    'Detector de monóxido de carbono'
];

// Lista de imagens de exemplo para usar quando offline
const mockImages = [
    '/card1.jpg',
    '/card2.jpg',
    '/card3.jpg',
    '/card4.jpg'
];

/**
 * Simula uma importação do Airbnb para desenvolvimento local
 * @param url URL do Airbnb (ignorada no modo simulado)
 * @returns Dados simulados de propriedade
 */
export function mockScrapeAirbnb(url: string): Promise<MockScraperResult> {
    console.log('🔸 Usando o simulador de scraping para a URL:', url);

    // Extrair o ID da propriedade da URL, se disponível
    let propertyId = 'mockProperty';
    try {
        const match = url.match(/\/rooms\/(\d+)/);
        if (match && match[1]) {
            propertyId = match[1];
        }
    } catch (e) {
        console.warn('Não foi possível extrair ID da propriedade da URL');
    }

    // Simular um tempo de resposta realista
    return new Promise((resolve) => {
        setTimeout(() => {
            // Selecionar aleatoriamente entre 8-15 amenidades
            const numAmenities = Math.floor(Math.random() * 8) + 8;
            const selectedAmenities = [...mockAmenities]
                .sort(() => 0.5 - Math.random())
                .slice(0, numAmenities);

            // Categorizar amenidades
            const categorizedAmenities = {
                'Básico': selectedAmenities.slice(0, 4),
                'Cozinha e refeições': selectedAmenities.slice(4, 6),
                'Características': selectedAmenities.slice(6, 8),
                'Segurança': selectedAmenities.slice(8),
            };

            // Criar resultado simulado
            const result: MockScraperResult = {
                title: `Apartamento em São Paulo #${propertyId}`,
                description: 'Este lindo apartamento está localizado no coração da cidade, próximo a restaurantes, cafés e atrações turísticas. Totalmente reformado com acabamentos de luxo, oferece uma estadia confortável para quem procura relaxar depois de um dia agitado.',
                type: 'Apartamento',
                address: 'Rua Exemplo, 123 - São Paulo, SP',
                bedrooms: Math.floor(Math.random() * 3) + 1,
                bathrooms: Math.floor(Math.random() * 2) + 1,
                beds: Math.floor(Math.random() * 4) + 1,
                pricePerNight: Math.floor(Math.random() * 500) + 150,
                guests: Math.floor(Math.random() * 6) + 2,
                amenities: selectedAmenities,
                categorizedAmenities,
                images: [...mockImages],
                sourceUrl: url
            };

            resolve(result);
        }, 1500); // Simular uma requisição de 1.5 segundos
    });
} 