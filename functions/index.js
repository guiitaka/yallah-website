/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require('firebase-functions');
const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.scrapeAirbnb = functions
    .runWith({
        timeoutSeconds: 120,
        memory: '1GB'
    })
    .https.onCall(async (data, context) => {
        // Autenticação (opcional)
        if (!context.auth) {
            throw new functions.https.HttpsError(
                'unauthenticated',
                'Apenas usuários autenticados podem usar esta função'
            );
        }

        const { url } = data;

        if (!url || !url.includes('airbnb.com')) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'URL inválida. Por favor, forneça uma URL válida do Airbnb'
            );
        }

        try {
            console.log(`Iniciando scraping da URL: ${url}`);

            const browser = await puppeteer.launch({
                args: [...chromium.args, '--disable-web-security'],
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath,
                headless: chromium.headless,
            });

            const page = await browser.newPage();

            // Timeout para caso a página não carregue
            await page.setDefaultNavigationTimeout(60000);

            // Interceptar requisições de imagem para melhorar performance
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                const resourceType = req.resourceType();
                if (resourceType === 'image' || resourceType === 'font' || resourceType === 'media') {
                    req.abort();
                } else {
                    req.continue();
                }
            });

            console.log('Acessando a página...');
            await page.goto(url, { waitUntil: 'networkidle2' });
            console.log('Página carregada, extraindo dados...');

            // Extrair dados básicos
            const propertyData = await page.evaluate(() => {
                // Título
                const title = document.querySelector('h1')?.innerText || '';

                // Características básicas (quartos, banheiros, etc)
                const basicInfo = document.querySelector('[data-section-id="OVERVIEW_DEFAULT"]')?.innerText || '';

                // Descrição
                const description = document.querySelector('[data-section-id="DESCRIPTION_DEFAULT"]')?.innerText || '';

                // Preço
                const priceText = document.querySelector('._tyxjp1')?.innerText || '';
                const price = parseFloat(priceText.replace(/[^0-9,.]/g, '').replace(',', '.')) || 0;

                // Localização
                const location = document.querySelector('._9xiloll')?.innerText || '';

                // Comodidades
                const amenitiesElements = document.querySelectorAll('[data-section-id="AMENITIES_DEFAULT"] ._vzrbjl');
                const amenities = Array.from(amenitiesElements).map(el => el.innerText);

                // Imagens
                const imageElements = document.querySelectorAll('picture source[srcset]');
                const images = Array.from(imageElements)
                    .map(img => img.srcset.split(' ')[0])
                    .filter((value, index, self) => self.indexOf(value) === index)
                    .slice(0, 10); // Limitar a 10 imagens

                console.log('Dados extraídos com sucesso:', { title, basicInfo });

                return {
                    title,
                    basicInfo,
                    description,
                    price,
                    location,
                    amenities,
                    images
                };
            });

            await browser.close();
            console.log('Browser fechado, processando dados...');

            // Processar dados extraídos
            const locationParts = propertyData.location.split(',').map(part => part.trim());
            const cityState = locationParts.length > 1 ? locationParts.slice(0, -1).join(', ') : propertyData.location;
            const country = locationParts.length > 1 ? locationParts[locationParts.length - 1] : 'Brasil';

            // Extrair informações de quartos/banheiros
            const basicInfoMatch = propertyData.basicInfo.match(/(\d+)\s+(?:quarto|quartos)|(\d+)\s+(?:banheiro|banheiros)|(\d+)\s+(?:cama|camas)|(\d+)\s+(?:hóspede|hóspedes)/g);

            const bedrooms = parseInt((basicInfoMatch?.find(i => i.includes('quarto')) || '0').replace(/[^0-9]/g, '')) || 1;
            const bathrooms = parseInt((basicInfoMatch?.find(i => i.includes('banheiro')) || '0').replace(/[^0-9]/g, '')) || 1;
            const beds = parseInt((basicInfoMatch?.find(i => i.includes('cama')) || '0').replace(/[^0-9]/g, '')) || 1;
            const guests = parseInt((basicInfoMatch?.find(i => i.includes('hóspede')) || '0').replace(/[^0-9]/g, '')) || 2;

            // Determinar tipo de imóvel com base na descrição
            let type = 'Apartamento';
            const descLower = propertyData.title.toLowerCase() + ' ' + propertyData.description.toLowerCase();

            if (descLower.includes('casa')) type = 'Casa';
            else if (descLower.includes('flat')) type = 'Flat';
            else if (descLower.includes('studio') || descLower.includes('estúdio')) type = 'Studio';
            else if (descLower.includes('cobertura')) type = 'Cobertura';
            else if (descLower.includes('kitnet')) type = 'Kitnet';
            else if (descLower.includes('loft')) type = 'Loft';

            // Estimar área (fictício - não disponível diretamente no Airbnb)
            const estimatedArea = bedrooms * 15 + bathrooms * 5 + 20;

            const result = {
                title: propertyData.title,
                description: propertyData.description,
                type,
                location: `${cityState}, ${country}`,
                price: propertyData.price,
                bedrooms,
                bathrooms,
                beds,
                guests,
                area: estimatedArea,
                amenities: propertyData.amenities,
                images: propertyData.images,
                sourceUrl: url
            };

            console.log('Dados processados com sucesso');
            return result;
        } catch (error) {
            console.error('Erro ao fazer scraping:', error);
            throw new functions.https.HttpsError(
                'internal',
                'Falha ao extrair dados do Airbnb. Verifique a URL ou tente novamente mais tarde.',
                error.message
            );
        }
    });
