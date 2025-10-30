import Image from 'next/image';

interface Testimonial {
  id: string;
  title: string;
  testimonial: string;
  author: string;
  author_info?: {
    location?: string;
    vehicle_purchased?: string;
  };
  rating: number;
  status: string;
  featured: boolean;
  avatar?: any;
}

interface TestimonialsGridProps {
  testimonials: Testimonial[];
  title?: string;
  showLoadMore?: boolean;
  limit?: number;
}

export default function TestimonialsGrid({
  testimonials,
  title = 'Témoignages Clients',
  showLoadMore = true,
  limit = 3,
}: TestimonialsGridProps) {
  const displayedTestimonials = testimonials.slice(0, limit);

  if (displayedTestimonials.length === 0) {
    return (
      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <p className='text-gray-600'>
              Aucun témoignage disponible pour le moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='py-12 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {title && (
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>{title}</h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Ce que disent nos clients satisfaits
            </p>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {displayedTestimonials.map(testimonial => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {showLoadMore && testimonials.length > limit && (
          <div className='text-center mt-12'>
            <button className='bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors'>
              Voir tous les témoignages
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill='currentColor'
        viewBox='0 0 20 20'
      >
        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
      </svg>
    ));
  };

  return (
    <div className='bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'>
      <div className='flex items-center mb-4'>
        {testimonial.avatar?.url ? (
          <Image
            src={testimonial.avatar.url}
            alt={testimonial.author}
            width={48}
            height={48}
            className='w-12 h-12 rounded-full object-cover mr-4'
          />
        ) : (
          <div className='w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4'>
            <span className='text-yellow-600 font-semibold text-lg'>
              {testimonial.author.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <h4 className='font-semibold text-gray-900'>{testimonial.author}</h4>
          {testimonial.author_info?.location && (
            <p className='text-sm text-gray-600'>
              {testimonial.author_info.location}
            </p>
          )}
        </div>
      </div>

      <div className='flex items-center mb-3'>
        {renderStars(testimonial.rating)}
      </div>

      <h3 className='font-semibold text-gray-900 mb-2'>{testimonial.title}</h3>

      <p className='text-gray-600 text-sm leading-relaxed mb-4'>
        {testimonial.testimonial}
      </p>

      {testimonial.author_info?.vehicle_purchased && (
        <div className='text-xs text-gray-500 border-t pt-3'>
          <span className='font-medium'>Véhicule acheté :</span>{' '}
          {testimonial.author_info.vehicle_purchased}
        </div>
      )}
    </div>
  );
}
