import { NextResponse } from 'next/server';
import puppeteer, { Page } from 'puppeteer-core';
import chrome from '@sparticuz/chromium';

// Marcar este arquivo como apenas servidor para evitar que o Next.js tente bundlar no cliente
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Helper function for timeout that works regardless of Puppeteer version
const safeWaitForTimeout = async (page: Page | ExtendedPage, timeout: number) => {
    if (typeof (page as ExtendedPage).waitForTimeout === 'function') {
        await (page as ExtendedPage).waitForTimeout(timeout);
    } else {
        // Fallback if waitForTimeout is not available
        await new Promise(resolve => setTimeout(resolve, timeout));
    }
};

// Define os tipos para retornos parciais
interface ScrapeResult {
    status: 'success' | 'partial' | 'error';
    data: any;
    step: number;
    totalSteps: number;
    message?: string;
}

// Type definitions for puppeteer extensions
interface ExtendedPage extends Page {
    route(url: string, handler: (route: any) => void): Promise<void>;
    waitForTimeout(timeout: number): Promise<void>;
}

// Add type for photos array
type PhotoUrl = string;

// Adicionar interface para a estrutura de comodidades com ícones
interface Amenity {
    text: string;       // O texto da comodidade
    svgIcon?: string;   // O código SVG do ícone, opcional pois nem todas comodidades terão ícone
    category?: string;  // Categoria da comodidade (opcional)
}

