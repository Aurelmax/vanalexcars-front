import React, { useEffect, useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import { authService } from '../lib/services/authService';

const AuthTestPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà authentifié
    if (authService.isAuthenticated()) {
      setIsAuthenticated(true);
      setUser(authService.getCurrentUser());
    }
  }, []);

  const handleLogin = (userData: {
    id: string;
    name: string;
    email: string;
  }) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-4xl mx-auto px-4'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
          Test d&apos;authentification JWT
        </h1>

        {!isAuthenticated ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-md'>
            <h2 className='text-2xl font-bold text-green-600 mb-4 text-center'>
              ✅ Authentifié
            </h2>

            <div className='space-y-2 mb-6'>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Nom:</strong> {user?.display_name}
              </p>
              <p>
                <strong>Username:</strong> {user?.username}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
            >
              Se déconnecter
            </button>
          </div>
        )}

        <div className='mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6'>
          <h3 className='text-lg font-semibold text-blue-800 mb-3'>
            📋 Instructions de test
          </h3>
          <ol className='list-decimal list-inside space-y-2 text-sm text-blue-700'>
            <li>
              Utilisez les identifiants <code>testuser</code> /{' '}
              <code>testpassword123</code>
            </li>
            <li>
              Après connexion, testez les formulaires sur{' '}
              <code>/test-formulaires</code>
            </li>
            <li>
              Les soumissions devraient maintenant fonctionner avec
              l&apos;authentification JWT
            </li>
            <li>
              Vérifiez dans l'interface admin que les soumissions apparaissent
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AuthTestPage;
