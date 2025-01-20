'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { House, Info, Lightbulb, Headset, Key } from '@phosphor-icons/react'

type MobileNavigationProps = {
  userType: 'owner' | 'tenant'
}

export default function MobileNavigation({ userType }: MobileNavigationProps) {
  const router = useRouter();

  const handleUserTypeChange = () => {
    const newUserType = userType === 'owner' ? 'tenant' : 'owner';
    localStorage.setItem('userType', newUserType);
    router.push(`/mobile/${newUserType}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 md:hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <Link
            href="/mobile/a-yallah"
            className="flex flex-col items-center gap-1"
          >
            <House weight="light" className="w-6 h-6 text-gray-600" />
            <span className="text-xs text-gray-600">A Yallah</span>
          </Link>

          <Link
            href="/mobile/como-funciona"
            className="flex flex-col items-center gap-1"
          >
            <Info weight="light" className="w-6 h-6 text-gray-600" />
            <span className="text-xs text-gray-600">Como Funciona</span>
          </Link>

          <Link
            href="/mobile/metodo"
            className="flex flex-col items-center gap-1"
          >
            <Lightbulb weight="light" className="w-6 h-6 text-gray-600" />
            <span className="text-xs text-gray-600">Método</span>
          </Link>

          <button
            onClick={handleUserTypeChange}
            className="flex flex-col items-center gap-1"
          >
            {userType === 'owner' ? (
              <>
                <House weight="light" className="w-6 h-6 text-gray-600" />
                <span className="text-xs text-gray-600">Alugar</span>
              </>
            ) : (
              <>
                <Key weight="light" className="w-6 h-6 text-gray-600" />
                <span className="text-xs text-gray-600">Proprietário</span>
              </>
            )}
          </button>

          <Link
            href="/mobile/contato"
            className="flex flex-col items-center gap-1"
          >
            <Headset weight="light" className="w-6 h-6 text-gray-600" />
            <span className="text-xs text-gray-600">Contato</span>
          </Link>
        </div>
      </div>
    </div>
  )
} 