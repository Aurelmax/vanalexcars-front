import Hero from '../components/Hero';

export default function MentionsLegales() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        title='Mentions Légales'
        subtitle='Informations légales et réglementaires'
        description="Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, nous vous informons de l'identité des différents intervenants dans le cadre de notre site."
        showCar={false}
      />

      <div className='px-6 py-16'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white rounded-lg shadow-lg p-8 space-y-8'>
            {/* Éditeur du site */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Éditeur du site
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-2'>
                  <strong>Raison sociale :</strong> Vanalexcars
                </p>
                <p className='text-gray-700 mb-2'>
                  <strong>Forme juridique :</strong> Auto-entrepreneur
                </p>
                <p className='text-gray-700 mb-2'>
                  <strong>Adresse :</strong> 123 Rue Exemple, 06160 Antibes,
                  France
                </p>
                <p className='text-gray-700 mb-2'>
                  <strong>Téléphone :</strong> +33 6 12 34 56 78
                </p>
                <p className='text-gray-700 mb-2'>
                  <strong>Email :</strong> contact@vanalexcars.fr
                </p>
                <p className='text-gray-700 mb-2'>
                  <strong>SIRET :</strong> 123 456 789 00012
                </p>
                <p className='text-gray-700'>
                  <strong>Code APE :</strong> 4511Z - Commerce de voitures et de
                  véhicules automobiles légers
                </p>
              </div>
            </section>

            {/* Directeur de publication */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Directeur de publication
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700'>
                  Alexandre - Gérant de Vanalexcars
                </p>
                <p className='text-gray-700'>Email : contact@vanalexcars.fr</p>
              </div>
            </section>

            {/* Hébergement */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Hébergement
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700'>
                  Le site est hébergé par Vercel Inc.
                </p>
                <p className='text-gray-700'>
                  Adresse : 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis
                </p>
                <p className='text-gray-700'>Site web : https://vercel.com</p>
              </div>
            </section>

            {/* Propriété intellectuelle */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Propriété intellectuelle
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  L&apos;ensemble de ce site relève de la législation française
                  et internationale sur le droit d&apos;auteur et la propriété
                  intellectuelle. Tous les droits de reproduction sont réservés,
                  y compris pour les documents téléchargeables et les
                  représentations iconographiques et photographiques.
                </p>
                <p className='text-gray-700'>
                  La reproduction de tout ou partie de ce site sur un support
                  électronique quel qu&apos;il soit est formellement interdite
                  sauf autorisation expresse du directeur de la publication.
                </p>
              </div>
            </section>

            {/* Protection des données */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Protection des données personnelles
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  Conformément au Règlement Général sur la Protection des
                  Données (RGPD), nous nous engageons à protéger vos données
                  personnelles.
                </p>
                <div className='space-y-3'>
                  <p className='text-gray-700'>
                    <strong>Données collectées :</strong> Nom, prénom, adresse
                    email, numéro de téléphone, informations sur les véhicules
                    recherchés.
                  </p>
                  <p className='text-gray-700'>
                    <strong>Finalité :</strong> Traitement de vos demandes
                    d&apos;import automobile et communication commerciale.
                  </p>
                  <p className='text-gray-700'>
                    <strong>Base légale :</strong> Consentement et intérêt
                    légitime.
                  </p>
                  <p className='text-gray-700'>
                    <strong>Durée de conservation :</strong> 3 ans après le
                    dernier contact.
                  </p>
                  <p className='text-gray-700'>
                    <strong>Vos droits :</strong> Accès, rectification,
                    suppression, portabilité, limitation, opposition.
                  </p>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>Cookies</h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  Ce site utilise des cookies techniques nécessaires au bon
                  fonctionnement du site. Aucun cookie de tracking ou de
                  publicité n&apos;est utilisé.
                </p>
                <p className='text-gray-700'>
                  Vous pouvez configurer votre navigateur pour refuser les
                  cookies, mais cela pourrait affecter le bon fonctionnement du
                  site.
                </p>
              </div>
            </section>

            {/* Responsabilité */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Limitation de responsabilité
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  Les informations contenues sur ce site sont aussi précises que
                  possible et le site remis à jour à différentes périodes de
                  l&apos;année, mais peut toutefois contenir des inexactitudes
                  ou des omissions.
                </p>
                <p className='text-gray-700'>
                  Vanalexcars ne saurait être tenu responsable des erreurs ou
                  omissions, ni de l&apos;utilisation des informations, et de
                  l&apos;utilisation qui pourrait en être faite par des tiers.
                </p>
              </div>
            </section>

            {/* Droit applicable */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Droit applicable
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700'>
                  Tout litige en relation avec l&apos;utilisation du site
                  vanalexcars.fr est soumis au droit français. Il est fait
                  attribution exclusive de juridiction aux tribunaux compétents
                  d&apos;Antibes.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>Contact</h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-2'>
                  Pour toute question concernant ces mentions légales :
                </p>
                <p className='text-gray-700 mb-2'>
                  Email : contact@vanalexcars.fr
                </p>
                <p className='text-gray-700'>Téléphone : +33 6 12 34 56 78</p>
              </div>
            </section>

            <div className='text-center pt-8 border-t border-gray-200'>
              <p className='text-sm text-gray-500'>
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
