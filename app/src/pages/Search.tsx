import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search as SearchIcon, ArrowLeft, Newspaper, FolderKanban } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { trpc } from '@/providers/trpc';

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
  const query = (searchParams.get('q') || '').trim();

  // Fetch DB content for search
  const { data: dbProjects } = trpc.admin.public.getPublishedProjects.useQuery(undefined, {
    enabled: query.length > 0,
    staleTime: 60000,
  });
  const { data: dbNews } = trpc.admin.public.getPublishedNews.useQuery(undefined, {
    enabled: query.length > 0,
    staleTime: 60000,
  });

  // Static page search
  const pageResults = query
    ? allPages.filter((page) =>
      page.keywords.some((kw) =>
        kw.toLowerCase().includes(query.toLowerCase())
      ) ||
      t(page.titleKey).toLowerCase().includes(query.toLowerCase())
    )
    : [];

  // DB project search
  const projectResults = query && dbProjects
    ? dbProjects.filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(query.toLowerCase()) ||
      (p.tag || '').toLowerCase().includes(query.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(query.toLowerCase())
    )
    : [];

  // DB news search
  const newsResults = query && dbNews
    ? dbNews.filter((n) =>
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      (n.excerpt || '').toLowerCase().includes(query.toLowerCase()) ||
      (n.tag || '').toLowerCase().includes(query.toLowerCase()) ||
      (n.category || '').toLowerCase().includes(query.toLowerCase())
    )
    : [];

  const totalResults = pageResults.length + projectResults.length + newsResults.length;
  const hasSearched = query.length > 0;

  return (
    <>
      <PageHeader title={t('search.pageTitle') || 'Recherche'} image="/assets/hero-1.jpg" />

      <section className="bg-white py-[100px]">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">
              {hasSearched ? (
                totalResults > 0
                  ? `${totalResults} ${t('search.resultsFor')} « ${query} »`
                  : `${t('search.noResultsFor')} « ${query} »`
              ) : (
                t('search.placeholder')
              )}
            </h2>
          </div>

          {hasSearched && totalResults > 0 && (
            <div className="space-y-8">
              {/* Pages */}
              {pageResults.length > 0 && (
                <div>
                  <h3 className="font-raleway font-semibold text-[13px] uppercase tracking-wider text-beco-dark/40 mb-3">
                    Pages
                  </h3>
                  <div className="space-y-3">
                    {pageResults.map((page) => (
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
                          <p className="font-raleway text-[13px] text-beco-dark/50">{page.path}</p>
                        </div>
                        <ArrowLeft className="w-5 h-5 text-beco-dark/30 rotate-180 group-hover:text-beco-primary transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Projets DB */}
              {projectResults.length > 0 && (
                <div>
                  <h3 className="font-raleway font-semibold text-[13px] uppercase tracking-wider text-beco-dark/40 mb-3">
                    Projets ({projectResults.length})
                  </h3>
                  <div className="space-y-3">
                    {projectResults.slice(0, 5).map((project) => (
                      <Link
                        key={project.id}
                        to={`/projects/${project.slug}`}
                        className="flex items-start gap-4 p-5 rounded-xl bg-beco-off-white hover:bg-beco-olive-light transition-colors duration-300 group"
                      >
                        <div className="w-10 h-10 rounded-full bg-beco-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FolderKanban className="w-5 h-5 text-beco-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-raleway font-semibold text-[15px] text-beco-dark group-hover:text-beco-primary transition-colors">
                            {project.title}
                          </h3>
                          <p className="font-raleway text-[13px] text-beco-dark/50 truncate">
                            {project.description}
                          </p>
                          {project.tag && (
                            <span className="inline-block mt-1.5 font-raleway text-[11px] text-beco-olive-accent px-2 py-0.5 border border-beco-olive-accent/40 rounded-full">
                              {project.tag}
                            </span>
                          )}
                        </div>
                        <ArrowLeft className="w-5 h-5 text-beco-dark/30 rotate-180 group-hover:text-beco-primary transition-colors flex-shrink-0 mt-1" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Actualités DB */}
              {newsResults.length > 0 && (
                <div>
                  <h3 className="font-raleway font-semibold text-[13px] uppercase tracking-wider text-beco-dark/40 mb-3">
                    Actualités ({newsResults.length})
                  </h3>
                  <div className="space-y-3">
                    {newsResults.slice(0, 5).map((article) => (
                      <Link
                        key={article.id}
                        to={`/news/${article.slug}`}
                        className="flex items-start gap-4 p-5 rounded-xl bg-beco-off-white hover:bg-beco-olive-light transition-colors duration-300 group"
                      >
                        <div className="w-10 h-10 rounded-full bg-beco-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Newspaper className="w-5 h-5 text-beco-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-raleway font-semibold text-[15px] text-beco-dark group-hover:text-beco-primary transition-colors">
                            {article.title}
                          </h3>
                          <p className="font-raleway text-[13px] text-beco-dark/50 truncate">
                            {article.excerpt}
                          </p>
                          {article.tag && (
                            <span className="inline-block mt-1.5 font-raleway text-[11px] text-beco-olive-accent px-2 py-0.5 border border-beco-olive-accent/40 rounded-full">
                              {article.tag}
                            </span>
                          )}
                        </div>
                        <ArrowLeft className="w-5 h-5 text-beco-dark/30 rotate-180 group-hover:text-beco-primary transition-colors flex-shrink-0 mt-1" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {hasSearched && totalResults === 0 && (
            <div className="text-center">
              <p className="font-raleway text-[15px] text-beco-dark/60">
                {t('search.suggestion')}
              </p>
              <Link to="/" className="btn-outline mt-8 inline-flex">
                {t('common.backToHome')}
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
