'use client'

import React from 'react'
import Image from 'next/image'
import { ArrowRight } from '@phosphor-icons/react'

interface PropertyCard {
  image: string
  title: string
  pricePerNight: number
  description: string
}

const properties: PropertyCard[] = [
  {
    image: '/recomendado1.jpg',
    title: 'Apartamento em Moema',
    pricePerNight: 350,
    description: 'Apartamento moderno com vista privilegiada e acabamento premium.'
  },
  {
    image: '/recomendado2.jpg',
    title: 'Casa em Alphaville',
    pricePerNight: 450,
    description: 'Residência espaçosa com área de lazer completa e segurança 24h.'
  },
  {
    image: '/recomendado3.jpg',
    title: 'Cobertura Jardins',
    pricePerNight: 550,
    description: 'Cobertura duplex com terraço gourmet e vista panorâmica.'
  },
  {
    image: '/recomendado4.jpg',
    title: 'Casa de Campo',
    pricePerNight: 400,
    description: 'Refúgio perfeito com muito verde e tranquilidade.'
  }
]

export default function Recommended() {
  return (
    <div className="w-full px-6 py-32">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <h1 className="text-[56px] leading-[1.1] font-light">
            Recomendados<br />
            Para Você
          </h1>
          <p className="text-gray-500 text-lg max-w-[400px]">
            Selecionamos os melhores imóveis que combinam com o seu perfil!
          </p>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-4 gap-6">
          {properties.map((property, index) => (
            <div key={index} className="group relative rounded-[32px] overflow-hidden">
              <div className="relative aspect-[3/4]">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                {/* Darker overlay */}
                <div className="absolute inset-0 bg-black/40" />
                
                {/* Price Tag */}
                <div className="absolute top-6 right-6 bg-white px-4 py-2 rounded-full">
                  <span className="text-black font-medium">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(property.pricePerNight)} / Noite
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h3 className="text-2xl text-white font-medium mb-3">
                    {property.title}
                  </h3>
                  <p className="text-white/80 text-sm mb-6">
                    {property.description}
                  </p>
                  <button className="w-full flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-full hover:bg-white/90 transition-colors">
                    Agendar Visita
                    <ArrowRight className="w-5 h-5" weight="bold" />
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