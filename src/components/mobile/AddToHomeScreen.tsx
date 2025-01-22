'use client';

import { useEffect } from 'react';

// Removendo as declarações de tipo pois agora estão no arquivo .d.ts
export default function AddToHomeScreen() {
  useEffect(() => {
    const initAddToHomeScreen = () => {
      if (typeof window !== 'undefined' && window.AddToHomeScreen) {
        window.AddToHomeScreenInstance = window.AddToHomeScreen({
          appName: 'Yallah',
          appNameDisplay: 'standalone',
          appIconUrl: '/apple-touch-icon.png',
          assetUrl: 'https://cdn.jsdelivr.net/gh/philfung/add-to-homescreen@2.97/dist/assets/img/',
          maxModalDisplayCount: -1,
          displayOptions: { showMobile: true, showDesktop: false },
          allowClose: true,
        });

        window.AddToHomeScreenInstance.show('pt');
      }
    };

    // Pequeno delay para garantir que o script foi carregado
    setTimeout(initAddToHomeScreen, 1000);
  }, []);

  return null;
} 