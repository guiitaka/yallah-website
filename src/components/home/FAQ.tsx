'use client'

import React, { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: "Como funciona o processo de gestão de imóveis com a Yallah?",
    answer: "Na Yallah, simplificamos todo o processo de gestão do seu imóvel. Nossa equipe cuida de tudo: desde a preparação do imóvel, fotos profissionais, anúncios estratégicos, até a gestão completa das locações, incluindo limpeza, manutenção e atendimento aos hóspedes. Você só precisa disponibilizar seu imóvel e começar a receber os rendimentos."
  },
  {
    question: "Quais tipos de imóveis a Yallah administra?",
    answer: "Trabalhamos com apartamentos, lofts e estúdios bem localizados em São Paulo. Nosso foco são imóveis compactos e modernos, ideais para locações de curta temporada, seja para viajantes a negócios ou turistas que buscam uma experiência diferenciada de hospedagem."
  },
  {
    question: "Como é feita a manutenção e limpeza dos imóveis?",
    answer: "Nossa equipe especializada realiza limpeza profissional e preparação completa entre as locações. Fazemos vistorias regulares, manutenções preventivas e, quando necessário, manutenções corretivas. Tudo isso para manter seu imóvel sempre impecável e valorizado."
  },
  {
    question: "Qual é o retorno financeiro que posso esperar?",
    answer: "O retorno varia de acordo com as características do seu imóvel, localização e período do ano. Com nossa gestão profissional e estratégia de precificação dinâmica, buscamos maximizar sua rentabilidade, geralmente superando os valores de locação tradicional."
  },
  {
    question: "Como é feito o pagamento aos proprietários?",
    answer: "Realizamos pagamentos mensais aos proprietários, com relatórios detalhados de ocupação e receitas. Nossa taxa de administração é transparente e já inclui todos os serviços de gestão, limpeza e manutenção do imóvel."
  }
]

function FAQItem({ question, answer }: FAQItem) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 py-4 md:py-6">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg md:text-xl pr-4 text-gray-900 font-medium">{question}</span>
        <span className="text-xl md:text-2xl flex-shrink-0 text-gray-900">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <p className="mt-3 md:mt-4 text-gray-600 text-base md:text-lg leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <div className="w-full px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20">
          {/* Left Side */}
          <div className="col-span-1 md:col-span-4">
            <h2 className="text-3xl md:text-5xl font-light text-gray-900">Perguntas Frequentes</h2>
            <p className="mt-4 md:mt-6 text-gray-600 text-base md:text-lg">
              Tire suas dúvidas sobre como a Yallah pode transformar seu imóvel em uma fonte de renda sem preocupações ou encontrar o lugar perfeito para sua estadia em São Paulo.
            </p>
          </div>

          {/* Right Side - FAQ Items */}
          <div className="col-span-1 md:col-span-8">
            {faqItems.map((item, index) => (
              <FAQItem key={index} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 