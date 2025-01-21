'use client';

import React from 'react';
import Image from 'next/image';
import MobileLayout from '@/components/layout/MobileLayout';

export default function MobileTenantPage() {
  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Banner Section */}
        <section className="relative w-full h-[300px]">
          <Image
            src="/banner-locatario.JPG"
            alt="Banner"
            width={800}
            height={600}
            priority
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
            <h1 className="text-3xl font-medium mb-4">Encontre o imóvel perfeito para alugar</h1>
            <p className="text-lg">
              Alugue com segurança e tranquilidade através da Yallah
            </p>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="px-4 py-8 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium">Imóveis em Destaque</h2>
            <button className="text-[#8BADA4] text-sm font-medium">Ver Todos</button>
          </div>
          <div className="space-y-4">
            {[
              {
                image: '/recomendado1.jpg',
                title: 'Apartamento em Moema',
                price: 350,
                description: 'Apartamento moderno com vista privilegiada e acabamento premium.'
              },
              {
                image: '/recomendado2.jpg',
                title: 'Casa em Alphaville',
                price: 450,
                description: 'Residência espaçosa com área de lazer completa e segurança 24h.'
              }
            ].map((property) => (
              <div key={property.title} className="bg-gray-50 rounded-2xl overflow-hidden">
                <div className="relative aspect-video">
                  <Image
                    src={property.image}
                    alt={property.title}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{property.title}</h3>
                  <p className="text-[#8BADA4] text-sm font-medium mb-2">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(property.price)} / Noite
                  </p>
                  <p className="text-sm text-gray-600">{property.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MobileLayout>
  );
} 