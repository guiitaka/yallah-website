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
      const basePath = isMobile ? '/mobile' : '';
      window.location.href = `${basePath}/${userChoice}`;
      setShow(false);
    }
  }, []);

  const handleChoice = (choice: 'owner' | 'tenant') => {
    localStorage.setItem('userType', choice);
    const isMobile = window.innerWidth <= 768;
    const basePath = isMobile ? '/mobile' : '';
    window.location.href = `${basePath}/${choice}`;
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Logo Header */}
      <div className="absolute top-8 z-30 w-full flex justify-center">
        <div className="w-[160px] h-[160px] md:w-[200px] md:h-[200px] relative bg-white rounded-full p-10 md:p-12 shadow-lg">
          <Image
            src="/logo-yallah-nobg.png"
            alt="Yallah"
            fill
            priority
            sizes="(max-width: 768px) 80px, 100px"
            className="object-contain"
          />
        </div>
      </div>

      {/* Options Container */}
      <div className="w-full h-full flex flex-col md:flex-row">
        {/* Owner Option */}
        <div
          className={`relative w-full md:w-1/2 h-1/2 md:h-full transition-all duration-500 ease-in-out ${hoveredOption === 'tenant' ? 'md:w-[40%]' : hoveredOption === 'owner' ? 'md:w-[60%]' : 'md:w-1/2'
            }`}
          onMouseEnter={() => setHoveredOption('owner')}
          onMouseLeave={() => setHoveredOption(null)}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 z-10" />
          <Image
            src="/owner-bg.jpg"
            alt="Proprietário Background"
            fill
            className="object-cover transition-transform duration-700 ease-in-out scale-100 hover:scale-110"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 md:p-12">
            <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center mb-6">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white text-center">Sou Proprietário</h2>
            <p className="text-xl md:text-2xl font-medium text-white/80 text-center mb-8">
              Maximize o retorno do seu imóvel
            </p>
            <button
              onClick={() => handleChoice('owner')}
              className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full transition-all duration-300 border border-white/30 hover:border-white/50"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Tenant Option */}
        <div
          className={`relative w-full md:w-1/2 h-1/2 md:h-full transition-all duration-500 ease-in-out ${hoveredOption === 'owner' ? 'md:w-[40%]' : hoveredOption === 'tenant' ? 'md:w-[60%]' : 'md:w-1/2'
            }`}
          onMouseEnter={() => setHoveredOption('tenant')}
          onMouseLeave={() => setHoveredOption(null)}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 z-10" />
          <Image
            src="/tenant-bg.jpg"
            alt="Locatário Background"
            fill
            className="object-cover transition-transform duration-700 ease-in-out scale-100 hover:scale-110"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 md:p-12">
            <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center mb-6">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white text-center">Busco um Imóvel</h2>
            <p className="text-xl md:text-2xl font-medium text-white/80 text-center mb-8">
              Encontre o lugar perfeito para sua estadia
            </p>
            <button
              onClick={() => handleChoice('tenant')}
              className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full transition-all duration-300 border border-white/30 hover:border-white/50"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Divider Line (visible only on desktop) */}
      <div className="absolute hidden md:block h-[70%] w-px bg-white/30 z-20" />

      {/* Footer */}
      <div className="absolute bottom-4 z-30 text-white/50 text-sm">
        © {new Date().getFullYear()} Yallah - Escolha sua experiência
      </div>
    </div>
  );
} 