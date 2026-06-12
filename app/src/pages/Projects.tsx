import PageHeader from '../components/PageHeader';
import { useScrollReveal } from '../hooks/useScrollReveal';

const categories = [
  { title: 'Biodiversité & Conservation', count: '4 projets', desc: 'Inventaires, suivis d\'espèces et protection de la biodiversité', image: '/assets/focus-biodiversity.jpg' },
  { title: 'Restauration des écosystèmes', count: '2 projets', desc: 'Reboisement et rehabilitation des paysages dégradés', image: '/assets/focus-forest.jpg' },
  { title: 'Changement climatique', count: '2 projets', desc: 'Adaptation et résilience des communautés face au climat', image: '/assets/focus-climate.jpg' },
  { title: 'Éducation environnementale', count: '1 projet', desc: 'Sensibilisation et formation des communautés', image: '/assets/focus-education.jpg' },
  { title: 'One Health', count: '1 projet', desc: 'Intégration santé humaine, animale et environnementale', image: '/assets/focus-onehealth.jpg' },
  { title: 'Recherche scientifique', count: '3 projets', desc: 'Études et innovation pour la conservation', image: '/assets/focus-research.jpg' },
];

const projects = [
  {
    image: '/assets/project-parrot.jpg',
    tag: 'Biodiversité',
    date: 'Janvier 2026',
    title: 'Protection des perroquets gris dans le Parc National de Mpem & Djim',
    description: 'Ce projet vise à protéger les populations de perroquets gris du Gabon (Psittacus erithacus), espèce menacée par le commerce illégal et la perte d\'habitat, dans le Parc National de Mpem & Djim.',
    details: [
      'Suivi des populations de perroquets gris par comptages et observations',
      'Sensibilisation des communautés locales à la protection de l\'espèce',
      'Lutte contre le braconnage et le commerce illégal',
      'Cartographie des zones de nidification prioritaires',
    ],
    funder: '1Wild Foundation',
  },
  {
    image: '/assets/project-acoustic.jpg',
    tag: 'Recherche',
    date: 'Septembre 2025',
    title: 'Monitoring acoustique passif des Orthoptères pour la conservation',
    description: 'Projet utilisant la surveillance acoustique passive pour étudier les communautés d\'Orthoptères (sauterelles et grillons) dans le Parc National de Mpem & Djim, des indicateurs clés de la santé des écosystèmes.',
    details: [
      'Déploiement de capteurs acoustiques dans différents habitats du parc',
      'Analyse des signaux acoustiques pour identifier les espèces',
      'Évaluation de la biodiversité des Orthoptères comme bioindicateurs',
      'Création d\'une base de données acoustique de référence',
    ],
    funder: 'Rufford Foundation',
  },
  {
    image: '/assets/project-volcanic.jpg',
    tag: 'Changement climatique',
    date: 'Novembre 2025',
    title: 'Variabilité acoustique des Orthoptères en réponse aux variables climatiques',
    description: 'Étude des variations saisonnières et altitudinales de l\'activité acoustique des Orthoptères sur la Ligne du Cameroun Volcanique, contribuant à la compréhension des impacts du changement climatique sur la biodiversité.',
    details: [
      'Échantillonnage acoustique sur plusieurs sites à différentes altitudes',
      'Corrélation des données acoustiques avec les variables climatiques',
      'Modélisation des impacts du changement climatique sur les populations',
      'Publication scientifique des résultats',
    ],
    funder: 'British Ecological Society',
  },
  {
    image: '/assets/hero-2.jpg',
    tag: 'Recherche',
    date: 'Avril 2025',
    title: 'Fellows chercheurs en début de carrière sur le changement climatique',
    description: 'Programme de soutien aux chercheurs africains en début de carrière travaillant sur l\'avancement de la recherche sur le changement climatique à travers l\'Afrique.',
    details: [
      'Mentorat et accompagnement de chercheurs juniors',
      'Financement de projets de recherche innovants',
      'Renforcement des capacités en recherche climatique',
      'Mise en réseau des chercheurs africains',
    ],
    funder: 'CDKN',
  },
];

export default function Projects() {
  const catRef = useScrollReveal<HTMLElement>({ stagger: 0.1 });
  const projRef = useScrollReveal<HTMLElement>({ stagger: 0.2 });

  return (
    <>
      <PageHeader title="Nos projets" image="/assets/projects-header.jpg" />

      {/* Categories */}
      <section ref={catRef} className="bg-white py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14" data-reveal>
            <p className="section-label">NOS DOMAINES D'ACTION</p>
            <h2 className="section-title mt-4">
              Des projets concrets sur le terrain
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <div
                key={i}
                data-reveal
                className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
              >
                <img
                  src={cat.image}
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section ref={projRef} className="bg-beco-off-white py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14" data-reveal>
            <p className="section-label">PROJETS EN COURS</p>
            <h2 className="section-title mt-4">Nos actions sur le terrain</h2>
          </div>
          <div className="flex flex-col gap-10">
            {projects.map((project, i) => (
              <div
                key={i}
                data-reveal
                className="grid md:grid-cols-[5fr_7fr] bg-white rounded-xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full aspect-video md:aspect-auto object-cover"
                />
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="font-raleway font-semibold text-[10px] uppercase tracking-[0.12em] text-beco-olive-accent px-3 py-1 border border-beco-olive-accent rounded-full">
                      {project.tag}
                    </span>
                    <span className="font-raleway text-[12px] text-beco-dark/50">
                      {project.date}
                    </span>
                  </div>
                  <h3 className="font-playfair italic text-[22px] lg:text-[24px] text-beco-dark leading-[1.3]">
                    {project.title}
                  </h3>
                  <p className="font-raleway text-[14px] text-beco-dark/70 leading-[1.7] mt-3">
                    {project.description}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {project.details.map((detail, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-beco-primary mt-2 flex-shrink-0" />
                        <span className="font-raleway text-[13px] text-beco-dark/65">
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 pt-4 border-t border-black/8">
                    <span className="font-raleway text-[12px] text-beco-dark/50">
                      Financé par :
                    </span>
                    <span className="font-raleway font-semibold text-[13px] text-beco-dark ml-2">
                      {project.funder}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
