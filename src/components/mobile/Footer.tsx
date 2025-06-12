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
                    <p>© {new Date().getFullYear()} Yallah. Todos os direitos reservados.</p>

                    {/* Typewriter Section */}
                    <div className="text-center">
                        <div className="text-xs">
                            <span className="text-white/80">Encontre o lugar perfeito para </span>
                            <Typewriter
                                text={[
                                    "relaxar",
                                    "trabalhar",
                                    "se divertir",
                                    "viver momentos únicos",
                                    "criar memórias"
                                ]}
                                speed={70}
                                className="text-[#95CEB3] font-semibold"
                                waitTime={1500}
                                deleteSpeed={40}
                                cursorChar="|"
                            />
                        </div>
                    </div>

                    <div className="flex justify-center gap-4">
                        <Link href="/mobile/politica-de-privacidade" className="underline text-white/80">Política de Privacidade</Link>
                        <Link href="/mobile/termos-de-uso" className="underline text-white/80">Termos de Uso</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
} 