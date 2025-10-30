import Link from 'next/link';
import Hero from '../components/Hero';

export default function ConditionsUtilisation() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        title="Conditions d'Utilisation"
        subtitle="Règles d'utilisation du site"
        description="Ces conditions d'utilisation définissent les règles et conditions d'accès et d'utilisation du site Vanalexcars."
      />

      <div className='px-6 py-16'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white rounded-lg shadow-lg p-8 space-y-8'>
            {/* Article 1 - Acceptation */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Article 1 - Acceptation des conditions
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  L&apos;accès et l&apos;utilisation du site vanalexcars.fr
                  impliquent l&apos;acceptation pleine et entière des présentes
                  conditions d&apos;utilisation.
                </p>
                <p className='text-gray-700'>
                  Si vous n&apos;acceptez pas ces conditions, veuillez ne pas
                  utiliser ce site.
                </p>
              </div>
            </section>

            {/* Article 2 - Objet */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Article 2 - Objet du site
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  Le site vanalexcars.fr a pour objet de présenter les services
                  d&apos;import automobile proposés par Vanalexcars,
                  auto-entrepreneur spécialisé dans l&apos;import de véhicules
                  haut de gamme depuis l&apos;Allemagne.
                </p>
                <p className='text-gray-700'>
                  Les services incluent : recherche de véhicules, vérification
                  technique, négociation, achat, transport et livraison en
                  France.
                </p>
              </div>
            </section>

            {/* Article 3 - Accès */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Article 3 - Accès au site
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  L&apos;accès au site est libre et gratuit. Cependant,
                  Vanalexcars se réserve le droit d&apos;interrompre
                  temporairement ou définitivement l&apos;accès au site pour des
                  raisons de maintenance ou de mise à jour.
                </p>
                <p className='text-gray-700'>
                  L&apos;utilisateur est responsable de la configuration de son
                  équipement informatique pour accéder au site.
                </p>
              </div>
            </section>

            {/* Article 4 - Utilisation */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Article 4 - Utilisation du site
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  L&apos;utilisateur s&apos;engage à utiliser le site de manière
                  licite et à :
                </p>
                <ul className='text-gray-700 space-y-2 ml-4'>
                  <li>• Respecter les droits de propriété intellectuelle</li>
                  <li>
                    • Ne pas porter atteinte à l&apos;ordre public et aux bonnes
                    mœurs
                  </li>
                  <li>
                    • Ne pas diffuser de contenu illégal, diffamatoire ou
                    offensant
                  </li>
                  <li>
                    • Ne pas tenter de pirater ou d&apos;endommager le site
                  </li>
                  <li>• Fournir des informations exactes lors des demandes</li>
                  <li>• Respecter la vie privée des autres utilisateurs</li>
                </ul>
              </div>
            </section>

            {/* Article 5 - Propriété intellectuelle */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Article 5 - Propriété intellectuelle
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  L&apos;ensemble du contenu du site (textes, images, vidéos,
                  logos, etc.) est protégé par le droit de la propriété
                  intellectuelle et appartient à Vanalexcars ou à ses
                  partenaires.
                </p>
                <p className='text-gray-700 mb-4'>
                  Toute reproduction, représentation, modification, publication,
                  adaptation de tout ou partie des éléments du site est
                  interdite, sauf autorisation écrite préalable.
                </p>
                <p className='text-gray-700'>
                  L&apos;utilisation non autorisée du site ou de l&apos;un
                  quelconque des éléments qu&apos;il contient sera considérée
                  comme constitutive d&apos;une contrefaçon et poursuivie.
                </p>
              </div>
            </section>

            {/* Article 6 - Responsabilité */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Article 6 - Limitation de responsabilité
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  Vanalexcars s&apos;efforce de fournir des informations exactes
                  et à jour sur le site. Cependant, nous ne pouvons garantir
                  l&apos;exactitude, la précision ou l&apos;exhaustivité des
                  informations mises à disposition.
                </p>
                <p className='text-gray-700 mb-4'>
                  Vanalexcars ne saurait être tenu responsable :
                </p>
                <ul className='text-gray-700 space-y-2 ml-4'>
                  <li>
                    • Des dommages directs ou indirects causés au matériel de
                    l&apos;utilisateur
                  </li>
                  <li>• De la perte de données ou de programmes</li>
                  <li>• Des conséquences de l&apos;utilisation du site</li>
                  <li>• Des interruptions de service</li>
                  <li>• Des virus ou autres éléments nuisibles</li>
                </ul>
              </div>
            </section>

            {/* Article 7 - Liens externes */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Article 7 - Liens externes
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  Le site peut contenir des liens vers d&apos;autres sites web.
                  Vanalexcars n&apos;exerce aucun contrôle sur ces sites et
                  décline toute responsabilité quant à leur contenu ou leur
                  politique de confidentialité.
                </p>
                <p className='text-gray-700'>
                  L&apos;insertion de liens vers le site vanalexcars.fr sur
                  d&apos;autres sites est autorisée sous réserve de ne pas
                  porter atteinte à l&apos;image de Vanalexcars.
                </p>
              </div>
            </section>

            {/* Article 8 - Données personnelles */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Article 8 - Données personnelles
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  La collecte et le traitement des données personnelles sont
                  régis par notre
                  <Link
                    href='/politique-confidentialite'
                    className='text-premium-gold hover:underline'
                  >
                    {' '}
                    Politique de Confidentialité
                  </Link>
                  .
                </p>
                <p className='text-gray-700'>
                  En utilisant le site, vous acceptez la collecte et
                  l&apos;utilisation de vos données personnelles conformément à
                  cette politique.
                </p>
              </div>
            </section>

            {/* Article 9 - Cookies */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Article 9 - Cookies
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  Le site utilise des cookies techniques nécessaires au bon
                  fonctionnement. Aucun cookie de tracking ou de publicité
                  n&apos;est utilisé.
                </p>
                <p className='text-gray-700'>
                  En continuant à utiliser le site, vous acceptez
                  l&apos;utilisation de ces cookies.
                </p>
              </div>
            </section>

            {/* Article 10 - Modification */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Article 10 - Modification des conditions
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  Vanalexcars se réserve le droit de modifier ces conditions
                  d&apos;utilisation à tout moment. Les modifications entrent en
                  vigueur dès leur publication sur le site.
                </p>
                <p className='text-gray-700'>
                  Il appartient à l&apos;utilisateur de consulter régulièrement
                  ces conditions. L&apos;utilisation continue du site après
                  modification vaut acceptation des nouvelles conditions.
                </p>
              </div>
            </section>

            {/* Article 11 - Droit applicable */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Article 11 - Droit applicable et juridiction
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  Les présentes conditions d&apos;utilisation sont soumises à la
                  loi française. En cas de litige, les tribunaux français seront
                  seuls compétents.
                </p>
                <p className='text-gray-700'>
                  Tout litige sera de la compétence exclusive des tribunaux
                  d&apos;Antibes.
                </p>
              </div>
            </section>

            {/* Article 12 - Contact */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Article 12 - Contact
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-2'>
                  Pour toute question concernant ces conditions
                  d&apos;utilisation :
                </p>
                <p className='text-gray-700 mb-2'>
                  Email : contact@vanalexcars.fr
                </p>
                <p className='text-gray-700 mb-2'>
                  Téléphone : +33 6 12 34 56 78
                </p>
                <p className='text-gray-700'>
                  Adresse : 123 Rue Exemple, 06160 Antibes, France
                </p>
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
