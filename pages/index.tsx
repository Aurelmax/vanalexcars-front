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
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Comment ça marche ?
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Vous ne vous engagez sur rien avant d&apos;avoir vu le dossier complet du véhicule.
            </p>
          </div>

          <div className='relative'>
            {/* Ligne verticale */}
            <div className='absolute left-7 top-8 bottom-8 w-0.5 bg-yellow-200 hidden md:block'></div>

            <div className='space-y-8'>
              {[
                {
                  num: '1',
                  title: 'Vous déposez votre demande',
                  desc: 'Via le formulaire ou WhatsApp. Je qualifie votre besoin : modèle, budget, options, délai et estimation du malus.',
                },
                {
                  num: '2',
                  title: 'Je recherche le véhicule',
                  desc: 'J\'interroge mon réseau de concessionnaires officiels allemands et j\'obtiens une offre écrite sur un véhicule correspondant à vos critères.',
                },
                {
                  num: '3',
                  title: 'Je vous présente le dossier complet',
                  desc: 'Photos, historique, rapport CarVertical, prix du véhicule, frais d\'importation (1 490 €), transport et estimation malus + carte grise. Aucune surprise.',
                },
                {
                  num: '4',
                  title: 'Vous confirmez — c\'est seulement là que vous vous engagez',
                  desc: 'Validation de votre intérêt, puis signature électronique du mandat et acompte de 300 à 500 €. Le mandat porte sur ce véhicule précis, pas sur une recherche abstraite.',
                },
                {
                  num: '5',
                  title: 'Je m\'occupe de tout',
                  desc: 'Réservation auprès du concessionnaire, organisation du transport, démarches administratives et livraison à domicile en France.',
                },
              ].map(({ num, title, desc }) => (
                <div key={num} className='flex gap-6 items-start'>
                  <div className='shrink-0 w-14 h-14 bg-yellow-500 text-black rounded-full flex items-center justify-center text-xl font-black shadow-md'>
                    {num}
                  </div>
                  <div className='flex-1 bg-white rounded-xl p-5 shadow-sm border border-gray-100'>
                    <h3 className='font-bold text-gray-900 mb-1'>{title}</h3>
                    <p className='text-gray-600 text-sm leading-relaxed'>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Promesse VanalexCars */}
      <section className='py-14 bg-gray-900 text-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col md:flex-row items-start gap-10'>

            {/* Promesse principale */}
            <div className='flex-1'>
              <p className='text-xs font-bold uppercase tracking-widest text-yellow-400 mb-3'>Notre engagement</p>
              <h2 className='text-2xl font-bold text-white mb-4'>
                Une importation clé en main,<br/>sans mauvaise surprise
              </h2>
              <p className='text-gray-300 leading-relaxed mb-6'>
                Notre mission ne s&apos;arrête pas à la livraison du véhicule. Nous prenons en charge l&apos;intégralité des démarches administratives, du certificat provisoire d&apos;immatriculation (CPI) jusqu&apos;à l&apos;obtention de votre carte grise définitive. Avant tout engagement, vous êtes informé du coût du malus écologique et des taxes éventuelles — vous connaissez le coût total de votre importation avant de signer.
              </p>
            </div>

            {/* Checklist coûts */}
            <div className='w-full md:w-72 bg-white/5 border border-white/10 rounded-2xl p-6 shrink-0'>
              <div className='flex items-center gap-2 mb-4'>
                <span className='text-yellow-400 text-lg'>✅</span>
                <p className='font-bold text-white'>Aucun coût caché</p>
              </div>
              <p className='text-xs text-gray-400 mb-5'>Vous connaissez avant de signer :</p>
              <ul className='space-y-3'>
                {[
                  'Prix du véhicule',
                  'Prestation VanalexCars (1 490 €)',
                  'Transport dédié',
                  'Malus écologique estimé',
                  'Carte grise',
                ].map(item => (
                  <li key={item} className='flex items-center gap-3 text-sm text-gray-200'>
                    <span className='w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0'></span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className='mt-5 pt-4 border-t border-white/10 text-xs text-gray-400'>
                Accompagnement jusqu&apos;à la réception de votre carte grise définitive.
              </div>
              <div className='mt-3'>
                <Link
                  href='/simulateur-carte-grise'
                  className='text-xs text-yellow-400 hover:text-yellow-300 underline underline-offset-2'
                >
                  Simuler le coût de ma carte grise →
                </Link>
              </div>
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

      {/* Votre expert */}
      <section className='py-16 bg-gray-50'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col md:flex-row items-center gap-12'>
            {/* Photo */}
            <div className='shrink-0'>
              <div className='w-56 h-56 md:w-72 md:h-72 rounded-2xl overflow-hidden shadow-xl'>
                <img
                  src='/uploads/aurelien-vanalexcars.png'
                  alt='Aurélien — VanalexCars'
                  className='w-full h-full object-cover object-top'
                />
              </div>
            </div>

            {/* Texte */}
            <div className='flex-1 text-center md:text-left'>
              <p className='text-xs font-bold uppercase tracking-widest text-yellow-500 mb-3'>Votre expert</p>
              <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                Aurélien, mandataire automobile
              </h2>
              <p className='text-gray-600 leading-relaxed mb-6'>
                Contrairement aux plateformes qui mettent simplement en relation acheteurs et vendeurs, je m&apos;appuie sur un réseau de concessionnaires officiels allemands avec lesquels j&apos;entretiens une relation directe. Cette proximité me permet d&apos;obtenir des informations fiables, de sécuriser les transactions et de sélectionner uniquement des véhicules que je serais prêt à acheter pour moi-même.
              </p>
              <div className='flex flex-wrap gap-6 justify-center md:justify-start mb-8'>
                {[
                  { value: '100 %', label: 'Concessionnaires officiels' },
                  { value: '< 1 sem.', label: 'Délai de livraison' },
                  { value: '1 490 €', label: 'Forfait tout compris' },
                ].map(({ value, label }) => (
                  <div key={label} className='text-center'>
                    <p className='text-2xl font-black text-yellow-500'>{value}</p>
                    <p className='text-xs text-gray-500 mt-0.5'>{label}</p>
                  </div>
                ))}
              </div>
              <div className='flex flex-col sm:flex-row gap-3 justify-center md:justify-start'>
                <a
                  href='https://wa.me/33646022468?text=Bonjour%20Aur%C3%A9lien%2C%20je%20souhaite%20discuter%20d%27un%20projet%20d%27import.'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition'
                >
                  <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' />
                  </svg>
                  Discuter sur WhatsApp
                </a>
                <Link
                  href='/demande'
                  className='inline-flex items-center justify-center bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition'
                >
                  Démarrer mon import →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Forfait unique Section */}
      <section className='py-16 bg-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-10'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Mon tarif
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Un seul prix, tout compris. Pas de surprise.
            </p>
          </div>

          {/* Prix hero */}
          <div className='bg-white rounded-2xl shadow-xl p-10 border-2 border-yellow-400 text-center mb-8'>
            <p className='text-xs font-bold uppercase tracking-widest text-yellow-500 mb-3'>Forfait unique tout compris</p>
            <div className='flex items-end justify-center gap-2 mb-2'>
              <span className='text-7xl font-black text-gray-900'>1 490</span>
              <span className='text-3xl font-bold text-gray-900 mb-3'>€ TTC</span>
            </div>
            <p className='text-gray-500 mb-1'>Par véhicule · Valable jusqu&apos;à 120 000 € de valeur véhicule</p>
            <p className='text-xs text-gray-400 mb-8'>Au-delà de 120 000 € → devis personnalisé</p>

            <ul className='text-left max-w-sm mx-auto space-y-3 mb-8'>
              {[
                'Recherche & sélection sur AutoScout24.de',
                'Vérification concessionnaire officiel',
                'Négociation en votre nom',
                'Transport dédié Cars Trans (< 1 semaine)',
                'Démarches administratives complètes',
                'Homologation & immatriculation',
                'Livraison à domicile en France',
              ].map((item) => (
                <li key={item} className='flex items-center gap-3 text-gray-700 text-sm'>
                  <svg className='w-5 h-5 text-green-500 shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <p className='text-xs text-gray-400 mb-6'>Hors carte grise et malus écologique</p>

            <Link
              href='/demande'
              className='inline-block bg-yellow-500 text-black px-10 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all duration-300 hover:scale-105'
            >
              Démarrer mon import →
            </Link>
          </div>

          {/* Comparatif vs importeMoi */}
          <div className='bg-gray-50 rounded-2xl p-8 mb-8'>
            <h3 className='text-lg font-bold text-gray-900 mb-4 text-center'>Pourquoi VanalexCars ?</h3>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='text-left border-b border-gray-200'>
                    <th className='pb-3 text-gray-500 font-medium'></th>
                    <th className='pb-3 text-yellow-600 font-bold'>VanalexCars</th>
                    <th className='pb-3 text-gray-400 font-medium'>importeMoi</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {[
                    ['Prix', '1 490 €', '1 990 €'],
                    ['Transport', 'Dédié < 1 semaine', 'Groupage 3-4 semaines'],
                    ['Spécialité', 'Premium & sportives', 'Généraliste'],
                    ['Interlocuteur', 'Un seul, direct', 'Plateforme'],
                  ].map(([label, vanalex, importemoi]) => (
                    <tr key={label}>
                      <td className='py-3 text-gray-500'>{label}</td>
                      <td className='py-3 font-semibold text-gray-900'>{vanalex}</td>
                      <td className='py-3 text-gray-400'>{importemoi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA */}
          <div className='text-center'>
            <div className='bg-linear-to-r from-yellow-500 to-yellow-400 rounded-xl p-8 text-black'>
              <h3 className='text-2xl font-bold mb-2'>
                Votre véhicule n&apos;est pas en catalogue ?
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
                Mon forfait unique est de 1 490 € TTC par véhicule (jusqu&apos;à 120 000 €
                de valeur), tout compris. Hors carte grise et malus écologique.
                Au-delà de 120 000 €, je vous fournis un devis personnalisé.
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
                Je fournis un rapport détaillé avec photos et vidéos. Pour les
                véhicules à fort enjeu, je peux organiser une inspection sur place
                auprès du concessionnaire officiel allemand — à me préciser dans votre demande.
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
