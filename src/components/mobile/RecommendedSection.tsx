'use client'

import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Buildings, Calendar, GraduationCap, TreePalm, Baby } from '@phosphor-icons/react'

interface LifestyleCategory {
    image: string
    title: string
    subtitle: string
    icon: React.ReactNode
}

const categories: LifestyleCategory[] = [
    {
        image: '/recomendado1.jpg',
        title: 'Business Ready',
        subtitle: 'Estadias para executivos',
        icon: <Buildings className="w-5 h-5 text-white recommended-card-icon" weight="fill" />
    },
    {
        image: '/recomendado2.jpg',
        title: 'Vida Universitária',
        subtitle: 'Ideal para estudantes',
        icon: <GraduationCap className="w-5 h-5 text-white recommended-card-icon" weight="fill" />
    },
    {
        image: '/recomendado3.jpg',
        title: 'Momentos Especiais',
        subtitle: 'Espaço para eventos',
        icon: <Calendar className="w-5 h-5 text-white recommended-card-icon" weight="fill" />
    },
    {
        image: '/recomendado4.jpg',
        title: 'Refúgio & Relaxamento',
        subtitle: 'Escape da rotina',
        icon: <TreePalm className="w-5 h-5 text-white recommended-card-icon" weight="fill" />
    },
    {
        image: '/recomendado1.jpg',
        title: 'Estadia Familiar',
        subtitle: 'Perfeito para famílias',
        icon: <Baby className="w-5 h-5 text-white recommended-card-icon" weight="fill" />
    }
]

export default function RecommendedSection() {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)
    const animationFrameRef = useRef<number | null>(null)

    // Duplicar categorias para um loop infinito e suave
    const extendedCategories = [...categories, ...categories];

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const scroll = () => {
            if (!isHovered && scrollContainer) {
                // Ajuste o valor para controlar a velocidade da rolagem
                scrollContainer.scrollLeft += 0.5;

                // Se a rolagem passar da metade (o fim dos itens originais), reseta para o início
                if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
                    scrollContainer.scrollLeft = 0;
                }
                animationFrameRef.current = requestAnimationFrame(scroll);
            }
        };

        const startScrolling = () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = requestAnimationFrame(scroll);
        };

        const stopScrolling = () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };

        if (!isHovered) {
            startScrolling();
        } else {
            stopScrolling();
        }

        return () => stopScrolling();
    }, [isHovered]);

    return (
        <section className="py-8 bg-white overflow-x-hidden">
            <div className="mb-6 text-center px-4">
                <div className="inline-block mb-3 px-4 py-1 bg-[#8BADA4]/10 rounded-full">
                    <span className="text-[#8BADA4] font-medium text-sm">Escolhas Sob Medida</span>
                </div>
                <h2 className="text-3xl font-bold text-black leading-tight">
                    Selecionamos os melhores imóveis que <span className="text-[#8BADA4]">combinam com o seu perfil!</span>
                </h2>
                <p className="mt-4 text-base text-gray-600 max-w-md mx-auto">
                    Descubra acomodações que refletem seu estilo de vida e necessidades específicas.
                </p>
            </div>

            {/* Horizontal Scrollable Container */}
            <div
                ref={scrollContainerRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 scrollbar-hide"
            >
                {extendedCategories.map((category, index) => (
                    <div
                        key={`${category.title}-${index}`} // Chave única para itens duplicados
                        className="group relative rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-1 flex-shrink-0 w-[80vw] max-w-xs"
                    >
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                            <Image
                                src={category.image}
                                alt={category.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                            <div className="absolute top-3 right-3 bg-[#8BADA4]/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5">
                                {category.icon}
                                <span className="text-white text-xs font-medium">
                                    {category.subtitle}
                                </span>
                            </div>

                            <div className="absolute bottom-0 left-0 p-4 w-full">
                                <h3 className="text-lg text-white font-bold">
                                    {category.title}
                                </h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
} 