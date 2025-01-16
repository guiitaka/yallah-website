'use client'

import React from 'react'
import Image from 'next/image'
import { MapPin, Calendar, Users, Buildings } from '@phosphor-icons/react'

export default function Banner() {
  return (
    <div className="px-6 pt-10">
      <div className="relative w-full h-[600px] overflow-hidden rounded-3xl">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/banner.jpg"
            alt="Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative max-w-[1200px] h-full mx-auto px-6 flex items-center">
          <div className="flex gap-20">
            {/* Left Content */}
            <div className="max-w-[600px] text-white">
              <h1 className="text-[64px] font-normal leading-tight mb-8">
                Transforme seu imóvel em renda garantida:
              </h1>
              <p className="text-2xl opacity-100 mb-10 font-light">
                Deixe a Yallah cuidar de tudo para você.
              </p>
              <button className="flex items-center gap-2 px-8 py-4 bg-[#8BADA4] text-white rounded-full hover:bg-[#8BADA4]/90 text-lg">
                <Buildings className="w-5 h-5" />
                Encontrar Imóvel
              </button>
            </div>

            {/* Search Form */}
            <div className="w-[400px] bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Buildings className="w-6 h-6" />
                <h2 className="text-xl font-semibold">Encontrar Imóveis</h2>
              </div>

              <div className="space-y-4">
                {/* Location */}
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Cidade ou Região</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Digite a localização"
                      className="w-full p-3 bg-gray-50 rounded-lg pl-10"
                    />
                    <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Tipo de Imóvel</label>
                  <select className="w-full p-3 bg-gray-50 rounded-lg appearance-none">
                    <option>Apartamento</option>
                    <option>Casa</option>
                    <option>Comercial</option>
                    <option>Terreno</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Faixa de Preço</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Mínimo"
                      className="w-1/2 p-3 bg-gray-50 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Máximo"
                      className="w-1/2 p-3 bg-gray-50 rounded-lg"
                    />
                  </div>
                </div>

                <button className="w-full py-3 bg-[#8BADA4] text-white rounded-lg hover:bg-[#8BADA4]/90 mt-2">
                  Buscar Imóvel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 