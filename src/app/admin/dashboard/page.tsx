'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/utils/AuthContext';
import { deleteCookie } from 'cookies-next';
import {
    Building, Home, Plus, Settings, MessageCircle,
    LogOut, MoreVertical, Search, Bell, ChevronDown,
    BedDouble, Bath, Square, BarChart2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminDashboard() {
    const { user, loading, signOut } = useAuthContext();
    const router = useRouter();
    const pathname = usePathname();
    const [username, setUsername] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState('Recent listed');
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    useEffect(() => {
        // If not loading and no user, redirect to login page
        if (!loading && !user) {
            router.push('/admin');
        } else if (user) {
            // Extract username from email
            const email = user.email || '';
            setUsername(email.split('@')[0]);
        }
    }, [user, loading, router]);

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
            await signOut();
            deleteCookie('admin_session');
            router.push('/admin');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-xl">Carregando...</div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen relative"
            style={{
                backgroundImage: "url('/background-dashboard.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 z-0"></div>

            {/* Content Container */}
            <div className="relative z-10 min-h-screen">
                {/* Header/Navbar - Floating Pill */}
                <header className="py-4">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                        <div className="bg-white/30 backdrop-blur-lg rounded-full shadow-lg py-3 px-6 border border-white/20">
                            <div className="flex items-center relative">
                                {/* Left section: Logo */}
                                <div className="flex-shrink-0">
                                    <Link href="/admin/dashboard" className="flex items-center">
                                        <span className="text-white text-3xl font-bold">Yallah</span>
                                    </Link>
                                </div>

                                {/* Center section: Navigation Pills - Absolute Center */}
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

                                {/* Right section: Actions and Profile */}
                                <div className="flex items-center ml-auto">
                                    {/* Message Icon */}
                                    <div className="mx-2">
                                        <button className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30">
                                            <MessageCircle className="h-5 w-5" />
                                        </button>
                                    </div>

                                    {/* Notification Bell */}
                                    <div className="mx-2">
                                        <button className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30">
                                            <Bell className="h-5 w-5" />
                                        </button>
                                    </div>

                                    {/* Profile/Avatar */}
                                    <div className="ml-4 relative flex items-center profile-menu-container">
                                        <div className="flex items-center cursor-pointer" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
                                            {/* Avatar */}
                                            <Image
                                                src="https://ui-avatars.com/api/?name=YA&background=DDDDDD&color=333333"
                                                alt="Avatar do Usuário"
                                                width={40}
                                                height={40}
                                                className="rounded-full border border-gray-200"
                                            />

                                            {/* User Info */}
                                            <div className="ml-3 mr-2">
                                                <p className="text-sm font-medium text-white">
                                                    {username || 'Yallah Admin'}
                                                </p>
                                                <p className="text-xs text-white/70">
                                                    {user?.email || 'yallah@yallah.com.br'}
                                                </p>
                                            </div>

                                            {/* Dropdown Indicator */}
                                            <ChevronDown className="h-4 w-4 text-white/70" />
                                        </div>

                                        {/* Dropdown Menu */}
                                        <div className={`${isProfileMenuOpen ? 'block' : 'hidden'} absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-lg rounded-md shadow-lg py-1 z-10 border border-white/20`}>
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-white/50 transition-colors"
                                                onClick={handleSignOut}
                                            >
                                                Sair
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="py-6">
                    <div className="w-full px-6 sm:px-8 lg:px-10">

                        {/* Date & Greeting Bar */}
                        <div className="flex justify-between items-center mb-8">
                            <div className="text-lg font-bold text-white">
                                {(() => {
                                    const hora = new Date().getHours();
                                    if (hora >= 5 && hora < 12) {
                                        return "Bom dia, Yallah";
                                    } else if (hora >= 12 && hora < 18) {
                                        return "Boa tarde, Yallah";
                                    } else {
                                        return "Boa noite, Yallah";
                                    }
                                })()}
                            </div>

                            <h1 className="text-white text-base font-bold">
                                {new Date().toLocaleDateString('pt-BR', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </h1>
                        </div>

                        {/* Main Layout Container */}
                        <div className="flex">
                            {/* Left Section (Main Content) */}
                            <div className="flex-1 pr-6">
                                {/* Hero Card */}
                                <div className="bg-white/25 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden mb-6 relative border border-white/20">
                                    <div className="p-6 relative z-10">
                                        {/* Stats Section */}
                                        <div className="w-full">
                                            {/* Main Stats */}
                                            <div className="flex flex-col md:flex-row gap-16 mb-10">
                                                <div>
                                                    <h3 className="text-sm font-medium text-white/80 mb-2">Número de Vendas</h3>
                                                    <p className="text-5xl font-bold text-white">R$ 6.892</p>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-white/80 mb-2">Visualizações de Imóveis</h3>
                                                    <p className="text-5xl font-bold text-white">39,7%</p>
                                                </div>
                                            </div>

                                            {/* Cards */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {/* Completed Deals Card */}
                                                <div className="bg-[#F0F8EF] rounded-xl p-6">
                                                    <div className="flex items-center mb-4">
                                                        <div className="p-2 rounded-full bg-white mr-3">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                            </svg>
                                                        </div>
                                                        <h3 className="text-lg font-medium text-gray-700">Negócios Concluídos</h3>
                                                    </div>
                                                    <p className="text-4xl font-bold mb-4 text-gray-700">125,79</p>
                                                    <div className="w-full h-2 bg-white rounded-full mb-2">
                                                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '78%' }}></div>
                                                    </div>
                                                    <p className="text-sm font-medium text-right text-gray-700">78%</p>
                                                </div>

                                                {/* Total Revenue Card */}
                                                <div className="bg-[#E1F5FA] rounded-xl p-6">
                                                    <div className="flex items-center mb-4">
                                                        <div className="p-2 rounded-full bg-white mr-3">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <circle cx="12" cy="12" r="10"></circle>
                                                                <line x1="12" y1="8" x2="12" y2="16"></line>
                                                                <line x1="8" y1="12" x2="16" y2="12"></line>
                                                            </svg>
                                                        </div>
                                                        <h3 className="text-lg font-medium text-gray-700">Receita Total</h3>
                                                    </div>
                                                    <p className="text-4xl font-bold mb-4 text-gray-700">R$ 43.752K</p>
                                                    <div className="w-full h-2 bg-white rounded-full mb-2">
                                                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: '34%' }}></div>
                                                    </div>
                                                    <p className="text-sm font-medium text-right text-gray-700">34%</p>
                                                </div>

                                                {/* Property Status Card */}
                                                <div className="bg-[#F2E9FF] rounded-xl p-6">
                                                    <div className="flex items-center mb-4">
                                                        <div className="p-2 rounded-full bg-white mr-3">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                                            </svg>
                                                        </div>
                                                        <h3 className="text-lg font-medium text-gray-700">Status dos Imóveis</h3>
                                                    </div>

                                                    {/* Total Properties */}
                                                    <div className="mb-3">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <p className="text-sm text-gray-600">Total de Imóveis</p>
                                                            <p className="text-sm font-semibold text-gray-700">35</p>
                                                        </div>
                                                        <div className="w-full h-2 bg-white rounded-full">
                                                            <div className="h-2 bg-purple-500 rounded-full" style={{ width: '100%' }}></div>
                                                        </div>
                                                    </div>

                                                    {/* Rented Properties */}
                                                    <div className="mb-3">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <p className="text-sm text-gray-600">Alugados</p>
                                                            <p className="text-sm font-semibold text-gray-700">23</p>
                                                        </div>
                                                        <div className="w-full h-2 bg-white rounded-full">
                                                            <div className="h-2 bg-orange-500 rounded-full" style={{ width: '65.7%' }}></div>
                                                        </div>
                                                    </div>

                                                    {/* Available Properties */}
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <p className="text-sm text-gray-600">Disponíveis</p>
                                                            <p className="text-sm font-semibold text-gray-700">12</p>
                                                        </div>
                                                        <div className="w-full h-2 bg-white rounded-full">
                                                            <div className="h-2 bg-teal-500 rounded-full" style={{ width: '34.3%' }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Three Column Layout */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Column 1: Sales Statistic */}
                                    <div className="bg-white/25 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xl font-bold text-white">Estatísticas de Vendas</h3>
                                            <div className="flex items-center">
                                                <button className="text-white/70 hover:text-white">
                                                    <MoreVertical className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Fake Bar Chart */}
                                        <div className="mb-4 relative">
                                            <div className="text-xs text-white/80 absolute right-0 top-0">R$ 2,2k</div>
                                            <div className="h-[150px] flex items-end justify-between space-x-2 pt-5">
                                                <div className="w-1/6 bg-gray-100 rounded-t h-[20%]"></div>
                                                <div className="w-1/6 bg-gray-100 rounded-t h-[40%]"></div>
                                                <div className="w-1/6 bg-gray-100 rounded-t h-[30%]"></div>
                                                <div className="w-1/6 bg-gray-100 rounded-t h-[60%]"></div>
                                                <div className="w-1/6 bg-[#8BADA4] rounded-t h-[95%]"></div>
                                                <div className="w-1/6 bg-gray-100 rounded-t h-[70%] relative">
                                                    <div className="absolute top-0 left-0 w-full h-[70%] bg-[#E6E6E6] bg-opacity-50 rounded-t"></div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between text-xs text-white/80 mt-2">
                                                <div>Jul</div>
                                                <div>Ago</div>
                                                <div>Set</div>
                                                <div>Out</div>
                                                <div>Nov</div>
                                                <div>Dez</div>
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <h4 className="text-lg font-medium text-white mb-2">Encontre análises e obtenha acesso rápido.</h4>
                                            <p className="text-sm text-white/80">Um conjunto abrangente de soluções chamado One Platform será o primeiro passo na digitalização da sua empresa.</p>
                                        </div>
                                    </div>

                                    {/* Column 2: Visit Statistic */}
                                    <div className="bg-white/25 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xl font-bold text-white">Estatísticas de Visitas</h3>
                                            <div className="flex items-center">
                                                <button className="text-white/70 hover:text-white">
                                                    <MoreVertical className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex mb-6">
                                            <div className="flex items-center mr-6">
                                                <div className="p-2 rounded-full bg-white/20 mr-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="10"></circle>
                                                        <polyline points="8 12 12 16 16 12"></polyline>
                                                        <line x1="12" y1="8" x2="12" y2="16"></line>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-white/80">Lucro Total</p>
                                                    <p className="text-xl font-bold text-white">R$ 24,9K</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="p-2 rounded-full bg-white/20 mr-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-white/80">Visitantes</p>
                                                    <div className="flex items-center">
                                                        <p className="text-xl font-bold text-white">R$ 24K</p>
                                                        <span className="ml-2 w-2 h-2 rounded-full bg-green-500"></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Line Chart */}
                                        <div className="h-[100px] mb-4 relative">
                                            <div className="absolute left-0 right-0 bottom-0 h-px bg-gray-200"></div>
                                            <svg className="h-full w-full" viewBox="0 0 300 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M0,80 Q50,70 100,50 T200,40 T300,20" stroke="#8BADA4" strokeWidth="2" fill="none" />
                                                <circle cx="0" cy="80" r="4" fill="#8BADA4" />
                                                <circle cx="50" cy="70" r="4" fill="#8BADA4" />
                                                <circle cx="100" cy="50" r="4" fill="#8BADA4" />
                                                <circle cx="150" cy="40" r="4" fill="#8BADA4" />
                                                <circle cx="200" cy="40" r="4" fill="#8BADA4" />
                                                <circle cx="250" cy="25" r="4" fill="#8BADA4" />
                                                <circle cx="300" cy="20" r="4" fill="#8BADA4" />
                                            </svg>
                                        </div>

                                        <div className="flex justify-between text-xs text-white/80">
                                            <div>Sáb</div>
                                            <div>Dom</div>
                                            <div>Seg</div>
                                        </div>

                                        <div className="mt-6 p-4 bg-white/20 rounded-lg text-center">
                                            <h5 className="text-lg font-semibold text-white mb-1">Taxa</h5>
                                            <p className="text-2xl font-bold text-white">32.43%</p>
                                        </div>
                                    </div>

                                    {/* Column 3: Messages */}
                                    <div className="bg-white/25 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xl font-bold text-white">Mensagens</h3>
                                            <button className="text-white/70 hover:text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="space-y-5">
                                            {/* Message 1 */}
                                            <div className="flex items-start">
                                                <div className="relative mr-3">
                                                    <Image
                                                        src="https://randomuser.me/api/portraits/women/12.jpg"
                                                        alt="Avatar do Usuário"
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-sm font-medium text-white">Kianna George</h4>
                                                        <span className="inline-flex items-center rounded-full bg-[#E6EFED] px-2 py-1 text-xs font-medium text-[#8BADA4]">4</span>
                                                    </div>
                                                    <p className="text-xs text-white/80 mt-1">Não está tão ruim, só tentando...</p>
                                                </div>
                                            </div>

                                            {/* Message 2 */}
                                            <div className="flex items-start">
                                                <div className="relative mr-3">
                                                    <Image
                                                        src="https://randomuser.me/api/portraits/men/32.jpg"
                                                        alt="Avatar do Usuário"
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-sm font-medium text-white">Jaydon Mango</h4>
                                                        <span className="inline-flex items-center rounded-full bg-[#E6EFED] px-2 py-1 text-xs font-medium text-[#8BADA4]">2</span>
                                                    </div>
                                                    <p className="text-xs text-white/80 mt-1">É uma boa ideia. Eu vou ter...</p>
                                                </div>
                                            </div>

                                            {/* Message 3 */}
                                            <div className="flex items-start">
                                                <div className="relative mr-3">
                                                    <Image
                                                        src="https://randomuser.me/api/portraits/women/45.jpg"
                                                        alt="Avatar do Usuário"
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-sm font-medium text-white">Kianna Vetrovs</h4>
                                                        <span className="inline-flex items-center rounded-full bg-[#E6EFED] px-2 py-1 text-xs font-medium text-[#8BADA4]">3</span>
                                                    </div>
                                                    <p className="text-xs text-white/80 mt-1">Obrigada, eu agradeço. Ei...</p>
                                                </div>
                                            </div>

                                            {/* Message 4 */}
                                            <div className="flex items-start">
                                                <div className="relative mr-3">
                                                    <Image
                                                        src="https://randomuser.me/api/portraits/women/22.jpg"
                                                        alt="Avatar do Usuário"
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-sm font-medium text-white">Mira Mango</h4>
                                                        <span className="inline-flex items-center rounded-full bg-[#E6EFED] px-2 py-1 text-xs font-medium text-[#8BADA4]">5</span>
                                                    </div>
                                                    <p className="text-xs text-white/80 mt-1">Estou pensando sobre o novo...</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column (Listing Board) */}
                            <div className="hidden lg:block w-80">
                                <div className="bg-white/25 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-6 border border-white/20">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-white">Painel de Imóveis</h3>
                                        <div className="relative">
                                            <button className="flex items-center text-white text-sm">
                                                <span>Listados recentemente</span>
                                                <ChevronDown className="ml-2 h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Property Card 1 */}
                                    <div className="mb-6">
                                        <div className="rounded-lg overflow-hidden h-40 mb-4 relative">
                                            <Image
                                                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
                                                alt="Villa em Rizal"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-lg font-bold text-white">R$ 2.642 <span className="text-xs font-normal text-white/70">/Mês</span></p>
                                                    <h3 className="text-sm font-medium text-white">Villa em Rizal, Filipinas</h3>
                                                    <p className="text-xs text-white/70">Palawan Ecolodge Amihan</p>
                                                </div>
                                                <button className="text-white/70">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="flex items-center space-x-4 mt-2">
                                                <span className="flex items-center text-xs text-white/70">
                                                    <BedDouble className="h-3 w-3 mr-1" /> 6 quartos
                                                </span>
                                                <span className="flex items-center text-xs text-white/70">
                                                    <Bath className="h-3 w-3 mr-1" /> 2 banheiros
                                                </span>
                                                <span className="flex items-center text-xs text-white/70">
                                                    <Square className="h-3 w-3 mr-1" /> 2,621m²
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Property Card 2 */}
                                    <div>
                                        <div className="rounded-lg overflow-hidden h-40 mb-4 relative">
                                            <Image
                                                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
                                                alt="Quarto em Tebet"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-lg font-bold text-white">R$ 548,98 <span className="text-xs font-normal text-white/70">/Mês</span></p>
                                                    <h3 className="text-sm font-medium text-white">Quarto em Tebet, Indonésia</h3>
                                                    <p className="text-xs text-white/70">THE LOUJI @ Patra Kuningan # 5</p>
                                                </div>
                                                <button className="text-white/70">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="flex items-center space-x-4 mt-2">
                                                <span className="flex items-center text-xs text-white/70">
                                                    <BedDouble className="h-3 w-3 mr-1" /> 2 quartos
                                                </span>
                                                <span className="flex items-center text-xs text-white/70">
                                                    <Bath className="h-3 w-3 mr-1" /> 1 banheiro
                                                </span>
                                                <span className="flex items-center text-xs text-white/70">
                                                    <Square className="h-3 w-3 mr-1" /> 352m²
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
} 