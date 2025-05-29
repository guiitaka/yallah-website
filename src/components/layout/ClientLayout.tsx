'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/layout/Header'
import MobileNavigation from '@/components/layout/MobileNavigation'
import FloatingCoinButton from '@/components/ui/FloatingCoinButton'

type ClientLayoutProps = {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const userType = pathname.startsWith('/owner') ? 'owner' : 'tenant'
  const isTenantPage = userType === 'tenant' && (pathname === '/tenant' || pathname.startsWith('/tenant/'))
  const showHeader = !isHome && !isTenantPage

  // Determine top padding based on whether the header is shown
  const mainPaddingTopClass = showHeader ? 'pt-28 md:pt-36' : (isTenantPage ? 'pt-0' : 'pt-16 md:pt-24'); // Adjusted pt-36 for desktop header, pt-28 for mobile (needs verification)

  return (
    <>
      {showHeader && <Header userType={userType} />}
      <main className={`min-h-screen pb-20 md:pb-0 ${mainPaddingTopClass}`}>
        {children}
      </main>
      {!isHome && <MobileNavigation userType={userType} />}
      {!isHome && <FloatingCoinButton />}
    </>
  )
} 