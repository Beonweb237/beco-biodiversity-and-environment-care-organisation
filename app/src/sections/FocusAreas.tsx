import { useScrollReveal } from '../hooks/useScrollReveal';

const areas = [
  { image: '/assets/focus-biodiversity.jpg', title: 'Conservation de la biodiversité', desc: 'Inventaires, suivis et protection des espèces menacées à travers des approches scientifiques innovantes.' },
  { image: '/assets/focus-environment.jpg', title: 'Protection de l\'environnement', desc: 'Préservation des écosystèmes et gestion durable des ressources naturelles.' },
  { image: '/assets/focus-climate.jpg', title: 'Changement climatique', desc: 'Atténuation et adaptation aux changements climatiques dans les communautés vulnérables.' },
  { image: '/assets/focus-agriculture.jpg', title: 'Agriculture durable', desc: 'Promotion de pratiques agricoles respectueuses de l\'environnement et de l\'agroécologie.' },
  { image: '/assets/focus-onehealth.jpg', title: 'One Health', desc: 'Intégration de la santé humaine, animale et environnementale pour un développement durable.' },
  { image: '/assets/focus-wildlife.jpg', title: 'Conservation de la faune', desc: 'Protection des espèces sauvages et de leurs habitats contre le braconnage et la perte d\'habitat.' },
  { image: '/assets/focus-forest.jpg', title: 'Restauration des forêts', desc: 'Reboisement et rehabilitation des paysages dégradés pour retrouver la biodiversité.' },
  { image: '/assets/focus-education.jpg', title: 'Éducation environnementale', desc: 'Sensibilisation et formation des communautés, des écoles et des jeunes à la protection de la nature.' },
  { image: '/assets/focus-community.jpg', title: 'Développement communautaire', desc: 'Accompagnement des populations locales vers des modes de vie durables et autonomes.' },
  { image: '/assets/focus-research.jpg', title: 'Recherche et innovation', desc: 'Études scientifiques et développement de technologies pour la conservation.' },
];

export default function FocusAreas() {
  const ref = useScrollReveal<HTMLElement>({ stagger: 0.1 });

  return (
    <section ref={ref} className="bg-beco-off-white py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14" data-reveal>
          <p className="section-label">NOS DOMAINES D'INTERVENTION</p>
          <h2 className="section-title mt-4">
            Agir sur tous les fronts de l'environnement
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {areas.map((area, i) => (
            <div
              key={i}
              data-reveal
              className="group relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer"
            >
              {/* Image */}
              <img
                src={area.image}
                alt={area.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Base overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Title at rest */}
              <div className="absolute bottom-5 left-0 right-0 text-center px-3 transition-all duration-500 group-hover:-translate-y-16">
                <h3 className="font-raleway font-medium text-[13px] uppercase tracking-[0.1em] text-white leading-tight">
                  {area.title}
                </h3>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-beco-primary opacity-0 group-hover:opacity-90 transition-opacity duration-500 flex flex-col justify-center items-center px-5">
                <h3 className="font-raleway font-medium text-[14px] uppercase tracking-[0.1em] text-white transition-transform duration-400 -translate-y-2 group-hover:translate-y-0">
                  {area.title}
                </h3>
                <p className="font-raleway text-[13px] text-white/85 leading-[1.6] mt-3 text-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 delay-150">
                  {area.desc}
                </p>
                <span className="font-raleway font-semibold text-[11px] uppercase text-beco-secondary mt-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-250">
                  En savoir plus &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
