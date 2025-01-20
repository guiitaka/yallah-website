'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SplashScreen() {
  const router = useRouter();
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Verifica se já existe uma escolha salva
    const userChoice = localStorage.getItem('userType');
    if (userChoice) {
      router.push(`/mobile/${userChoice}`);
      setShow(false);
    }
  }, [router]);

  const handleChoice = (choice: 'owner' | 'tenant') => {
    // Salva a escolha do usuário
    localStorage.setItem('userType', choice);
    // Navega para a rota apropriada
    router.push(`/mobile/${choice}`);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Top Half */}
      <div className="relative h-1/2 bg-gray-900">
        <Image
          src="/owner-bg.jpg"
          alt="Proprietário Background"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <button
            onClick={() => handleChoice('owner')}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-3">Sou Proprietário</h2>
            <p className="text-xl font-medium opacity-90">Maximize o retorno do seu imóvel</p>
          </button>
        </div>
      </div>

      {/* Bottom Half */}
      <div className="relative h-1/2">
        <Image
          src="/tenant-bg.jpg"
          alt="Locatário Background"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <button
            onClick={() => handleChoice('tenant')}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-3">Busco um Imóvel</h2>
            <p className="text-xl font-medium opacity-90">Encontre o lugar perfeito para sua estadia</p>
          </button>
        </div>
      </div>

      {/* Centered Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[240px] h-[240px] relative bg-white rounded-full p-8">
          <div className="w-[180px] h-[180px] relative mx-auto">
            <Image
              src="/logo-yallah-nobg.png"
              alt="Yallah"
              fill
              priority
              sizes="180px"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 