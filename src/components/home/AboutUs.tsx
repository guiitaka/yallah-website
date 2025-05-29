'use client'

import React, { useEffect, useRef } from 'react'
// import Image from 'next/image'
// import { ArrowUpRight, Play, Pause, SpeakerHigh, SpeakerLow, Gear, SquaresFour, Camera } from '@phosphor-icons/react'
// import { NossoMetodoBento } from '@/components/NossoMetodoBento'; // Bento removed
import { NossoMetodoTimeline } from '@/components/NossoMetodoTimeline'; // Timeline added

export default function AboutUs() {
  // const videoRef = useRef<HTMLVideoElement>(null)

  // useEffect for intersection observer (if still needed for bento items, otherwise remove)
  useEffect(() => {
    // if (videoRef.current) {
    //   videoRef.current.play().catch(error => {
    //     console.log("Erro ao iniciar o vídeo de fundo:", error)
    //   })
    // }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
      }
    )

    document.querySelectorAll('.animate-fadeIn, .animate-slideUp, .animate-scaleUp').forEach((el) => {
      observer.observe(el)
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className="w-full px-4 md:px-6 py-16 md:py-24 bg-white">
      {/* Video Background - REMOVED */}
      {/* Overlay - REMOVED */}
      {/* Background Text elements - REMOVED */}

      {/* Max-width container for the Bento Grid */}
      <div className="max-w-7xl mx-auto">
        {/* Header link cards - REMOVED */}

        {/* Main Content Grid - Simplified to just hold the Bento Grid */}
        {/* The outer grid is removed, NossoMetodoBento will control its own grid display */}
        {/* <NossoMetodoBento /> */ /* Replaced with Timeline */}
        <NossoMetodoTimeline />
      </div>
    </div>
  )
}

// Add a wrapper component with margin bottom to create visual separation
export function AboutUsWithSpacing() {
  return (
    <AboutUs />
  )
}