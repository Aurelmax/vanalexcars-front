import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Manifeste() {
  return (
    <>
      <Head>
        <title>Mon Manifeste | VanalexCars</title>
        <meta
          name='description'
          content="L'import automobile sur mesure, humain et transparent — au service des Azuréens en quête de leur voiture de rêve."
        />
      </Head>

      <div className='min-h-screen bg-gradient-to-b from-premium-black via-gray-950 to-black'>
        <Header />

        <main className='pt-32 pb-20'>
          <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
            {/* En-tête */}
            <div className='text-center mb-16'>
              <div className='inline-flex items-center space-x-2 mb-6'>
                <span className='text-5xl'>🚗</span>
                <h1 className='text-4xl md:text-5xl font-bold text-white'>
                  Mon Manifeste
                </h1>
              </div>
              <p className='text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto'>
                L&apos;import automobile sur mesure, humain et transparent — au service
                des Azuréens en quête de leur voiture de rêve.
              </p>
            </div>

            {/* Contenu */}
            <div className='space-y-12'>
              {/* 1. Ma conviction */}
              <section className='bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-premium-gold/50 transition-all duration-300'>
                <div className='flex items-start space-x-4'>
                  <div className='flex-shrink-0 w-12 h-12 bg-premium-gold rounded-full flex items-center justify-center'>
                    <span className='text-2xl font-bold text-premium-black'>1</span>
                  </div>
                  <div className='flex-1'>
                    <h2 className='text-2xl font-bold text-white mb-4'>Ma conviction</h2>
                    <div className='space-y-3 text-gray-300 leading-relaxed'>
                      <p>
                        <strong className='text-white'>Importer une voiture n&apos;est pas une course au prix.</strong><br />
                        C&apos;est une affaire de confiance, de méthode et de respect.
                      </p>
                      <p>
                        Je préfère un seul client heureux plutôt qu&apos;une centaine de visiteurs indécis.
                      </p>
                      <p className='text-premium-gold font-medium'>
                        Je crois à la clarté, à la rigueur et à la satisfaction durable.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Mon parcours */}
              <section className='bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-premium-gold/50 transition-all duration-300'>
                <div className='flex items-start space-x-4'>
                  <div className='flex-shrink-0 w-12 h-12 bg-premium-gold rounded-full flex items-center justify-center'>
                    <span className='text-2xl font-bold text-premium-black'>2</span>
                  </div>
                  <div className='flex-1'>
                    <h2 className='text-2xl font-bold text-white mb-4'>Mon parcours</h2>
                    <div className='space-y-3 text-gray-300 leading-relaxed'>
                      <p>
                        Avant d&apos;avoir un site, j&apos;ai <strong className='text-white'>roulé, cherché, négocié</strong>.
                      </p>
                      <p>
                        J&apos;ai visité des concessions allemandes, rencontré des vendeurs sérieux et d&apos;autres moins.
                        J&apos;ai appris à reconnaître les bons dossiers, les pièges, les fausses promesses.
                      </p>
                      <p>
                        Aujourd&apos;hui, cette expérience me permet d&apos;accompagner ceux qui veulent importer leur voiture
                        <strong className='text-white'> sans stress, en toute transparence</strong>.
                      </p>
                      <p className='text-premium-gold font-medium border-l-4 border-premium-gold pl-4'>
                        Je travaille seul, je n&apos;ai rien à cacher.<br />
                        Je préfère qu&apos;on voie la personne derrière le service.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Ma différence */}
              <section className='bg-gradient-to-br from-premium-gold/10 to-transparent border border-premium-gold/30 rounded-2xl p-8 hover:border-premium-gold/70 transition-all duration-300'>
                <div className='flex items-start space-x-4'>
                  <div className='flex-shrink-0 w-12 h-12 bg-premium-gold rounded-full flex items-center justify-center'>
                    <span className='text-2xl font-bold text-premium-black'>3</span>
                  </div>
                  <div className='flex-1'>
                    <h2 className='text-2xl font-bold text-white mb-4'>Ma différence</h2>
                    <div className='space-y-3 text-gray-300 leading-relaxed'>
                      <p className='text-lg text-white font-medium'>
                        Je ne vends pas des voitures, j&apos;accompagne des projets.
                      </p>
                      <p>
                        Je ne promets pas la moins chère, mais <strong className='text-premium-gold'>la bonne voiture, au bon moment</strong>.
                      </p>
                      <p>
                        Chaque dossier est traité comme si c&apos;était le mien.
                      </p>
                      <p className='text-white font-medium'>
                        Pas de bluff, pas de volume, pas de discours commercial — juste du travail précis, humain et propre.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. Ma méthode */}
              <section className='bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-premium-gold/50 transition-all duration-300'>
                <div className='flex items-start space-x-4'>
                  <div className='flex-shrink-0 w-12 h-12 bg-premium-gold rounded-full flex items-center justify-center'>
                    <span className='text-2xl font-bold text-premium-black'>4</span>
                  </div>
                  <div className='flex-1'>
                    <h2 className='text-2xl font-bold text-white mb-6'>Ma méthode</h2>
                    <div className='space-y-4'>
                      {[
                        {
                          icon: '👂',
                          text: 'Écouter le besoin, comprendre le profil et le budget réel.',
                        },
                        {
                          icon: '🔍',
                          text: 'Rechercher la meilleure opportunité dans mon réseau de partenaires allemands.',
                        },
                        {
                          icon: '✅',
                          text: 'Vérifier chaque document, chaque détail, chaque garantie.',
                        },
                        {
                          icon: '🚚',
                          text: "Organiser le transport, les formalités, l'immatriculation.",
                        },
                        {
                          icon: '🔑',
                          text: 'Remettre la voiture prête à rouler, sans mauvaise surprise.',
                        },
                      ].map((step, index) => (
                        <div
                          key={index}
                          className='flex items-start space-x-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-premium-gold/50 transition-all'
                        >
                          <span className='text-2xl flex-shrink-0'>{step.icon}</span>
                          <p className='text-gray-300 leading-relaxed'>{step.text}</p>
                        </div>
                      ))}
                    </div>
                    <p className='text-premium-gold font-medium mt-6 text-center text-lg'>
                      C&apos;est un métier d&apos;artisan, pas une plateforme de clics.
                    </p>
                  </div>
                </div>
              </section>

              {/* 5. Mon rapport au digital */}
              <section className='bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-premium-gold/50 transition-all duration-300'>
                <div className='flex items-start space-x-4'>
                  <div className='flex-shrink-0 w-12 h-12 bg-premium-gold rounded-full flex items-center justify-center'>
                    <span className='text-2xl font-bold text-premium-black'>5</span>
                  </div>
                  <div className='flex-1'>
                    <h2 className='text-2xl font-bold text-white mb-4'>Mon rapport au digital</h2>
                    <div className='space-y-3 text-gray-300 leading-relaxed'>
                      <p>
                        <strong className='text-white'>La technologie m&apos;aide, mais elle ne me remplace pas.</strong>
                      </p>
                      <p>
                        Je m&apos;en sers pour automatiser ce qui doit l&apos;être — jamais la relation.
                      </p>
                      <p className='text-white'>
                        Le site, les outils, l&apos;IA : tout ça existe pour que je puisse passer{' '}
                        <span className='text-premium-gold font-medium'>plus de temps avec mes clients, pas moins</span>.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 6. Mon engagement */}
              <section className='bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-premium-gold/50 transition-all duration-300'>
                <div className='flex items-start space-x-4'>
                  <div className='flex-shrink-0 w-12 h-12 bg-premium-gold rounded-full flex items-center justify-center'>
                    <span className='text-2xl font-bold text-premium-black'>6</span>
                  </div>
                  <div className='flex-1'>
                    <h2 className='text-2xl font-bold text-white mb-6'>Mon engagement</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {[
                        {
                          icon: '🤝',
                          title: 'Partenaires de confiance',
                          desc: "avec qui j'ai déjà travaillé",
                        },
                        {
                          icon: '💬',
                          title: 'Communication directe',
                          desc: 'sans jargon ni langue de bois',
                        },
                        {
                          icon: '💰',
                          title: 'Tarifs clairs',
                          desc: 'annoncés dès le départ',
                        },
                        {
                          icon: '🎯',
                          title: 'Suivi humain',
                          desc: "jusqu'à la remise des clés",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className='p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-premium-gold/50 transition-all'
                        >
                          <div className='flex items-center space-x-3 mb-2'>
                            <span className='text-2xl'>{item.icon}</span>
                            <h3 className='font-semibold text-white'>{item.title}</h3>
                          </div>
                          <p className='text-gray-400 text-sm'>{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* 7. Mon ambition */}
              <section className='bg-gradient-to-br from-premium-gold/20 via-premium-gold/10 to-transparent border border-premium-gold rounded-2xl p-8'>
                <div className='flex items-start space-x-4'>
                  <div className='flex-shrink-0 w-12 h-12 bg-premium-gold rounded-full flex items-center justify-center'>
                    <span className='text-2xl font-bold text-premium-black'>7</span>
                  </div>
                  <div className='flex-1'>
                    <h2 className='text-2xl font-bold text-white mb-6'>Mon ambition</h2>
                    <div className='text-center space-y-4'>
                      <p className='text-gray-300 text-lg'>
                        Faire de{' '}
                        <span className='font-bold text-premium-gold'>
                          import-voiture-allemagne.fr
                        </span>
                      </p>
                      <p className='text-2xl font-bold text-white leading-relaxed'>
                        la référence pour les Azuréens qui veulent importer leur voiture en
                        toute confiance.
                      </p>
                      <div className='space-y-2 pt-4'>
                        <p className='text-gray-400'>Pas la plus grosse plateforme,</p>
                        <p className='text-premium-gold font-semibold text-xl'>
                          mais la plus sincère, la plus locale, la plus humaine.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Signature */}
              <div className='text-center pt-8 pb-4'>
                <div className='inline-block'>
                  <div className='space-y-4'>
                    <div className='text-3xl font-bold text-premium-gold'>✍️</div>
                    <div className='space-y-2'>
                      <p className='text-2xl font-bold text-white'>Aurélien Lavayssière</p>
                      <div className='h-px bg-gradient-to-r from-transparent via-premium-gold to-transparent'></div>
                      <p className='text-gray-300 italic'>
                        VanalexCars — L&apos;import automobile sur mesure,<br />
                        par un professionnel qui aime son métier.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className='text-center pt-8'>
                <a
                  href='/contact'
                  className='inline-flex items-center space-x-3 bg-premium-gold hover:bg-premium-gold/90 text-premium-black font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-premium-gold/50'
                >
                  <span>Parlons de votre projet</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
