/**
 * 🎯 Remove.bg Integration
 *
 * Supprime le fond des images de véhicules via l'API Remove.bg
 * Utilise la clé API Kaleido fournie
 */

import fs from 'fs-extra';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';

const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY || 'YOUR_API_KEY_HERE';
const REMOVE_BG_API_URL = 'https://api.remove.bg/v1.0/removebg';

interface RemoveBgOptions {
  size?: 'auto' | 'preview' | 'full' | 'medium';
  type?: 'auto' | 'product' | 'car';
  format?: 'png' | 'jpg' | 'zip';
  channels?: 'rgba' | 'alpha';
  bg_color?: string; // Couleur d'arrière-plan (ex: "#F3F4F6" pour gris clair)
}

/**
 * Supprime le fond d'une image via Remove.bg API
 */
export async function removeBackground(
  inputPath: string,
  outputPath: string,
  options: RemoveBgOptions = {}
): Promise<void> {
  const {
    size = 'auto',
    type = 'car',
    format = 'png',
    channels = 'rgba',
    bg_color,
  } = options;

  try {
    console.log(`🔄 Remove.bg: ${path.basename(inputPath)}`);
    if (bg_color) {
      console.log(`  🎨 Avec arrière-plan: ${bg_color}`);
    }

    // Vérifier que le fichier existe
    if (!(await fs.pathExists(inputPath))) {
      throw new Error(`Fichier introuvable: ${inputPath}`);
    }

    // Préparer le FormData
    const formData = new FormData();
    formData.append('image_file', fs.createReadStream(inputPath));
    formData.append('size', size);
    formData.append('type', type);
    formData.append('format', format);
    formData.append('channels', channels);

    // Ajouter l'arrière-plan si spécifié
    if (bg_color) {
      formData.append('bg_color', bg_color);
    }

    // Appel API Remove.bg
    const response = await fetch(REMOVE_BG_API_URL, {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Remove.bg API error ${response.status}: ${errorText}`);
    }

    // Récupérer les crédits restants
    const creditsRemaining = response.headers.get('x-ratelimit-remaining');
    console.log(`  💳 Crédits restants: ${creditsRemaining || 'N/A'}`);

    // Sauvegarder l'image sans fond
    const buffer = await response.buffer();
    await fs.writeFile(outputPath, buffer);

    console.log(`✅ Fond supprimé: ${path.basename(outputPath)}`);
  } catch (error: any) {
    console.error(`❌ Erreur Remove.bg pour ${inputPath}:`, error.message);
    throw error;
  }
}

/**
 * Traite un batch d'images avec Remove.bg
 */
export async function removeBgBatch(
  inputDir: string,
  outputDir: string,
  options: RemoveBgOptions = {}
): Promise<string[]> {
  await fs.ensureDir(outputDir);

  // Lister les images
  const files = await fs.readdir(inputDir);
  const imageFiles = files.filter((f) =>
    /\.(jpg|jpeg|png|webp)$/i.test(f)
  );

  console.log(`\n📦 Traitement de ${imageFiles.length} images avec Remove.bg...\n`);

  const processedFiles: string[] = [];

  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(
      outputDir,
      `${path.parse(file).name}-removebg.png`
    );

    try {
      await removeBackground(inputPath, outputPath, options);
      processedFiles.push(outputPath);

      // Délai entre les appels pour respecter le rate limit
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`⚠️  Échec pour ${file}, continué...`);
    }
  }

  console.log(`\n✅ ${processedFiles.length}/${imageFiles.length} images traitées\n`);

  return processedFiles;
}

/**
 * Test de connexion Remove.bg API
 */
export async function testRemoveBgApi(): Promise<boolean> {
  try {
    console.log('🔍 Test de l\'API Remove.bg...');

    const response = await fetch('https://api.remove.bg/v1.0/account', {
      method: 'GET',
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY,
      },
    });

    if (!response.ok) {
      console.error('❌ API Key invalide ou problème de connexion');
      return false;
    }

    const data = await response.json();
    console.log('✅ API Remove.bg fonctionnelle');
    console.log(`  📊 Crédits: ${data.attributes?.credits?.total || 'N/A'}`);
    console.log(`  🎯 API Key: ${REMOVE_BG_API_KEY.substring(0, 10)}...`);

    return true;
  } catch (error: any) {
    console.error('❌ Erreur test API:', error.message);
    return false;
  }
}
