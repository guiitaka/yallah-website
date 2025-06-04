'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
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
import AnimatedSearch from '../ui/AnimatedSearch'

type HeaderProps = {
  userType: 'owner' | 'tenant'
}

export default function Header({ userType }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
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

  // Função para verificar se o link está ativo
  const isLinkActive = (href: string) => {
    if (href === '/owner' || href === '/mobile/owner') {
      return pathname === href || pathname === '/'
    }
    return pathname?.includes(href)
  }

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
              absolute inset-0 transition-all duration-2000 transform
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
                absolute inset-0 transition-all duration-1000 backface-hidden
                ${isFlipping ? 'opacity-0' : 'opacity-100'}
              `}
            >
              <FromIcon size={iconSize} weight="fill" className="text-white drop-shadow-lg" />
            </div>

            {/* Segundo ícone */}
            <div
              className={`
                absolute inset-0 transition-all duration-1000 backface-hidden rotate-y-180
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
          <Link
            href="/owner"
            className={`flex items-center gap-2 px-4 py-2 ${isLinkActive('/owner') ? 'bg-[#8BADA4] text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-full md:hidden`}
          >
            <House weight="fill" size={20} />
            A Yallah
          </Link>
          <Link
            href="/mobile/owner"
            className={`md:hidden flex items-center gap-2 px-4 py-2 ${isLinkActive('/mobile/owner') ? 'bg-[#8BADA4] text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-full`}
          >
            <House weight="fill" size={20} />
            A Yallah
          </Link>
          <Link
            href="/owner"
            className={`hidden md:flex items-center gap-2 px-4 py-2 ${isLinkActive('/owner') ? 'bg-[#8BADA4] text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-full`}
          >
            <House weight="fill" size={20} />
            A Yallah
          </Link>

          {/* Como Funciona */}
          <Link
            href="/mobile/owner/como-funciona"
            className={`md:hidden flex items-center gap-2 px-4 py-2 ${isLinkActive('/mobile/owner/como-funciona') ? 'bg-[#8BADA4] text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-full`}
          >
            <Info size={20} />
            Como Funciona
          </Link>
          <Link
            href="/owner/como-funciona"
            className={`hidden md:flex items-center gap-2 px-4 py-2 ${isLinkActive('/owner/como-funciona') ? 'bg-[#8BADA4] text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-full`}
          >
            <Info size={20} />
            Como Funciona
          </Link>

          {/* Nosso Método */}
          <Link
            href="/mobile/owner/nosso-metodo"
            className={`md:hidden flex items-center gap-2 px-4 py-2 ${isLinkActive('/mobile/owner/nosso-metodo') ? 'bg-[#8BADA4] text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-full`}
          >
            <Lightbulb size={20} />
            Nosso Método
          </Link>
          <Link
            href="/owner/nosso-metodo"
            className={`hidden md:flex items-center gap-2 px-4 py-2 ${isLinkActive('/owner/nosso-metodo') ? 'bg-[#8BADA4] text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-full`}
          >
            <Lightbulb size={20} />
            Nosso Método
          </Link>

          {/* Serviços */}
          <Link
            href="/mobile/owner/servicos"
            className={`md:hidden flex items-center gap-2 px-4 py-2 ${isLinkActive('/mobile/owner/servicos') ? 'bg-[#8BADA4] text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-full`}
          >
            <Buildings size={20} />
            Serviços
          </Link>
          <Link
            href="/owner/servicos"
            className={`hidden md:flex items-center gap-2 px-4 py-2 ${isLinkActive('/owner/servicos') ? 'bg-[#8BADA4] text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-full`}
          >
            <Buildings size={20} />
            Serviços
          </Link>

          {/* Fale Conosco */}
          <Link
            href="/mobile/owner/fale-conosco"
            className={`md:hidden flex items-center gap-2 px-4 py-2 ${isLinkActive('/mobile/owner/fale-conosco') ? 'bg-[#8BADA4] text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-full`}
          >
            <ChatCircleText size={20} />
            Fale Conosco
          </Link>
          <Link
            href="/owner/fale-conosco"
            className={`hidden md:flex items-center gap-2 px-4 py-2 ${isLinkActive('/owner/fale-conosco') ? 'bg-[#8BADA4] text-white' : 'text-gray-600 hover:bg-gray-100'} rounded-full`}
          >
            <ChatCircleText size={20} />
            Fale Conosco
          </Link>
        </nav>
      )
    }
    // If userType is not 'owner', return null to remove the other navigation type
    return null;
  }

  return (
    <>
      {/* Overlay de transição */}
      <div
        className={`
          fixed inset-0 pointer-events-none z-[100]
          ${phase === 'idle' ? 'opacity-0' : 'opacity-100'}
          ${phase === 'fadeIn' ? 'bg-[#8BADA4]' : ''}
          transition-all duration-1500
        `}
      >
        {phase !== 'idle' && (
          <div className="w-full h-full flex items-center justify-center">
            {renderTransitionIcon()}
          </div>
        )}
      </div>

      {/* Header */}
      <header
        className={`
          fixed top-0 left-0 right-0 bg-white transition-all duration-300 z-[50]
          ${isScrolled ? 'shadow-lg' : ''}
        `}
        ref={navRef}
      >
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
                  {/* <ReactFlagsSelect
                    selected={selected}
                    onSelect={onSelectFlag}
                    countries={["BR", "US", "ES"]}
                    customLabels={{ BR: "PT", US: "EN", ES: "ES" }}
                    placeholder="Selecione o idioma"
                    className="!min-w-0 !w-[100px]"
                    selectButtonClassName="!px-3 !py-2.5 !border-0 !bg-gray-100 !rounded-full !text-sm"
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden w-full border-b bg-white">
          <div className="container mx-auto px-4 py-2">
            <div className="relative w-full h-[60px]">
              <Link
                href="/"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[60px]"
              >
                <Image
                  src="/logo-yallah-nobg.png"
                  alt="Yallah"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="w-full bg-gray-50 md:block hidden">
          <div className="container mx-auto px-6">
            {userType === 'owner' && ( // Only render this section if userType is 'owner'
              <div className="py-4">
                {renderNavigation()}
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
      </header>
    </>
  )
} 