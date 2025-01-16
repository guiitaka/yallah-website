'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'

export default function AboutUs() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target) // Para a animação acontecer apenas uma vez
          }
        })
      },
      {
        threshold: 0.3 // Dispara quando 30% da seção estiver visível
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <div className="w-full px-6 py-32 relative overflow-hidden" ref={sectionRef}>
      {/* Background Text */}
      <div className="absolute top-0 right-0 text-[200px] font-bold text-gray-50 select-none pointer-events-none leading-none -translate-y-8">
        YALLAH
      </div>

      <div className="max-w-[1200px] mx-auto relative">
        {/* Header */}
        <div className="mb-20">
          <h2 className="text-2xl text-gray-500 mb-4 animate-fadeIn opacity-0">Sobre Nós</h2>
          <h1 className="text-[56px] leading-[1.1] font-light max-w-[1000px] animate-slideUp opacity-0">
            Cuidamos do seu imóvel, realizamos os sonhos de quem busca um lar temporário&nbsp;em São Paulo.
          </h1>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* First Row */}
          <div className="col-span-5 col-start-1 animate-scaleUp opacity-0">
            <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden">
              <Image
                src="/card1.jpg"
                alt="Yallah Imóveis"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="col-span-4 col-start-6 bg-white rounded-[32px] p-12 shadow-lg animate-fadeIn opacity-0 delay-300">
            <p className="text-gray-600 text-lg leading-relaxed">
              Na Yallah, acreditamos que cada imóvel tem o potencial de ser mais do que paredes e teto – é um espaço para criar memórias e viver experiências únicas. Nossa missão é simplificar a gestão de imóveis, conectando proprietários a locatários que valorizam conforto, praticidade e um lugar especial para chamar de lar, mesmo que por pouco tempo.
            </p>
          </div>

          <div className="col-span-3 col-start-10 animate-scaleUp opacity-0 delay-150">
            <div className="relative aspect-square rounded-[32px] overflow-hidden">
              <Image
                src="/card2.jpg"
                alt="Interior Yallah"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="col-span-4 col-start-2 bg-white rounded-[32px] p-12 shadow-lg mt-6 animate-fadeIn opacity-0 delay-450">
            <p className="text-gray-600 text-lg leading-relaxed">
              Com anos de experiência no mercado imobiliário, nossa equipe é especializada em transformar propriedades em ativos rentáveis. Trabalhamos com dedicação para oferecer aos proprietários uma gestão sem preocupações e aos locatários uma estadia impecável, marcada pela excelência e personalização.
            </p>
          </div>

          <div className="col-span-3 col-start-6 mt-6 animate-scaleUp opacity-0 delay-300">
            <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden">
              <Image
                src="/card3.jpg"
                alt="Equipe Yallah"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="col-span-4 col-start-9 bg-white rounded-[32px] p-12 shadow-lg mt-6 animate-fadeIn opacity-0 delay-600">
            <p className="text-gray-600 text-lg leading-relaxed">
              Nosso compromisso vai além da locação de imóveis. Oferecemos serviços completos de gestão, incluindo limpeza, organização e atendimento ao cliente. Assim, proporcionamos tranquilidade aos proprietários e garantimos uma experiência memorável aos hóspedes que confiam na Yallah para encontrar o espaço perfeito em São Paulo.
            </p>
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
        .is-visible .animate-scaleUp {
          animation-play-state: running;
        }

        .delay-150 {
          animation-delay: 150ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .delay-450 {
          animation-delay: 450ms;
        }

        .delay-600 {
          animation-delay: 600ms;
        }
      `}</style>
    </div>
  )
} 