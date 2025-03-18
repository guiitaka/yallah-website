import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Como Funciona | Yallah',
    description: 'Descubra como funciona o processo de cadastro do seu imóvel na Yallah.',
};

export default function ComoFuncionaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
} 