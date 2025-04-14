const puppeteer = require('puppeteer-core');
const chrome = require('@sparticuz/chromium');

/**
 * Extracts the listing ID from an Airbnb URL
 * @param {string} url - The Airbnb listing URL
 * @returns {number|null} - The extracted listing ID or null if not found
 */
function getListingId(url) {
    try {
        const matches = url.match(/\/rooms\/(\d+)/);

        if (matches && matches[1]) {
            return parseInt(matches[1], 10);
        }

        return null;
    } catch (error) {
        console.error('Error extracting listing ID:', error);
        return null;
    }
}

/**
 * Generate a random user agent
 * @returns {string} - A random user agent string
 */
function getRandomUserAgent() {
    const userAgents = [
        // Chrome on Windows
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        // Chrome on macOS
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        // Safari on macOS
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
        // Firefox on Windows
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
        // Edge on Windows
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
    ];

    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

/**
 * Verifies if the loaded page is actually the listing detail page
 * @param {Object} page - The Puppeteer page object
 * @param {number} listingId - The expected listing ID
 * @returns {Promise<boolean>} - True if the page is a listing detail page
 */
async function verifyListingPage(page, listingId) {
    try {
        // Check 1: URL still contains the listing ID
        const currentUrl = page.url();
        const stillHasListingId = currentUrl.includes(`/rooms/${listingId}`);

        if (!stillHasListingId) {
            console.log(`URL redirecionada não contém mais o ID da listagem ${listingId}: ${currentUrl}`);
            return false;
        }

        // Check 2: Title should not be the homepage title
        const title = await page.title();
        const isHomePage = title.includes('aluguéis por temporada') && !title.includes('em');

        if (isHomePage) {
            console.log(`Título indica página inicial, não listagem: ${title}`);
            return false;
        }

        // Check 3: Look for elements that should exist on a listing page
        const listingElements = await page.evaluate(() => {
            // Look for price element
            const priceElement = document.querySelector('[data-testid="book-it-default"] span[data-testid="price-element"]');

            // Look for reviews section
            const reviewsElement = document.querySelector('[data-testid="pdp-reviews-header"]');

            // Look for amenities section
            const amenitiesElement = document.querySelector('[data-testid="amenities-section"]');

            // Look for listing title
            const titleElement = document.querySelector('h1');

            return {
                hasPrice: !!priceElement,
                hasReviews: !!reviewsElement,
                hasAmenities: !!amenitiesElement,
                hasTitle: !!titleElement,
                title: titleElement ? titleElement.textContent : null
            };
        });

        console.log('Elementos encontrados na página:', JSON.stringify(listingElements));

        // If we have at least 2 of these elements, it's likely a listing page
        const elementsFound = [
            listingElements.hasPrice,
            listingElements.hasReviews,
            listingElements.hasAmenities,
            listingElements.hasTitle
        ].filter(Boolean).length;

        return elementsFound >= 2;
    } catch (error) {
        console.error('Erro ao verificar página de listagem:', error);
        return false;
    }
}

/**
 * Maps the Airbnb API response to a simplified object structure
 * @param {Object} airbnbListing - The raw Airbnb listing data
 * @returns {Object} - Formatted listing data
 */
function mapListingFromAirbnb(airbnbListing) {
    try {
        // Handle potential missing data with safe defaults
        return {
            airbnbId: airbnbListing.id,
            title: airbnbListing.name || '',
            description: airbnbListing.sectioned_description?.description || '',
            location: {
                lat: airbnbListing.lat,
                lng: airbnbListing.lng,
                city: airbnbListing.address?.city || '',
                country: airbnbListing.address?.country || '',
            },
            pricing: {
                basePrice: airbnbListing.price || 0,
                currency: airbnbListing.price_details?.price_string?.match(/[^\d\s.,]+/) || '',
                cleaningFee: airbnbListing.price_details?.price_items?.find(item =>
                    item.type === 'CLEANING_FEE')?.total_amount || 0,
                serviceFee: airbnbListing.price_details?.price_items?.find(item =>
                    item.type === 'SERVICE_FEE')?.total_amount || 0
            },
            host: {
                name: airbnbListing.primary_host?.host_name || '',
                about: airbnbListing.primary_host?.about || '',
                airbnbId: airbnbListing.primary_host?.id,
                isSuperhost: airbnbListing.primary_host?.is_superhost || false,
                profileUrl: airbnbListing.primary_host?.profile_pic_path || '',
                verified: airbnbListing.primary_host?.identity_verified || false
            },
            specs: {
                guestCapacity: airbnbListing.person_capacity || 0,
                bedroomCount: airbnbListing.bedroom_count || 0,
                bedCount: airbnbListing.bed_count || 0,
                bathroomCount: airbnbListing.bathroom_count || 0,
                minNights: airbnbListing.min_nights || 1,
            },
            photos: (airbnbListing.photos || []).map(photo => ({
                url: photo.picture || '',
                caption: photo.caption || ''
            })),
            amenities: (airbnbListing.listing_amenities || []).map(amenity => ({
                name: amenity.name || '',
                category: amenity.tag || '',
                description: amenity.tooltip || ''
            })),
            reviews: {
                rating: airbnbListing.star_rating || 0,
                count: airbnbListing.review_details_interface?.review_count || 0
            },
            cancelationPolicy: airbnbListing.cancellation_policy_text || '',
            houseRules: airbnbListing.additional_house_rules || '',
            url: airbnbListing.listing_url || url
        };
    } catch (error) {
        console.error('Error mapping Airbnb data:', error);
        throw error;
    }
}

/**
 * Extract data directly from the DOM when API method fails
 * @param {Object} page - Puppeteer page object
 * @returns {Promise<Object>} - Extracted listing data
 */
async function extractDataFromDom(page) {
    try {
        console.log('Tentando extrair dados diretamente do DOM...');

        return await page.evaluate(() => {
            // Helper function to extract text if element exists
            const getText = (selector) => {
                const element = document.querySelector(selector);
                return element ? element.textContent.trim() : '';
            };

            // Helper to extract multiple elements text
            const getAllText = (selector) => {
                const elements = document.querySelectorAll(selector);
                return Array.from(elements).map(el => el.textContent.trim());
            };

            // Get listing title
            const title = getText('h1');

            // Get price
            const priceElement = document.querySelector('[data-testid="book-it-default"] ._tyxjp1');
            const priceText = priceElement ? priceElement.textContent.trim() : '';
            const priceMatch = priceText.match(/([^\d]*)(\d+[.,\d]*)/);
            const currency = priceMatch?.[1]?.trim() || '';
            const basePrice = priceMatch?.[2] ? parseFloat(priceMatch[2].replace(/[.,]/g, '')) : 0;

            // Get rating
            const ratingText = getText('[data-testid="pdp-reviews-header"] ._tyxjp1');
            const rating = ratingText ? parseFloat(ratingText) : 0;

            // Get review count
            const reviewCountText = getText('[data-testid="pdp-reviews-header"] ._12m9o05');
            const reviewCountMatch = reviewCountText.match(/(\d+)/);
            const reviewCount = reviewCountMatch ? parseInt(reviewCountMatch[1]) : 0;

            // Get images
            const images = Array.from(document.querySelectorAll('[data-testid="photo-carousel"] img'))
                .map(img => ({
                    url: img.src,
                    caption: img.alt || ''
                }));

            // Get amenities
            const amenities = getAllText('[data-testid="amenities-section"] ._gw4xx4')
                .map(amenity => ({
                    name: amenity,
                    category: '',
                    description: ''
                }));

            // Get host info
            const hostName = getText('[data-testid="pdp-host-name"]');
            const isSuperhost = document.querySelector('[data-testid="pdp-superhost-badge"]') !== null;

            // Get location info
            const locationSection = document.querySelector('[data-section-id="LOCATION_DEFAULT"]');
            const locationText = locationSection ? locationSection.textContent : '';

            // Get description
            const description = getText('[data-section-id="DESCRIPTION_DEFAULT"] ._rt9o25');

            return {
                airbnbId: window.location.pathname.match(/\/rooms\/(\d+)/)?.[1] || '',
                title,
                description,
                location: {
                    lat: 0, // Can't easily get from DOM
                    lng: 0, // Can't easily get from DOM
                    city: locationText.split(',')[0] || '',
                    country: locationText.split(',').pop() || '',
                },
                pricing: {
                    basePrice,
                    currency,
                    cleaningFee: 0, // Not easily accessible from DOM
                    serviceFee: 0, // Not easily accessible from DOM
                },
                host: {
                    name: hostName,
                    about: '',
                    airbnbId: '',
                    isSuperhost,
                    profileUrl: '',
                    verified: false
                },
                specs: {
                    guestCapacity: parseInt(getText('._14hqahxx').match(/(\d+).*hóspedes/)?.[1] || '0'),
                    bedroomCount: parseInt(getText('._14hqahxx').match(/(\d+).*quartos/)?.[1] || '0'),
                    bedCount: parseInt(getText('._14hqahxx').match(/(\d+).*camas/)?.[1] || '0'),
                    bathroomCount: parseInt(getText('._14hqahxx').match(/(\d+).*banheiros/)?.[1] || '0'),
                    minNights: 1,
                },
                photos: images,
                amenities,
                reviews: {
                    rating,
                    count: reviewCount
                },
                cancelationPolicy: getText('[data-section-id="POLICIES_DEFAULT"]'),
                houseRules: getText('[data-section-id="HOUSE_RULES_DEFAULT"]'),
                url: window.location.href
            };
        });
    } catch (error) {
        console.error('Erro ao extrair dados do DOM:', error);
        throw error;
    }
}

/**
 * Adiciona cookies personalizados para parecer mais com um visitante normal
 * @param {Object} page - Puppeteer page object
 */
async function addCommonCookies(page) {
    await page.setCookie(
        { name: 'bev', value: `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`, domain: '.airbnb.com.br', path: '/' },
        { name: 'cdn_exp_b01129eeb67b1171a', value: 'control', domain: '.airbnb.com.br', path: '/' },
        { name: 'ak_bmsc', value: `${Math.random().toString(36).substring(2, 15)}~${Math.random().toString(36).substring(2, 15)}`, domain: '.airbnb.com.br', path: '/' }
    );
}

/**
 * Realiza ações aleatórias na página para simular comportamento humano
 * @param {Object} page - Puppeteer page object
 */
async function performHumanBehavior(page) {
    // Scroll down slowly in sections
    for (let i = 0; i < 5; i++) {
        await page.evaluate((scrollPos) => {
            window.scrollTo(0, scrollPos);
        }, 500 * i);

        // Pequena espera aleatória entre scrolls
        await new Promise(r => setTimeout(r, 500 + Math.random() * 1000));
    }

    // Mover mouse para um elemento aleatório na página
    const randomElementSelector = [
        'button', 'a', 'img', 'h2', 'div._rt9o25'
    ][Math.floor(Math.random() * 5)];

    try {
        const randomElement = await page.$(randomElementSelector);
        if (randomElement) {
            await randomElement.hover();
        }
    } catch (e) {
        // Ignorar erros se não conseguir encontrar o elemento
    }
}

// Main scraping function
export async function scrapeAirbnb(url, step = 1) {
    let browser = null;
    let progressData = {
        status: 'loading',
        step: step,
        totalSteps: 4,
        message: `Iniciando etapa ${step} de 4...`,
        data: {}
    };

    try {
        console.log(`Iniciando scraping local para URL: ${url}, Etapa: ${step}`);

        // Extract listing ID
        const listingId = getListingId(url);
        if (!listingId) {
            return {
                status: 'error',
                step: step,
                totalSteps: 4,
                message: 'Não foi possível extrair o ID da listagem da URL fornecida',
                error: 'Invalid listing ID',
                data: {}
            };
        }

        // Configure browser
        const executablePath = await chrome.executablePath;

        // Update progress
        progressData.message = 'Iniciando navegador...';

        // Random user agent to avoid detection
        const userAgent = getRandomUserAgent();
        console.log(`Usando User-Agent: ${userAgent}`);

        // Launch browser with optimized settings for serverless environments
        // Using headless: new for newer Chrome versions which is less detectable
        browser = await puppeteer.launch({
            args: [
                ...chrome.args,
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process',
                '--disable-site-isolation-trials',
                '--disable-blink-features=AutomationControlled', // Important: prevents detection as automation
                '--window-size=1920,1080'
            ],
            defaultViewport: {
                width: 1920,
                height: 1080
            },
            executablePath,
            // Tenta usar o novo modo headless ou fallback para o padrão
            headless: 'new',
            ignoreHTTPSErrors: true
        });

        // Update progress
        progressData.message = 'Abrindo página...';
        progressData.step = 2;

        // Create page and setup 
        const page = await browser.newPage();

        // Set user agent and other browser properties that make it look more real
        await page.setUserAgent(userAgent);

        // Set extra headers
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Referer': 'https://www.google.com/'
        });

        // Modificar o navigator.webdriver para false
        await page.evaluateOnNewDocument(() => {
            // Delete navigator.webdriver
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
            });

            // Modificar user agent no JS para combinar
            window.navigator.chrome = {
                runtime: {}
            };

            // Criar history e screen convincentes
            window.navigator.languages = ['pt-BR', 'pt', 'en-US', 'en'];

            // Overriding permissions
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications' ?
                    Promise.resolve({ state: Notification.permission }) :
                    originalQuery(parameters)
            );
        });

        // Add common cookies to appear like a returning visitor
        await addCommonCookies(page);

        // Store API information
        let airbnbApiInfo = {
            host: null,
            key: null,
            protocol: null
        };

        // Set request interception
        await page.setRequestInterception(true);

        // Handle requests to capture API key and optimize page load
        page.on('request', async (request) => {
            const resourceType = request.resourceType();

            // Não bloqueamos mais imagens para parecer navegação normal
            // E não bloqueamos CSS para que a página carregue corretamente
            if (resourceType === 'font') {
                await request.abort();
                return;
            }

            // Adicionar headers extras para parecer mais com usuário real
            const headers = request.headers();

            // Capture API key from requests
            if (request.resourceType() === 'fetch' &&
                request.url().includes('/api/v2/pdp_listing_booking_details')) {
                try {
                    const parsedUrl = new URL(request.url());
                    airbnbApiInfo.host = parsedUrl.host;
                    airbnbApiInfo.key = parsedUrl.searchParams.get('key');
                    airbnbApiInfo.protocol = parsedUrl.protocol;
                    console.log('Captured Airbnb API key:', airbnbApiInfo.key);
                } catch (error) {
                    console.error('Error parsing API URL:', error);
                }
            }

            request.continue({
                headers: {
                    ...headers,
                    'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'Upgrade-Insecure-Requests': '1',
                    'sec-fetch-site': 'none',
                    'sec-fetch-mode': 'navigate',
                    'sec-fetch-user': '?1',
                    'sec-fetch-dest': 'document'
                }
            });
        });

        // Update progress
        progressData.message = 'Navegando para o Airbnb...';
        progressData.step = 3;

        // Navigate to the page and wait for network to be idle
        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 60000 // Aumentar timeout para 60 segundos
        });

        // Espera adicional para scripts carregarem
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Verificar se a página carregada é realmente uma página de listagem
        const isListingPage = await verifyListingPage(page, listingId);

        if (!isListingPage) {
            console.log('A página carregada não parece ser uma página de listagem válida');

            // Verifique se é uma página que pede verificação (CAPTCHA)
            const isCaptchaPage = await page.evaluate(() => {
                return document.body.textContent.includes('verificar que você não é um robô') ||
                    document.body.textContent.includes('verify you\'re not a robot') ||
                    document.querySelector('iframe[src*="captcha"]') !== null;
            });

            if (isCaptchaPage) {
                return {
                    status: 'error',
                    step: progressData.step,
                    totalSteps: 4,
                    message: 'O Airbnb está solicitando verificação CAPTCHA',
                    error: 'CAPTCHA_REQUIRED',
                    data: {}
                };
            }

            // Tentativa de salvar screenshot para diagnóstico
            try {
                await page.screenshot({ path: '/tmp/airbnb-redirect.png' });
                console.log('Screenshot salvo em /tmp/airbnb-redirect.png');
            } catch (e) {
                console.error('Não foi possível salvar screenshot:', e);
            }

            // Aguardar mais tempo e executar comportamento humano para tentar driblar proteções
            await performHumanBehavior(page);

            // Verificar novamente após comportamento humano
            const isListingPageAfterBehavior = await verifyListingPage(page, listingId);

            if (!isListingPageAfterBehavior) {
                // Se ainda não for uma página de listagem, tente extrair dados diretamente do DOM como último recurso
                try {
                    const domData = await extractDataFromDom(page);

                    if (domData && domData.title) {
                        console.log('Dados básicos extraídos com sucesso do DOM');

                        return {
                            status: 'partial_success',
                            step: 4,
                            totalSteps: 4,
                            message: 'Dados básicos extraídos com sucesso (limitados)',
                            warning: 'O Airbnb pode estar bloqueando o acesso completo à listagem',
                            data: domData
                        };
                    }
                } catch (domError) {
                    console.error('Falha ao extrair dados do DOM:', domError);
                }

                return {
                    status: 'error',
                    step: 3,
                    totalSteps: 4,
                    message: 'O Airbnb redirecionou para outra página ou está bloqueando o acesso',
                    error: 'REDIRECT_OR_BLOCKED',
                    data: {}
                };
            }
        }

        // Update progress
        progressData.message = 'Listagem carregada, extraindo dados...';

        // Agora tentar extrair dados com várias abordagens

        // 1. Tentar via window.__INITIAL_STATE__ ou variáveis similares
        let extractedData = await page.evaluate(() => {
            try {
                // Look for the data in different possible locations
                if (window.__INITIAL_STATE__) {
                    return { source: 'INITIAL_STATE', data: window.__INITIAL_STATE__ };
                } else if (window.__PRELOADED_STATE__) {
                    return { source: 'PRELOADED_STATE', data: window.__PRELOADED_STATE__ };
                } else if (window.__APOLLO_STATE__) {
                    return { source: 'APOLLO_STATE', data: window.__APOLLO_STATE__ };
                } else {
                    // Try to find any script with JSON data about the listing
                    const scripts = document.querySelectorAll('script[type="application/json"]');
                    for (const script of scripts) {
                        try {
                            const data = JSON.parse(script.textContent);
                            if (data && (data.bootstrapData || data.data)) {
                                return { source: 'SCRIPT_JSON', data };
                            }
                        } catch (e) {
                            // Continue to next script
                        }
                    }
                }
                return null;
            } catch (error) {
                console.error('Error extracting data from state:', error);
                return null;
            }
        });

        console.log(`Dados extraídos do ${extractedData?.source || 'nenhum estado'}`);

        let listingData;
        let mappedData;

        if (extractedData?.data) {
            // Tentar encontrar os dados da listagem em várias localizações possíveis
            listingData = extractedData.data.bootstrapData?.listing ||
                extractedData.data.reduxData?.homePDP?.listingInfo?.listing ||
                extractedData.data.data?.presentation?.stayProductDetailPage?.sections?.sections?.[0]?.section?.product ||
                null;

            if (listingData) {
                console.log('Dados da listagem encontrados no estado da página');
                mappedData = mapListingFromAirbnb(listingData);
            }
        }

        // Se não conseguimos dados do estado, verificar se temos uma chave de API
        if (!mappedData && airbnbApiInfo.key) {
            // Update progress
            progressData.message = 'Chamando API do Airbnb...';
            progressData.step = 4;

            // If we have the API key, make a direct request to Airbnb API
            const apiUrl = `${airbnbApiInfo.protocol}//${airbnbApiInfo.host}/api/v2/pdp_listing_details/${listingId}?_format=for_rooms_show&key=${airbnbApiInfo.key}`;

            console.log('Fetching from Airbnb API:', apiUrl);

            // Make the request from the page to use the same session/cookies
            const apiResponse = await page.evaluate(async (url) => {
                try {
                    const response = await fetch(url);
                    return await response.json();
                } catch (error) {
                    return { error: error.toString() };
                }
            }, apiUrl);

            if (apiResponse.error) {
                console.error('API request failed:', apiResponse.error);
            } else if (apiResponse.pdp_listing_detail) {
                console.log('Dados obtidos com sucesso da API do Airbnb');
                // Map the data to our format
                mappedData = mapListingFromAirbnb(apiResponse.pdp_listing_detail);
            }
        }

        // Se ainda não temos dados, extrair diretamente do DOM
        if (!mappedData) {
            console.log('Nenhum dado obtido via estado ou API, tentando extrair do DOM...');
            mappedData = await extractDataFromDom(page);
        }

        // Verificar se temos dados válidos
        if (!mappedData || !mappedData.title) {
            throw new Error('Não foi possível extrair dados da listagem');
        }

        // Return success with data
        return {
            status: 'success',
            step: 4,
            totalSteps: 4,
            message: 'Dados extraídos com sucesso!',
            data: mappedData
        };

    } catch (error) {
        console.error('Erro durante o scraping:', error);

        // Return structured error
        return {
            status: 'error',
            step: progressData.step,
            totalSteps: 4,
            message: 'Ocorreu um erro durante a extração de dados',
            error: error.toString(),
            data: progressData.data
        };
    } finally {
        // Always close the browser to avoid memory leaks
        if (browser) {
            try {
                await browser.close();
                console.log('Browser fechado com sucesso');
            } catch (closeError) {
                console.error('Erro ao fechar o browser:', closeError);
            }
        }
    }
} 