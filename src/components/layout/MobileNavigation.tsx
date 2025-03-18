'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  House,
  Info,
  Lightbulb,
  Headset,
  CaretUp,
  Buildings,
  Tree,
  Bed,
  SketchLogo,
  MapPin,
  Waves,
  Train,
  Desktop,
  Mountains
} from '@phosphor-icons/react'
import { useState } from 'react'
import LanguageSelector from '../ui/LanguageSelector'

type MobileNavigationProps = {
  userType: 'owner' | 'tenant'
}

const categories = [
  { name: 'Apartamentos', icon: Buildings },
  { name: 'Chalés', icon: Tree },
  { name: 'Kitnets', icon: Bed },
  { name: 'Lofts', icon: SketchLogo },
  { name: 'Perto do centro', icon: MapPin },
  { name: 'Piscinas Incríveis', icon: Waves },
  { name: 'Pousadas', icon: House },
  { name: 'Próximos à estações', icon: Train },
  { name: 'Studios', icon: Desktop },
  { name: 'Vistas Incríveis', icon: Mountains }
]

export default function MobileNavigation({ userType }: MobileNavigationProps) {
  const router = useRouter()
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)

  return (
    <>
      {/* Categories Dropdown */}
      {userType === 'tenant' && isCategoryOpen && (
        <div className="fixed bottom-[80px] left-0 right-0 bg-white border-t border-gray-100 shadow-lg transition-all duration-300 ease-in-out max-h-[60vh] overflow-y-auto">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {categories.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  className="flex items-center gap-3 py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm text-gray-700"
                  onClick={() => {
                    setIsCategoryOpen(false)
                    // Aqui você pode adicionar a lógica de navegação para a categoria
                  }}
                >
                  <Icon className="w-5 h-5 text-[#8BADA4]" />
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menu de navegação mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 md:hidden z-[20]">
        <div className="container mx-auto px-4">
          <div className="flex items-start justify-between pt-2 h-[80px] mb-[env(safe-area-inset-bottom,24px)]">
            <Link
              href="/mobile/a-yallah"
              className="flex flex-col items-center gap-1"
            >
              <House weight="light" className="w-6 h-6 text-gray-600" />
              <span className="text-[10px] text-gray-600">A Yallah</span>
            </Link>

            {userType === 'tenant' ? (
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex flex-col items-center gap-1"
              >
                <CaretUp
                  weight="light"
                  className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''
                    }`}
                />
                <span className="text-[10px] text-gray-600">Categorias</span>
              </button>
            ) : (
              <Link
                href="/mobile/como-funciona"
                className="flex flex-col items-center gap-1"
              >
                <Info weight="light" className="w-6 h-6 text-gray-600" />
                <span className="text-[10px] text-gray-600">Como Funciona</span>
              </Link>
            )}

            <Link
              href="/mobile/owner/nosso-metodo"
              className="flex flex-col items-center gap-1"
            >
              <Lightbulb weight="light" className="w-6 h-6 text-gray-600" />
              <span className="text-[10px] text-gray-600">Nosso Método</span>
            </Link>

            <LanguageSelector />

            <Link
              href="/mobile/contato"
              className="flex flex-col items-center gap-1"
            >
              <Headset weight="light" className="w-6 h-6 text-gray-600" />
              <span className="text-[10px] text-gray-600">Contato</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
} 