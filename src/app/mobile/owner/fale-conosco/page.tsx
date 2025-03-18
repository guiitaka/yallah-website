import React from 'react';
import ContactSection from '@/components/contact/ContactSection';
import ContactForm from '@/components/contact/ContactForm';
import ClientLayout from '@/components/layout/ClientLayout';
import Footer from '@/components/mobile/Footer';

export const metadata = {
    title: 'Fale Conosco | Yallah',
    description: 'Entre em contato com nossa equipe para esclarecer dúvidas ou solicitar informações sobre nossos serviços de hospedagem e gestão de imóveis.',
};

export default function ContactPageMobile() {
    return (
        <ClientLayout>
            {/* Main Content - Mobile optimized */}
            <div className="pt-16"></div>
            <ContactSection />
            <ContactForm />
            <Footer />
        </ClientLayout>
    );
} 