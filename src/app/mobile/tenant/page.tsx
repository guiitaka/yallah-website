'use client';

import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import Banner from '@/components/home/Banner'
import RecommendedSection from '@/components/mobile/RecommendedSection'
import AnimatedTextSection from '@/components/mobile/AnimatedTextSection'
import PropertyList from '@/components/mobile/PropertyList'
import InstitutionalHero from '@/components/home/InstitutionalHero'
import { Hero } from '@components/ui/animated-hero'
import { FilterProvider } from '@/context/FilterContext';

export default function MobileTenantPage() {
  return (
    <FilterProvider>
      <MobileLayout>
        <main className="pt-0">
          <Banner userType="tenant" />
          <Hero />
          <RecommendedSection />
          <AnimatedTextSection />
          <PropertyList />
          <InstitutionalHero />
        </main>
      </MobileLayout>
    </FilterProvider>
  )
} 