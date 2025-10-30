/**
 * Configuration i18n pour VanalexCars
 * Centralise la gestion des langues supportées
 */

export const supportedLangs: string[] =
  process.env.NEXT_PUBLIC_SUPPORTED_LANGS?.split(',') ?? ['fr']

export const defaultLang: string =
  process.env.NEXT_PUBLIC_DEFAULT_LANG ?? 'fr'

/**
 * Vérifie si une langue est supportée
 */
export const isLangSupported = (lang: string): boolean => {
  return supportedLangs.includes(lang)
}

/**
 * Retourne la langue ou la langue par défaut si non supportée
 */
export const getSafeLang = (lang?: string): string => {
  if (!lang) return defaultLang
  return isLangSupported(lang) ? lang : defaultLang
}

/**
 * Noms complets des langues pour l'affichage
 */
export const langNames: Record<string, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  it: 'Italiano',
}

/**
 * Retourne le nom complet d'une langue
 */
export const getLangName = (lang: string): string => {
  return langNames[lang] ?? lang.toUpperCase()
}
