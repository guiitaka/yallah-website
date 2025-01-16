import Header from '@/components/layout/Header'
import Banner from '@/components/home/Banner'
import Promotions from '@/components/home/Promotions'
import AboutUs from '@/components/home/AboutUs'
import BestEvents from '@/components/home/BestEvents'
import ContactForm from '@/components/home/ContactForm'
import FAQ from '@/components/home/FAQ'
import Footer from '@/components/layout/Footer'

export default function OwnerPage() {
  return (
    <main className="pt-[180px]">
      <Header />
      <Banner />
      <Promotions />
      <AboutUs />
      <BestEvents />
      <ContactForm />
      <FAQ />
      <Footer />
    </main>
  )
} 