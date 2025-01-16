'use client'

import React from 'react'
import { House } from '@phosphor-icons/react'

export default function CallToAction() {
  return (
    <div className="w-full h-[600px] relative">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" />
        <img
          src="/CTA.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-20 max-w-[1200px] mx-auto h-full flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-[56px] font-light text-white max-w-[900px] leading-[1.2] mb-4">
          Pronto para encontrar seu próximo{' '}
          <span className="text-white">lar? Conecte-se com a Yallah hoje</span>
        </h2>
        <p className="text-[32px] font-light text-white/60 mb-12">
          e comece a planejar sua estadia dos sonhos.
        </p>

        <button className="flex items-center gap-3 bg-[#8BADA4] text-white px-8 py-4 rounded-full text-lg hover:bg-[#8BADA4]/90 transition-colors">
          <House weight="bold" className="w-5 h-5" />
          Agendar Visita
        </button>
      </div>
    </div>
  )
} 