import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const submissionsPath = path.join(process.cwd(), 'lib', 'submissions.json');

  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'ID de soumission manquant',
    });
  }

  // GET - Récupérer une soumission spécifique
  if (req.method === 'GET') {
    try {
      let submissions = [];

      if (fs.existsSync(submissionsPath)) {
        const data = fs.readFileSync(submissionsPath, 'utf8');
        submissions = JSON.parse(data);
      }

      const submission = submissions.find(
        (sub: any) => sub.id === parseInt(id as string, 10)
      );

      if (!submission) {
        return res.status(404).json({
          success: false,
          error: 'Soumission non trouvée',
        });
      }

      return res.status(200).json({
        success: true,
        data: submission,
      });
    } catch (error) {
      console.error('Error fetching submission:', error);
      return res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération de la soumission',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // POST - Mettre à jour une soumission (marquer comme lu, etc.)
  if (req.method === 'POST') {
    try {
      let submissions = [];

      if (fs.existsSync(submissionsPath)) {
        const data = fs.readFileSync(submissionsPath, 'utf8');
        submissions = JSON.parse(data);
      }

      const submissionIndex = submissions.findIndex(
        (sub: any) => sub.id === parseInt(id as string, 10)
      );

      if (submissionIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Soumission non trouvée',
        });
      }

      // Mettre à jour le statut
      if (req.body.meta?.form_status) {
        submissions[submissionIndex].form_status = req.body.meta.form_status;
        submissions[submissionIndex].updated_at = new Date().toISOString();

        fs.writeFileSync(
          submissionsPath,
          JSON.stringify(submissions, null, 2)
        );

        return res.status(200).json({
          success: true,
          data: submissions[submissionIndex],
        });
      }

      return res.status(400).json({
        success: false,
        error: 'Données de mise à jour invalides',
      });
    } catch (error) {
      console.error('Error updating submission:', error);
      return res.status(500).json({
        success: false,
        error: 'Erreur lors de la mise à jour de la soumission',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // DELETE - Supprimer une soumission
  if (req.method === 'DELETE') {
    try {
      let submissions = [];

      if (fs.existsSync(submissionsPath)) {
        const data = fs.readFileSync(submissionsPath, 'utf8');
        submissions = JSON.parse(data);
      }

      const submissionIndex = submissions.findIndex(
        (sub: any) => sub.id === parseInt(id as string, 10)
      );

      if (submissionIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Soumission non trouvée',
        });
      }

      // Supprimer la soumission
      submissions.splice(submissionIndex, 1);

      fs.writeFileSync(submissionsPath, JSON.stringify(submissions, null, 2));

      return res.status(200).json({
        success: true,
        message: 'Soumission supprimée avec succès',
      });
    } catch (error) {
      console.error('Error deleting submission:', error);
      return res.status(500).json({
        success: false,
        error: 'Erreur lors de la suppression de la soumission',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
