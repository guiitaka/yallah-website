'use client';

import React from 'react';
import Image from 'next/image';
import MobileLayout from '@/components/layout/MobileLayout';

export default function MobileHomePage() {
  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Banner Section */}
        <section className="relative w-full h-[300px]">
          <Image
            src="/owner-bg.jpg"
            alt="Banner"
            width={800}
            height={600}
            priority
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
            <h1 className="text-3xl font-medium mb-4">Bem-vindo à Yallah</h1>
            <p className="text-lg">
              Especialistas em administração de imóveis para Airbnb e Booking
            </p>
          </div>
        </section>

        {/* Promotions Section */}
        <section className="px-4 py-8 bg-white">
          <h2 className="text-xl font-medium mb-4">Seu imóvel, nossa expertise</h2>
          <p className="text-gray-600 mb-6">
            A Yallah oferece gestão completa para seu imóvel: Desde a administração da locação até a manutenção e limpeza.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Gestão Completa', description: 'Administração total do seu imóvel', video: '/videos/video1.webm' },
              { title: 'Limpeza', description: 'Serviço profissional de limpeza', video: '/videos/video2.webm' },
              { title: 'Manutenção', description: 'Manutenção preventiva e corretiva', video: '/videos/video3.webm' },
              { title: 'Atendimento 24h', description: 'Suporte aos hóspedes 24 horas', video: '/videos/video4.webm' }
            ].map((service) => (
              <div key={service.title} className="bg-gray-50 p-4 rounded-xl relative overflow-hidden">
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                  <video
                    className="w-full h-full"
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ objectFit: 'cover' }}
                  >
                    <source src={service.video} type="video/webm" />
                  </video>
                </div>
                <h3 className="font-medium mb-1">{service.title}</h3>
                <p className="text-sm text-gray-500">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Us */}
        <section className="px-4 py-8 bg-white mt-2">
          <h2 className="text-xl font-medium mb-4">Sobre Nós</h2>
          <div className="prose prose-sm">
            <p className="text-gray-600 mb-6">
              Na Yallah, acreditamos que cada imóvel tem o potencial de ser mais do que paredes e teto – é um espaço para criar memórias e viver experiências únicas.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <Image
                src="/card1.jpg"
                alt="Yallah Imóveis"
                width={800}
                height={450}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-600">
                Com anos de experiência no mercado imobiliário, nossa equipe é especializada em transformar propriedades em ativos rentáveis.
              </p>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <Image
                src="/card2.jpg"
                alt="Interior Yallah"
                width={800}
                height={450}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="px-4 py-8 bg-white mt-2">
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
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
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

        {/* Contact Form */}
        <section className="px-4 py-8 bg-white mt-2">
          <h2 className="text-xl font-medium mb-6">Entre em Contato</h2>
          <form className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Nome"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0"
              />
            </div>
            <div>
              <textarea
                placeholder="Mensagem"
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#8BADA4] text-white py-3 rounded-xl font-medium"
            >
              Enviar Mensagem
            </button>
          </form>
        </section>
      </div>
    </MobileLayout>
  );
} 