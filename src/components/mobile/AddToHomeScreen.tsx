'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    AddToHomeScreen: any;
    AddToHomeScreenInstance: any;
  }
}

export default function AddToHomeScreen() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AddToHomeScreen) {
      window.AddToHomeScreenInstance = window.AddToHomeScreen({
        appName: 'Yallah',
        appNameDisplay: 'standalone',
        appIconUrl: '/apple-touch-icon.png',
        assetUrl: 'https://cdn.jsdelivr.net/gh/philfung/add-to-homescreen@2.97/dist/assets/img/',
        maxModalDisplayCount: -1,
        displayOptions: { showMobile: true, showDesktop: false },
        allowClose: true,
        customPromptContent: {
          title: 'Instalar Yallah',
          cancelMsg: 'Agora não',
          installMsg: 'Instalar',
          guidanceImageAlt: 'Adicione o Yallah à sua tela inicial',
          guidance: {
            platform: 'ios',
            action: 'safari',
            steps: [
              'Toque no botão compartilhar',
              'Role a tela para baixo e toque em "Adicionar à Tela de Início"'
            ]
          }
        }
      });

      window.AddToHomeScreenInstance.show('pt');
    }
  }, []);

  return null;
} 