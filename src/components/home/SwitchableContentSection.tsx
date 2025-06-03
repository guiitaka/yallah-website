'use client';

import React, { useState } from 'react';
import ReviewsCarousel from './ReviewsCarousel';
import { motion, AnimatePresence } from 'framer-motion';

type ServiceId = 'mudanca' | 'mobilia' | 'limpeza' | 'suporte' | 'vistoria' | 'fotos';

type ServiceContent = {
    [K in ServiceId]: {
        title: string;
        description: string;
        media: {
            type: 'video' | 'image';
            src: string;
        };
    };
};

export default function SwitchableContentSection() {
    const [activeTab, setActiveTab] = useState('proprietarios');
    const [activeService, setActiveService] = useState<ServiceId>('mudanca');

    const serviceContent: ServiceContent = {
        mudanca: {
            title: 'Mudança Facilitada',
            description: 'Oferecemos um serviço completo de mudança, desde o planejamento até a execução, para que você não precise se preocupar com nada.',
            media: {
                type: 'image',
                src: '/mudanca.jpg'
            }
        },
        mobilia: {
            title: 'Mobília Premium',
            description: 'Móveis selecionados e de alta qualidade para tornar seu imóvel mais atraente e confortável.',
            media: {
                type: 'image',
                src: '/mobilia.jpg'
            }
        },
        limpeza: {
            title: 'Limpeza Profissional',
            description: 'Serviço de limpeza especializado para manter seu imóvel sempre impecável.',
            media: {
                type: 'image',
                src: '/limpeza.jpg'
            }
        },
        suporte: {
            title: 'Depoimentos de Clientes',
            description: 'Descubra o que nossos proprietários dizem sobre a experiência com a Yallah. Histórias reais de sucesso e satisfação.',
            media: {
                type: 'image',
                src: '/images/suporte.jpg'
            }
        },
        vistoria: {
            title: 'Vistoria Detalhada',
            description: 'Documentação completa e profissional do estado do imóvel antes e depois da locação.',
            media: {
                type: 'image',
                src: '/vistoria.jpg'
            }
        },
        fotos: {
            title: 'Fotos e Vídeos Profissionais',
            description: 'Fotografias e vídeos de alta qualidade que destacam os melhores aspectos do seu imóvel, proporcionando uma experiência imersiva para potenciais inquilinos.',
            media: {
                type: 'image',
                src: '/fotos-videos.jpg'
            }
        }
    };

    const features = [
        { id: 'mudanca', label: 'Mudança' },
        { id: 'mobilia', label: 'Mobília' },
        { id: 'limpeza', label: 'Limpeza' },
        { id: 'suporte', label: 'Avaliações' },
        { id: 'vistoria', label: 'Vistoria' },
        { id: 'fotos', label: 'Fotos e Videos' },
    ];

    return (
        <section className="relative min-h-screen w-full overflow-hidden">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
                style={{ zIndex: -1 }}
            >
                <source src="https://github.com/guiitaka/yallah-website/raw/refs/heads/main/public/videos/para-proprietarios.mp4" type="video/mp4" />
            </video>

            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/40" style={{ zIndex: 0 }} />

            {/* Content Container */}
            <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 sm:pt-2 md:pt-4 lg:pt-8 sm:pb-12">
                {/* Floating Menu - Centered */}
                <div className="flex justify-center mb-4 md:mb-6 lg:mb-8">
                    <div className="bg-white/10 backdrop-blur-md rounded-full p-1 sm:p-1.5 shadow-lg border border-white/20"
                        style={{
                            boxShadow: `
                                0 0 20px rgba(255, 255, 255, 0.2),
                                0 0 40px rgba(255, 255, 255, 0.1),
                                inset 0 0 10px rgba(255, 255, 255, 0.1)
                            `
                        }}>
                        <span
                            className="px-4 py-2 sm:px-6 sm:py-3 rounded-full text-white font-medium text-sm sm:text-base bg-primary shadow-lg shadow-primary/50 block text-center"
                        >
                            São Paulo
                        </span>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-3 text-white order-1 lg:order-1">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                            {activeTab === 'proprietarios' ? 'Gestão\nImobiliária' : 'Aluguel\nDescomplicado'}
                        </h2>
                        <p className="text-lg mb-8">
                            {activeTab === 'proprietarios'
                                ? 'Descubra como transformar seu imóvel em uma fonte de renda sem preocupações'
                                : 'Encontre o apartamento ideal com um processo simplificado e transparente'}
                        </p>

                        {/* User Stats */}
                        <div className="flex items-center gap-3 mb-6 sm:mb-8">
                            <div className="flex -space-x-2">
                                {[
                                    '/reviews/pessoa-0.png',
                                    '/reviews/pessoa-4.png',
                                    '/reviews/pessoa-6.png',
                                    '/reviews/pessoa-8.png'
                                ].map((imageUri, i) => (
                                    <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white overflow-hidden relative">
                                        <img src={imageUri} alt="Cliente" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <span className="text-xs sm:text-sm">
                                +30 proprietários já confiam na Yallah
                            </span>
                        </div>

                        {/* Features */}
                        <div className="space-y-3 sm:space-y-4">
                            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Nossos serviços incluem</h3>
                            <div className="flex flex-wrap gap-2">
                                {features.map((feature) => (
                                    <span
                                        key={feature.id}
                                        className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 text-xs sm:text-sm"
                                    >
                                        {feature.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Center Column - Main Content */}
                    <div className="lg:col-span-6 relative order-2 lg:order-2">
                        <div className="aspect-[4/3] sm:aspect-[3/2] rounded-lg overflow-hidden relative mb-4 sm:mb-6">
                            {/* Media Content */}
                            <AnimatePresence mode="wait">
                                {activeService === 'suporte' ? (
                                    <motion.div
                                        key="reviews"
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.5 }}
                                        className="w-full h-full"
                                    >
                                        <ReviewsCarousel />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={activeService}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.5 }}
                                        className="w-full h-full"
                                    >
                                        <img
                                            src={serviceContent[activeService].media.src}
                                            alt={serviceContent[activeService].title}
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Action Buttons - Visible on larger screens as overlay */}
                            <div className="absolute top-4 left-4 hidden lg:flex gap-2 z-10">
                                {/* Phone Button */}
                                <div className="group relative z-0 hover:z-10">
                                    <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/40 transition-all duration-300 group-hover:w-44 origin-left">
                                        <div className="flex items-center justify-center w-full px-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white absolute transform -translate-x-1/2 left-1/2 group-hover:translate-x-0 group-hover:left-4 transition-all duration-300">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                            </svg>
                                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-8 whitespace-nowrap">
                                                Liga pra gente!
                                            </span>
                                        </div>
                                    </button>
                                </div>

                                {/* WhatsApp Button */}
                                <div className="group relative z-0 hover:z-10">
                                    <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/40 transition-all duration-300 group-hover:w-52 origin-left">
                                        <div className="flex items-center justify-center w-full px-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white absolute transform -translate-x-1/2 left-1/2 group-hover:translate-x-0 group-hover:left-4 transition-all duration-300">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                                            </svg>
                                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-8 whitespace-nowrap">
                                                Falar no WhatsApp
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Email Button */}
                            <div className="absolute top-4 right-4 hidden lg:flex group z-0 hover:z-10">
                                <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/40 transition-all duration-300 group-hover:w-56 origin-right">
                                    <div className="flex items-center justify-center w-full px-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white absolute transform -translate-x-1/2 left-1/2 group-hover:translate-x-0 group-hover:left-4 transition-all duration-300">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-8 whitespace-nowrap">
                                            Escreve pra gente 😉
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Bottom Navigation - Now outside the image */}
                        <div className="flex flex-wrap justify-center sm:justify-between items-center bg-white/10 backdrop-blur-md rounded-lg sm:rounded-full px-3 py-2 sm:px-6 sm:py-3 gap-2">
                            {features.map((feature) => (
                                <button
                                    key={feature.id}
                                    onClick={() => setActiveService(feature.id as ServiceId)}
                                    className={`text-white transition-all duration-300 px-2 py-1 sm:px-0 sm:py-0 text-xs sm:text-sm
                                        ${activeService === feature.id
                                            ? 'text-primary font-medium'
                                            : 'hover:text-primary/80'
                                        }`}
                                >
                                    {feature.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-3 text-white order-3 lg:order-3">
                        <div className="h-full flex flex-col justify-between">
                            <div className="transition-opacity duration-300 min-h-[150px] sm:min-h-[200px]">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeService}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                                            {serviceContent[activeService].title}
                                        </h2>
                                        <p className="text-base sm:text-lg">
                                            {serviceContent[activeService].description}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Page Navigation */}
                            <div className="flex justify-center items-center mt-8">
                                <span className="text-white/60">São Paulo</span>
                            </div>

                            {/* Action Buttons - Visible on smaller screens - MOVED HERE (inside Right Column) */}
                            <div className="flex lg:hidden flex-col space-y-3 mb-6 mt-4">
                                {/* Phone Button */}
                                <button className="w-full py-3 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/40 transition-all duration-300 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </svg>
                                    Liga pra gente!
                                </button>
                                {/* WhatsApp Button */}
                                <button className="w-full py-3 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/40 transition-all duration-300 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                                    </svg>
                                    Falar no WhatsApp
                                </button>
                                {/* Email Button */}
                                <button className="w-full py-3 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/40 transition-all duration-300 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                    Escreve pra gente 😉
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}