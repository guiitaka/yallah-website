import { useState } from 'react'
import Flag from 'react-world-flags'
import { CaretUp } from '@phosphor-icons/react'

type Language = {
  code: string
  name: string
  countryCode: string
}

const languages: Language[] = [
  { code: 'pt', name: 'Português', countryCode: 'BR' },
  { code: 'en', name: 'English', countryCode: 'US' },
  { code: 'es', name: 'Español', countryCode: 'ES' }
]

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLang, setSelectedLang] = useState<Language>(languages[0])

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLang(lang)
    setIsOpen(false)
    // Aqui você pode adicionar a lógica para mudar o idioma da aplicação
  }

  return (
    <>
      {/* Language Dropdown */}
      {isOpen && (
        <div className="fixed bottom-[80px] left-0 right-0 bg-white border-t border-gray-100 shadow-lg transition-all duration-300 ease-in-out">
          <div className="container mx-auto px-4 py-4">
            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className="flex items-center gap-3 w-full py-3 px-4 rounded-lg hover:bg-gray-50 text-sm text-gray-700"
                  onClick={() => handleLanguageSelect(lang)}
                >
                  <div className="w-8 h-6">
                    <Flag code={lang.countryCode} className="h-full w-auto" />
                  </div>
                  <span>{lang.name}</span>
                  {selectedLang.code === lang.code && (
                    <div className="w-2 h-2 rounded-full bg-[#8BADA4] ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Language Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col items-center gap-1"
      >
        <div className="w-8 h-6">
          <Flag code={selectedLang.countryCode} className="h-full w-auto" />
        </div>
        <span className="text-[10px] text-gray-600">{selectedLang.name}</span>
      </button>
    </>
  )
} 