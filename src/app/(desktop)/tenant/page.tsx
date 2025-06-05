'use client'

import { useEffect } from 'react'
import Banner from '@/components/home/Banner'
import Recommended from '@/components/home/Recommended'
import Footer from '@/components/layout/Footer'
import FeaturedProperties from '@/components/home/FeaturedProperties'
import AllProperties from '@/components/home/AllProperties'
import InstitutionalHero from '@/components/home/InstitutionalHero'
import { Hero } from '@components/ui/animated-hero'

// Componente de depuração (remova após resolver o problema)
const FirebaseDebug = () => {
    useEffect(() => {
        console.log('Firebase env vars:', {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        });
    }, []);

    return null;
};

export default function TenantPage() {
    return (
        <main className="pt-0">
            <FirebaseDebug />
            <Banner userType="tenant" />
            <Hero />
            <Recommended />
            <FeaturedProperties />
            <AllProperties />
            <InstitutionalHero />
            <Footer />
        </main>
    )
} 