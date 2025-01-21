'use client'

import React from 'react'
import Image from 'next/image'
import { ArrowUpRight } from '@phosphor-icons/react'
import AutoplayVideo from '../AutoplayVideo'

interface ServiceCard {
  title: string
  description: string
  videoSrc: {
    mp4: string
    webm: string
  }
}

// Base URL para os vídeos no GitHub
const GITHUB_VIDEO_BASE_URL = 'https://user-images.githubusercontent.com/YOUR_USER_ID/YOUR_REPO'

const services: ServiceCard[] = [
  {
    title: 'Administração Completa',
    description: 'Cuidamos da gestão, locação e manutenção do seu imóvel, garantindo tranquilidade e rentabilidade máxima.',
    videoSrc: {
      mp4: `${GITHUB_VIDEO_BASE_URL}/administracao.mp4`,
      webm: `${GITHUB_VIDEO_BASE_URL}/administracao.webm`
    }
  },
  {
    title: 'Imóvel sempre Impecável',
    description: 'Realizamos limpeza e preparação profissional para encantar os hóspedes e valorizar seu patrimônio.',
    videoSrc: {
      mp4: `${GITHUB_VIDEO_BASE_URL}/imovel-impecavel.mp4`,
      webm: `${GITHUB_VIDEO_BASE_URL}/imovel-impecavel.webm`
    }
  },
  {
    title: 'Anúncios Estratégicos',
    description: 'Destacamos seu imóvel nas melhores plataformas para atrair viajantes e profissionais de alto padrão.',
    videoSrc: {
      mp4: `${GITHUB_VIDEO_BASE_URL}/anuncios.mp4`,
      webm: `${GITHUB_VIDEO_BASE_URL}/anuncios.webm`
    }
  },
  {
    title: 'Sem Complicações',
    description: 'Você aproveita os rendimentos enquanto a Yallah resolve tudo, do check-in ao check-out.',
    videoSrc: {
      mp4: `${GITHUB_VIDEO_BASE_URL}/complicacoes.mp4`,
      webm: `${GITHUB_VIDEO_BASE_URL}/complicacoes.webm`
    }
  }
]

export default function Promotions() {
  return (
    <div className="w-full px-6 py-20">
      <div className="max-w-[1200px] mx-auto">
        {/* Header Section */}
        <div className="grid grid-cols-12 gap-20 mb-20">
          {/* Left Side */}
          <div className="col-span-2">
            <h2 className="text-2xl text-gray-500">Seu imóvel, nossa expertise</h2>
          </div>

          {/* Middle - Main Title */}
          <div className="col-span-5">
            <h1 className="text-[56px] leading-[1.1] font-light">
              Cuidamos do seu imóvel como se fosse nosso
            </h1>
          </div>

          {/* Right Side - Description */}
          <div className="col-span-5">
            <p className="text-gray-500 mb-8 text-lg">
              A Yallah oferece gestão completa para seu imóvel: Desde a administração da locação até a manutenção e limpeza. Transformamos apartamentos, lofts e estúdios em fontes de renda, cuidando de cada detalhe para você.
            </p>
            <button className="px-8 py-3 bg-[#8BADA4] text-white rounded-full hover:bg-[#8BADA4]/90 text-lg">
              Ver Todos
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Video Container */}
              <div className="relative aspect-square rounded-[32px] overflow-hidden bg-gray-100">
                <AutoplayVideo
                  videoSrc={service.videoSrc}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10" />
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="text-xl font-medium mb-2">{service.title}</h3>
                <p className="text-gray-500">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 