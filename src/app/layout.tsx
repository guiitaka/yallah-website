import './globals.css'
import { Inter } from 'next/font/google'
import ClientLayout from '@/components/layout/ClientLayout'

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
        <script src="https://cdn.jsdelivr.net/gh/philfung/add-to-homescreen@2.97/dist/add-to-homescreen.min.js"></script>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 