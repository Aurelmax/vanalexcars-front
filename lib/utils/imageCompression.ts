/**
 * Utilitaires pour la compression et l'optimisation d'images
 */

export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeMB?: number;
}

/**
 * Compresse une image en utilisant le canvas HTML5
 * @param file - Fichier image à compresser
 * @param options - Options de compression
 * @returns Promise<File> - Fichier image compressé
 */
export async function compressImage(
  file: File,
  options: ImageCompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.85,
    maxSizeMB = 2,
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Calculer les nouvelles dimensions tout en préservant le ratio
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        // Créer un canvas pour redimensionner
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir en blob avec compression
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }

            // Vérifier la taille
            const sizeMB = blob.size / (1024 * 1024);

            if (sizeMB > maxSizeMB) {
              // Si toujours trop grand, réduire la qualité
              const newQuality = quality * (maxSizeMB / sizeMB);
              canvas.toBlob(
                (finalBlob) => {
                  if (!finalBlob) {
                    reject(new Error('Failed to compress image'));
                    return;
                  }

                  const compressedFile = new File([finalBlob], file.name, {
                    type: file.type,
                    lastModified: Date.now(),
                  });

                  resolve(compressedFile);
                },
                file.type,
                newQuality
              );
            } else {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });

              resolve(compressedFile);
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Compresse plusieurs images
 * @param files - Tableau de fichiers images
 * @param options - Options de compression
 * @param onProgress - Callback de progression (optionnel)
 * @returns Promise<File[]> - Tableau de fichiers compressés
 */
export async function compressImages(
  files: File[],
  options: ImageCompressionOptions = {},
  onProgress?: (progress: number) => void
): Promise<File[]> {
  const compressed: File[] = [];
  let completed = 0;

  for (const file of files) {
    // Vérifier si c'est une image
    if (!file.type.startsWith('image/')) {
      compressed.push(file);
      continue;
    }

    try {
      const compressedFile = await compressImage(file, options);
      compressed.push(compressedFile);

      completed++;
      if (onProgress) {
        onProgress((completed / files.length) * 100);
      }
    } catch (error) {
      console.error(`Error compressing ${file.name}:`, error);
      // En cas d'erreur, utiliser le fichier original
      compressed.push(file);
    }
  }

  return compressed;
}

/**
 * Génère une miniature d'une image
 * @param file - Fichier image
 * @param width - Largeur de la miniature
 * @param height - Hauteur de la miniature
 * @returns Promise<string> - Data URL de la miniature
 */
export function generateThumbnail(
  file: File,
  width: number = 200,
  height: number = 150
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Calculer le crop pour remplir le canvas
        const aspectRatio = img.width / img.height;
        const targetRatio = width / height;

        let sourceWidth = img.width;
        let sourceHeight = img.height;
        let sourceX = 0;
        let sourceY = 0;

        if (aspectRatio > targetRatio) {
          // Image plus large que le ratio cible
          sourceWidth = img.height * targetRatio;
          sourceX = (img.width - sourceWidth) / 2;
        } else {
          // Image plus haute que le ratio cible
          sourceHeight = img.width / targetRatio;
          sourceY = (img.height - sourceHeight) / 2;
        }

        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          width,
          height
        );

        resolve(canvas.toDataURL(file.type, 0.8));
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Formate la taille d'un fichier pour affichage
 * @param bytes - Taille en bytes
 * @returns string - Taille formatée (ex: "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
