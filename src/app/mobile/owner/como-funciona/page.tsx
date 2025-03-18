'use client';

import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import TimelineSection from '@/components/mobile/TimelineSection';
import HowItWorks from '@/components/mobile/HowItWorks';
import Footer from '@/components/mobile/Footer';

export default function MobileComoFuncionaPage() {
    return (
        <MobileLayout>
            <div className="flex flex-col">
                <TimelineSection />
                <div id="cadastro-form" className="w-full">
                    <HowItWorks showCTA={false} />
                </div>
                <div className="py-12"></div>
                <Footer />
            </div>
        </MobileLayout>
    );
} 