'use client'

import { MagnifyingGlass } from '@phosphor-icons/react'

export default function MobileSearch() {
  return (
    <div className="w-full px-4 py-3 md:hidden">
      <button 
        className="w-full flex items-center gap-2 px-4 py-3 bg-white rounded-full border shadow-sm text-left text-gray-500"
        onClick={() => {/* Implement search modal/page navigation */}}
      >
        <MagnifyingGlass size={20} />
        <span>Para onde você quer ir?</span>
      </button>
    </div>
  )
} 