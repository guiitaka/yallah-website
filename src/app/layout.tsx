import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import ClientLayout from '@/components/layout/ClientLayout'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/philfung/add-to-homescreen@2.97/dist/add-to-homescreen.min.css"
        />
        <Script
          src="https://cdn.jsdelivr.net/gh/philfung/add-to-homescreen@2.97/dist/add-to-homescreen_pt.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 