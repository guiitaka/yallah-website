'use client'

import { useState, useEffect } from 'react'

export function useDevice() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Verificação inicial
    checkDevice()

    // Adiciona listener para mudanças de tamanho da tela
    window.addEventListener('resize', checkDevice)

    // Cleanup
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return { isMobile }
} 