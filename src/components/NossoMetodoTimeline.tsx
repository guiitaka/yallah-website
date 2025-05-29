'use client';
import React from 'react';
import { Timeline } from '@/components/ui/timeline';

// Your 7 themes data, adapted for the Timeline component
const yallahTimelineData = [
    {
        title: "Método Yallah", // Shorter title for timeline marker
        content: (
            <div>
                <h4 className="text-xl font-semibold text-neutral-800 mb-2">Resultados Comprovados</h4>
                <p className="text-neutral-700 text-sm md:text-base mb-4">
                    Unimos tecnologia de ponta, hospitalidade excepcional e atenção meticulosa aos detalhes para elevar a gestão do seu imóvel. Desfrute de 95% de ocupação, avaliações de 4.9/5, 98% de eficiência e um aumento de +30% na rentabilidade do seu investimento.
                </p>
                {/* You can add images or other React nodes here if needed, similar to the demo */}
            </div>
        ),
    },
    {
        title: "Avaliação",
        content: (
            <div>
                <h4 className="text-xl font-semibold text-neutral-800 mb-2">Personalizada e Estratégica</h4>
                <p className="text-neutral-700 text-sm md:text-base mb-4">
                    Começamos com uma análise detalhada para desenvolver uma estratégia exclusiva para seu imóvel, identificando seu verdadeiro potencial. Realizamos avaliações em 95% dos imóveis em menos de 7 dias.
                </p>
            </div>
        ),
    },
    {
        title: "Preparação",
        content: (
            <div>
                <h4 className="text-xl font-semibold text-neutral-800 mb-2">Impecável do Imóvel</h4>
                <p className="text-neutral-700 text-sm md:text-base mb-4">
                    Cuidamos de todos os detalhes para que seu imóvel se destaque: desde a manutenção e reparos essenciais, passando pela decoração que valoriza o ambiente, até a fotografia profissional que encanta os hóspedes.
                </p>
            </div>
        ),
    },
    {
        title: "Marketing",
        content: (
            <div>
                <h4 className="text-xl font-semibold text-neutral-800 mb-2">Estratégico Inteligente</h4>
                <p className="text-neutral-700 text-sm md:text-base mb-4">
                    Atraímos o público ideal e impulsionamos seus resultados combinando presença digital otimizada nas principais plataformas (+5) com precificação dinâmica avançada, podendo aumentar sua rentabilidade em até 40%.
                </p>
            </div>
        ),
    },
    {
        title: "Gestão 24/7",
        content: (
            <div>
                <h4 className="text-xl font-semibold text-neutral-800 mb-2">Reservas e Suporte</h4>
                <p className="text-neutral-700 text-sm md:text-base mb-4">
                    Gerenciamos todo o processo de reservas com uma equipe disponível 24/7, respostas em até 15 minutos e suporte multilíngue, além de uma gestão estratégica para otimizar a ocupação e garantir sua tranquilidade.
                </p>
            </div>
        ),
    },
    {
        title: "Experiência",
        content: (
            <div>
                <h4 className="text-xl font-semibold text-neutral-800 mb-2">Inesquecível do Hóspede</h4>
                <p className="text-neutral-700 text-sm md:text-base mb-4">
                    Criamos uma jornada excepcional para cada hóspede com check-in digital, guias locais personalizados, amenidades premium e suporte contínuo. Hóspedes satisfeitos geram mais avaliações positivas e maior retorno do seu investimento.
                </p>
            </div>
        ),
    },
    {
        title: "Resultados",
        content: (
            <div>
                <h4 className="text-xl font-semibold text-neutral-800 mb-2">Transparência Total</h4>
                <p className="text-neutral-700 text-sm md:text-base mb-4">
                    Oferecemos 100% de transparência com relatórios mensais detalhados sobre o desempenho do seu imóvel e acesso 24/7 aos dados. Nosso compromisso com a melhoria contínua visa maximizar seus resultados, refletido em +15% de aumento anual médio e 98% de satisfação dos proprietários.
                </p>
            </div>
        ),
    },
];

export function NossoMetodoTimeline() {
    return (
        <Timeline
            data={yallahTimelineData}
            mainTitle="Nosso Método Yallah"
            mainDescription="Descubra como transformamos a gestão do seu imóvel em uma experiência de sucesso, passo a passo."
        />
    );
} 