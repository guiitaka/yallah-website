'use client'

import React from 'react'
import Image from 'next/image'
import { ArrowRight } from '@phosphor-icons/react'

export default function BestEvents() {
  return (
    <div className="w-full px-6 pt-40 pb-32 relative overflow-hidden">
      {/* Background Text */}
      <div className="absolute top-0 left-0 text-[200px] font-bold text-gray-50 select-none pointer-events-none leading-none -translate-y-[35px]">
        YALLAH
      </div>

      <div className="max-w-[1200px] mx-auto relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12">
          <h1 className="text-[32px] md:text-[56px] leading-[1.2] md:leading-[1.1] font-light mb-4 md:mb-0">
            Deixe que nós<br />
            gerenciamos seu imóvel
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-full md:max-w-[400px]">
            Aproveite a experiência de um imóvel com a melhor gestão do mercado.
          </p>
        </div>

        {/* Event Card */}
        <div className="w-full h-[400px] md:h-[500px] relative rounded-[20px] md:rounded-[32px] overflow-hidden">
          <Image
            src="/best.jpg"
            alt="Evento Yallah"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 md:from-black/40 to-transparent" />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 p-6 md:p-12 text-white">
            <h2 className="text-2xl md:text-4xl font-light mb-3 md:mb-4">
              Gerenciamento<br />
              de A a Z
            </h2>
            <p className="text-white/80 text-base md:text-lg max-w-[300px] md:max-w-[400px] mb-6 md:mb-8">
              Desde a locação, limpeza, e contato com os hóspedes, nós cuidamos de tudo!
            </p>
            <button className="flex items-center gap-2 bg-white text-black px-6 md:px-8 py-2.5 md:py-3 rounded-full hover:bg-white/90 transition-colors text-base md:text-lg">
              Procurar Imóveis
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 