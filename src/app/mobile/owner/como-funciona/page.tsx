'use client';

import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import TimelineSection from '@/components/mobile/TimelineSection';
import HowItWorks from '@/components/mobile/HowItWorks';

export default function MobileComoFuncionaPage() {
    return (
        <MobileLayout>
            <div className="flex flex-col flex-1 min-h-[calc(100vh-84px)]">
                <TimelineSection />
                <div id="cadastro-form" className="w-full flex-1">
                    <HowItWorks showCTA={false} />
                </div>
            </div>
        </MobileLayout>
    );
} 