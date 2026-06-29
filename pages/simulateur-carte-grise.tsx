import Link from 'next/link';
import Hero from '../components/Hero';

const SIMULATEUR_URL =
  'https://www.service-public.gouv.fr/simulateur/calcul/cout-certificat-immatriculation';

export default function SimulateurCarteGrise() {
  return (
    <>
      <Hero
        title="Calculez le coût réel de votre carte grise avant d'importer"
        subtitle='Simulateur carte grise & malus écologique'
        description="Avant tout engagement, VanalexCars vous communique une estimation complète des frais d'immatriculation. Aucune mauvaise surprise après la livraison."
        primaryButton={{ text: 'Accéder au simulateur officiel', href: SIMULATEUR_URL }}
        secondaryButton={{ text: 'Me faire accompagner', href: '/demande' }}
      />

      <div className='px-6 py-16'>
        <div className='max-w-3xl mx-auto space-y-10'>

          {/* Intro */}
          <div className='bg-amber-50 border border-amber-200 rounded-2xl p-8 flex gap-5'>
            <span className='text-3xl shrink-0'>⚠️</span>
            <div>
              <h2 className='text-lg font-bold text-gray-900 mb-2'>
                Le CPI n'est qu'un document provisoire
              </h2>
              <p className='text-gray-700 leading-relaxed'>
                Lors de la livraison de votre véhicule importé, vous recevez un <strong>Certificat Provisoire d'Immatriculation (CPI)</strong> — valable 30 jours. Ce document vous permet de circuler légalement le temps que votre carte grise définitive soit établie. C'est lors de cette démarche définitive que sont calculés et prélevés le <strong>malus écologique</strong> et les <strong>taxes régionales</strong> sur le certificat d'immatriculation. Ces montants peuvent représenter plusieurs milliers d'euros selon le véhicule.
              </p>
            </div>
          </div>

          {/* Pourquoi c'est important */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>
              Pourquoi c'est important ?
            </h2>
            <div className='space-y-5'>
              {[
                {
                  icon: '💶',
                  title: 'Le malus écologique peut être élevé',
                  desc: "Pour les véhicules essence à fort CO₂ (berlines sportives, SUV puissants), le malus écologique peut atteindre plusieurs milliers d'euros, voire dépasser 10 000 € pour les voitures les plus polluantes. Ce montant n'est pas inclus dans le prix d'achat du véhicule.",
                },
                {
                  icon: '🗺️',
                  title: 'Le coût de la carte grise varie selon votre région',
                  desc: "Le tarif du cheval fiscal est fixé par chaque région française. Deux acheteurs du même véhicule paieront une carte grise différente selon qu'ils habitent en Île-de-France, en Bretagne ou en PACA.",
                },
                {
                  icon: '📋',
                  title: 'Ces frais ne sont pas inclus dans notre forfait',
                  desc: "Notre forfait d'importation de 1 490 € TTC couvre la recherche, la vérification, la négociation, le transport et les démarches administratives. La carte grise et le malus sont des frais réglementaires que vous réglez directement à l'administration.",
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className='flex gap-4'>
                  <span className='text-2xl shrink-0 mt-0.5'>{icon}</span>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-1'>{title}</h3>
                    <p className='text-gray-600 text-sm leading-relaxed'>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ce que VanalexCars vérifie */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>
              Ce que VanalexCars vérifie pour vous
            </h2>
            <ul className='space-y-4'>
              {[
                {
                  label: 'Estimation du malus écologique',
                  detail: 'Calculé à partir du taux de CO₂ homologué du véhicule et du barème en vigueur. Transmis avant tout engagement de votre part.',
                },
                {
                  label: 'Estimation de la carte grise',
                  detail: 'Selon votre région et la puissance fiscale du véhicule, nous vous fournissons une fourchette indicative.',
                },
                {
                  label: "Vérification de l'éligibilité à l'homologation",
                  detail: "Certains véhicules hors Union Européenne nécessitent des démarches supplémentaires. Nous le détectons avant l'achat.",
                },
                {
                  label: "Synthèse du coût total d'importation",
                  detail: 'Prix véhicule + forfait 1 490 € + transport + malus estimé + carte grise estimée. Tout est posé sur la table avant que vous ne signiez quoi que ce soit.',
                },
              ].map(({ label, detail }) => (
                <li key={label} className='flex items-start gap-4 p-4 bg-gray-50 rounded-xl'>
                  <svg className='w-5 h-5 text-yellow-500 shrink-0 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                  </svg>
                  <div>
                    <p className='font-semibold text-gray-900 text-sm'>{label}</p>
                    <p className='text-gray-500 text-sm mt-0.5 leading-relaxed'>{detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Aucune mauvaise surprise */}
          <div className='bg-gray-900 text-white rounded-2xl p-8'>
            <div className='flex items-center gap-3 mb-4'>
              <span className='text-yellow-400 text-2xl'>✅</span>
              <h2 className='text-xl font-bold text-white'>Aucune mauvaise surprise</h2>
            </div>
            <p className='text-gray-300 leading-relaxed mb-6'>
              Chez VanalexCars, vous ne signez le mandat et ne versez l'acompte qu'après avoir reçu le dossier complet du véhicule — photos, historique CarVertical, prix net, coût de transport, estimation du malus et de la carte grise. Vous connaissez le coût total avant de vous engager.
            </p>
            <p className='text-gray-300 leading-relaxed mb-6'>
              Nous vous accompagnons ensuite jusqu'à la réception de votre carte grise définitive. Le CPI n'est qu'une étape — nous gérons la suite.
            </p>
            <div className='bg-white/5 border border-white/10 rounded-xl p-5 text-sm text-gray-400 italic'>
              Les montants indiqués sont des estimations basées sur les barèmes officiels en vigueur. Seul le simulateur de l'administration française et les services compétents font foi. VanalexCars ne peut être tenu responsable d'une variation du montant final lié à une évolution réglementaire.
            </div>
          </div>

          {/* CTA simulateur */}
          <div className='bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center'>
            <h2 className='text-2xl font-bold text-gray-900 mb-3'>
              Calculez votre coût d'immatriculation
            </h2>
            <p className='text-gray-600 mb-2'>
              Le simulateur officiel du gouvernement français vous permet d'estimer le coût exact de votre carte grise selon votre région, la puissance fiscale et le taux de CO₂ du véhicule.
            </p>
            <p className='text-xs text-gray-400 mb-8'>
              Munissez-vous de la fiche technique du véhicule (puissance fiscale en CV, taux de CO₂ en g/km).
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <a
                href={SIMULATEUR_URL}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center justify-center gap-2 bg-yellow-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all duration-300 hover:scale-105'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
                </svg>
                Accéder au simulateur officiel
              </a>
              <Link
                href='/demande'
                className='inline-flex items-center justify-center gap-2 border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-900 hover:text-white transition-all duration-300'
              >
                Me faire accompagner pour mon import
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
