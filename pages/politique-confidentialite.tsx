import Hero from '../components/Hero';

export default function PolitiqueConfidentialite() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        title='Politique de Confidentialité'
        subtitle='Protection des Données Personnelles'
        description='Cette politique de confidentialité explique comment Vanalexcars collecte, utilise et protège vos données personnelles conformément au RGPD.'
      />

      <div className='px-6 py-16'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white rounded-lg shadow-lg p-8 space-y-8'>
            {/* Introduction */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                1. Introduction
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  Vanalexcars s&apos;engage à protéger votre vie privée et vos
                  données personnelles. Cette politique de confidentialité
                  décrit comment nous collectons, utilisons, stockons et
                  protégeons vos informations personnelles.
                </p>
                <p className='text-gray-700'>
                  Cette politique s&apos;applique à tous les services fournis
                  par Vanalexcars, y compris notre site web et nos services
                  d&apos;import automobile.
                </p>
              </div>
            </section>

            {/* Responsable du traitement */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                2. Responsable du traitement
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-2'>
                  <strong>Responsable :</strong> Alexandre - Vanalexcars
                </p>
                <p className='text-gray-700 mb-2'>
                  <strong>Adresse :</strong> 123 Rue Exemple, 06160 Antibes,
                  France
                </p>
                <p className='text-gray-700 mb-2'>
                  <strong>Email :</strong> contact@vanalexcars.fr
                </p>
                <p className='text-gray-700'>
                  <strong>Téléphone :</strong> +33 6 12 34 56 78
                </p>
              </div>
            </section>

            {/* Données collectées */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                3. Données personnelles collectées
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  Nous collectons les données suivantes :
                </p>
                <div className='space-y-4'>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-2'>
                      Données d&apos;identification :
                    </h3>
                    <ul className='text-gray-700 space-y-1 ml-4'>
                      <li>• Nom et prénom</li>
                      <li>• Adresse email</li>
                      <li>• Numéro de téléphone</li>
                      <li>• Adresse postale</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-2'>
                      Données de navigation :
                    </h3>
                    <ul className='text-gray-700 space-y-1 ml-4'>
                      <li>• Adresse IP</li>
                      <li>• Type de navigateur</li>
                      <li>• Pages visitées</li>
                      <li>• Durée de visite</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-2'>
                      Données commerciales :
                    </h3>
                    <ul className='text-gray-700 space-y-1 ml-4'>
                      <li>• Préférences de véhicules</li>
                      <li>• Historique des demandes</li>
                      <li>• Communications</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Finalités */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                4. Finalités du traitement
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  Vos données sont utilisées pour :
                </p>
                <ul className='text-gray-700 space-y-2 ml-4'>
                  <li>• Traiter vos demandes d&apos;import automobile</li>
                  <li>• Vous contacter concernant nos services</li>
                  <li>• Améliorer la qualité de nos services</li>
                  <li>• Respecter nos obligations légales</li>
                  <li>• Gérer la relation client</li>
                  <li>
                    • Envoyer des informations commerciales (avec votre
                    consentement)
                  </li>
                </ul>
              </div>
            </section>

            {/* Base légale */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                5. Base légale du traitement
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <div className='space-y-3'>
                  <p className='text-gray-700'>
                    <strong>Consentement :</strong> Pour l&apos;envoi de
                    communications commerciales
                  </p>
                  <p className='text-gray-700'>
                    <strong>Exécution du contrat :</strong> Pour la fourniture
                    de nos services
                  </p>
                  <p className='text-gray-700'>
                    <strong>Intérêt légitime :</strong> Pour l&apos;amélioration
                    de nos services
                  </p>
                  <p className='text-gray-700'>
                    <strong>Obligation légale :</strong> Pour respecter les
                    obligations comptables et fiscales
                  </p>
                </div>
              </div>
            </section>

            {/* Durée de conservation */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                6. Durée de conservation
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <div className='space-y-3'>
                  <p className='text-gray-700'>
                    <strong>Données clients :</strong> 3 ans après le dernier
                    contact
                  </p>
                  <p className='text-gray-700'>
                    <strong>Données comptables :</strong> 10 ans (obligation
                    légale)
                  </p>
                  <p className='text-gray-700'>
                    <strong>Données de navigation :</strong> 13 mois maximum
                  </p>
                  <p className='text-gray-700'>
                    <strong>Données marketing :</strong> Jusqu&apos;au retrait
                    du consentement
                  </p>
                </div>
              </div>
            </section>

            {/* Partage des données */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                7. Partage des données
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  Vos données personnelles ne sont pas vendues, louées ou
                  partagées avec des tiers, sauf dans les cas suivants :
                </p>
                <ul className='text-gray-700 space-y-2 ml-4'>
                  <li>• Avec votre consentement explicite</li>
                  <li>• Pour respecter une obligation légale</li>
                  <li>
                    • Avec nos prestataires techniques (sous contrat de
                    confidentialité)
                  </li>
                  <li>
                    • En cas de fusion ou acquisition de l&apos;entreprise
                  </li>
                </ul>
              </div>
            </section>

            {/* Sécurité */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                8. Sécurité des données
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  Nous mettons en œuvre des mesures techniques et
                  organisationnelles appropriées pour protéger vos données :
                </p>
                <ul className='text-gray-700 space-y-2 ml-4'>
                  <li>• Chiffrement des données sensibles</li>
                  <li>• Accès restreint aux données personnelles</li>
                  <li>• Sauvegardes régulières et sécurisées</li>
                  <li>• Formation du personnel à la protection des données</li>
                  <li>• Mise à jour régulière des systèmes de sécurité</li>
                </ul>
              </div>
            </section>

            {/* Vos droits */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                9. Vos droits
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <div className='space-y-3'>
                  <p className='text-gray-700'>
                    <strong>Droit d&apos;accès :</strong> Connaître les données
                    que nous détenons sur vous
                  </p>
                  <p className='text-gray-700'>
                    <strong>Droit de rectification :</strong> Corriger des
                    données inexactes
                  </p>
                  <p className='text-gray-700'>
                    <strong>Droit d&apos;effacement :</strong> Demander la
                    suppression de vos données
                  </p>
                  <p className='text-gray-700'>
                    <strong>Droit de limitation :</strong> Limiter le traitement
                    de vos données
                  </p>
                  <p className='text-gray-700'>
                    <strong>Droit de portabilité :</strong> Récupérer vos
                    données dans un format structuré
                  </p>
                  <p className='text-gray-700'>
                    <strong>Droit d&apos;opposition :</strong> Vous opposer au
                    traitement de vos données
                  </p>
                </div>
                <p className='text-gray-700 mt-4'>
                  Pour exercer ces droits, contactez-nous à :
                  contact@vanalexcars.fr
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                10. Cookies
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  Notre site utilise uniquement des cookies techniques
                  nécessaires au bon fonctionnement. Aucun cookie de tracking ou
                  de publicité n&apos;est utilisé.
                </p>
                <p className='text-gray-700'>
                  Vous pouvez configurer votre navigateur pour refuser les
                  cookies, mais cela pourrait affecter le bon fonctionnement du
                  site.
                </p>
              </div>
            </section>

            {/* Modifications */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                11. Modifications de la politique
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700'>
                  Cette politique de confidentialité peut être modifiée à tout
                  moment. Toute modification sera publiée sur cette page avec la
                  date de mise à jour. Nous vous informerons par email en cas de
                  modification substantielle.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                12. Contact
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-2'>
                  Pour toute question concernant cette politique de
                  confidentialité :
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
