import Hero from '../components/Hero';

export default function CGV() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        title='Conditions Générales de Vente'
        subtitle='CGV - Import Automobile'
        description="Les présentes conditions générales de vente régissent les relations contractuelles entre Vanalexcars et ses clients pour les services d'import automobile."
      />

      <div className='px-6 py-16'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white rounded-lg shadow-lg p-8 space-y-8'>
            {/* Article 1 - Objet */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Article 1 - Objet
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  Les présentes conditions générales de vente (CGV)
                  s&apos;appliquent à tous les services d&apos;import automobile
                  proposés par Vanalexcars, auto-entrepreneur spécialisé dans
                  l&apos;import de véhicules haut de gamme depuis
                  l&apos;Allemagne.
                </p>
                <p className='text-gray-700'>
                  Les services proposés incluent : recherche de véhicules,
                  vérification technique, négociation, achat, transport et
                  livraison en France.
                </p>
              </div>
            </section>

            {/* Article 2 - Services */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Article 2 - Services proposés
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <div className='space-y-4'>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-2'>
                      Forfait Essentiel :
                    </h3>
                    <ul className='text-gray-700 space-y-1 ml-4'>
                      <li>• Déplacement personnalisé en Allemagne</li>
                      <li>• Vérification et essai du véhicule</li>
                      <li>• Paiement sécurisé sur place</li>
                      <li>• Accompagnement administratif</li>
                      <li>• Rapport complet remis au client</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-2'>
                      Forfait Confort :
                    </h3>
                    <ul className='text-gray-700 space-y-1 ml-4'>
                      <li>• Tous les services du forfait Essentiel</li>
                      <li>• Organisation du rapatriement</li>
                      <li>• Suivi en temps réel du transport</li>
                      <li>• Assistance quitus fiscal</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-2'>
                      Forfait VIP Premium :
                    </h3>
                    <ul className='text-gray-700 space-y-1 ml-4'>
                      <li>• Tous les services du forfait Confort</li>
                      <li>• Assistance personnalisée 24/7</li>
                      <li>• Gestion des négociations</li>
                      <li>• Expertise technique approfondie</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Article 3 - Tarifs */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Article 3 - Tarifs et modalités de paiement
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  Les tarifs sont établis sur devis personnalisé selon le
                  véhicule recherché et les services demandés.
                </p>
                <div className='space-y-3'>
                  <p className='text-gray-700'>
                    <strong>Devis gratuit :</strong> Établi sous 24h après
                    réception de votre demande
                  </p>
                  <p className='text-gray-700'>
                    <strong>Validité :</strong> 30 jours à compter de la date
                    d&apos;émission
                  </p>
                  <p className='text-gray-700'>
                    <strong>Paiement :</strong> 50% à la commande, 50% à la
                    livraison
                  </p>
                  <p className='text-gray-700'>
                    <strong>Moyens de paiement :</strong> Virement bancaire,
                    chèque, espèces (dans la limite légale)
                  </p>
                </div>
              </div>
            </section>

            {/* Article 4 - Obligations du client */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Article 4 - Obligations du client
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  Le client s&apos;engage à :
                </p>
                <ul className='text-gray-700 space-y-2 ml-4'>
                  <li>
                    • Fournir des informations exactes sur le véhicule recherché
                  </li>
                  <li>• Respecter les délais de paiement convenus</li>
                  <li>
                    • Être disponible pour les rendez-vous de vérification
                  </li>
                  <li>
                    • Fournir les documents nécessaires à l&apos;immatriculation
                  </li>
                  <li>• Informer de tout changement de situation</li>
                </ul>
              </div>
            </section>

            {/* Article 5 - Obligations du prestataire */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Article 5 - Obligations du prestataire
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  Vanalexcars s&apos;engage à :
                </p>
                <ul className='text-gray-700 space-y-2 ml-4'>
                  <li>
                    • Effectuer une recherche approfondie selon vos critères
                  </li>
                  <li>• Vérifier l&apos;état technique du véhicule</li>
                  <li>• Négocier le meilleur prix</li>
                  <li>• Sécuriser l&apos;achat et le transport</li>
                  <li>• Fournir un rapport détaillé</li>
                  <li>• Respecter les délais convenus</li>
                </ul>
              </div>
            </section>

            {/* Article 6 - Garanties */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Article 6 - Garanties et responsabilité
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  Vanalexcars garantit la qualité de ses services et
                  s&apos;engage à effectuer les vérifications avec le plus grand
                  soin. Cependant, la responsabilité ne peut être engagée pour :
                </p>
                <ul className='text-gray-700 space-y-2 ml-4'>
                  <li>
                    • Les défauts cachés non détectables lors de la vérification
                  </li>
                  <li>• Les dommages survenus pendant le transport</li>
                  <li>
                    • Les retards dus à des circonstances indépendantes de notre
                    volonté
                  </li>
                  <li>
                    • Les problèmes administratifs liés aux démarches du client
                  </li>
                </ul>
              </div>
            </section>

            {/* Article 7 - Droit de rétractation */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Article 7 - Droit de rétractation
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-4'>
                  Conformément à l&apos;article L. 221-28 du Code de la
                  consommation, le droit de rétractation ne s&apos;applique pas
                  aux contrats de fourniture de services pleinement exécutés
                  avant la fin du délai de rétractation et dont l&apos;exécution
                  a commencé après accord préalable exprès du consommateur et
                  renoncement exprès à son droit de rétractation.
                </p>
                <p className='text-gray-700'>
                  Le client peut annuler sa commande jusqu&apos;à 24h avant le
                  déplacement en Allemagne, sous réserve de remboursement des
                  frais déjà engagés.
                </p>
              </div>
            </section>

            {/* Article 8 - Force majeure */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Article 8 - Force majeure
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700'>
                  Les parties ne pourront être tenues pour responsables si la
                  non-exécution ou le retard dans l&apos;exécution de l&apos;une
                  quelconque des obligations décrites dans les présentes est due
                  à un cas de force majeure. À ce titre, la force majeure
                  s&apos;entend de tout événement extérieur, imprévisible et
                  irrésistible au sens de l&apos;article 1148 du Code civil.
                </p>
              </div>
            </section>

            {/* Article 9 - Droit applicable */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                Article 9 - Droit applicable et juridiction
              </h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700'>
                  Les présentes CGV sont soumises à la loi française. En cas de
                  litige, les tribunaux français seront seuls compétents. Tout
                  litige sera de la compétence exclusive des tribunaux
                  d&apos;Antibes.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>Contact</h2>
              <div className='bg-gray-50 p-6 rounded-lg'>
                <p className='text-gray-700 mb-2'>
                  Pour toute question concernant ces conditions générales :
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
