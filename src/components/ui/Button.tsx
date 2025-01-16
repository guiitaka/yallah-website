'use client'

import React from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  children: React.ReactNode
}

export function Button({ 
  variant = 'ghost', 
  className = '', 
  children, 
  ...props 
}: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded-full transition-colors text-sm font-medium"
  
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800",
    outline: "border border-gray-300 text-gray-900 hover:bg-gray-50",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
  }

  return (
    <button 
      className={twMerge(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  )
} 