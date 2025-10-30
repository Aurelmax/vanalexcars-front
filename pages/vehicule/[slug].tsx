import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import VehicleDetail from '../../components/VehicleDetail';

interface Vehicle {
  id: number;
  slug: string;
  title: string;
  content: string;
  price: number;
  year: number;
  mileage: number;
  location: string;
  fuel_type: string;
  transmission: string;
  power: string;
  description: string;
  is_featured: boolean;
  is_new: boolean;
  is_sold: boolean;
  image_url?: string;
  featured_image?: {
    id: number;
    url: string;
    alt: string;
  };
  gallery?: Array<{
    id: number;
    url: string;
    alt: string;
    order: number;
  }>;
}

export default function VehiclePage() {
  const router = useRouter();
  const { slug } = router.query;
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!slug || typeof slug !== 'string') return;

      try {
        setLoading(true);
        const response = await fetch(`/api/test-payload`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Véhicule non trouvé');
          } else {
            throw new Error('Erreur lors du chargement du véhicule');
          }
        } else {
          const data = await response.json();
          if (data.success && data.data) {
            // Trouver le véhicule par slug
            const foundVehicle = data.data.find((v: any) => v.slug === slug);
            if (foundVehicle) {
              setVehicle(foundVehicle);
            } else {
              setError('Véhicule non trouvé');
            }
          } else {
            setError('Erreur lors du chargement du véhicule');
          }
        }
      } catch (err) {
        console.error('Erreur lors du chargement du véhicule:', err);
        setError('Erreur lors du chargement du véhicule');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [slug]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-premium-gold mx-auto'></div>
          <p className='mt-4 text-gray-600'>Chargement du véhicule...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            {error || 'Véhicule non trouvé'}
          </h1>
          <p className='text-gray-600 mb-4'>
            Le véhicule demandé n&apos;existe pas ou n&apos;est plus disponible.
          </p>
          <Link href='/' className='text-premium-gold hover:underline'>
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  // Convertir les données de l'API au format attendu par VehicleDetail
  const formattedVehicle = {
    id: vehicle.id.toString(),
    name: vehicle.title,
    price: vehicle.price,
    image: vehicle.image_url || vehicle.featured_image?.url || '',
    year: vehicle.year.toString(),
    mileage: vehicle.mileage,
    power: parseInt(vehicle.power.replace(/\D/g, '')) || 0,
    owners: 1, // Valeur par défaut
    transmission: vehicle.transmission,
    fuel: vehicle.fuel_type,
    consumption: 10.5, // Valeur par défaut
    co2: 250, // Valeur par défaut
    location: vehicle.location,
    seller: 'Vanalexcars', // Valeur par défaut
    sellerType: 'Pro' as const,
    features: [
      'Climatisation automatique',
      'Système de navigation',
      'Sièges sport en cuir',
      'Jantes alliage',
      'Régulateur de vitesse',
      'Bluetooth',
      'ABS',
      'ESP',
      'Airbags frontaux et latéraux',
      'Direction assistée',
    ],
    description: vehicle.description,
    history: [
      'Véhicule entretenu selon les préconisations constructeur',
      'Contrôle technique valide',
      'Historique complet disponible',
    ],
    technicalSpecs: {
      engine: '6 cylindres',
      displacement: '3.0L',
      acceleration: '0-100 km/h en 4.5s',
      topSpeed: '280 km/h',
      weight: '1,600 kg',
      dimensions: '4.50m x 1.85m x 1.30m',
    },
  };

  return <VehicleDetail vehicle={formattedVehicle} />;
}
