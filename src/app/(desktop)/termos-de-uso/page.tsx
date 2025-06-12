import React from 'react';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

export const metadata = {
    title: 'Termos de Uso | Yallah',
    description: 'Leia os Termos de Uso da plataforma Yallah.'
};

export default function TermosDeUsoPage() {
    return (
        <div className="min-h-screen bg-[#3E5A54] text-white flex flex-col">
            <Header userType="owner" />
            <div className="flex-1 max-w-2xl mx-auto py-16 px-4">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">Termos de Uso</h1>
                <p className="mb-4 opacity-90">Ao acessar e utilizar a plataforma Yallah, você concorda com os seguintes termos e condições:</p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">1. Uso da Plataforma</h2>
                <p className="mb-4 opacity-90">A plataforma deve ser utilizada de acordo com as leis vigentes e para fins lícitos. É proibido o uso para atividades fraudulentas ou ilícitas.</p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">2. Cadastro e Segurança</h2>
                <p className="mb-4 opacity-90">Você é responsável por manter a confidencialidade de suas informações de acesso e por todas as atividades realizadas em sua conta.</p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">3. Propriedade Intelectual</h2>
                <p className="mb-4 opacity-90">Todo o conteúdo da plataforma, incluindo textos, imagens e marcas, é protegido por direitos autorais e não pode ser reproduzido sem autorização.</p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">4. Modificações dos Termos</h2>
                <p className="mb-4 opacity-90">A Yallah pode alterar estes termos a qualquer momento. O uso continuado da plataforma implica aceitação das alterações.</p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">5. Contato</h2>
                <p className="mb-4 opacity-90">Em caso de dúvidas sobre estes termos, entre em contato: <a href="mailto:contato@yallah.com" className="underline text-white">contato@yallah.com</a></p>
            </div>
            <Footer />
        </div>
    );
} 