'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import MobileNavigation from './MobileNavigation';
import FloatingCoinButton from '../ui/FloatingCoinButton';
import Footer from '../mobile/Footer';
import Image from 'next/image';
import Link from 'next/link';

const MobileLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // Determina o tipo de usuário baseado na URL
  const userType = pathname.includes('/mobile/owner') ? 'owner' : 'tenant';
  const isHome = pathname === '/mobile';

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white px-4 py-4 flex items-center justify-center border-b z-[20]">
        <div className="w-[200px] h-[60px] relative">
          <Link href="/mobile">
            <Image
              src={'/logo-yallah-nobg.png'}
              alt="Yallah"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-[96px] pb-20">
        {children}
      </main>

      {/* Footer */}
      {!isHome && <Footer />}

      {/* Bottom Navigation */}
      <MobileNavigation userType={userType} />

      {/* Floating Button */}
      {!isHome && <FloatingCoinButton />}
    </div>
  );
};

export default MobileLayout; 