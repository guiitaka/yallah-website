'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Buildings, House } from '@phosphor-icons/react'

export default function Home() {
  return (
    <main className="fixed inset-0">
      <div className="h-full w-full flex relative">
        {/* Left Side - Property Owner */}
        <Link 
          href="/owner" 
          className="relative w-1/2 h-full group overflow-hidden"
        >
          <Image
            src="/owner-bg.jpg"
            alt="Proprietário"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
            <h2 className="text-5xl font-medium mb-4">Sou Proprietário</h2>
            <p className="text-2xl">Maximize o retorno do seu imóvel</p>
          </div>
        </Link>

        {/* Right Side - Tenant */}
        <Link 
          href="/tenant" 
          className="relative w-1/2 h-full group overflow-hidden"
        >
          <Image
            src="/tenant-bg.jpg"
            alt="Locatário"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
            <h2 className="text-5xl font-medium mb-4">Busco um Imóvel</h2>
            <p className="text-2xl">Encontre o lugar perfeito para sua estadia</p>
          </div>
        </Link>

        {/* Centered Logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] bg-white rounded-full flex items-center justify-center shadow-lg z-20">
          <Image
            src="/logo-yallah-nobg.png"
            alt="Yallah"
            width={200}
            height={200}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </main>
  )
}