import type { AppProps } from 'next/app';
import React from 'react';
import Script from 'next/script';
import Layout from '../components/Layout';
import { validateConfig } from '../config/api';
import { AppProvider } from '../context/AppContext';
import '../globals.css';
import { AuthProvider } from '../hooks/useAuth';

// Validation de la configuration au démarrage
if (typeof window !== 'undefined') {
  const configValidation = validateConfig();
  if (!configValidation.valid) {
    console.warn('Configuration issues detected:', configValidation.errors);
  }
}

type NextPageWithLayout = AppProps['Component'] & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

export default function App({ Component, pageProps }: AppProps) {
  const ComponentWithLayout = Component as NextPageWithLayout;
  const getLayout =
    ComponentWithLayout.getLayout ??
    ((page: React.ReactNode) => <Layout>{page}</Layout>);

  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const umamiScriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || 'https://cloud.umami.is/script.js';

  return (
    <AppProvider>
      <AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider>
      {umamiWebsiteId && (
        <Script
          src={umamiScriptUrl}
          data-website-id={umamiWebsiteId}
          strategy="afterInteractive"
        />
      )}
    </AppProvider>
  );
}
