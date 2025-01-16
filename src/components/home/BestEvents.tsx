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
        <div className="flex justify-between items-start mb-12">
          <h1 className="text-[56px] leading-[1.1] font-light">
            Deixe que nós<br />
            gerenciamos seu imóvel
          </h1>
          <p className="text-gray-500 text-lg max-w-[400px]">
            Aproveite a experiência de um imóvel com a melhor gestão do mercado.
          </p>
        </div>

        {/* Event Card */}
        <div className="w-full h-[500px] relative rounded-[32px] overflow-hidden">
          <Image
            src="/best.jpg"
            alt="Evento Yallah"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 p-12 text-white">
            <h2 className="text-4xl font-light mb-4">
              Gerenciamento<br />
              de A a Z
            </h2>
            <p className="text-white/80 text-lg max-w-[400px] mb-8">
              Desde a locação, limpeza, e contato com os hóspedes, nós cuidamos de tudo!
            </p>
            <button className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full hover:bg-white/90 transition-colors">
              Procurar Imóveis
              <ArrowRight className="w-5 h-5" weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 