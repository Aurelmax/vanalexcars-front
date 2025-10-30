import Head from 'next/head';
import Link from 'next/link';
import VehicleManager from '../../components/admin/VehicleManager';

export default function AdminVehicles() {
  return (
    <>
      <Head>
        <title>Gestion des Véhicules - Vanalexcars Admin</title>
        <meta
          name='description'
          content="Interface d'administration des véhicules"
        />
      </Head>

      <div className='min-h-screen bg-gray-100'>
        {/* Header */}
        <header className='bg-white shadow-sm border-b'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center py-4'>
              <div className='flex items-center space-x-4'>
                <Link
                  href='/admin'
                  className='text-2xl font-bold text-gray-900'
                >
                  Vanalexcars Admin
                </Link>
                <span className='bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                  Véhicules
                </span>
              </div>
              <div className='flex items-center space-x-4'>
                <Link
                  href='/admin-formulaires'
                  className='px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium'
                >
                  ← Formulaires
                </Link>
                <Link
                  href='/admin'
                  className='text-gray-600 hover:text-gray-900 transition-colors'
                >
                  Payload CMS
                </Link>
                <Link
                  href='/'
                  className='text-gray-600 hover:text-gray-900 transition-colors'
                >
                  Voir le site
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className='bg-white border-b'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex space-x-8'>
              <Link
                href='/admin'
                className='py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm'
              >
                Tableau de bord
              </Link>
              <Link
                href='/admin/vehicles'
                className='py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm'
              >
                Véhicules
              </Link>
              <Link
                href='/admin/services'
                className='py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm'
              >
                Services
              </Link>
              <Link
                href='/admin/testimonials'
                className='py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm'
              >
                Témoignages
              </Link>
              <Link
                href='/admin/submissions'
                className='py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm'
              >
                Soumissions
              </Link>
            </div>
          </div>
        </nav>

        {/* Contenu principal */}
        <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <VehicleManager />
        </main>
      </div>
    </>
  );
}
