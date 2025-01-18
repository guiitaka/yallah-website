'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Building, Info, User, Phone } from 'lucide-react';
import Image from 'next/image';

const MobileLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    { icon: Home, label: 'A Yallah', path: '/mobile' },
    { icon: Building, label: 'Como Funciona', path: '/mobile/como-funciona' },
    { icon: Info, label: 'Método', path: '/mobile/metodo' },
    { icon: User, label: 'Proprietário', path: '/mobile/proprietario' },
    { icon: Phone, label: 'Contato', path: '/mobile/contato' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white px-4 py-4 flex items-center justify-center border-b z-10">
        <div className="w-[120px] h-[40px]">
          <Image
            src={'/logo-yallah-nobg.png'}
            alt="Yallah"
            width={120}
            height={40}
            priority
            unoptimized
          />
        </div>
        <div className="absolute right-4">
          <button className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-full">
            PT
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-[68px] pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center h-20 px-4 max-w-md mx-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex flex-col items-center justify-center w-16 h-16 space-y-1
                  ${isActive ? 'text-[#8BADA4]' : 'text-gray-500'}`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[#8BADA4]' : 'stroke-current'}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MobileLayout; 