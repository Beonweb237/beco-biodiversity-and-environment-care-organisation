import PageHeader from '../components/PageHeader';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { User, Building, Award, Check, Shield, FileText, Mail } from 'lucide-react';

const memberships = [
  {
    icon: User,
    title: 'Membre Actif',
    description: 'Pour les individus souhaitant s\'engager activement dans nos programmes et activités.',
    benefits: [
      'Participation aux assemblées générales',
      'Droit de vote et d\'éligibilité',
      'Accès aux formations et ateliers',
      'Informations prioritaires sur les activités',
      'Réseautage avec d\'autres membres',
    ],
  },
  {
    icon: Building,
    title: 'Membre Institutionnel',
    description: 'Pour les organisations, institutions et entreprises partageant nos valeurs.',
    benefits: [
      'Représentation aux assemblées générales',
      'Partenariats prioritaires',
      'Visibilité sur nos supports de communication',
      'Accès à nos rapports et publications',
      'Collaboration sur des projets conjoints',
    ],
  },
  {
    icon: Award,
    title: 'Membre Honoraire',
    description: 'Titre décerné aux personnes ayant rendu des services exceptionnels à l\'organisation.',
    benefits: [
      'Reconnaissance publique de l\'organisation',
      'Participation aux événements spéciaux',
      'Accès privilégié aux rapports annuels',
      'Mention dans les publications BECO',
    ],
  },
];

const volunteerOps = [
  'Mission de terrain : suivi de la faune et de la flore',
  'Soutien à la recherche scientifique',
  'Animation d\'ateliers d\'éducation environnementale',
  'Communication et sensibilisation',
  'Appui administratif et logistique',
];

