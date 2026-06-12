import { useScrollReveal } from '../hooks/useScrollReveal';

const projects = [
  {
    image: '/assets/project-parrot.jpg',
    tag: 'Biodiversité',
    title: 'Protection des perroquets gris dans le Parc National de Mpem & Djim',
    description:
      'Projet soutenu par la fondation 1Wild visant à protéger les populations de perroquets gris du Parc National de Mpem & Djim à travers le suivi, la sensibilisation des communautés locales et la lutte contre le commerce illégal.',
  },
  {
    image: '/assets/project-acoustic.jpg',
    tag: 'Recherche',
    title: 'Monitoring acoustique des Orthoptères pour la conservation',
    description:
      'Projet financé par le Rufford Small Grant utilisant la surveillance acoustique passive pour étudier les communautés d\'Orthoptères (sauterelles et grillons) dans le Parc National de Mpem & Djim.',
    reverse: true,
  },
  {
    image: '/assets/project-volcanic.jpg',
    tag: 'Changement climatique',
    title: 'Variabilité acoustique des Orthoptères en réponse aux variables climatiques',
    description:
      'Projet soutenu par la British Ecological Society étudiant les variations saisonnières et altitudinales de l\'activité acoustique des Orthoptères sur la Ligne du Cameroun Volcanique.',
  },
];

export default function FeaturedProjects() {
  const ref = useScrollReveal<HTMLElement>({ stagger: 0.2 });

  return (
    <section ref={ref} className="bg-white py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14" data-reveal>
          <p className="section-label">NOS PROJETS</p>
          <h2 className="section-title mt-4">
            Actions concrètes pour la nature
          </h2>
        </div>

        <div className="flex flex-col gap-12">
          {projects.map((project, i) => (
            <div
              key={i}
              data-reveal
              className={`grid md:grid-cols-2 rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)] ${
                project.reverse ? 'md:[direction:rtl]' : ''
              }`}
            >
              <div className={project.reverse ? 'md:[direction:ltr]' : ''}>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full aspect-video md:aspect-auto object-cover"
                />
              </div>
              <div
                className={`bg-beco-olive-light p-8 lg:p-10 flex flex-col justify-center ${
                  project.reverse ? 'md:[direction:ltr]' : ''
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
                <a
                  href="/projects"
                  className="font-raleway font-semibold text-[12px] uppercase text-beco-primary mt-5 hover:underline"
                >
                  Découvrir le projet &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
