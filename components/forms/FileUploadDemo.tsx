import React, { useState } from 'react';
import FileUpload from './FileUpload';

const FileUploadDemo: React.FC = () => {
  const [identityFiles, setIdentityFiles] = useState<File[]>([]);
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [mandateFiles, setMandateFiles] = useState<File[]>([]);

  const handleIdentityChange = (newFiles: File[]) => {
    setIdentityFiles(newFiles);
    console.log("Pièce d'identité:", newFiles);
  };

  const handleProofChange = (newFiles: File[]) => {
    setProofFiles(newFiles);
    console.log('Justificatif de domicile:', newFiles);
  };

  const handleMandateChange = (newFiles: File[]) => {
    setMandateFiles(newFiles);
    console.log('Mandat:', newFiles);
  };

  // Calculer le total des fichiers
  const totalFiles =
    identityFiles.length + proofFiles.length + mandateFiles.length;

  return (
    <div className='max-w-4xl mx-auto p-8'>
      <h2 className='text-2xl font-bold text-gray-900 mb-8 text-center'>
        Démonstration des zones de téléchargement
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* Zone 1: Pièce d'identité */}
        <div className='bg-white rounded-lg border border-gray-200 p-4'>
          <div className='flex items-center mb-3'>
            <div className='w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3'>
              1
            </div>
            <span className='font-medium text-gray-900'>
              Pièce d&apos;identité
            </span>
          </div>
          <FileUpload
            onFilesChange={handleIdentityChange}
            maxFiles={2}
            maxSize={5}
            acceptedTypes={['image/*', 'application/pdf']}
            label=''
            description="Carte d'identité, passeport ou permis de conduire"
            required
            customFileName='piece-identite'
          />
        </div>

        {/* Zone 2: Justificatif de domicile */}
        <div className='bg-white rounded-lg border border-gray-200 p-4'>
          <div className='flex items-center mb-3'>
            <div className='w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3'>
              2
            </div>
            <span className='font-medium text-gray-900'>
              Justificatif de domicile
            </span>
            <div className='ml-2 text-yellow-600'>✓</div>
          </div>
          <FileUpload
            onFilesChange={handleProofChange}
            maxFiles={2}
            maxSize={5}
            acceptedTypes={['image/*', 'application/pdf']}
            label=''
            description='Facture EDF, téléphone, assurance, etc.'
            required
            customFileName='justificatif-domicile'
          />
        </div>

        {/* Zone 3: Mandat */}
        <div className='bg-white rounded-lg border border-gray-200 p-4'>
          <div className='flex items-center mb-3'>
            <div className='w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3'>
              3
            </div>
            <span className='font-medium text-gray-900'>Le mandat</span>
          </div>
          <FileUpload
            onFilesChange={handleMandateChange}
            maxFiles={1}
            maxSize={5}
            acceptedTypes={['image/*', 'application/pdf']}
            label=''
            description='Document de mandat signé'
            required
            customFileName='mandat'
          />
        </div>
      </div>

      {/* Résumé des fichiers téléchargés */}
      {totalFiles > 0 && (
        <div className='mt-8 bg-green-50 border border-green-200 rounded-lg p-6'>
          <h3 className='text-lg font-semibold text-green-800 mb-4 flex items-center'>
            <span className='w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2'>
              ✓
            </span>
            Fichiers téléchargés ({totalFiles})
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Pièce d'identité */}
            <div className='bg-white rounded-lg border border-green-200 p-3'>
              <div className='flex items-center mb-2'>
                <div className='w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2'>
                  1
                </div>
                <span className='text-sm font-medium text-gray-900'>
                  Pièce d&apos;identité
                </span>
                <div className='ml-auto'>
                  {identityFiles.length > 0 ? (
                    <span className='text-green-600 text-sm'>
                      ✓ {identityFiles.length} fichier(s)
                    </span>
                  ) : (
                    <span className='text-gray-400 text-sm'>En attente</span>
                  )}
                </div>
              </div>
              {identityFiles.length > 0 && (
                <div className='text-xs text-gray-600'>
                  {identityFiles.map((file, index) => (
                    <div key={index} className='truncate'>
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Justificatif de domicile */}
            <div className='bg-white rounded-lg border border-green-200 p-3'>
              <div className='flex items-center mb-2'>
                <div className='w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2'>
                  2
                </div>
                <span className='text-sm font-medium text-gray-900'>
                  Justificatif de domicile
                </span>
                <div className='ml-auto'>
                  {proofFiles.length > 0 ? (
                    <span className='text-green-600 text-sm'>
                      ✓ {proofFiles.length} fichier(s)
                    </span>
                  ) : (
                    <span className='text-gray-400 text-sm'>En attente</span>
                  )}
                </div>
              </div>
              {proofFiles.length > 0 && (
                <div className='text-xs text-gray-600'>
                  {proofFiles.map((file, index) => (
                    <div key={index} className='truncate'>
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mandat */}
            <div className='bg-white rounded-lg border border-green-200 p-3'>
              <div className='flex items-center mb-2'>
                <div className='w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2'>
                  3
                </div>
                <span className='text-sm font-medium text-gray-900'>
                  Mandat
                </span>
                <div className='ml-auto'>
                  {mandateFiles.length > 0 ? (
                    <span className='text-green-600 text-sm'>
                      ✓ {mandateFiles.length} fichier(s)
                    </span>
                  ) : (
                    <span className='text-gray-400 text-sm'>En attente</span>
                  )}
                </div>
              </div>
              {mandateFiles.length > 0 && (
                <div className='text-xs text-gray-600'>
                  {mandateFiles.map((file, index) => (
                    <div key={index} className='truncate'>
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className='mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6'>
        <h3 className='text-lg font-semibold text-yellow-800 mb-3'>
          💡 Instructions de test
        </h3>
        <ul className='text-sm text-yellow-700 space-y-2'>
          <li>• Glissez-déposez des fichiers dans les zones</li>
          <li>• Ou cliquez pour parcourir vos fichiers</li>
          <li>• Types acceptés : Images (JPG, PNG, etc.) et PDF</li>
          <li>• Taille maximale : 5MB par fichier</li>
          <li>• Maximum 2 fichiers par zone (sauf mandat : 1 fichier)</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUploadDemo;
