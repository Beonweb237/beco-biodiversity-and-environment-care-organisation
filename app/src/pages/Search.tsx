import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search as SearchIcon, ArrowLeft } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const allPages = [
  { titleKey: 'nav.home', path: '/', keywords: ['accueil', 'home', 'beco', 'inicio', 'heim', 'الصفحة الرئيسية'] },
  { titleKey: 'nav.about', path: '/about', keywords: ['a propos', 'about', 'histoire', 'mission', 'vision', 'valeurs', 'equipe', 'acerca', 'über', 'نبذة'] },
  { titleKey: 'nav.projects', path: '/projects', keywords: ['projets', 'projects', 'conservation', 'recherche', 'proyectos', 'projekte', 'مشاريع'] },
  { titleKey: 'nav.news', path: '/news', keywords: ['actualites', 'news', 'publications', 'evenements', 'noticias', 'neuigkeiten', 'أخبار'] },
  { titleKey: 'nav.team', path: '/team', keywords: ['equipe', 'team', 'membres', 'chercheurs', 'equipo', 'mitarbeiter', 'فريق'] },
  { titleKey: 'nav.involved', path: '/involved', keywords: ['impliquer', 'involved', 'don', 'benvolat', 'membre', 'adherer', 'participar', 'beteiligen', 'مشاركة'] },
  { titleKey: 'nav.contact', path: '/contact', keywords: ['contact', 'message', 'contacto', 'kontakt', 'اتصال'] },
  { titleKey: 'nav.legal', path: '/legal', keywords: ['mentions legales', 'legal', 'aviso', 'rechtliches', 'قانوني'] },
];

export default function Search() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const results = query.trim()
    ? allPages.filter((page) =>
        page.keywords.some((kw) =>
          kw.toLowerCase().includes(query.toLowerCase())
        ) ||
        t(page.titleKey).toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <>
      <PageHeader title={t('search.pageTitle') || 'Recherche'} image="/assets/hero-1.jpg" />

      <section className="bg-white py-[100px]">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">
              {query ? (
                <>
                  {results.length > 0
                    ? `${results.length} ${t('search.resultsFor')} « ${query} »`
                    : `${t('search.noResultsFor')} « ${query} »`}
                </>
              ) : (
                t('search.placeholder')
              )}
            </h2>
          </div>

          {results.length > 0 && (
            <div className="space-y-4">
              {results.map((page) => (
                <Link
                  key={page.path}
                  to={page.path}
                  className="flex items-center gap-4 p-5 rounded-xl bg-beco-off-white hover:bg-beco-olive-light transition-colors duration-300 group"
                >
                  <div className="w-10 h-10 rounded-full bg-beco-primary/10 flex items-center justify-center flex-shrink-0">
                    <SearchIcon className="w-5 h-5 text-beco-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-raleway font-semibold text-[15px] text-beco-dark group-hover:text-beco-primary transition-colors">
                      {t(page.titleKey)}
                    </h3>
                    <p className="font-raleway text-[13px] text-beco-dark/50">
                      {page.path}
                    </p>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-beco-dark/30 rotate-180 group-hover:text-beco-primary transition-colors" />
                </Link>
              ))}
            </div>
          )}

          {query && results.length === 0 && (
            <div className="text-center">
              <p className="font-raleway text-[15px] text-beco-dark/60">
                {t('search.suggestion')}
              </p>
              <Link
                to="/"
                className="btn-outline mt-8 inline-flex"
              >
                {t('common.backToHome')}
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
