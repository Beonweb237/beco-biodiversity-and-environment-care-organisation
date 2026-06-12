import PageHeader from '../components/PageHeader';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Linkedin, Mail } from 'lucide-react';

const teamMembers = [
  {
    name: 'Dr SIMEU NOUTCHOM Alain',
    role: 'Directeur Exécutif',
    status: 'PhD',
    description: 'Fondateur de BECO et chercheur en conservation de la biodiversité. Il coordonne l\'ensemble des activités de l\'organisation et supervise les programmes de recherche.',
    image: '/assets/hero-1.jpg',
  },
  {
    name: 'BAPITE NLOH Gloria',
    role: 'Secrétaire Générale',
    status: 'Doctorante',
    description: 'Responsable de l\'administration et de la coordination interne de l\'organisation. Elle assure le bon fonctionnement opérationnel de BECO.',
    image: '/assets/hero-4.jpg',
  },
  {
    name: 'TSAFACK TSAGUE Sharone',
    role: 'Vice-Secrétaire Générale',
    status: 'Doctorante',
    description: 'Soutien à la coordination administrative et participation aux projets de recherche et de conservation sur le terrain.',
    image: '/assets/hero-5.jpg',
  },
  {
    name: 'NOUAKO EMENI Ange',
    role: 'Secrétaire Financière / Trésorière',
    status: 'Étudiante',
    description: 'Gère les finances de l\'organisation, la comptabilité et le suivi des budgets de projets. Elle veille à la transparence financière de BECO.',
    image: '/assets/focus-community.jpg',
  },
  {
    name: 'FOUOGHAP DIFOUO Carmel',
    role: 'Coordonnatrice des Projets',
    status: 'Doctorante',
    description: 'Supervise la planification, la mise en œuvre et le suivi-évaluation de l\'ensemble des projets de conservation et de recherche.',
    image: '/assets/hero-3.jpg',
  },
  {
    name: 'TONFACK Robert',
    role: 'Coordonnateur Agriculture Durable',
    status: 'Doctorant',
    description: 'Spécialiste en agroécologie et agriculture durable. Il coordonne les programmes liés aux pratiques agricoles durables et à la sécurité alimentaire.',
    image: '/assets/focus-agriculture.jpg',
  },
  {
    name: 'MIMLBE Theophile / BOUTCHOUANG Will',
    role: 'Chargés de Communication / Webmasters',
    status: '',
    description: 'Responsables de la stratégie de communication, des réseaux sociaux et de la présence en ligne de BECO. Ils développent les outils numériques de l\'organisation.',
    image: '/assets/focus-education.jpg',
  },
];

export default function Team() {
  const descRef = useScrollReveal<HTMLElement>({});
  const gridRef = useScrollReveal<HTMLElement>({ stagger: 0.12 });

  return (
    <>
      <PageHeader title="Notre équipe" image="/assets/team-header.jpg" />

      {/* Description */}
      <section ref={descRef} className="bg-white py-20">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <p className="section-label" data-reveal>DES PASSIONNÉS ENGAGÉS</p>
          <h2 className="section-title mt-4" data-reveal>
            Une équipe de chercheurs et de professionnels dévoués
          </h2>
          <p className="font-raleway text-[15px] text-beco-dark/75 leading-[1.7] mt-5" data-reveal>
            BECO réunit des experts en biologie, écologie, agronomie et communication,
            tous unis par la même passion pour la nature et le désir de faire la différence.
            Notre équipe allie expertise scientifique et ancrage local pour développer des
            solutions adaptées aux réalités africaines.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section ref={gridRef} className="bg-beco-off-white py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {teamMembers.map((member, i) => (
              <div
                key={i}
                data-reveal
                className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] text-center"
              >
                <div className="w-full aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-7">
                  <h4 className="font-raleway font-semibold text-[18px] text-beco-dark">
                    {member.name}
                  </h4>
                  <p className="font-raleway font-medium text-[13px] text-beco-primary uppercase tracking-[0.08em] mt-1.5">
                    {member.role}
                  </p>
                  {member.status && (
                    <p className="font-raleway text-[12px] text-beco-dark/50 mt-1">
                      {member.status}
                    </p>
                  )}
                  <p className="font-raleway text-[13px] text-beco-dark/65 leading-[1.6] mt-3">
                    {member.description}
                  </p>
                  <div className="flex justify-center gap-3 mt-4">
                    <a href="#" className="text-beco-primary/50 hover:text-beco-primary transition-colors duration-300">
                      <Linkedin className="w-[18px] h-[18px]" />
                    </a>
                    <a href="#" className="text-beco-primary/50 hover:text-beco-primary transition-colors duration-300">
                      <Mail className="w-[18px] h-[18px]" />
                    </a>
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
