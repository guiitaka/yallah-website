'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Calendar, MagnifyingGlass, CaretDown } from '@phosphor-icons/react'
import { useState } from 'react'

type HeroSearchProps = {
  userType: 'owner' | 'tenant'
}

export default function HeroSearch({ userType }: HeroSearchProps) {
  if (userType !== 'tenant') return null

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
        {/* Left Content */}
        <div className="flex-1 max-w-[600px]">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Vamos{' '}
            <span className="relative">
              encontrar
              <span className="absolute left-0 right-0 bottom-1 h-1 bg-[#8BADA4]"></span>
            </span>{' '}
            seu lar
          </h1>
          <p className="text-gray-500 text-lg md:text-xl mb-8">
            Desfrute de uma experiência única em imóveis selecionados. Relaxe e realize seus sonhos com a Yallah
          </p>

          {/* Search Form */}
          <div className="bg-white rounded-2xl p-6 shadow-lg relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Location */}
              <div className="relative">
                <label className="text-sm text-gray-600 mb-1 block">Localização</label>
                <div className="relative">
                  <select className="w-full p-3 bg-gray-50 rounded-lg appearance-none pr-10 text-gray-700">
                    <option>São Paulo</option>
                    <option>Rio de Janeiro</option>
                    <option>Curitiba</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex gap-2 items-center text-gray-400">
                    <MapPin className="w-5 h-5" />
                    <CaretDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Data</label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full p-3 bg-gray-50 rounded-lg appearance-none pr-10 text-gray-700"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex gap-2 items-center text-gray-400">
                    <Calendar className="w-5 h-5" />
                    <CaretDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Faixa de Preço</label>
                <div className="relative">
                  <select className="w-full p-3 bg-gray-50 rounded-lg appearance-none pr-10 text-gray-700">
                    <option>R$ 600-2000</option>
                    <option>R$ 2000-4000</option>
                    <option>R$ 4000+</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex gap-2 items-center text-gray-400">
                    <CaretDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            <button className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-[#8BADA4] text-white rounded-full hover:bg-[#8BADA4]/90 transition-colors">
              <MagnifyingGlass className="w-6 h-6" />
            </button>
          </div>

          {/* Social Links */}
          <div className="mt-8 flex items-center gap-6">
            <span className="text-gray-500">Siga-nos</span>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-gray-600">
                <Image src="/social/facebook-icon.png" alt="Facebook" width={24} height={24} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600">
                <Image src="/social/instagram-icon.png" alt="Instagram" width={24} height={24} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600">
                <Image src="/social/X-icon.png" alt="X (Twitter)" width={24} height={24} />
              </Link>
            </div>
          </div>

          {/* Partners */}
          <div className="mt-8 flex items-center gap-4">
            <span className="text-gray-500">Parceiros</span>
            <div className="flex gap-4">
              <Image src="/partners/airbnb-icon.png" alt="Airbnb" width={24} height={24} className="opacity-50" />
              <Image src="/partners/booking-icon.svg" alt="Booking" width={24} height={24} className="opacity-50" />
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 relative hidden md:block">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <Image
                  src="/hero/destination1.jpg"
                  alt="Imóvel"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <Image
                  src="/hero/destination2.jpeg"
                  alt="Imóvel"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="mt-8">
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                <Image
                  src="/hero/destination3.JPG"
                  alt="Imóvel"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Best Packages Link */}
          <Link
            href="#"
            className="absolute bottom-4 right-4 text-[#8BADA4] font-medium hover:underline"
          >
            Ver Todos os Imóveis
          </Link>
        </div>
      </div>
    </div>
  )
} 