import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, content, status, meta } = req.body;

  if (!title || !content) {
    return res
      .status(400)
      .json({ error: 'Title and content are required' });
  }

  try {
    // Lire les soumissions existantes
    const submissionsPath = path.join(process.cwd(), 'lib', 'submissions.json');
    let submissions = [];

    try {
      const data = fs.readFileSync(submissionsPath, 'utf8');
      submissions = JSON.parse(data);
    } catch (error) {
      // Fichier n'existe pas encore, on commence avec un tableau vide
      submissions = [];
    }

    // Créer une nouvelle soumission
    const newSubmission = {
      id: Date.now(), // ID unique basé sur le timestamp
      title,
      content,
      date: new Date().toISOString(),
      status: status || 'publish',
      form_type: meta?.form_type || 'vehicle_request',
      form_data: meta?.form_data || {},
      submission_date: new Date().toISOString(),
      form_status: 'pending',
    };

    // Ajouter la nouvelle soumission
    submissions.unshift(newSubmission); // Ajouter au début

    // Sauvegarder dans le fichier
    fs.writeFileSync(submissionsPath, JSON.stringify(submissions, null, 2));

    return res.status(200).json({
      success: true,
      data: {
        id: newSubmission.id,
        title: newSubmission.title,
        message: 'Demande de véhicule soumise avec succès',
      },
    });
  } catch (error) {
    console.error('Form submission proxy error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
