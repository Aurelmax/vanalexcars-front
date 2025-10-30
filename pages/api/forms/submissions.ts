import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const submissionsPath = path.join(process.cwd(), 'lib', 'submissions.json');

  if (req.method === 'GET') {
    try {
      // Lire les soumissions
      let submissions = [];

      try {
        if (fs.existsSync(submissionsPath)) {
          const data = fs.readFileSync(submissionsPath, 'utf8');
          submissions = JSON.parse(data);
        }
      } catch (error) {
        console.error('Error reading submissions:', error);
        submissions = [];
      }

      // Filtrer selon les paramètres de query
      const { meta_key, status, page = '1', per_page = '20' } = req.query;

      let filteredSubmissions = submissions;

      // Filtrer par type de formulaire si spécifié
      if (meta_key === 'form_type' && req.query.form_type) {
        filteredSubmissions = filteredSubmissions.filter(
          (sub: any) => sub.form_type === req.query.form_type
        );
      }

      // Filtrer par statut si spécifié
      if (status) {
        filteredSubmissions = filteredSubmissions.filter(
          (sub: any) => sub.form_status === status
        );
      }

      // Pagination
      const pageNum = parseInt(page as string, 10);
      const perPageNum = parseInt(per_page as string, 10);
      const start = (pageNum - 1) * perPageNum;
      const end = start + perPageNum;
      const paginatedSubmissions = filteredSubmissions.slice(start, end);

      return res.status(200).json({
        success: true,
        data: paginatedSubmissions,
        pagination: {
          page: pageNum,
          per_page: perPageNum,
          total: filteredSubmissions.length,
          total_pages: Math.ceil(filteredSubmissions.length / perPageNum),
        },
      });
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des soumissions',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // GET pour une soumission spécifique
  if (req.method === 'POST') {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID de soumission manquant',
        });
      }

      // Lire les soumissions
      let submissions = [];

      try {
        if (fs.existsSync(submissionsPath)) {
          const data = fs.readFileSync(submissionsPath, 'utf8');
          submissions = JSON.parse(data);
        }
      } catch (error) {
        console.error('Error reading submissions:', error);
        return res.status(404).json({
          success: false,
          error: 'Soumissions non trouvées',
        });
      }

      // Trouver et mettre à jour la soumission
      const submissionIndex = submissions.findIndex(
        (sub: any) => sub.id === parseInt(id as string, 10)
      );

      if (submissionIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Soumission non trouvée',
        });
      }

      // Mettre à jour le statut (marquer comme lu)
      if (req.body.meta?.form_status) {
        submissions[submissionIndex].form_status = req.body.meta.form_status;

        // Sauvegarder dans le fichier
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

  return res.status(405).json({ error: 'Method not allowed' });
}
