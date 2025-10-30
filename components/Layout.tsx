import React from 'react';
import Footer from './Footer';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className='min-h-screen bg-white text-gray-900 flex flex-col'>
      <Header />
      <main className='flex-grow pt-20'>{children}</main>
      <Footer />
    </div>
  );
}
