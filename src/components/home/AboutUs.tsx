'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight, Play, Pause, SpeakerHigh, SpeakerLow, Gear, SquaresFour, Camera } from '@phosphor-icons/react'

export default function AboutUs() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState('00:00:00')
  const [progress, setProgress] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slideDuration, setSlideDuration] = useState(0)
  const animationRef = useRef<number>()

  // Array de slides que serão exibidos no espaço central
  const slides = [
    { id: 0, position: 0 },
    { id: 1, position: 16.6 },
    { id: 2, position: 33.2 },
    { id: 3, position: 49.8 },
    { id: 4, position: 66.4 },
    { id: 5, position: 83 },
    { id: 6, position: 100 }
  ]

  // Duração de cada slide em milissegundos (8 segundos para cada slide)
  const slideDurationMs = 8000
  // Definimos a duração total da apresentação precisamente
  const totalDuration = slides.length * slideDurationMs

  // Controle de transições exatas
  const [nextSlideIndex, setNextSlideIndex] = useState(1)
  const [lastTransitionTime, setLastTransitionTime] = useState(0)

  // Toggle play/pause dos slides (não do vídeo)
  const togglePlay = () => {
    if (isPlaying) {
      cancelAnimationFrame(animationRef.current!)
    } else {
      startSlideShow()
    }
    setIsPlaying(!isPlaying)
  }

  // Função para iniciar a apresentação automática
  const startSlideShow = () => {
    let startTime: number | null = null
    let previousSlideTime = 0

    const animate = (timestamp: number) => {
      if (!startTime) {
        // Iniciar a partir do início ou do slide atual
        const timeOffset = (slides[currentSlide].position / 100) * totalDuration
        startTime = timestamp - timeOffset
        previousSlideTime = timeOffset

        // Definir o próximo slide
        const nextIndex = currentSlide < slides.length - 1 ? currentSlide + 1 : 0
        setNextSlideIndex(nextIndex)
      }

      const elapsed = timestamp - startTime

      // Calcular o progresso visual sem mudar o slide automaticamente
      const visualProgress = Math.min((elapsed / totalDuration) * 100, 100)
      setProgress(visualProgress)

      // Verificar se é hora de mudar para o próximo slide
      // Para garantir que o slide mude logo que o progresso atinja a posição do próximo slide
      const currentPosition = (elapsed / totalDuration) * 100

      // Encontrar qual slide deve estar ativo baseado no progresso atual
      for (let i = 0; i < slides.length - 1; i++) {
        if (currentPosition >= slides[i].position && currentPosition < slides[i + 1].position) {
          if (currentSlide !== i) {
            setCurrentSlide(i)
            // Definir o próximo slide
            const nextIndex = i < slides.length - 1 ? i + 1 : 0
            setNextSlideIndex(nextIndex)
          }
          break
        }
      }

      // Último slide
      if (currentPosition >= slides[slides.length - 1].position && currentSlide !== slides.length - 1) {
        setCurrentSlide(slides.length - 1)
        setNextSlideIndex(0) // Volta para o primeiro
      }

      if (visualProgress < 100) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Reset para repetir a apresentação
        startTime = null
        setProgress(0)
        setCurrentSlide(0)
        setNextSlideIndex(1)
        previousSlideTime = 0
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  // Simplificar o método handleSlideChange para melhor funcionamento com slides sempre presentes
  const handleSlideChange = (newSlideId: number) => {
    // Definir o próximo slide imediatamente para que a UI React seja atualizada
    setCurrentSlide(newSlideId);

    // Efeito de flash na página durante a transição
    document.body.classList.add('page-transition');
    setTimeout(() => {
      document.body.classList.remove('page-transition');
    }, 600);
  };

  // Adicionar este useEffect aprimorado para animações mais elaboradas
  useEffect(() => {
    // Selecionar os elementos a serem animados
    const slideElements = document.querySelectorAll(`.slide-content-${currentSlide} .animate-item`);

    // Aplicar diferentes classes de animação baseadas no tipo do elemento
    slideElements.forEach((element, index) => {
      // Limpar classes anteriores
      element.classList.remove(
        'opacity-0', 'translate-y-8', 'scale-95', 'translate-x-8', '-translate-x-8',
        'rotate-3', '-rotate-3', 'blur-sm', 'animate-float', 'animate-pulse', 'animate-wave'
      );

      // Resetar para permitir nova animação
      if (element instanceof HTMLElement) {
        void element.offsetWidth;
      }

      // Determinar tipo de animação baseado na classe pai ou no próprio elemento
      const isCard = element.closest('[class*="card"], [class*="bg-gradient"]') !== null;
      const isHeading = element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3';
      const isImage = element.tagName === 'IMG' || element.closest('.overflow-hidden') !== null;
      const isMainTitle = isHeading && index === 0;

      // Atribuir diferentes tipos de animação
      setTimeout(() => {
        // Aplicar classes básicas de transição
        element.classList.add('transition-all', 'duration-700');

        if (isMainTitle) {
          // Título principal - entrada com splash
          element.classList.add('animate-title-reveal');
        } else if (isCard) {
          // Cards - flutuando de diferentes direções com rotação
          const direction = index % 3;
          if (direction === 0) {
            element.classList.add('animate-card-reveal-left');
          } else if (direction === 1) {
            element.classList.add('animate-card-reveal-right');
          } else {
            element.classList.add('animate-card-reveal-bottom');
          }

          // Adicionar efeito de flutuação permanente em alguns elementos
          if (index % 4 === 0) {
            element.classList.add('animate-float');
          }
        } else if (isImage) {
          // Imagens - zoom suave com blur
          element.classList.add('animate-image-reveal');
        } else if (isHeading) {
          // Cabeçalhos - deslizar e desfoque
          element.classList.add('animate-heading-reveal');
        } else {
          // Textos e outros elementos - deslizar para cima com fade
          element.classList.add('animate-text-reveal');
        }

        // Remover o efeito tilt 3D e adicionar um efeito simples de hover
        if (isCard && element instanceof HTMLElement) {
          element.classList.add('card-hover-effect');
        }
      }, 100 + (index * 120)); // Delay escalonado mais rápido
    });

    // Nota: Removemos o efeito de parallax por enquanto para focar nas animações principais
    // mas as animações 3D de entrada e saída dos slides permanecem funcionando

    return () => {
      // Nota: Removemos o efeito de parallax por enquanto para focar nas animações principais
      // mas as animações 3D de entrada e saída dos slides permanecem funcionando
    };
  }, [currentSlide]);

  // Função para navegar para um slide específico
  const navigateToSlide = (slideId: number, position: number) => {
    // Primeiro pausa a apresentação automática
    cancelAnimationFrame(animationRef.current!)

    // Usar nossa função de transição com animação
    handleSlideChange(slideId)

    setProgress(position)

    // Definir o próximo slide
    const nextIndex = slideId < slides.length - 1 ? slideId + 1 : 0
    setNextSlideIndex(nextIndex)

    // Se estava tocando, reinicia do novo ponto
    if (isPlaying) {
      // Completamente reinicia a animação com o startTime adequado
      // para garantir que o progresso comece exatamente do ponto selecionado
      let startTime: number | null = null

      const animate = (timestamp: number) => {
        if (!startTime) {
          // Calcular o startTime para que o progresso comece exatamente na posição do marker clicado
          const timeOffset = (position / 100) * totalDuration
          startTime = timestamp - timeOffset

          // Também atualiza o previousSlideTime para evitar transições imediatas indesejadas
          const previousSlideTime = timeOffset
        }

        const elapsed = timestamp - startTime

        // Calcular o progresso visual
        const visualProgress = Math.min((elapsed / totalDuration) * 100, 100)
        setProgress(visualProgress)

        // Verificar se é hora de mudar para o próximo slide
        const currentPosition = (elapsed / totalDuration) * 100

        // Encontrar qual slide deve estar ativo baseado no progresso atual
        for (let i = 0; i < slides.length - 1; i++) {
          if (currentPosition >= slides[i].position && currentPosition < slides[i + 1].position) {
            if (currentSlide !== i) {
              setCurrentSlide(i)
              // Definir o próximo slide
              const nextIndex = i < slides.length - 1 ? i + 1 : 0
              setNextSlideIndex(nextIndex)
            }
            break
          }
        }

        // Último slide
        if (currentPosition >= slides[slides.length - 1].position && currentSlide !== slides.length - 1) {
          setCurrentSlide(slides.length - 1)
          setNextSlideIndex(0) // Volta para o primeiro
        }

        if (visualProgress < 100) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          // Reset para repetir a apresentação
          startTime = null
          setProgress(0)
          setCurrentSlide(0)
          setNextSlideIndex(1)
          animationRef.current = requestAnimationFrame(animate)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }
  }

  // Iniciar a apresentação automática quando o componente montar
  useEffect(() => {
    // Iniciar o vídeo de fundo
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Erro ao iniciar o vídeo de fundo:", error)
      })
    }

    // Iniciar a apresentação de slides
    if (isPlaying) {
      startSlideShow()
    }

    // Limpar animação na desmontagem
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, []) // Executar apenas na montagem

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
      }
    )

    document.querySelectorAll('.animate-fadeIn, .animate-slideUp, .animate-scaleUp').forEach((el) => {
      observer.observe(el)
    })

    // Marcar o slide 2 como visível quando selecionado
    if (currentSlide === 1) {
      const slide2Container = document.getElementById('slide-2-container')
      if (slide2Container) {
        setTimeout(() => {
          slide2Container.classList.add('is-visible')
        }, 100)
      }
    }

    return () => {
      observer.disconnect()
    }
  }, [currentSlide])

  return (
    <div className="w-full px-4 md:px-6 pt-28 pb-10 md:pt-36 md:pb-10 relative overflow-hidden h-screen flex flex-col">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        loop
        autoPlay
        muted
        playsInline
      >
        <source src="https://github.com/guiitaka/yallah-website/raw/refs/heads/main/public/videos/gerenciamento-imo%CC%81vel.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-[#1A1814]/30 z-0"></div>

      {/* Background Text - Right Side Vertical */}
      <div className="absolute top-1/2 -translate-y-1/2 translate-y-[80px] -right-[208px] md:-right-[208px] text-[39px] md:text-[137px] font-bold text-white/20 select-none pointer-events-none leading-none z-10 transform rotate-90 origin-center">
        YALLAH
      </div>

      {/* Background Text - Top */}
      <div className="absolute top-36 md:top-44 left-0 text-[29px] md:text-[118px] font-bold text-white/20 select-none pointer-events-none leading-none z-10">
        YALLAH
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10 flex-1 flex flex-col justify-between">
        {/* Header - Styled like "history mov." */}
        <div className="mb-1 md:mb-2 flex justify-end items-start relative">
          {/* Quality buttons like HD, 1080, etc */}
          <div className="flex gap-3 relative z-10 mr-0 ml-auto md:ml-auto absolute top-[61px] md:top-[69px] right-0">
            <a href="#" role="button" className="block overflow-hidden rounded-xl">
              <div className="bg-[#444444]/20 backdrop-blur-sm rounded-xl p-2.5 flex items-center cursor-pointer hover:bg-[#444444]/30 transition-all duration-300 shadow-lg hover:shadow-xl relative shine-effect">
                <div className="w-8 h-8 rounded-lg overflow-hidden mr-2 flex-shrink-0">
                  <Image
                    src="/card1.jpg"
                    alt="Gestão de Imóveis"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-white text-sm">Gestão de Imóveis</h3>
                </div>
                <div className="ml-2">
                  <ArrowUpRight size={18} className="text-white" />
                </div>
              </div>
            </a>

            <a href="#" role="button" className="block overflow-hidden rounded-xl">
              <div className="bg-[#3d4b49]/20 backdrop-blur-sm rounded-xl p-2.5 flex items-center cursor-pointer hover:bg-[#3d4b49]/30 transition-all duration-300 shadow-lg hover:shadow-xl relative shine-effect">
                <div className="w-8 h-8 rounded-lg overflow-hidden mr-2 flex-shrink-0">
                  <Image
                    src="/card2.jpg"
                    alt="Experiência do Hóspede"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-white text-sm">Experiência do Hóspede</h3>
                </div>
                <div className="ml-2">
                  <ArrowUpRight size={18} className="text-white" />
                </div>
              </div>
            </a>

            <a href="#" role="button" className="block overflow-hidden rounded-xl">
              <div className="bg-[#1e5956]/70 backdrop-blur-sm rounded-xl p-2.5 flex items-center cursor-pointer hover:bg-[#1e5956]/80 transition-all duration-300 shadow-lg hover:shadow-xl relative shine-effect">
                <div className="w-8 h-8 rounded-lg overflow-hidden mr-2 flex-shrink-0">
                  <Image
                    src="/card3.jpg"
                    alt="Atendimento Premium"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-white text-sm">Atendimento Premium</h3>
                </div>
                <div className="ml-2">
                  <ArrowUpRight size={18} className="text-white" />
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-white mt-24 md:mt-28 flex-1">
          {/* Left Column - Historical Figures Card */}
          <div className="md:col-span-3 flex flex-col space-y-3 h-full">
            {/* Card with 4 images */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-3 animate-fadeIn opacity-0">
              <h3 className="text-white mb-1.5 text-base font-medium">Nossos Imóveis</h3>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <Image
                    src="/card1.jpg"
                    alt="Imóvel Yallah"
                    width={150}
                    height={150}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden">
                  <Image
                    src="/card2.jpg"
                    alt="Imóvel Yallah"
                    width={150}
                    height={150}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden">
                  <Image
                    src="/card3.jpg"
                    alt="Imóvel Yallah"
                    width={150}
                    height={150}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden">
                  <Image
                    src="/card4.jpg"
                    alt="Imóvel Yallah"
                    width={150}
                    height={150}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Subtitle Card */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-3 flex-grow animate-fadeIn opacity-0 flex flex-col justify-between">
              <div>
                <h3 className="text-white text-base font-medium mb-1.5">
                  Cuidamos do seu imóvel, realizamos os sonhos de quem busca um lar temporário em São Paulo.
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Conheça como trabalhamos para oferecer a melhor experiência tanto para proprietários quanto para hóspedes.
                </p>
              </div>
            </div>
          </div>

          {/* Middle Column - Central Slides Area - Controlled by Timeline */}
          <div className="md:col-span-6 order-first md:order-none mb-3 md:mb-0 flex">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-3 w-full flex items-center justify-center animate-fadeIn opacity-0">
              {/* Slide Content - Will be populated based on timeline position */}
              <div className="text-center w-full h-[500px] max-h-[calc(100vh-220px)] overflow-hidden transition-all duration-500 perspective">
                <div className="slides-perspective-container relative preserve-3d min-h-[400px] h-full w-full">
                  {/* Renderize todos os slides de uma vez, mas mostre apenas o ativo */}
                  <div className={`slide-content slide-content-0 transition-all duration-500 ease-out transform ${currentSlide === 0 ? 'opacity-100 translate-y-0 scale-100 slide-visible' : 'opacity-0'} overflow-y-auto overflow-x-hidden custom-scrollbar h-full`}>
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Card Ocupação - Cinza Escuro */}
                        <div className="bg-gradient-to-br from-[#444444]/30 to-[#222222]/30 backdrop-blur-sm rounded-lg p-3 animate-item opacity-0 translate-y-8 scale-95">
                          <h3 className="text-white text-base font-medium mb-1">Ocupação</h3>
                          <div className="w-full h-[1px] bg-white/30 mb-2"></div>
                          <p className="text-white/80 text-sm mb-2">
                            Nossos imóveis alcançam uma taxa de ocupação superior à média do mercado, garantindo retorno consistente para os proprietários.
                          </p>
                          <div className="text-white text-2xl font-bold">95%</div>
                        </div>

                        {/* Card Avaliação - Azul Turquesa */}
                        <div className="bg-gradient-to-br from-[#25AAA2]/30 to-[#158882]/30 backdrop-blur-sm rounded-lg p-3 animate-item opacity-0 translate-y-8 scale-95">
                          <h3 className="text-white text-base font-medium mb-1">Avaliação</h3>
                          <div className="w-full h-[1px] bg-white/30 mb-2"></div>
                          <p className="text-white/80 text-sm mb-2">
                            Nossos hóspedes avaliam sua experiência com notas excelentes, refletindo nosso compromisso com a qualidade.
                          </p>
                          <div className="text-white text-2xl font-bold">4.9/5</div>
                        </div>

                        {/* Card Eficiência - Verde Yallah Oficial */}
                        <div className="bg-gradient-to-br from-[#8CBCB4]/30 to-[#7A9A94]/30 backdrop-blur-sm rounded-lg p-3 animate-item opacity-0 translate-y-8 scale-95">
                          <h3 className="text-white text-base font-medium mb-1">Eficiência</h3>
                          <div className="w-full h-[1px] bg-white/30 mb-2"></div>
                          <p className="text-white/80 text-sm mb-2">
                            Nossa gestão otimizada reduz o tempo entre reservas e maximiza a disponibilidade dos imóveis.
                          </p>
                          <div className="text-white text-2xl font-bold">98%</div>
                        </div>

                        {/* Card Rentabilidade - Dourado Âmbar */}
                        <div className="bg-gradient-to-br from-[#FFB347]/30 to-[#E89830]/30 backdrop-blur-sm rounded-lg p-3 animate-item opacity-0 translate-y-8 scale-95">
                          <h3 className="text-white text-base font-medium mb-1">Rentabilidade</h3>
                          <div className="w-full h-[1px] bg-white/30 mb-2"></div>
                          <p className="text-white/80 text-sm mb-2">
                            Aumentamos o retorno financeiro dos imóveis através de estratégias de precificação dinâmica e otimização.
                          </p>
                          <div className="text-white text-2xl font-bold">+30%</div>
                        </div>
                      </div>

                      <div className="md:w-1/3 md:pl-4 mt-4 md:mt-0 flex flex-col justify-center animate-item opacity-0 translate-y-8 scale-95">
                        <h2 className="text-white text-2xl md:text-3xl font-bold mb-3">Nosso <span className="font-normal">Método</span></h2>
                        <p className="text-white/80 text-sm leading-relaxed">
                          Na Yallah, transformamos a gestão de imóveis em uma experiência única,
                          combinando tecnologia, hospitalidade e atenção aos detalhes para
                          maximizar o potencial do seu investimento.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`slide-content slide-content-1 transition-all duration-500 ease-out transform ${currentSlide === 1 ? 'opacity-100 translate-y-0 scale-100 slide-visible' : 'opacity-0'} overflow-y-auto overflow-x-hidden custom-scrollbar h-full`}>
                    <div className="flex flex-col space-y-2 h-full w-full">
                      {/* Cabeçalho - Duas colunas */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-1">
                        {/* Coluna da esquerda - Nosso processo */}
                        <div className="text-left animate-item opacity-0 translate-y-8 scale-95 bg-gradient-to-br from-[#444444]/30 to-[#222222]/30 backdrop-blur-sm rounded-lg p-3" style={{ '--animation-delay': '0s' } as React.CSSProperties}>
                          <p className="text-white/80 text-lg mb-0.5">Nosso processo</p>
                          <h3 className="text-white text-5xl font-bold mb-0.5">95%</h3>
                          <div className="w-full h-[1px] bg-white/30 mb-2"></div>
                          <p className="text-white/80 text-sm leading-relaxed">
                            Dos nossos imóveis são avaliados e preparados para o mercado em menos de 7 dias, garantindo rapidez e eficiência no início da gestão.
                          </p>
                        </div>

                        {/* Coluna da direita - Título */}
                        <div className="text-right animate-item opacity-0 translate-y-8 scale-95 bg-gradient-to-br from-[#25AAA2]/30 to-[#158882]/30 backdrop-blur-sm rounded-lg p-3" style={{ '--animation-delay': '0.2s' } as React.CSSProperties}>
                          <p className="text-[#8DADA4] text-lg mb-0.5">YALLAH GESTÃO DE IMÓVEIS</p>
                          <h2 className="text-white text-3xl font-normal">Avaliação</h2>
                          <h2 className="text-white text-3xl font-bold">Personalizada</h2>
                          <div className="w-full h-[1px] bg-white/30 mt-2 mb-2"></div>
                          <p className="text-white/80 text-sm leading-relaxed text-right">
                            Entendemos as necessidades específicas de cada imóvel para maximizar seu potencial.
                          </p>
                        </div>
                      </div>

                      {/* Cards principais - Duas colunas */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-1">
                        {/* Card Mercado - Verde Yallah */}
                        <div className="bg-gradient-to-br from-[#8CBCB4]/50 to-[#7A9A94]/50 backdrop-blur-sm rounded-2xl overflow-hidden flex flex-col justify-center items-center text-center p-2.5 shadow-lg transform transition-all duration-300 hover:scale-[1.02] animate-item opacity-0 translate-y-8 scale-95" style={{ '--animation-delay': '0.3s' } as React.CSSProperties}>
                          <h3 className="text-white text-lg mb-0.5">Mercado</h3>
                          <div className="text-white text-5xl font-bold mb-0.5">75%</div>
                          <div className="w-full h-[1px] bg-white/30 mb-2 max-w-[80%] mx-auto"></div>
                          <p className="text-white text-sm leading-relaxed px-2">
                            Dos proprietários desconhecem o verdadeiro potencial de seus imóveis no mercado de aluguel por temporada.
                          </p>
                        </div>

                        {/* Card Retorno - Branco */}
                        <div className="bg-gradient-to-br from-white/90 to-white/80 rounded-2xl flex flex-col justify-center items-center text-center p-2.5 shadow-lg transform transition-all duration-300 hover:scale-[1.02] animate-item opacity-0 translate-y-8 scale-95" style={{ '--animation-delay': '0.4s' } as React.CSSProperties}>
                          <h3 className="text-gray-500 text-lg mb-0.5">Retorno</h3>
                          <div className="text-gray-900 text-5xl font-bold mb-0.5">+30%</div>
                          <div className="w-full h-[1px] bg-gray-400/30 mb-2 max-w-[80%] mx-auto"></div>
                          <p className="text-gray-500 text-sm leading-relaxed px-2">
                            Aumento médio na rentabilidade após nossa avaliação e implementação de estratégias personalizadas.
                          </p>
                        </div>
                      </div>

                      {/* Imagem e Primeiro passo - Duas colunas */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-1">
                        {/* Imagem */}
                        <div className="rounded-2xl overflow-hidden h-32 shadow-lg transform transition-all duration-300 hover:scale-[1.02] animate-item opacity-0 translate-y-8 scale-95" style={{ '--animation-delay': '0.5s' } as React.CSSProperties}>
                          <Image
                            src="/card2.jpg"
                            alt="Avaliação do Imóvel"
                            width={600}
                            height={400}
                            className="object-cover w-full h-full"
                            priority
                          />
                        </div>

                        {/* Primeiro passo */}
                        <div className="bg-gradient-to-br from-[#FFB347]/30 to-[#E89830]/30 backdrop-blur-sm rounded-2xl p-4 flex flex-col items-center text-center justify-center h-32 shadow-lg transform transition-all duration-300 hover:scale-[1.02] animate-item opacity-0 translate-y-8 scale-95" style={{ '--animation-delay': '0.6s' } as React.CSSProperties}>
                          <div className="absolute left-4 top-4">
                            <div className="w-12 h-12 rounded-full bg-[#8DADA4] flex items-center justify-center shadow-md">
                              <span className="text-white text-xl font-bold">1</span>
                            </div>
                          </div>
                          <div className="pt-2">
                            <h3 className="text-white text-lg font-bold leading-tight">Primeiro passo</h3>
                            <h3 className="text-white text-lg font-bold leading-tight mb-1">do nosso método</h3>
                            <div className="w-full h-[1px] bg-white/30 mb-2 max-w-[70%] mx-auto"></div>
                            <p className="text-white text-xs leading-relaxed max-w-[85%] mx-auto">
                              Entendemos que cada imóvel é único e merece uma estratégia personalizada.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`slide-content slide-content-2 transition-all duration-500 ease-out transform ${currentSlide === 2 ? 'opacity-100 translate-y-0 scale-100 slide-visible' : 'opacity-0'} overflow-y-auto overflow-x-hidden custom-scrollbar h-full`}>
                    <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">Preparação do Imóvel</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-[#444444]/30 to-[#222222]/30 backdrop-blur-sm rounded-lg p-3 animate-item opacity-0 translate-y-8 scale-95">
                        <h3 className="text-white text-base font-medium mb-1">Manutenção</h3>
                        <div className="w-full h-[1px] bg-white/30 mb-2"></div>
                        <p className="text-white/80 text-sm mb-2">
                          Realizamos reparos e melhorias necessárias para garantir a qualidade do imóvel.
                        </p>
                        <div className="flex justify-center">
                          <div className="w-12 h-12 rounded-full bg-[#8DADA4] flex items-center justify-center">
                            <Gear size={24} weight="bold" className="text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-[#25AAA2]/30 to-[#158882]/30 backdrop-blur-sm rounded-lg p-3 animate-item opacity-0 translate-y-8 scale-95">
                        <h3 className="text-white text-base font-medium mb-1">Decoração</h3>
                        <div className="w-full h-[1px] bg-white/30 mb-2"></div>
                        <p className="text-white/80 text-sm mb-2">
                          Decoramos o espaço com móveis e itens que valorizam o ambiente e atraem hóspedes.
                        </p>
                        <div className="flex justify-center">
                          <div className="w-12 h-12 rounded-full bg-[#8DADA4] flex items-center justify-center">
                            <SquaresFour size={24} weight="bold" className="text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-[#8CBCB4]/30 to-[#7A9A94]/30 backdrop-blur-sm rounded-lg p-3 animate-item opacity-0 translate-y-8 scale-95">
                        <h3 className="text-white text-base font-medium mb-1">Fotografia</h3>
                        <div className="w-full h-[1px] bg-white/30 mb-2"></div>
                        <p className="text-white/80 text-sm mb-2">
                          Produzimos fotos profissionais que destacam os melhores aspectos do seu imóvel.
                        </p>
                        <div className="flex justify-center">
                          <div className="w-12 h-12 rounded-full bg-[#8DADA4] flex items-center justify-center">
                            <Camera size={24} weight="bold" className="text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-[#FFB347]/30 to-[#E89830]/30 backdrop-blur-sm rounded-lg p-3 text-left animate-item opacity-0 translate-y-8 scale-95">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#8DADA4] flex items-center justify-center mr-3">
                          <span className="text-white font-bold">2</span>
                        </div>
                        <h3 className="text-white text-base font-medium">Segundo passo do nosso método</h3>
                      </div>
                      <div className="w-full h-[1px] bg-white/30 mb-2"></div>
                      <p className="text-white/80 text-sm">
                        Preparamos seu imóvel para se destacar no mercado. Nossa equipe cuida de cada detalhe,
                        desde pequenos reparos até a decoração completa, garantindo que seu imóvel esteja
                        impecável para receber os hóspedes.
                      </p>
                    </div>
                  </div>

                  <div className={`slide-content slide-content-3 transition-all duration-500 ease-out transform ${currentSlide === 3 ? 'opacity-100 translate-y-0 scale-100 slide-visible' : 'opacity-0'} overflow-y-auto overflow-x-hidden custom-scrollbar h-full`}>
                    <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">Marketing Estratégico</h2>
                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                      <div className="bg-gradient-to-br from-[#444444]/30 to-[#222222]/30 backdrop-blur-sm rounded-lg p-3 md:w-1/2 animate-item opacity-0 translate-y-8 scale-95">
                        <h3 className="text-white text-base font-medium mb-1">Presença Digital</h3>
                        <div className="w-full h-[1px] bg-white/30 mb-2"></div>
                        <p className="text-white/80 text-sm mb-2">
                          Criamos anúncios otimizados para as principais plataformas de hospedagem,
                          com descrições atrativas e fotos profissionais que destacam os diferenciais do seu imóvel.
                        </p>
                        <div className="text-white text-lg font-medium text-center">
                          Presença em mais de 5 plataformas de reserva
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-[#25AAA2]/30 to-[#158882]/30 backdrop-blur-sm rounded-lg p-3 md:w-1/2 animate-item opacity-0 translate-y-8 scale-95">
                        <h3 className="text-white text-base font-medium mb-1">Precificação Dinâmica</h3>
                        <div className="w-full h-[1px] bg-white/30 mb-2"></div>
                        <p className="text-white/80 text-sm mb-2">
                          Utilizamos algoritmos avançados para ajustar os preços de acordo com a
                          sazonalidade, eventos locais e demanda do mercado, maximizando a ocupação e rentabilidade.
                        </p>
                        <div className="text-white text-lg font-medium text-center">
                          Até 40% mais rentabilidade com preços otimizados
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-[#FFB347]/30 to-[#E89830]/30 backdrop-blur-sm rounded-lg p-3 text-left animate-item opacity-0 translate-y-8 scale-95">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#8DADA4] flex items-center justify-center mr-3">
                          <span className="text-white font-bold">3</span>
                        </div>
                        <h3 className="text-white text-base font-medium">Terceiro passo do nosso método</h3>
                      </div>
                      <div className="w-full h-[1px] bg-white/30 mb-2"></div>
                      <p className="text-white/80 text-sm">
                        Nossa estratégia de marketing é desenvolvida para atrair o público certo e
                        garantir alta visibilidade para seu imóvel. Combinamos presença digital
                        otimizada com precificação inteligente para maximizar seus resultados.
                      </p>
                    </div>
                  </div>

                  <div className={`slide-content slide-content-4 transition-all duration-500 ease-out transform ${currentSlide === 4 ? 'opacity-100 translate-y-0 scale-100 slide-visible' : 'opacity-0'} overflow-y-auto overflow-x-hidden custom-scrollbar h-full`}>
                    <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">Gestão de Reservas</h2>
                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                      <div className="bg-gradient-to-br from-[#444444]/30 to-[#222222]/30 backdrop-blur-sm rounded-lg p-3 md:w-1/2 animate-item opacity-0 translate-y-8 scale-95 flex flex-col">
                        <h3 className="text-white text-base font-medium mb-1">Atendimento 24/7</h3>
                        <div className="w-full h-[1px] bg-white/30 mb-2"></div>
                        <p className="text-white/80 text-sm mb-2 min-h-[80px]">
                          Nossa equipe está disponível 24 horas por dia, 7 dias por semana, para
                          responder dúvidas, gerenciar reservas e solucionar qualquer questão que possa surgir.
                        </p>
                        <div className="flex flex-col gap-2 mt-auto">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#8DADA4] flex items-center justify-center">
                              <span className="text-white font-bold text-xs">✓</span>
                            </div>
                            <p className="text-white/80 text-sm">Resposta em até 15 minutos</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#8DADA4] flex items-center justify-center">
                              <span className="text-white font-bold text-xs">✓</span>
                            </div>
                            <p className="text-white/80 text-sm">Suporte em múltiplos idiomas</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-[#25AAA2]/30 to-[#158882]/30 backdrop-blur-sm rounded-lg p-3 md:w-1/2 animate-item opacity-0 translate-y-8 scale-95 flex flex-col">
                        <h3 className="text-white text-base font-medium mb-1">Gestão Estratégica</h3>
                        <div className="w-full h-[1px] bg-white/30 mb-2"></div>
                        <p className="text-white/80 text-sm mb-2 min-h-[80px]">
                          Nossa equipe especializada realiza um planejamento cuidadoso de cada reserva,
                          otimizando a ocupação do seu imóvel conforme sazonalidade e garantindo uma
                          experiência tranquila tanto para proprietários quanto para hóspedes.
                        </p>
                        <div className="flex flex-col gap-2 mt-auto">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#8DADA4] flex items-center justify-center">
                              <span className="text-white font-bold text-xs">✓</span>
                            </div>
                            <p className="text-white/80 text-sm">Seleção criteriosa de hóspedes</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#8DADA4] flex items-center justify-center">
                              <span className="text-white font-bold text-xs">✓</span>
                            </div>
                            <p className="text-white/80 text-sm">Maximização da taxa de ocupação</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-[#FFB347]/30 to-[#E89830]/30 backdrop-blur-sm rounded-lg p-3 text-left animate-item opacity-0 translate-y-8 scale-95">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#8DADA4] flex items-center justify-center mr-3">
                          <span className="text-white font-bold">4</span>
                        </div>
                        <h3 className="text-white text-base font-medium">Quarto passo do nosso método</h3>
                      </div>
                      <div className="w-full h-[1px] bg-white/30 mb-2"></div>
                      <p className="text-white/80 text-sm">
                        Gerenciamos todo o processo de reservas para que você não precise se preocupar.
                        Nossa equipe e tecnologia trabalham em conjunto para garantir uma alta taxa de
                        ocupação e uma experiência sem complicações.
                      </p>
                    </div>
                  </div>

                  <div className={`slide-content slide-content-5 transition-all duration-500 ease-out transform ${currentSlide === 5 ? 'opacity-100 translate-y-0 scale-100 slide-visible' : 'opacity-0'} overflow-y-auto overflow-x-hidden custom-scrollbar h-full`}>
                    <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">Experiência do Hóspede</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-[#444444]/30 to-[#222222]/30 backdrop-blur-sm rounded-lg p-3 animate-item opacity-0 translate-y-8 scale-95">
                        <div className="flex items-center mb-2">
                          <div className="w-10 h-10 rounded-full bg-[#8DADA4] flex items-center justify-center mr-3">
                            <span className="text-white font-bold">01</span>
                          </div>
                          <h3 className="text-white text-base font-medium">Check-in Digital</h3>
                        </div>
                        <div className="w-full h-[1px] bg-white/30 mb-2"></div>
                        <p className="text-white/80 text-sm">
                          Oferecemos um processo de check-in simplificado e digital,
                          com instruções claras e suporte disponível a qualquer momento.
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-[#25AAA2]/30 to-[#158882]/30 backdrop-blur-sm rounded-lg p-3 animate-item opacity-0 translate-y-8 scale-95">
                        <div className="flex items-center mb-2">
                          <div className="w-10 h-10 rounded-full bg-[#8DADA4] flex items-center justify-center mr-3">
                            <span className="text-white font-bold">02</span>
                          </div>
                          <h3 className="text-white text-base font-medium">Guia Local</h3>
                        </div>
                        <div className="w-full h-[1px] bg-white/30 mb-2"></div>
                        <p className="text-white/80 text-sm">
                          Criamos um guia personalizado com dicas de restaurantes,
                          atrações e serviços próximos ao imóvel.
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-[#8CBCB4]/30 to-[#7A9A94]/30 backdrop-blur-sm rounded-lg p-3 animate-item opacity-0 translate-y-8 scale-95">
                        <div className="flex items-center mb-2">
                          <div className="w-10 h-10 rounded-full bg-[#8DADA4] flex items-center justify-center mr-3">
                            <span className="text-white font-bold">03</span>
                          </div>
                          <h3 className="text-white text-base font-medium">Amenidades Premium</h3>
                        </div>
                        <div className="w-full h-[1px] bg-white/30 mb-2"></div>
                        <p className="text-white/80 text-sm">
                          Equipamos o imóvel com itens de qualidade e amenidades
                          que garantem conforto e praticidade aos hóspedes.
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-[#444444]/30 to-[#222222]/30 backdrop-blur-sm rounded-lg p-3 animate-item opacity-0 translate-y-8 scale-95">
                        <div className="flex items-center mb-2">
                          <div className="w-10 h-10 rounded-full bg-[#8DADA4] flex items-center justify-center mr-3">
                            <span className="text-white font-bold">04</span>
                          </div>
                          <h3 className="text-white text-base font-medium">Suporte Contínuo</h3>
                        </div>
                        <div className="w-full h-[1px] bg-white/30 mb-2"></div>
                        <p className="text-white/80 text-sm">
                          Nossa equipe está sempre disponível para atender às
                          necessidades dos hóspedes durante toda a estadia.
                        </p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-[#FFB347]/30 to-[#E89830]/30 backdrop-blur-sm rounded-lg p-3 text-left animate-item opacity-0 translate-y-8 scale-95">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#8DADA4] flex items-center justify-center mr-3">
                          <span className="text-white font-bold">5</span>
                        </div>
                        <h3 className="text-white text-base font-medium">Quinto passo do nosso método</h3>
                      </div>
                      <div className="w-full h-[1px] bg-white/30 mb-2"></div>
                      <p className="text-white/80 text-sm">
                        Garantimos uma experiência excepcional para cada hóspede, o que resulta em
                        avaliações positivas, maior taxa de retorno e recomendações. Hóspedes satisfeitos
                        são a chave para o sucesso contínuo do seu investimento.
                      </p>
                    </div>
                  </div>

                  <div className={`slide-content slide-content-6 transition-all duration-500 ease-out transform ${currentSlide === 6 ? 'opacity-100 translate-y-0 scale-100 slide-visible' : 'opacity-0'} overflow-y-auto overflow-x-hidden custom-scrollbar h-full`}>
                    <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">Resultados e Transparência</h2>
                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                      <div className="bg-black/25 backdrop-blur-sm rounded-xl p-5 md:w-1/2 animate-item opacity-0 translate-y-8 scale-95">
                        <h3 className="text-[#8DADA4] text-xl mb-3">Relatórios Detalhados</h3>
                        <p className="text-white/80 text-sm leading-relaxed mb-4">
                          Fornecemos relatórios mensais completos sobre o desempenho do seu imóvel,
                          incluindo taxa de ocupação, receita gerada, avaliações dos hóspedes e
                          recomendações para melhorias.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-black/25 backdrop-blur-sm rounded-lg p-3 text-center">
                            <div className="text-[#8DADA4] text-lg font-bold mb-1">100%</div>
                            <p className="text-white text-xs">Transparência</p>
                          </div>
                          <div className="bg-black/25 backdrop-blur-sm rounded-lg p-3 text-center">
                            <div className="text-[#8DADA4] text-lg font-bold mb-1">24/7</div>
                            <p className="text-white text-xs">Acesso aos dados</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-black/25 backdrop-blur-sm rounded-xl p-5 md:w-1/2 animate-item opacity-0 translate-y-8 scale-95">
                        <h3 className="text-[#8DADA4] text-xl mb-3">Melhoria Contínua</h3>
                        <p className="text-white/80 text-sm leading-relaxed mb-4">
                          Analisamos constantemente o desempenho do seu imóvel e do mercado para
                          identificar oportunidades de melhoria e implementar ajustes que maximizem
                          seus resultados.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-black/25 backdrop-blur-sm rounded-lg p-3 text-center">
                            <div className="text-[#8DADA4] text-lg font-bold mb-1">+15%</div>
                            <p className="text-white text-xs">Aumento anual médio</p>
                          </div>
                          <div className="bg-black/25 backdrop-blur-sm rounded-lg p-3 text-center">
                            <div className="text-[#8DADA4] text-lg font-bold mb-1">98%</div>
                            <p className="text-white text-xs">Satisfação dos proprietários</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#8DADA4] rounded-xl p-5 text-center animate-item opacity-0 translate-y-8 scale-95">
                      <h3 className="text-black text-xl font-bold mb-2">Pronto para maximizar o potencial do seu imóvel?</h3>
                      <p className="text-black/80 text-sm mb-4">
                        Entre em contato conosco hoje mesmo e descubra como a Yallah pode transformar
                        seu imóvel em uma fonte de renda consistente e sem complicações.
                      </p>
                      <div className="inline-flex items-center gap-2 bg-black/20 rounded-full px-4 py-2">
                        <span className="text-black font-bold">Fale Conosco</span>
                        <ArrowUpRight size={18} className="text-black" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Card */}
          <div className="md:col-span-3 flex flex-col h-full">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-3 flex flex-col w-full animate-fadeIn opacity-0 h-full">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="aspect-video rounded-lg overflow-hidden mb-3">
                    <Image
                      src="/card1.jpg"
                      alt="Yallah Imóveis"
                      width={300}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 mb-3">
                    <div className="aspect-square rounded-md overflow-hidden">
                      <Image
                        src="/card2.jpg"
                        alt="Yallah Interior"
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="aspect-square rounded-md overflow-hidden">
                      <Image
                        src="/card3.jpg"
                        alt="Yallah Interior"
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="aspect-square rounded-md overflow-hidden">
                      <Image
                        src="/card4.jpg"
                        alt="Yallah Interior"
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-grow flex flex-col justify-center">
                  <h3 className="text-white text-base font-medium mb-2">Sobre Nós</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Na Yallah, acreditamos que cada imóvel tem o potencial de ser mais do que paredes e teto – é um espaço para criar memórias e viver experiências únicas. Nossa missão é simplificar a gestão de imóveis, conectando proprietários a locatários que valorizam conforto, praticidade e um lugar especial para chamar de lar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Controls - Vertical Position - Formato de "pirulito" */}
        <div className="absolute left-[-115px] md:left-[-135px] top-[60%] -translate-y-1/2 z-20">
          {/* Estrutura única em forma de pirulito */}
          <div className="relative flex flex-col items-center">
            {/* Cabeça do pirulito (circular) */}
            <div className="w-24 h-24 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center relative mb-[-10px] z-10">
              <button
                onClick={togglePlay}
                className="w-20 h-20 flex-shrink-0 flex items-center justify-center text-white hover:text-[#8DADA4] transition-colors bg-white/20 backdrop-blur-sm rounded-full"
              >
                {isPlaying ? (
                  <Pause size={36} weight="fill" />
                ) : (
                  <Play size={36} weight="fill" />
                )}
              </button>
            </div>

            {/* Cabo do pirulito (retangular com cantos arredondados na parte inferior) */}
            <div className="w-12 h-[420px] bg-black/30 backdrop-blur-sm rounded-b-full relative pt-4">
              {/* Timeline - Vertical */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-2 h-[370px] bg-black/30 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 w-2 bg-[#8DADA4] rounded-full"
                  style={{ height: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>

              {/* Timeline Markers - Evenly distributed with safe positioning */}
              <div className="absolute top-[375px] left-1/2 -translate-x-1/2 z-10">
                <div
                  className="w-5 h-5 bg-transparent flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigateToSlide(6, 100)}
                  title="Resultados e Transparência"
                >
                  <div className={`w-4 h-4 ${progress >= 96 ? 'bg-[#8DADA4]' : 'bg-white'} rounded-full`}></div>
                </div>
              </div>

              <div className="absolute top-[320px] left-1/2 -translate-x-1/2 z-10">
                <div
                  className="w-5 h-5 bg-transparent flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigateToSlide(5, 83)}
                  title="Experiência do Hóspede"
                >
                  <div className={`w-4 h-4 ${progress >= 80 ? 'bg-[#8DADA4]' : 'bg-white'} rounded-full`}></div>
                </div>
              </div>

              <div className="absolute top-[265px] left-1/2 -translate-x-1/2 z-10">
                <div
                  className="w-5 h-5 bg-transparent flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigateToSlide(4, 66.4)}
                  title="Gestão de Reservas"
                >
                  <div className={`w-4 h-4 ${progress >= 64 ? 'bg-[#8DADA4]' : 'bg-white'} rounded-full`}></div>
                </div>
              </div>

              <div className="absolute top-[205px] left-1/2 -translate-x-1/2 z-10">
                <div
                  className="w-5 h-5 bg-transparent flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigateToSlide(3, 49.8)}
                  title="Marketing Estratégico"
                >
                  <div className={`w-4 h-4 ${progress >= 48 ? 'bg-[#8DADA4]' : 'bg-white'} rounded-full`}></div>
                </div>
              </div>

              <div className="absolute top-[145px] left-1/2 -translate-x-1/2 z-10">
                <div
                  className="w-5 h-5 bg-transparent flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigateToSlide(2, 33.2)}
                  title="Preparação do Imóvel"
                >
                  <div className={`w-4 h-4 ${progress >= 32 ? 'bg-[#8DADA4]' : 'bg-white'} rounded-full`}></div>
                </div>
              </div>

              <div className="absolute top-[85px] left-1/2 -translate-x-1/2 z-10">
                <div
                  className="w-5 h-5 bg-transparent flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigateToSlide(1, 16.6)}
                  title="Avaliação Personalizada"
                >
                  <div className={`w-4 h-4 ${progress >= 16 ? 'bg-[#8DADA4]' : 'bg-white'} rounded-full`}></div>
                </div>
              </div>

              <div className="absolute top-[15px] left-1/2 -translate-x-1/2 z-10">
                <div
                  className="w-5 h-5 bg-transparent flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigateToSlide(0, 0)}
                  title="Nosso Método"
                >
                  <div className={`w-4 h-4 ${progress >= 4 ? 'bg-[#8DADA4]' : 'bg-white'} rounded-full`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        /* Animações com timing específico */
        .slide-content {
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .animate-item {
          transition-property: opacity, transform;
          transition-duration: 0.7s;
          transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        
        /* Resto dos estilos existentes */
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
          animation-play-state: paused;
          animation-delay: var(--animation-delay, 0s);
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
          animation-play-state: paused;
          animation-delay: var(--animation-delay, 0s);
        }

        .animate-scaleUp {
          animation: scaleUp 0.8s ease-out forwards;
          animation-play-state: paused;
          animation-delay: var(--animation-delay, 0s);
        }
        
        .hover\:animate-pulse-subtle:hover {
          animation: pulseSubtle 2s infinite;
          border-radius: inherit;
        }

        .is-visible .animate-fadeIn,
        .is-visible .animate-slideUp,
        .is-visible .animate-scaleUp,
        .animate-fadeIn.is-visible,
        .animate-slideUp.is-visible,
        .animate-scaleUp.is-visible {
          animation-play-state: running;
        }
        
        /* Melhorar transições */
        .transform {
          transition-property: transform, box-shadow;
        }
        
        /* Ajustes para o slide 2 */
        #slide-2-container .animate-fadeIn {
          opacity: 0;
        }
        
        #slide-2-container.is-visible .animate-fadeIn {
          opacity: 1;
          animation-play-state: running;
        }

        .shine-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.2) 100%
          );
          transform: skewX(-15deg);
          opacity: 0;
          z-index: 1;
          pointer-events: none;
          border-radius: inherit;
          overflow: hidden;
        }
        
        .shine-effect:hover::before {
          animation: shine 1.2s ease-out;
        }
        
        .shine-effect > * {
          position: relative;
          z-index: 2;
        }
        
        /* Garantir que o overflow hidden respeite os cantos arredondados */
        .block.overflow-hidden {
          border-radius: inherit;
        }
        
        /* Ajustar o efeito de escala para manter os cantos arredondados */
        .hover\:scale-105:hover {
          transform-origin: center;
        }
        
        /* Garantir que os cantos arredondados sejam mantidos */
        .rounded-xl {
          border-radius: 0.75rem !important;
          overflow: hidden;
        }

        /* Ajustar o estilo para a custom scrollbar e garantir que não apareça durante transições */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 0; /* Esconder a barra horizontal completamente */
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        /* Para esconder a scrollbar mas manter a funcionalidade */
        .custom-scrollbar {
          scrollbar-width: none; /* Para Firefox */
          -ms-overflow-style: none; /* Para IE e Edge */
          overflow-x: hidden;
        }
        
        /* Garantir que o conteúdo não cause overflow horizontal */
        .slide-content {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
        }
        
        /* Ocultar a scrollbar horizontal */
        .slide-content::-webkit-scrollbar-horizontal {
          display: none;
        }

        /* Configurações de perspectiva 3D aprimoradas para o container */
        .perspective {
          perspective: 3000px;
          overflow: hidden;
        }
        
        .preserve-3d {
          transform-style: preserve-3d;
          will-change: transform;
        }
        
        /* Efeito de flash no container durante a transição */
        .container-flash {
          animation: container-flash-effect 1s ease-out;
        }
        
        @keyframes container-flash-effect {
          0%, 100% { box-shadow: 0 0 0 rgba(141, 173, 164, 0); }
          50% { box-shadow: 0 0 50px rgba(141, 173, 164, 0.8); }
        }
        
        /* Efeito na página durante a transição */
        .page-transition {
          animation: page-transition-effect 0.8s ease-out;
        }
        
        @keyframes page-transition-effect {
          0%, 100% { background-color: transparent; }
          40% { background-color: rgba(0, 0, 0, 0.1); }
        }
        
        /* Animações das transições dos slides - muito mais dramáticas */
        .slide-content {
          position: absolute; /* Mantemos absolute, mas com container de altura fixa */
          width: 100%;
          height: 100%;
          min-height: 400px;
          opacity: 0;
          transform: translate3d(0, 0, 0) scale(0.95);
          transition: all 0.7s cubic-bezier(0.645, 0.045, 0.355, 1.000);
          backface-visibility: hidden;
          transform-origin: center center;
          overflow-y: auto;
          overflow-x: hidden;
          display: none; /* Hide initially */
          pointer-events: none; /* Disable interactions when hidden */
        }
        
        .slide-visible {
          opacity: 1 !important;
          display: block !important; /* Show when visible */
          position: relative;
          transform: translate3d(0, 0, 0) scale(1) rotateX(0) rotateY(0) !important;
          z-index: 10;
          pointer-events: auto; /* Enable interactions when visible */
        }
        
        /* Animações de tipo CUBO */
        .slide-cube-left {
          opacity: 0;
          transform: translate3d(-100%, 0, -500px) rotateY(-90deg);
          transform-origin: right center;
          transition-timing-function: cubic-bezier(0.785, 0.135, 0.150, 0.860);
        }
        
        .slide-cube-right {
          opacity: 0;
          transform: translate3d(100%, 0, -500px) rotateY(90deg);
          transform-origin: left center;
          transition-timing-function: cubic-bezier(0.785, 0.135, 0.150, 0.860);
        }
        
        /* Animações de tipo FLIP */
        .slide-flip-up {
          opacity: 0;
          transform: perspective(2000px) rotateX(-90deg);
          transform-origin: bottom center;
        }
        
        .slide-flip-down {
          opacity: 0;
          transform: perspective(2000px) rotateX(90deg);
          transform-origin: top center;
        }
        
        /* Animações de tipo ZOOM */
        .slide-zoom-in {
          opacity: 0;
          transform: scale3d(0.3, 0.3, 0.3);
        }
        
        .slide-zoom-out {
          opacity: 0;
          transform: scale3d(1.5, 1.5, 1.5);
        }
        
        /* Animações de tipo FOLD/UNFOLD */
        .slide-fold {
          opacity: 0;
          transform: perspective(1300px) rotateY(-60deg) rotateX(20deg) translateZ(-200px);
          transform-origin: 100% 100%;
        }
        
        .slide-unfold {
          opacity: 0;
          transform: perspective(1300px) rotateY(60deg) rotateX(-20deg) translateZ(-200px);
          transform-origin: 0% 0%;
        }
        
        /* Efeito de partículas/fragmentação */
        .particle-effect {
          animation: particle-fade 0.8s ease-out forwards;
        }
        
        @keyframes particle-fade {
          0% { 
            opacity: 1;
            filter: blur(0);
          }
          100% { 
            opacity: 0;
            filter: blur(20px);
          }
        }
        
        /* Efeito de hover para cards - sem o tilt 3D */
        .card-hover-effect {
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        
        .card-hover-effect:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
          filter: brightness(1.05);
        }

        /* Garantir altura e posicionamento adequados do container de slides */
        .slides-perspective-container {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 400px;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* Melhorar a transição entre slides */
        @keyframes slide-transition {
          0% { opacity: 0; transform: translate3d(0, 20px, 0) scale(0.95); }
          100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }

        .page-transition {
          animation: page-flash 0.5s ease-out;
        }

        @keyframes page-flash {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(141, 173, 164, 0.1); }
        }
      `}</style>
    </div>
  )
}

// Add a wrapper component with margin bottom to create visual separation
export function AboutUsWithSpacing() {
  return (
    <div className="mb-16 md:mb-24">
      <AboutUs />
    </div>
  )
}