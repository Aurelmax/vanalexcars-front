import { NextResponse } from 'next/server'

/**
 * Middleware simplifié
 * L'i18n est géré automatiquement par Next.js via next.config.mjs
 * Ce middleware reste présent pour d'éventuelles futures fonctionnalités
 */
export function middleware() {
  return NextResponse.next()
}

export const config = {
  // N'applique le middleware qu'aux routes admin pour les exclure de l'i18n
  matcher: [],
}
