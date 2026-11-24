import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Share2 } from 'lucide-react';
import PageHeader from './PageHeader';
import type { NewsArticleData } from '../lib/newsData';

interface NewsArticlePageProps {
  config: NewsArticleData;
}

export default function NewsArticlePage({ config }: NewsArticlePageProps) {
  const { t } = useTranslation();
  const allNews = t('news.articles', { returnObjects: true }) as Array<{
    tag: string; date: string; title: string; excerpt: string; category: string;
  }>;
  const article = allNews[config.index];

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-playfair text-[32px] text-beco-dark">Article non trouvé</h1>
          <Link to="/news" className="btn-outline mt-6 inline-flex">
            Retour aux actualités
          </Link>
        </div>
      </div>
    );
  }

  const relatedNews = allNews.filter((_, i) => i !== config.index).slice(0, 3);

  const fullContent = t(`news.fullContent.${config.index}`, { defaultValue: article.excerpt }) as string;
  const contentParagraphs = fullContent.split('\n').filter(Boolean);

  return (
    <>
      <PageHeader title={article.title} image={config.image} />

      <section className="bg-white py-[100px]">
        <div className="max-w-[900px] mx-auto px-6">
          {/* Back link */}
          <Link
            to="/news"
            className="inline-flex items-center gap-2 font-raleway text-[13px] text-beco-primary hover:text-beco-primary-light transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Retour aux actualités
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="inline-flex items-center gap-1.5 font-raleway text-[12px] text-beco-olive-accent px-3 py-1 border border-beco-olive-accent rounded-full">
              <Tag className="w-3 h-3" />
              {article.tag}
            </span>
            <span className="inline-flex items-center gap-1.5 font-raleway text-[12px] text-beco-dark/50">
              <Calendar className="w-3.5 h-3.5" />
              {article.date}
            </span>
            <span className="font-raleway text-[12px] text-beco-dark/50">
              — {article.category}
            </span>
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

          {/* Related */}
          {relatedNews.length > 0 && (
            <div className="mt-16">
              <h3 className="font-playfair text-[22px] text-beco-dark mb-6">
                Articles similaires
              </h3>
              <div className="grid sm:grid-cols-3 gap-6">
                {relatedNews.map((item, i) => {
                  const slugs = [
                    'lancement-perroquets-gris',
                    'subvention-british-ecological-society',
                    'deuxieme-rufford-small-grant',
                    'selectionne-cdkn-early-career',
                    'creation-officielle-beco',
                    'premiers-resultats-monitoring-acoustique',
                  ];
                  const relatedIndex = allNews.indexOf(item);
                  return (
                    <Link
                      key={i}
                      to={`/news/${slugs[relatedIndex]}`}
                      className="group block"
                    >
                      <h4 className="font-raleway font-semibold text-[14px] text-beco-dark group-hover:text-beco-primary transition-colors leading-[1.4]">
                        {item.title}
                      </h4>
                      <p className="font-raleway text-[12px] text-beco-dark/50 mt-1">
                        {item.date}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
