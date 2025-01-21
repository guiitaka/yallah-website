'use client';

import React from 'react';
import Image from 'next/image';
import MobileLayout from '@/components/layout/MobileLayout';
import AutoplayVideo from '@/components/AutoplayVideo';
import AboutUs from '@/components/home/AboutUs';
import BestEvents from '@/components/home/BestEvents';
import ContactForm from '@/components/home/ContactForm';
import FAQ from '@/components/home/FAQ';
import { Buildings, ShieldCheck, Money, ChartLineUp } from '@phosphor-icons/react';

export default function MobileOwnerPage() {
  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Banner Section */}
        <section className="relative w-full h-[750px] px-4 pt-10">
          {/* Background Image */}
          <div className="relative w-full h-full overflow-hidden rounded-3xl">
            <Image
              src="/banner.jpg"
              alt="Banner"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative h-full">
              <div className="w-full px-4 h-full">
                {/* Content */}
                <div className="h-full flex flex-col">
                  {/* Text Content */}
                  <div className="w-full text-white flex flex-col items-center text-center pt-6 flex-none">
                    <h1 className="text-[40px] font-normal leading-[1.1] mb-4 max-w-[800px]">
                      Transforme seu imóvel em renda garantida:
                    </h1>
                    <p className="text-xl opacity-100 mb-6 font-light max-w-[600px]">
                      Deixe a Yallah cuidar de tudo para você.
                    </p>
                  </div>

                  {/* Benefits Card */}
                  <div className="flex-1 flex items-start justify-center pt-6">
                    <div className="w-full bg-white/95 rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center gap-2 mb-4">
                        <Buildings className="w-6 h-6" />
                        <h2 className="text-xl font-semibold">Por que anunciar na Yallah?</h2>
                      </div>

                      <div className="space-y-4">
                        {/* Benefit 1 */}
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-[#8BADA4]/10 rounded-lg">
                            <ShieldCheck className="w-6 h-6 text-[#8BADA4]" />
                          </div>
                          <div>
                            <h3 className="font-medium mb-1">Aluguel Garantido</h3>
                            <p className="text-sm text-gray-600">Receba seu aluguel em dia, independente do inquilino</p>
                          </div>
                        </div>

                        {/* Benefit 2 */}
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-[#8BADA4]/10 rounded-lg">
                            <Money className="w-6 h-6 text-[#8BADA4]" />
                          </div>
                          <div>
                            <h3 className="font-medium mb-1">Valorização do Imóvel</h3>
                            <p className="text-sm text-gray-600">Manutenção preventiva e gestão profissional</p>
                          </div>
                        </div>

                        {/* Benefit 3 */}
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-[#8BADA4]/10 rounded-lg">
                            <ChartLineUp className="w-6 h-6 text-[#8BADA4]" />
                          </div>
                          <div>
                            <h3 className="font-medium mb-1">Gestão Completa</h3>
                            <p className="text-sm text-gray-600">Cuidamos de tudo: desde o anúncio até a gestão do inquilino</p>
                          </div>
                        </div>

                        <button className="w-full flex items-center justify-center gap-2 py-4 bg-[#8BADA4] text-white rounded-lg hover:bg-[#8BADA4]/90 text-lg">
                          <Buildings className="w-5 h-5" />
                          Anunciar Imóvel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Promotions Section */}
        <section className="px-4 py-8 bg-white">
          <h2 className="text-xl text-gray-500 mb-3">Seu imóvel, nossa expertise</h2>
          <h1 className="text-[32px] leading-[1.2] font-light mb-4">
            Cuidamos do seu imóvel<br />
            como se fosse nosso
          </h1>
          <p className="text-gray-600 mb-6">
            A Yallah oferece gestão completa para seu imóvel: Desde a administração da locação até a manutenção e limpeza.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { 
                title: 'Administração Completa', 
                description: 'Cuidamos da gestão, locação e manutenção do seu imóvel, garantindo tranquilidade e rentabilidade máxima.', 
                video: {
                  webm: '/videos/administracao.webm',
                  mp4: '/videos/administracao.mp4'
                }
              },
              { 
                title: 'Imóvel sempre Impecável', 
                description: 'Realizamos limpeza e preparação profissional para encantar os hóspedes e valorizar seu patrimônio.', 
                video: {
                  webm: '/videos/imovel-impecavel.webm',
                  mp4: '/videos/imovel-impecavel.mp4'
                }
              },
              { 
                title: 'Anúncios Estratégicos', 
                description: 'Destacamos seu imóvel nas melhores plataformas para atrair viajantes e profissionais de alto padrão.', 
                video: {
                  webm: '/videos/anuncios.webm',
                  mp4: '/videos/anuncios.mp4'
                }
              },
              { 
                title: 'Sem Complicações', 
                description: 'Você aproveita os rendimentos enquanto a Yallah resolve tudo, do check-in ao check-out.', 
                video: {
                  webm: '/videos/complicacoes.webm',
                  mp4: '/videos/complicacoes.mp4'
                }
              }
            ].map((service) => (
              <div key={service.title} className="bg-gray-50 p-4 rounded-xl relative overflow-hidden">
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                  <AutoplayVideo
                    videoSrc={service.video}
                  />
                </div>
                <h3 className="font-medium mb-1 text-center">{service.title}</h3>
                <p className="text-sm text-gray-500 text-center">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Us Section */}
        <div className="bg-white">
          <AboutUs />
        </div>

        {/* Best Events Section */}
        <div className="bg-white">
          <BestEvents />
        </div>

        {/* Contact Form Section */}
        <div className="bg-white">
          <ContactForm />
        </div>

        {/* FAQ Section */}
        <div className="bg-white">
          <FAQ />
        </div>
      </div>
    </MobileLayout>
  );
} 