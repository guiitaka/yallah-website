import type { Metadata, Viewport } from 'next'
import { Montserrat, Playfair_Display } from 'next/font/google'
import '@/app/globals.css'
import BodyWrapper from '@/components/layout/BodyWrapper'

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
      </head>
      <BodyWrapper>
        {children}

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
                  // Apenas processa nós visíveis nos cards, não em áreas de detalhes expandidas
                  if (parent && 
                      window.getComputedStyle(parent).display !== 'none' && 
                      !parent.closest('.overlay-backdrop') && 
                      !parent.closest('[aria-label="Fechar"]')) {
                    
                    // Verifica cada padrão de endereço
                    for (const pattern of addressPatterns) {
                      if (pattern.test(node.textContent)) {
                        // Se o nó estiver dentro de um card e não dentro de um modal/detalhe expandido
                        if (!parent.closest('[id^="expanded-"]')) {
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
      </BodyWrapper>
    </html>
  )
} 