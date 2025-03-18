import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

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
    return (
        <div className="w-full bg-white relative pt-8">
            <h2 className="text-4xl font-medium text-center mb-8 px-4">
                Como a <span className="text-[#8BADA4] font-semibold">Yallah</span> funciona
            </h2>

            <div className="timeline relative bg-white">
                <Swiper
                    modules={[Pagination, Navigation]}
                    direction="horizontal"
                    loop={false}
                    speed={800}
                    pagination={{
                        clickable: true,
                        el: '.timeline-pagination',
                        bulletClass: 'inline-block w-2 h-2 rounded-full bg-white/40 mx-1 transition-all duration-300',
                        bulletActiveClass: '!bg-white !w-3',
                    }}
                    navigation={{
                        prevEl: '.timeline-button-prev',
                        nextEl: '.timeline-button-next',
                    }}
                    className="h-[600px] w-full"
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
                                <div className="absolute inset-0 bg-black/50" />
                            </div>
                            <div className="absolute z-10 top-[25%] left-1/2 -translate-x-1/2 w-[70%] text-center">
                                <span className="block text-4xl italic font-light text-[#8BADA4] mb-6">
                                    {step.year}
                                </span>
                                <h4 className="text-3xl font-bold text-white mb-4">
                                    {step.title}
                                </h4>
                                <p className="text-white text-lg leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}

                    {/* Navigation Buttons - Full height rectangles with increased opacity */}
                    <button className="timeline-button-prev absolute left-0 top-0 bottom-0 z-20 w-[15%] flex items-center justify-start bg-gradient-to-r from-black/30 to-transparent hover:from-black/40 transition-all group">
                        <div className="h-full w-12 flex items-center justify-center bg-black/25 text-white group-hover:bg-black/35 transition-colors">
                            <CaretLeft size={24} weight="bold" />
                        </div>
                    </button>
                    <button className="timeline-button-next absolute right-0 top-0 bottom-0 z-20 w-[15%] flex items-center justify-end bg-gradient-to-l from-black/30 to-transparent hover:from-black/40 transition-all group">
                        <div className="h-full w-12 flex items-center justify-center bg-black/25 text-white group-hover:bg-black/35 transition-colors">
                            <CaretRight size={24} weight="bold" />
                        </div>
                    </button>
                </Swiper>

                {/* Custom Pagination */}
                <div className="timeline-pagination absolute top-4 left-0 right-0 z-20 flex justify-center items-center h-4" />
            </div>

            <div className="text-center py-12 px-4">
                <h3 className="text-xl font-medium text-gray-800 mb-3">
                    Pronto para começar?
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                    Cadastre seu imóvel agora e comece a maximizar seus ganhos com a Yallah
                </p>
                <button
                    onClick={() => {
                        const formSection = document.getElementById('cadastro-form');
                        formSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-[#8BADA4] text-white px-8 py-3 rounded-full hover:bg-[#7A9C94] transition-colors"
                >
                    Cadastrar meu imóvel
                </button>
            </div>
        </div>
    );
} 