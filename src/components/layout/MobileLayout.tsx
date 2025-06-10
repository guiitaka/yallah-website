'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import MobileNavigation from './MobileNavigation';
import FloatingCoinButton from '../ui/FloatingCoinButton';
import Footer from '../mobile/Footer';
import Image from 'next/image';
import Link from 'next/link';
import Header from "./Header";
import { FilterProvider } from "@/context/FilterContext";

type MobileLayoutProps = {
  children: React.ReactNode;
};

export default function MobileLayout({ children }: MobileLayoutProps) {
  const pathname = usePathname();
  const userType = pathname.includes('/mobile/owner') ? 'owner' : 'tenant';
  const isHome = pathname === '/mobile/tenant' || pathname === '/mobile/owner' || pathname === '/mobile';

  return (
    <FilterProvider>
      <div className="flex flex-col min-h-screen bg-white">
        <Header userType={userType} />
        <main className="flex-1 pt-24 pb-20">
          {children}
        </main>
        {!isHome && <Footer />}
        <MobileNavigation userType={userType} />
        {!isHome && <FloatingCoinButton />}
      </div>
    </FilterProvider>
  );
} 