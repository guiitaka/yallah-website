'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

const navigationItems = [
  { label: 'Ofertas', href: '/ofertas' },
  { label: 'Suporte', href: '/suporte' },
  { label: 'Parceiros', href: '/parceiros' },
  { label: 'Reservas', href: '/reservas' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center gap-8">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={twMerge(
              "text-sm font-medium transition-colors hover:text-black relative py-1",
              isActive ? "text-black after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:bg-black" : "text-gray-600"
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
} 