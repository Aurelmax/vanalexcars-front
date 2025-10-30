import React, { useRef, useState } from 'react';
import { useSecurity } from '../../lib/hooks/useSecurity';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // en MB
  acceptedTypes?: string[];
  label?: string;
  description?: string;
  required?: boolean;
  customFileName?: string; // Nom personnalisé pour le fichier
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  maxFiles = 5,
  maxSize = 10, // 10MB par défaut
  acceptedTypes = ['image/*', 'application/pdf'],
  label = 'Télécharger des fichiers',
  description,
  required = false,
  customFileName,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hook de sécurité
  const {
    logFileUpload,
    logFileValidation,
    logSecurityError,
    logSecuritySuccess,
    detectSuspiciousActivity,
  } = useSecurity();

  // Types MIME autorisés (sécurité renforcée)
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
  ];

  // Extensions autorisées
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'];

  // Extensions dangereuses à bloquer
  const dangerousExtensions = [
    '.exe',
    '.bat',
    '.cmd',
    '.scr',
    '.pif',
    '.com',
    '.vbs',
    '.js',
    '.jar',
    '.php',
    '.asp',
    '.jsp',
    '.sh',
    '.ps1',
    '.py',
    '.rb',
    '.pl',
  ];

  // Validation de sécurité des fichiers
  const validateFileSecurity = (
    file: File
  ): { valid: boolean; error?: string } => {
    // 1. Vérifier le type MIME
    if (!allowedMimeTypes.includes(file.type)) {
      return { valid: false, error: 'Type de fichier non autorisé' };
    }

    // 2. Vérifier l'extension
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      return { valid: false, error: 'Extension de fichier non autorisée' };
    }

    // 3. Vérifier les extensions dangereuses
    if (dangerousExtensions.includes(extension)) {
      return { valid: false, error: 'Type de fichier dangereux détecté' };
    }

    // 4. Vérifier la taille
    if (file.size > maxSize * 1024 * 1024) {
      return {
        valid: false,
        error: `Fichier trop volumineux (max ${maxSize}MB)`,
      };
    }

    // 5. Vérifier la taille minimale (fichiers suspects)
    if (file.size < 100) {
      return {
        valid: false,
        error: 'Fichier trop petit (possiblement corrompu)',
      };
    }

    // 6. Vérifier le nom du fichier
    if (file.name.length > 255) {
      return { valid: false, error: 'Nom de fichier trop long' };
    }

    // 7. Vérifier les caractères spéciaux dans le nom
    if (/[<>:"|?*]/.test(file.name)) {
      return {
        valid: false,
        error: 'Nom de fichier contient des caractères interdits',
      };
    }

    return { valid: true };
  };

  // Validation du contenu du fichier (magic numbers)
  const validateFileContent = (file: File): Promise<boolean> => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        const content = e.target?.result as ArrayBuffer;
        const bytes = new Uint8Array(content.slice(0, 10));

        // Magic numbers pour les types autorisés
        const magicNumbers = {
          'image/jpeg': [0xff, 0xd8, 0xff],
          'image/png': [0x89, 0x50, 0x4e, 0x47],
          'image/gif': [0x47, 0x49, 0x46],
          'image/webp': [0x52, 0x49, 0x46, 0x46],
          'application/pdf': [0x25, 0x50, 0x44, 0x46],
        };

        const expectedMagic =
          magicNumbers[file.type as keyof typeof magicNumbers];
        if (!expectedMagic) {
          resolve(false);
          return;
        }

        const isValid = expectedMagic.every(
          (byte, index) => bytes[index] === byte
        );
        resolve(isValid);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  // Fonction pour renommer automatiquement les fichiers
  const renameFile = (file: File, customName?: string): File => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const extension = file.name.split('.').pop() || '';

    // Nom par défaut basé sur le type de fichier
    let baseName = customName || 'document';

    // Détecter le type de document basé sur le nom ou le type MIME
    if (file.type.startsWith('image/')) {
      baseName = 'image';
    } else if (file.type === 'application/pdf') {
      baseName = 'document';
    } else if (
      file.name.toLowerCase().includes('carte') ||
      file.name.toLowerCase().includes('identite')
    ) {
      baseName = 'piece-identite';
    } else if (
      file.name.toLowerCase().includes('facture') ||
      file.name.toLowerCase().includes('edf')
    ) {
      baseName = 'justificatif-domicile';
    } else if (file.name.toLowerCase().includes('mandat')) {
      baseName = 'mandat';
    }

    const newName = `${baseName}_${timestamp}.${extension}`;

    // Créer un nouveau fichier avec le nom renommé
    return new File([file], newName, {
      type: file.type,
      lastModified: file.lastModified,
    });
  };

  const validateFile = (file: File): string | null => {
    // Vérifier la taille
    if (file.size > maxSize * 1024 * 1024) {
      return `Le fichier ${file.name} dépasse la taille maximale de ${maxSize}MB`;
    }

    // Vérifier le type
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isValidType) {
      return `Le fichier ${file.name} n'est pas d'un type accepté`;
    }

    return null;
  };

  const handleFiles = async (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const newErrors: string[] = [];
    const validFiles: File[] = [];

    // Vérifier le nombre maximum de fichiers
    if (files.length + fileArray.length > maxFiles) {
      newErrors.push(`Maximum ${maxFiles} fichiers autorisés`);
      setErrors(newErrors);
      return;
    }

    // Activer l'indicateur de scan
    setIsScanning(true);

    // Valider chaque fichier avec sécurité renforcée
    for (const file of fileArray) {
      try {
        // Logger l'upload
        logFileUpload(file.name, file.size, file.type);

        // Détecter l'activité suspecte
        const isSuspicious = detectSuspiciousActivity(
          file.name,
          file.size,
          file.type
        );
        if (isSuspicious) {
          newErrors.push(`🚨 Fichier suspect détecté: ${file.name}`);
          continue;
        }

        // 1. Validation de sécurité
        const securityCheck = validateFileSecurity(file);
        if (!securityCheck.valid) {
          logSecurityError(securityCheck.error!, {
            filename: file.name,
            size: file.size,
            type: file.type,
          });
          newErrors.push(`🚨 ${securityCheck.error}`);
          continue;
        }

        // 2. Validation du contenu
        const contentValid = await validateFileContent(file);
        if (!contentValid) {
          logSecurityError('Fichier corrompu ou falsifié', {
            filename: file.name,
            size: file.size,
            type: file.type,
          });
          newErrors.push(
            `🚨 Le fichier ${file.name} semble corrompu ou falsifié`
          );
          continue;
        }

        // 3. Validation classique
        const error = validateFile(file);
        if (error) {
          logFileValidation(file.name, false, error);
          newErrors.push(error);
          continue;
        }

        // 4. Renommer automatiquement le fichier
        const renamedFile = renameFile(file, customFileName);
        validFiles.push(renamedFile);

        // 5. Logger la validation réussie
        logFileValidation(renamedFile.name, true);
        logSecuritySuccess(
          `Fichier validé avec succès: ${file.name} -> ${renamedFile.name}`
        );
      } catch (error) {
        console.error(
          `❌ Erreur lors de la validation de ${file.name}:`,
          error
        );
        logSecurityError(`Erreur de validation: ${error}`, {
          filename: file.name,
          error: error instanceof Error ? error.message : String(error),
        });
        newErrors.push(`🚨 Erreur lors de la validation de ${file.name}`);
      }
    }

    // Désactiver l'indicateur de scan
    setIsScanning(false);

    if (newErrors.length > 0) {
      setErrors(newErrors);
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
      setErrors([]);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File): string => {
    if (file.type.startsWith('image/')) return '🖼️';
    if (file.type === 'application/pdf') return '📄';
    if (file.type.includes('word')) return '📝';
    if (file.type.includes('excel') || file.type.includes('spreadsheet'))
      return '📊';
    return '📎';
  };

  return (
    <div className='w-full'>
      {label && (
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}

      {description && (
        <p className='text-sm text-gray-600 mb-3'>{description}</p>
      )}

      {/* Zone de téléchargement */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          dragActive
            ? 'border-yellow-400 bg-yellow-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type='file'
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
        />

        <div className='space-y-2'>
          {isScanning ? (
            <>
              <div className='text-2xl animate-spin'>🔍</div>
              <div className='text-sm font-medium text-blue-900'>
                🔒 Analyse de sécurité en cours...
              </div>
              <div className='text-xs text-blue-600'>
                Validation des fichiers pour votre sécurité
              </div>
            </>
          ) : (
            <>
              <div className='text-2xl'>📎</div>
              <div className='text-sm font-medium text-gray-900'>
                Glissez-déposez vos fichiers ici
              </div>
              <div className='text-xs text-gray-600'>
                ou{' '}
                <button
                  type='button'
                  onClick={() => fileInputRef.current?.click()}
                  className='text-yellow-600 hover:text-yellow-500 font-medium'
                >
                  cliquez pour parcourir
                </button>
              </div>
              <div className='text-xs text-gray-500'>
                Max {maxSize}MB par fichier • Types autorisés: JPG, PNG, PDF
              </div>
            </>
          )}
        </div>
      </div>

      {/* Liste des fichiers */}
      {files.length > 0 && (
        <div className='mt-3 space-y-2'>
          <div className='text-xs text-gray-600'>
            Fichiers sélectionnés ({files.length}/{maxFiles})
          </div>
          {files.map((file, index) => (
            <div
              key={index}
              className='flex items-center justify-between bg-gray-50 rounded-lg p-2'
            >
              <div className='flex items-center space-x-2'>
                <span className='text-sm'>{getFileIcon(file)}</span>
                <div className='min-w-0 flex-1'>
                  <div className='text-xs font-medium text-gray-900 truncate'>
                    {file.name}
                  </div>
                  <div className='text-xs text-gray-500'>
                    {formatFileSize(file.size)}
                  </div>
                </div>
              </div>
              <button
                type='button'
                onClick={() => removeFile(index)}
                className='text-red-500 hover:text-red-700 p-1 text-xs'
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Messages d'erreur */}
      {errors.length > 0 && (
        <div className='mt-4 space-y-1'>
          {errors.map((error, index) => (
            <div key={index} className='text-sm text-red-600'>
              {error}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
