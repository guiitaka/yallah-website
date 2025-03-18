'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PhoneCall, EnvelopeSimple, WhatsappLogo, MapPin, ArrowRight } from '@phosphor-icons/react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const ContactSection = () => {
    // Função para rolagem suave ao clicar no botão
    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        if (!targetId) return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <section className="w-full bg-white py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                    {/* Lottie animation à esquerda */}
                    <div className="w-full md:w-1/2 flex justify-center">
                        <div className="relative w-full max-w-[500px] aspect-[4/3]">
                            <DotLottieReact
                                src="/e-mail-yallah.lottie"
                                autoplay
                                loop
                                className="w-full h-full"
                            />
                        </div>
                    </div>

                    {/* Conteúdo do texto à direita */}
                    <div className="w-full md:w-1/2">
                        <div className="max-w-xl">
                            <h4 className="text-[#8BADA4] font-medium mb-2">Fale Conosco</h4>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                                Precisa de ajuda ou uma consulta?
                            </h2>
                            <div className="w-24 h-1 bg-[#8BADA4] mb-6"></div>

                            <p className="text-gray-600 mb-8">
                                Preencha o formulário abaixo e um de nossos especialistas da sua região entrará em contato com você em breve.
                                Para consultas operacionais relacionadas a reservas ou propriedades, utilize os canais de atendimento direto abaixo.
                            </p>

                            {/* Informações de contato */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-[#8BADA4]/10 rounded-lg mt-1">
                                        <PhoneCall size={20} className="text-[#8BADA4]" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Telefone</h4>
                                        <p className="text-gray-600">+55 11 5555-5555</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-[#8BADA4]/10 rounded-lg mt-1">
                                        <EnvelopeSimple size={20} className="text-[#8BADA4]" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Email</h4>
                                        <p className="text-gray-600">contato@yallah.com.br</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-[#8BADA4]/10 rounded-lg mt-1">
                                        <WhatsappLogo size={20} className="text-[#8BADA4]" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">WhatsApp</h4>
                                        <p className="text-gray-600">+55 11 99999-9999</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-[#8BADA4]/10 rounded-lg mt-1">
                                        <MapPin size={20} className="text-[#8BADA4]" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Endereço</h4>
                                        <p className="text-gray-600">São Paulo, SP - Brasil</p>
                                    </div>
                                </div>
                            </div>

                            {/* Botão com rolagem suave */}
                            <a
                                href="#contact-form"
                                onClick={handleSmoothScroll}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#8BADA4] hover:bg-[#7a9a94] text-white rounded-lg transition-colors font-medium"
                            >
                                Fale com um especialista
                                <ArrowRight size={20} weight="bold" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection; 