export async function POST(request: Request) {
    try {
        const { url, step = 1 } = await request.json();

        if (!url || !url.includes('airbnb.com')) {
            return NextResponse.json(
                { error: 'URL inválida. Por favor, forneça uma URL válida do Airbnb' },
                { status: 400 }
            );
        }

        console.log(`Iniciando scraping da URL: ${url}, Etapa: ${step}`);

        // Iniciar browser com configuração ajustada para Vercel
        const executablePath = process.env.NODE_ENV === 'production'
            ? await chrome.executablePath()
            : process.env.PUPPETEER_EXECUTABLE_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

        const browser = await puppeteer.launch({
            headless: true,
            args: [...chrome.args, '--disable-web-security', '--no-sandbox'],
            executablePath,
            ignoreDefaultArgs: ['--disable-extensions'],
            // @ts-ignore - ignoring TypeScript errors for Vercel deployment compatibility
        });

        const page = await browser.newPage() as unknown as ExtendedPage;

        // Timeout para caso a página não carregue
        await page.setDefaultNavigationTimeout(60000);

        // Configurar viewport com tamanho grande para garantir que imagens lazy-loaded sejam carregadas
        await page.setViewport({ width: 1920, height: 1080 });

        // Interceptar requisições de imagem para melhorar performance
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            const resourceType = req.resourceType();
            if ((resourceType === 'image' || resourceType === 'font' || resourceType === 'media') && step !== 4) {
                // Permitir requisições de imagem na etapa 4
                req.abort();
            } else {
                req.continue();
            }
        });

        console.log('Acessando a página...');
        await page.goto(url, { waitUntil: 'networkidle2' });
        console.log('Página carregada, extraindo dados...');

        let result: ScrapeResult = {
            status: 'partial',
            data: {},
            step: step,
            totalSteps: 4  // Atualizar para 4 etapas
        };

        // ETAPA 1: Título do imóvel, descrição e tipo de imóvel
        if (step === 1) {
            console.log('Executando Etapa 1: Título, descrição e tipo de imóvel');
            const basicInfoData = await page.evaluate(() => {
                // Título
                const title = document.querySelector('h1')?.textContent?.trim() || '';

                // Descrição
                const description = document.querySelector('[data-section-id="DESCRIPTION_DEFAULT"]')?.textContent?.trim() || '';

                // Tipo de imóvel (extraído do título ou da descrição)
                let type = '';
                const typeKeywords = {
                    'apartamento': ['apartamento', 'apto', 'flat', 'loft'],
                    'casa': ['casa', 'chácara', 'sítio', 'fazenda', 'rancho'],
                    'chalé': ['chalé', 'chale', 'cabana', 'cabin'],
                    'quarto': ['quarto', 'suíte', 'suite', 'room']
                };

                const lowerTitle = title.toLowerCase();
                const lowerDesc = description.toLowerCase();

                for (const [propertyType, keywords] of Object.entries(typeKeywords)) {
                    for (const keyword of keywords) {
                        if (lowerTitle.includes(keyword) || lowerDesc.includes(keyword)) {
                            type = propertyType;
                            break;
                        }
                    }
                    if (type) break;
                }

                // Se não encontrar um tipo específico, usar "Outro"
                if (!type) {
                    type = 'outro';
                }

                return { title, description, type };
            });

            result.data = basicInfoData;
            result.status = 'partial';
            result.message = 'Informações básicas extraídas com sucesso';

            await browser.close();
            return NextResponse.json(result);
        }

        // ETAPA 2: Preço por noite, quartos, banheiros, camas, hóspedes
        else if (step === 2) {
            console.log('Executando Etapa 2: Preço e capacidade');

            const priceAndCapacityData = await page.evaluate(() => {
                // Preço - Extrair preço total e número de noites para calcular preço por noite
                let pricePerNight = 0;
                let totalPrice = 0;
                let numberOfNights = 1;

                // Função para tratar corretamente preços no formato brasileiro
                const cleanBrazilianPrice = (priceText: string): number => {
                    // Remover tudo que não for número, ponto ou vírgula
                    let cleaned = priceText.replace(/[^0-9,.]/g, '');
                    console.log('Preço original:', priceText, '-> Após limpeza inicial:', cleaned);

                    // Verificar se parece ser um preço no formato brasileiro com separador de milhares
                    if (cleaned.includes('.') && !cleaned.includes(',')) {
                        // Formato R$ 1.048 (sem centavos) - interpretar como 1048
                        cleaned = cleaned.replace(/\./g, '');
                        console.log('Tratando como número sem decimal:', cleaned);
                        return parseFloat(cleaned);
                    } else if (cleaned.includes(',') && cleaned.indexOf(',') === cleaned.length - 3) {
                        // Formato R$ 1.048,00 - interpretar como 1048.00
                        cleaned = cleaned.replace(/\./g, '').replace(',', '.');
                        console.log('Tratando como número com decimal:', cleaned);
                        return parseFloat(cleaned);
                    } else if (cleaned.includes(',')) {
                        // Outro formato com vírgula - substituir vírgula por ponto
                        cleaned = cleaned.replace(',', '.');
                        console.log('Tratando como número com vírgula:', cleaned);
                        return parseFloat(cleaned);
                    }

                    // Se não tiver formatação especial, converter diretamente
                    console.log('Tratando como número simples:', cleaned);
                    return parseFloat(cleaned);
                };

                // Método 1: Tentar extrair o preço do botão de detalhamento
                const priceButton = document.querySelector('button._194r9nk1');
                if (priceButton) {
                    const priceSpan = priceButton.querySelector('span.u1qzfr7o');
                    if (priceSpan) {
                        const priceText = priceSpan.textContent || '';
                        console.log('Preço extraído (Método 1):', priceText);
                        totalPrice = cleanBrazilianPrice(priceText);
                    }
                }

                // Método 1.5: Método alternativo diretamente pela estrutura HTML que o usuário identificou
                if (totalPrice === 0) {
                    const priceDiv = document.querySelector('div._10d7v0r');
                    if (priceDiv) {
                        const priceSpan = priceDiv.querySelector('span.u1qzfr7o');
                        if (priceSpan) {
                            const priceText = priceSpan.textContent || '';
                            console.log('Preço extraído (Método 1.5 - Direto):', priceText);
                            totalPrice = cleanBrazilianPrice(priceText);
                        } else {
                            console.log('Span u1qzfr7o não encontrado dentro de div._10d7v0r');
                        }
                    } else {
                        console.log('Div _10d7v0r não encontrada');
                    }
                }

                // Método 2: Tentar extrair o preço do elemento span diretamente
                if (totalPrice === 0) {
                    const priceSpan = document.querySelector('span.u1qzfr7o');
                    if (priceSpan) {
                        const priceText = priceSpan.textContent || '';
                        console.log('Preço extraído (Método 2):', priceText);
                        totalPrice = cleanBrazilianPrice(priceText);
                    }
                }

                // Método 2.5: Buscar todos os spans com classe u1qzfr7o e verificar o que parece ser um preço
                if (totalPrice === 0) {
                    const priceSpans = document.querySelectorAll('span.u1qzfr7o');
                    console.log(`Encontrados ${priceSpans.length} spans com classe u1qzfr7o`);

                    priceSpans.forEach((span) => {
                        if (totalPrice > 0) return; // Já encontrou um preço, não precisa continuar

                        const priceText = span.textContent || '';
                        // Verificar se contém formato de preço (R$ seguido de números)
                        if (priceText.match(/R\$\s*[\d.,]+/)) {
                            console.log('Preço extraído (Método 2.5 - Todos spans):', priceText);
                            totalPrice = cleanBrazilianPrice(priceText);
                        }
                    });
                }

                // Método 3: Tentar extrair o preço do container principal
                if (totalPrice === 0) {
                    const priceContainer = document.querySelector('div._1xm48ww');
                    if (priceContainer) {
                        const priceText = priceContainer.textContent || '';
                        const priceMatch = priceText.match(/R\$\s*([\d.,]+)/);
                        if (priceMatch && priceMatch[1]) {
                            console.log('Preço extraído (Método 3):', priceMatch[1]);
                            totalPrice = cleanBrazilianPrice(priceMatch[1]);
                        }
                    }
                }

                // Calcular preço por noite
                if (totalPrice > 0 && numberOfNights > 0) {
                    pricePerNight = totalPrice / numberOfNights;
                    console.log(`Calculando preço por noite: ${totalPrice} / ${numberOfNights} = ${pricePerNight}`);
                } else {
                    pricePerNight = totalPrice;
                    console.log(`Usando preço total como preço por noite: ${totalPrice}`);
                }

                // Capacidade (quartos, banheiros, camas, hóspedes)
                const capacityData = {
                    bedrooms: 1,
                    bathrooms: 1,
                    beds: 1,
                    guests: 2
                };

                // Método 1: Tentar extrair de spans específicos com informações sobre capacidade
                const capacitySpans = document.querySelectorAll('[data-section-id="OVERVIEW_DEFAULT"] span');
                capacitySpans.forEach(span => {
                    const text = span.textContent || '';

                    if (text.includes('quarto') || text.includes('bedroom')) {
                        const bedroomMatch = text.match(/(\d+)\s+quarto/i) || text.match(/(\d+)\s+bedroom/i);
                        if (bedroomMatch && bedroomMatch[1]) {
                            capacityData.bedrooms = parseInt(bedroomMatch[1]);
                        }
                    }

                    if (text.includes('banheiro') || text.includes('bathroom')) {
                        const bathroomMatch = text.match(/(\d+)\s+banheiro/i) || text.match(/(\d+)\s+bathroom/i);
                        if (bathroomMatch && bathroomMatch[1]) {
                            capacityData.bathrooms = parseInt(bathroomMatch[1]);
                        }
                    }

                    if (text.includes('cama') || text.includes('bed')) {
                        const bedMatch = text.match(/(\d+)\s+cama/i) || text.match(/(\d+)\s+bed/i);
                        if (bedMatch && bedMatch[1]) {
                            capacityData.beds = parseInt(bedMatch[1]);
                        }
                    }

                    if (text.includes('hóspede') || text.includes('guest')) {
                        const guestMatch = text.match(/(\d+)\s+hóspede/i) || text.match(/(\d+)\s+guest/i);
                        if (guestMatch && guestMatch[1]) {
                            capacityData.guests = parseInt(guestMatch[1]);
                        }
                    }
                });

                return {
                    price: pricePerNight,
                    ...capacityData
                };
            });

            result.data = priceAndCapacityData;
            result.status = 'partial';
            result.message = 'Preço e capacidade extraídos com sucesso';

            await browser.close();
            return NextResponse.json(result);
        }

        // ETAPA 3: Comodidades
        else if (step === 3) {
            console.log('Executando Etapa 3: Comodidades');

            // Aumentar o tempo de espera para garantir carregamento completo da página
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Função para clicar no botão "Mostrar todas as comodidades" e esperar a modal carregar
            const clickShowAllAmenitiesAndWait = async () => {
                console.log('Procurando botão "Mostrar todas as comodidades"...');

                const showAllButton = await page.evaluate(() => {
                    // Seletor mais específico para encontrar o botão correto
                    const buttonSelectorOptions = [
                        'button[role="button"]:not([aria-disabled="true"])',
                        'div[role="button"]'
                    ];

                    let button = null;

                    // Tentar encontrar o botão usando diferentes métodos
                    for (const selector of buttonSelectorOptions) {
                        const buttons = Array.from(document.querySelectorAll(selector));
                        button = buttons.find(btn => {
                            const text = btn.textContent || '';
                            return text.includes('Mostrar todas as') ||
                                text.includes('Show all') ||
                                text.match(/\d+\s+comodidades/);
                        });

                        if (button) {
                            console.log(`Botão encontrado: ${button.textContent}`);
                            break;
                        }
                    }

                    // Se ainda não encontramos, procurar na seção de comodidades
                    if (!button) {
                        const amenitySection = document.querySelector('[data-section-id="AMENITIES_DEFAULT"]');
                        if (amenitySection) {
                            const buttons = Array.from(amenitySection.querySelectorAll('button'));
                            button = buttons.find(btn => {
                                const text = btn.textContent || '';
                                return text.includes('Mostrar todas as') ||
                                    text.includes('Show all') ||
                                    text.match(/\d+\s+comodidades/);
                            });
                        }
                    }

                    if (button) {
                        console.log(`Botão encontrado: ${button.textContent}`);
                        (button as HTMLElement).click();
                        return true;
                    }
                    return false;
                });

                if (showAllButton) {
                    console.log('Botão clicado, aguardando modal carregar...');
                    // Aguardar a modal abrir
                    try {
                        await page.waitForSelector('[aria-modal="true"]', { timeout: 5000 });
                        console.log('Modal de comodidades aberta com sucesso');

                        // Aguardar um tempo adicional para garantir que todos os itens carreguem
                        await new Promise(resolve => setTimeout(resolve, 3000));

                        return true;
                    } catch (err: any) {
                        console.log('Modal não encontrada após 5 segundos:', err.message);
                        return false;
                    }
                }

                console.log('Botão "Mostrar todas as comodidades" não encontrado');
                return false;
            };

            // Tentar clicar no botão de mostrar todas as comodidades e aguardar a modal
            const modalOpened = await clickShowAllAmenitiesAndWait();

            // Se a modal foi aberta, aumentar o tempo de espera para garantir que todos os itens carreguem
            if (modalOpened) {
                // Aguardar mais um pouco para garantir que todos os elementos da modal estejam carregados
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Fazer scroll na modal para garantir que todos os itens sejam carregados
                await page.evaluate(() => {
                    const modal = document.querySelector('[aria-modal="true"]');
                    if (modal) {
                        // Scroll até o final da modal lentamente
                        const scrollHeight = modal.scrollHeight;
                        let currentPosition = 0;
                        const step = 100;

                        // Usar uma expressão de função para evitar problemas de strict mode
                        const smoothScroll = function () {
                            if (currentPosition < scrollHeight) {
                                currentPosition += step;
                                modal.scrollTo(0, currentPosition);
                                setTimeout(smoothScroll, 100);
                            }
                        };

                        smoothScroll();
                    }
                });

                // Aguardar mais tempo após o scroll
                await new Promise(resolve => setTimeout(resolve, 3000));
            }

            const amenitiesData = await page.evaluate(() => {
                const amenities: Array<{ text: string, svgIcon?: string, category?: string }> = [];
                const processedTexts = new Set<string>(); // Para controle de duplicatas

                // Função para verificar se o texto parece ser uma comodidade real
                const looksLikeRealAmenity = (text: string): boolean => {
                    // Remover textos que começam com "Indisponível:" ou têm "indisponível"
                    if (text.startsWith('Indisponível:') ||
                        text.includes('indisponível') ||
                        text.includes('Indisponível')) return false;

                    // Remover textos do tipo "Mostrar todas as X comodidades"
                    if (text.match(/Mostrar todas as \d+ comodidades/) ||
                        text.match(/Show all \d+ amenities/)) return false;

                    // Remover título "O que esse lugar oferece"
                    if (text === 'O que esse lugar oferece' ||
                        text === 'What this place offers' ||
                        text === 'O que este lugar oferece') return false;

                    // Remover informações de avaliações, estrelas, etc.
                    if (text.match(/\d+\s*avaliações/) ||
                        text.match(/\d+\s*estrelas/) ||
                        text.includes('avaliações') ||
                        text.includes('estrelas') ||
                        text.includes('Superhost') ||
                        text.includes('anos hospedando')) return false;

                    // Remover informações sobre o host
                    if (text.includes('Hospeda há') ||
                        text.includes('anos')) return false;

                    // Remover números isolados que podem ser ratings
                    if (/^[\d,\.]+$/.test(text.trim())) return false;

                    // Textos muito longos provavelmente não são comodidades
                    if (text.length > 100) return false;

                    // Textos vazios ou muito curtos não são comodidades
                    if (text.trim().length < 3) return false;

                    // Remover títulos de seções que são usados no Airbnb para categorizar comodidades
                    if (text === 'Básico' ||
                        text === 'Cozinha' ||
                        text === 'Quarto e lavanderia' ||
                        text === 'Instalações' ||
                        text === 'Localização' ||
                        text === 'Exterior' ||
                        text === 'Segurança em casa' ||
                        text === 'Estacionamento e recursos' ||
                        text === 'Internet e escritório' ||
                        text === 'Serviços' ||
                        text === 'Não disponível') return false;

                    return true;
                };

                // Função para extrair SVG de um elemento
                const extractSvgFromElement = (element: Element): string | undefined => {
                    const svgElement = element.querySelector('svg');
                    if (svgElement) {
                        try {
                            // Adicionar viewBox se não existir
                            if (!svgElement.hasAttribute('viewBox')) {
                                const width = svgElement.getAttribute('width') || '24';
                                const height = svgElement.getAttribute('height') || '24';
                                svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
                            }

                            // Remover atributos desnecessários para evitar conflitos
                            svgElement.removeAttribute('class');
                            svgElement.removeAttribute('style');

                            // Adicionar fill="currentColor" para compatibilidade com temas
                            if (!svgElement.getAttribute('fill')) {
                                svgElement.setAttribute('fill', 'currentColor');
                            }

                            // Obter o SVG como string
                            const svgString = svgElement.outerHTML;

                            // Verificar se o SVG está vazio ou inválido
                            if (svgString.length < 20 || !svgString.includes('<path')) {
                                return undefined;
                            }

                            return svgString;
                        } catch (error) {
                            console.error('Erro ao extrair SVG:', error);
                            return undefined;
                        }
                    }
                    return undefined;
                };

                // Função para extrair possível categoria de uma comodidade
                const extractCategory = (element: Element): string | undefined => {
                    // Tentar encontrar um heading próximo que pode indicar a categoria
                    let currentElement: Element | null = element;
                    while (currentElement) {
                        // Subir na árvore do DOM para encontrar um título de seção
                        currentElement = currentElement.parentElement;
                        if (currentElement) {
                            const headings = currentElement.querySelectorAll('h2, h3');
                            // Converter NodeList para Array antes de iterar
                            for (let i = 0; i < headings.length; i++) {
                                const heading = headings[i];
                                const headingText = heading.textContent?.trim();
                                if (headingText &&
                                    !headingText.includes('comodidade') &&
                                    !headingText.includes('O que esse lugar oferece')) {
                                    return headingText;
                                }
                            }
                        }
                    }
                    return undefined;
                };

                // Função para limpar e normalizar textos de comodidades
                const cleanAmenityText = (text: string) => {
                    // Remover qualquer texto com "indisponível"
                    if (text.toLowerCase().includes('indisponível') ||
                        text.toLowerCase().includes('unavailable') ||
                        text.toLowerCase().includes('não disponível') ||
                        text.toLowerCase().includes('not available')) {
                        return '';
                    }

                    // Remover "mostrar todas as XX comodidades"
                    if (text.match(/mostrar todas as \d+ comodidades/i) ||
                        text.match(/show all \d+ amenities/i)) {
                        return '';
                    }

                    // Remover textos como "O que esse lugar oferece"
                    if (text === 'O que esse lugar oferece' ||
                        text === 'What this place offers' ||
                        text === 'O que este lugar oferece') {
                        return '';
                    }

                    // Verificar comodidades específicas por texto completo ou parcial para garantir preservação
                    if (text.includes('Espaço onde os hóspedes podem preparar suas próprias refeições')) {
                        return 'Espaço onde os hóspedes podem preparar suas próprias refeições';
                    }

                    if (text.includes('Toalhas, lençóis, sabonete e papel higiênico') ||
                        text.includes('BásicoToalhas, lençóis, sabonete e papel higiênico')) {
                        return 'Toalhas, lençóis, sabonete e papel higiênico';
                    }

                    // Limpeza original do texto
                    text = text.trim()
                        .replace(/^[•·]/, '')
                        .replace(/Disponível/, '')
                        .replace(/Available/, '')
                        .trim();

                    // NOVO: Tratamento para comodidades com prefixos de categoria grudados
                    // Lista de prefixos conhecidos de categorias que podem estar grudados
                    const knownPrefixes = [
                        'Básico', 'Basico', 'Cozinha', 'Quarto', 'Lavanderia', 'Banheiro',
                        'Exterior', 'Segurança', 'Estacionamento', 'Internet', 'Serviços'
                    ];

                    // Verificar se o texto começa com algum dos prefixos conhecidos
                    for (const prefix of knownPrefixes) {
                        // Caso especial para elementos com espaço após o prefixo
                        if (text.startsWith(`${prefix} `)) {
                            const remainder = text.substring(prefix.length).trim();
                            if (remainder) {
                                console.log(`Corrigindo prefixo com espaço: ${text} -> ${remainder}`);
                                return remainder;
                            }
                        }

                        // Caso para elementos sem espaço após o prefixo (com letra maiúscula)
                        const regexPattern = new RegExp(`^${prefix}([A-Z].*)$`);
                        const match = text.match(regexPattern);

                        if (match && match[1]) {
                            // Se encontrou o padrão, retorna apenas a parte após o prefixo
                            console.log(`Corrigindo texto: ${text} -> ${match[1]}`);
                            return match[1];
                        }
                    }

                    // Caso especial para "BásicoToalhas, lençóis, sabonete e papel higiênico"
                    if (text.startsWith('BásicoToalhas') || text.startsWith('BasicoToalhas')) {
                        return text.replace(/^Básico|^Basico/, '');
                    }

                    // Caso especial para "CozinhaEspaço onde os hóspedes..."
                    if (text.startsWith('CozinhaEspaço')) {
                        return text.replace(/^Cozinha/, '');
                    }

                    // Verificar outros padrões de texto específicos
                    const specificTexts = [
                        { pattern: /espaço.*hóspedes.*preparar/i, replacement: 'Espaço onde os hóspedes podem preparar suas próprias refeições' },
                        { pattern: /toalhas.*lençóis.*sabonete/i, replacement: 'Toalhas, lençóis, sabonete e papel higiênico' }
                    ];

                    for (const { pattern, replacement } of specificTexts) {
                        if (pattern.test(text)) {
                            console.log(`Padronizando texto específico: ${text} -> ${replacement}`);
                            return replacement;
                        }
                    }

                    return text;
                };

                console.log('Iniciando extração de comodidades e ícones da modal...');

                // MÉTODO PRINCIPAL: Extrair comodidades da modal (se estiver aberta)
                // Usar seletores mais específicos para capturar todos os itens da modal
                const selectors = [
                    '[aria-modal="true"] div[role="listitem"]',
                    '[aria-modal="true"] div[role="group"] div',
                    '[aria-modal="true"] ul li',
                    '[aria-modal="true"] div[role="list"] > div'
                ];

                let totalModalItems = 0;

                // Tentar cada seletor para obter o máximo de itens possível
                for (const selector of selectors) {
                    const items = document.querySelectorAll(selector);
                    totalModalItems += items.length;

                    console.log(`Seletor "${selector}" encontrou ${items.length} itens`);

                    items.forEach(item => {
                        // Se o item tem ícone (svg), é mais provável que seja uma comodidade
                        const svgIcon = extractSvgFromElement(item);
                        let text = item.textContent?.trim();

                        if (text && looksLikeRealAmenity(text)) {
                            // Limpar e processar o texto da comodidade
                            const cleanedText = cleanAmenityText(text);
                            const category = extractCategory(item);

                            // Verificar se já existe uma comodidade com este texto para evitar duplicatas
                            if (cleanedText && !processedTexts.has(cleanedText)) {
                                processedTexts.add(cleanedText);
                                amenities.push({
                                    text: cleanedText,
                                    svgIcon,
                                    category
                                });
                            }
                        }
                    });
                }

                console.log(`Total de ${totalModalItems} itens encontrados na modal`);

                // Se não encontramos itens suficientes na modal ou a modal não foi aberta
                if (amenities.length < 10) {
                    console.log(`Poucas comodidades na modal (${amenities.length}), buscando na página...`);

                    // MÉTODO ALTERNATIVO: Buscar itens com ícones na seção de comodidades da página
                    const amenitySection = document.querySelector('[data-section-id="AMENITIES_DEFAULT"]');
                    if (amenitySection) {
                        // Selecionar itens de comodidades que geralmente têm um ícone e texto
                        const amenityItems = Array.from(amenitySection.querySelectorAll('div')).filter(div => {
                            // Verificar se o div tem um filho que é um svg (ícone)
                            return div.querySelector('svg') !== null;
                        });

                        console.log(`Encontrados ${amenityItems.length} itens com ícones na página`);

                        amenityItems.forEach(item => {
                            // Obter o texto adjacente ao ícone
                            let itemText = item.textContent?.trim();
                            const svgIcon = extractSvgFromElement(item);
                            const category = extractCategory(item);

                            if (itemText && looksLikeRealAmenity(itemText)) {
                                // Limpar e processar o texto da comodidade
                                const cleanedText = cleanAmenityText(itemText);

                                // Evitar duplicatas
                                if (cleanedText && !processedTexts.has(cleanedText)) {
                                    processedTexts.add(cleanedText);
                                    amenities.push({
                                        text: cleanedText,
                                        svgIcon,
                                        category
                                    });
                                }
                            }
                        });

                        // Se ainda temos poucas comodidades, tentar outros métodos
                        if (amenities.length < 10) {
                            console.log('Ainda poucas comodidades, usando método adicional...');

                            // Buscar todos os elementos que podem conter texto de comodidades
                            const potentialAmenityElements = amenitySection.querySelectorAll('div > span, div > div');

                            potentialAmenityElements.forEach(element => {
                                let text = element.textContent?.trim();
                                const svgIcon = extractSvgFromElement(element);
                                const category = extractCategory(element);

                                // Verificar se o texto parece ser uma comodidade e não está duplicado
                                if (text && looksLikeRealAmenity(text)) {
                                    // Limpar e processar o texto da comodidade
                                    const cleanedText = cleanAmenityText(text);

                                    if (cleanedText && !processedTexts.has(cleanedText)) {
                                        processedTexts.add(cleanedText);
                                        amenities.push({
                                            text: cleanedText,
                                            svgIcon,
                                            category
                                        });
                                    }
                                }
                            });
                        }
                    }

                    // Se ainda não temos comodidades suficientes, tentar procurar em toda a página
                    if (amenities.length < 10) {
                        // Procurar por elementos específicos que podem conter comodidades
                        document.querySelectorAll('[data-testid="amenities-section"] div, [data-testid="pdp-amenity"], div[data-testid*="amenity"]').forEach(element => {
                            let text = element.textContent?.trim();
                            const svgIcon = extractSvgFromElement(element);
                            const category = extractCategory(element);

                            if (text && looksLikeRealAmenity(text)) {
                                // Limpar e processar o texto da comodidade
                                const cleanedText = cleanAmenityText(text);

                                if (cleanedText && !processedTexts.has(cleanedText)) {
                                    processedTexts.add(cleanedText);
                                    amenities.push({
                                        text: cleanedText,
                                        svgIcon,
                                        category
                                    });
                                }
                            }
                        });
                    }
                }

                console.log(`Encontradas ${amenities.length} comodidades únicas no total`);

                // Log para depuração 
                console.log('Comodidades encontradas:', amenities.map(a => ({
                    text: a.text,
                    hasIcon: !!a.svgIcon,
                    category: a.category
                })));

                return {
                    amenities,
                    unavailableAmenities: []
                };
            });

            result.data = amenitiesData;
            result.status = 'success';
            result.message = 'Comodidades extraídas com sucesso';

            await browser.close();
            return NextResponse.json(result);
        }

        // ETAPA 4: Fotos do imóvel
        else if (step === 4) {
            console.log('Executando Etapa 4: Fotos do imóvel');

            // Desabilitar a interceptação de requisições para permitir carregamento de imagens
            await page.setRequestInterception(false);

            // Configurar viewport maior para garantir que mais imagens sejam carregadas
            await page.setViewport({ width: 1920, height: 1080 });

            // Array para armazenar URLs de imagens a serem coletadas via resposta
            const imageUrls = new Set<string>();

            // Interceptar respostas para capturar as imagens
            page.on('response', async (response) => {
                const url = response.url();
                const contentType = response.headers()['content-type'] || '';

                // Verificar se é uma imagem
                if (contentType.includes('image/')) {
                    // Limpar a URL (remover parâmetros de dimensão)
                    try {
                        const urlObj = new URL(url);

                        // Ignorar ícones e imagens pequenas
                        if (url.includes('icon') || url.includes('small') || url.includes('tiny') || url.includes('thumb')) {
                            return;
                        }

                        // Para imagens do Airbnb, manter apenas as de alta qualidade
                        if ((urlObj.hostname.includes('airbnb') || urlObj.hostname.includes('muscache')) &&
                            (url.includes('picture') || url.includes('photo') || url.includes('image'))) {
                            // Imagem provavelmente é relevante
                            imageUrls.add(url);
                            console.log(`Imagem capturada via resposta: ${url}`);
                        }
                    } catch (e) {
                        // Erro ao processar URL
                    }
                }
            });

            // Navegar para a página e aguardar o carregamento completo
            await page.goto(url, { waitUntil: 'networkidle0' });

            // Dar tempo para a página carregar completamente
            await safeWaitForTimeout(page, 5000);

            // Scroll pela página para forçar carregamento de imagens lazy-loaded
            await page.evaluate(async () => {
                // Função auxiliar para scroll suave
                const scrollToBottom = async () => {
                    const scrollHeight = document.body.scrollHeight;
                    for (let i = 0; i < scrollHeight; i += 100) {
                        window.scrollTo(0, i);
                        await new Promise(resolve => setTimeout(resolve, 50));
                    }
                    window.scrollTo(0, 0);
                };

                await scrollToBottom();
            });

            // Dar tempo para que as imagens carregem após o scroll
            await safeWaitForTimeout(page, 3000);

            // Tentar clicar no botão "Mostrar todas as fotos" ou na primeira imagem
            await page.evaluate(async () => {
                const photoButtons = [
                    '[data-testid="photos-button"]',
                    '[aria-label="Mostrar todas as fotos"]',
                    'button[aria-label*="fotos"]',
                    'button[data-testid*="photo"]',
                    'button span[aria-label*="foto"]',
                    'button:has(> span[aria-label*="foto"])'
                ];

                let buttonClicked = false;
                for (const selector of photoButtons) {
                    const buttons = Array.from(document.querySelectorAll(selector));
                    for (const button of buttons) {
                        if (button instanceof HTMLElement) {
                            button.click();
                            console.log(`Botão encontrado e clicado: ${selector}`);
                            buttonClicked = true;
                            break;
                        }
                    }
                    if (buttonClicked) break;
                }

                // Se não conseguiu clicar no botão, tenta clicar na primeira imagem da grade
                if (!buttonClicked) {
                    const firstImageSelectors = [
                        'img[data-testid="photo-first"]',
                        'img[itemprops="image"]',
                        '[data-testid="photo-0"]',
                        '.room-gallery img',
                        '[data-plugin-in-point-id="HERO_DEFAULT_PICTURE"] img',
                        '[data-section-id="HERO_DEFAULT"] img'
                    ];

                    for (const selector of firstImageSelectors) {
                        const img = document.querySelector(selector);
                        if (img && img instanceof HTMLElement) {
                            img.click();
                            console.log(`Imagem principal clicada: ${selector}`);
                            buttonClicked = true;
                            break;
                        }
                    }
                }

                // Aguardar a abertura da galeria
                await new Promise(resolve => setTimeout(resolve, 5000));
            });

            // Aguardar carregamento da galeria
            await safeWaitForTimeout(page, 5000);

            // Método alternativo: extrair diretamente da página usando evaluate
            const directExtractedImages = await page.evaluate(() => {
                const images = Array.from(document.images);
                return images
                    .filter(img => {
                        // Filtrar apenas imagens grandes o suficiente
                        const width = img.width || parseInt(img.getAttribute('width') || '0');
                        const height = img.height || parseInt(img.getAttribute('height') || '0');
                        return (width > 300 || height > 300) && img.src && img.src.length > 0;
                    })
                    .map(img => img.src);
            });

            console.log(`Extraídas ${directExtractedImages.length} imagens diretamente da página`);

            // Adicionar imagens encontradas diretamente ao conjunto
            directExtractedImages.forEach(img => imageUrls.add(img));

            // Navegar pelas fotos na galeria
            await page.evaluate(async () => {
                const nextButtons = [
                    'button[aria-label="Próxima"]',
                    'button[aria-label="Next"]',
                    'button[aria-label*="próxima"]',
                    'button[aria-label*="next"]',
                    '[data-testid="photo-tour-next"]',
                    'button[data-testid*="next"]'
                ];

                // Tentar clicar no botão "próximo" várias vezes
                for (const selector of nextButtons) {
                    const nextButton = document.querySelector(selector);
                    if (nextButton && nextButton instanceof HTMLElement) {
                        for (let i = 0; i < 10; i++) {
                            nextButton.click();
                            await new Promise(resolve => setTimeout(resolve, 1000)); // Tempo maior entre cliques
                        }
                        break;
                    }
                }
            });

            // Aguardar carregamento final
            await safeWaitForTimeout(page, 5000);

            // Extrair imagens novamente após a navegação
            const additionalImages = await page.evaluate(() => {
                return Array.from(document.images)
                    .filter(img => {
                        const width = img.width || parseInt(img.getAttribute('width') || '0');
                        const height = img.height || parseInt(img.getAttribute('height') || '0');
                        return (width > 300 || height > 300) && img.src && img.src.length > 0;
                    })
                    .map(img => img.src);
            });

            // Adicionar imagens adicionais ao conjunto
            additionalImages.forEach(img => imageUrls.add(img));

            // Converter Set para Array e filtrar imagens indesejadas
            const finalImages = Array.from(imageUrls).filter(url => {
                return !url.includes('data:image') &&
                    !url.includes('icon') &&
                    !url.includes('_small') &&
                    !url.includes('_thumb');
            });

            console.log(`Total de imagens únicas encontradas: ${finalImages.length}`);

            // Resultado final
            result.data = { photos: finalImages };
            result.status = finalImages.length > 0 ? 'success' : 'partial';
            result.message = finalImages.length > 0
                ? `Extraídas ${finalImages.length} fotos com sucesso`
                : 'Não foi possível extrair fotos';

            // Se não conseguiu extrair imagens suficientes, tente como último recurso
            if (finalImages.length < 3) {
                console.log("Tentando método de fallback para extrair imagens...");

                // Recarregar a página com outra estratégia
                await page.goto(url, { waitUntil: 'networkidle0' });

                // Extrair todas as URLs de backgrounds via CSS também
                const backgroundImageUrls = await page.evaluate(() => {
                    // Função para extrair URL de background-image
                    const getBackgroundImageUrl = (element: Element): string | null => {
                        const style = window.getComputedStyle(element);
                        const backgroundImage = style.backgroundImage;
                        if (backgroundImage && backgroundImage !== 'none') {
                            const match = /url\(['"]?([^'"()]*)['"]?\)/g.exec(backgroundImage);
                            return match ? match[1] : null;
                        }
                        return null;
                    };

                    // Pegar todos os elementos com background-image
                    const elementsWithBg = Array.from(document.querySelectorAll('*')).filter(el => {
                        const style = window.getComputedStyle(el);
                        return style.backgroundImage && style.backgroundImage !== 'none';
                    });

                    // Extrair URLs de background
                    return elementsWithBg
                        .map(getBackgroundImageUrl)
                        .filter((url): url is string => url !== null && url.length > 10);
                });

                // Adicionar URLs de background ao conjunto existente
                backgroundImageUrls.forEach(url => imageUrls.add(url));

                // Tentar extrair URLs de data attributes (comum no Airbnb)
                const dataAttributeUrls = await page.evaluate(() => {
                    // Procurar em todos os elementos por data-attributes que contêm URLs de imagens
                    const elements = Array.from(document.querySelectorAll('*[data-*]'));
                    const urls: string[] = [];

                    elements.forEach(el => {
                        // Percorrer todos os atributos do elemento
                        Array.from(el.attributes).forEach(attr => {
                            if (attr.name.startsWith('data-') && attr.value) {
                                // Verificar se o valor parece uma URL de imagem
                                if (
                                    (attr.value.includes('.jpg') ||
                                        attr.value.includes('.jpeg') ||
                                        attr.value.includes('.png') ||
                                        attr.value.includes('.webp')) &&
                                    (attr.value.includes('http') || attr.value.startsWith('/'))
                                ) {
                                    urls.push(attr.value);
                                }

                                // Verificar se o valor é um JSON que pode conter URLs
                                if (attr.value.includes('{') && attr.value.includes('}')) {
                                    try {
                                        const parsed = JSON.parse(attr.value);
                                        // Procurar propriedades que parecem conter URLs de imagem
                                        const extractUrlsFromObj = (obj: any): string[] => {
                                            if (!obj) return [];

                                            let foundUrls: string[] = [];
                                            Object.entries(obj).forEach(([key, value]) => {
                                                if (typeof value === 'string') {
                                                    if (
                                                        (value.includes('.jpg') ||
                                                            value.includes('.jpeg') ||
                                                            value.includes('.png') ||
                                                            value.includes('.webp')) &&
                                                        (value.includes('http') || value.startsWith('/'))
                                                    ) {
                                                        foundUrls.push(value);
                                                    }
                                                } else if (typeof value === 'object') {
                                                    foundUrls = [...foundUrls, ...extractUrlsFromObj(value)];
                                                }
                                            });

                                            return foundUrls;
                                        };

                                        urls.push(...extractUrlsFromObj(parsed));
                                    } catch (e) {
                                        // Não é um JSON válido, ignorar
                                    }
                                }
                            }
                        });
                    });

                    return urls;
                });

                // Adicionar URLs de data attributes ao conjunto
                dataAttributeUrls.forEach(url => imageUrls.add(url));

                // Atualizar imagens finais
                const finalFallbackImages = Array.from(imageUrls).filter(url => {
                    return !url.includes('data:image') &&
                        !url.includes('icon') &&
                        !url.includes('_small') &&
                        !url.includes('_thumb');
                });

                console.log(`Após fallback: encontradas ${finalFallbackImages.length} imagens únicas no total`);

                // Usar as imagens do fallback se encontrou mais
                if (finalFallbackImages.length > finalImages.length) {
                    result.data = { photos: finalFallbackImages };
                    result.status = 'success';
                    result.message = `Extraídas ${finalFallbackImages.length} fotos com sucesso (usando fallback)`;
                }
            }

            await browser.close();
            return NextResponse.json(result);
        }

        await browser.close();
        return NextResponse.json(
            { error: 'Etapa inválida. Use 1, 2, 3 ou 4' },
            { status: 400 }
        );

    } catch (error: any) {
        console.error('Erro durante o scraping:', error);
        return NextResponse.json(
            { error: 'Erro durante o scraping: ' + error.message },
            { status: 500 }
        );
    }
}
