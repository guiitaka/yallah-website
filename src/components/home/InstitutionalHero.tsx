'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, House, Calendar, User, ShieldCheck, Medal, ArrowRight, Star } from '@phosphor-icons/react'

export default function InstitutionalHero() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    } else {
                        // Opcional: resetar a animação quando a seção não estiver mais visível
                        // setIsVisible(false);
                    }
                });
            },
            { threshold: 0.3 }
        );

        const section = document.getElementById('institutional-hero');
        if (section) observer.observe(section);

        return () => {
            if (section) observer.unobserve(section);
        };
    }, []);

    return (
        <div id="institutional-hero" className="w-full py-12 md:py-16 lg:py-24 -mt-8 md:-mt-12 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full z-0">
                <Image
                    src="/imagem-hero.jpg"
                    alt="Yallah Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* Background elements - reduced opacity */}
            <div className="absolute inset-0 overflow-hidden z-1">
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#8BADA4]/10 blur-3xl"></div>
                <div className="absolute bottom-40 -left-40 w-80 h-80 rounded-full bg-[#8BADA4]/10 blur-3xl"></div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
                    {/* Left column - Content */}
                    <div className={`bg-white/90 p-6 md:p-8 rounded-2xl shadow-xl transition-all duration-[2000] ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 -translate-x-10'}`}>
                        <div className="inline-block mb-3 md:mb-4 px-3 py-1.5 md:px-4 md:py-2 bg-[#8BADA4]/10 rounded-full">
                            <span className="text-sm md:text-base text-[#8BADA4] font-medium">Experiência Yallah</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
                            Sua estadia perfeita <span className="text-[#8BADA4]">começa aqui</span>
                        </h2>

                        <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-xl">
                            Conectamos você aos melhores imóveis do Brasil com um processo seguro, transparente e personalizado. Descubra por que milhares de pessoas confiam na Yallah para encontrar o lar dos seus sonhos.
                        </p>

                        {/* Stats section */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
                            <div className="flex flex-col">
                                <span className="text-2xl md:text-3xl font-bold text-[#8BADA4]">30+</span>
                                <span className="text-sm md:text-base text-gray-600">Imóveis disponíveis</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl md:text-3xl font-bold text-[#8BADA4]">98%</span>
                                <span className="text-sm md:text-base text-gray-600">Clientes satisfeitos</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl md:text-3xl font-bold text-[#8BADA4]">20+</span>
                                <span className="text-sm md:text-base text-gray-600">Bairros atendidos</span>
                            </div>
                        </div>

                        {/* Features list */}
                        <div className="mb-8 md:mb-10">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-[#8BADA4]/10 rounded-full p-2 mt-0.5">
                                        <Check weight="bold" className="w-4 h-4 text-[#8BADA4]" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#8BADA4]">Verificação rigorosa</h4>
                                        <p className="text-xs md:text-sm text-gray-600 mt-1">Todos os imóveis são verificados pessoalmente</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-[#8BADA4]/10 rounded-full p-2 mt-0.5">
                                        <Check weight="bold" className="w-4 h-4 text-[#8BADA4]" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#8BADA4]">Reserva sem complicações</h4>
                                        <p className="text-xs md:text-sm text-gray-600 mt-1">Processo de reserva simples e transparente</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-[#8BADA4]/10 rounded-full p-2 mt-0.5">
                                        <Check weight="bold" className="w-4 h-4 text-[#8BADA4]" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#8BADA4]">Suporte 24/7</h4>
                                        <p className="text-xs md:text-sm text-gray-600 mt-1">Atendimento disponível a qualquer hora</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-[#8BADA4]/10 rounded-full p-2 mt-0.5">
                                        <Check weight="bold" className="w-4 h-4 text-[#8BADA4]" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#8BADA4]">Desconto para longas estadias</h4>
                                        <p className="text-xs md:text-sm text-gray-600 mt-1">Preços especiais para estadias mensais</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                            <Link
                                href="/imoveis"
                                className="flex items-center justify-center gap-2 bg-[#8BADA4] text-white px-4 md:px-6 py-3 md:py-4 rounded-full hover:bg-[#7a9b94] transition-colors shadow-md text-sm md:text-base whitespace-nowrap"
                            >
                                <House weight="bold" className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                                <span className="truncate">Encontrar imóvel perfeito</span>
                            </Link>
                            <Link
                                href="/sobre"
                                className="flex items-center justify-center gap-2 bg-white text-gray-800 px-4 md:px-6 py-3 md:py-4 rounded-full hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm text-sm md:text-base whitespace-nowrap"
                            >
                                <span className="truncate">Conheça nossa história</span>
                                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                            </Link>
                        </div>
                    </div>

                    {/* Right column - Cards */}
                    <div className={`relative transition-all duration-[2500] delay-1000 ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-x-10'}`}>
                        {/* Floating Card - Classification */}
                        <div className="hidden md:block absolute left-0 top-0 md:top-10 lg:top-20 bg-white rounded-2xl p-4 shadow-xl w-60 md:w-64 lg:w-72 transform -rotate-3 transition-all duration-500 hover:rotate-0 hover:shadow-2xl z-20">
                            <div className="flex items-center gap-2 lg:gap-3 mb-2">
                                <Medal className="w-6 h-6 lg:w-8 lg:h-8 text-[#8BADA4]" weight="fill" />
                                <span className="font-semibold text-sm lg:text-base text-[#8BADA4]">Classificação</span>
                            </div>
                            <div className="flex items-center gap-1 text-yellow-400 my-1">
                                <Star weight="fill" className="w-4 h-4 lg:w-5 lg:h-5" />
                                <Star weight="fill" className="w-4 h-4 lg:w-5 lg:h-5" />
                                <Star weight="fill" className="w-4 h-4 lg:w-5 lg:h-5" />
                                <Star weight="fill" className="w-4 h-4 lg:w-5 lg:h-5" />
                                <Star weight="fill" className="w-4 h-4 lg:w-5 lg:h-5" />
                            </div>
                            <p className="text-xs lg:text-sm text-gray-600">4.9 de 5 (3.482 avaliações)</p>
                        </div>

                        {/* Floating Card - Guarantee */}
                        <div className="hidden md:block absolute right-0 bottom-10 md:bottom-20 bg-white rounded-2xl p-4 shadow-xl w-60 md:w-64 lg:w-72 transform rotate-2 transition-all duration-500 hover:rotate-0 hover:shadow-2xl z-20">
                            <div className="flex items-center gap-2 lg:gap-3 mb-2">
                                <ShieldCheck className="w-6 h-6 lg:w-8 lg:h-8 text-[#8BADA4]" weight="fill" />
                                <span className="font-semibold text-sm lg:text-base text-[#8BADA4]">Garantia Yallah</span>
                            </div>
                            <p className="text-xs lg:text-sm text-gray-600">Seu dinheiro 100% seguro com nossa política de garantia exclusiva.</p>
                        </div>

                        {/* Testimonial Card */}
                        <div className="hidden md:block absolute right-8 md:right-12 lg:right-16 top-1/2 -translate-y-1/2 bg-white rounded-2xl p-5 shadow-xl max-w-xs z-20">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full bg-[#8BADA4] flex items-center justify-center text-white">
                                    <User weight="bold" size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm md:text-base text-[#8BADA4]">Mariana Silva</p>
                                    <p className="text-xs md:text-sm text-gray-600">Hospedada em Março 2024</p>
                                </div>
                            </div>
                            <p className="text-sm lg:text-base text-gray-700 italic">"A Yallah tornou minha estadia em São Paulo incrível! O apartamento era exatamente como nas fotos e o suporte foi excelente."</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 