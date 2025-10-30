import { GetServerSideProps } from 'next';
import Link from 'next/link';
import AnimatedBanner from '../components/AnimatedBanner';
import BrandSelector from '../components/BrandSelector';
import Hero from '../components/Hero';
import ServicesGrid from '../components/ServicesGrid';
import TestimonialsGrid from '../components/TestimonialsGrid';
import VehicleCategorySelector from '../components/VehicleCategorySelector';
import VehicleGrid from '../components/VehicleGrid';

interface BrandCount {
  name: string;
  displayName: string;
  count: number;
}

interface CategoryCount {
  name: string;
  displayName: string;
  count: number;
  imageUrl: string;
}

interface HomeProps {
  vehicles: any[];
  services: any[];
  testimonials: any[];
  brandCounts: BrandCount[];
  categoryCounts: CategoryCount[];
}

export default function Home({
  vehicles,
  services,
  testimonials,
  brandCounts,
  categoryCounts,
}: HomeProps) {
  return (
    <>
      {/* Animated Banner */}
      <AnimatedBanner />

      {/* Hero Section */}
      <Hero
        title="Importez votre véhicule d'Allemagne en toute confiance"
        subtitle="Un accompagnement personnalisé pour trouver et livrer le véhicule de vos rêves, directement depuis l'Allemagne jusqu'à votre porte."
      />

      {/* Comment ça marche */}
      <section className='py-16 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Comment ça marche ?
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Un processus simple et transparent pour importer votre véhicule
              d&apos;Allemagne
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* Étape 1 */}
            <div className='text-center'>
              <div className='bg-yellow-500 text-black w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4'>
                1
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                Vous me contactez
              </h3>
              <p className='text-gray-600'>
                Décrivez-moi le véhicule que vous recherchez, vos critères et
                votre budget.
              </p>
            </div>

            {/* Étape 2 */}
            <div className='text-center'>
              <div className='bg-yellow-500 text-black w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4'>
                2
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                Je recherche en Allemagne
              </h3>
              <p className='text-gray-600'>
                Je parcours les annonces allemandes et vous propose les
                meilleures options.
              </p>
            </div>

            {/* Étape 3 */}
            <div className='text-center'>
              <div className='bg-yellow-500 text-black w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4'>
                3
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                Livraison en France
              </h3>
              <p className='text-gray-600'>
                Je m&apos;occupe de tout : achat, immatriculation, livraison à
                votre domicile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sélecteur de marques */}
      <BrandSelector brands={brandCounts} />

      {/* Catégories de véhicules */}
      <VehicleCategorySelector categories={categoryCounts} />

      {/* Véhicules Disponibles */}
      {/* Services */}
      <ServicesGrid services={services} title='Nos Services' limit={6} />

      {/* Véhicules en vedette */}
      <VehicleGrid
        title='Véhicules Disponibles'
        vehicles={vehicles}
        featured={true}
        limit={8}
      />

      {/* Témoignages */}
      <TestimonialsGrid
        testimonials={testimonials}
        title='Témoignages Clients'
        limit={3}
      />

      {/* Forfaits Section */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Mes Forfaits Premium
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Choisissez le forfait qui correspond à vos besoins
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* Forfait Basic */}
            <div className='bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200 hover:border-yellow-500 transition-colors'>
              <div className='text-center mb-6'>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>Basic</h3>
                <div className='text-4xl font-bold text-yellow-500 mb-2'>
                  299€
                </div>
                <p className='text-gray-600'>Par véhicule</p>
              </div>
              <ul className='space-y-4 mb-8'>
                <li className='flex items-center'>
                  <svg
                    className='w-5 h-5 text-green-500 mr-3'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Recherche ciblée
                </li>
                <li className='flex items-center'>
                  <svg
                    className='w-5 h-5 text-green-500 mr-3'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Rapport détaillé
                </li>
                <li className='flex items-center'>
                  <svg
                    className='w-5 h-5 text-green-500 mr-3'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Support email
                </li>
              </ul>
              <Link
                href='/contact'
                className='block w-full bg-gray-900 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors'
              >
                Choisir Basic
              </Link>
            </div>

            {/* Forfait Premium */}
            <div className='bg-white rounded-xl shadow-lg p-8 border-2 border-yellow-500 relative'>
              <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
                <span className='bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-semibold'>
                  Recommandé
                </span>
              </div>
              <div className='text-center mb-6'>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                  Premium
                </h3>
                <div className='text-4xl font-bold text-yellow-500 mb-2'>
                  599€
                </div>
                <p className='text-gray-600'>Par véhicule</p>
              </div>
              <ul className='space-y-4 mb-8'>
                <li className='flex items-center'>
                  <svg
                    className='w-5 h-5 text-green-500 mr-3'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Recherche personnalisée
                </li>
                <li className='flex items-center'>
                  <svg
                    className='w-5 h-5 text-green-500 mr-3'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Inspection sur place
                </li>
                <li className='flex items-center'>
                  <svg
                    className='w-5 h-5 text-green-500 mr-3'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Négociation prix
                </li>
                <li className='flex items-center'>
                  <svg
                    className='w-5 h-5 text-green-500 mr-3'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Support téléphonique
                </li>
              </ul>
              <Link
                href='/contact'
                className='block w-full bg-yellow-500 text-black text-center py-3 px-6 rounded-lg font-semibold hover:bg-yellow-400 transition-colors'
              >
                Choisir Premium
              </Link>
            </div>

            {/* Forfait VIP */}
            <div className='bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200 hover:border-yellow-500 transition-colors'>
              <div className='text-center mb-6'>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>VIP</h3>
                <div className='text-4xl font-bold text-yellow-500 mb-2'>
                  999€
                </div>
                <p className='text-gray-600'>Par véhicule</p>
              </div>
              <ul className='space-y-4 mb-8'>
                <li className='flex items-center'>
                  <svg
                    className='w-5 h-5 text-green-500 mr-3'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Service sur-mesure
                </li>
                <li className='flex items-center'>
                  <svg
                    className='w-5 h-5 text-green-500 mr-3'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Accompagnement complet
                </li>
                <li className='flex items-center'>
                  <svg
                    className='w-5 h-5 text-green-500 mr-3'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Livraison France
                </li>
                <li className='flex items-center'>
                  <svg
                    className='w-5 h-5 text-green-500 mr-3'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Support prioritaire
                </li>
              </ul>
              <Link
                href='/contact'
                className='block w-full bg-gray-900 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors'
              >
                Choisir VIP
              </Link>
            </div>
          </div>

          {/* Call to Action */}
          <div className='text-center mt-12'>
            <div className='bg-linear-to-r from-yellow-500 to-yellow-400 rounded-xl p-8 text-black'>
              <h3 className='text-2xl font-bold mb-4'>
                Vous ne trouvez pas votre véhicule ?
              </h3>
              <p className='text-lg mb-6'>
                Je recherche spécifiquement selon vos critères en Allemagne
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Link
                  href='/contact'
                  className='bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors'
                >
                  Me contacter
                </Link>
                <Link
                  href='/demande'
                  className='bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors'
                >
                  Faire une demande
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='py-16 bg-gray-50'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Questions Fréquentes
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Tout ce que vous devez savoir sur notre service premium
              d&apos;import automobile
            </p>
          </div>

          <div className='space-y-8'>
            {/* FAQ 1 */}
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Combien coûte l&apos;import d&apos;un véhicule d&apos;Allemagne
                ?
              </h3>
              <p className='text-gray-600'>
                Le coût dépend du forfait choisi (299€ à 999€) et des frais
                administratifs (immatriculation, carte grise, etc.). Je vous
                fournis un devis détaillé avant toute démarche.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Combien de temps prend le processus ?
              </h3>
              <p className='text-gray-600'>
                En moyenne, 2-4 semaines entre la sélection du véhicule et la
                livraison en France. Cela inclut l&apos;achat,
                l&apos;immatriculation temporaire allemande, et la livraison.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Le véhicule est-il garanti ?
              </h3>
              <p className='text-gray-600'>
                Oui, tous les véhicules sont inspectés avant achat. Je négocie
                également une garantie constructeur si disponible. Vous avez
                également ma garantie de satisfaction.
              </p>
            </div>

            {/* FAQ 4 */}
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                Puis-je visiter le véhicule avant achat ?
              </h3>
              <p className='text-gray-600'>
                Avec le forfait Premium et VIP, je peux organiser une visite sur
                place. Pour le forfait Basic, je fournis un rapport détaillé
                avec photos et vidéos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className='py-16 bg-premium-black text-premium-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <div className='bg-premium-gray-dark rounded-2xl p-8 lg:p-12'>
            <div className='flex justify-center mb-6'>
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className='w-6 h-6 text-yellow-500 mx-1'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
              ))}
            </div>
            <blockquote className='text-xl lg:text-2xl font-medium mb-6'>
              &quot;Service exceptionnel ! Alexandre a trouvé exactement la BMW
              M3 que je cherchais, à un prix imbattable. Le processus était
              transparent et la livraison parfaite.&quot;
            </blockquote>
            <div className='flex items-center justify-center'>
              <div className='text-left'>
                <div className='font-semibold text-lg'>Marc Dubois</div>
                <div className='text-premium-gray-light'>
                  Propriétaire BMW M3 Competition
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className='py-16 bg-linear-to-r from-yellow-500 to-yellow-400'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl lg:text-4xl font-bold text-black mb-6'>
            Prêt à trouver votre véhicule idéal ?
          </h2>
          <p className='text-xl text-black mb-8'>
            Contactez-moi dès aujourd&apos;hui pour commencer votre recherche
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/contact'
              className='bg-black text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors'
            >
              Me contacter
            </Link>
            <Link
              href='/demande'
              className='bg-white text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors'
            >
              Faire une demande
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';
  let vehicles = [];
  let brandCounts: BrandCount[] = [];
  let categoryCounts: CategoryCount[] = [];

  try {
    // Récupérer les véhicules
    const response = await fetch(`${backendUrl}/api/vehicles?limit=10&sort=-createdAt`);

    if (response.ok) {
      const data = await response.json();
      vehicles = data.docs || [];
      console.log(`✅ ${vehicles.length} véhicules récupérés pour la page d'accueil`);
    } else {
      console.warn('⚠️ Impossible de récupérer les véhicules:', response.status);
    }

    // Récupérer tous les véhicules pour compter par marque et catégorie
    const allVehiclesResponse = await fetch(`${backendUrl}/api/vehicles?limit=1000`);

    if (allVehiclesResponse.ok) {
      const allData = await allVehiclesResponse.json();
      const allVehicles = allData.docs || [];

      // Compter par marque
      const brandMap = new Map<string, number>();
      const brands = ['audi', 'bmw', 'mercedes', 'porsche', 'volkswagen', 'mini'];

      allVehicles.forEach((v: any) => {
        const brand = v.brand?.toLowerCase() || '';
        if (brands.includes(brand)) {
          brandMap.set(brand, (brandMap.get(brand) || 0) + 1);
        }
      });

      brandCounts = [
        { name: 'audi', displayName: "Audi d'occasion", count: brandMap.get('audi') || 0 },
        { name: 'bmw', displayName: "BMW d'occasion", count: brandMap.get('bmw') || 0 },
        { name: 'mercedes', displayName: "Mercedes-Benz d'occasion", count: brandMap.get('mercedes') || 0 },
        { name: 'porsche', displayName: "Porsche d'occasion", count: brandMap.get('porsche') || 0 },
        { name: 'volkswagen', displayName: "Volkswagen d'occasion", count: brandMap.get('volkswagen') || 0 },
        { name: 'mini', displayName: "Mini d'occasion", count: brandMap.get('mini') || 0 },
      ];

      // Compter par catégorie
      const categoryMap = new Map<string, number>();
      const categories = ['suv', 'berline', 'coupe', 'break', 'monospace', 'cabriolet'];

      allVehicles.forEach((v: any) => {
        const category = v.category?.toLowerCase() || '';
        if (categories.includes(category)) {
          categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
        }
      });

      categoryCounts = [
        { name: 'suv', displayName: "SUV d'occasion", count: categoryMap.get('suv') || 0, imageUrl: '/images/categories/suv.png' },
        { name: 'berline', displayName: "Berline d'occasion", count: categoryMap.get('berline') || 0, imageUrl: '/images/categories/berline.png' },
        { name: 'coupe', displayName: "Coupé d'occasion", count: categoryMap.get('coupe') || 0, imageUrl: '/images/categories/coupe.png' },
        { name: 'break', displayName: "Break d'occasion", count: categoryMap.get('break') || 0, imageUrl: '/images/categories/break.png' },
        { name: 'monospace', displayName: "Monospace d'occasion", count: categoryMap.get('monospace') || 0, imageUrl: '/images/categories/monospace.png' },
        { name: 'cabriolet', displayName: "Cabriolet d'occasion", count: categoryMap.get('cabriolet') || 0, imageUrl: '/images/categories/cabriolet.png' },
      ];

      console.log(`✅ Compteurs de marques et catégories calculés`);
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des véhicules:', error);
  }

  // Si aucune donnée, utiliser des valeurs par défaut
  if (brandCounts.length === 0) {
    brandCounts = [
      { name: 'audi', displayName: "Audi d'occasion", count: 0 },
      { name: 'bmw', displayName: "BMW d'occasion", count: 0 },
      { name: 'mercedes', displayName: "Mercedes-Benz d'occasion", count: 0 },
      { name: 'porsche', displayName: "Porsche d'occasion", count: 0 },
      { name: 'volkswagen', displayName: "Volkswagen d'occasion", count: 0 },
      { name: 'mini', displayName: "Mini d'occasion", count: 0 },
    ];
  }

  if (categoryCounts.length === 0) {
    categoryCounts = [
      { name: 'suv', displayName: "SUV d'occasion", count: 0, imageUrl: '/images/categories/suv.png' },
      { name: 'berline', displayName: "Berline d'occasion", count: 0, imageUrl: '/images/categories/berline.png' },
      { name: 'coupe', displayName: "Coupé d'occasion", count: 0, imageUrl: '/images/categories/coupe.png' },
      { name: 'break', displayName: "Break d'occasion", count: 0, imageUrl: '/images/categories/break.png' },
      { name: 'monospace', displayName: "Monospace d'occasion", count: 0, imageUrl: '/images/categories/monospace.png' },
      { name: 'cabriolet', displayName: "Cabriolet d'occasion", count: 0, imageUrl: '/images/categories/cabriolet.png' },
    ];
  }

  return {
    props: {
      vehicles,
      services: [],
      testimonials: [],
      brandCounts,
      categoryCounts,
    },
  };
};
