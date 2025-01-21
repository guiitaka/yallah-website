'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { House, Info, Lightbulb, Headset, Key } from '@phosphor-icons/react'
import { useState } from 'react'

type MobileNavigationProps = {
  userType: 'owner' | 'tenant'
}

export default function MobileNavigation({ userType }: MobileNavigationProps) {
  const router = useRouter()
  const [phase, setPhase] = useState<'idle' | 'fadeIn' | 'fadeOut'>('idle')
  const [isFlipping, setIsFlipping] = useState(false)
  const [targetUserType, setTargetUserType] = useState<'owner' | 'tenant'>(userType)

  const handleUserTypeChange = () => {
    const newUserType = userType === 'owner' ? 'tenant' : 'owner'
    setTargetUserType(newUserType)
    
    // Primeira fase: fade in para verde
    setPhase('fadeIn')
    
    // Após a tela ficar verde, inicia a animação do ícone
    setTimeout(() => {
      setIsFlipping(true)
      
      // Após a animação do ícone, navega e inicia o fade out
      setTimeout(() => {
        setIsFlipping(false)
        localStorage.setItem('userType', newUserType)
        router.push(`/mobile/${newUserType}`)
        setPhase('fadeOut')
        
        // Resetar o estado após a animação completa
        setTimeout(() => {
          setPhase('idle')
        }, 1500)
      }, 2000)
    }, 1500)
  }

  const renderTransitionIcon = () => {
    const iconSize = 64 // Menor que o desktop para se adequar ao mobile
    const FromIcon = userType === 'owner' ? Key : House
    const ToIcon = targetUserType === 'owner' ? Key : House
    
    // Texto correspondente à versão que está sendo carregada
    const transitionText = targetUserType === 'owner' 
      ? 'Maximize o retorno do seu imóvel'
      : 'Encontre o lugar perfeito para sua estadia'
    
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-[64px] h-[64px]">
          {/* Container com flip */}
          <div 
            className={`
              absolute inset-0 transition-all duration-[2000ms] transform
              ${isFlipping ? 'animate-flip-y' : ''}
            `}
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'center center'
            }}
          >
            {/* Primeiro ícone */}
            <div 
              className={`
                absolute inset-0 transition-all duration-[1000ms] backface-hidden
                ${isFlipping ? 'opacity-0' : 'opacity-100'}
              `}
            >
              <FromIcon size={iconSize} weight="fill" className="text-white drop-shadow-lg" />
            </div>

            {/* Segundo ícone */}
            <div 
              className={`
                absolute inset-0 transition-all duration-[1000ms] backface-hidden rotate-y-180
                ${isFlipping ? 'opacity-100' : 'opacity-0'}
              `}
            >
              <ToIcon size={iconSize} weight="fill" className="text-white drop-shadow-lg" />
            </div>
          </div>
        </div>

        {/* Texto com reticências animadas */}
        <div 
          className={`
            text-white text-xl font-montserrat font-extrabold text-center transition-all duration-1000 tracking-tight px-6
            ${isFlipping ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          `}
          style={{
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {transitionText}
          <span className="animate-ellipsis">...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Overlay de transição com duas fases */}
      <div 
        className={`fixed inset-0 z-[9999] transition-all transform duration-[1500ms] ease-in-out
          ${phase === 'idle' ? 'opacity-0 scale-110 pointer-events-none' : ''}
          ${phase === 'fadeIn' ? 'opacity-100 scale-100 bg-[#8BADA4]' : ''}
          ${phase === 'fadeOut' ? 'opacity-0 scale-90 bg-[#8BADA4]' : ''}
        `}
      >
        <div 
          className={`absolute inset-0 transition-opacity duration-[1500ms] ${
            phase === 'fadeIn' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#8BADA4]/20 to-[#8BADA4]/40" />
          
          {/* Ícone central com animação */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="perspective">
              {renderTransitionIcon()}
            </div>
          </div>
        </div>
      </div>

      {/* Menu de navegação mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 md:hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-start justify-between pt-4 h-[72px] mb-[env(safe-area-inset-bottom,20px)]">
            <Link
              href="/mobile/a-yallah"
              className="flex flex-col items-center gap-1"
            >
              <House weight="light" className="w-6 h-6 text-gray-600" />
              <span className="text-[10px] text-gray-600">A Yallah</span>
            </Link>

            <Link
              href="/mobile/como-funciona"
              className="flex flex-col items-center gap-1"
            >
              <Info weight="light" className="w-6 h-6 text-gray-600" />
              <span className="text-[10px] text-gray-600">Como Funciona</span>
            </Link>

            <Link
              href="/mobile/metodo"
              className="flex flex-col items-center gap-1"
            >
              <Lightbulb weight="light" className="w-6 h-6 text-gray-600" />
              <span className="text-[10px] text-gray-600">Método</span>
            </Link>

            <button
              onClick={handleUserTypeChange}
              className="flex flex-col items-center gap-1"
            >
              {userType === 'owner' ? (
                <>
                  <House weight="light" className="w-6 h-6 text-gray-600" />
                  <span className="text-[10px] text-gray-600">Alugar</span>
                </>
              ) : (
                <>
                  <Key weight="light" className="w-6 h-6 text-gray-600" />
                  <span className="text-[10px] text-gray-600">Proprietário</span>
                </>
              )}
            </button>

            <Link
              href="/mobile/contato"
              className="flex flex-col items-center gap-1"
            >
              <Headset weight="light" className="w-6 h-6 text-gray-600" />
              <span className="text-[10px] text-gray-600">Contato</span>
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .perspective {
          perspective: 1000px;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }

        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        @keyframes flip-y {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(1080deg);
          }
        }

        .animate-flip-y {
          animation: flip-y 2s linear infinite;
        }

        @keyframes ellipsis {
          0% { content: ''; }
          25% { content: '.'; }
          50% { content: '..'; }
          75% { content: '...'; }
          100% { content: ''; }
        }

        .animate-ellipsis::after {
          content: '';
          animation: ellipsis 2s steps(4) infinite;
        }
      `}</style>
    </>
  )
} 