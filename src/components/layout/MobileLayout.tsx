'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import MobileNavigation from './MobileNavigation';
import Image from 'next/image';

const MobileLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  
  // Determina o tipo de usuário baseado na URL
  const userType = pathname.includes('/mobile/owner') ? 'owner' : 'tenant';

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white px-4 py-4 flex items-center justify-center border-b z-10">
        <div className="w-[200px] h-[60px] relative">
          <Image
            src={'/logo-yallah-nobg.png'}
            alt="Yallah"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        <div className="absolute right-4">
          <button className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-full">
            PT
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-[84px] pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <MobileNavigation userType={userType} />
    </div>
  );
};

export default MobileLayout; 