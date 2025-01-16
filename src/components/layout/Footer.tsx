'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="w-full bg-white px-6 py-20 rounded-b-[32px]">
      <div className="max-w-[1200px] mx-auto">
        {/* Logo Title */}
        <div className="flex justify-center mb-20">
          <Image
            src="/logo-yallah-nobg.png"
            alt="Yallah"
            width={400}
            height={120}
            className="h-[120px] w-auto"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-5 gap-8 mb-20">
          {/* About Column */}
          <div className="col-span-2">
            <h3 className="text-lg mb-4 text-[#405A53]">YALLAH.</h3>
            <p className="text-[#8BADA4] text-lg">
              Na YALLAH, acreditamos que cada imóvel é uma oportunidade para 
              experiências únicas, conforto e momentos inesquecíveis.
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-lg mb-4 text-[#405A53]">Navegação</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-[#8BADA4] hover:text-[#405A53] transition-colors">Serviços</Link></li>
              <li><Link href="#" className="text-[#8BADA4] hover:text-[#405A53] transition-colors">Imóveis</Link></li>
              <li><Link href="#" className="text-[#8BADA4] hover:text-[#405A53] transition-colors">Sobre</Link></li>
            </ul>
          </div>

          {/* Tools Column */}
          <div>
            <h3 className="text-lg mb-4 text-[#405A53]">Ferramentas</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-[#8BADA4] hover:text-[#405A53] transition-colors">Gestão de Imóveis</Link></li>
              <li><Link href="#" className="text-[#8BADA4] hover:text-[#405A53] transition-colors">Análise de Mercado</Link></li>
              <li><Link href="#" className="text-[#8BADA4] hover:text-[#405A53] transition-colors">Atendimento 24h</Link></li>
              <li><Link href="#" className="text-[#8BADA4] hover:text-[#405A53] transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-lg mb-4 text-[#405A53]">Contato</h3>
            <ul className="space-y-3">
              <li><a href="mailto:contato@yallah.com" className="text-[#8BADA4] hover:text-[#405A53] transition-colors">contato@yallah.com</a></li>
              <li><a href="tel:+5511999999999" className="text-[#8BADA4] hover:text-[#405A53] transition-colors">+55 (11) 99999-9999</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex justify-between items-center pt-8 border-t border-[#405A53]/10">
          <p className="text-[#8BADA4]">Copyright © YALLAH 2024</p>
          <div className="flex gap-8">
            <Link href="#" className="text-[#8BADA4] hover:text-[#405A53] transition-colors">
              Política de Privacidade
            </Link>
            <Link href="#" className="text-[#8BADA4] hover:text-[#405A53] transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 