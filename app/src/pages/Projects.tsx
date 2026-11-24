import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SEOHead from '../components/SEOHead';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePublicProjects } from '@/lib/api/public';
import { projects as staticProjects, type ProjectData } from '@/lib/projectsData';

export default function Projects() {
  const { t } = useTranslation();
  const projRef = useScrollReveal<HTMLElement>({ stagger: 0.15 });

  const { data: dbProjects } = usePublicProjects();

  // Projets dynamisés depuis Supabase (avec repli sur les données statiques)
  const projects = useMemo<ProjectData[]>(() => {
    if (dbProjects && dbProjects.length > 0) {
      return dbProjects.map((p) => ({
        title: p.title,
        description: p.description,
        image: p.image || '/assets/project-parrot.jpg',
        tag: p.tag,
        url: p.url || '#',
        date: p.date || undefined,
        funder: p.funder || undefined,
      }));
    }
    return staticProjects;
  }, [dbProjects]);

  const [featured, ...others] = projects;

  return (
    <>
      <SEOHead
        title={t('projects.pageTitle')}
        description="Découvrez les projets de conservation, recherche et développement durable menés par BECO au Cameroun."
        path="/projects"
      />
      <PageHeader title={t('projects.pageTitle')} image="/assets/projects-header.jpg" />

      <section ref={projRef} className="bg-beco-off-white py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14" data-reveal>
            <p className="section-label">{t('projects.current.label')}</p>
            <h2 className="section-title mt-4">{t('projects.current.title')}</h2>
          </div>

          {/* Projet mis en avant */}
          <a
            href={featured.url}
            target="_blank"
            rel="noopener noreferrer"
            data-reveal
            className="group grid md:grid-cols-[5fr_7fr] bg-white rounded-xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-shadow duration-300"
          >
            <div className="relative overflow-hidden">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full aspect-video md:aspect-auto object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <ProjectMeta project={featured} />
              <h3 className="font-playfair text-[24px] lg:text-[28px] text-beco-dark leading-[1.3] mt-4 group-hover:text-beco-primary transition-colors duration-300">
                {featured.title}
              </h3>
              <p className="font-raleway text-[14px] lg:text-[15px] text-beco-dark/70 leading-[1.8] mt-4">
                {featured.description}
              </p>
              <ProjectFooter project={featured} label={t('projects.viewProject')} />
            </div>
          </a>

          {/* Autres projets */}
          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 mt-6 lg:mt-8">
            {others.map((project) => (
              <a
                key={project.url}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                data-reveal
                className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-shadow duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                  />
                </div>
                <div className="p-7 lg:p-8 flex flex-col flex-1">
                  <ProjectMeta project={project} />
                  <h3 className="font-playfair text-[19px] lg:text-[21px] text-beco-dark leading-[1.35] mt-4 group-hover:text-beco-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="font-raleway text-[13.5px] text-beco-dark/70 leading-[1.75] mt-3">
                    {project.description}
                  </p>
                  <ProjectFooter project={project} label={t('projects.viewProject')} stretch />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ProjectMeta({ project }: { project: ProjectData }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="font-raleway font-semibold text-[10px] uppercase tracking-[0.12em] text-beco-olive-accent px-3 py-1 border border-beco-olive-accent rounded-full">
        {project.tag}
      </span>
      {project.date && (
        <span className="font-raleway text-[12px] text-beco-dark/50">{project.date}</span>
      )}
    </div>
  );
}

function ProjectFooter({
  project,
  label,
  stretch = false,
}: {
  project: ProjectData;
  label: string;
  stretch?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className={`pt-6 ${stretch ? 'mt-auto' : ''}`}>
      {project.funder && (
        <p className="font-raleway text-[12px] text-beco-dark/50 pb-4">
          {t('common.funder')}
          <span className="font-semibold text-beco-dark ms-2">{project.funder}</span>
        </p>
      )}
      <span className="inline-flex items-center gap-1.5 font-raleway font-semibold text-[12px] uppercase tracking-[0.08em] text-beco-primary border-t border-black/10 pt-4 w-full group-hover:text-beco-olive-accent transition-colors duration-300">
        {label}
        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 rtl:-scale-x-100" />
      </span>
    </div>
  );
}
