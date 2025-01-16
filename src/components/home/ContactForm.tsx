'use client'

import React from 'react'

export default function ContactForm() {
  return (
    <div className="w-full px-6 py-32 bg-gradient-to-br from-[#8BADA4] to-[#405A53]">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 gap-20">
          {/* Left side - Form */}
          <div className="col-span-1 bg-white rounded-[32px] p-12 shadow-xl">
            <h2 className="text-4xl font-light text-[#405A53] mb-2">Entre em Contato</h2>
            <p className="text-gray-500 mb-8">24/7 Estamos aqui para ajudar você</p>
            
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nome"
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:border-[#8BADA4] focus:ring-2 focus:ring-[#8BADA4]/20 transition-all"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Sobrenome"
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:border-[#8BADA4] focus:ring-2 focus:ring-[#8BADA4]/20 transition-all"
                  />
                </div>
              </div>

              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:border-[#8BADA4] focus:ring-2 focus:ring-[#8BADA4]/20 transition-all"
                />
              </div>

              <div className="relative">
                <input
                  type="tel"
                  placeholder="Telefone"
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:border-[#8BADA4] focus:ring-2 focus:ring-[#8BADA4]/20 transition-all"
                />
              </div>

              <div className="relative">
                <textarea
                  placeholder="Descreva sua necessidade"
                  rows={4}
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:border-[#8BADA4] focus:ring-2 focus:ring-[#8BADA4]/20 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#8BADA4] text-white rounded-2xl hover:bg-[#8BADA4]/90 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Enviar Mensagem
              </button>
            </form>
          </div>

          {/* Right side - Decorative content */}
          <div className="col-span-1 flex flex-col justify-center">
            <div className="space-y-4">
              <h1 className="text-[48pt] font-black text-white text-center font-raleway leading-tight">
                Vamos conversar<br />
                <span className="whitespace-nowrap">sobre seu imóvel?</span>
              </h1>
              <p className="text-white/80 text-xl mt-8">
                Nossa equipe está pronta para te ajudar a maximizar o potencial do seu imóvel.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css?family=Raleway:900&display=swap");

        .font-raleway {
          font-family: "Raleway", sans-serif;
        }
      `}</style>
    </div>
  )
} 