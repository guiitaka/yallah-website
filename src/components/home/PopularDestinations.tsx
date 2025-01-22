'use client'

import Image from 'next/image'
import { CaretLeft, CaretRight, Star } from '@phosphor-icons/react'
import { useState } from 'react'

const destinations = [
  {
    id: 1,
    name: 'Loft em Pinheiros',
    image: '/destinations/popular1.JPG',
    price: 460,
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Studio na Oscar Freire',
    image: '/destinations/popular2.JPG',
    price: 640,
    rating: 4.9,
  },
  {
    id: 3,
    name: 'Apartamento em Moema',
    image: '/destinations/popular3.JPG',
    price: 780,
    rating: 5.0,
  },
  {
    id: 4,
    name: 'Cobertura em Higienópolis',
    image: '/destinations/popular4.jpg',
    price: 990,
    rating: 4.9,
  },
  {
    id: 5,
    name: 'Duplex na Vila Madalena',
    image: '/destinations/popular5.jpg',
    price: 850,
    rating: 4.7,
  }
]

export default function PopularDestinations() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      nextSlide()
    }
    if (touchStart - touchEnd < -75) {
      // Swipe right
      prevSlide()
    }
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(0, destinations.length - 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, destinations.length - 2) : prev - 1
    )
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Destinos Populares</h2>
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
              disabled={currentIndex === 0}
            >
              <CaretLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
              disabled={currentIndex >= destinations.length - 2}
            >
              <CaretRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div 
            className="flex gap-6 transition-transform duration-300 ease-in-out touch-pan-x"
            style={{ transform: `translateX(-${currentIndex * (100 / (destinations.length - 1))}%)` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {destinations.map((destination) => (
              <div
                key={destination.id}
                className="min-w-[280px] md:min-w-[300px] flex-shrink-0"
              >
                <div className="relative rounded-2xl overflow-hidden group">
                  <div className="aspect-[4/3]">
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="text-lg font-medium text-white mb-2">
                      {destination.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-200">R$</span>
                        <span className="text-white font-medium">{destination.price}</span>
                        <span className="text-sm text-gray-200">/noite</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star weight="fill" className="w-4 h-4 text-[#8BADA4]" />
                        <span className="text-white">{destination.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 