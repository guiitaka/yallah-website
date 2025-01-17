'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  House, 
  MagnifyingGlass, 
  Heart, 
  ChatCircleText,
  User,
  Info,
  Lightbulb,
  Headset,
  Calculator,
  Buildings,
} from '@phosphor-icons/react'

export default function MobileNavigation() {
  const pathname = usePathname()
  const isOwner = pathname.startsWith('/owner')

  const ownerNavigation = [
    {
      href: '/owner',
      icon: <House size={24} weight={pathname === '/owner' ? 'fill' : 'regular'} />,
      label: 'A Yallah'
    },
    {
      href: '/owner/como-funciona',
      icon: <Info size={24} />,
      label: 'Como Funciona'
    },
    {
      href: '/owner/nosso-metodo',
      icon: <Lightbulb size={24} />,
      label: 'Método'
    },
    {
      href: '/owner/suporte',
      icon: <Headset size={24} />,
      label: 'Suporte'
    },
    {
      href: '/owner/fale-conosco',
      icon: <ChatCircleText size={24} />,
      label: 'Contato'
    }
  ]

  const tenantNavigation = [
    {
      href: '/tenant',
      icon: <House size={24} weight={pathname === '/tenant' ? 'fill' : 'regular'} />,
      label: 'Explorar'
    },
    {
      href: '/tenant/favoritos',
      icon: <Heart size={24} />,
      label: 'Favoritos'
    },
    {
      href: '/tenant/reservas',
      icon: <Buildings size={24} />,
      label: 'Reservas'
    },
    {
      href: '/tenant/mensagens',
      icon: <ChatCircleText size={24} />,
      label: 'Mensagens'
    },
    {
      href: '/tenant/perfil',
      icon: <User size={24} />,
      label: 'Perfil'
    }
  ]

  const navigation = isOwner ? ownerNavigation : tenantNavigation

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
      <div className="flex items-center justify-around py-2">
        {navigation.map((item) => (
          <Link 
            key={item.href}
            href={item.href} 
            className={`flex flex-col items-center gap-1 ${
              pathname === item.href 
                ? 'text-[#8BADA4]' 
                : 'text-gray-500 hover:text-[#8BADA4]'
            }`}
          >
            {item.icon}
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
} 