import Header from '@/components/layout/Header'
import Banner from '@/components/home/Banner'
import Promotions from '@/components/home/Promotions'
import AboutUs from '@/components/home/AboutUs'
import BestEvents from '@/components/home/BestEvents'
import Recommended from '@/components/home/Recommended'
import CallToAction from '@/components/home/CallToAction'
import Footer from '@/components/layout/Footer'

export default function TenantPage() {
  return (
    <main className="pt-[180px]">
      <Header userType="tenant" />
      <Banner userType="tenant" />
      <Promotions />
      <AboutUs />
      <BestEvents />
      <Recommended />
      <CallToAction />
      <Footer />
    </main>
  )
} 