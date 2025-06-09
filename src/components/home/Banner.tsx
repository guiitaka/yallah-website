'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  MapPin,
  Buildings,
  ShieldCheck,
  Money,
  ChartLineUp,
  Bed,
  House,
  Drop,
  Train,
  Mountains,
} from '@phosphor-icons/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type BannerProps = {
  userType: 'owner' | 'tenant'
}

export default function Banner({ userType }: BannerProps) {
  const pathname = usePathname()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Definindo as categorias com ícones
  const categories = [
    { name: 'Apartamentos', icon: Buildings, href: '#' },
    { name: 'Chalés', icon: House, href: '#' },
    { name: 'Kitnets', icon: Bed, href: '#' },
    { name: 'Lofts', icon: Buildings, href: '#' },
    { name: 'Perto do centro', icon: MapPin, href: '#' },
    { name: 'Piscinas incríveis', icon: Drop, href: '#' },
    { name: 'Pousadas', icon: House, href: '#' },
    { name: 'Próximos à estações', icon: Train, href: '#' },
    { name: 'Studios', icon: Buildings, href: '#' },
    { name: 'Vistas incríveis', icon: Mountains, href: '#' },
  ]

  return (
    <div className={userType === 'tenant' ? '' : 'px-4 md:px-6 pt-0 md:pt-0'}>
      {userType === 'tenant' ? (
        <div className="relative w-full h-screen overflow-hidden">
          {/* Layer 0: Background */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/banner-locatario.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Layer 2: NavMenu with Logo */}
          <nav className="absolute top-0 left-0 right-0 z-20 flex justify-center p-8">
            <Link href={pathname.includes('/mobile') ? '/mobile' : '/'}>
              <Image
                src="/logo-yallah-nobg.png"
                alt="Yallah"
                width={200}
                height={50}
                className="brightness-0 invert"
              />
            </Link>
          </nav>

          {/* Layer 1: Main Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 text-white">
            <main className="w-full max-w-4xl text-center">
              <h1 className="text-4xl md:text-6xl font-semibold mb-5 leading-tight drop-shadow-md">
                Seu próximo lar, a um clique.
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow">
                Encontre e alugue imóveis únicos para estadias curtas ou longas.
                Simples, rápido e seguro.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/owner#about-us">
                  <button className="bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-3 px-8 rounded-full hover:bg-white/20 transition-colors shadow-lg w-full sm:w-auto">
                    Conheça nossa História
                  </button>
                </Link>
                <Link href="/tenant#all-properties">
                  <button className="bg-[#8BADA4] text-white font-semibold py-3 px-8 rounded-full hover:bg-[#7A9C94] transition-colors shadow-lg w-full sm:w-auto">
                    Explorar Imóveis
                  </button>
                </Link>
              </div>
            </main>
          </div>
        </div>
      ) : (
        // Owner version - Keep original design
        <div className={`relative w-full h-[700px] md:h-[600px] overflow-hidden rounded-3xl`}>
          {/* Background Video/Image */}
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

          <div className="relative h-full mx-auto">
            <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 h-full">
              <div className="h-full flex flex-col md:flex-row md:gap-20">
                {/* Left Content for owner */}
                <div className="w-full md:max-w-[600px] text-white flex flex-col items-center text-center pt-6 md:pt-20 flex-none">
                  <h1 className="text-[40px] md:text-[64px] font-normal leading-[1.1] md:leading-tight mb-4 md:mb-8 max-w-[800px]">
                    Transforme seu imóvel em renda garantida:
                  </h1>
                  <p className="text-xl md:text-2xl opacity-100 mb-6 md:mb-10 font-light max-w-[600px]">
                    Deixe a Yallah cuidar de tudo para você.
                  </p>
                </div>

                {/* Card Container for owner */}
                <div className="flex-1 flex items-start justify-center pt-6 md:pt-20">
                  <div className="w-full md:w-[400px] bg-white/95 md:bg-white rounded-2xl p-6 md:p-6 shadow-lg text-black">
                    <div className="flex items-center gap-2 mb-4 md:mb-6">
                      <Buildings className="w-6 h-6" />
                      <h2 className="text-xl font-semibold text-gray-800">Por que anunciar na Yallah?</h2>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                      {/* Benefit 1 */}
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-[#8BADA4]/10 rounded-lg">
                          <ShieldCheck className="w-6 h-6 text-[#8BADA4]" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1 text-gray-800">Aluguel Garantido</h3>
                          <p className="text-sm text-gray-600">Receba seu aluguel em dia, independente do inquilino</p>
                        </div>
                      </div>

                      {/* Benefit 2 */}
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-[#8BADA4]/10 rounded-lg">
                          <Money className="w-6 h-6 text-[#8BADA4]" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1 text-gray-800">Valorização do Imóvel</h3>
                          <p className="text-sm text-gray-600">Manutenção preventiva e gestão profissional</p>
                        </div>
                      </div>

                      {/* Benefit 3 */}
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-[#8BADA4]/10 rounded-lg">
                          <ChartLineUp className="w-6 h-6 text-[#8BADA4]" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1 text-gray-800">Gestão Completa</h3>
                          <p className="text-sm text-gray-600">Cuidamos de tudo: desde o anúncio até a gestão do inquilino</p>
                        </div>
                      </div>

                      <button className="w-full flex items-center justify-center gap-2 py-4 bg-[#8BADA4] text-white rounded-lg hover:bg-[#8BADA4]/90 text-lg font-medium">
                        <Buildings className="w-5 h-5" />
                        Anunciar Imóvel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 