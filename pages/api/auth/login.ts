import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Authentification simple pour la démo
  // En production, vous devriez utiliser une vraie base de données
  if (email === 'admin@vanalexcars.fr' && password === 'admin123') {
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    
    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: 1,
          name: 'Administrateur',
          email: email,
        },
      },
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Identifiants invalides',
  });
}
