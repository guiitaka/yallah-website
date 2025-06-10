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
  Mountains,
  Wrench,
  Heart,
  User,
  Funnel
} from '@phosphor-icons/react'
import { useState } from 'react'
import { useFilter } from '@/context/FilterContext'

type MobileNavigationProps = {
  userType: 'owner' | 'tenant'
}

type NavLink = {
  href: string;
  icon: React.ElementType;
  label: string;
  action?: (e: React.MouseEvent) => void;
};

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
  const { toggleFilterModal } = useFilter();

  const tenantLinks: NavLink[] = [
    { href: "/mobile/tenant", icon: House, label: "Início" },
    {
      href: "#",
      icon: Funnel,
      label: "Filtros",
      action: (e) => {
        e.preventDefault();
        toggleFilterModal();
      }
    },
    { href: "http://localhost:3000/mobile/owner", icon: Buildings, label: "Proprietários" },
    { href: "https://agent.jotform.com/0197336e623672dd8656ec15d26e4d3ec9f7", icon: Headset, label: "Contato" },
  ];

  const ownerLinks: NavLink[] = [
    { href: "/mobile/owner", icon: House, label: "A Yallah" },
    { href: "/mobile/owner/como-funciona", icon: Info, label: "Como Funciona" },
    { href: "/mobile/owner/nosso-metodo", icon: Lightbulb, label: "Nosso Método" },
    { href: "/mobile/owner/servicos", icon: Wrench, label: "Serviços" },
    { href: "/mobile/owner/fale-conosco", icon: Headset, label: "Contato" },
  ];

  const links: NavLink[] = userType === 'owner' ? ownerLinks : tenantLinks;

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
          <div className="flex items-center justify-around pt-2 h-[80px] mb-[env(safe-area-inset-bottom,24px)]">
            {links.map(({ href, icon: Icon, label, action }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center justify-center gap-1 w-1/4"
                onClick={(e) => {
                  if (action) {
                    action(e);
                  }
                }}
              >
                <Icon weight="light" className="w-6 h-6 text-gray-600" />
                <span className="text-[10px] text-gray-600">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
} 