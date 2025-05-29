'use client'

import React from 'react'
import SwitchableContentSection from '@/components/home/SwitchableContentSection'
import Footer from '@/components/layout/Footer'

export default function ServicosPage() {
    return (
        <div className="min-h-screen pt-[60px]">
            <div>
                <SwitchableContentSection />
            </div>
            <Footer />
        </div>
    )
} 