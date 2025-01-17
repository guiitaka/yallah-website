import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import MobileNavigation from '@/components/layout/MobileNavigation'

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
      <body className={`${inter.className} pb-16 md:pb-0`}>
        {children}
        <MobileNavigation />
      </body>
    </html>
  )
} 