'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  House, 
  Star, 
  Buildings, 
  MapPin, 
  Calculator, 
  Calendar, 
  InstagramLogo, 
  FacebookLogo, 
  WhatsappLogo,
  Info,
  Lightbulb,
  Headset,
  ChatCircleText,
  House as HouseIcon,
  Key,
  Tree,
  Mountains,
  Binoculars,
  Buildings as BuildingsIcon,
  Umbrella,
  SwimmingPool,
  Bed,
  Train,
  SquaresFour,
  Warehouse,
  Desktop
} from '@phosphor-icons/react'
import ReactFlagsSelect from 'react-flags-select'
import AnimatedSearch from '../ui/AnimatedSearch'

type HeaderProps = {
  userType: 'owner' | 'tenant'
}

export default function Header({ userType }: HeaderProps) {
  const router = useRouter()
  const [selected, setSelected] = useState('BR')
  const [isScrolled, setIsScrolled] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'fadeIn' | 'fadeOut'>('idle')
  const [isFlipping, setIsFlipping] = useState(false)
  const [targetUserType, setTargetUserType] = useState<'owner' | 'tenant'>(userType)
  const navRef = useRef<HTMLDivElement>(null)

  const onSelectFlag = (code: string) => {
    setSelected(code)
    // Aqui você pode adicionar a lógica para mudar o idioma da aplicação
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavigation = (path: string) => {
    const newUserType = path.includes('owner') ? 'owner' : 'tenant'
    setTargetUserType(newUserType)
    
    // Primeira fase: fade in para verde
    setPhase('fadeIn')
    
    // Após a tela ficar verde, inicia a animação do ícone
    setTimeout(() => {
      setIsFlipping(true)
      
      // Após a animação do ícone, navega e inicia o fade out
      setTimeout(() => {
        setIsFlipping(false)
        router.push(path)
        setPhase('fadeOut')
        
        // Resetar o estado após a animação completa
        setTimeout(() => {
          setPhase('idle')
        }, 1500)
      }, 2000) // Aumentado para 2s para combinar com a animação de rotação
    }, 1500)
  }

  const renderTransitionIcon = () => {
    const iconSize = 120
    const FromIcon = userType === 'owner' ? Key : HouseIcon
    const ToIcon = targetUserType === 'owner' ? Key : HouseIcon
    
    // Texto correspondente à versão que está sendo carregada
    const transitionText = targetUserType === 'owner' 
      ? 'Maximize o retorno do seu imóvel'
      : 'Encontre o lugar perfeito para sua estadia'
    
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-[120px] h-[120px]">
          {/* Container com flip */}
          <div 
            className={`
              absolute inset-0 transition-all duration-[2000ms] transform
              ${isFlipping ? 'animate-flip-y' : ''}
            `}
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'center center'
            }}
          >
            {/* Primeiro ícone */}
            <div 
              className={`
                absolute inset-0 transition-all duration-[1000ms] backface-hidden
                ${isFlipping ? 'opacity-0' : 'opacity-100'}
              `}
            >
              <FromIcon size={iconSize} weight="fill" className="text-white drop-shadow-lg" />
            </div>

            {/* Segundo ícone */}
            <div 
              className={`
                absolute inset-0 transition-all duration-[1000ms] backface-hidden rotate-y-180
                ${isFlipping ? 'opacity-100' : 'opacity-0'}
              `}
            >
              <ToIcon size={iconSize} weight="fill" className="text-white drop-shadow-lg" />
            </div>
          </div>
        </div>

        {/* Texto com reticências animadas */}
        <div 
          className={`
            text-white text-[40px] font-montserrat font-extrabold text-center transition-all duration-1000 tracking-tight
            ${isFlipping ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          `}
          style={{
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {transitionText}
          <span className="animate-ellipsis">...</span>
        </div>
      </div>
    )
  }

  const renderNavigation = () => {
    if (userType === 'owner') {
      return (
        <nav className="flex items-center justify-center gap-4">
          <Link href="/owner" className="flex items-center gap-2 px-4 py-2 bg-[#8BADA4] text-white rounded-full">
            <House weight="fill" size={20} />
            A Yallah
          </Link>
          <Link href="/owner/como-funciona" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Info size={20} />
            Como Funciona
          </Link>
          <Link href="/owner/nosso-metodo" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Lightbulb size={20} />
            Nosso Método
          </Link>
          <Link href="/owner/suporte" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Headset size={20} />
            Suporte
          </Link>
          <Link href="/owner/fale-conosco" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <ChatCircleText size={20} />
            Fale Conosco
          </Link>
        </nav>
      )
    }

    return (
      <>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full whitespace-nowrap">
          <BuildingsIcon size={20} />
          Apartamentos
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#8BADA4] text-white rounded-full whitespace-nowrap">
          <House weight="fill" size={20} />
          Chalés
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full whitespace-nowrap">
          <SquaresFour size={20} />
          Kitnets
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full whitespace-nowrap">
          <Warehouse size={20} />
          Lofts
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full whitespace-nowrap">
          <MapPin size={20} />
          Perto do centro
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full whitespace-nowrap">
          <SwimmingPool size={20} />
          Piscinas incríveis
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full whitespace-nowrap">
          <Bed size={20} />
          Pousadas
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full whitespace-nowrap">
          <Train size={20} />
          Próximos à estações
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full whitespace-nowrap">
          <Desktop size={20} />
          Studios
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full whitespace-nowrap">
          <Binoculars size={20} />
          Vistas incríveis
        </button>
      </>
    )
  }

  return (
    <>
      {/* Overlay de transição com duas fases */}
      <div 
        className={`fixed inset-0 z-[9999] transition-all transform duration-[1500ms] ease-in-out
          ${phase === 'idle' ? 'opacity-0 scale-110 pointer-events-none' : ''}
          ${phase === 'fadeIn' ? 'opacity-100 scale-100 bg-[#8BADA4]' : ''}
          ${phase === 'fadeOut' ? 'opacity-0 scale-90 bg-[#8BADA4]' : ''}
        `}
      >
        <div 
          className={`absolute inset-0 transition-opacity duration-[1500ms] ${
            phase === 'fadeIn' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#8BADA4]/20 to-[#8BADA4]/40" />
          
          {/* Ícone central com animação */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="perspective">
              {renderTransitionIcon()}
            </div>
          </div>
        </div>
      </div>
      <div className={`w-full bg-white fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-sm' : ''
      }`}>
        {/* Top Header */}
        <div className="w-full border-b md:block hidden">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-3 items-center">
              {/* Social Media */}
              <div className="flex items-center gap-4">
                <Link 
                  href="https://instagram.com" 
                  target="_blank"
                  className="text-[#3E5A54] hover:text-[#95CEB3] transition-colors"
                >
                  <InstagramLogo size={24} weight="fill" />
                </Link>
                <Link 
                  href="https://facebook.com" 
                  target="_blank"
                  className="text-[#3E5A54] hover:text-[#95CEB3] transition-colors"
                >
                  <FacebookLogo size={24} weight="fill" />
                </Link>
                <Link 
                  href="https://wa.me/5511999999999" 
                  target="_blank"
                  className="text-[#3E5A54] hover:text-[#95CEB3] transition-colors"
                >
                  <WhatsappLogo size={24} weight="fill" />
                </Link>
              </div>

              {/* Logo */}
              <div className="flex justify-center">
                <Link href="/" className="w-[280px] h-[100px] relative">
                  <Image
                    src="/logo-yallah-nobg.png"
                    alt="Yallah"
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </Link>
              </div>

              {/* Profile Selection Button */}
              <div className="flex items-center justify-end">
                <div className="flex items-center gap-4">
                  <ReactFlagsSelect
                    selected={selected}
                    onSelect={onSelectFlag}
                    countries={["BR", "US", "ES"]}
                    customLabels={{ BR: "PT", US: "EN", ES: "ES" }}
                    placeholder="Selecione o idioma"
                    className="!min-w-0 !w-[100px]"
                    selectButtonClassName="!px-3 !py-2.5 !border-0 !bg-gray-100 !rounded-full !text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden w-full border-b bg-white">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              {/* Empty div to help with centering */}
              <div className="w-[80px]" />

              <Link href="/" className="w-[160px] h-[60px] relative">
                <Image
                  src="/logo-yallah-nobg.png"
                  alt="Yallah"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </Link>

              <ReactFlagsSelect
                selected={selected}
                onSelect={onSelectFlag}
                countries={["BR", "US", "ES"]}
                customLabels={{ BR: "PT", US: "EN", ES: "ES" }}
                placeholder="Idioma"
                className="!min-w-0 !w-[80px]"
                selectButtonClassName="!px-2 !py-1.5 !border-0 !bg-gray-100 !rounded-full !text-sm"
              />
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="w-full bg-gray-50 md:block hidden">
          <div className="container mx-auto px-6">
            {userType === 'owner' ? (
              <div className="py-4">
                {renderNavigation()}
              </div>
            ) : (
              <div className="flex items-center gap-6 py-4">
                {/* Search Bar - Only show for tenants */}
                <div className="w-[300px] flex-shrink-0">
                  <AnimatedSearch />
                </div>

                {/* Navigation Container */}
                <div className="flex-1 overflow-x-auto">
                  <div className="flex items-center gap-6 py-2">
                    {renderNavigation()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <style jsx global>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .perspective {
            perspective: 1000px;
          }
          
          .backface-hidden {
            backface-visibility: hidden;
          }

          .rotate-y-180 {
            transform: rotateY(180deg);
          }
          
          @keyframes flip-y {
            0% {
              transform: rotateY(0deg);
            }
            100% {
              transform: rotateY(1080deg);
            }
          }

          .animate-flip-y {
            animation: flip-y 2s linear infinite;
          }

          @keyframes ellipsis {
            0% { content: ''; }
            25% { content: '.'; }
            50% { content: '..'; }
            75% { content: '...'; }
            100% { content: ''; }
          }

          .animate-ellipsis::after {
            content: '';
            animation: ellipsis 2s steps(4) infinite;
          }
        `}</style>
      </div>
    </>
  )
} 