'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/utils/AuthContext';
import { setCookie } from 'cookies-next';
import LoginYallah from '@/components/ui/LoginYallah';

export default function AdminLogin() {
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();
    const { checkCredentials } = useAuthContext();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, usernameInput: string, passwordInput: string) => {
        event.preventDefault();
        setErrorMessage('');

        try {
            const user = await checkCredentials(usernameInput, passwordInput);

            const { data } = await import('@/utils/supabaseClient').then(m => m.supabase.auth.getSession());
            const token = data.session?.access_token;

            setCookie('admin_session', token, {
                maxAge: 60 * 60 * 2,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            router.push('/admin/inbox');
        } catch (error: any) {
            console.error('Erro ao fazer login:', error);
            setErrorMessage('Nome de usuário ou senha inválidos');
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-end px-4 py-12 bg-gray-900 pr-20">
            <LoginYallah.VideoBackground videoUrl="/videos/1080p-standard.mp4" />

            <div className="relative z-20 w-full max-w-2xl animate-fadeIn">
                {errorMessage && (
                    <div
                        className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative mb-4 text-center animate-pulse"
                        role="alert"
                    >
                        <strong className="font-bold">Erro: </strong>
                        <span className="block sm:inline">{errorMessage}</span>
                    </div>
                )}
                <LoginYallah.LoginForm onSubmit={handleSubmit} />
            </div>
        </div>
    );
} 