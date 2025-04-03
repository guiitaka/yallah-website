/**
 * Utilitário para normalizar nomes de comodidades
 */

/**
 * Normaliza nomes de comodidades para o formato padrão usado no formulário
 * @param amenities Lista de comodidades para normalizar
 * @returns Lista de comodidades normalizada
 */
export function normalizeAmenities(amenities: string[]): string[] {
    if (!Array.isArray(amenities) || amenities.length === 0) {
        return [];
    }

    // Mapeamento exato para os nomes usados no formulário
    const exactMappings: Record<string, string> = {
        // Principais comodidades
        'Wi-fi': 'Wi-Fi',
        'Wi fi': 'Wi-Fi',
        'Wifi': 'Wi-Fi',
        'Internet': 'Wi-Fi',
        'Cozinha': 'Cozinha',
        'TV': 'TV',
        'Televisão': 'TV',
        'Televisor': 'TV',
        'Ar-condicionado': 'Ar-condicionado',
        'Ar condicionado': 'Ar-condicionado',
        'Espaço de trabalho': 'Espaço de trabalho',
        'Área de trabalho': 'Espaço de trabalho',
        'Mesa de trabalho': 'Espaço de trabalho',
        'Área dedicada para trabalho': 'Espaço de trabalho',
        'Máquina de lavar': 'Máquina de Lavar',
        'Lavadora': 'Máquina de Lavar',
        'Máquina de lavar roupas': 'Máquina de Lavar',

        // Cozinha e Refeições
        'Geladeira': 'Refrigerador',
        'Refrigerador': 'Refrigerador',
        'Frigorífico': 'Refrigerador',
        'Microondas': 'Microondas',
        'Micro-ondas': 'Microondas',
        'Fogão': 'Fogão',
        'Cooktop': 'Fogão',
        'Forno': 'Forno',

        // Vistas
        'Vista para a montanha': 'Vista para a montanha',
        'Vista das montanhas': 'Vista para a montanha',
        'Vista para as montanhas': 'Vista para a montanha',
        'Vista para o vale': 'Vista para a montanha',
        'Vista para a praia': 'Vista para a praia',
        'Vista da praia': 'Vista para a praia',
        'Vista para o jardim': 'Vista para o jardim',
        'Vista do jardim': 'Vista para o jardim',
        'Vista para o mar': 'Vista para o mar',
        'Vista do mar': 'Vista para o mar',
        'Vista para o oceano': 'Vista para o oceano',
        'Vista do oceano': 'Vista para o oceano',

        // Banheiro
        'Água quente': 'Água quente',
        'Chuveiro com água quente': 'Água quente',
        'Produtos de limpeza': 'Produtos de limpeza',
        'Xampu': 'Xampu',
        'Xampu natura': 'Xampu',
        'Sabonete para o corpo': 'Sabonete para o corpo',
        'Sabonete corporal': 'Sabonete para o corpo',
        'Sabonete natura para o corpo': 'Sabonete para o corpo',
        'Secador de cabelo': 'Secador de cabelo',

        // Estacionamento e Instalações
        'Estacionamento gratuito': 'Estacionamento incluído',
        'Estacionamento incluído': 'Estacionamento incluído',
        'Estacionamento': 'Estacionamento incluído',
        'Estacionamento gratuito nas instalações': 'Estacionamento incluído',
        'Elevador': 'Elevador',
        'Piscina': 'Piscina',

        // Outros
        'Itens essenciais': 'Itens básicos',
        'Itens básicos': 'Itens básicos',
        'Toalhas, lençóis, sabonete e papel higiênico': 'Itens básicos',

        // Segurança
        'Alarme de monóxido de carbono': 'Alarme de monóxido de carbono',
        'Detector de monóxido de carbono': 'Alarme de monóxido de carbono',
        'Detector de fumaça': 'Detector de fumaça',
        'Alarme de fumaça': 'Detector de fumaça',
        'Câmeras de segurança': 'Câmeras de segurança',
        'Câmeras no imóvel': 'Câmeras de segurança',
    };

    // Normalizar cada comodidade
    const normalizedAmenities = amenities.map(amenity => {
        const trimmedAmenity = amenity.trim();
        return exactMappings[trimmedAmenity] || trimmedAmenity;
    });

    // Remover duplicatas
    return Array.from(new Set(normalizedAmenities));
}

