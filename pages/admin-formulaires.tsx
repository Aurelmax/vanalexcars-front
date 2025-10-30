import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  ExtendedFormSubmission,
  formService,
} from '../lib/services/formService';

const AdminFormulaires: React.FC = () => {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<ExtendedFormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  // const { isAuthenticated, user } = useAuth();

  const handleLogout = () => {
    // Redirection vers la page de connexion
    router.push('/admin-login');
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  // Force re-render when submissions change
  useEffect(() => {
    // Les soumissions ont été mises à jour
  }, [submissions]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await formService.getFormSubmissions();

      // Traiter la structure de données de l'API
      let submissionsArray: ExtendedFormSubmission[] = [];
      if (Array.isArray(data)) {
        submissionsArray = data as ExtendedFormSubmission[];
      } else if (
        data &&
        (data as { success: boolean; data: ExtendedFormSubmission[] })
          .success &&
        Array.isArray(
          (data as { success: boolean; data: ExtendedFormSubmission[] }).data
        )
      ) {
        submissionsArray = (
          data as { success: boolean; data: ExtendedFormSubmission[] }
        ).data as ExtendedFormSubmission[];
      } else {
        console.warn('Structure de données inattendue:', data);
        submissionsArray = [];
      }

      setSubmissions(submissionsArray);
    } catch (err) {
      console.error('❌ Erreur lors du chargement:', err);
      setError('Erreur lors du chargement des soumissions');
      setSubmissions([]); // Initialiser comme tableau vide en cas d'erreur
    } finally {
      setLoading(false);
      console.log('🏁 Chargement terminé');
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await formService.markAsRead(id);
      setSubmissions(prev =>
        prev.map(sub =>
          sub.id === id
            ? { ...sub, meta: { ...sub.meta, form_status: newStatus } }
            : sub
        )
      );
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
    }
  };

  const filteredSubmissions = Array.isArray(submissions)
    ? submissions.filter(submission => {
        if (filter === 'all') return true;
        // L'API retourne form_type directement, pas dans meta
        return submission.form_type === filter;
      })
    : [];

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      read: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800',
    };

    const statusLabels = {
      pending: 'En attente',
      read: 'Lu',
      archived: 'Archivé',
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'}`}
      >
        {statusLabels[status as keyof typeof statusLabels] || status}
      </span>
    );
  };

  const getFormTypeLabel = (formType: string) => {
    const labels = {
      contact: 'Contact',
      vehicle_request: 'Demande Véhicule',
      registration_documents: 'Documents',
      testimonial: 'Témoignage',
      newsletter: 'Newsletter',
    };
    return labels[formType as keyof typeof labels] || formType;
  };

  // Temporairement désactivé pour les tests
  // if (!isAuthenticated) {
  //   return (
  //     <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
  //       <div className='max-w-md w-full bg-white rounded-lg shadow-md p-6'>
  //         <h2 className='text-2xl font-bold text-gray-900 mb-4'>
  //           Accès restreint
  //         </h2>
  //         <p className='text-gray-600'>
  //           Vous devez être connecté pour accéder à cette page.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Navigation Header */}
      <div className='bg-white shadow-sm border-b mb-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            <div className='flex items-center space-x-4'>
              <h1 className='text-2xl font-bold text-gray-900'>
                Admin Vanalexcars
              </h1>
              <div className='flex space-x-2'>
                <Link
                  href='/admin-formulaires'
                  className='px-4 py-2 bg-blue-100 text-blue-700 rounded-md font-medium'
                >
                  Formulaires
                </Link>
                <Link
                  href='/admin/vehicles'
                  className='px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium flex items-center gap-2'
                >
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                  </svg>
                  Véhicules
                </Link>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
              </svg>
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-gray-900'>
            Gestion des Formulaires
          </h2>
          <p className='mt-2 text-gray-600'>
            Gérez toutes les soumissions de formulaires de votre site
          </p>
          {/* Actions */}
          <div className='mt-4 flex justify-end gap-2'>
            <button
              onClick={loadSubmissions}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
              </svg>
              Rafraîchir
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center'>
                  <span className='text-white text-sm font-bold'>📝</span>
                </div>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-500'>Total</p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {Array.isArray(submissions) ? submissions.length : 0}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center'>
                  <span className='text-white text-sm font-bold'>⏳</span>
                </div>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-500'>En attente</p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {Array.isArray(submissions)
                    ? submissions.filter(s => s.form_status === 'pending')
                        .length
                    : 0}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-green-500 rounded-md flex items-center justify-center'>
                  <span className='text-white text-sm font-bold'>✅</span>
                </div>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-500'>Lus</p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {Array.isArray(submissions)
                    ? submissions.filter(s => s.form_status === 'read').length
                    : 0}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-gray-500 rounded-md flex items-center justify-center'>
                  <span className='text-white text-sm font-bold'>📁</span>
                </div>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-500'>Archivés</p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {Array.isArray(submissions)
                    ? submissions.filter(s => s.form_status === 'archived')
                        .length
                    : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className='bg-white rounded-lg shadow mb-6'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <div className='flex flex-wrap gap-2'>
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tous ({submissions.length})
              </button>
              <button
                onClick={() => setFilter('contact')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'contact'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Contact (
                {Array.isArray(submissions)
                  ? submissions.filter(s => s.form_type === 'contact').length
                  : 0}
                )
              </button>
              <button
                onClick={() => setFilter('vehicle_request')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'vehicle_request'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Véhicules (
                {Array.isArray(submissions)
                  ? submissions.filter(s => s.form_type === 'vehicle_request')
                      .length
                  : 0}
                )
              </button>
              <button
                onClick={() => setFilter('registration_documents')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'registration_documents'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Documents (
                {Array.isArray(submissions)
                  ? submissions.filter(
                      s => s.form_type === 'registration_documents'
                    ).length
                  : 0}
                )
              </button>
              <button
                onClick={() => setFilter('testimonial')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'testimonial'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Témoignages (
                {Array.isArray(submissions)
                  ? submissions.filter(s => s.form_type === 'testimonial')
                      .length
                  : 0}
                )
              </button>
              <button
                onClick={() => setFilter('newsletter')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === 'newsletter'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Newsletter (
                {Array.isArray(submissions)
                  ? submissions.filter(s => s.form_type === 'newsletter').length
                  : 0}
                )
              </button>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className='bg-white rounded-lg shadow'>
          {loading ? (
            <div className='p-8 text-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
              <p className='mt-2 text-gray-600'>
                Chargement des soumissions...
              </p>
            </div>
          ) : error ? (
            <div className='p-8 text-center'>
              <p className='text-red-600'>{error}</p>
              <button
                onClick={loadSubmissions}
                className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
              >
                Réessayer
              </button>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className='p-8 text-center'>
              <p className='text-gray-600'>Aucune soumission trouvée.</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      ID
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Type
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Nom
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Email
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Date
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Statut
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {filteredSubmissions.map(submission => (
                    <tr key={submission.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        #{submission.id}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {getFormTypeLabel(submission.form_type || '')}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {submission.form_data?.name || 'N/A'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {submission.form_data?.email || 'N/A'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {new Date(submission.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {getStatusBadge(submission.form_status || 'pending')}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex space-x-2'>
                          <select
                            value={submission.form_status || 'pending'}
                            onChange={e =>
                              handleStatusChange(submission.id, e.target.value)
                            }
                            className='text-xs border border-gray-300 rounded-md px-2 py-1'
                          >
                            <option value='pending'>En attente</option>
                            <option value='read'>Lu</option>
                            <option value='archived'>Archivé</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFormulaires;
