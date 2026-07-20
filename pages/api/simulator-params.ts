import type { NextApiRequest, NextApiResponse } from 'next'
import { DEFAULT_SIMULATOR_PARAMS } from '../../lib/importSimulator'

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const r = await fetch(`${BACKEND}/api/globals/simulator-config`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(3000),
    })
    if (r.ok) {
      const data = await r.json()
      // Merge with defaults for any missing fields
      return res.status(200).json({ ...DEFAULT_SIMULATOR_PARAMS, ...data })
    }
  } catch {
    // fallback to defaults
  }

  res.setHeader('Cache-Control', 'public, max-age=3600')
  return res.status(200).json(DEFAULT_SIMULATOR_PARAMS)
}
