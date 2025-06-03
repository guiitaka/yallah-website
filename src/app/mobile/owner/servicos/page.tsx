'use client'

import React from 'react'
import MobileLayout from '@/components/layout/MobileLayout'
import SwitchableContentSection from '@/components/home/SwitchableContentSection'

export default function MobileServicosPage() {
    return (
        <MobileLayout>
            <div className="flex flex-col">
                <div className="pt-0">
                    <SwitchableContentSection />
                </div>
            </div>
        </MobileLayout>
    )
} 