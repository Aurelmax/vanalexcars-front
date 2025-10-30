import Image from 'next/image';

interface AdvertisementBannerProps {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function AdvertisementBanner({
  title,
  description,
  imageUrl,
  buttonText,
  buttonLink,
  backgroundColor = 'bg-gradient-to-r from-blue-600 to-purple-600',
  textColor = 'text-white',
}: AdvertisementBannerProps) {
  return (
    <div
      className={`${backgroundColor} rounded-2xl shadow-xl overflow-hidden my-8`}
    >
      <div className='grid grid-cols-1 md:grid-cols-2'>
        {/* Contenu texte */}
        <div className='p-8 flex flex-col justify-center'>
          <h2 className={`text-3xl font-bold ${textColor} mb-4`}>{title}</h2>
          <p className={`text-lg ${textColor} opacity-90 mb-6`}>
            {description}
          </p>
          <a
            href={buttonLink}
            className={`inline-flex items-center justify-center bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300`}
          >
            {buttonText}
            <svg
              className='ml-2 w-5 h-5'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </a>
        </div>

        {/* Image */}
        <div className='relative h-64 md:h-auto'>
          <Image
            src={imageUrl}
            alt={title}
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-black bg-opacity-20'></div>
        </div>
      </div>
    </div>
  );
}
