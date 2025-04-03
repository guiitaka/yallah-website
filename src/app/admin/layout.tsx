'use client';

import React from 'react';
import { AuthProvider } from '@/utils/AuthContext';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
} 