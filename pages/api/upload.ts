import formidable from 'formidable';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Créer le dossier uploads s'il n'existe pas
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filter: ({ mimetype }) => {
        return mimetype && mimetype.includes('image');
      },
    });

    const [fields, files] = await form.parse(req);

    const uploadedFiles = Array.isArray(files.files)
      ? files.files
      : [files.files];

    const results = uploadedFiles
      .map(file => {
        if (!file) return null;

        const fileExtension = path.extname(file.originalFilename || '');
        const fileName = `${uuidv4()}${fileExtension}`;
        const newPath = path.join(uploadDir, fileName);

        // Renommer le fichier
        fs.renameSync(file.filepath, newPath);

        return {
          id: uuidv4(),
          filename: fileName,
          originalName: file.originalFilename,
          url: `/uploads/${fileName}`,
          size: file.size,
          mimetype: file.mimetype,
          alt: file.originalFilename?.replace(fileExtension, '') || '',
        };
      })
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      data: results,
      message: `${results.length} fichier(s) uploadé(s) avec succès`,
    });
  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de l'upload des fichiers",
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
