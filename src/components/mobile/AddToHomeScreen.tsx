'use client';

import { useEffect } from 'react';

interface AddToHomeScreenOptions {
  appName: string;
  appNameDisplay?: 'standalone' | 'inline';
  appIconUrl: string;
  assetUrl: string;
  maxModalDisplayCount?: number;
  displayOptions?: { showMobile: boolean; showDesktop: boolean };
  allowClose?: boolean;
}

interface AddToHomeScreenType {
  show: (locale?: string) => void;
}

// Augment the window interface
declare global {
  interface Window {
    AddToHomeScreen(options: AddToHomeScreenOptions): AddToHomeScreenType;
    AddToHomeScreenInstance: AddToHomeScreenType;
  }
}

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