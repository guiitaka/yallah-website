'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const timelineSteps = [
    {
        year: "01",
        title: "Cadastre seu imóvel",
        description: "Em poucos minutos, você pode cadastrar seu imóvel na Yallah. Nosso processo é simples e intuitivo.",
        image: "/illustrations/timeline-register.png",
    },
    {
        year: "02",
        title: "Preparamos tudo para você",
        description: "Nossa equipe cuida de todo o processo, desde a preparação do imóvel até a gestão completa do aluguel.",
        image: "/illustrations/timeline-prepare.png",
    },
    {
        year: "03",
        title: "Maximize seus ganhos",
        description: "Com nossa tecnologia e expertise, seu imóvel terá exposição máxima nas principais plataformas.",
        image: "/illustrations/timeline-profit.png",
    },
    {
        year: "04",
        title: "Gestão profissional",
        description: "Cuidamos de tudo: check-in, check-out, limpeza, manutenção e atendimento aos hóspedes.",
        image: "/illustrations/timeline-management.png",
    },
    {
        year: "05",
        title: "Tranquilidade garantida",
        description: "Você recebe relatórios detalhados e seu pagamento em dia, sem preocupações.",
        image: "/illustrations/timeline-peace.png",
    }
];

export default function TimelineSection() {
    const swiperRef = useRef<SwiperType>();
    const timelineRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [accumulatedDelta, setAccumulatedDelta] = useState(0);
    const [canScrollPage, setCanScrollPage] = useState(false);
    const SCROLL_THRESHOLD = 50;

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (!isHovering || !swiperRef.current || isTransitioning) return;

            // Se estiver no último slide e rolando para baixo
            if (swiperRef.current.isEnd && e.deltaY > 0) {
                const newDelta = accumulatedDelta + e.deltaY;

                if (canScrollPage) {
                    // Se já pode rolar a página e está rolando para baixo, permite o scroll normal
                    return;
                }

                // Previne o scroll da página
                e.preventDefault();
                e.stopPropagation();

                // Se acumulou scroll suficiente para baixo no último slide, libera o scroll da página
                if (newDelta >= SCROLL_THRESHOLD) {
                    setCanScrollPage(true);
                    return;
                }

                setAccumulatedDelta(newDelta);
                return;
            }

            // Se estiver no primeiro slide e rolando para cima
            if (swiperRef.current.isBeginning && e.deltaY < 0) {
                const newDelta = accumulatedDelta + e.deltaY;

                if (canScrollPage) {
                    // Se já pode rolar a página e está rolando para cima, permite o scroll normal
                    return;
                }

                // Previne o scroll da página
                e.preventDefault();
                e.stopPropagation();

                // Se acumulou scroll suficiente para cima no primeiro slide, libera o scroll da página
                if (Math.abs(newDelta) >= SCROLL_THRESHOLD) {
                    setCanScrollPage(true);
                    return;
                }

                setAccumulatedDelta(newDelta);
                return;
            }

            // Previne QUALQUER scroll da página enquanto estiver na timeline
            e.preventDefault();
            e.stopPropagation();

            // Acumula o delta do scroll para navegação da timeline
            const newDelta = accumulatedDelta + e.deltaY;
            setAccumulatedDelta(newDelta);

            // Verifica se atingiu o threshold para mudar de slide
            if (Math.abs(newDelta) >= SCROLL_THRESHOLD) {
                if (newDelta > 0) {
                    if (!swiperRef.current.isEnd) {
                        setIsTransitioning(true);
                        swiperRef.current.slideNext();
                        setTimeout(() => {
                            setIsTransitioning(false);
                            setAccumulatedDelta(0);
                        }, 1000);
                    }
                } else {
                    if (!swiperRef.current.isBeginning) {
                        setIsTransitioning(true);
                        swiperRef.current.slidePrev();
                        setTimeout(() => {
                            setIsTransitioning(false);
                            setAccumulatedDelta(0);
                        }, 1000);
                    }
                }
                setAccumulatedDelta(0);
            }
        };

        const preventScroll = (e: WheelEvent) => {
            if (isHovering && !canScrollPage) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        const timelineElement = timelineRef.current;
        if (timelineElement) {
            timelineElement.addEventListener('wheel', handleWheel, { passive: false });
            document.addEventListener('wheel', preventScroll, { passive: false });
        }

        return () => {
            if (timelineElement) {
                timelineElement.removeEventListener('wheel', handleWheel);
                document.removeEventListener('wheel', preventScroll);
            }
        };
    }, [isHovering, isTransitioning, accumulatedDelta, canScrollPage]);

    return (
        <div className="w-full bg-white relative pt-40">
            <h2 className="absolute top-52 left-1/2 -translate-x-1/2 text-[64px] font-medium text-center text-white z-10 w-full tracking-wide">
                Como a <span className="text-[#8BADA4] font-semibold">Yallah</span> funciona
            </h2>

            <div
                ref={timelineRef}
                className="timeline relative bg-white"
                onMouseEnter={() => {
                    setIsHovering(true);
                    setCanScrollPage(false);
                }}
                onMouseLeave={() => {
                    setIsHovering(false);
                    setAccumulatedDelta(0);
                    setCanScrollPage(false);
                }}
            >
                <Swiper
                    modules={[Navigation, Pagination]}
                    direction="vertical"
                    loop={false}
                    speed={800}
                    pagination={{
                        clickable: true,
                        renderBullet: function (index, className) {
                            return `<span class="${className}">${timelineSteps[index].year}</span>`;
                        },
                    }}
                    navigation={true}
                    breakpoints={{
                        768: {
                            direction: 'vertical',
                        }
                    }}
                    className="h-[800px] w-full"
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    onSlideChange={() => {
                        setCanScrollPage(false);
                    }}
                >
                    {timelineSteps.map((step, index) => (
                        <SwiperSlide key={index} className="relative">
                            <div className="relative w-full h-full">
                                <Image
                                    src={step.image}
                                    alt={step.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/70" />
                            </div>
                            <div className="absolute z-10 top-[25%] right-1/2 translate-x-1/2 w-4/5 max-w-[310px] text-center">
                                <span className="timeline-year block text-[42px] italic font-light text-[#8BADA4] mb-12">
                                    {step.year}
                                </span>
                                <h4 className="timeline-title text-[34px] font-bold text-white mb-8">
                                    {step.title}
                                </h4>
                                <p className="timeline-text text-white leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Call to Action */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center pt-16 pb-8"
            >
                <h3 className="text-[42px] font-semibold text-gray-800 mb-6">
                    Pronto para começar?
                </h3>
                <p className="text-xl font-medium text-gray-600">
                    Cadastre seu imóvel agora e comece a maximizar seus ganhos com a Yallah
                </p>
            </motion.div>
        </div>
    );
} 