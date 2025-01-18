'use client'

import React from 'react'
import Image from 'next/image'

export default function MobileAboutUs() {
  return (
    <div className="w-full px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-1 mb-3">
          <h2 className="text-base text-gray-500">Seu imóvel,</h2>
          <h3 className="text-base text-gray-500">nossa expertise</h3>
        </div>
        <h1 className="text-xl leading-snug font-light">
          Cuidamos do seu imóvel como se fosse nosso
        </h1>
      </div>

      {/* Cards */}
      <div className="space-y-6">
        {/* Card 1 */}
        <div>
          <div className="relative h-[200px] rounded-xl overflow-hidden mb-4">
            <Image
              src="/card1.jpg"
              alt="Administração Completa"
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-lg font-medium mb-2">Administração Completa</h3>
          <p className="text-sm text-gray-600">
            Cuidamos da gestão da locação e manutenção do seu imóvel
          </p>
        </div>

        {/* Card 2 */}
        <div>
          <div className="relative h-[200px] rounded-xl overflow-hidden mb-4">
            <Image
              src="/card2.jpg"
              alt="Imóvel Sempre Impecável"
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-lg font-medium mb-2">Imóvel Sempre Impecável</h3>
          <p className="text-sm text-gray-600">
            Realizamos limpeza e preparação profissional para encantar os hóspedes
          </p>
        </div>

        {/* Card 3 */}
        <div>
          <div className="relative h-[200px] rounded-xl overflow-hidden mb-4">
            <Image
              src="/card3.jpg"
              alt="Anúncio Estratégico"
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-lg font-medium mb-2">Anúncio Estratégico</h3>
          <p className="text-sm text-gray-600">
            Destacamos seu imóvel nas melhores plataformas para atrair viajantes
          </p>
        </div>

        {/* Card 4 */}
        <div>
          <div className="relative h-[200px] rounded-xl overflow-hidden mb-4">
            <Image
              src="/card4.jpg"
              alt="Sem Complicações"
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-lg font-medium mb-2">Sem Complicações</h3>
          <p className="text-sm text-gray-600">
            Você aprova os rendimentos enquanto a Yallah resolve tudo
          </p>
        </div>
      </div>
    </div>
  )
} 