'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/layout/Header'
import MobileNavigation from '@/components/layout/MobileNavigation'

type ClientLayoutProps = {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const userType = pathname.startsWith('/owner') ? 'owner' : 'tenant'

  return (
    <>
      {!isHome && <Header userType={userType} />}
      <main className="min-h-screen pb-20 md:pb-0">
        {children}
      </main>
      {!isHome && <MobileNavigation userType={userType} />}
    </>
  )
} 