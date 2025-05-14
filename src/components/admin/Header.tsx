'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { deleteCookie } from 'cookies-next';
import { useAuthContext } from '@/utils/AuthContext';
import { Building, Home, MessageCircle, Bell, ChevronDown } from 'lucide-react';

export default function AdminHeader() {
    const { user, loading, signOut } = useAuthContext();
    const router = useRouter();
    const pathname = usePathname();
    const [username, setUsername] = useState<string>('');
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            const email = user.email || '';
            setUsername(email.split('@')[0]);
        }
    }, [user]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.profile-menu-container')) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSignOut = async () => {
        try {
            // Primeiro desconectar do Firebase
            if (typeof signOut === 'function') {
                await signOut();
            }

            // Chamar a API de logout para limpar sessão no servidor
            await fetch('/api/auth/logout', {
                method: 'POST'
            });

            // Limpar cookies no cliente
            deleteCookie('admin_session');

            // Limpar armazenamento local
            if (typeof window !== 'undefined') {
                // Limpar Firebase Auth do localStorage
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('firebase:')) {
                        localStorage.removeItem(key);
                    }
                });

                // Limpar sessionStorage
                sessionStorage.clear();

                // Esperar um momento para garantir que tudo seja limpo
                setTimeout(() => {
                    // Forçar redirecionamento completo para a página de login
                    window.location.replace('/admin');
                }, 100);
            }
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            // Em caso de falha, forçar redirecionamento
            window.location.replace('/admin');
        }
    };

    return (
        <header className="py-4">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                <div className="bg-white/30 backdrop-blur-lg rounded-full shadow-lg py-3 px-6 border border-white/20">
                    <div className="flex items-center relative">
                        <div className="flex-shrink-0">
                            <Link href="/admin/dashboard" className="flex items-center">
                                <span className="text-white text-3xl font-bold">Yallah</span>
                            </Link>
                        </div>

                        <div className="absolute left-1/2 transform -translate-x-1/2">
                            <nav className="hidden md:flex items-center rounded-full px-2 py-1">
                                <Link
                                    href="/admin/dashboard"
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full hover:bg-opacity-80 transition-colors"
                                    style={{
                                        backgroundColor: pathname === '/admin/dashboard' ? '#8BADA4' : 'transparent',
                                        color: 'white'
                                    }}
                                >
                                    <Home className="mr-2 h-5 w-5" />
                                    Home
                                </Link>
                                <Link
                                    href="/admin/dashboard/properties"
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full hover:bg-opacity-80 transition-colors"
                                    style={{
                                        backgroundColor: pathname === '/admin/dashboard/properties' ? '#8BADA4' : 'transparent',
                                        color: 'white'
                                    }}
                                >
                                    <Building className="mr-2 h-5 w-5" />
                                    Imóveis
                                </Link>
                                <Link
                                    href="/admin/dashboard/support"
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full hover:bg-opacity-80 transition-colors"
                                    style={{
                                        backgroundColor: pathname === '/admin/dashboard/support' ? '#8BADA4' : 'transparent',
                                        color: 'white'
                                    }}
                                >
                                    <MessageCircle className="mr-2 h-5 w-5" />
                                    Suporte
                                </Link>
                            </nav>
                        </div>

                        <div className="flex items-center ml-auto">
                            <div className="mx-2">
                                <button className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30">
                                    <MessageCircle className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="mx-2">
                                <button className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30">
                                    <Bell className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="ml-4 relative flex items-center profile-menu-container">
                                <div className="flex items-center cursor-pointer" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
                                    <Image
                                        src="https://ui-avatars.com/api/?name=YA&background=DDDDDD&color=333333"
                                        alt="Avatar do Usuário"
                                        width={40}
                                        height={40}
                                        className="rounded-full border border-gray-200"
                                    />

                                    <div className="ml-3 mr-2">
                                        <p className="text-sm font-medium text-white">
                                            {username || 'Yallah Admin'}
                                        </p>
                                        <p className="text-xs text-white/70">
                                            {user?.email || 'yallah@yallah.com.br'}
                                        </p>
                                    </div>

                                    <ChevronDown className="h-4 w-4 text-white/70" />
                                </div>

                                <div
                                    className={`${isProfileMenuOpen ? 'block' : 'hidden'} absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-lg rounded-md shadow-lg py-1 z-10 border border-white/20`}
                                >
                                    <a
                                        href="/admin"
                                        className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-white/80 transition-colors flex items-center justify-between"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleSignOut();
                                        }}
                                    >
                                        <span>Sair</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                            <polyline points="16 17 21 12 16 7"></polyline>
                                            <line x1="21" y1="12" x2="9" y2="12"></line>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
} 