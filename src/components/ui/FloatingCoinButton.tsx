import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { House, Key } from '@phosphor-icons/react'

export default function FloatingCoinButton() {
  const router = useRouter()
  const pathname = usePathname()
  const [isFlipped, setIsFlipped] = useState(false)
  const [userType, setUserType] = useState<'owner' | 'tenant'>('tenant')
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        setIsFlipped(prev => !prev)
      }, 3000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isHovered])

  const handleClick = () => {
    const newUserType = userType === 'owner' ? 'tenant' : 'owner'
    setUserType(newUserType)
    // Verifica se está na versão mobile ou desktop
    const isMobile = pathname.includes('/mobile')
    const basePath = isMobile ? '/mobile' : ''
    router.push(`${basePath}/${newUserType}`)
  }

  return (
    <div className="fixed bottom-[84px] right-6 z-[999] md:bottom-8 md:right-8">
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-20 h-20 md:w-24 md:h-24 perspective group hover:scale-105 transition-transform duration-300"
      >
        <div
          className={`
            absolute inset-0 w-full h-full transition-transform duration-1000
            ${isFlipped ? 'rotate-y-180' : ''}
          `}
          style={{
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Front face - Tenant */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden flex items-center justify-center rounded-full 
                     bg-gradient-to-br from-[#8BADA4] to-[#7A9C93] text-white shadow-[0_8px_32px_rgba(139,173,164,0.4)]
                     group-hover:shadow-[0_12px_40px_rgba(139,173,164,0.5)] transition-shadow duration-300 overflow-hidden"
          >
            <div className="flex flex-col items-center gap-1 px-2">
              <House weight="fill" className="w-6 h-6 md:w-8 md:h-8 drop-shadow-lg" />
              <span className="text-[9px] md:text-xs font-medium drop-shadow-lg text-center leading-tight">
                Quero<br />Alugar
              </span>
            </div>
          </div>

          {/* Back face - Owner */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden flex items-center justify-center rounded-full 
                     bg-gradient-to-br from-[#3E5A54] to-[#2D4640] text-white shadow-[0_8px_32px_rgba(62,90,84,0.4)]
                     group-hover:shadow-[0_12px_40px_rgba(62,90,84,0.5)] transition-shadow duration-300 rotate-y-180 overflow-hidden"
          >
            <div className="flex flex-col items-center gap-1 px-4">
              <Key weight="fill" className="w-6 h-6 md:w-8 md:h-8 drop-shadow-lg" />
              <span className="text-[9px] md:text-xs font-medium drop-shadow-lg text-center leading-tight">
                Sou<br />Proprietário
              </span>
            </div>
          </div>
        </div>
      </button>
    </div>
  )
} 