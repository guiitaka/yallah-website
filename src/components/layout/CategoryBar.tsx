'use client'

import React from 'react'
import { Home, Star, MapPin, Crown, Calendar } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

const categories = [
  { label: 'Imóveis', icon: Home, href: '/imoveis' },
  { label: 'Destaques', icon: Star, href: '/destaques' },
  { label: 'Localizações', icon: MapPin, href: '/localizacoes' },
  { label: 'Premium', icon: Crown, href: '/premium' },
  { label: 'Eventos', icon: Calendar, href: '/eventos' },
]

export function CategoryBar() {
  const [activeCategory, setActiveCategory] = React.useState('Imóveis')

  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-thin">
      {categories.map(({ label, icon: Icon, href }) => {
        const isActive = activeCategory === label
        return (
          <button
            key={label}
            onClick={() => setActiveCategory(label)}
            className={twMerge(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap hover:shadow-md",
              isActive
                ? "bg-black text-white shadow-lg scale-105"
                : "text-gray-600 hover:bg-gray-50 hover:text-black"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        )
      })}
    </div>
  )
} 