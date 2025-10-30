import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * Proxy API pour les véhicules
 * Résout les problèmes CORS en faisant le pont entre le frontend et le backend Payload
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200'

  try {
    // Construction de l'URL avec les query params
    const queryString = new URLSearchParams(req.query as Record<string, string>).toString()
    const url = `${backendUrl}/api/vehicles${queryString ? `?${queryString}` : ''}`

    console.log('🔄 Proxying request to:', url)
    console.log('📝 Method:', req.method)

    // Préparer les headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // Si authentification présente, la transférer
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization
    }

    // Préparer les options de la requête
    const options: RequestInit = {
      method: req.method,
      headers,
    }

    // Ajouter le body pour POST/PUT/PATCH
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      options.body = JSON.stringify(req.body)
    }

    // Faire la requête au backend
    const response = await fetch(url, options)
    const data = await response.json()

    console.log('✅ Backend response status:', response.status)

    // Retourner la réponse du backend
    return res.status(response.status).json(data)
  } catch (error) {
    console.error('❌ Proxy error:', error)
    return res.status(500).json({
      error: 'Erreur lors de la communication avec le backend',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
