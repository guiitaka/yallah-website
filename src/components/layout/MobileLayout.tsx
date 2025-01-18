'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Search, User, Heart, MessageCircle } from 'lucide-react';

const MobileLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    { icon: Home, label: 'Início', path: '/mobile' },
    { icon: Search, label: 'Buscar', path: '/mobile/search' },
    { icon: Heart, label: 'Favoritos', path: '/mobile/favorites' },
    { icon: MessageCircle, label: 'Chat', path: '/mobile/chat' },
    { icon: User, label: 'Perfil', path: '/mobile/profile' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main Content */}
      <main className="flex-1 pb-16">
        {children}
      </main>

      {/* Bottom Navigation Bar - Apple Style */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center h-16 px-4 max-w-md mx-auto">
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