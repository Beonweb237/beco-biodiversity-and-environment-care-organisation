import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import SEOHead from '../components/SEOHead';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';
import { trpc } from '@/providers/trpc';

const ITEMS_PER_PAGE = 6;

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function News() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ref = useScrollReveal<HTMLElement>({ stagger: 0.12 });

  const { data: dbNews, isLoading } = trpc.admin.public.getPublishedNews.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const filters = t('news.filters', { returnObjects: true }) as string[];
  const allNews = t('news.articles', { returnObjects: true }) as Array<{
    tag: string; date: string; title: string; excerpt: string; category: string;
  }> | null;

  // Use DB news if available, fall back to translation
  const articles = useMemo(() => {
    if (dbNews && dbNews.length > 0) {
      return dbNews.map((article) => ({
        id: article.id,
        slug: article.slug,
        tag: article.tag,
        date: article.date || '',
        title: article.title,
        excerpt: article.excerpt,
        category: article.category || '',
        image: article.image || '',
      }));
    }
    if (allNews && Array.isArray(allNews)) {
      return allNews.map((n, i) => ({
        id: i,
        slug: slugify(n.title),
        tag: n.tag,
        date: n.date,
        title: n.title,
        excerpt: n.excerpt,
        category: n.category,
        image: `/assets/news-${(i % 6) + 1}.jpg`,
      }));
    }
    return [];
  }, [dbNews, allNews]);

  // Filter by category
  const filteredArticles = useMemo(() => {
    if (activeFilter === 0) return articles;
    return articles.filter((a) => {
      const filterName = filters[activeFilter]?.toLowerCase() || '';
      return a.category?.toLowerCase() === filterName || a.tag?.toLowerCase() === filterName;
    });
  }, [articles, activeFilter, filters]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ITEMS_PER_PAGE));
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filter changes
  const handleFilterChange = (i: number) => {
    setActiveFilter(i);
    setCurrentPage(1);
  };

  return (
    <>
      <SEOHead
        title={t('news.pageTitle')}
        description="Restez informés des actualités, projets et événements de BECO pour la conservation de la biodiversité."
        path="/news"
      />
      <PageHeader title={t('news.pageTitle')} image="/assets/news-header.jpg" />

      <section ref={ref} className="bg-white py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14" data-reveal>
            <p className="section-label">{t('news.label')}</p>
            <h2 className="section-title mt-4">
              {t('news.title')}
            </h2>
          </div>

          {/* Filters */}
          <div className="flex justify-center gap-4 mb-10 flex-wrap" data-reveal>
            {filters.map((f, i) => (
              <button
                key={i}
                onClick={() => handleFilterChange(i)}
                className={`font-raleway font-medium text-[12px] uppercase px-5 py-2 rounded-full transition-all duration-300 ${activeFilter === i
                    ? 'bg-beco-primary text-white'
                    : 'bg-transparent border border-beco-primary text-beco-primary hover:bg-beco-primary hover:text-white'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-3 border-beco-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedArticles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/news/${article.slug}`}
                    data-reveal
                    className="block bg-white rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-shadow duration-300 group"
                  >
                    <img
                      src={article.image || '/assets/news-1.jpg'}
                      alt={article.title}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-raleway font-semibold text-[10px] uppercase tracking-[0.12em] text-beco-primary px-2.5 py-0.5 border border-beco-primary rounded-full">
                          {article.tag}
                        </span>
                        {article.date && (
                          <span className="font-raleway text-[12px] text-beco-dark/50">
                            {article.date}
                          </span>
                        )}
                      </div>
                      <h3 className="font-raleway font-semibold text-[16px] text-beco-dark leading-[1.4] group-hover:text-beco-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="font-raleway text-[13px] text-beco-dark/65 leading-[1.6] mt-2">
                        {article.excerpt}
                      </p>
                      <span className="inline-block font-raleway font-semibold text-[11px] uppercase text-beco-primary mt-4 group-hover:underline">
                        {t('news.readMore')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {paginatedArticles.length === 0 && (
                <p className="text-center text-gray-400 py-12">Aucun article disponible pour le moment</p>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center font-raleway text-[13px] transition-colors duration-200 ${currentPage === 1
                        ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                        : 'border-beco-primary/20 text-beco-dark hover:border-beco-primary hover:text-beco-primary'
                      }`}
                  >
                    &larr;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-raleway font-medium text-[13px] transition-colors duration-200 ${currentPage === i + 1
                          ? 'bg-beco-primary text-white'
                          : 'border border-beco-primary/20 text-beco-dark hover:border-beco-primary hover:text-beco-primary'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center font-raleway text-[13px] transition-colors duration-200 ${currentPage === totalPages
                        ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                        : 'border-beco-primary/20 text-beco-dark hover:border-beco-primary hover:text-beco-primary'
                      }`}
                  >
                    &rarr;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
