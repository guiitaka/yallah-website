'use client';

import React from 'react';
import AdminHeader from '@/components/admin/Header';

export default function AdminDashboardPage() {
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
                <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-white">
                            Possível recurso no futuro
                        </h1>
                        <p className="text-white/80 mt-2">
                            Esta área ainda não foi desenvolvida.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
} 