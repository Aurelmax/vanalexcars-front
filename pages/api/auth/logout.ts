/**
 * POST /api/auth/logout
 *
 * Efface le cookie admin_session avec exactement les mêmes attributs
 * Path, Secure et SameSite que lors de sa création.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { buildSetCookieHeader } from '../../../lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // clear = true → Max-Age: 0, value vide, mêmes flags que la création
  res.setHeader('Set-Cookie', buildSetCookieHeader('', true));
  return res.status(200).json({ success: true });
}
