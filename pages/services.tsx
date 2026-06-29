import Link from 'next/link';
import Hero from '../components/Hero';

export default function Services() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        title='Mes Services Premium'
        subtitle='Import Automobile Personnalisé'
        description="En tant qu'importateur indépendant, je vous accompagne dans l'achat de votre véhicule en Allemagne avec un service sur mesure et une expertise de terrain."
        primaryButton={{
          text: 'Demander un devis',
          href: '/demande',
        }}
        secondaryButton={{
          text: 'Me contacter',
          href: '/contact',
        }}
        showCar={true}
      />

      <div className='px-6 py-16'>
        <div className='max-w-4xl mx-auto'>
          {/* Pricing */}
          <div className='mb-8'>

            {/* Prix hero */}
            <div className='bg-white rounded-2xl shadow-lg p-10 mb-6 text-center'>
              <p className='text-xs font-bold uppercase tracking-widest text-premium-gold mb-3'>Forfait unique tout compris</p>
              <div className='flex items-end justify-center gap-2 mb-2'>
                <span className='text-7xl font-black text-gray-900'>1 490</span>
                <span className='text-3xl font-bold text-gray-900 mb-3'>€ TTC</span>
              </div>
              <p className='text-gray-500 mb-1'>Par véhicule · Valable jusqu'à 120 000 € de valeur véhicule</p>
              <p className='text-xs text-gray-400 mb-8'>Au-delà de 120 000 € → devis personnalisé</p>
              <Link
                href='/demande'
                className='inline-block bg-premium-gold text-premium-black px-10 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all duration-300 hover:scale-105'
              >
                Démarrer mon import →
              </Link>
            </div>

            {/* Ce que ça représente vraiment */}
            <div className='bg-gray-50 rounded-2xl p-8 mb-6'>
              <h3 className='text-lg font-bold text-gray-900 mb-2'>Un forfait fixe, quel que soit le prix du véhicule</h3>
              <p className='text-sm text-gray-500 mb-6'>Contrairement à une commission en pourcentage, vous savez exactement ce que vous payez dès le départ.</p>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {[
                  { price: '30 000 €', pct: '≈ 5 %' },
                  { price: '60 000 €', pct: '≈ 2,5 %' },
                  { price: '100 000 €', pct: '≈ 1,5 %' },
                  { price: '120 000 €', pct: '≈ 1,2 %' },
                ].map(({ price, pct }) => (
                  <div key={price} className='bg-white rounded-xl p-4 text-center border border-gray-200'>
                    <p className='text-sm text-gray-500 mb-1'>Véhicule à</p>
                    <p className='font-bold text-gray-900 mb-2'>{price}</p>
                    <p className='text-xs text-premium-gold font-semibold'>1 490 € = {pct}</p>
                  </div>
                ))}
              </div>
              <p className='text-xs text-gray-400 mt-4 text-center'>
                Une commission à 3 % sur un véhicule à 100 000 € = 3 000 €. Avec VanalexCars : 1 490 €, point final.
              </p>
            </div>

            {/* Ce qui est inclus + comparatif */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>

              {/* Inclus */}
              <div className='bg-white rounded-2xl shadow-sm p-8 border border-gray-100'>
                <h3 className='font-bold text-gray-900 mb-5'>Tout est inclus</h3>
                <ul className='space-y-3'>
                  {[
                    'Recherche personnalisée sur AutoScout24.de',
                    'Vérification auprès du concessionnaire officiel',
                    'Analyse documentaire et historique (CarVertical)',
                    'Vérification de la garantie constructeur',
                    'Négociation du prix',
                    'Transport dédié Allemagne → France (< 1 semaine)',
                    'Démarches administratives complètes',
                    'Constitution du dossier d\'immatriculation',
                    'Livraison à domicile en France',
                  ].map(item => (
                    <li key={item} className='flex items-start gap-3 text-sm text-gray-700'>
                      <svg className='w-5 h-5 text-premium-gold shrink-0 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className='mt-6 pt-5 border-t border-gray-100'>
                  <p className='text-xs font-semibold text-gray-500 mb-2'>Non inclus (frais réglementaires) :</p>
                  <ul className='space-y-1'>
                    {['Carte grise', 'Malus écologique (selon véhicule)'].map(item => (
                      <li key={item} className='flex items-center gap-2 text-xs text-gray-400'>
                        <span className='w-1 h-1 rounded-full bg-gray-300 shrink-0'></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Comparatif */}
              <div className='bg-white rounded-2xl shadow-sm p-8 border border-gray-100'>
                <h3 className='font-bold text-gray-900 mb-5'>VanalexCars vs importeMoi</h3>
                <div className='space-y-4'>
                  {[
                    { label: 'Tarif forfaitaire', them: '1 990 €', us: '1 490 €', winner: true },
                    { label: 'Délai de livraison', them: '3 à 4 semaines', us: '< 1 semaine', winner: true },
                    { label: 'Transport', them: 'Groupage', us: 'Dédié', winner: true },
                    { label: 'Spécialisation', them: 'Généraliste', us: 'Premium & sportives', winner: true },
                  ].map(({ label, them, us, winner }) => (
                    <div key={label} className='grid grid-cols-3 gap-2 text-sm'>
                      <p className='text-gray-500 col-span-1'>{label}</p>
                      <p className='text-gray-400 text-center line-through'>{them}</p>
                      <p className={`text-center font-semibold ${winner ? 'text-premium-gold' : 'text-gray-700'}`}>{us}</p>
                    </div>
                  ))}
                </div>
                <div className='mt-6 bg-premium-gold/10 rounded-xl p-4 text-center'>
                  <p className='text-sm font-bold text-gray-900'>500 € de moins</p>
                  <p className='text-xs text-gray-500'>Livré 3× plus vite, avec un transport dédié</p>
                </div>
              </div>
            </div>

            {/* Alerte malus */}
            <div className='bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4'>
              <span className='text-2xl shrink-0'>⚠️</span>
              <div>
                <p className='font-semibold text-gray-900 mb-1'>Malus écologique — à anticiper</p>
                <p className='text-sm text-gray-600'>
                  Le malus écologique peut représenter plusieurs milliers d'euros pour les véhicules essence puissants importés hors UE. Il est systématiquement calculé et communiqué avant tout engagement de votre part.
                </p>
              </div>
            </div>

          </div>
          {/* Avantages */}
          <div className='bg-white rounded-lg shadow-lg p-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>
              Pourquoi choisir un importateur indépendant ?
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='text-center'>
                <div className='text-4xl mb-4'>🤝</div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  Relation personnalisée
                </h3>
                <p className='text-gray-600'>
                  Un seul interlocuteur, disponible et à l&apos;écoute
                </p>
              </div>

              <div className='text-center'>
                <div className='text-4xl mb-4'>💎</div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  Expertise terrain
                </h3>
                <p className='text-gray-600'>
                  Connaissance approfondie du marché allemand
                </p>
              </div>

              <div className='text-center'>
                <div className='text-4xl mb-4'>💰</div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  Meilleur rapport qualité/prix
                </h3>
                <p className='text-gray-600'>
                  Pas de marge excessive, prix transparents
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
