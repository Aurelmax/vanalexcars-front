import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

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
  content: any; // Lexical JSON content
  featuredImage?: {
    url: string;
    alt?: string;
  };
  categories?: Category[];
  publishedAt: string;
  populatedAuthors?: Author[];
  intention?: string;
  contentType?: string;
  targetKeyword?: string;
  relatedPosts?: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
  }>;
}

interface PostDetailProps {
  post: Post | null;
}

// Fonction simple pour rendre le contenu Lexical en HTML
function renderLexicalContent(content: any): string {
  if (!content || !content.root || !content.root.children) {
    return '';
  }

  const renderNode = (node: any): string => {
    if (node.type === 'paragraph') {
      const children = node.children?.map((child: any) => renderNode(child)).join('') || '';
      return `<p class="mb-4 text-gray-300 leading-relaxed">${children}</p>`;
    }

    if (node.type === 'heading') {
      const children = node.children?.map((child: any) => renderNode(child)).join('') || '';
      const tag = node.tag || 'h2';
      const classes = {
        h1: 'text-4xl font-bold text-white mb-6 mt-8',
        h2: 'text-3xl font-bold text-white mb-4 mt-8',
        h3: 'text-2xl font-bold text-white mb-3 mt-6',
        h4: 'text-xl font-bold text-white mb-2 mt-4',
      };
      return `<${tag} class="${classes[tag as keyof typeof classes]}">${children}</${tag}>`;
    }

    if (node.type === 'list') {
      const children = node.children?.map((child: any) => renderNode(child)).join('') || '';
      const listTag = node.listType === 'number' ? 'ol' : 'ul';
      const listClass = node.listType === 'number'
        ? 'list-decimal list-inside mb-4 space-y-2 text-gray-300'
        : 'list-disc list-inside mb-4 space-y-2 text-gray-300';
      return `<${listTag} class="${listClass}">${children}</${listTag}>`;
    }

    if (node.type === 'listitem') {
      const children = node.children?.map((child: any) => renderNode(child)).join('') || '';
      return `<li class="ml-4">${children}</li>`;
    }

    if (node.type === 'text') {
      let text = node.text || '';
      if (node.format & 1) text = `<strong>${text}</strong>`; // Bold
      if (node.format & 2) text = `<em>${text}</em>`; // Italic
      if (node.format & 8) text = `<code class="bg-gray-800 px-2 py-1 rounded text-premium-gold">${text}</code>`; // Code
      return text;
    }

    if (node.type === 'link') {
      const children = node.children?.map((child: any) => renderNode(child)).join('') || '';
      return `<a href="${node.url}" class="text-premium-gold hover:underline" target="_blank" rel="noopener noreferrer">${children}</a>`;
    }

    if (node.children) {
      return node.children.map((child: any) => renderNode(child)).join('');
    }

    return '';
  };

  return content.root.children.map((node: any) => renderNode(node)).join('');
}

export default function PostDetail({ post }: PostDetailProps) {
  const router = useRouter();

  if (!post) {
    return (
      <div className='min-h-screen bg-linear-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-white mb-4'>Article non trouvé</h1>
          <Link href='/blog' className='text-premium-gold hover:underline'>
            Retour au blog
          </Link>
        </div>
      </div>
    );
  }

  const contentHtml = renderLexicalContent(post.content);

  return (
    <div className='min-h-screen bg-linear-to-b from-gray-950 via-gray-900 to-black'>
      {/* Breadcrumb */}
      <div className='bg-gray-900/50 border-b border-gray-800'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center gap-2 text-sm text-gray-400'>
            <Link href='/' className='hover:text-premium-gold transition-colors'>
              Accueil
            </Link>
            <span>/</span>
            <Link href='/blog' className='hover:text-premium-gold transition-colors'>
              Blog
            </Link>
            <span>/</span>
            <span className='text-gray-300'>{post.title}</span>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <article className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Catégories */}
        {post.categories && post.categories.length > 0 && (
          <div className='flex flex-wrap gap-2 mb-6'>
            {post.categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.id}`}
                className='px-4 py-2 bg-premium-gold/10 text-premium-gold text-sm font-medium rounded-full hover:bg-premium-gold/20 transition-colors'
              >
                {cat.title}
              </Link>
            ))}
          </div>
        )}

        {/* Titre */}
        <h1 className='text-5xl md:text-6xl font-bold text-white mb-6 leading-tight'>
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className='text-xl text-gray-400 mb-8 leading-relaxed'>
            {post.excerpt}
          </p>
        )}

        {/* Meta info */}
        <div className='flex flex-wrap items-center gap-4 text-gray-400 mb-12 pb-8 border-b border-gray-800'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-premium-gold rounded-full flex items-center justify-center text-black font-bold text-xl'>
              {post.populatedAuthors?.[0]?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <div className='text-white font-medium'>
                {post.populatedAuthors?.[0]?.name || 'Aurélien'}
              </div>
              <div className='text-sm'>
                {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Image principale */}
        {post.featuredImage?.url && (
          <div className='mb-12 rounded-xl overflow-hidden'>
            <img
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              className='w-full h-auto'
            />
          </div>
        )}

        {/* Contenu */}
        <div
          className='prose prose-lg prose-invert max-w-none'
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* CTA Signature */}
        <div className='mt-16 bg-linear-to-br from-premium-gold/10 via-gray-900/50 to-black border border-premium-gold/30 rounded-xl p-8'>
          <div className='flex items-start gap-6'>
            <div className='w-16 h-16 bg-premium-gold rounded-full flex items-center justify-center text-black font-bold text-2xl shrink-0'>
              A
            </div>
            <div className='flex-1'>
              <h3 className='text-2xl font-bold text-white mb-2'>
                Aurélien Lien
              </h3>
              <p className='text-gray-400 mb-4'>
                Courtier automobile à Antibes. Je travaille seul, je n'ai rien à cacher.
              </p>
              <p className='text-gray-300 mb-6 italic'>
                "Je ne fais pas de volume, je fais de la recherche précise."
              </p>
              <div className='flex flex-wrap gap-4'>
                <Link
                  href='/contact'
                  className='px-6 py-3 bg-premium-gold text-black font-semibold rounded-lg hover:bg-premium-gold/90 transition-colors'
                >
                  Vous cherchez une voiture comme celle-ci ? Je peux vous aider
                </Link>
                <Link
                  href='/catalogue'
                  className='px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors'
                >
                  Voir le catalogue
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Articles liés */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <div className='mt-16'>
            <h2 className='text-3xl font-bold text-white mb-8'>
              Articles liés
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {post.relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className='group bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-premium-gold/50 transition-all'
                >
                  <h3 className='text-xl font-bold text-white mb-2 group-hover:text-premium-gold transition-colors'>
                    {relatedPost.title}
                  </h3>
                  {relatedPost.excerpt && (
                    <p className='text-gray-400 text-sm line-clamp-2'>
                      {relatedPost.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { slug } = params || {};

  let post: Post | null = null;

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

    const response = await fetch(
      `${backendUrl}/api/posts?where[slug][equals]=${slug}&where[_status][equals]=published`
    );

    if (response.ok) {
      const data = await response.json();
      if (data.docs && data.docs.length > 0) {
        post = data.docs[0];
      }
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'article:', error);
  }

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
  };
};
