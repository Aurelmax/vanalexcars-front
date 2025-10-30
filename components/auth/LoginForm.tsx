import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { AuthCredentials, authService } from '../../lib/services/authService';

interface LoginFormProps {
  onLogin?: (user: { id: string; name: string; email: string }) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const router = useRouter();
  const [credentials, setCredentials] = useState<AuthCredentials>({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.authenticate(credentials);

      if (response.success) {
        console.log('Authentification réussie:', response.data);
        if (onLogin) {
          onLogin({
            id: response.data.user_email,
            name: response.data.user_display_name,
            email: response.data.user_email,
          });
        }
        // Rediriger vers le tableau de bord des formulaires
        router.push('/test-formulaires');
      }
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      setError('Identifiants invalides');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className='max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold text-gray-900 mb-6 text-center'>
        Authentification API
      </h2>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label
            htmlFor='username'
            className='block text-sm font-medium text-gray-700'
          >
            Nom d&apos;utilisateur
          </label>
          <input
            type='text'
            id='username'
            name='username'
            value={credentials.username}
            onChange={handleChange}
            required
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            placeholder='admin'
          />
        </div>

        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700'
          >
            Mot de passe
          </label>
          <input
            type='password'
            id='password'
            name='password'
            value={credentials.password}
            onChange={handleChange}
            required
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            placeholder='••••••••'
          />
        </div>

        {error && (
          <div className='text-red-600 text-sm text-center'>{error}</div>
        )}

        <button
          type='submit'
          disabled={isLoading}
          className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
        >
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <div className='mt-4 text-sm text-gray-600'>
        <p>
          <strong>Identifiants de test :</strong>
        </p>
        <p>
          Username: <code>testuser</code>
        </p>
        <p>
          Password: <code>testpassword123</code>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
