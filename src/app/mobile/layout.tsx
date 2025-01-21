import { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import AddToHomeScreen from '@/components/mobile/AddToHomeScreen';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  title: 'Yallah Mobile',
  description: 'Especialistas em administração de imóveis para Airbnb e Booking',
  manifest: '/manifest.json',
  other: {
    'mobile-web-app-capable': 'yes',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Yallah',
    startupImage: [
      {
        url: '/splash/apple-splash-2048-2732.jpg',
        media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/splash/apple-splash-1668-2388.jpg',
        media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/splash/apple-splash-1536-2048.jpg',
        media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/splash/apple-splash-1125-2436.jpg',
        media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/splash/apple-splash-1242-2688.jpg',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/AppIcons/Assets.xcassets/AppIcon.appiconset/180.png', sizes: '180x180', type: 'image/png' },
      { url: '/icons/AppIcons/Assets.xcassets/AppIcon.appiconset/120.png', sizes: '120x120', type: 'image/png' },
    ],
  },
};

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/philfung/add-to-homescreen@2.97/dist/add-to-homescreen.min.css"
      />
      <Script
        src="https://cdn.jsdelivr.net/gh/philfung/add-to-homescreen@2.97/dist/add-to-homescreen.min.js"
        strategy="afterInteractive"
      />
      <div className={inter.className}>
        <AddToHomeScreen />
        {children}
      </div>
    </>
  );
} 