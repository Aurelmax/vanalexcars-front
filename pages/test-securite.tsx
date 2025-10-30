import Head from 'next/head';
import React, { useState } from 'react';
import SecurityAlert from '../components/SecurityAlert';
import SecurityMonitor from '../components/SecurityMonitor';
import FileUpload from '../components/forms/FileUpload';
import { useSecurity } from '../lib/hooks/useSecurity';

const TestSecurite: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<
    'success' | 'warning' | 'error' | 'info'
  >('info');
  const [alertMessage, setAlertMessage] = useState('');

  const {
    events,
    stats,
    clearEvents,
    startMonitoring,
    stopMonitoring,
    isMonitoring,
  } = useSecurity();

  const handleFilesChange = (files: File[]) => {
    setUploadedFiles(files);

    if (files.length > 0) {
      setAlertType('success');
      setAlertMessage(`${files.length} fichier(s) validé(s) avec succès`);
    } else {
      setAlertType('info');
      setAlertMessage('Aucun fichier sélectionné');
    }

    setShowAlert(true);
  };

  const handleSecurityTest = (testType: string) => {
    switch (testType) {
      case 'suspicious':
        setAlertType('error');
        setAlertMessage(
          "Test de fichier suspect - Simulation d'un fichier .exe"
        );
        break;
      case 'large':
        setAlertType('warning');
        setAlertMessage(
          "Test de fichier volumineux - Simulation d'un fichier > 50MB"
        );
        break;
      case 'corrupted':
        setAlertType('error');
        setAlertMessage(
          "Test de fichier corrompu - Simulation d'un fichier falsifié"
        );
        break;
      default:
        setAlertType('info');
        setAlertMessage('Test de sécurité effectué');
    }
    setShowAlert(true);
  };

  return (
    <>
      <Head>
        <title>Test de Sécurité - Vanalexcars</title>
        <meta
          name='description'
          content='Page de test des fonctionnalités de sécurité'
        />
      </Head>

      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>
              🔒 Test de Sécurité des Téléchargements
            </h1>
            <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
              Cette page permet de tester les fonctionnalités de sécurité
              avancées pour la protection des téléchargements de fichiers.
            </p>
          </div>

          {/* Alertes de sécurité */}
          {showAlert && (
            <SecurityAlert
              type={alertType}
              message={alertMessage}
              onClose={() => setShowAlert(false)}
              autoClose={true}
              duration={5000}
            />
          )}

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Zone de test d'upload */}
            <div className='space-y-6'>
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                  📤 Test d&apos;Upload Sécurisé
                </h2>

                <FileUpload
                  onFilesChange={handleFilesChange}
                  maxFiles={3}
                  maxSize={5}
                  acceptedTypes={['image/*', 'application/pdf']}
                  label='Télécharger des fichiers de test'
                  description='Testez la sécurité avec différents types de fichiers'
                  customFileName='test-securite'
                />

                {uploadedFiles.length > 0 && (
                  <div className='mt-4 p-4 bg-green-50 border border-green-200 rounded-lg'>
                    <h3 className='text-sm font-medium text-green-800 mb-2'>
                      ✅ Fichiers validés ({uploadedFiles.length})
                    </h3>
                    <div className='space-y-1'>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className='text-sm text-green-700'>
                          • {file.name} ({(file.size / 1024 / 1024).toFixed(2)}
                          MB)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tests de sécurité */}
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                  🧪 Tests de Sécurité
                </h2>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  <button
                    onClick={() => handleSecurityTest('suspicious')}
                    className='px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm'
                  >
                    🚨 Test Fichier Suspect
                  </button>

                  <button
                    onClick={() => handleSecurityTest('large')}
                    className='px-4 py-2 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors text-sm'
                  >
                    ⚠️ Test Fichier Volumineux
                  </button>

                  <button
                    onClick={() => handleSecurityTest('corrupted')}
                    className='px-4 py-2 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors text-sm'
                  >
                    🔍 Test Fichier Corrompu
                  </button>

                  <button
                    onClick={() => handleSecurityTest('normal')}
                    className='px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm'
                  >
                    ✅ Test Normal
                  </button>
                </div>
              </div>

              {/* Contrôles de monitoring */}
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                  🎛️ Contrôles de Monitoring
                </h2>

                <div className='flex items-center space-x-4'>
                  <button
                    onClick={startMonitoring}
                    disabled={isMonitoring}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isMonitoring
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    ▶️ Démarrer Monitoring
                  </button>

                  <button
                    onClick={stopMonitoring}
                    disabled={!isMonitoring}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      !isMonitoring
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    ⏹️ Arrêter Monitoring
                  </button>

                  <button
                    onClick={clearEvents}
                    className='px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm'
                  >
                    🗑️ Effacer Événements
                  </button>
                </div>

                <div className='mt-4 text-sm text-gray-600'>
                  Statut: {isMonitoring ? '🟢 Actif' : '🔴 Inactif'}
                </div>
              </div>
            </div>

            {/* Monitoring de sécurité */}
            <div className='space-y-6'>
              <SecurityMonitor
                events={events}
                onClearEvents={clearEvents}
                showDetails={true}
              />

              {/* Statistiques */}
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                  📊 Statistiques de Sécurité
                </h2>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='text-center p-3 bg-blue-50 rounded-lg'>
                    <div className='text-2xl font-bold text-blue-600'>
                      {stats.totalEvents}
                    </div>
                    <div className='text-sm text-blue-600'>
                      Total Événements
                    </div>
                  </div>

                  <div className='text-center p-3 bg-green-50 rounded-lg'>
                    <div className='text-2xl font-bold text-green-600'>
                      {stats.uploads}
                    </div>
                    <div className='text-sm text-green-600'>Uploads</div>
                  </div>

                  <div className='text-center p-3 bg-yellow-50 rounded-lg'>
                    <div className='text-2xl font-bold text-yellow-600'>
                      {stats.validations}
                    </div>
                    <div className='text-sm text-yellow-600'>Validations</div>
                  </div>

                  <div className='text-center p-3 bg-red-50 rounded-lg'>
                    <div className='text-2xl font-bold text-red-600'>
                      {stats.errors}
                    </div>
                    <div className='text-sm text-red-600'>Erreurs</div>
                  </div>
                </div>
              </div>

              {/* Informations de sécurité */}
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                  ℹ️ Informations de Sécurité
                </h2>

                <div className='space-y-3 text-sm text-gray-600'>
                  <div className='flex items-start space-x-2'>
                    <span className='text-green-500'>✅</span>
                    <span>Types autorisés: JPG, PNG, GIF, WebP, PDF</span>
                  </div>

                  <div className='flex items-start space-x-2'>
                    <span className='text-red-500'>🚫</span>
                    <span>
                      Extensions bloquées: .exe, .bat, .cmd, .scr, .pif, .com,
                      .vbs, .js, .jar, .php, .asp, .jsp, .sh, .ps1, .py, .rb,
                      .pl, .sql
                    </span>
                  </div>

                  <div className='flex items-start space-x-2'>
                    <span className='text-blue-500'>📏</span>
                    <span>Taille maximale: 5MB par fichier</span>
                  </div>

                  <div className='flex items-start space-x-2'>
                    <span className='text-purple-500'>🔍</span>
                    <span>Validation du contenu (magic numbers)</span>
                  </div>

                  <div className='flex items-start space-x-2'>
                    <span className='text-orange-500'>🛡️</span>
                    <span>Rate limiting: 10 requêtes/heure par IP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestSecurite;
