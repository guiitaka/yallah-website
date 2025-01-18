'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'

export default function AboutUs() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
      }
    )

    document.querySelectorAll('.animate-fadeIn, .animate-slideUp, .animate-scaleUp').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="w-full px-4 md:px-6 py-16 md:py-32 relative overflow-hidden">
      {/* Background Text */}
      <div className="absolute top-0 right-0 text-[100px] md:text-[200px] font-bold text-gray-50 select-none pointer-events-none leading-none -translate-y-8">
        YALLAH
      </div>

      <div className="max-w-[1200px] mx-auto relative">
        {/* Header */}
        <div className="mb-10 md:mb-20">
          <h2 className="text-xl md:text-2xl text-gray-500 mb-3 md:mb-4 animate-fadeIn opacity-0">Sobre Nós</h2>
          <h1 className="text-3xl md:text-[56px] leading-[1.2] md:leading-[1.1] font-light max-w-[1000px] animate-slideUp opacity-0">
            Cuidamos do seu imóvel, realizamos os sonhos de quem busca um lar temporário&nbsp;em São Paulo.
          </h1>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* First Row */}
          <div className="md:col-span-6 md:col-start-1">
            <div className="animate-scaleUp opacity-0">
              <div className="relative aspect-square rounded-[20px] md:rounded-[32px] overflow-hidden">
                <Image
                  src="/card1.jpg"
                  alt="Yallah Imóveis"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <div className="animate-fadeIn opacity-0">
              <div className="bg-white rounded-[20px] md:rounded-[32px] p-6 md:p-12 shadow-lg">
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  Na Yallah, acreditamos que cada imóvel tem o potencial de ser mais do que paredes e teto – é um espaço para criar memórias e viver experiências únicas. Nossa missão é simplificar a gestão de imóveis, conectando proprietários a locatários que valorizam conforto, praticidade e um lugar especial para chamar de lar, mesmo que por pouco tempo.
                </p>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="md:col-span-6 md:col-start-1">
            <div className="animate-fadeIn opacity-0">
              <div className="bg-white rounded-[20px] md:rounded-[32px] p-6 md:p-12 shadow-lg mt-4 md:mt-6">
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  Com anos de experiência no mercado imobiliário, nossa equipe é especializada em transformar propriedades em ativos rentáveis. Trabalhamos com dedicação para oferecer aos proprietários uma gestão sem preocupações e aos locatários uma estadia impecável, marcada pela excelência e personalização.
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <div className="animate-scaleUp opacity-0">
              <div className="relative aspect-square rounded-[20px] md:rounded-[32px] overflow-hidden mt-4 md:mt-6">
                <Image
                  src="/card2.jpg"
                  alt="Interior Yallah"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Third Row */}
          <div className="md:col-span-6 md:col-start-1">
            <div className="animate-scaleUp opacity-0">
              <div className="relative aspect-square rounded-[20px] md:rounded-[32px] overflow-hidden mt-4 md:mt-6">
                <Image
                  src="/card3.jpg"
                  alt="Equipe Yallah"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <div className="animate-fadeIn opacity-0">
              <div className="bg-white rounded-[20px] md:rounded-[32px] p-6 md:p-12 shadow-lg mt-4 md:mt-6">
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  Nosso compromisso vai além da locação de imóveis. Oferecemos serviços completos de gestão, incluindo limpeza, organização e atendimento ao cliente. Assim, proporcionamos tranquilidade aos proprietários e garantimos uma experiência memorável aos hóspedes que confiam na Yallah para encontrar o espaço perfeito em São Paulo.
                </p>
              </div>
            </div>
          </div>

          {/* Fourth Row */}
          <div className="md:col-span-6 md:col-start-1">
            <div className="animate-fadeIn opacity-0">
              <div className="bg-white rounded-[20px] md:rounded-[32px] p-6 md:p-12 shadow-lg mt-4 md:mt-6">
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  Nossa plataforma digital intuitiva e equipe dedicada trabalham em conjunto para garantir uma experiência sem complicações. Desde o primeiro contato até o final da estadia, estamos presentes para assegurar que tanto proprietários quanto locatários tenham suas expectativas superadas, construindo relacionamentos duradouros baseados em confiança e excelência.
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <div className="animate-scaleUp opacity-0">
              <div className="relative aspect-square rounded-[20px] md:rounded-[32px] overflow-hidden mt-4 md:mt-6">
                <Image
                  src="/card4.jpg"
                  alt="Experiência Yallah"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
          animation-play-state: paused;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
          animation-play-state: paused;
        }

        .animate-scaleUp {
          animation: scaleUp 0.8s ease-out forwards;
          animation-play-state: paused;
        }

        .is-visible .animate-fadeIn,
        .is-visible .animate-slideUp,
        .is-visible .animate-scaleUp,
        .animate-fadeIn.is-visible,
        .animate-slideUp.is-visible,
        .animate-scaleUp.is-visible {
          animation-play-state: running;
        }
      `}</style>
    </div>
  )
} 