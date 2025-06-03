'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Building2, User } from 'lucide-react';

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [hoveredOption, setHoveredOption] = useState<'owner' | 'tenant' | null>(null);

  useEffect(() => {
  }, []);

  const handleChoice = (choice: 'owner' | 'tenant') => {
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
        {/* Reduced size further on very small screens (e.g., xs or custom breakpoint if Tailwind config allows) */}
        <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] relative bg-white rounded-full p-4 sm:p-6 shadow-lg">
          <Image
            src="/logo-yallah-nobg.png"
            alt="Yallah"
            fill
            priority
            sizes="60px sm:80px" // Adjusted sizes for different screen breakpoints
            className="object-contain"
          />
        </div>
      </div>

      {/* Options Container */}
      {/* For mobile, options will stack vertically due to flex-col and h-1/2 on children */}
      <div className="w-full h-full flex flex-col">
        {/* Owner Option */}
        <div
          className={`relative w-full h-1/2 transition-all duration-500 ease-in-out flex flex-col items-center justify-center`} // Added flex for centering content
        // Hover effects managed by hoveredOption are less relevant on mobile, but structure is kept
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 z-10" />
          <Image
            src="/owner-bg.jpg"
            alt="Proprietário Background"
            fill
            className="object-cover transition-transform duration-700 ease-in-out scale-100"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 sm:p-6"> {/* Reduced padding for smaller screens */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center mb-2 sm:mb-4"> {/* Reduced size and margin */}
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" /> {/* Reduced icon size */}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-white text-center">Sou Proprietário</h2> {/* Reduced font size and margin */}
            <p className="text-base sm:text-lg font-medium text-white/80 text-center mb-3 sm:mb-6"> {/* Reduced font size and margin */}
              Maximize o retorno do seu imóvel
            </p>
            <button
              onClick={() => handleChoice('owner')}
              className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full transition-all duration-300 border border-white/30 hover:border-white/50 text-sm sm:text-base" // Reduced padding and font size
            >
              <span>Continuar</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" /> {/* Reduced icon size */}
            </button>
          </div>
        </div>

        {/* Tenant Option */}
        <div
          className={`relative w-full h-1/2 transition-all duration-500 ease-in-out flex flex-col items-center justify-center`} // Added flex for centering content
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 z-10" />
          <Image
            src="/tenant-bg.jpg"
            alt="Locatário Background"
            fill
            className="object-cover transition-transform duration-700 ease-in-out scale-100"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 sm:p-6"> {/* Reduced padding for smaller screens */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center mb-2 sm:mb-4"> {/* Reduced size and margin */}
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" /> {/* Reduced icon size */}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-white text-center">Busco um Imóvel</h2> {/* Reduced font size and margin */}
            <p className="text-base sm:text-lg font-medium text-white/80 text-center mb-3 sm:mb-6"> {/* Reduced font size and margin */}
              Encontre o lugar perfeito para sua estadia
            </p>
            <button
              onClick={() => handleChoice('tenant')}
              className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full transition-all duration-300 border border-white/30 hover:border-white/50 text-sm sm:text-base" // Reduced padding and font size
            >
              <span>Continuar</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" /> {/* Reduced icon size */}
            </button>
          </div>
        </div>
      </div>

      {/* Footer - Simplified for mobile if necessary, but current one is already minimal */}
      <div className="absolute bottom-2 sm:bottom-4 z-30 text-white/50 text-xs px-4 text-center w-full"> {/* Ensure footer is also responsive */}
        © {new Date().getFullYear()} Yallah - Escolha sua experiência
      </div>
    </div>
  );
} 