import Header from '@/components/layout/Header'
import Banner from '@/components/home/Banner'
import PopularDestinations from '@/components/home/PopularDestinations'
import AboutUs from '@/components/home/AboutUs'
import BestEvents from '@/components/home/BestEvents'
import Recommended from '@/components/home/Recommended'
import CallToAction from '@/components/home/CallToAction'
import Footer from '@/components/layout/Footer'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Yallah - Área do Locatário',
  description: 'Encontre o lugar perfeito para sua estadia'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
}

export default function TenantPage() {
  return (
    <main className="pt-[180px]">
      <Header userType="tenant" />
      <Banner userType="tenant" />
      <PopularDestinations />
      <AboutUs />
      <BestEvents />
      <Recommended />
      <CallToAction />
      <Footer />
    </main>
  )
} 