'use client';

import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { NossoMetodoTimeline } from '@/components/NossoMetodoTimeline';

export default function MobileNossoMetodoPage() {
    return (
        <MobileLayout>
            <div className="flex flex-col">
                <NossoMetodoTimeline />
            </div>
        </MobileLayout>
    );
} 