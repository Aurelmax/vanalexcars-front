import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  console.log(`Deleting image with ID: ${id}`);

  if (req.method === 'DELETE') {
    try {
      // Pour l'instant, simuler la suppression
      // TODO: Implémenter la vraie suppression dans le stockage

      // Simuler un délai de suppression
      await new Promise(resolve => setTimeout(resolve, 500));

      res
        .status(200)
        .json({ success: true, message: 'Image supprimée avec succès' });
    } catch (error) {
      console.error('Erreur API images DELETE:', error);
      res
        .status(500)
        .json({ error: "Erreur lors de la suppression de l'image" });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}
