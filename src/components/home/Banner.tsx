'use client'

import React from 'react'
import Image from 'next/image'
import { MapPin, Calendar, Users, Buildings, ShieldCheck, Money, ChartLineUp } from '@phosphor-icons/react'

type BannerProps = {
  userType: 'owner' | 'tenant'
}

export default function Banner({ userType }: BannerProps) {
  return (
    <div className="px-4 md:px-6 pt-4 md:pt-10">
      <div className="relative w-full h-[750px] md:h-[600px] overflow-hidden rounded-3xl">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/banner.jpg"
            alt="Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60 md:bg-black/40" />
        </div>

        <div className="relative h-full mx-auto flex flex-col md:flex-row md:items-center pt-8 md:pt-0">
          <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:gap-20">
              {/* Left Content */}
              <div className="md:max-w-[600px] text-white">
                <h1 className="text-[40px] md:text-[64px] font-normal leading-[1.1] md:leading-tight mb-4 md:mb-8">
                  Transforme seu imóvel em renda garantida:
                </h1>
                <p className="text-xl md:text-2xl opacity-100 mb-6 md:mb-10 font-light">
                  Deixe a Yallah cuidar de tudo para você.
                </p>
                {userType === 'tenant' && (
                  <button className="w-full md:w-auto flex items-center justify-center md:justify-start gap-2 px-6 md:px-8 py-4 md:py-4 bg-[#8BADA4] text-white rounded-full hover:bg-[#8BADA4]/90 text-lg">
                    <Buildings className="w-5 h-5" />
                    Encontrar Imóvel
                  </button>
                )}
              </div>

              {userType === 'owner' ? (
                /* Benefits Card for Owners */
                <div className="mt-6 md:mt-0 w-full md:w-[400px] bg-white/95 md:bg-white rounded-2xl p-6 md:p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-4 md:mb-6">
                    <Buildings className="w-6 h-6" />
                    <h2 className="text-xl font-semibold">Por que anunciar na Yallah?</h2>
                  </div>

                  <div className="space-y-4 md:space-y-6">
                    {/* Benefit 1 */}
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-[#8BADA4]/10 rounded-lg">
                        <ShieldCheck className="w-6 h-6 text-[#8BADA4]" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Aluguel Garantido</h3>
                        <p className="text-sm text-gray-600">Receba seu aluguel em dia, independente do inquilino</p>
                      </div>
                    </div>

                    {/* Benefit 2 */}
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-[#8BADA4]/10 rounded-lg">
                        <Money className="w-6 h-6 text-[#8BADA4]" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Valorização do Imóvel</h3>
                        <p className="text-sm text-gray-600">Manutenção preventiva e gestão profissional</p>
                      </div>
                    </div>

                    {/* Benefit 3 */}
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-[#8BADA4]/10 rounded-lg">
                        <ChartLineUp className="w-6 h-6 text-[#8BADA4]" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Gestão Completa</h3>
                        <p className="text-sm text-gray-600">Cuidamos de tudo: desde o anúncio até a gestão do inquilino</p>
                      </div>
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 py-4 bg-[#8BADA4] text-white rounded-lg hover:bg-[#8BADA4]/90 text-lg">
                      <Buildings className="w-5 h-5" />
                      Anunciar Imóvel
                    </button>
                  </div>
                </div>
              ) : (
                /* Search Form for Tenants */
                <div className="mt-6 md:mt-0 w-full md:w-[400px] bg-white/95 md:bg-white rounded-2xl p-6 md:p-6 shadow-lg">
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
                          className="w-full p-4 md:p-3 bg-gray-50 rounded-lg pl-12 md:pl-10 text-base"
                        />
                        <MapPin className="w-5 h-5 absolute left-4 md:left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>

                    {/* Type */}
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Tipo de Imóvel</label>
                      <select className="w-full p-4 md:p-3 bg-gray-50 rounded-lg appearance-none text-base">
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
                          className="w-1/2 p-4 md:p-3 bg-gray-50 rounded-lg text-base"
                        />
                        <input
                          type="text"
                          placeholder="Máximo"
                          className="w-1/2 p-4 md:p-3 bg-gray-50 rounded-lg text-base"
                        />
                      </div>
                    </div>

                    <button className="w-full py-4 md:py-3 bg-[#8BADA4] text-white rounded-lg hover:bg-[#8BADA4]/90 mt-2 text-base">
                      Buscar Imóvel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 