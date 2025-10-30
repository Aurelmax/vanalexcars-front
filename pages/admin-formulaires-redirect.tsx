import { useEffect } from 'react';
import { useRouter } from 'next/router';

const AdminFormulairesRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers Payload CMS admin
    router.replace('/admin/collections/submissions');
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Redirection vers le nouveau panneau d'administration...</h2>
        <p>Vous allez être redirigé vers Payload CMS</p>
      </div>
    </div>
  );
};

export default AdminFormulairesRedirect;
