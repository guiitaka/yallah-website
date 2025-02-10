'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="w-full bg-[#3E5A54] text-white px-6 py-20">
      <div className="max-w-[1200px] mx-auto">
        {/* Logo Title */}
        <div className="flex justify-center mb-20">
          <div className="h-[120px] w-[400px] relative">
            <Image
              src="/logo-yallah-nobg.png"
              alt="Yallah"
              fill
              className="object-contain brightness-0 invert"
              priority
            />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-5 gap-8 mb-20">
          {/* About Column */}
          <div className="col-span-2">
            <h3 className="text-lg mb-4 font-bold">YALLAH.</h3>
            <p className="text-lg opacity-80">
              Na YALLAH, acreditamos que cada imóvel é uma oportunidade para
              experiências únicas, conforto e momentos inesquecíveis.
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-lg mb-4 font-bold">Navegação</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-white/80 hover:text-white transition-colors">Serviços</Link></li>
              <li><Link href="#" className="text-white/80 hover:text-white transition-colors">Imóveis</Link></li>
              <li><Link href="#" className="text-white/80 hover:text-white transition-colors">Sobre</Link></li>
            </ul>
          </div>

          {/* Tools Column */}
          <div>
            <h3 className="text-lg mb-4 font-bold">Ferramentas</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-white/80 hover:text-white transition-colors">Gestão de Imóveis</Link></li>
              <li><Link href="#" className="text-white/80 hover:text-white transition-colors">Análise de Mercado</Link></li>
              <li><Link href="#" className="text-white/80 hover:text-white transition-colors">Atendimento 24h</Link></li>
              <li><Link href="#" className="text-white/80 hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-lg mb-4 font-bold">Contato</h3>
            <ul className="space-y-3">
              <li><a href="mailto:contato@yallah.com" className="text-white/80 hover:text-white transition-colors">contato@yallah.com</a></li>
              <li><a href="tel:+5511999999999" className="text-white/80 hover:text-white transition-colors">+55 (11) 99999-9999</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex justify-between items-center pt-8 border-t border-white/10">
          <p className="text-white/60">Copyright © YALLAH {new Date().getFullYear()}</p>
          <div className="flex gap-8">
            <Link href="#" className="text-white/80 hover:text-white transition-colors">
              Política de Privacidade
            </Link>
            <Link href="#" className="text-white/80 hover:text-white transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 