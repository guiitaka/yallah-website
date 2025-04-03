'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { MapPin, Calendar as CalendarIcon, Users, Buildings, ShieldCheck, Money, ChartLineUp, MagnifyingGlass, CaretDown, Bed, House, Star, WifiHigh, CheckCircle, Waves, Tree, Train, Mountains, Drop } from '@phosphor-icons/react'
import Link from 'next/link'
import DatePicker from 'react-datepicker'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import "react-datepicker/dist/react-datepicker.css"

type BannerProps = {
  userType: 'owner' | 'tenant'
}

export default function Banner({ userType }: BannerProps) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
  const [startDate, endDate] = dateRange
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Definindo as categorias com ícones
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
    <div className={userType === 'tenant' ? '' : 'px-4 md:px-6 pt-0 md:pt-0'}>
      {userType === 'tenant' ? (
        // Tenant version - New Harmont-inspired design without header
        <div className="relative w-full h-[100vh] min-h-[700px] overflow-hidden">
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

          <div className="relative h-full w-full max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col">
            {/* Header section with logo centered and larger */}
            <div className="mt-8 flex justify-center items-center">
              <Image
                src="/logo-yallah-nobg.png"
                alt="Yallah"
                width={220}
                height={55}
                className="brightness-0 invert"
              />
            </div>

            {/* Mobile Menu para Categorias */}
            <div className="md:hidden flex gap-3 overflow-x-auto pb-2 mt-3 scrollbar-hide">
              {categories.slice(0, 4).map((category) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="whitespace-nowrap px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 border border-white/20 flex items-center gap-1.5 flex-shrink-0"
                  >
                    <Icon size={14} weight="regular" />
                    <span className="text-sm">{category.name}</span>
                  </Link>
                );
              })}
              <Link
                href="#"
                className="whitespace-nowrap px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 border border-white/20 flex items-center gap-1.5 flex-shrink-0"
              >
                <span className="text-sm">Mais</span>
                <CaretDown size={12} />
              </Link>
            </div>

            {/* Hero Content - moved higher */}
            <div className="flex-1 flex items-center justify-center">
              <div className="max-w-3xl text-center">
                <h1 className="text-5xl md:text-7xl font-normal mb-6 text-white leading-tight">
                  Encontre o imóvel <span className="text-[#8BADA4]">perfeito</span> para alugar
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-10">
                  Desfrute de uma experiência única em imóveis selecionados. Relaxe e realize seus sonhos com a Yallah
                </p>

                {/* Feature badges */}
                <div className="flex justify-center gap-6 mb-10">
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 border border-white/20">
                    <CheckCircle weight="fill" className="text-[#8BADA4] w-5 h-5" />
                    <span className="text-white text-sm">Reserva Flexível</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 border border-white/20">
                    <WifiHigh weight="fill" className="text-[#8BADA4] w-5 h-5" />
                    <span className="text-white text-sm">Wi-Fi Grátis</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 border border-white/20">
                    <Star weight="fill" className="text-[#8BADA4] w-5 h-5" />
                    <span className="text-white text-sm">Avaliação 4.9</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Form - moved higher */}
            <div className="absolute bottom-10 md:bottom-16 left-0 right-0 mx-auto max-w-[1200px] px-4 z-10">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex flex-col md:flex-row items-center">
                  {/* Location with Categories */}
                  <div className="w-full md:w-[22%] p-5 border-b md:border-b-0 md:border-r border-gray-100 relative">
                    <label className="text-sm text-gray-500 block mb-1">Para onde você vai?</label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-transparent text-gray-700 text-base md:text-base pr-10">
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
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none flex gap-1 items-center text-gray-400">
                        <MapPin className="w-5 h-5" />
                        <CaretDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Category Type/Filter */}
                  <div className="w-full md:w-[25%] p-5 border-b md:border-b-0 md:border-r border-gray-100 relative">
                    <label className="text-sm text-gray-500 block mb-1">Tipo de imóvel</label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-transparent text-gray-700 text-base md:text-base pr-10">
                        <option value="">Todos os tipos</option>
                        {categories.map((category) => (
                          <option key={category.name} value={category.name}>{category.name}</option>
                        ))}
                      </select>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none flex gap-1 items-center text-gray-400">
                        <Buildings className="w-5 h-5" />
                        <CaretDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="w-full md:w-[28%] p-5 border-b md:border-b-0 md:border-r border-gray-100 relative z-[100]">
                    <label className="text-sm text-gray-500 block mb-1">Data</label>
                    <div className="relative">
                      <DatePicker
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                          setDateRange(update)
                        }}
                        isClearable={false}
                        placeholderText="dd/mm/yyyy"
                        dateFormat="dd/MM/yyyy"
                        locale={ptBR}
                        className="w-full appearance-none bg-transparent text-gray-700 text-base md:text-base pr-10"
                        calendarClassName="rounded-lg shadow-xl border-0"
                        showPopperArrow={false}
                        monthsShown={2}
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
                              className="w-full appearance-none bg-transparent text-gray-700 text-base md:text-base cursor-pointer text-center px-10"
                              readOnly
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex gap-1 items-center text-gray-400">
                              <div className="w-5 h-5 relative">
                                <CalendarIcon weight="regular" className="w-5 h-5 text-gray-400" />
                              </div>
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
                  <div className="w-full md:w-[15%] p-5 border-b md:border-b-0 md:border-r border-gray-100 relative">
                    <label className="text-sm text-gray-500 block mb-1">Quantas pessoas?</label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-transparent text-gray-700 text-base md:text-base pr-10">
                        <option value="">Selecione</option>
                        <option>1 pessoa</option>
                        <option>2 pessoas</option>
                        <option>3 pessoas</option>
                        <option>4 pessoas</option>
                        <option>5 pessoas</option>
                        <option>6+ pessoas</option>
                      </select>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none flex gap-1 items-center text-gray-400">
                        <Users className="w-5 h-5" />
                        <CaretDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="p-3 md:p-2 w-full md:w-[10%] flex items-center justify-center">
                    <button className="w-full px-3 py-4 bg-[#8BADA4] text-white rounded-xl hover:bg-[#7A9C94] transition-colors shadow-lg flex items-center justify-center gap-2">
                      <MagnifyingGlass className="w-5 h-5" />
                      <span>Buscar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Owner version - Keep original design
        <div className={`relative w-full h-[700px] md:h-[600px] overflow-hidden rounded-3xl`}>
          {/* Background Video/Image */}
          <div className="absolute inset-0">
            <Image
              src="/banner.jpg"
              alt="Banner"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative h-full mx-auto">
            <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 h-full">
              <div className="h-full flex flex-col md:flex-row md:gap-20">
                {/* Left Content for owner */}
                <div className="w-full md:max-w-[600px] text-white flex flex-col items-center text-center pt-6 md:pt-20 flex-none">
                  <h1 className="text-[40px] md:text-[64px] font-normal leading-[1.1] md:leading-tight mb-4 md:mb-8 max-w-[800px]">
                    Transforme seu imóvel em renda garantida:
                  </h1>
                  <p className="text-xl md:text-2xl opacity-100 mb-6 md:mb-10 font-light max-w-[600px]">
                    Deixe a Yallah cuidar de tudo para você.
                  </p>
                </div>

                {/* Card Container for owner */}
                <div className="flex-1 flex items-start justify-center pt-6 md:pt-20">
                  <div className="w-full md:w-[400px] bg-white/95 md:bg-white rounded-2xl p-6 md:p-6 shadow-lg text-black">
                    <div className="flex items-center gap-2 mb-4 md:mb-6">
                      <Buildings className="w-6 h-6" />
                      <h2 className="text-xl font-semibold text-gray-800">Por que anunciar na Yallah?</h2>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                      {/* Benefit 1 */}
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-[#8BADA4]/10 rounded-lg">
                          <ShieldCheck className="w-6 h-6 text-[#8BADA4]" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1 text-gray-800">Aluguel Garantido</h3>
                          <p className="text-sm text-gray-600">Receba seu aluguel em dia, independente do inquilino</p>
                        </div>
                      </div>

                      {/* Benefit 2 */}
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-[#8BADA4]/10 rounded-lg">
                          <Money className="w-6 h-6 text-[#8BADA4]" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1 text-gray-800">Valorização do Imóvel</h3>
                          <p className="text-sm text-gray-600">Manutenção preventiva e gestão profissional</p>
                        </div>
                      </div>

                      {/* Benefit 3 */}
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-[#8BADA4]/10 rounded-lg">
                          <ChartLineUp className="w-6 h-6 text-[#8BADA4]" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1 text-gray-800">Gestão Completa</h3>
                          <p className="text-sm text-gray-600">Cuidamos de tudo: desde o anúncio até a gestão do inquilino</p>
                        </div>
                      </div>

                      <button className="w-full flex items-center justify-center gap-2 py-4 bg-[#8BADA4] text-white rounded-lg hover:bg-[#8BADA4]/90 text-lg font-medium">
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
      )}
    </div>
  )
} 