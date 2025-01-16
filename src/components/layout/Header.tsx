'use client'

import React, { useState, useEffect } from 'react'
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
  House as HouseIcon
} from '@phosphor-icons/react'
import ReactFlagsSelect from 'react-flags-select'
import AnimatedSearch from '../ui/AnimatedSearch'

type HeaderProps = {
  userType: 'owner' | 'tenant'
}

export default function Header({ userType }: HeaderProps) {
  const [selected, setSelected] = useState('BR')
  const [isScrolled, setIsScrolled] = useState(false)

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
      <nav className="flex items-center justify-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-[#8BADA4] text-white rounded-full">
          <House weight="fill" size={20} />
          Imóveis
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <Star size={20} />
          Destaques
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <Buildings size={20} />
          Lançamentos
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <MapPin size={20} />
          Localização
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <Calculator size={20} />
          Financiamento
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <Calendar size={20} />
          Agendar
        </button>
      </nav>
    )
  }

  return (
    <div className={`w-full bg-white fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-sm' : ''
    }`}>
      {/* Top Header */}
      <div className="w-full border-b">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between py-2">
            {/* Social Media */}
            <div className="flex-1 flex items-center gap-4">
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
            <Link href="/" className="w-[280px] h-[100px] relative">
              <Image
                src="/logo-yallah-nobg.png"
                alt="Yallah"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </Link>

            {/* Profile Selection Buttons */}
            <div className="flex-1 flex items-center justify-end gap-3">
              <ReactFlagsSelect
                selected={selected}
                onSelect={onSelectFlag}
                countries={["BR", "US", "ES"]}
                customLabels={{ BR: "PT", US: "EN", ES: "ES" }}
                placeholder="Selecione o idioma"
                className="!min-w-0 !w-[120px]"
                selectButtonClassName="!px-2 !py-2 !border-0 !bg-gray-100 !rounded-full"
              />
              <Link 
                href="/owner"
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Key className="w-5 h-5" />
                Sou Proprietário
              </Link>
              <Link 
                href="/tenant"
                className="flex items-center gap-2 px-4 py-2 text-white bg-[#8BADA4] rounded-full hover:bg-[#8BADA4]/90 transition-colors"
              >
                <HouseIcon className="w-5 h-5" />
                Quero Alugar
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="w-full bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-center py-4">
            {/* Search Bar - Only show for tenants */}
            {userType === 'tenant' && (
              <div className="w-[300px]">
                <AnimatedSearch />
              </div>
            )}

            {renderNavigation()}
          </div>
        </div>
      </div>
    </div>
  )
} 