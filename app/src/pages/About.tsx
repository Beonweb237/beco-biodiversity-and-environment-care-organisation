import PageHeader from '../components/PageHeader';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Target, Eye, Heart } from 'lucide-react';

const values = [
  { icon: Target, title: 'Notre mission', text: 'Promouvoir la conservation de la biodiversité, la durabilité environnementale, l\'atténuation et l\'adaptation aux changements climatiques, l\'agriculture durable, la santé publique et l\'autonomisation des communautés par la recherche, l\'éducation, l\'innovation et les actions de conservation.' },
  { icon: Eye, title: 'Notre vision', text: 'Un monde où la biodiversité est conservée, les écosystèmes sont gérés de manière durable, la résilience climatique est renforcée et les communautés vivent en harmonie avec la nature.' },
  { icon: Heart, title: 'Nos valeurs', text: 'Intégrité — Innovation — Collaboration — Durabilité — Inclusion — Excellence. Ces six valeurs guident chacune de nos actions et décisions au quotidien.' },
];

const objectives = [
  'Contribuer à la conservation de la biodiversité et des espèces menacées',
  'Promouvoir la protection de l\'environnement et la gestion durable des ressources naturelles',
  'Renforcer la résilience climatique dans les communautés vulnérables',
  'Soutenir les pratiques agricoles durables',
  'Faire progresser les approches One Health liant santé humaine, animale et environnementale',
  'Restaurer les écosystèmes et paysages dégradés',
  'Améliorer la sensibilisation et l\'éducation environnementale',
  'Mener des recherches scientifiques et de l\'innovation',
  'Autonomiser les communautés par des initiatives de développement durable',
  'Établir des partenariats pour la conservation et la durabilité environnementale',
];

const teamMembers = [
  { name: 'Dr SIMEU NOUTCHOM Alain', role: 'Directeur Exécutif', status: 'PhD', image: '/assets/about-home.jpg' },
  { name: 'BAPITE NLOH Gloria', role: 'Secrétaire Générale', status: 'Doctorante' },
  { name: 'TSAFACK TSAGUE Sharone', role: 'Vice-Secrétaire Générale', status: 'Doctorante' },
  { name: 'NOUAKO EMENI Ange', role: 'Secrétaire Financière / Trésorière', status: 'Étudiante' },
  { name: 'FOUOGHAP DIFOUO Carmel', role: 'Coordonnatrice des Projets', status: 'Doctorante' },
  { name: 'TONFACK Robert', role: 'Coordonnateur Agriculture Durable', status: 'Doctorant' },
  { name: 'MIMLBE Theophile / BOUTCHOUANG Will', role: 'Chargés de Communication / Webmasters', status: '' },
];

export default function About() {
  const storyRef = useScrollReveal<HTMLElement>({ stagger: 0.2 });
  const mvvRef = useScrollReveal<HTMLElement>({ stagger: 0.15 });
  const objRef = useScrollReveal<HTMLElement>({ stagger: 0.08 });
  const teamRef = useScrollReveal<HTMLElement>({ stagger: 0.1 });

  return (
    <>
      <PageHeader title="À propos de BECO" image="/assets/about-header.jpg" />

      {/* Story */}
      <section ref={storyRef} className="bg-white py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div data-reveal>
            <p className="section-label">NOTRE HISTOIRE</p>
            <h2 className="section-title mt-4">
              Nés de la passion pour la nature africaine
            </h2>
            <p className="font-raleway text-[15px] text-beco-dark/75 leading-[1.7] mt-5">
              La Biodiversity and Environment Care Organisation (BECO) est une organisation
              indépendante, apolitique et sans but lucratif, créée en 2025 à Yaoundé, Cameroun.
              Fondée par le Dr SIMEU NOUTCHOM Alain et une équipe de jeunes chercheurs passionnés,
              BECO est née d'un constat simple : la biodiversité africaine, parmi la plus riche au
              monde, est menacée comme jamais auparavant.
            </p>
            <p className="font-raleway text-[15px] text-beco-dark/75 leading-[1.7] mt-4">
              Face à la dégradation des écosystèmes, la perte d'habitats et les effets du changement
              climatique, nous avons choisi l'action. Notre approche combine recherche scientifique
              rigoureuse, engagement communautaire et innovation technologique pour créer des solutions
              durables et adaptées au contexte africain.
            </p>
            <p className="font-raleway text-[15px] text-beco-dark/75 leading-[1.7] mt-4">
              Aujourd'hui, BECO mène plusieurs projets actifs au Cameroun, mobilise un réseau de
              partenaires internationaux et forme la prochaine génération de conservationnistes africains.
            </p>
          </div>
          <div data-reveal className="overflow-hidden rounded-lg">
            <img
              src="/assets/team-header.jpg"
              alt="Équipe BECO"
              className="w-full aspect-[3/4] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section ref={mvvRef} className="bg-beco-off-white py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14" data-reveal>
            <p className="section-label">CE QUI NOUS ANIME</p>
            <h2 className="section-title mt-4">Mission, vision et valeurs</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((item, i) => (
              <div
                key={i}
                data-reveal
                className="bg-white rounded-xl p-12 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
              >
                <item.icon className="w-12 h-12 text-beco-primary mx-auto mb-6" />
                <h3 className="font-playfair italic text-[24px] text-beco-dark">
                  {item.title}
                </h3>
                <p className="font-raleway text-[14px] text-beco-dark/70 leading-[1.7] mt-4">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section ref={objRef} className="bg-white py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14" data-reveal>
            <p className="section-label">NOS OBJECTIFS</p>
            <h2 className="section-title mt-4">
              Dix objectifs pour un impact mesurable
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {objectives.map((obj, i) => (
              <div
                key={i}
                data-reveal
                className="flex gap-5 p-6 bg-beco-off-white rounded-lg"
              >
                <span className="font-playfair font-bold italic text-[32px] text-beco-primary leading-none min-w-[48px]">
                  {i + 1}
                </span>
                <p className="font-raleway text-[14px] text-beco-dark/80 leading-[1.6]">
                  {obj}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section ref={teamRef} className="bg-beco-off-white py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14" data-reveal>
            <p className="section-label">NOTRE ÉQUIPE</p>
            <h2 className="section-title mt-4">
              Des passionnés au service de la nature
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, i) => (
              <div key={i} data-reveal className="text-center">
                <div className="w-full aspect-square rounded-full overflow-hidden mb-5 bg-beco-olive-light">
                  <img
                    src={member.image || '/assets/team-header.jpg'}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-raleway font-semibold text-[16px] text-beco-dark">
                  {member.name}
                </h4>
                <p className="font-raleway text-[13px] text-beco-olive-accent mt-1">
                  {member.role}
                </p>
                {member.status && (
                  <p className="font-raleway text-[12px] text-beco-dark/50 mt-1">
                    {member.status}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
