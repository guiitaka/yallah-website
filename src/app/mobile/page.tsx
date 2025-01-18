'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronRight, Star, Home, MapPin, Crown, Calendar } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';

export default function MobileHomePage() {
  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Header Section */}
        <header className="bg-white px-4 py-4 flex items-center justify-between border-b">
          <div className="w-[120px] h-[40px] relative">
            <Image
              src="/logo-yallah-nobg.png"
              alt="Yallah"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-full">
              PT
            </button>
          </div>
        </header>

        {/* Search Bar */}
        <div className="bg-white px-4 py-3">
          <div className="bg-gray-100 rounded-full px-4 py-2.5 flex items-center">
            <input
              type="search"
              placeholder="Buscar imóveis..."
              className="bg-transparent w-full outline-none text-sm"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 py-3 overflow-x-auto flex gap-2 bg-white border-b">
          {[
            { label: 'Imóveis', icon: Home },
            { label: 'Destaques', icon: Star },
            { label: 'Localizações', icon: MapPin },
            { label: 'Premium', icon: Crown },
            { label: 'Eventos', icon: Calendar },
          ].map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 whitespace-nowrap"
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            );
          })}
        </div>

        {/* Featured Properties */}
        <section className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Imóveis em Destaque</h2>
            <button className="text-blue-500 text-sm font-medium">Ver Todos</button>
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
              <div key={property.title} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="relative h-48 w-full mb-4 rounded-xl overflow-hidden">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold mb-1">{property.title}</h3>
                <p className="text-gray-500 text-sm mb-2">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(property.price)} / Noite
                </p>
                <p className="text-sm text-gray-600">{property.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Us */}
        <section className="px-4 py-6 bg-white">
          <h2 className="text-lg font-semibold mb-4">Sobre Nós</h2>
          <div className="prose prose-sm">
            <p className="text-gray-600">
              Na Yallah, acreditamos que cada imóvel tem o potencial de ser mais do que paredes e teto – é um espaço para criar memórias e viver experiências únicas. Nossa missão é simplificar a gestão de imóveis, conectando proprietários a locatários que valorizam conforto, praticidade e um lugar especial para chamar de lar, mesmo que por pouco tempo.
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <Image
                src="/card1.jpg"
                alt="Yallah Imóveis"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <Image
                src="/card2.jpg"
                alt="Interior Yallah"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="px-4 py-6">
          <h2 className="text-lg font-semibold mb-4">Nossos Serviços</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Gestão Completa', description: 'Administração total do seu imóvel' },
              { title: 'Limpeza', description: 'Serviço profissional de limpeza' },
              { title: 'Manutenção', description: 'Manutenção preventiva e corretiva' },
              { title: 'Atendimento 24h', description: 'Suporte aos hóspedes 24 horas' }
            ].map((service) => (
              <div key={service.title} className="bg-white p-4 rounded-xl">
                <h3 className="font-medium mb-1">{service.title}</h3>
                <p className="text-sm text-gray-500">{service.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MobileLayout>
  );
} 