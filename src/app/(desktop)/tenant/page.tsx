import Banner from '@/components/home/Banner'
import Recommended from '@/components/home/Recommended'
import Footer from '@/components/layout/Footer'
import FeaturedProperties from '@/components/home/FeaturedProperties'
import AllProperties from '@/components/home/AllProperties'
import InstitutionalHero from '@/components/home/InstitutionalHero'
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
    <main className="pt-0">
      <Banner userType="tenant" />
      <Recommended />
      <FeaturedProperties />
      <AllProperties />
      <InstitutionalHero />
      <Footer />
    </main>
  )
} 