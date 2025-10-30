import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();
  
  // Headers de sécurité supplémentaires
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  
  // Protection contre les attaques par injection
  const url = request.nextUrl;
  if (url.pathname.includes('..') || url.pathname.includes('//')) {
    return new Response('Bad Request', { status: 400 });
  }
  
  // Protection contre les tentatives d'accès aux fichiers sensibles
  if (url.pathname.match(/\.(env|config|log|sql|bak)$/)) {
    return new Response('Forbidden', { status: 403 });
  }
  
  // Rate limiting basique (à améliorer avec Redis en production)
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  console.log(`[${new Date().toISOString()}] ${ip} - ${request.method} ${url.pathname}`);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
