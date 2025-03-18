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
        <motion.h3 ref={ref} className="text-3xl font-medium text-black mb-1">
            {display}
        </motion.h3>
    );
};

export default function AboutSection() {
    return (
        <div className="w-full bg-white py-12">
            <div className="px-4">
                {/* Content - Title */}
                <div className="mb-4">
                    <span className="text-[#8BADA4] text-base font-medium mb-3 block">
                        Como tudo começou
                    </span>
                </div>

                {/* Image */}
                <div className="relative mb-6">
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
                        <Image
                            src="/illustrations/about-image.jpg"
                            alt="Team working together"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Content - Text */}
                <div className="mb-8">
                    <h2 className="text-3xl leading-tight font-medium text-black mb-4 text-justify w-full">
                        Seu imóvel, sua renda. <br />
                        Nós cuidamos de tudo <br /> para você.
                    </h2>
                    <div className="text-gray-600 text-base leading-relaxed space-y-4">
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

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Anos de Experiência */}
                    <div>
                        <AnimatedNumber value="3.5" decimals={1} />
                        <p className="text-gray-600 text-sm">Anos de Experiência</p>
                    </div>

                    {/* Imóveis Gerenciados */}
                    <div>
                        <AnimatedNumber value="23" />
                        <p className="text-gray-600 text-sm">Imóveis Gerenciados</p>
                    </div>

                    {/* Avaliações Positivas */}
                    <div>
                        <AnimatedNumber value="830" suffix="+" />
                        <p className="text-gray-600 text-sm">Avaliações Positivas</p>
                    </div>

                    {/* Hóspedes Satisfeitos */}
                    <div>
                        <AnimatedNumber value="100.000" suffix="K" />
                        <p className="text-gray-600 text-sm">Hóspedes Satisfeitos</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 