'use client'

import MobileNavigation from '@/components/layout/MobileNavigation'
import { usePathname } from 'next/navigation'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <div className={!isHomePage ? 'pb-16 md:pb-0' : ''}>
      {children}
      {!isHomePage && <MobileNavigation />}
    </div>
  )
} 