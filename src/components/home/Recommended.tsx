'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Buildings, Calendar, GraduationCap, TreePalm, Baby } from '@phosphor-icons/react'

interface LifestyleCategory {
  image: string
  title: string
  subtitle: string
  description: string
  icon: React.ReactNode
}

const categories: LifestyleCategory[] = [
  {
    image: '/recomendado1.jpg',
    title: 'Business Ready',
    subtitle: 'Estadias para executivos',
    description: 'Imóveis equipados com espaço de trabalho, internet de alta velocidade e localização estratégica para reuniões de negócios.',
    icon: <Buildings className="w-6 h-6" weight="fill" />
  },
  {
    image: '/recomendado2.jpg',
    title: 'Vida Universitária',
    subtitle: 'Ideal para estudantes',
    description: 'Apartamentos próximos a universidades, com mobília completa, áreas de estudo e preços acessíveis.',
    icon: <GraduationCap className="w-6 h-6" weight="fill" />
  },
  {
    image: '/recomendado3.jpg',
    title: 'Espaço para Eventos',
    subtitle: 'Celebre momentos especiais',
    description: 'Propriedades com amplas áreas sociais, cozinhas equipadas e capacidade para receber seus convidados com conforto.',
    icon: <Calendar className="w-6 h-6" weight="fill" />
  },
  {
    image: '/recomendado4.jpg',
    title: 'Refúgio & Relaxamento',
    subtitle: 'Escape da rotina',
    description: 'Casas e chalés em meio à natureza, perfeitos para desconectar, relaxar e renovar as energias longe da cidade.',
    icon: <TreePalm className="w-6 h-6" weight="fill" />
  },
  {
    image: '/recomendado1.jpg', // Reusing image as placeholder - you might want to replace with a dedicated image
    title: 'Estadia Familiar',
    subtitle: 'Perfeito para famílias',
    description: 'Casas espaçosas com múltiplos quartos, áreas de lazer seguras para crianças e localizações próximas a parques e atrações familiares.',
    icon: <Baby className="w-6 h-6" weight="fill" />
  }
]

export default function Recommended() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Remover a ativação imediata da animação
    // setIsVisible(true);

    // Optional: Trigger animation when scrolled into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            // Opcional: resetar a animação quando a seção não estiver mais visível
            // setIsVisible(false);
          }
        });
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('recommended-section');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  return (
    <div id="recommended-section" className="w-full py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden relative">
      {/* Animated decorative elements in the background */}
      <div className={`absolute -top-20 -left-20 w-40 h-40 rounded-full bg-[#8BADA4]/10 blur-3xl transition-all duration-[1200ms] ease-out ${isVisible ? 'opacity-100' : 'opacity-0 -translate-x-10'}`}></div>
      <div className={`absolute top-1/2 -right-40 w-80 h-80 rounded-full bg-[#8BADA4]/5 blur-3xl transition-all duration-[1400ms] delay-[500ms] ease-out ${isVisible ? 'opacity-100' : 'opacity-0 translate-x-10'}`}></div>
      <div className={`absolute bottom-20 left-1/4 w-60 h-60 rounded-full bg-[#FFD700]/5 blur-3xl transition-all duration-[1600ms] delay-[600ms] ease-out ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}></div>

      <div className="max-w-[1600px] mx-auto px-4">
        {/* Hero Title Section */}
        <div className="mb-12 md:mb-16 text-center">
          <div className={`inline-block mb-4 px-6 py-2 bg-[#8BADA4]/10 rounded-full transition-all duration-[1200ms] ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-8'}`}>
            <span className="text-[#8BADA4] font-medium">Escolhas Sob Medida</span>
          </div>

          <h1 className={`text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 mb-8 leading-[1.1] max-w-6xl mx-auto transition-all duration-[1500ms] ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-12'}`}>
            <div className="md:mb-2">Selecionamos os melhores imóveis</div>
            <div className="relative inline-block">
              <span className="relative z-10">que <span className="text-[#8BADA4]">combinam com o seu perfil!</span></span>
              <span className={`absolute bottom-[-5px] md:bottom-[-8px] left-0 h-3 bg-[#8BADA4]/20 w-0 transition-all duration-[2000ms] ease-out ${isVisible ? 'w-full' : 'w-0'}`}></span>
            </div>
          </h1>

          <p className={`text-lg md:text-xl text-gray-600 max-w-2xl mx-auto transition-all duration-[1300ms] delay-[400ms] ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-8'}`}>
            Descubra acomodações que refletem seu estilo de vida e necessidades específicas
          </p>
        </div>

        {/* Lifestyle Categories Grid - Adjusted for 5 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 w-full">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-[900ms] transform hover:-translate-y-2 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-12'}`}
              style={{
                transitionDelay: `${index * 150}ms`,
                transitionProperty: 'transform, opacity, box-shadow',
              }}
            >
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority={index < 2}
                />
                {/* Enhanced overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-4 right-4 bg-[#8BADA4]/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-0 opacity-100 group-hover:translate-y-1 transition-all duration-300">
                  {category.icon}
                  <span className="text-white text-sm font-medium">
                    {category.subtitle}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 p-5 md:p-6 w-full">
                  <h3 className="text-xl md:text-2xl text-white font-bold mb-2">
                    {category.title}
                  </h3>
                  <p className="text-white/90 text-sm mb-5 line-clamp-3">
                    {category.description}
                  </p>
                  <button className="w-full flex items-center justify-center gap-2 bg-white text-black px-4 py-2.5 rounded-full hover:bg-[#8BADA4] hover:text-white transition-colors duration-300 group-hover:shadow-lg text-sm md:text-base">
                    Explorar opções
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" weight="bold" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 