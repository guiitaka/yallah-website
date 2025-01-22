'use client'

import React, { useState } from 'react'
import { MapPin, Calendar as CalendarIcon, Users, Bed, CaretDown, MagnifyingGlass, X } from '@phosphor-icons/react'
import DatePicker from 'react-datepicker'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import "react-datepicker/dist/react-datepicker.css"

export default function MobileBanner() {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
  const [startDate, endDate] = dateRange
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <section className="relative w-full h-[600px]">
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

      <div className="relative h-full flex flex-col items-center justify-start py-8 px-4">
        {/* Content */}
        <div className="text-white text-center mt-8">
          <h1 className="text-3xl font-bold mb-4">
            Encontre o imóvel{' '}
            <span className="relative">
              perfeito
              <span className="absolute left-0 right-0 bottom-1 h-1 bg-[#8BADA4]"></span>
            </span>{' '}
            para alugar
          </h1>
          <p className="text-gray-200 text-lg mb-8">
            Desfrute de uma experiência única em imóveis selecionados. Relaxe e realize seus sonhos com a Yallah
          </p>

          {/* Search Button */}
          {!isSearchOpen && (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-4 bg-[#8BADA4] text-white rounded-full hover:bg-[#8BADA4]/90 transition-all shadow-lg mx-auto"
            >
              <MagnifyingGlass className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Search Form */}
        <div 
          className={`w-full bg-white rounded-2xl shadow-lg transition-all duration-300 ${
            isSearchOpen 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8 pointer-events-none'
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

          {/* Location */}
          <div className="p-4 border-b border-gray-100">
            <label className="text-sm text-gray-500 block mb-1">Para onde você vai?</label>
            <div className="relative">
              <select className="w-full appearance-none bg-transparent text-gray-700 text-lg pr-8">
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
                <Bed className="w-5 h-5" />
                <CaretDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="p-4 border-b border-gray-100">
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
                className="w-full appearance-none bg-transparent text-gray-700 text-lg pr-8"
                calendarClassName="rounded-lg shadow-lg border-0"
                showPopperArrow={false}
                monthsShown={1}
                popperPlacement="bottom-start"
                customInput={
                  <div className="flex items-center justify-between cursor-pointer">
                    <input
                      type="text"
                      value={startDate ? `${format(startDate, 'dd/MM/yyyy')}${endDate ? ` - ${format(endDate, 'dd/MM/yyyy')}` : ''}` : ''}
                      placeholder="dd/mm/yyyy"
                      className="w-full appearance-none bg-transparent text-gray-700 text-lg cursor-pointer"
                      readOnly
                    />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none flex gap-1 items-center text-gray-400">
                      <div className="w-5 h-5 relative">
                        <CalendarIcon weight="regular" className="w-5 h-5 text-gray-400" />
                      </div>
                      <CaretDown className="w-4 h-4" />
                    </div>
                  </div>
                }
              />
            </div>
          </div>

          {/* Guests */}
          <div className="p-4 border-b border-gray-100">
            <label className="text-sm text-gray-500 block mb-1">Quantas pessoas?</label>
            <div className="relative">
              <select className="w-full appearance-none bg-transparent text-gray-700 text-lg pr-8">
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
          <div className="p-4">
            <button className="w-full p-4 bg-[#8BADA4] text-white rounded-xl hover:bg-[#8BADA4]/90 transition-colors shadow-lg flex items-center justify-center gap-2">
              <MagnifyingGlass className="w-6 h-6" />
              <span>Buscar</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
} 