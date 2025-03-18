import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Nosso Método | Yallah',
    description: 'Conheça o método da Yallah para oferecer a melhor experiência em gestão de imóveis em São Paulo.',
};

export default function NossoMetodoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
} 