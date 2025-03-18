'use client'

import React from 'react'
import MobileLayout from '@/components/layout/MobileLayout'
import SwitchableContentSection from '@/components/home/SwitchableContentSection'
import Footer from '@/components/mobile/Footer'

export default function MobileServicosPage() {
    return (
        <MobileLayout>
            <div className="flex flex-col">
                <div className="pt-32">
                    <SwitchableContentSection />
                </div>
                <Footer />
            </div>
        </MobileLayout>
    )
} 