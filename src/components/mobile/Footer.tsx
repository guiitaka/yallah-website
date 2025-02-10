'use client';

import Link from 'next/link';
import Image from 'next/image';
import { InstagramLogo, FacebookLogo, WhatsappLogo } from '@phosphor-icons/react';

export default function Footer() {
  return (
    <footer className="bg-[#3E5A54] text-white py-12 px-4 mt-auto">
      <div className="container mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-[180px] h-[60px] relative">
            <Image
              src="/logo-yallah-white.png"
              alt="Yallah"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="space-y-3">
            <h3 className="font-bold text-sm mb-4">Navegação</h3>
            <Link href="/mobile/a-yallah" className="block text-sm opacity-80">
              A Yallah
            </Link>
            <Link href="/mobile/como-funciona" className="block text-sm opacity-80">
              Como Funciona
            </Link>
            <Link href="/mobile/metodo" className="block text-sm opacity-80">
              Método
            </Link>
            <Link href="/mobile/contato" className="block text-sm opacity-80">
              Contato
            </Link>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm mb-4">Categorias</h3>
            <Link href="/mobile/tenant/apartamentos" className="block text-sm opacity-80">
              Apartamentos
            </Link>
            <Link href="/mobile/tenant/chales" className="block text-sm opacity-80">
              Chalés
            </Link>
            <Link href="/mobile/tenant/pousadas" className="block text-sm opacity-80">
              Pousadas
            </Link>
            <Link href="/mobile/tenant/studios" className="block text-sm opacity-80">
              Studios
            </Link>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex justify-center gap-6 mb-8">
          <Link 
            href="https://instagram.com" 
            target="_blank"
            className="text-white hover:text-[#95CEB3] transition-colors"
          >
            <InstagramLogo size={28} weight="fill" />
          </Link>
          <Link 
            href="https://facebook.com" 
            target="_blank"
            className="text-white hover:text-[#95CEB3] transition-colors"
          >
            <FacebookLogo size={28} weight="fill" />
          </Link>
          <Link 
            href="https://wa.me/5511999999999" 
            target="_blank"
            className="text-white hover:text-[#95CEB3] transition-colors"
          >
            <WhatsappLogo size={28} weight="fill" />
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs opacity-60">
          <p>© {new Date().getFullYear()} Yallah. Todos os direitos reservados.</p>
          <p className="mt-2">Desenvolvido por Gui Takahashi</p>
        </div>
      </div>
    </footer>
  );
} 