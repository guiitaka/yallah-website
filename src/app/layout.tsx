import type { Metadata, Viewport } from 'next'
import { Montserrat } from 'next/font/google'
import '@/app/globals.css'
import ClientLayout from '@/components/layout/ClientLayout'

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Yallah',
  description: 'Encontre o lugar perfeito para sua estadia',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Yallah'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={montserrat.className}>
        {children}
      </body>
    </html>
  )
} 