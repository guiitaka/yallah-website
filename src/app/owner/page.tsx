'use client'

import Header from '@/components/layout/Header'
import Banner from '@/components/home/Banner'
import DesktopAboutUs from '@/components/home/AboutUs'
import MobileAboutUs from '@/components/mobile/AboutUs'
import Promotions from '@/components/home/Promotions'
import BestEvents from '@/components/home/BestEvents'
import ContactForm from '@/components/home/ContactForm'
import FAQ from '@/components/home/FAQ'
import Footer from '@/components/layout/Footer'
import { useDevice } from '@/hooks/useDevice'

export default function OwnerPage() {
  const { isMobile } = useDevice()

  return (
    <main className="pt-[60px] md:pt-[180px]">
      <Header userType="owner" />
      <div className="space-y-12 md:space-y-20">
        <Banner userType="owner" />
        {isMobile ? <MobileAboutUs /> : <DesktopAboutUs />}
        <Promotions />
        <BestEvents />
        <ContactForm />
        <FAQ />
      </div>
      <Footer />
    </main>
  )
} 