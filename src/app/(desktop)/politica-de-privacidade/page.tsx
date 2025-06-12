import React from 'react';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

export const metadata = {
    title: 'Política de Privacidade | Yallah',
    description: 'Saiba como a Yallah protege seus dados e sua privacidade.'
};

export default function PoliticaDePrivacidadePage() {
    return (
        <div className="min-h-screen bg-[#3E5A54] text-white flex flex-col">
            <Header userType="owner" />
            <div className="flex-1 max-w-2xl mx-auto py-16 px-4">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">Política de Privacidade</h1>
                <p className="mb-4 opacity-90">Sua privacidade é importante para nós. Esta política descreve como coletamos, usamos e protegemos suas informações pessoais ao utilizar nossos serviços.</p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">1. Coleta de Informações</h2>
                <p className="mb-4 opacity-90">Coletamos informações fornecidas por você, como nome, e-mail, telefone e dados de navegação, para melhorar sua experiência em nossa plataforma.</p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">2. Uso das Informações</h2>
                <p className="mb-4 opacity-90">Utilizamos seus dados para personalizar serviços, processar solicitações e enviar comunicações relevantes. Não compartilhamos suas informações com terceiros sem seu consentimento.</p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">3. Segurança</h2>
                <p className="mb-4 opacity-90">Adotamos medidas de segurança para proteger seus dados contra acesso não autorizado, alteração ou divulgação.</p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">4. Direitos do Usuário</h2>
                <p className="mb-4 opacity-90">Você pode solicitar a atualização, correção ou exclusão de seus dados pessoais a qualquer momento, entrando em contato conosco.</p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">5. Alterações nesta Política</h2>
                <p className="mb-4 opacity-90">Podemos atualizar esta política periodicamente. Recomendamos que você a revise regularmente.</p>
                <p className="mt-8 opacity-70">Em caso de dúvidas, entre em contato: <a href="mailto:contato@yallah.com" className="underline text-white">contato@yallah.com</a></p>
            </div>
            <Footer />
        </div>
    );
} 