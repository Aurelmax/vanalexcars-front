import Link from 'next/link';

interface VehicleDetailProps {
  vehicle: {
    id: string;
    name: string;
    price: number;
    image: string;
    year: string;
    mileage: number;
    power: number;
    owners: number;
    transmission: string;
    fuel: string;
    consumption?: number;
    co2?: number;
    location: string;
    seller: string;
    sellerType: 'Pro' | 'Particulier';
    features: string[];
    description: string;
    history: string[];
    technicalSpecs: {
      engine: string;
      displacement: string;
      acceleration: string;
      topSpeed: string;
      weight: string;
      dimensions: string;
    };
  };
}

export default function VehicleDetail({ vehicle }: VehicleDetailProps) {
  return (
    <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Hero Section */}
      <div className='bg-white rounded-2xl shadow-2xl overflow-hidden mb-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-0'>
          {/* Image */}
          <div className='relative'>
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className='w-full h-96 lg:h-full object-cover'
            />
            <div className='absolute top-4 right-4'>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  vehicle.sellerType === 'Pro'
                    ? 'bg-premium-gold text-premium-black'
                    : 'bg-gray-600 text-white'
                }`}
              >
                {vehicle.sellerType}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className='p-8'>
            <div className='mb-6'>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                {vehicle.name}
              </h1>
              <div className='text-4xl font-bold text-premium-gold mb-4'>
                {vehicle.price.toLocaleString()} €
              </div>
              <div className='flex items-center space-x-2 text-gray-600'>
                <span>📍</span>
                <span>{vehicle.location}</span>
              </div>
            </div>

            {/* Key Specs */}
            <div className='grid grid-cols-2 gap-4 mb-6'>
              <div className='bg-gray-50 p-4 rounded-lg'>
                <div className='text-sm text-gray-600'>Année</div>
                <div className='font-semibold text-gray-900'>
                  {vehicle.year}
                </div>
              </div>
              <div className='bg-gray-50 p-4 rounded-lg'>
                <div className='text-sm text-gray-600'>Kilométrage</div>
                <div className='font-semibold text-gray-900'>
                  {vehicle.mileage.toLocaleString()} km
                </div>
              </div>
              <div className='bg-gray-50 p-4 rounded-lg'>
                <div className='text-sm text-gray-600'>Puissance</div>
                <div className='font-semibold text-gray-900'>
                  {vehicle.power} CH
                </div>
              </div>
              <div className='bg-gray-50 p-4 rounded-lg'>
                <div className='text-sm text-gray-600'>Propriétaires</div>
                <div className='font-semibold text-gray-900'>
                  {vehicle.owners}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-3'>
              <Link
                href='/contact'
                className='flex-1 bg-premium-gold text-premium-black py-3 px-6 rounded-lg font-semibold hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 text-center'
              >
                Me contacter
              </Link>
              <Link
                href='/demande'
                className='flex-1 border-2 border-premium-gold text-premium-gold py-3 px-6 rounded-lg font-semibold hover:bg-premium-gold hover:text-premium-black transition-all duration-300 text-center'
              >
                Demander un devis
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Main Content */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Description */}
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              Description
            </h2>
            <p className='text-gray-700 leading-relaxed'>
              {vehicle.description}
            </p>
          </div>

          {/* Features */}
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              Équipements
            </h2>
            <div className='grid grid-cols-2 gap-3'>
              {vehicle.features.map((feature, index) => (
                <div key={index} className='flex items-center space-x-2'>
                  <span className='w-2 h-2 bg-premium-gold rounded-full'></span>
                  <span className='text-gray-700'>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specs */}
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              Caractéristiques techniques
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Moteur:</span>
                  <span className='font-semibold'>
                    {vehicle.technicalSpecs.engine}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Cylindrée:</span>
                  <span className='font-semibold'>
                    {vehicle.technicalSpecs.displacement}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Accélération:</span>
                  <span className='font-semibold'>
                    {vehicle.technicalSpecs.acceleration}
                  </span>
                </div>
              </div>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Vitesse max:</span>
                  <span className='font-semibold'>
                    {vehicle.technicalSpecs.topSpeed}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Poids:</span>
                  <span className='font-semibold'>
                    {vehicle.technicalSpecs.weight}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Dimensions:</span>
                  <span className='font-semibold'>
                    {vehicle.technicalSpecs.dimensions}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* History */}
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              Historique
            </h2>
            <div className='space-y-3'>
              {vehicle.history.map((item, index) => (
                <div key={index} className='flex items-start space-x-3'>
                  <div className='w-2 h-2 bg-premium-gold rounded-full mt-2'></div>
                  <span className='text-gray-700'>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Seller Info */}
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>Vendeur</h3>
            <div className='space-y-3'>
              <div className='flex items-center space-x-3'>
                <div className='w-10 h-10 bg-premium-gold rounded-full flex items-center justify-center'>
                  <span className='text-premium-black font-bold'>A</span>
                </div>
                <div>
                  <div className='font-semibold text-gray-900'>
                    {vehicle.seller}
                  </div>
                  <div className='text-sm text-gray-600'>
                    {vehicle.sellerType}
                  </div>
                </div>
              </div>
              <div className='pt-3 border-t border-gray-200'>
                <p className='text-sm text-gray-600'>📍 {vehicle.location}</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className='bg-gradient-to-br from-premium-gold to-yellow-500 rounded-xl p-6 text-premium-black'>
            <h3 className='text-xl font-bold mb-4'>
              Intéressé par ce véhicule ?
            </h3>
            <p className='text-sm mb-4'>
              Contactez-moi pour plus d&apos;informations ou pour organiser une
              visite en Allemagne.
            </p>
            <div className='space-y-3'>
              <Link
                href='/contact'
                className='w-full bg-premium-black text-premium-gold py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 text-center block'
              >
                Me contacter
              </Link>
              <Link
                href='/demande'
                className='w-full border-2 border-premium-black text-premium-black py-2 px-4 rounded-lg font-semibold hover:bg-premium-black hover:text-premium-gold transition-all duration-300 text-center block'
              >
                Demander un devis
              </Link>
            </div>
          </div>

          {/* Additional Info */}
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>
              Informations complémentaires
            </h3>
            <div className='space-y-3 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Transmission:</span>
                <span className='font-semibold'>{vehicle.transmission}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Carburant:</span>
                <span className='font-semibold'>{vehicle.fuel}</span>
              </div>
              {vehicle.consumption && (
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Consommation:</span>
                  <span className='font-semibold'>
                    {vehicle.consumption} l/100km
                  </span>
                </div>
              )}
              {vehicle.co2 && (
                <div className='flex justify-between'>
                  <span className='text-gray-600'>CO2:</span>
                  <span className='font-semibold'>{vehicle.co2} g/km</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
