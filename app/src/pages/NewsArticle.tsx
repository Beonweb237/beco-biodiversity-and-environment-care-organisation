import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNewsBySlug } from '@/lib/api/public';
import PageHeader from '../components/PageHeader';
import { newsConfigs } from '../lib/newsData';

export default function NewsArticle() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();

  // Stable index from static config — works regardless of language
  const staticIndex = newsConfigs.findIndex((c) => c.slug === slug);
  const config = staticIndex >= 0 ? newsConfigs[staticIndex] : null;

  const { data: dbArticle, isLoading } = useNewsBySlug(slug || '');

  const allNews = t('news.articles', { returnObjects: true }) as Array<{
    tag: string; date: string; title: string; excerpt: string; category: string;
  }> | null;

  // Use static index to find article in translations — independent of slugified title
  const translationArticle = staticIndex >= 0 && allNews
    ? allNews[staticIndex]
    : null;

  const article = dbArticle
    ? {
      slug: dbArticle.slug,
      tag: dbArticle.tag,
      date: dbArticle.date || '',
      title: dbArticle.title,
      excerpt: dbArticle.excerpt,
      content: dbArticle.content || dbArticle.excerpt,
      image: dbArticle.image || (config?.image || '/assets/news-1.jpg'),
      category: dbArticle.category || '',
    }
    : translationArticle
      ? {
        slug: slug || '',
        tag: translationArticle.tag,
        date: translationArticle.date,
        title: translationArticle.title,
        excerpt: translationArticle.excerpt,
        content: t(`news.fullContent.${staticIndex}`, { defaultValue: translationArticle.excerpt }) as string,
        image: config?.image || `/assets/news-${(staticIndex % 6) + 1}.jpg`,
        category: translationArticle.category,
      }
      : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-beco-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-playfair text-[32px] text-beco-dark">{t('news.notFound')}</h1>
          <Link to="/news" className="btn-outline mt-6 inline-flex">
            {t('news.backToNews')}
          </Link>
        </div>
      </div>
    );
  }

  const contentParagraphs = article.content.split('\n').filter(Boolean);

  return (
    <>
      <PageHeader title={article.title} image={article.image} />

      <section className="bg-white py-[100px]">
        <div className="max-w-[900px] mx-auto px-6">
          {/* Back link */}
          <Link
            to="/news"
            className="inline-flex items-center gap-2 font-raleway text-[13px] text-beco-primary hover:text-beco-primary-light transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {t('news.backToNews')}
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="inline-flex items-center gap-1.5 font-raleway text-[12px] text-beco-olive-accent px-3 py-1 border border-beco-olive-accent rounded-full">
              <Tag className="w-3 h-3" />
              {article.tag}
            </span>
            {article.date && (
              <span className="inline-flex items-center gap-1.5 font-raleway text-[12px] text-beco-dark/50">
                <Calendar className="w-3.5 h-3.5" />
                {article.date}
              </span>
            )}
            {article.category && (
              <span className="font-raleway text-[12px] text-beco-dark/50">
                — {article.category}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="space-y-5">
            {contentParagraphs.map((paragraph, i) => (
              <p
                key={i}
                className="font-raleway text-[15px] text-beco-dark/75 leading-[1.8]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Share */}
          <div className="mt-10 pt-8 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Share2 className="w-4 h-4 text-beco-dark/40" />
              <span className="font-raleway text-[13px] text-beco-dark/50">Partager :</span>
              <button
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="font-raleway text-[13px] text-beco-primary hover:underline"
              >
                Copier le lien
              </button>
            </div>
            <Link
              to="/news"
              className="font-raleway font-medium text-[12px] uppercase text-beco-primary hover:underline"
            >
              &larr; Toutes les actualités
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
