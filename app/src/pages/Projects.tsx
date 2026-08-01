import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { trpc } from '@/providers/trpc';

export default function Projects() {
  const { t } = useTranslation();
  const catRef = useScrollReveal<HTMLElement>({ stagger: 0.1 });
  const projRef = useScrollReveal<HTMLElement>({ stagger: 0.2 });

  const { data: dbProjects, isLoading } = trpc.admin.public.getPublishedProjects.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const categories = t('projects.categories.items', { returnObjects: true }) as Array<{
    title: string; count: string; desc: string;
  }>;

  const catImages = [
    '/assets/focus-biodiversity.jpg',
    '/assets/focus-forest.jpg',
    '/assets/focus-climate.jpg',
    '/assets/focus-education.jpg',
    '/assets/focus-onehealth.jpg',
    '/assets/focus-research.jpg',
  ];

  const catRoutes = [
    '/focus/biodiversite',
    '/focus/forets',
    '/focus/climat',
    '/focus/education',
    '/focus/one-health',
    '/focus/recherche',
  ];

  return (
    <>
      <PageHeader title={t('projects.pageTitle')} image="/assets/projects-header.jpg" />

      {/* Categories */}
      <section ref={catRef} className="bg-white py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14" data-reveal>
            <p className="section-label">{t('projects.categories.label')}</p>
            <h2 className="section-title mt-4">
              {t('projects.categories.title')}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <Link
                key={i}
                to={catRoutes[i]}
                data-reveal
                className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer block"
              >
                <img
                  src={catImages[i] || catImages[0]}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <h3 className="font-raleway font-medium text-[16px] uppercase tracking-[0.1em] text-white">
                    {cat.title}
                  </h3>
                  <p className="font-raleway text-[13px] text-white/70 mt-1">
                    {cat.count}
                  </p>
                </div>
                <div className="absolute inset-0 bg-beco-dark/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 text-center">
                  <h3 className="font-raleway font-medium text-[16px] uppercase tracking-[0.1em] text-white">
                    {cat.title}
                  </h3>
                  <p className="font-raleway text-[13px] text-white/80 leading-[1.6] mt-3">
                    {cat.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section ref={projRef} className="bg-beco-off-white py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14" data-reveal>
            <p className="section-label">{t('projects.current.label')}</p>
            <h2 className="section-title mt-4">{t('projects.current.title')}</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-3 border-beco-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {(dbProjects ?? []).length > 0 ? (
                dbProjects!.map((project, i) => {
                  let detailsArr: string[] = [];
                  try {
                    if (project.details) {
                      const parsed = JSON.parse(project.details);
                      detailsArr = Array.isArray(parsed) ? parsed : [project.details];
                    }
                  } catch {
                    detailsArr = project.details ? project.details.split('\n').filter(Boolean) : [];
                  }

                  return (
                    <div
                      key={project.id}
                      data-reveal
                      className="grid md:grid-cols-[5fr_7fr] bg-white rounded-xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
                    >
                      <img
                        src={project.image || '/assets/project-parrot.jpg'}
                        alt={project.title}
                        className="w-full aspect-video md:aspect-auto object-cover"
                      />
                      <div className="p-8 lg:p-10 flex flex-col justify-center">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className="font-raleway font-semibold text-[10px] uppercase tracking-[0.12em] text-beco-olive-accent px-3 py-1 border border-beco-olive-accent rounded-full">
                            {project.tag}
                          </span>
                          {project.date && (
                            <span className="font-raleway text-[12px] text-beco-dark/50">
                              {project.date}
                            </span>
                          )}
                        </div>
                        <h3 className="font-playfair italic text-[22px] lg:text-[24px] text-beco-dark leading-[1.3]">
                          {project.title}
                        </h3>
                        <p className="font-raleway text-[14px] text-beco-dark/70 leading-[1.7] mt-3">
                          {project.description}
                        </p>
                        {detailsArr.length > 0 && (
                          <ul className="mt-5 space-y-2">
                            {detailsArr.map((detail, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-beco-primary mt-2 flex-shrink-0" />
                                <span className="font-raleway text-[13px] text-beco-dark/65">
                                  {detail}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {project.funder && (
                          <div className="mt-5 pt-4 border-t border-black/8">
                            <span className="font-raleway text-[12px] text-beco-dark/50">
                              {t('common.funder')}
                            </span>
                            <span className="font-raleway font-semibold text-[13px] text-beco-dark ml-2">
                              {project.funder}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-400 py-12">Aucun projet disponible pour le moment</p>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