/**
 * Categoriza comodidades em grupos definidos
 * @param amenities Lista de comodidades para categorizar
 * @returns Objeto com comodidades categorizadas
 */
export function categorizeAmenities(amenities: string[]): Record<string, string[]> {
    const categories: Record<string, string[]> = {
        kitchen: [],
        bathroom: [],
        bedroom: [],
        entertainment: [],
        outdoor: [],
        views: [],
        safety: [],
        basics: []
    };

    // Mapeamento de palavras-chave para categorias
    const keywordToCategoryMap: Record<string, string> = {
        'wi-fi': 'basics',
        'wifi': 'basics',
        'internet': 'basics',
        'ar-condicionado': 'basics',
        'ar condicionado': 'basics',
        'itens básicos': 'basics',
        'essenciais': 'basics',

        'cozinha': 'kitchen',
        'geladeira': 'kitchen',
        'refrigerador': 'kitchen',
        'fogão': 'kitchen',
        'microondas': 'kitchen',
        'forno': 'kitchen',

        'chuveiro': 'bathroom',
        'banheiro': 'bathroom',
        'água quente': 'bathroom',
        'xampu': 'bathroom',
        'sabonete': 'bathroom',

        'cama': 'bedroom',
        'quarto': 'bedroom',
        'lavadora': 'bedroom',
        'máquina de lavar': 'bedroom',
        'secador': 'bedroom',
        'roupa de cama': 'bedroom',

        'tv': 'entertainment',
        'televisão': 'entertainment',
        'som': 'entertainment',
        'bluetooth': 'entertainment',

        'jardim': 'outdoor',
        'piscina': 'outdoor',
        'varanda': 'outdoor',
        'terraço': 'outdoor',
        'churrasqueira': 'outdoor',

        'vista': 'views',
        'praia': 'views',
        'mar': 'views',
        'montanha': 'views',
        'oceano': 'views',

        'alarme': 'safety',
        'detector': 'safety',
        'segurança': 'safety',
        'câmera': 'safety',
        'extintor': 'safety'
    };

    // Classificar cada comodidade com base nas palavras-chave
    amenities.forEach(amenity => {
        const lowerAmenity = amenity.toLowerCase();
        let categorized = false;

        for (const [keyword, category] of Object.entries(keywordToCategoryMap)) {
            if (lowerAmenity.includes(keyword)) {
                if (!categories[category].includes(amenity)) {
                    categories[category].push(amenity);
                }
                categorized = true;
                break;
            }
        }

        // Se não foi categorizada, criar uma nova categoria baseada na comodidade
        if (!categorized) {
            // Extrair uma palavra significativa para usar como categoria
            const words = lowerAmenity.split(' ');
            let categoryName = '';

            // Tentar encontrar uma palavra significativa (evitar artigos, preposições, etc.)
            const nonSignificantWords = ['o', 'a', 'os', 'as', 'de', 'da', 'do', 'das', 'dos', 'e', 'com', 'para', 'em', 'no', 'na', 'nos', 'nas'];

            for (const word of words) {
                if (word.length > 2 && !nonSignificantWords.includes(word)) {
                    categoryName = word;
                    break;
                }
            }

            // Se não encontrou nenhuma palavra significativa, usar a primeira palavra
            if (!categoryName && words.length > 0) {
                categoryName = words[0];
            }

            // Se ainda não tivermos um nome de categoria, usar "outros"
            if (!categoryName) {
                categoryName = 'outros';
            }

            // Criar a categoria se ela não existir ainda
            if (!categories[categoryName]) {
                categories[categoryName] = [];
            }

            // Adicionar a comodidade à categoria
            if (!categories[categoryName].includes(amenity)) {
                categories[categoryName].push(amenity);
            }
        }
    });

    // Remover categorias vazias
    Object.keys(categories).forEach(category => {
        if (categories[category].length === 0) {
            delete categories[category];
        }
    });

    return categories;
} 