import type { NextApiRequest, NextApiResponse } from 'next';

// Simple redirect handler: avoid importing @payloadcms/next here to prevent
// module export conflicts. The admin UI is served at /admin when withPayload is
// integrated in next.config.js; otherwise this will redirect to the standalone
// Payload server defined by PAYLOAD_PUBLIC_SERVER_URL.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const payloadUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || '';

  // If a standalone URL is configured, redirect there; otherwise redirect to
  // the Next.js admin route which `withPayload` should serve when enabled.
  if (payloadUrl) {
    // Keep path if request was for API vs admin
    if ((req.url || '').startsWith('/api')) {
      return res.redirect(
        payloadUrl.replace(/\/$/, '') + (req.url === '/api' ? '/api' : req.url)
      );
    }
    return res.redirect(payloadUrl.replace(/\/$/, '') + '/admin');
  }

  return res.redirect('/admin');
}
