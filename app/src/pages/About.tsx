import PageHeader from '../components/PageHeader';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Target, Eye, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { trpc } from '@/providers/trpc';
import SEOHead from '../components/SEOHead';

export default function About() {
  const { t } = useTranslation();
  const storyRef = useScrollReveal<HTMLElement>({ stagger: 0.2 });
  const mvvRef = useScrollReveal<HTMLElement>({ stagger: 0.15 });
  const objRef = useScrollReveal<HTMLElement>({ stagger: 0.08 });
  const teamRef = useScrollReveal<HTMLElement>({ stagger: 0.1 });

  const { data: dbMembers } = trpc.admin.public.getPublishedTeam.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const values = [
    { icon: Target, title: t('about.mvv.mission'), text: t('about.mvv.missionText') },
    { icon: Eye, title: t('about.mvv.vision'), text: t('about.mvv.visionText') },
    { icon: Heart, title: t('about.mvv.values'), text: t('about.mvv.valuesText') },
  ];

  const objectives = t('about.objectives.list', { returnObjects: true }) as string[];

  // Build team members from DB or fallback
  const fallbackMembers = [
    { name: 'Dr SIMEU NOUTCHOM Alain', role: 'Directeur Exécutif', status: 'PhD' },
    { name: 'BAPITE NLOH Gloria', role: 'Secrétaire Générale', status: 'Doctorante' },
    { name: 'TSAFACK TSAGUE Sharone', role: 'Vice-Secrétaire Générale', status: 'Doctorante' },
    { name: 'NOUAKO EMENI Ange', role: 'Secrétaire Financière / Trésorière', status: 'Étudiante' },
    { name: 'FOUOGHAP DIFOUO Carmel', role: 'Coordonnatrice des Projets', status: 'Doctorante' },
    { name: 'TONFACK Robert', role: 'Coordonnateur Agriculture Durable', status: 'Doctorant' },
    { name: 'MIMLBE Theophile / BOUTCHOUANG Will', role: 'Chargés de Communication / Webmasters', status: '' },
  ];

  const displayMembers = dbMembers && dbMembers.length > 0
    ? dbMembers.map((m) => ({
      name: m.name,
      role: m.role,
      status: m.status || undefined,
      description: m.description || undefined,
      image: m.image || undefined,
    }))
    : fallbackMembers;

  return (
    <>
      <SEOHead
        title={t('about.pageTitle')}
        description="Découvrez l'histoire, la mission et l'équipe de BECO, organisation dédiée à la conservation de la biodiversité au Cameroun."
        path="/about"
      />
      <PageHeader title={t('about.pageTitle')} image="/assets/about-header.jpg" />

      {/* Story */}
      <section ref={storyRef} className="bg-white py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div data-reveal>
            <p className="section-label">{t('about.story.label')}</p>
            <h2 className="section-title mt-4">
              {t('about.story.title')}
            </h2>
            <p className="font-raleway text-[15px] text-beco-dark/75 leading-[1.7] mt-5">
              {t('about.story.p1')}
            </p>
            <p className="font-raleway text-[15px] text-beco-dark/75 leading-[1.7] mt-4">
              {t('about.story.p2')}
            </p>
            <p className="font-raleway text-[15px] text-beco-dark/75 leading-[1.7] mt-4">
              {t('about.story.p3')}
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
            <p className="section-label">{t('about.mvv.label')}</p>
            <h2 className="section-title mt-4">{t('about.mvv.title')}</h2>
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
            <p className="section-label">{t('about.objectives.label')}</p>
            <h2 className="section-title mt-4">
              {t('about.objectives.title')}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {objectives.map((obj: string, i: number) => (
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
            <p className="section-label">{t('about.teamSection.label')}</p>
            <h2 className="section-title mt-4">
              {t('about.teamSection.title')}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayMembers.map((member, i) => (
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
