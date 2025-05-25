'use client';

import React from 'react';
import Image from 'next/image';
import PopularDestinations from '@/components/home/PopularDestinations';
import MobileBanner from '@/components/home/MobileBanner';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import Footer from '@/components/mobile/Footer';
import { formatCurrency } from '@/utils/format';

export default function MobileTenantPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Banner Section */}
      <MobileBanner />

      {/* Popular Destinations */}
      <PopularDestinations />

      {/* Featured Properties Hero Section */}
      <FeaturedProperties />

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
                  {formatCurrency(property.price)} / Noite
                </p>
                <p className="text-sm text-gray-600">{property.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
} 