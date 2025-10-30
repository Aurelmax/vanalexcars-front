import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import FormSelector from '../components/forms/FormSelector';

const FormsDemo: React.FC = () => {
  return (
    <>
      <Head>
        <title>Formulaires - Vanalexcars</title>
        <meta name="description" content="Découvrez tous nos formulaires de contact et de demande" />
      </Head>
      
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Formulaires Vanalexcars
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choisissez le formulaire qui correspond à votre besoin. 
                Tous nos formulaires sont sécurisés et vos données sont protégées.
              </p>
            </div>

            <FormSelector />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default FormsDemo;
