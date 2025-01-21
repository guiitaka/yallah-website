import Header from '@/components/layout/Header'
import Banner from '@/components/home/Banner'
import HeroSearch from '@/components/home/HeroSearch'
import PopularDestinations from '@/components/home/PopularDestinations'
import AboutUs from '@/components/home/AboutUs'
import BestEvents from '@/components/home/BestEvents'
import Recommended from '@/components/home/Recommended'
import CallToAction from '@/components/home/CallToAction'
import Footer from '@/components/layout/Footer'

export default function TenantPage() {
  return (
    <main className="pt-[180px]">
      <Header userType="tenant" />
      <HeroSearch userType="tenant" />
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