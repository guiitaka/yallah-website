import React from 'react';
import ContactSection from '@/components/contact/ContactSection';
import ContactForm from '@/components/contact/ContactForm';
import ClientLayout from '@/components/layout/ClientLayout';
import Footer from '@/components/layout/Footer';

export const metadata = {
    title: 'Fale Conosco | Yallah',
    description: 'Entre em contato com nossa equipe para esclarecer dúvidas ou solicitar informações sobre nossos serviços de hospedagem e gestão de imóveis.',
};

export default function ContactPage() {
    return (
        <ClientLayout>
            {/* Main Content */}
            <div className="pt-[60px]"></div>
            <ContactSection />
            <ContactForm />
            <Footer />
        </ClientLayout>
    );
} 