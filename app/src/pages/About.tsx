import PageHeader from '../components/PageHeader';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Target, Eye, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePublicTeam, usePageContent } from '@/lib/api/public';
import SEOHead from '../components/SEOHead';
import { getPageDef } from '@contracts/pageContent';

export default function About() {
  const { t, i18n } = useTranslation();
  const storyRef = useScrollReveal<HTMLElement>({ stagger: 0.2 });
  const mvvRef = useScrollReveal<HTMLElement>({ stagger: 0.15 });
  const objRef = useScrollReveal<HTMLElement>({ stagger: 0.08 });
  const teamRef = useScrollReveal<HTMLElement>({ stagger: 0.1 });

  const { data: dbMembers } = usePublicTeam();

  // Contenu éditable de la page (stocké en base par langue, repli FR côté API).
  const lang = (i18n.language || 'fr').split('-')[0];
  const { data: pageContent } = usePageContent('about', lang);
  const sections = pageContent?.sections ?? {};
  const pageDef = getPageDef('about');

  /** Valeur éditée si présente, sinon traduction i18n par défaut. */
  const resolve = (sectionId: string, fieldKey: string): string => {
    const edited = sections?.[sectionId]?.[fieldKey];
    if (edited) return edited;
    const field = pageDef?.sections.find((s) => s.id === sectionId)?.fields.find((f) => f.key === fieldKey);
    return field ? t(field.i18n) : '';
  };

  const values = [
    { icon: Target, title: resolve('mvv', 'mission'), text: resolve('mvv', 'missionText') },
    { icon: Eye, title: resolve('mvv', 'vision'), text: resolve('mvv', 'visionText') },
    { icon: Heart, title: resolve('mvv', 'values'), text: resolve('mvv', 'valuesText') },
  ];

  const objectives = t('about.objectives.list', { returnObjects: true }) as string[];

  // Build team members from DB or fallback
  // `image` vide => photo générique. `imagePos` recadre quand le visage n'est pas
  // au centre du cliché (le cadre est carré, la photo souvent en portrait).
  const fallbackMembers = [
    { name: 'Dr SIMEU NOUTCHOM Alain', role: 'Chief Executive Officer (CEO)', status: '', image: '/assets/team/dr-simeu-noutchom-alain.jpg', imagePos: '' },
    { name: 'BAPITE NLOH Gloria', role: 'Secrétaire Générale', status: 'Doctorante', image: '/assets/team/bapite-nloh-gloria.jpg', imagePos: 'center 35%' },
    { name: 'TSAFACK TSAGUE Sharone', role: 'Vice-Secrétaire Générale', status: 'Doctorante', image: '', imagePos: '' },
    { name: 'NOUAKO EMENI Ange', role: 'Secrétaire Financière / Trésorière', status: 'Étudiante', image: '', imagePos: '' },
    { name: 'FOUOGHAP DIFOUO Carmel', role: 'Coordonnatrice des Projets', status: 'Doctorante', image: '/assets/team/fouoghap-difouo-carmel.jpg', imagePos: 'center 72%' },
    { name: 'TONFACK Robert', role: 'Coordonnateur Agriculture Durable', status: 'Doctorant', image: '', imagePos: '' },
    { name: 'MIMLBE Theophile / BOUTCHOUANG Will', role: 'Chargés de Communication / Webmasters', status: '', image: '', imagePos: '' },
  ];

  const displayMembers = dbMembers && dbMembers.length > 0
    ? dbMembers.map((m) => ({
      name: m.name,
      role: m.role,
      status: m.status || undefined,
      description: m.description || undefined,
      image: m.image || undefined,
      imagePos: '',
    }))
    : fallbackMembers;

  return (
    <>
      <SEOHead
        title={resolve('header', 'pageTitle')}
        description="Découvrez l'histoire, la mission et l'équipe de BECO, organisation dédiée à la conservation de la biodiversité au Cameroun."
        path="/about"
      />
      <PageHeader title={resolve('header', 'pageTitle')} image="/assets/about-header.jpg" />

      {/* Team */}
      <section ref={teamRef} className="bg-beco-off-white py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14" data-reveal>
            <p className="section-label">{resolve('teamSection', 'title')}</p>
            <h2 className="section-title mt-4">
              {resolve('teamSection', 'label')}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-14">
            {displayMembers.map((member, i) => (
              <div key={i} data-reveal className="group text-center">
                <div className="w-full max-w-[168px] aspect-square mx-auto rounded-full overflow-hidden mb-5 bg-beco-olive-light ring-1 ring-black/5 shadow-[0_4px_16px_rgba(0,0,0,0.07)] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.13)] transition-shadow duration-300">
                  <img
                    src={member.image || '/assets/team-header.jpg'}
                    alt={member.name}
                    loading="lazy"
                    style={member.imagePos ? { objectPosition: member.imagePos } : undefined}
                    className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500"
                  />
                </div>
                <h4 className="font-raleway font-semibold text-[15px] text-beco-dark">
                  {member.name}
                </h4>
                <p className="font-raleway text-[12.5px] text-beco-olive-accent mt-1.5">
                  {member.role}
                </p>
                {member.status && (
                  <p className="font-raleway text-[11.5px] text-beco-dark/50 mt-1">
                    {member.status}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section ref={storyRef} className="bg-white py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div data-reveal>
            <p className="section-label">{resolve('story', 'label')}</p>
            <h2 className="section-title mt-4">
              {resolve('story', 'title')}
            </h2>
            <p className="font-raleway text-[15px] text-beco-dark/75 leading-[1.7] mt-5">
              {resolve('story', 'p1')}
            </p>
            <p className="font-raleway text-[15px] text-beco-dark/75 leading-[1.7] mt-4">
              {resolve('story', 'p2')}
            </p>
            <p className="font-raleway text-[15px] text-beco-dark/75 leading-[1.7] mt-4">
              {resolve('story', 'p3')}
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
            <p className="section-label">{resolve('mvv', 'label')}</p>
            <h2 className="section-title mt-4">{resolve('mvv', 'title')}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((item, i) => (
              <div
                key={i}
                data-reveal
                className="bg-white rounded-xl p-12 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
              >
                <item.icon className="w-12 h-12 text-beco-primary mx-auto mb-6" />
                <h3 className="font-playfair text-[24px] text-beco-dark">
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
            <p className="section-label">{resolve('objectives', 'label')}</p>
            <h2 className="section-title mt-4">
              {resolve('objectives', 'title')}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {objectives.map((obj: string, i: number) => (
              <div
                key={i}
                data-reveal
                className="flex gap-5 p-6 bg-beco-off-white rounded-lg"
              >
                <span className="font-playfair font-bold text-[32px] text-beco-primary leading-none min-w-[48px]">
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
    </>
  );
}
