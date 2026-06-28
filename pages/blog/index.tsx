import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Author {
  id: string;
  name: string;
}

interface Category {
  id: string;
  title: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: {
    url: string;
    alt?: string;
  };
  categories?: Category[];
  publishedAt: string;
  populatedAuthors?: Author[];
  intention?: string;
  contentType?: string;
}

interface BlogProps {
  posts: Post[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  categories: Category[];
  selectedCategory?: string;
}

export default function Blog({
  posts,
  totalCount,
  currentPage,
  totalPages,
  categories,
  selectedCategory,
}: BlogProps) {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState(selectedCategory || '');

  const applyFilters = () => {
    const query: any = {};
    if (categoryFilter) query.category = categoryFilter;

    router.push({
      pathname: '/blog',
      query,
    });
  };

  const resetFilters = () => {
    setCategoryFilter('');
    router.push('/blog');
  };

  return (
    <div className='min-h-screen bg-linear-to-b from-gray-950 via-gray-900 to-black'>
      {/* Header Hero */}
      <div className='bg-linear-to-br from-premium-gold/10 via-gray-900/50 to-black border-b border-premium-gold/20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
          <h1 className='text-5xl font-bold text-white mb-4'>
            Le Blog VanalexCars
          </h1>
          <p className='text-xl text-gray-300 max-w-3xl'>
            Expertise, conseils et passion automobile. Découvrez l'univers de l'import de véhicules d'Allemagne,
            les modèles plaisir, et tout ce qu'il faut savoir pour trouver votre voiture idéale sur la Côte d'Azur.
          </p>
          <div className='mt-6 flex items-center gap-4 text-gray-400'>
            <span className='flex items-center gap-2'>
              📝 {totalCount} article{totalCount > 1 ? 's' : ''}
            </span>
            <span>•</span>
            <span>Par Aurélien, courtier automobile à Antibes</span>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Sidebar Filtres */}
          <div className='lg:col-span-1'>
            <div className='bg-gray-900/50 border border-gray-800 rounded-xl p-6 sticky top-4'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-bold text-white'>Catégories</h2>
                {categoryFilter && (
                  <button
                    onClick={resetFilters}
                    className='text-sm text-premium-gold hover:text-premium-gold/80 font-medium'
                  >
                    Tout
                  </button>
                )}
              </div>

              <div className='space-y-2'>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setCategoryFilter(category.id);
                      router.push({
                        pathname: '/blog',
                        query: { category: category.id },
                      });
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      categoryFilter === category.id
                        ? 'bg-premium-gold text-black font-semibold'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    {category.title}
                  </button>
                ))}
              </div>

              <div className='mt-8 pt-8 border-t border-gray-800'>
                <div className='text-sm text-gray-400'>
                  <p className='font-semibold text-white mb-2'>À propos</p>
                  <p>
                    "Je ne fais pas de volume, je fais de la recherche précise."
                  </p>
                  <p className='mt-4 text-premium-gold'>
                    — Aurélien Lien
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des articles */}
          <div className='lg:col-span-3'>
            {posts.length === 0 ? (
              <div className='bg-gray-900/50 border border-gray-800 rounded-xl p-12 text-center'>
                <div className='text-6xl mb-4'>📝</div>
                <h3 className='text-2xl font-semibold text-white mb-2'>
                  Aucun article trouvé
                </h3>
                <p className='text-gray-400 mb-6'>
                  Essayez de modifier vos filtres ou revenez plus tard.
                </p>
                <button
                  onClick={resetFilters}
                  className='text-premium-gold hover:text-premium-gold/80 font-medium'
                >
                  Voir tous les articles
                </button>
              </div>
            ) : (
              <>
                <div className='grid grid-cols-1 gap-8'>
                  {posts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className='group bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-premium-gold/50 transition-all'
                    >
                      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {/* Image */}
                        <div className='md:col-span-1'>
                          <div className='aspect-video md:aspect-square bg-linear-to-br from-gray-800 to-gray-900 relative overflow-hidden'>
                            {post.featuredImage?.url ? (
                              <img
                                src={post.featuredImage.url}
                                alt={post.featuredImage.alt || post.title}
                                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                              />
                            ) : (
                              <div className='w-full h-full flex items-center justify-center'>
                                <span className='text-6xl'>📝</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Contenu */}
                        <div className='md:col-span-2 p-6'>
                          {/* Catégories */}
                          {post.categories && post.categories.length > 0 && (
                            <div className='flex flex-wrap gap-2 mb-3'>
                              {post.categories.map((cat) => (
                                <span
                                  key={cat.id}
                                  className='px-3 py-1 bg-premium-gold/10 text-premium-gold text-xs font-medium rounded-full'
                                >
                                  {cat.title}
                                </span>
                              ))}
                            </div>
                          )}

                          <h3 className='text-2xl font-bold text-white mb-3 group-hover:text-premium-gold transition-colors'>
                            {post.title}
                          </h3>

                          {post.excerpt && (
                            <p className='text-gray-400 mb-4 line-clamp-2'>
                              {post.excerpt}
                            </p>
                          )}

                          <div className='flex items-center gap-4 text-sm text-gray-500'>
                            <span>
                              {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </span>
                            {post.populatedAuthors && post.populatedAuthors.length > 0 && (
                              <>
                                <span>•</span>
                                <span>Par {post.populatedAuthors[0].name}</span>
                              </>
                            )}
                          </div>

                          <div className='mt-4'>
                            <span className='inline-flex items-center text-premium-gold font-medium group-hover:gap-2 transition-all'>
                              Lire l'article
                              <svg
                                className='w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M9 5l7 7-7 7'
                                />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className='mt-12 flex justify-center gap-2'>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => {
                          router.push({
                            pathname: '/blog',
                            query: { ...router.query, page },
                          });
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          page === currentPage
                            ? 'bg-premium-gold text-black'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { category, page = '1' } = query;

  let posts: Post[] = [];
  let totalCount = 0;
  let categories: Category[] = [];

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

    // Récupérer les catégories
    const categoriesResponse = await fetch(`${backendUrl}/api/categories?limit=100`);
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      categories = categoriesData.docs || [];
    }

    // Construire les paramètres de requête pour les posts
    const params = new URLSearchParams();
    params.append('limit', '10');
    params.append('page', page as string);
    params.append('sort', '-publishedAt');
    params.append('where[_status][equals]', 'published');

    // Filtre par catégorie
    if (category) {
      params.append('where[categories][in]', category as string);
    }

    const response = await fetch(`${backendUrl}/api/posts?${params.toString()}`);

    if (response.ok) {
      const data = await response.json();
      posts = data.docs || [];
      totalCount = data.totalDocs || 0;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des articles:', error);
  }

  const totalPages = Math.ceil(totalCount / 10);

  return {
    props: {
      posts,
      totalCount,
      currentPage: parseInt(page as string, 10),
      totalPages,
      categories,
      selectedCategory: category || null,
    },
  };
};
