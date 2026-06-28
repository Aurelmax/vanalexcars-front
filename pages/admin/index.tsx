/**
 * Page d'index Admin - Redirection vers /admin/vehicles
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminIndex() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers la page de gestion des véhicules
    router.push('/admin/vehicles');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection vers le tableau de bord...</p>
      </div>
    </div>
  );
}
