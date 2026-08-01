import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';
import { trpc } from '@/providers/trpc';

export default function FeaturedProjects() {
  const { t, i18n } = useTranslation();
  const ref = useScrollReveal<HTMLElement>({ stagger: 0.2 });

  const { data: projects, isLoading } = trpc.admin.public.getPublishedProjects.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  // Fallback static projects from translations when no DB data
  const fallbackProjects = [
    {
      image: '/assets/project-parrot.jpg',
      tag: t('home.featuredProjects.project1.tag'),
      title: t('home.featuredProjects.project1.title'),
      description: t('home.featuredProjects.project1.description'),
    },
    {
      image: '/assets/project-acoustic.jpg',
      tag: t('home.featuredProjects.project2.tag'),
      title: t('home.featuredProjects.project2.title'),
      description: t('home.featuredProjects.project2.description'),
      reverse: true,
    },
    {
      image: '/assets/project-volcanic.jpg',
      tag: t('home.featuredProjects.project3.tag'),
      title: t('home.featuredProjects.project3.title'),
      description: t('home.featuredProjects.project3.description'),
    },
  ];

  const displayProjects = projects && projects.length > 0
    ? projects.map((p) => ({
        image: p.image || '/assets/project-parrot.jpg',
        tag: p.tag,
        title: p.title,
        description: p.description,
      }))
    : fallbackProjects;

  return (
    <section ref={ref} className="bg-white py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14" data-reveal>
          <p className="section-label">{t('home.featuredProjects.label')}</p>
          <h2 className="section-title mt-4">
            {t('home.featuredProjects.title')}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-3 border-beco-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {displayProjects.map((project, i) => (
              <div
                key={i}
                data-reveal
                className={`grid md:grid-cols-2 rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)] ${
                  i % 2 === 1 ? 'md:[direction:rtl]' : ''
                }`}
              >
                <div className={i % 2 === 1 ? 'md:[direction:ltr]' : ''}>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full aspect-video md:aspect-auto object-cover"
                  />
                </div>
                <div
                  className={`bg-beco-olive-light p-8 lg:p-10 flex flex-col justify-center ${
                    i % 2 === 1 ? 'md:[direction:ltr]' : ''
                  }`}
                >
                  <span className="inline-block self-start font-raleway font-semibold text-[10px] uppercase tracking-[0.12em] text-beco-olive-accent px-3 py-1 border border-beco-olive-accent rounded-full">
                    {project.tag}
                  </span>
                  <h3 className="font-playfair italic text-[22px] lg:text-[24px] text-beco-dark mt-4 leading-[1.3]">
                    {project.title}
                  </h3>
                  <p className="font-raleway text-[14px] text-beco-dark/70 leading-[1.7] mt-3">
                    {project.description}
                  </p>
                  <Link
                    to="/projects"
                    className="font-raleway font-semibold text-[12px] uppercase text-beco-primary mt-5 hover:underline"
                  >
                    {t('common.discoverProject')}
                  </Link>
                </div>
              </div>
            ))}
            {displayProjects.length === 0 && (
              <p className="text-center text-gray-400 py-12">Aucun projet disponible pour le moment</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
