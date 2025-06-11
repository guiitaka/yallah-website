'use client';

import React from 'react';
import AdminHeader from '@/components/admin/Header';
import Inbox from '@/components/admin/Inbox';

export default function AdminDashboard() {
    // A lógica de autenticação e redirecionamento agora pode ser centralizada 
    // no layout ou em um componente de ordem superior, se aplicável.
    // Por enquanto, vamos manter a simplicidade e focar na nova UI.

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
            <div className="relative z-10 min-h-screen flex flex-col">
                <AdminHeader />

                {/* Main Content */}
                <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-7xl mx-auto">
                        {/* Greeting and Date */}
                        <div className="flex justify-between items-center mb-6">
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
                            <h1 className="text-white text-base font-normal">
                                {new Date().toLocaleDateString('pt-BR', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </h1>
                        </div>

                        <Inbox />
                    </div>
                </main>
            </div>
        </div>
    );
} 