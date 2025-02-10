'use client';

import { useEffect } from 'react';

type AddToHomeScreenOptions = {
  startAutomatically?: boolean;
  skipFirstVisit?: boolean;
  minPageViews?: number;
  daysUntilPrompt?: number;
  customPrompt?: {
    title?: string;
    cancelMsg?: string;
    installMsg?: string;
    guidanceCancelMsg?: string;
    src?: string;
  };
};

type AddToHomeScreenType = {
  isAvailable: () => boolean;
  start: () => void;
  reset: () => void;
};

// Declare the types without redeclaring the Window interface
declare global {
  var AddToHomeScreen: (options: AddToHomeScreenOptions) => AddToHomeScreenType;
  var AddToHomeScreenInstance: AddToHomeScreenType;
}

export default function AddToHomeScreen() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/add-to-homescreen.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (typeof window.AddToHomeScreen !== 'undefined') {
        const a2hs = window.AddToHomeScreen({
          startAutomatically: true,
          skipFirstVisit: false,
          minPageViews: 0,
          daysUntilPrompt: 0,
          customPrompt: {
            title: 'Instale o Yallah',
            cancelMsg: 'Agora não',
            installMsg: 'Instalar',
            guidanceCancelMsg: 'OK',
            src: '/logo-yallah-nobg.png'
          }
        });

        if (a2hs.isAvailable()) {
          a2hs.start();
        }
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
} 