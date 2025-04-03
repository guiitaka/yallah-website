'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { House, Trophy, ChartLineUp, Users, Star, ArrowRight } from '@phosphor-icons/react'

export default function MobileAboutUs() {
    return (
        <div className="min-h-screen bg-white text-[#1C1C1C] pb-20 overflow-hidden">
            {/* Shapes Decorativos */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Shape 1 - Forma orgânica grande à esquerda */}
                <div className="absolute -left-32 top-20 w-[400px] h-[400px] rotate-[-15deg]">
                    <div className="relative w-full h-full">
                        <div className="absolute inset-0 rounded-[40%_60%_55%_45%/55%_45%_45%_55%] overflow-hidden transform rotate-12">
                            <Image
                                src="/card1.jpg"
                                alt="Imóvel decorativo"
                                fill
                                className="object-cover object-center scale-125"
                            />
                            <div className="absolute inset-0 bg-white/40" />
                        </div>
                    </div>
                </div>

                {/* Shape 2 - Forma orgânica média à direita com borda highlight */}
                <div className="absolute -right-20 top-40 w-[300px] h-[300px] rotate-[15deg]">
                    <div className="relative w-full h-full">
                        <div className="absolute inset-0 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] overflow-hidden transform -rotate-12 border-2 border-[#8BADA4]">
                            <Image
                                src="/card2.jpg"
                                alt="Imóvel decorativo"
                                fill
                                className="object-cover object-center scale-125"
                            />
                            <div className="absolute inset-0 bg-white/40" />
                        </div>
                    </div>
                </div>

                {/* Shape 3 - Forma orgânica pequena inferior esquerda */}
                <div className="absolute left-10 top-[65vh] w-[200px] h-[200px]">
                    <div className="relative w-full h-full">
                        <div className="absolute inset-0 rounded-[45%_55%_40%_60%/45%_55%_45%_55%] overflow-hidden transform rotate-45">
                            <Image
                                src="/card3.jpg"
                                alt="Imóvel decorativo"
                                fill
                                className="object-cover object-center scale-125"
                            />
                            <div className="absolute inset-0 bg-[#8BADA4]/20" />
                        </div>
                    </div>
                </div>

                {/* Shape 4 - Forma orgânica média inferior direita */}
                <div className="absolute -right-16 top-[70vh] w-[250px] h-[250px] rotate-[-10deg]">
                    <div className="relative w-full h-full">
                        <div className="absolute inset-0 rounded-[70%_30%_60%_40%/50%_50%_50%_50%] overflow-hidden">
                            <Image
                                src="/card4.jpg"
                                alt="Imóvel decorativo"
                                fill
                                className="object-cover object-center scale-125"
                            />
                            <div className="absolute inset-0 bg-white/40" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="relative z-10">
                {/* Header Section */}
                <div className="px-6 pt-12 mb-10">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-2 h-2 bg-[#8BADA4] rounded-full" />
                        <div className="w-2 h-2 bg-[#8BADA4]/50 rounded-full" />
                    </div>

                    <h1 className="text-4xl font-light mb-4">Nosso Método</h1>
                    <p className="text-lg opacity-90 mb-8">
                        Transforme seu imóvel em uma fonte de renda consistente com nossa gestão especializada
                    </p>

                    {/* Métricas em Cards */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#1C1C1C] backdrop-blur-sm p-4 rounded-2xl text-white">
                            <p className="text-[#8BADA4] text-sm mb-1">Taxa de Ocupação</p>
                            <p className="text-3xl font-bold">95%</p>
                        </div>
                        <div className="bg-[#1C1C1C] backdrop-blur-sm p-4 rounded-2xl text-white">
                            <p className="text-[#8BADA4] text-sm mb-1">Rentabilidade</p>
                            <p className="text-3xl font-bold">+30%</p>
                        </div>
                        <div className="bg-[#1C1C1C] backdrop-blur-sm p-4 rounded-2xl text-white">
                            <p className="text-[#8BADA4] text-sm mb-1">Avaliação</p>
                            <p className="text-3xl font-bold">4.9</p>
                        </div>
                        <div className="bg-[#1C1C1C] backdrop-blur-sm p-4 rounded-2xl text-white">
                            <p className="text-[#8BADA4] text-sm mb-1">Eficiência</p>
                            <p className="text-3xl font-bold">98%</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-6">
                    {/* Navigation Tabs */}
                    <div className="flex gap-6 mb-8 text-sm">
                        <button className="text-[#8BADA4] border-b-2 border-[#8BADA4] pb-2">Processo</button>
                        <button className="text-[#1C1C1C]/50 pb-2">Resultados</button>
                        <button className="text-[#1C1C1C]/50 pb-2">Avaliações</button>
                    </div>

                    {/* Process Steps */}
                    <div className="space-y-6">
                        {/* Step 1 */}
                        <div className="bg-[#1C1C1C] backdrop-blur-sm rounded-3xl p-6 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#8BADA4]/20 flex items-center justify-center">
                                        <House weight="fill" className="w-5 h-5 text-[#8BADA4]" />
                                    </div>
                                    <h3 className="text-xl">Avaliação Inicial</h3>
                                </div>
                                <span className="text-sm text-[#8BADA4]">01</span>
                            </div>
                            <p className="text-sm opacity-90 mb-4">
                                Análise completa do seu imóvel e seu potencial no mercado de aluguel por temporada
                            </p>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-white/5 rounded-xl p-3">
                                    <p className="text-[#8BADA4] mb-1">Tempo Médio</p>
                                    <p>7 dias</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3">
                                    <p className="text-[#8BADA4] mb-1">Precisão</p>
                                    <p>98%</p>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-[#8BADA4] backdrop-blur-sm rounded-3xl p-6 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                        <Trophy weight="fill" className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl">Preparação</h3>
                                </div>
                                <span className="text-sm text-white">02</span>
                            </div>
                            <p className="text-sm opacity-90 mb-4">
                                Otimização completa do espaço para maximizar o potencial de receita
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Manutenção</span>
                                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Decoração</span>
                                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Fotografia</span>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-[#1C1C1C] backdrop-blur-sm rounded-3xl p-6 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#8BADA4]/20 flex items-center justify-center">
                                        <ChartLineUp weight="fill" className="w-5 h-5 text-[#8BADA4]" />
                                    </div>
                                    <h3 className="text-xl">Marketing</h3>
                                </div>
                                <span className="text-sm text-[#8BADA4]">03</span>
                            </div>
                            <p className="text-sm opacity-90 mb-4">
                                Estratégia digital completa para maximizar visibilidade e ocupação
                            </p>
                            <div className="bg-white/5 rounded-xl p-4">
                                <p className="text-[#8BADA4] text-sm mb-2">Presença Digital</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-white/10" />
                                    <div className="w-8 h-8 rounded-lg bg-white/10" />
                                    <div className="w-8 h-8 rounded-lg bg-white/10" />
                                    <div className="w-8 h-8 rounded-lg bg-white/10" />
                                    <div className="w-8 h-8 rounded-lg bg-white/10" />
                                </div>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="bg-[#8BADA4] backdrop-blur-sm rounded-3xl p-6 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                        <Users weight="fill" className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl">Gestão</h3>
                                </div>
                                <span className="text-sm text-white">04</span>
                            </div>
                            <p className="text-sm opacity-90 mb-4">
                                Cuidamos de todo o processo, da reserva ao check-out
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                                    <Star weight="fill" className="w-4 h-4 text-white" />
                                    <p className="text-sm">Atendimento 24/7</p>
                                </div>
                                <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                                    <Star weight="fill" className="w-4 h-4 text-white" />
                                    <p className="text-sm">Limpeza Premium</p>
                                </div>
                                <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                                    <Star weight="fill" className="w-4 h-4 text-white" />
                                    <p className="text-sm">Manutenção Regular</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-12">
                        <div className="bg-[#1C1C1C] rounded-3xl p-6 text-center text-white">
                            <h3 className="text-xl mb-3">Pronto para começar?</h3>
                            <p className="text-sm opacity-90 mb-6">
                                Transforme seu imóvel em uma fonte de renda consistente
                            </p>
                            <Link
                                href="/mobile/owner/fale-conosco"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#8BADA4] text-white rounded-full font-medium"
                            >
                                Fale Conosco
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 