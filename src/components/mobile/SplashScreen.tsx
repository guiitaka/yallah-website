'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Building2, User } from 'lucide-react';

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [hoveredOption, setHoveredOption] = useState<'owner' | 'tenant' | null>(null);

  useEffect(() => {
    const userChoice = localStorage.getItem('userType');
    if (userChoice) {
      const isMobile = window.innerWidth <= 768;
      // Ensure redirection for mobile stays within the /mobile path
      const basePath = '/mobile'; // Force mobile path for mobile component
      window.location.href = `${basePath}/${userChoice}`;
      setShow(false);
    }
  }, []);

  const handleChoice = (choice: 'owner' | 'tenant') => {
    localStorage.setItem('userType', choice);
    const isMobile = window.innerWidth <= 768;
    // Ensure redirection for mobile stays within the /mobile path
    const basePath = '/mobile'; // Force mobile path for mobile component
    window.location.href = `${basePath}/${choice}`;
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Logo Header */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        {/* Adjusted logo size for mobile, ensuring visibility with white background */}
        <div className="w-[120px] h-[120px] relative bg-white rounded-full p-6 shadow-lg">
          <Image
            src="/logo-yallah-nobg.png"
            alt="Yallah"
            fill
            priority
            sizes="80px" // Simplified size for mobile consistency
            className="object-contain"
          />
        </div>
      </div>

      {/* Options Container */}
      {/* For mobile, options will stack vertically due to flex-col and h-1/2 on children */}
      <div className="w-full h-full flex flex-col">
        {/* Owner Option */}
        <div
          className={`relative w-full h-1/2 transition-all duration-500 ease-in-out`}
        // Hover effects managed by hoveredOption are less relevant on mobile, but structure is kept
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 z-10" />
          <Image
            src="/owner-bg.jpg"
            alt="Proprietário Background"
            fill
            className="object-cover transition-transform duration-700 ease-in-out scale-100"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2 text-white text-center">Sou Proprietário</h2>
            <p className="text-lg font-medium text-white/80 text-center mb-6">
              Maximize o retorno do seu imóvel
            </p>
            <button
              onClick={() => handleChoice('owner')}
              className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full transition-all duration-300 border border-white/30 hover:border-white/50"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tenant Option */}
        <div
          className={`relative w-full h-1/2 transition-all duration-500 ease-in-out`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 z-10" />
          <Image
            src="/tenant-bg.jpg"
            alt="Locatário Background"
            fill
            className="object-cover transition-transform duration-700 ease-in-out scale-100"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2 text-white text-center">Busco um Imóvel</h2>
            <p className="text-lg font-medium text-white/80 text-center mb-6">
              Encontre o lugar perfeito para sua estadia
            </p>
            <button
              onClick={() => handleChoice('tenant')}
              className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full transition-all duration-300 border border-white/30 hover:border-white/50"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer - Simplified for mobile if necessary, but current one is already minimal */}
      <div className="absolute bottom-4 z-30 text-white/50 text-xs px-4 text-center">
        © {new Date().getFullYear()} Yallah - Escolha sua experiência
      </div>
    </div>
  );
} 