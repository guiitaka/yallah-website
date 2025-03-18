import React from 'react';
import HowItWorks from '@/components/home/HowItWorks';
import TimelineSection from '@/components/home/TimelineSection';
import Footer from '@/components/layout/Footer';

export default function ComoFuncionaPage() {
    return (
        <div className="min-h-screen">
            <TimelineSection />
            <div id="cadastro-form">
                <HowItWorks showCTA={false} />
            </div>
            <div className="py-16"></div>
            <Footer />
        </div>
    );
} 