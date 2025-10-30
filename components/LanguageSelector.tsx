'use client'

import { useRouter } from 'next/router'
import { supportedLangs, getLangName, getLangFlag } from '@/lib/utils/i18n'
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
    // Évite de naviguer si on est déjà sur la bonne langue
    if (locale === newLocale) return

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
            className={`px-3 py-2 rounded-lg text-2xl transition-all duration-300 ${
              locale === lang
                ? 'bg-yellow-400 scale-110 shadow-lg'
                : 'bg-white/10 hover:bg-white/20 hover:scale-105'
            }`}
            aria-label={`Changer la langue en ${getLangName(lang)}`}
            title={getLangName(lang)}
          >
            {getLangFlag(lang)}
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
      className={`px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${className}`}
      aria-label="Sélectionner une langue"
    >
      {supportedLangs.map(lang => (
        <option key={lang} value={lang}>
          {getLangFlag(lang)} {getLangName(lang)}
        </option>
      ))}
    </select>
  )
}
