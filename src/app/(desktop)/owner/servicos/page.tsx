'use client'

import React from 'react'
import SwitchableContentSection from '@/components/home/SwitchableContentSection'
import Footer from '@/components/layout/Footer'

export default function ServicosPage() {
    return (
        <div className="min-h-screen">
            <div className="pt-40">
                <SwitchableContentSection />
            </div>
            <Footer />
        </div>
    )
} 