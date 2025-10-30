import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const supportedLangs = process.env.NEXT_PUBLIC_SUPPORTED_LANGS?.split(',') ?? ['fr']
const defaultLang = process.env.NEXT_PUBLIC_DEFAULT_LANG ?? 'fr'

/**
 * Middleware intelligent pour la détection automatique de la langue
 * Redirige les utilisateurs vers leur langue de navigateur si disponible
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Ignore les ressources statiques, API et fichiers
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Si la langue est déjà dans l'URL, on laisse passer
  const pathSegments = pathname.split('/').filter(Boolean)
  const currentLang = pathSegments[0]

  if (supportedLangs.includes(currentLang)) {
    return NextResponse.next()
  }

  // Détection automatique de la langue du navigateur
  const acceptLanguage = req.headers.get('accept-language')
  const browserLang = acceptLanguage?.split(',')[0]?.split('-')[0]

  // Utilise la langue du navigateur si supportée, sinon langue par défaut
  const redirectLang = browserLang && supportedLangs.includes(browserLang)
    ? browserLang
    : defaultLang

  // Redirection vers la langue détectée
  const redirectUrl = new URL(`/${redirectLang}${pathname}`, req.url)
  return NextResponse.redirect(redirectUrl)
}

export const config = {
  // Applique le middleware à toutes les routes sauf /api, /_next et les assets
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
