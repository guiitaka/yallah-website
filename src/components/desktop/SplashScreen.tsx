'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SplashScreen() {
  const [show, setShow] = useState(true);

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
    <div className="fixed inset-0 bg-white z-50 flex flex-col md:flex-row">
      {/* Left Half */}
      <div className="relative w-full md:w-1/2 h-1/2 md:h-full bg-gray-900">
        <Image
          src="/owner-bg.jpg"
          alt="Proprietário Background"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white hover:bg-black/30 transition-colors">
          <button
            onClick={() => handleChoice('owner')}
            className="text-center p-8 w-full h-full flex flex-col items-center justify-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Sou Proprietário</h2>
            <p className="text-xl md:text-2xl font-medium opacity-90">Maximize o retorno do seu imóvel</p>
          </button>
        </div>
      </div>

      {/* Right Half */}
      <div className="relative w-full md:w-1/2 h-1/2 md:h-full">
        <Image
          src="/tenant-bg.jpg"
          alt="Locatário Background"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white hover:bg-black/30 transition-colors">
          <button
            onClick={() => handleChoice('tenant')}
            className="text-center p-8 w-full h-full flex flex-col items-center justify-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Busco um Imóvel</h2>
            <p className="text-xl md:text-2xl font-medium opacity-90">Encontre o lugar perfeito para sua estadia</p>
          </button>
        </div>
      </div>

      {/* Centered Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[200px] md:w-[300px] h-[200px] md:h-[300px] relative bg-white rounded-full p-6 md:p-10">
          <div className="w-full h-full relative mx-auto">
            <Image
              src="/logo-yallah-nobg.png"
              alt="Yallah"
              fill
              priority
              sizes="(max-width: 768px) 180px, 220px"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 