'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import MobileLayout from '@/components/layout/MobileLayout';

export default function MobileOwnerPage() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const playVideos = () => {
      videoRefs.current.forEach((videoRef) => {
        if (videoRef) {
          // Ensure video is muted first
          videoRef.muted = true;
          
          // Play the video
          const playPromise = videoRef.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                // Video started playing successfully
              })
              .catch(error => {
                console.error("Error attempting to play video:", error);
                // Try playing again with a user interaction
                document.addEventListener('touchstart', () => {
                  videoRef.play();
                }, { once: true });
              });
          }
        }
      });
    };

    // Initial play attempt
    playVideos();

    // Add event listener for visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        playVideos();
      }
    });

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', playVideos);
    };
  }, []);

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Banner Section */}
        <section className="relative w-full h-[300px]">
          <Image
            src={'/owner-bg.jpg'}
            alt="Banner"
            width={800}
            height={600}
            priority
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
            <h1 className="text-3xl font-medium mb-4">Maximize seus ganhos</h1>
            <p className="text-lg">
              Deixe seu imóvel render mais com a Yallah
            </p>
          </div>
        </section>

        {/* Promotions Section */}
        <section className="px-4 py-8 bg-white">
          <h2 className="text-xl font-medium mb-4">Seu imóvel, nossa expertise</h2>
          <p className="text-gray-600 mb-6">
            A Yallah oferece gestão completa para seu imóvel: Desde a administração da locação até a manutenção e limpeza.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { 
                title: 'Gestão Completa', 
                description: 'Administração total do seu imóvel', 
                video: {
                  webm: '/videos/administracao.webm',
                  mp4: '/videos/administracao.mp4'
                },
                poster: '/images/administracao.jpeg'
              },
              { 
                title: 'Limpeza', 
                description: 'Serviço profissional de limpeza', 
                video: {
                  webm: '/videos/imovel-impecavel.webm',
                  mp4: '/videos/imovel-impecavel.mp4'
                },
                poster: '/images/imovel-impecavel.jpeg'
              },
              { 
                title: 'Manutenção', 
                description: 'Manutenção preventiva e corretiva', 
                video: {
                  webm: '/videos/anuncios.webm',
                  mp4: '/videos/anuncios.mp4'
                },
                poster: '/images/anuncios.jpeg'
              },
              { 
                title: 'Atendimento 24h', 
                description: 'Suporte aos hóspedes 24 horas', 
                video: {
                  webm: '/videos/complicacoes.webm',
                  mp4: '/videos/complicacoes.mp4'
                },
                poster: '/images/complicacoes.jpeg'
              }
            ].map((service, index) => (
              <div key={service.title} className="bg-gray-50 p-4 rounded-xl relative overflow-hidden">
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current[index] = el;
                    }}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    poster={service.poster}
                    onError={(e) => console.error(`Error loading video for ${service.title}:`, e)}
                  >
                    <source src={service.video.mp4} type="video/mp4" />
                    <source src={service.video.webm} type="video/webm" />
                    <Image
                      src={service.poster}
                      alt={service.title}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </video>
                </div>
                <h3 className="font-medium mb-1">{service.title}</h3>
                <p className="text-sm text-gray-500">{service.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MobileLayout>
  );
} 