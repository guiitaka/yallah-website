import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Yallah Brasil',
  description: 'Gestão profissional de imóveis para locação',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

'use client'

import MobileNavigation from '@/components/layout/MobileNavigation'
import { usePathname } from 'next/navigation'

function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <div className={!isHomePage ? 'pb-16 md:pb-0' : ''}>
      {children}
      {!isHomePage && <MobileNavigation />}
    </div>
  )
} 