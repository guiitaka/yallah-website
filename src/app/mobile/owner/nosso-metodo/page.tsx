'use client';

import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import AboutUs from '@/components/home/AboutUs';
import Footer from '@/components/mobile/Footer';

export default function MobileNossoMetodoPage() {
    return (
        <MobileLayout>
            <div className="flex flex-col">
                <AboutUs />
                <Footer />
            </div>
        </MobileLayout>
    );
} 