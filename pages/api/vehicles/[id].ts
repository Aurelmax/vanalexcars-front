import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * Proxy API pour les opérations sur un véhicule spécifique (GET, PATCH, DELETE)
 * Route: /api/vehicles/:id
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200'

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID du véhicule requis' })
  }

  try {
    const url = `${backendUrl}/api/vehicles/${id}`

    console.log(`🔄 [${req.method}] Proxying to:`, url)

    // Préparer les headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // Transférer l'authentification si présente
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization
    }

    // Préparer les options
    const options: RequestInit = {
      method: req.method,
      headers,
    }

    // Ajouter le body pour PATCH/PUT
    if (req.method === 'PATCH' || req.method === 'PUT') {
      options.body = JSON.stringify(req.body)
    }

    // Faire la requête au backend
    const response = await fetch(url, options)
    const data = await response.json()

    console.log(`✅ Backend response [${req.method}]:`, response.status)

    // Retourner la réponse
    return res.status(response.status).json(data)
  } catch (error) {
    console.error('❌ Proxy error:', error)
    return res.status(500).json({
      error: 'Erreur lors de la communication avec le backend',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
