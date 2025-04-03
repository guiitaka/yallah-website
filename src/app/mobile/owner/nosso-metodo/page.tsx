'use client';

import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import MobileAboutUs from '@/components/mobile/AboutUs';

export default function MobileNossoMetodoPage() {
    return (
        <MobileLayout>
            <div className="flex flex-col">
                <MobileAboutUs />
            </div>
        </MobileLayout>
    );
} 