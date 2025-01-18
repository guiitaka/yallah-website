import Header from '@/components/layout/Header'
import Banner from '@/components/home/Banner'
import AboutUs from '@/components/home/AboutUs'
import AboutUsMobile from '@/components/home/AboutUsMobile'
import Promotions from '@/components/home/Promotions'
import BestEvents from '@/components/home/BestEvents'
import ContactForm from '@/components/home/ContactForm'
import FAQ from '@/components/home/FAQ'
import Footer from '@/components/layout/Footer'

export default function OwnerPage() {
  return (
    <main className="pt-[60px] md:pt-[180px]">
      <Header userType="owner" />
      <div className="space-y-12 md:space-y-20">
        <Banner userType="owner" />
        <AboutUs />
        <AboutUsMobile />
        <Promotions />
        <BestEvents />
        <ContactForm />
        <FAQ />
      </div>
      <Footer />
    </main>
  )
} 