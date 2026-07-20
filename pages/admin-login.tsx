/**
 * /admin-login — Redirect permanent vers /admin/login
 * Conservé pour ne pas casser les bookmarks existants.
 */
import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/admin/login',
      permanent: true,
    },
  };
};

export default function AdminLoginRedirect() {
  return null;
}
