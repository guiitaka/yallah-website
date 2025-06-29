import type { Metadata, Viewport } from 'next'
import { Montserrat, Playfair_Display } from 'next/font/google'
import '@/app/globals.css'
import 'mapbox-gl/dist/mapbox-gl.css';
import BodyWrapper from '@/components/layout/BodyWrapper'
import ChatbotScript from '@components/layout/ChatbotScript'
import { FilterProvider } from "@/context/FilterContext"
import Script from 'next/script';

const montserrat = Montserrat({ subsets: ['latin'] })
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Yallah',
  description: 'Encontre o lugar perfeito para sua estadia',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Yallah'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${montserrat.className} ${playfair.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/philfung/add-to-homescreen@3.3/dist/add-to-homescreen.min.css"
        />
        {/* CSS de correção para problemas de z-index */}
        <link rel="stylesheet" href="/add-to-homescreen-fix.css" />
        <Script
          src="https://cdn.jsdelivr.net/gh/philfung/add-to-homescreen@3.3/dist/add-to-homescreen.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <FilterProvider>
          <BodyWrapper>
            {children}
            <ChatbotScript />

            {/* Script para remover endereços completos de cards não expandidos */}
            <script dangerouslySetInnerHTML={{
              __html: `
              // Executa após o carregamento completo da página
              document.addEventListener('DOMContentLoaded', function() {
                // Função para ocultar endereços completos
                function hideFullAddresses() {
                  // Encontra todos os elementos de texto visíveis
                  const textNodes = [];
                  (function findTextNodes(node) {
                    if (node.nodeType === 3) { // Nó de texto
                      textNodes.push(node);
                    } else if (node.nodeType === 1 && node.nodeName !== 'SCRIPT') { // Elemento
                      for (let i = 0; i < node.childNodes.length; i++) {
                        findTextNodes(node.childNodes[i]);
                      }
                    }
                  })(document.body);
                  
                  // Padrões para identificar endereços
                  const addressPatterns = [
                    /Rua\\s+[\\w\\s]+,?\\s+\\d+/i,      // Rua Nome, Número
                    /Avenida\\s+[\\w\\s]+,?\\s+\\d+/i,   // Avenida Nome, Número
                    /R\\.\\s+[\\w\\s]+,?\\s+\\d+/i,       // R. Nome, Número
                    /Av\\.\\s+[\\w\\s]+,?\\s+\\d+/i,      // Av. Nome, Número
                    /\\d{5}-\\d{3}/                     // CEP: 00000-000
                  ];
                  
                  // Verifica se o texto contém um endereço completo
                  textNodes.forEach(node => {
                    if (node.textContent) {
                      const parent = node.parentNode;
                      // Só oculta se todos esses critérios forem verdadeiros:
                      // 1. O nó pai existe
                      // 2. O nó está visível
                      // 3. Não está dentro de um modal nem botão de fechar
                      // 4. Não está dentro de resultados de busca
                      // 5. Não está dentro de formulário ou campo de entrada
                      if (parent && 
                          window.getComputedStyle(parent).display !== 'none' && 
                          !parent.closest('.overlay-backdrop') && 
                          !parent.closest('[aria-label="Fechar"]') &&
                          !parent.closest('.max-h-60') && // Classe do dropdown de resultados
                          !parent.closest('form') && // Não afeta formulários
                          !parent.closest('input') && // Não afeta campos de entrada
                          !parent.closest('select') && // Não afeta selects
                          !parent.closest('[role="listbox"]') && // Não afeta listas de opções
                          !parent.closest('[role="option"]') && // Não afeta opções
                          !parent.closest('[role="combobox"]') && // Não afeta comboboxes
                          !parent.closest('li') && // Não afeta itens de lista (dropdown)
                          !parent.closest('.dropdown') && // Classe comum de dropdowns
                          !parent.closest('[id*="mapbox"]') && // Elementos relacionados ao mapbox
                          !parent.closest('[class*="mapbox"]')) { // Classes relacionadas ao mapbox
                        
                        // Verifica cada padrão de endereço
                        for (const pattern of addressPatterns) {
                          if (pattern.test(node.textContent)) {
                            // Se o nó estiver dentro de um card e não dentro de um modal/detalhe expandido
                            if (!parent.closest('[id^="expanded-"]') && 
                                !parent.closest('[class*="search"]') && // Não afeta resultados de busca
                                !parent.closest('[class*="dropdown"]')) { // Não afeta dropdowns genéricos
                              // Oculta o texto que contém o endereço
                              let current = parent;
                              while (current && 
                                     current.tagName !== 'BODY' && 
                                     current.childNodes.length <= 3) {
                                const style = window.getComputedStyle(current);
                                if (style.display !== 'none') {
                                  current.style.display = 'none';
                                  break;
                                }
                                current = current.parentNode;
                              }
                            }
                            break;
                          }
                        }
                      }
                    }
                  });
                }
                
                // Executa imediatamente
                hideFullAddresses();
                
                // Observa mudanças no DOM para tratar cards carregados dinamicamente
                const observer = new MutationObserver(hideFullAddresses);
                observer.observe(document.body, { 
                  childList: true, 
                  subtree: true 
                });
              });
            `}} />

            {/* Add to Homescreen Script */}
            <script dangerouslySetInnerHTML={{
              __html: `
                // Inicialização do Add to Homescreen
                let hasInitialized = false; // Variável para controlar se já foi inicializado

                function initAddToHomeScreen() {
                  // Se já inicializou, não faça nada
                  if (hasInitialized) return;
                  
                  // Função para detectar se é um dispositivo móvel
                  function isMobileDevice() {
                    const userAgent = window.navigator.userAgent.toLowerCase();
                    const mobileKeywords = [
                      'iphone', 'ipad', 'android', 'phone', 'mobile',
                      'webos', 'ipod', 'blackberry', 'windows phone'
                    ];
                    
                    return mobileKeywords.some(keyword => userAgent.includes(keyword));
                  }
                  
                  // Somente continua se for um dispositivo móvel
                  if (!isMobileDevice()) {
                    console.log('AddToHomeScreen: Não é um dispositivo móvel, não exibindo o popup');
                    return;
                  }
                  
                  // Check if browser is in private mode (which can break localStorage)
                  function checkPrivateMode() {
                    return new Promise(function(resolve) {
                      try {
                        localStorage.setItem('__private_mode_test', '1');
                        localStorage.removeItem('__private_mode_test');
                        resolve(false); // Not private mode
                      } catch (e) {
                        resolve(true); // Private mode
                      }
                    });
                  }

                  // Function to initialize the add-to-homescreen
                  function doInitialize() {
                    if (!window.AddToHomeScreen) {
                      console.log('AddToHomeScreen library not loaded yet, trying in 1 second');
                      setTimeout(doInitialize, 1000);
                      return;
                    }
                    
                    if (hasInitialized) return; // Verificação dupla
                    hasInitialized = true; // Marcar como inicializado
                    
                    window.AddToHomeScreenInstance = window.AddToHomeScreen({
                      appName: 'Yallah',
                      appNameDisplay: 'standalone',
                      appIconUrl: 'apple-touch-icon.png?v=' + new Date().getTime(),
                      assetUrl: 'https://cdn.jsdelivr.net/gh/philfung/add-to-homescreen@3.3/dist/assets/img/',
                      allowClose: true,
                      showArrow: true,
                      maxModalDisplayCount: -1
                    });
                    
                    // Force clear any display count
                    window.AddToHomeScreenInstance.clearModalDisplayCount();
                    
                    // Show the prompt
                    var deviceInfo = window.AddToHomeScreenInstance.show('pt');
                    
                    // Debug output
                    console.log('Add to Homescreen Debug:', {
                      'Is standalone?': window.AddToHomeScreenInstance.isStandAlone(),
                      'Is iOS?': window.AddToHomeScreenInstance.isBrowserIOSSafari(),
                      'Is iOS Chrome?': window.AddToHomeScreenInstance.isBrowserIOSChrome(),
                      'Is Android Chrome?': window.AddToHomeScreenInstance.isBrowserAndroidChrome(),
                      'User Agent': navigator.userAgent,
                      'DeviceInfo': deviceInfo
                    });
                  }

                  // Check private mode first
                  checkPrivateMode().then(function(isPrivate) {
                    console.log('Browser is in private mode:', isPrivate);
                    
                    // Inicializar
                    doInitialize();
                  });
                }

                // Execute quando a página estiver completamente carregada
                window.addEventListener('load', initAddToHomeScreen);
                
                // Execute também no DOMContentLoaded como backup
                document.addEventListener('DOMContentLoaded', function() {
                  // Limpa dados de armazenamento relacionados ao add-to-homescreen
                  try {
                    localStorage.removeItem('add-to-homescreen-shown');
                    localStorage.removeItem('add-to-homescreen-count');
                    console.log('Dados de cache do add-to-homescreen limpos');
                  } catch (e) {
                    console.error('Erro ao limpar cache:', e);
                  }
                  
                  // Inicializa imediatamente
                  initAddToHomeScreen();
                  
                  // Tenta inicializar novamente após um curto delay para garantir
                  setTimeout(initAddToHomeScreen, 1000);
                });
              `
            }} />
          </BodyWrapper>
        </FilterProvider>
      </body>
    </html>
  )
} 