export default function Involved() {
  const memRef = useScrollReveal<HTMLElement>({ stagger: 0.15 });
  const volRef = useScrollReveal<HTMLElement>({ stagger: 0.2 });
  const donRef = useScrollReveal<HTMLElement>({ stagger: 0.1 });

  return (
    <>
      <PageHeader title="S'impliquer" image="/assets/involved-header.jpg" />

      {/* Membership */}
      <section ref={memRef} className="bg-white py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14" data-reveal>
            <p className="section-label">DEVENIR MEMBRE</p>
            <h2 className="section-title mt-4">Rejoignez la communauté BECO</h2>
            <p className="font-raleway text-[15px] text-beco-dark/75 leading-[1.7] max-w-[640px] mx-auto mt-4">
              BECO offre plusieurs catégories d'adhésion pour s'engager à nos côtés
              dans la conservation de la biodiversité. Choisissez celle qui vous correspond le mieux.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {memberships.map((card, i) => (
              <div
                key={i}
                data-reveal
                className="bg-beco-off-white rounded-xl p-10 text-center border-2 border-transparent hover:border-beco-primary hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(74,83,42,0.1)] transition-all duration-300"
              >
                <card.icon className="w-12 h-12 text-beco-primary mx-auto mb-5" />
                <h3 className="font-raleway font-semibold text-[18px] text-beco-dark">
                  {card.title}
                </h3>
                <p className="font-raleway text-[13px] text-beco-dark/65 leading-[1.6] mt-3">
                  {card.description}
                </p>
                <ul className="text-left mt-5 space-y-2">
                  {card.benefits.map((b, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-beco-primary mt-0.5 flex-shrink-0" />
                      <span className="font-raleway text-[13px] text-beco-dark/70">{b}</span>
                    </li>
                  ))}
                </ul>
                <button className="btn-outline w-full mt-6">Adhérer</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer */}
      <section ref={volRef} className="bg-beco-primary py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div data-reveal>
            <p className="section-label text-beco-secondary">BÉNÉVOLAT</p>
            <h2 className="font-playfair italic text-[32px] text-white leading-[1.3] mt-4">
              Donnez de votre temps pour la nature
            </h2>
            <p className="font-raleway text-[15px] text-white/85 leading-[1.7] mt-4">
              Les bénévoles sont essentiels à la réussite de nos projets. Que vous soyez
              étudiant, professionnel ou retraité, vos compétences et votre énergie peuvent
              faire une différence concrète pour la conservation de la biodiversité au Cameroun.
            </p>
            <div className="mt-7 space-y-4">
              {volunteerOps.map((op, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-beco-secondary flex-shrink-0" />
                  <span className="font-raleway text-[14px] text-white/85">{op}</span>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal>
            <div className="bg-white rounded-2xl p-10">
              <h3 className="font-raleway font-semibold text-[18px] text-beco-dark text-center mb-6">
                Formulaire de candidature
              </h3>
              <form className="flex flex-col gap-4">
                <input type="text" placeholder="Nom complet" className="w-full px-4 py-3.5 border border-black/15 rounded-lg font-raleway text-[14px] outline-none focus:border-beco-primary transition-colors" />
                <input type="email" placeholder="Adresse email" className="w-full px-4 py-3.5 border border-black/15 rounded-lg font-raleway text-[14px] outline-none focus:border-beco-primary transition-colors" />
                <input type="tel" placeholder="Téléphone" className="w-full px-4 py-3.5 border border-black/15 rounded-lg font-raleway text-[14px] outline-none focus:border-beco-primary transition-colors" />
                <select className="w-full px-4 py-3.5 border border-black/15 rounded-lg font-raleway text-[14px] outline-none focus:border-beco-primary transition-colors bg-white">
                  <option value="">Domaine d'intérêt</option>
                  <option value="conservation">Conservation</option>
                  <option value="recherche">Recherche</option>
                  <option value="education">Éducation</option>
                  <option value="communication">Communication</option>
                  <option value="administration">Administration</option>
                </select>
                <textarea placeholder="Dites-nous en plus sur votre motivation et vos compétences..." rows={4} className="w-full px-4 py-3.5 border border-black/15 rounded-lg font-raleway text-[14px] outline-none focus:border-beco-primary transition-colors resize-none" />
                <button type="submit" className="btn-primary w-full mt-2">
                  Envoyer ma candidature
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Donate */}
      <section ref={donRef} className="bg-beco-off-white py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14" data-reveal>
            <p className="section-label">FAIRE UN DON</p>
            <h2 className="section-title mt-4">
              Soutenez nos actions de conservation
            </h2>
            <p className="font-raleway text-[15px] text-beco-dark/75 leading-[1.7] max-w-[640px] mx-auto mt-4">
              Votre contribution, quelle que soit sa taille, nous permet de mener nos projets
              de conservation, de former de jeunes chercheurs et de protéger la biodiversité africaine.
              Chaque don compte.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12" data-reveal>
            {['10 000 FCFA', '25 000 FCFA', '50 000 FCFA', 'Montant libre'].map((amount, i) => (
              <button
                key={i}
                className="py-5 px-6 border-2 border-beco-primary rounded-xl font-raleway font-semibold text-[16px] text-beco-primary bg-transparent hover:bg-beco-primary hover:text-white transition-all duration-300 text-center"
              >
                {amount}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { icon: Shield, title: 'Sécurisé', text: 'Vos transactions sont sécurisées et vos données protégées.' },
              { icon: FileText, title: 'Reçu fiscal', text: 'Un reçu fiscal vous sera délivré pour chaque don.' },
              { icon: Mail, title: 'Transparence', text: 'Rapport annuel détaillant l\'utilisation des fonds.' },
            ].map((info, i) => (
              <div key={i} data-reveal className="text-center">
                <info.icon className="w-9 h-9 text-beco-primary mx-auto" />
                <h4 className="font-raleway font-semibold text-[14px] text-beco-dark mt-3">
                  {info.title}
                </h4>
                <p className="font-raleway text-[13px] text-beco-dark/65 mt-2">
                  {info.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
