import Header from '@/components/layout/Header'
import Banner from '@/components/home/Banner'
import Promotions from '@/components/home/Promotions'
import ContactForm from '@/components/home/ContactForm'
import FAQ from '@/components/home/FAQ'
import Footer from '@/components/layout/Footer'
import AboutSection from '@/components/home/AboutSection'
import MapPresenceSection from '@/components/home/MapPresenceSection'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Yallah - Área do Proprietário',
  description: 'Maximize o retorno do seu imóvel'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
}

export default function OwnerPage() {
  return (
    <main className="pt-[60px] md:pt-[180px]">
      <Header userType="owner" />
      <div className="space-y-12 md:space-y-20">
        <Banner userType="owner" />

        <div className="relative">
          <Promotions />
        </div>

        <AboutSection />
        <MapPresenceSection />

        <ContactForm />
        <FAQ />
        <Footer />
      </div>
    </main>
  )
} 