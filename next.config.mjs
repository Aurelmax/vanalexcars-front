import { corsHeaders, securityHeaders } from './security-headers.js';

/** @type {import('next').NextConfig} */
let nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Désactiver ESLint pendant la build pour Railway
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Désactiver la vérification TypeScript pendant la build pour Railway
    ignoreBuildErrors: true,
  },
  webpack: config => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/api/(.*)',
        headers: corsHeaders,
      },
    ];
  },
};

// Note: Payload CMS tourne sur un backend séparé (port 4200)
// Le frontend communique avec lui via NEXT_PUBLIC_API_URL
// Pas besoin d'intégrer Payload directement dans Next.js

export default nextConfig;
