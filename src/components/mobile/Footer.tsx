'use client';

import Link from 'next/link';
import Image from 'next/image';
import { InstagramLogo, FacebookLogo, WhatsappLogo } from '@phosphor-icons/react';
import { Typewriter } from '@/components/ui/typewriter';

export default function Footer() {
    return (
        <footer className="bg-[#3E5A54] text-white py-8 px-4 mt-auto mb-[80px] relative z-[20]">
            <div className="container mx-auto">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link href="/mobile" className="w-[180px] h-[60px] relative">
                        <Image
                            src="/logo-yallah-nobg.png"
                            alt="Yallah"
                            fill
                            className="object-contain brightness-0 invert"
                            priority
                        />
                    </Link>
                </div>

                {/* Links */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-8 mb-8">
                    <div className="space-y-3">
                        <h3 className="font-bold text-sm mb-4">Navegação</h3>
                        <Link href="/mobile" className="block text-sm opacity-80">
                            Início
                        </Link>
                        <Link href="/mobile/owner/servicos" className="block text-sm opacity-80">
                            Serviços
                        </Link>
                        <Link href="/mobile/owner/como-funciona" className="block text-sm opacity-80">
                            Como Funciona
                        </Link>
                        <Link href="/mobile/owner/nosso-metodo" className="block text-sm opacity-80">
                            Nosso Método
                        </Link>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-bold text-sm mb-4">Ferramentas</h3>
                        <Link href="/mobile/tenant" className="block text-sm opacity-80">
                            Para locatários
                        </Link>
                        <Link href="/mobile/owner" className="block text-sm opacity-80">
                            Para proprietários
                        </Link>
                        <Link href="/mobile/owner/fale-conosco" className="block text-sm opacity-80">
                            Contato
                        </Link>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-bold text-sm mb-4">Contato</h3>
                        <a href="mailto:contato@yallah.com" className="block text-sm opacity-80">contato@yallah.com</a>
                        <a href="tel:+5511999999999" className="block text-sm opacity-80">+55 (11) 99999-9999</a>
                    </div>
                </div>

                {/* Social Media */}
                <div className="flex justify-center gap-6 mb-6">
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

                {/* Copyright e Links Legais */}
                <div className="text-center text-xs opacity-60 mt-4 flex flex-col gap-4 pt-6 border-t border-white/10">
                    <div className="flex flex-wrap justify-center gap-2">
                        <span>© {new Date().getFullYear()} Yallah.</span>
                        <Link href="/mobile/politica-de-privacidade" className="underline text-white/80">Política de Privacidade</Link>
                        <Link href="/mobile/termos-de-uso" className="underline text-white/80">Termos de Uso</Link>
                    </div>

                    {/* Typewriter Section */}
                    <div className="text-center">
                        <div className="text-xs">
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
                </div>
            </div>
        </footer>
    );
} 