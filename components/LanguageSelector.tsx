'use client'

import { useRouter } from 'next/router'
import { supportedLangs, getLangName } from '@/lib/utils/i18n'
import { ChangeEvent } from 'react'

interface LanguageSelectorProps {
  className?: string
  variant?: 'dropdown' | 'buttons'
}

/**
 * Composant de sélection de langue
 * Utilise le routage i18n natif de Next.js
 */
export default function LanguageSelector({
  className = '',
  variant = 'dropdown',
}: LanguageSelectorProps) {
  const router = useRouter()
  const { locale, pathname, asPath, query } = router

  const handleLanguageChange = (newLocale: string) => {
    // Utilise le routage i18n de Next.js pour changer de langue
    router.push({ pathname, query }, asPath, { locale: newLocale })
  }

  if (variant === 'buttons') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {supportedLangs.map(lang => (
          <button
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              locale === lang
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            aria-label={`Changer la langue en ${getLangName(lang)}`}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
    )
  }

  return (
    <select
      value={locale}
      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
        handleLanguageChange(e.target.value)
      }
      className={`px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      aria-label="Sélectionner une langue"
    >
      {supportedLangs.map(lang => (
        <option key={lang} value={lang}>
          {getLangName(lang)}
        </option>
      ))}
    </select>
  )
}
