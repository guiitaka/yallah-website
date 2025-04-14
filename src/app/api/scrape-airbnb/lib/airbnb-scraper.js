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

        // Launch browser with optimized settings for serverless environments
        browser = await puppeteer.launch({
            args: [
                ...chrome.args,
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ],
            defaultViewport: chrome.defaultViewport,
            executablePath,
            headless: chrome.headless,
            ignoreHTTPSErrors: true
        });

        // Update progress
        progressData.message = 'Abrindo página...';
        progressData.step = 2;

        // Create page and setup interceptors to capture API calls
        const page = await browser.newPage();

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

            // Skip unnecessary resources to speed up the process
            if (resourceType === 'font' || resourceType === 'image' || resourceType === 'stylesheet') {
                await request.abort();
                return;
            }

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

            await request.continue();
        });

        // Update progress
        progressData.message = 'Navegando para o Airbnb...';
        progressData.step = 3;

        // Navigate to the page and wait for network to be idle
        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // Wait a moment to ensure API requests complete
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Update progress
        progressData.message = 'Extraindo dados...';

        // Check if we captured the API key
        if (!airbnbApiInfo.key) {
            // If we didn't get the API key, try to extract data directly from the page
            progressData.message = 'API key não encontrada, extraindo dados da página...';

            // Get JSON data from the window.__INITIAL_STATE__ variable
            const pageData = await page.evaluate(() => {
                try {
                    // Look for the data in different possible locations
                    if (window.__INITIAL_STATE__) {
                        return window.__INITIAL_STATE__;
                    } else if (window.__PRELOADED_STATE__) {
                        return window.__PRELOADED_STATE__;
                    } else {
                        // Try to find any script with JSON data about the listing
                        const scripts = document.querySelectorAll('script[type="application/json"]');
                        for (const script of scripts) {
                            try {
                                const data = JSON.parse(script.textContent);
                                if (data && data.bootstrapData) {
                                    return data;
                                }
                            } catch (e) {
                                // Continue to next script
                            }
                        }
                    }
                    return null;
                } catch (error) {
                    console.error('Error extracting data from page:', error);
                    return null;
                }
            });

            if (pageData && Object.keys(pageData).length > 0) {
                // Try to map the data from the page
                const listingData = pageData.bootstrapData?.listing ||
                    pageData.reduxData?.homePDP?.listingInfo?.listing ||
                    null;

                if (listingData) {
                    const mappedData = mapListingFromAirbnb(listingData);

                    // Update progress with success
                    progressData = {
                        status: 'success',
                        step: 4,
                        totalSteps: 4,
                        message: 'Dados extraídos com sucesso!',
                        data: mappedData
                    };

                    return progressData;
                }
            }

            // If we couldn't extract data, return an error
            return {
                status: 'error',
                step: 3,
                totalSteps: 4,
                message: 'Não foi possível extrair dados da listagem. Airbnb pode estar bloqueando o acesso.',
                error: 'API key not found and page data extraction failed',
                data: {}
            };
        }

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
            throw new Error(`API request failed: ${apiResponse.error}`);
        }

        // Extract and map data from the API response
        const listingData = apiResponse.pdp_listing_detail;
        if (!listingData) {
            throw new Error('Listing data not found in API response');
        }

        // Map the data to our format
        const mappedData = mapListingFromAirbnb(listingData);

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