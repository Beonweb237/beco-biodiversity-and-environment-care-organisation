import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { useScrollReveal } from '../hooks/useScrollReveal';

const allNews = [
  {
    image: '/assets/news-1.jpg',
    tag: 'Projet',
    date: 'Janvier 2026',
    title: 'Lancement du projet de protection des perroquets gris dans le Mpem & Djim',
    excerpt: 'BECO lance un nouveau programme de conservation financé par la fondation 1Wild pour protéger les populations de perroquets gris dans le Parc National de Mpem & Djim.',
    category: 'Projets',
  },
  {
    image: '/assets/news-2.jpg',
    tag: 'Recherche',
    date: 'Novembre 2025',
    title: 'BECO obtient une subvention de la British Ecological Society',
    excerpt: 'Notre projet sur la variabilité acoustique des Orthoptères en réponse aux variables climatiques sur la Ligne du Cameroun Volcanique a été sélectionné par la BES.',
    category: 'Publications',
  },
  {
    image: '/assets/project-acoustic.jpg',
    tag: 'Projet',
    date: 'Septembre 2025',
    title: 'Deuxième Rufford Small Grant pour le monitoring acoustique',
    excerpt: 'BECO reçoit le deuxième Rufford Small Grant (n°48049-2) pour poursuivre le monitoring acoustique passif des Orthoptères dans le Parc National de Mpem & Djim.',
    category: 'Projets',
  },
  {
    image: '/assets/news-4.jpg',
    tag: 'Événement',
    date: 'Avril 2025',
    title: 'BECO sélectionné pour le programme CDKN African Early-Career Researchers',
    excerpt: 'Notre directeur exécutif, Dr SIMEU NOUTCHOM Alain, a été sélectionné comme fellow du programme CDKN pour les chercheurs africains en début de carrière.',
    category: 'Événements',
  },
  {
    image: '/assets/about-home.jpg',
    tag: 'Organisation',
    date: 'Juin 2025',
    title: 'Création officielle de BECO à Yaoundé',
    excerpt: 'La Biodiversity and Environment Care Organisation est officiellement créée et enregistrée à Yaoundé, au Cameroun, par un groupe de jeunes chercheurs passionnés.',
    category: 'Événements',
  },
  {
    image: '/assets/hero-2.jpg',
    tag: 'Publication',
    date: 'À venir',
    title: 'Premiers résultats du monitoring acoustique des Orthoptères',
    excerpt: 'Les premières données collectées dans le cadre de notre projet de monitoring acoustique révèlent une richesse remarquable de la communauté d\'Orthoptères du Mpem & Djim.',
    category: 'Publications',
  },
];

const filters = ['Tout', 'Projets', 'Publications', 'Événements'];

export default function News() {
  const [activeFilter, setActiveFilter] = useState('Tout');
  const ref = useScrollReveal<HTMLElement>({ stagger: 0.12 });

  const filteredNews =
    activeFilter === 'Tout'
      ? allNews
      : allNews.filter((n) => n.category === activeFilter);

  return (
    <>
      <PageHeader title="Actualités" image="/assets/news-header.jpg" />

      <section ref={ref} className="bg-white py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14" data-reveal>
            <p className="section-label">NOS ACTUALITÉS</p>
            <h2 className="section-title mt-4">
              Restez informés de nos actions
            </h2>
          </div>

          {/* Filters */}
          <div className="flex justify-center gap-4 mb-10" data-reveal>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`font-raleway font-medium text-[12px] uppercase px-5 py-2 rounded-full transition-all duration-300 ${
                  activeFilter === f
                    ? 'bg-beco-primary text-white'
                    : 'bg-transparent border border-beco-primary text-beco-primary hover:bg-beco-primary hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((article, i) => (
              <article
                key={i}
                data-reveal
                className="bg-white rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-shadow duration-300"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-raleway font-semibold text-[10px] uppercase tracking-[0.12em] text-beco-primary px-2.5 py-0.5 border border-beco-primary rounded-full">
                      {article.tag}
                    </span>
                    <span className="font-raleway text-[12px] text-beco-dark/50">
                      {article.date}
                    </span>
                  </div>
                  <h3 className="font-raleway font-semibold text-[16px] text-beco-dark leading-[1.4]">
                    {article.title}
                  </h3>
                  <p className="font-raleway text-[13px] text-beco-dark/65 leading-[1.6] mt-2">
                    {article.excerpt}
                  </p>
                  <a
                    href="#"
                    className="inline-block font-raleway font-semibold text-[11px] uppercase text-beco-primary mt-4 hover:underline"
                  >
                    Lire la suite &rarr;
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-12">
            <span className="w-10 h-10 rounded-full bg-beco-primary text-white flex items-center justify-center font-raleway font-medium text-[13px]">
              1
            </span>
            <button className="w-10 h-10 rounded-full border border-beco-primary/20 text-beco-dark flex items-center justify-center font-raleway text-[13px] hover:border-beco-primary hover:text-beco-primary transition-colors duration-200">
              2
            </button>
            <button className="w-10 h-10 rounded-full border border-beco-primary/20 text-beco-dark flex items-center justify-center font-raleway text-[13px] hover:border-beco-primary hover:text-beco-primary transition-colors duration-200">
              &rarr;
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
