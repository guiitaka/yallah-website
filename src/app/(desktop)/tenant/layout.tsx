import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
    title: 'Yallah - Área do Locatário',
    description: 'Encontre o lugar perfeito para sua estadia'
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
}

export default function TenantLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
} 