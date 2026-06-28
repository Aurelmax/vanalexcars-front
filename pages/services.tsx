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
          {/* Forfaits */}
          <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6 text-center'>
              Mes Forfaits Premium
            </h2>
            <p className='text-gray-600 text-center mb-8 max-w-2xl mx-auto'>
              Service de proximité et d&apos;expertise en face-à-face en
              Allemagne, gage de confiance et sécurité accrue pour votre import
              automobile.
            </p>

            {/* Flèche de progression */}
            <div className='hidden md:flex items-center justify-center gap-2 mb-6'>
              <span className='text-xs text-gray-400 uppercase tracking-widest'>Recherche</span>
              <div className='flex-1 h-px bg-linear-to-r from-gray-200 via-premium-gold to-gray-900'></div>
              <span className='text-xs text-gray-400 uppercase tracking-widest'>Achat sécurisé</span>
              <div className='flex-1 h-px bg-linear-to-r from-gray-400 to-gray-900'></div>
              <span className='text-xs text-gray-400 uppercase tracking-widest'>Clés en main</span>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch'>

              {/* BASIC */}
              <div className='bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-premium-gold transition-all duration-300 flex flex-col'>
                <div className='mb-5'>
                  <span className='text-xs font-bold uppercase tracking-widest text-gray-400'>Basic</span>
                  <h3 className='text-xl font-bold text-gray-900 mt-1 mb-1'>
                    Je trouve votre véhicule
                  </h3>
                  <p className='text-sm italic text-gray-500'>
                    Vous souhaitez trouver le bon véhicule.
                  </p>
                </div>

                <p className='text-xs text-gray-400 mb-0.5'>À partir de</p>
                <div className='text-3xl font-bold text-premium-gold mb-1'>299 €</div>
                <p className='text-xs text-gray-400 mb-6'>Frais de service</p>

                <ul className='space-y-3 mb-8 flex-1'>
                  {[
                    'Analyse de votre besoin',
                    'Recherche personnalisée sur AutoScout24.de',
                    'Sélection de véhicules correspondants',
                    'Rapport de présélection',
                    'Vérification de disponibilité',
                    'Support par e-mail',
                  ].map((item) => (
                    <li key={item} className='flex items-start'>
                      <svg className='w-5 h-5 text-premium-gold mr-2 mt-0.5 shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                      </svg>
                      <span className='text-sm text-gray-700'>{item}</span>
                    </li>
                  ))}
                </ul>

                <Link href='/demande' className='block w-full text-center bg-premium-gold text-premium-black py-2 rounded font-semibold hover:bg-yellow-400 transition'>
                  Choisir Basic
                </Link>
              </div>

              {/* PREMIUM — recommandé */}
              <div className='bg-white rounded-lg p-6 border-2 border-premium-gold shadow-lg relative hover:shadow-xl transition-all duration-300 flex flex-col'>
                <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                  <span className='bg-premium-gold text-premium-black text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap'>
                    Recommandé
                  </span>
                </div>

                <div className='mb-5'>
                  <span className='text-xs font-bold uppercase tracking-widest text-premium-gold'>Premium</span>
                  <h3 className='text-xl font-bold text-gray-900 mt-1 mb-1'>
                    Je sécurise votre achat
                  </h3>
                  <p className='text-sm italic text-gray-500'>
                    Vous souhaitez acheter en toute sécurité.
                  </p>
                </div>

                <p className='text-xs text-gray-400 mb-0.5'>À partir de</p>
                <div className='text-3xl font-bold text-premium-gold mb-1'>599 €</div>
                <p className='text-xs text-gray-400 mb-6'>Frais de service</p>

                <div className='bg-gray-50 rounded px-3 py-2 mb-4 text-xs text-gray-500 border border-gray-100'>
                  Tout le Basic, plus&nbsp;:
                </div>

                <ul className='space-y-3 mb-8 flex-1'>
                  {[
                    'Vérification auprès du concessionnaire officiel',
                    'Analyse documentaire complète',
                    'Vérification de l\'historique (CarVertical si nécessaire)',
                    'Vérification de la garantie constructeur',
                    'Négociation lorsque cela est possible',
                    'Accompagnement téléphonique',
                  ].map((item) => (
                    <li key={item} className='flex items-start'>
                      <svg className='w-5 h-5 text-premium-gold mr-2 mt-0.5 shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                      </svg>
                      <span className='text-sm text-gray-700'>{item}</span>
                    </li>
                  ))}
                </ul>

                <Link href='/demande' className='block w-full text-center bg-premium-gold text-premium-black py-2 rounded font-semibold hover:bg-yellow-400 transition'>
                  Choisir Premium
                </Link>
              </div>

              {/* VIP */}
              <div className='bg-linear-to-br from-premium-gold to-yellow-600 rounded-lg p-6 text-premium-black relative hover:scale-105 transition-all duration-300 flex flex-col'>
                <div className='absolute -top-3 right-4'>
                  <span className='bg-premium-black text-premium-gold text-xs font-bold px-3 py-1 rounded-full'>
                    VIP
                  </span>
                </div>

                <div className='mb-5'>
                  <span className='text-xs font-bold uppercase tracking-widest text-gray-700'>VIP</span>
                  <h3 className='text-xl font-bold mt-1 mb-1'>
                    Je m&apos;occupe de tout
                  </h3>
                  <p className='text-sm italic text-gray-700'>
                    Vous souhaitez que nous nous occupions de tout.
                  </p>
                </div>

                <p className='text-xs text-gray-700 mb-0.5'>À partir de</p>
                <div className='text-3xl font-bold text-premium-black mb-1'>999 €</div>
                <p className='text-xs text-gray-700 mb-6'>Frais de service</p>

                <div className='bg-black/10 rounded px-3 py-2 mb-4 text-xs text-gray-700 border border-black/10'>
                  Tout le Premium, plus&nbsp;:
                </div>

                <ul className='space-y-3 mb-8 flex-1'>
                  {[
                    'Coordination complète de l\'importation',
                    'Gestion administrative du dossier',
                    'Constitution du dossier d\'immatriculation',
                    'Signature électronique du mandat',
                    'Accompagnement jusqu\'à la remise du véhicule',
                    'Assistance prioritaire',
                  ].map((item) => (
                    <li key={item} className='flex items-start'>
                      <svg className='w-5 h-5 text-premium-black mr-2 mt-0.5 shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                      </svg>
                      <span className='text-sm text-gray-800'>{item}</span>
                    </li>
                  ))}
                </ul>

                <Link href='/demande' className='block w-full text-center bg-premium-black text-premium-gold py-2 rounded font-semibold hover:bg-gray-800 transition'>
                  Choisir VIP
                </Link>
              </div>

            </div>

            {/* Prestations sur devis */}
            <div className='mt-10 bg-gray-50 border border-gray-200 rounded-lg p-6'>
              <div className='flex items-start gap-4'>
                <div className='shrink-0 mt-1'>
                  <span className='inline-flex items-center justify-center w-9 h-9 rounded-full bg-premium-gold/10 text-premium-gold'>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                    </svg>
                  </span>
                </div>
                <div className='flex-1'>
                  <h3 className='text-base font-bold text-gray-900 mb-1'>Prestations sur devis</h3>
                  <p className='text-sm text-gray-500 mb-5'>
                    Les prestations nécessitant un déplacement en Allemagne ou l&apos;intervention d&apos;un prestataire externe sont proposées sur devis afin de s&apos;adapter à la localisation du véhicule et aux besoins spécifiques du client.
                  </p>
                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                    {[
                      'Inspection sur site en Allemagne',
                      'Convoyage personnalisé',
                      'Livraison du véhicule',
                      'Expertise mécanique indépendante',
                      'Accompagnement physique chez le concessionnaire',
                      'Livraison express',
                    ].map((item) => (
                      <div key={item} className='flex items-center gap-2 text-sm text-gray-600'>
                        <span className='w-1.5 h-1.5 rounded-full bg-premium-gold shrink-0'></span>
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className='mt-5'>
                    <Link href='/contact' className='inline-flex items-center text-sm font-semibold text-premium-gold hover:underline'>
                      Demander un devis sur mesure →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Points forts */}
            <div className='mt-12 text-center'>
              <h3 className='text-xl font-bold text-gray-900 mb-6'>
                Points forts de l&apos;offre Vanalexcars
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto'>
                <div className='bg-gray-50 p-6 rounded-lg shadow-md text-left'>
                  <p className='text-gray-700'>
                    Service de proximité et d&apos;expertise en face-à-face en
                    Allemagne, gage de confiance et sécurité accrue.
                  </p>
                </div>
                <div className='bg-gray-50 p-6 rounded-lg shadow-md text-left'>
                  <p className='text-gray-700'>
                    Paiement sécurisé et garanti uniquement une fois que le
                    client est satisfait du véhicule.
                  </p>
                </div>
                <div className='bg-gray-50 p-6 rounded-lg shadow-md text-left'>
                  <p className='text-gray-700'>
                    Flexibilité dans la logistique de rapatriement adaptée à
                    chaque demande.
                  </p>
                </div>
                <div className='bg-gray-50 p-6 rounded-lg shadow-md text-left'>
                  <p className='text-gray-700'>
                    Transparence totale avec suivi et documents remis au client.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section principale */}
          <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              Import automobile personnalisé
            </h2>
            <p className='text-gray-600 mb-6'>
              En tant qu&apos;importateur indépendant, je vous accompagne dans
              l&apos;achat de votre véhicule en Allemagne avec un service sur
              mesure et une expertise de terrain.
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                  🚗 Recherche & Sélection
                </h3>
                <ul className='text-gray-600 space-y-2'>
                  <li>• Recherche selon vos critères</li>
                  <li>• Présélection de véhicules</li>
                  <li>• Photos détaillées</li>
                  <li>• Historique complet</li>
                </ul>
              </div>

              <div className='bg-gray-50 p-6 rounded-lg'>
                <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                  🔍 Vérification sur place
                </h3>
                <ul className='text-gray-600 space-y-2'>
                  <li>• Contrôle technique complet</li>
                  <li>• Essai routier</li>
                  <li>• Vérification des documents</li>
                  <li>• Rapport détaillé</li>
                </ul>
              </div>

              <div className='bg-gray-50 p-6 rounded-lg'>
                <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                  💰 Négociation & Achat
                </h3>
                <ul className='text-gray-600 space-y-2'>
                  <li>• Négociation du prix</li>
                  <li>• Sécurisation de l&apos;achat</li>
                  <li>• Paiement sécurisé</li>
                  <li>• Récupération des documents</li>
                </ul>
              </div>

              <div className='bg-gray-50 p-6 rounded-lg'>
                <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                  🚛 Transport & Livraison
                </h3>
                <ul className='text-gray-600 space-y-2'>
                  <li>• Organisation du transport</li>
                  <li>• Suivi en temps réel</li>
                  <li>• Livraison à domicile</li>
                  <li>• Remise des clés</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Processus Dynamique */}
          <div className='bg-linear-to-br from-premium-black via-premium-gray-dark to-premium-black rounded-2xl shadow-2xl p-8 mb-8 text-premium-white overflow-hidden relative'>
            {/* Background Pattern */}
            <div className='absolute inset-0 opacity-10'>
              <div className='absolute top-0 left-0 w-full h-full bg-linear-to-r from-premium-gold/20 to-transparent'></div>
              <div className='absolute bottom-0 right-0 w-64 h-64 bg-premium-gold/10 rounded-full transform translate-x-32 translate-y-32'></div>
            </div>

            <div className='relative z-10'>
              <h2 className='text-3xl font-bold text-center mb-12'>
                Comment ça marche ?
                <span className='block text-premium-gold text-lg font-normal mt-2'>
                  Un processus fluide et transparent
                </span>
              </h2>

              {/* Timeline Dynamique */}
              <div className='relative'>
                {/* Ligne de connexion */}
                <div className='absolute left-8 top-16 bottom-16 w-0.5 bg-linear-to-b from-premium-gold via-premium-gold/60 to-premium-gold'></div>

                <div className='space-y-12'>
                  {/* Étape 1 */}
                  <div className='flex items-start space-x-6 group hover:scale-105 transition-all duration-300'>
                    <div className='relative'>
                      <div className='bg-premium-gold text-premium-black w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shadow-lg group-hover:shadow-xl transition-all duration-300'>
                        1
                      </div>
                      <div className='absolute -top-2 -right-2 w-6 h-6 bg-premium-gold rounded-full animate-pulse'></div>
                    </div>
                    <div className='flex-1 bg-premium-gray-dark/50 backdrop-blur-sm rounded-xl p-6 border border-premium-gold/30 group-hover:border-premium-gold transition-all duration-300'>
                      <div className='flex items-center space-x-3 mb-3'>
                        <span className='text-2xl'>📞</span>
                        <h3 className='text-xl font-bold text-premium-gold'>
                          Vous me contactez
                        </h3>
                      </div>
                      <p className='text-premium-gray-light mb-4'>
                        Décrivez le véhicule de vos rêves via notre formulaire
                        ou par téléphone
                      </p>
                      <div className='flex flex-wrap gap-2'>
                        <span className='bg-premium-gold/20 text-premium-gold px-3 py-1 rounded-full text-sm'>
                          Formulaire en ligne
                        </span>
                        <span className='bg-premium-gold/20 text-premium-gold px-3 py-1 rounded-full text-sm'>
                          Appel téléphonique
                        </span>
                        <span className='bg-premium-gold/20 text-premium-gold px-3 py-1 rounded-full text-sm'>
                          WhatsApp
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Étape 2 */}
                  <div className='flex items-start space-x-6 group hover:scale-105 transition-all duration-300'>
                    <div className='relative'>
                      <div className='bg-premium-gold text-premium-black w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shadow-lg group-hover:shadow-xl transition-all duration-300'>
                        2
                      </div>
                      <div className='absolute -top-2 -right-2 w-6 h-6 bg-premium-gold rounded-full animate-pulse'></div>
                    </div>
                    <div className='flex-1 bg-premium-gray-dark/50 backdrop-blur-sm rounded-xl p-6 border border-premium-gold/30 group-hover:border-premium-gold transition-all duration-300'>
                      <div className='flex items-center space-x-3 mb-3'>
                        <span className='text-2xl'>🔍</span>
                        <h3 className='text-xl font-bold text-premium-gold'>
                          Recherche & Vérification
                        </h3>
                      </div>
                      <p className='text-premium-gray-light mb-4'>
                        Je parcours l&apos;Allemagne pour trouver et vérifier
                        les meilleures offres
                      </p>
                      <div className='grid grid-cols-2 gap-3 text-sm'>
                        <div className='flex items-center space-x-2'>
                          <span className='w-2 h-2 bg-premium-gold rounded-full'></span>
                          <span>Recherche ciblée</span>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <span className='w-2 h-2 bg-premium-gold rounded-full'></span>
                          <span>Contrôle technique</span>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <span className='w-2 h-2 bg-premium-gold rounded-full'></span>
                          <span>Essai routier</span>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <span className='w-2 h-2 bg-premium-gold rounded-full'></span>
                          <span>Photos détaillées</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Étape 3 */}
                  <div className='flex items-start space-x-6 group hover:scale-105 transition-all duration-300'>
                    <div className='relative'>
                      <div className='bg-premium-gold text-premium-black w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shadow-lg group-hover:shadow-xl transition-all duration-300'>
                        3
                      </div>
                      <div className='absolute -top-2 -right-2 w-6 h-6 bg-premium-gold rounded-full animate-pulse'></div>
                    </div>
                    <div className='flex-1 bg-premium-gray-dark/50 backdrop-blur-sm rounded-xl p-6 border border-premium-gold/30 group-hover:border-premium-gold transition-all duration-300'>
                      <div className='flex items-center space-x-3 mb-3'>
                        <span className='text-2xl'>🤝</span>
                        <h3 className='text-xl font-bold text-premium-gold'>
                          Négociation & Achat
                        </h3>
                      </div>
                      <p className='text-premium-gray-light mb-4'>
                        Négociation du meilleur prix et achat sécurisé avec
                        garantie
                      </p>
                      <div className='flex flex-wrap gap-2'>
                        <span className='bg-premium-gold/20 text-premium-gold px-3 py-1 rounded-full text-sm'>
                          Négociation experte
                        </span>
                        <span className='bg-premium-gold/20 text-premium-gold px-3 py-1 rounded-full text-sm'>
                          Paiement sécurisé
                        </span>
                        <span className='bg-premium-gold/20 text-premium-gold px-3 py-1 rounded-full text-sm'>
                          Documents officiels
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Étape 4 */}
                  <div className='flex items-start space-x-6 group hover:scale-105 transition-all duration-300'>
                    <div className='relative'>
                      <div className='bg-premium-gold text-premium-black w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shadow-lg group-hover:shadow-xl transition-all duration-300'>
                        4
                      </div>
                      <div className='absolute -top-2 -right-2 w-6 h-6 bg-premium-gold rounded-full animate-pulse'></div>
                    </div>
                    <div className='flex-1 bg-premium-gray-dark/50 backdrop-blur-sm rounded-xl p-6 border border-premium-gold/30 group-hover:border-premium-gold transition-all duration-300'>
                      <div className='flex items-center space-x-3 mb-3'>
                        <span className='text-2xl'>🚛</span>
                        <h3 className='text-xl font-bold text-premium-gold'>
                          Transport & Livraison
                        </h3>
                      </div>
                      <p className='text-premium-gray-light mb-4'>
                        Transport sécurisé et livraison à domicile avec suivi en
                        temps réel
                      </p>
                      <div className='grid grid-cols-2 gap-3 text-sm'>
                        <div className='flex items-center space-x-2'>
                          <span className='w-2 h-2 bg-premium-gold rounded-full'></span>
                          <span>Transport assuré</span>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <span className='w-2 h-2 bg-premium-gold rounded-full'></span>
                          <span>Suivi GPS</span>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <span className='w-2 h-2 bg-premium-gold rounded-full'></span>
                          <span>Livraison à domicile</span>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <span className='w-2 h-2 bg-premium-gold rounded-full'></span>
                          <span>Remise des clés</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className='text-center mt-12'>
                <div className='bg-premium-gold/10 backdrop-blur-sm rounded-xl p-6 border border-premium-gold/30'>
                  <h3 className='text-xl font-bold text-premium-gold mb-3'>
                    Prêt à commencer votre aventure ?
                  </h3>
                  <p className='text-premium-gray-light mb-6'>
                    Contactez-moi dès maintenant pour un devis personnalisé
                  </p>
                  <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                    <Link
                      href='/demande'
                      className='bg-premium-gold text-premium-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105'
                    >
                      Demander un devis
                    </Link>
                    <Link
                      href='/contact'
                      className='border border-premium-gold text-premium-gold px-8 py-3 rounded-lg font-semibold hover:bg-premium-gold hover:text-premium-black transition-all duration-300'
                    >
                      Me contacter
                    </Link>
                  </div>
                </div>
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
