'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
    value: string;
    suffix?: string;
    decimals?: number;
}

// Componente para número animado
const AnimatedNumber = ({ value, suffix = '', decimals = 0 }: AnimatedNumberProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [hasAnimated, setHasAnimated] = useState(false);

    const spring = useSpring(0, {
        mass: 1,
        stiffness: 50,
        damping: 30
    });

    useEffect(() => {
        if (isInView && !hasAnimated) {
            spring.set(parseFloat(value));
            setHasAnimated(true);
        }
    }, [isInView, spring, value, hasAnimated]);

    const display = useTransform(spring, (current) => {
        if (decimals > 0) {
            return current.toFixed(decimals).replace('.', ',') + suffix;
        }
        return Math.floor(current).toString() + suffix;
    });

    return (
        <motion.h3 ref={ref} className="text-[56px] font-medium text-black mb-2">
            {display}
        </motion.h3>
    );
};

export default function AboutSection() {
    return (
        <div id="about-us" className="w-full bg-white pt-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div>
                        <span className="text-[#8BADA4] text-lg font-medium mb-4 block">
                            Como tudo começou
                        </span>
                        <h2 className="text-[56px] leading-[1.1] font-medium text-black mb-8">
                            Seu imóvel, <br />
                            sua renda. Nós cuidamos de tudo <br />
                            para você.
                        </h2>
                        <div className="text-gray-600 text-lg leading-relaxed space-y-8">
                            <p>
                                <span className="font-bold text-[#8BADA4]">A Yallah nasceu de um sonho:</span> <br />
                                Transformar imóveis em experiências inesquecíveis. Tudo começou com a vontade de oferecer mais do que simples hospedagens, queríamos criar lares temporários onde cada hóspede pudesse sentir o aconchego e a autenticidade de São Paulo.
                            </p>

                            <p>
                                <span className="font-bold text-[#8BADA4]">Para os proprietários, nosso propósito é ainda maior:</span> <br />
                                Proporcionar uma forma segura e descomplicada de rentabilizar seus imóveis sem as preocupações da gestão. Assim, cuidamos de cada detalhe, da limpeza impecável à hospitalidade acolhedora, para que seu imóvel esteja sempre pronto para receber novas histórias.
                            </p>

                            <p className="font-bold text-[#8BADA4]">
                                Na Yallah, conectamos pessoas a lugares e transformamos espaços em oportunidades.
                            </p>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative">
                        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden">
                            <Image
                                src="/illustrations/about-image.jpg"
                                alt="Team working together"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pb-32">
                        {/* Anos de Experiência */}
                        <div>
                            <AnimatedNumber value="3.5" decimals={1} />
                            <p className="text-gray-600 text-lg">Anos de Experiência</p>
                        </div>

                        {/* Imóveis Gerenciados */}
                        <div>
                            <AnimatedNumber value="23" />
                            <p className="text-gray-600 text-lg">Imóveis Gerenciados</p>
                        </div>

                        {/* Avaliações Positivas */}
                        <div>
                            <AnimatedNumber value="830" suffix="+" />
                            <p className="text-gray-600 text-lg">Avaliações Positivas</p>
                        </div>

                        {/* Hóspedes Satisfeitos */}
                        <div>
                            <AnimatedNumber value="100.000" suffix="K" />
                            <p className="text-gray-600 text-lg">Hóspedes Satisfeitos</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 