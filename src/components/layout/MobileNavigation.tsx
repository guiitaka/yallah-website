'use client'

import Link from 'next/link'
import { 
  House, 
  MagnifyingGlass, 
  Heart, 
  ChatCircleText,
  User,
} from '@phosphor-icons/react'

export default function MobileNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
      <div className="flex items-center justify-around py-2">
        <Link href="/" className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#8BADA4]">
          <House size={24} />
          <span className="text-xs">Explorar</span>
        </Link>
        
        <Link href="/wishlists" className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#8BADA4]">
          <Heart size={24} />
          <span className="text-xs">Favoritos</span>
        </Link>
        
        <Link href="/trips" className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#8BADA4]">
          <House size={24} weight="fill" />
          <span className="text-xs">Viagens</span>
        </Link>
        
        <Link href="/messages" className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#8BADA4]">
          <ChatCircleText size={24} />
          <span className="text-xs">Mensagens</span>
        </Link>
        
        <Link href="/profile" className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#8BADA4]">
          <User size={24} />
          <span className="text-xs">Perfil</span>
        </Link>
      </div>
    </nav>
  )
} 