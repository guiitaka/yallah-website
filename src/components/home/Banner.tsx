'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { MapPin, Calendar as CalendarIcon, Users, Buildings, ShieldCheck, Money, ChartLineUp, MagnifyingGlass, CaretDown, Bed } from '@phosphor-icons/react'
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

  return (
    <div className="px-4 md:px-6 pt-10 md:pt-10">
      <div className={`relative w-full ${userType === 'tenant' ? 'h-[900px] md:h-[750px]' : 'h-[700px] md:h-[600px]'} overflow-hidden rounded-3xl`}>
        {/* Background Video/Image */}
        <div className="absolute inset-0">
          {userType === 'tenant' ? (
            <>
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
            </>
          ) : (
            <>
              <Image
                src="/banner.jpg"
                alt="Banner"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/40" />
            </>
          )}
        </div>

        <div className="relative h-full mx-auto">
          <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 h-full">
            <div className="h-full flex flex-col md:flex-row md:gap-20">
              {userType === 'tenant' ? (
                <div className="container mx-auto h-full flex items-center justify-center">
                  <div className="max-w-[800px] w-full text-center">
                    {/* Content */}
                    <div className="text-white mb-10">
                      <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Encontre o imóvel{' '}
                        <span className="relative">
                          perfeito
                          <span className="absolute left-0 right-0 bottom-1 h-1 bg-[#8BADA4]"></span>
                        </span>{' '}
                        para alugar
                      </h1>
                      <p className="text-gray-200 text-lg md:text-xl">
                        Desfrute de uma experiência única em imóveis selecionados. Relaxe e realize seus sonhos com a Yallah
                      </p>
                    </div>

                    {/* Search Form */}
                    <div className="bg-white rounded-2xl shadow-lg relative">
                      <div className="flex flex-col md:flex-row items-center">
                        {/* Location */}
                        <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-100">
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
                        <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-100 relative z-50">
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
                              monthsShown={2}
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
                        <div className="flex-1 p-4 relative">
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
                        <div className="p-2">
                          <button className="p-4 bg-[#8BADA4] text-white rounded-full hover:bg-[#8BADA4]/90 transition-colors shadow-lg">
                            <MagnifyingGlass className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
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
                    <div className="w-full md:w-[400px] bg-white/95 md:bg-white rounded-2xl p-6 md:p-6 shadow-lg">
                      <div className="flex items-center gap-2 mb-4 md:mb-6">
                        <Buildings className="w-6 h-6" />
                        <h2 className="text-xl font-semibold">Por que anunciar na Yallah?</h2>
                      </div>

                      <div className="space-y-4 md:space-y-6">
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 