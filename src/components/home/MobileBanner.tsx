'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { MapPin, Calendar as CalendarIcon, Users, Bed, CaretDown, MagnifyingGlass, X, Star, WifiHigh, CheckCircle, House, Buildings, Train, Drop, Mountains } from '@phosphor-icons/react'
import DatePicker from 'react-datepicker'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import "react-datepicker/dist/react-datepicker.css"
import Link from 'next/link'

export default function MobileBanner() {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
  const [startDate, endDate] = dateRange
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Definindo as categorias com ícones - mesma lista da versão desktop
  const categories = [
    { name: 'Apartamentos', icon: Buildings, href: '#' },
    { name: 'Chalés', icon: House, href: '#' },
    { name: 'Kitnets', icon: Bed, href: '#' },
    { name: 'Lofts', icon: Buildings, href: '#' },
    { name: 'Perto do centro', icon: MapPin, href: '#' },
    { name: 'Piscinas incríveis', icon: Drop, href: '#' },
    { name: 'Pousadas', icon: House, href: '#' },
    { name: 'Próximos à estações', icon: Train, href: '#' },
    { name: 'Studios', icon: Buildings, href: '#' },
    { name: 'Vistas incríveis', icon: Mountains, href: '#' },
  ]

  return (
    <section className="relative w-full h-[700px] border border-white/20 rounded-2xl overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/banner-locatario.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative h-full flex flex-col items-center px-4 z-10">
        {/* Header with logo only */}
        <div className="w-full flex justify-center items-center mt-6 mb-6">
          <Image
            src="/logo-yallah-nobg.png"
            alt="Yallah"
            width={160}
            height={40}
            className="brightness-0 invert"
          />
        </div>

        {/* Categories Horizontal Scrolling */}
        <div className="flex gap-3 overflow-x-auto pb-2 w-full mb-6 scrollbar-hide">
          {categories.slice(0, 5).map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                href={category.href}
                className="whitespace-nowrap text-sm px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 border border-white/20 flex items-center gap-1.5 flex-shrink-0"
              >
                <Icon size={14} weight="regular" />
                <span>{category.name}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="whitespace-nowrap text-sm px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 border border-white/20 flex items-center gap-1.5 flex-shrink-0"
          >
            <span>Mais</span>
            <CaretDown size={12} />
          </button>
        </div>

        {/* Main content - moved up */}
        <div className="flex-1 flex flex-col justify-center items-center mt-[-40px]">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-normal mb-4 text-white leading-tight">
              Encontre o imóvel <span className="text-[#8BADA4]">perfeito</span> para alugar
            </h1>
            <p className="text-white/90 text-base mb-8">
              Desfrute de uma experiência única em imóveis selecionados. Relaxe e realize seus sonhos com a Yallah
            </p>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20">
              <CheckCircle weight="fill" className="text-[#8BADA4] w-4 h-4" />
              <span className="text-white text-xs">Reserva Flexível</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20">
              <WifiHigh weight="fill" className="text-[#8BADA4] w-4 h-4" />
              <span className="text-white text-xs">Wi-Fi Grátis</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20">
              <Star weight="fill" className="text-[#8BADA4] w-4 h-4" />
              <span className="text-white text-xs">Avaliação 4.9</span>
            </div>
          </div>

          {/* Search button - higher position */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-3 bg-[#8BADA4] text-white rounded-xl hover:bg-[#7A9C94] transition-all shadow-lg flex items-center gap-2 mb-4"
          >
            <MagnifyingGlass className="w-5 h-5" />
            <span>Buscar imóveis</span>
          </button>
        </div>
      </div>

      {/* Full Categories Menu Modal */}
      <div
        className={`fixed inset-0 z-50 bg-black/90 p-4 transition-all duration-300 flex flex-col ${isMenuOpen
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-full pointer-events-none'
          }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl text-white font-medium">Categorias</h3>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 overflow-y-auto">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                href={category.href}
                className="flex items-center gap-2 p-3 bg-white/10 rounded-xl text-white/90"
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon size={20} weight="regular" className="text-[#8BADA4]" />
                <span>{category.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Search Form */}
      <div
        className={`fixed inset-0 z-50 bg-white/95 backdrop-blur-sm p-4 transition-all duration-300 ${isSearchOpen
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-full pointer-events-none'
          }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-2">
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4">
          <h3 className="text-lg font-medium text-center mb-4 text-[#3E5A54]">Encontre seu imóvel perfeito</h3>

          {/* Location */}
          <div className="mb-4">
            <label className="text-sm text-gray-500 block mb-1">Para onde você vai?</label>
            <div className="relative">
              <select className="w-full appearance-none bg-transparent border border-gray-200 rounded-xl p-3 text-gray-700 pr-10 text-sm">
                <option value="">Selecione o bairro</option>
                <option>Moema</option>
                <option>Vila Madalena</option>
                <option>Pinheiros</option>
                <option>Jardins</option>
                <option>Itaim Bibi</option>
                <option>Vila Mariana</option>
                <option>Brooklin</option>
                <option>Perdizes</option>
                <option>Higienópolis</option>
                <option>Campo Belo</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex gap-1 items-center text-gray-400">
                <MapPin className="w-5 h-5" />
                <CaretDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Category Type/Filter - added */}
          <div className="mb-4">
            <label className="text-sm text-gray-500 block mb-1">Tipo de imóvel</label>
            <div className="relative">
              <select className="w-full appearance-none bg-transparent border border-gray-200 rounded-xl p-3 text-gray-700 pr-10 text-sm">
                <option value="">Todos os tipos</option>
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>{category.name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex gap-1 items-center text-gray-400">
                <Buildings className="w-5 h-5" />
                <CaretDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="mb-4 relative z-[100]">
            <label className="text-sm text-gray-500 block mb-1">Data</label>
            <div className="relative">
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  setDateRange(update)
                }}
                isClearable={true}
                placeholderText="dd/mm/yyyy"
                dateFormat="dd/MM/yyyy"
                locale={ptBR}
                className="w-full appearance-none bg-transparent border border-gray-200 rounded-xl p-3 text-gray-700 pr-10"
                calendarClassName="rounded-lg shadow-xl border-0"
                showPopperArrow={false}
                monthsShown={1}
                popperPlacement="bottom"
                popperProps={{
                  strategy: "fixed"
                }}
                customInput={
                  <div className="flex items-center justify-between cursor-pointer">
                    <input
                      type="text"
                      value={startDate ? `${format(startDate, 'dd/MM/yyyy')}${endDate ? ` - ${format(endDate, 'dd/MM/yyyy')}` : ''}` : ''}
                      placeholder="dd/mm/yyyy"
                      className="w-full appearance-none bg-transparent cursor-pointer pr-10 text-[13px]"
                      readOnly
                      style={{ fontSize: '13px' }}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex gap-1 items-center text-gray-400">
                      <div className="w-5 h-5 relative">
                        <CalendarIcon weight="regular" className="w-5 h-5 text-gray-400" />
                      </div>
                      <CaretDown className="w-4 h-4" />
                    </div>
                  </div>
                }
              />
            </div>
            <style jsx global>{`
              .react-datepicker-popper {
                z-index: 9999 !important;
                position: fixed !important;
              }
              .react-datepicker-wrapper {
                width: 100% !important;
              }
              .react-datepicker {
                font-family: inherit !important;
                border-radius: 0.75rem !important;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
                border: none !important;
                background-color: white !important;
              }
              .react-datepicker__month-container {
                background: white !important;
                border-radius: 0.5rem !important;
                padding: 8px !important;
              }
              .react-datepicker__day--selected, 
              .react-datepicker__day--range-start, 
              .react-datepicker__day--range-end {
                background-color: #8BADA4 !important;
              }
              .react-datepicker__day--in-range, 
              .react-datepicker__day--in-selecting-range {
                background-color: rgba(139, 173, 164, 0.2) !important;
              }
              .react-datepicker__day--keyboard-selected {
                background-color: rgba(139, 173, 164, 0.5) !important;
              }
              .react-datepicker__header {
                background-color: white !important;
                border-bottom: 1px solid #f0f0f0 !important;
                padding-top: 8px !important;
              }
              .react-datepicker__triangle {
                display: none !important;
              }
            `}</style>
          </div>

          {/* Guests */}
          <div className="mb-6">
            <label className="text-sm text-gray-500 block mb-1">Quantas pessoas?</label>
            <div className="relative">
              <select className="w-full appearance-none bg-transparent border border-gray-200 rounded-xl p-3 text-gray-700 pr-10 text-sm">
                <option value="">Selecione</option>
                <option>1 pessoa</option>
                <option>2 pessoas</option>
                <option>3 pessoas</option>
                <option>4 pessoas</option>
                <option>5 pessoas</option>
                <option>6+ pessoas</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex gap-1 items-center text-gray-400">
                <Users className="w-5 h-5" />
                <CaretDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button className="w-full p-4 bg-[#8BADA4] text-white rounded-xl hover:bg-[#7A9C94] transition-colors shadow-lg flex items-center justify-center gap-2">
            <MagnifyingGlass className="w-5 h-5" />
            <span>Buscar</span>
          </button>
        </div>
      </div>
    </section>
  )
} 