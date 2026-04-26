/**
 * API Route: Process Vehicle Images
 *
 * Pipeline complet:
 * 1. Télécharge les images depuis imageUrls
 * 2. Remove.bg pour supprimer le fond
 * 3. Applique le fond studio VanalexCars
 * 4. Génère les 4 variantes (hero, card, thumbnail, social)
 * 5. Upload vers Payload Media
 * 6. Retourne les URLs des images traitées
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs-extra';
import { removeBackground } from '../../lib/image-processing/removeBg';
import { processVehicleImageSimple } from '../../lib/image-processing/applyStudioBackground';
import { uploadToPayloadMedia } from '../../lib/services/payloadMediaUpload';

interface ProcessImagesRequest {
  vehicleId: string;
  imageUrls: string[];
  vehicleInfo?: {
    title?: string;
    brand?: string;
    model?: string;
    year?: number;
    price?: number;
    reference?: string;
  };
}

interface ProcessImagesResponse {
  success: boolean;
  message?: string;
  error?: string;
  processedImages?: {
    hero?: string;
    card?: string;
    thumbnail?: string;
    social?: string;
  };
  uploadErrors?: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProcessImagesResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { vehicleId, imageUrls, vehicleInfo } = req.body as ProcessImagesRequest;

    if (!vehicleId || !imageUrls || imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'vehicleId and imageUrls are required',
      });
    }

    console.log(`🎨 Processing images for vehicle ${vehicleId}...`);

    // Créer les dossiers temporaires
    const tmpDir = path.join(process.cwd(), 'tmp', vehicleId);
    const rawDir = path.join(tmpDir, 'raw');
    const removeBgDir = path.join(tmpDir, 'removebg');
    const finalDir = path.join(tmpDir, 'final');

    await fs.ensureDir(rawDir);
    await fs.ensureDir(removeBgDir);
    await fs.ensureDir(finalDir);

    // ÉTAPE 1: Télécharger la première image (image principale)
    console.log('📥 Downloading first image...');
    const firstImageUrl = imageUrls[0];
    const imageResponse = await fetch(firstImageUrl);

    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const rawImagePath = path.join(rawDir, 'vehicle-1.jpg');
    await fs.writeFile(rawImagePath, Buffer.from(imageBuffer));

    // ÉTAPE 2: Remove.bg avec fond studio gris clair
    console.log('🔄 Removing background and applying studio background...');
    const removeBgPath = path.join(removeBgDir, 'vehicle-1-studio.png');

    try {
      await removeBackground(rawImagePath, removeBgPath, {
        type: 'car',
        size: 'auto',
        bg_color: '#9CA3AF', // Fond studio gris moyen (Tailwind gray-400)
      });
      console.log('✅ Remove.bg avec fond studio appliqué');
    } catch (error) {
      console.error('❌ Remove.bg failed:', error);
      throw new Error('Background removal failed. Check API key and credits.');
    }

    // ÉTAPE 3: Ajouter watermark + texte overlay + générer variantes
    console.log('🎨 Adding watermark and generating variants...');
    const variants = await processVehicleImageSimple(
      removeBgPath,
      finalDir,
      vehicleInfo
    );

    // ÉTAPE 4: Upload vers Payload Media
    console.log('📤 Uploading to Payload Media...');
    const altBase = vehicleInfo?.title || `Vehicle ${vehicleId}`;
    const variantEntries: Array<{ key: string; fileName: string; label: string }> = [
      { key: 'hero', fileName: variants.hero, label: 'Hero' },
      { key: 'card', fileName: variants.card, label: 'Card' },
      { key: 'thumbnail', fileName: variants.thumbnail, label: 'Thumbnail' },
      { key: 'social', fileName: variants.social, label: 'Social' },
    ];

    const processedImages: Record<string, string> = {};
    const uploadErrors: string[] = [];

    for (const variant of variantEntries) {
      const filePath = path.join(finalDir, variant.fileName);
      try {
        const doc = await uploadToPayloadMedia(filePath, `${altBase} - ${variant.label}`);
        processedImages[variant.key] = doc.url;
        console.log(`  ✅ ${variant.label}: ${doc.url}`);
      } catch (err: any) {
        console.error(`  ❌ ${variant.label} upload failed:`, err.message);
        uploadErrors.push(`${variant.label}: ${err.message}`);
      }
    }

    // ÉTAPE 5: Mettre à jour le véhicule avec les URLs permanentes
    if (Object.keys(processedImages).length > 0) {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';
      try {
        await fetch(`${backendUrl}/api/vehicles/${vehicleId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ processedImages }),
        });
        console.log('✅ Vehicle record updated with permanent URLs');
      } catch (err: any) {
        console.error('❌ Failed to update vehicle:', err.message);
        uploadErrors.push(`Vehicle update: ${err.message}`);
      }
    }

    // ÉTAPE 6: Nettoyer les fichiers temporaires
    try {
      await fs.remove(tmpDir);
      console.log('🧹 Temporary files cleaned up');
    } catch (err: any) {
      console.warn('⚠️ Failed to clean tmp dir:', err.message);
    }

    console.log('✅ Image processing completed successfully!');

    return res.status(200).json({
      success: true,
      message: uploadErrors.length > 0
        ? `Images traitées avec ${uploadErrors.length} erreur(s) d'upload`
        : 'Images traitées et uploadées avec succès',
      processedImages: processedImages as any,
      uploadErrors: uploadErrors.length > 0 ? uploadErrors : undefined,
    });
  } catch (error: any) {
    console.error('❌ Error processing images:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}

// Configuration Next.js pour augmenter la limite de taille
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
    responseLimit: false,
  },
};
