'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Typewriter } from '@/components/ui/typewriter'

export default function Footer() {
  return (
    <footer className="w-full bg-[#3E5A54] text-white px-6 py-20">
      <div className="max-w-[1200px] mx-auto">
        {/* Logo Title */}
        <div className="flex justify-center mb-20">
          <Link href="/" className="h-[120px] w-[400px] relative">
            <Image
              src="/logo-yallah-nobg.png"
              alt="Yallah"
              fill
              className="object-contain brightness-0 invert"
              priority
            />
          </Link>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-20">
          {/* About Column */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h3 className="text-lg mb-4 font-bold">YALLAH.</h3>
            <p className="text-lg opacity-80">
              Na YALLAH, acreditamos que cada imóvel é uma oportunidade para
              experiências únicas, conforto e momentos inesquecíveis.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-lg mb-4 font-bold">Navegação</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-white/80 hover:text-white transition-colors">Início</Link></li>
              <li><Link href="/owner/servicos" className="text-white/80 hover:text-white transition-colors">Serviços</Link></li>
              <li><Link href="/owner/como-funciona" className="text-white/80 hover:text-white transition-colors">Sobre</Link></li>
            </ul>
          </div>

          {/* Tools Column */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-lg mb-4 font-bold">Ferramentas</h3>
            <ul className="space-y-3">
              <li><Link href="/tenant" className="text-white/80 hover:text-white transition-colors">Para locatários</Link></li>
              <li><Link href="/owner" className="text-white/80 hover:text-white transition-colors">Para proprietários</Link></li>
              <li><Link href="/owner/nosso-metodo" className="text-white/80 hover:text-white transition-colors">Nosso Método</Link></li>
              <li><Link href="/owner/fale-conosco" className="text-white/80 hover:text-white transition-colors">Contato</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-lg mb-4 font-bold">Contato</h3>
            <ul className="space-y-3">
              <li><a href="mailto:contato@yallah.com" className="text-white/80 hover:text-white transition-colors">contato@yallah.com</a></li>
              <li><a href="tel:+5511999999999" className="text-white/80 hover:text-white transition-colors">+55 (11) 99999-9999</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left pt-8 border-t border-white/10 gap-4 sm:gap-0">
          <p className="text-white/60">Copyright © YALLAH {new Date().getFullYear()}</p>

          {/* Typewriter Section */}
          <div className="flex justify-center items-center">
            <div className="text-base">
              <span className="text-white/80">Desenvolvido por: </span>
              <Typewriter
                text={[
                  "TakaStudios",
                  "NETCOM"
                ]}
                speed={70}
                className="text-white font-semibold"
                waitTime={1500}
                deleteSpeed={40}
                cursorChar="|"
              />
            </div>
          </div>

          <div className="flex flex-col xs:flex-row gap-4 sm:gap-8 items-center">
            <Link href="/politica-de-privacidade" className="text-white/80 hover:text-white transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/termos-de-uso" className="text-white/80 hover:text-white transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 