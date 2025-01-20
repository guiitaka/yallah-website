'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  Key,
  House as HouseIcon,
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
  const [selected, setSelected] = useState('BR')
  const [isScrolled, setIsScrolled] = useState(false)
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

  const renderSwitchButton = () => {
    if (userType === 'owner') {
      return (
        <Link 
          href="/tenant"
          className="flex items-center justify-center w-[160px] gap-2 px-6 py-2 text-white bg-[#8BADA4] hover:bg-[#7A9C93] rounded-full transition-colors text-sm font-medium whitespace-nowrap"
        >
          <HouseIcon className="w-4 h-4 flex-shrink-0" />
          <span>Quero Alugar</span>
        </Link>
      )
    }
    return (
      <Link 
        href="/owner"
        className="flex items-center justify-center w-[180px] gap-2 px-6 py-2 text-white bg-[#3E5A54] hover:bg-[#2D4640] rounded-full transition-colors text-sm font-medium whitespace-nowrap"
      >
        <Key className="w-4 h-4 flex-shrink-0" />
        <span>Sou Proprietário</span>
      </Link>
    )
  }

  return (
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
                {renderSwitchButton()}
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
      `}</style>
    </div>
  )
} 