import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import FileUploadDemo from '../components/forms/FileUploadDemo';

const FileUploadTest: React.FC = () => {
  return (
    <>
      <Head>
        <title>Test des zones de téléchargement - Vanalexcars</title>
        <meta name="description" content="Test des composants de téléchargement de fichiers" />
      </Head>
      
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FileUploadDemo />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default FileUploadTest;
