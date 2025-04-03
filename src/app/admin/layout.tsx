'use client';

import React, { useEffect } from 'react';
import { AuthProvider } from '@/utils/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { getCookie } from 'cookies-next';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    // Verificar token no cookie para todas as rotas do admin exceto página de login
    useEffect(() => {
        const token = getCookie('admin_session');
        const isLoginPage = pathname === '/admin';

        // Se não há token e não estamos na página de login, redirecionar para login
        if (!token && !isLoginPage) {
            router.push('/admin');
        }
    }, [pathname, router]);

    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
} 