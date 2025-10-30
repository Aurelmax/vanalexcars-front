import Head from 'next/head';
import React from 'react';
import PayloadTest from '../components/PayloadTest';

const TestPayloadPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Test Payload CMS - Vanalexcars</title>
        <meta name='description' content="Test de l'intégration Payload CMS" />
      </Head>

      <div className='min-h-screen bg-gray-50'>
        <header className='bg-white shadow'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
            <h1 className='text-3xl font-bold text-gray-900'>
              Test Payload CMS
            </h1>
            <p className='mt-2 text-gray-600'>
              Test de l&apos;intégration Payload CMS pour la gestion des
              véhicules
            </p>
          </div>
        </header>

        <main>
          <PayloadTest />
        </main>

        {/* Footer fourni globalement par le composant Layout */}
      </div>
    </>
  );
};

export default TestPayloadPage;
