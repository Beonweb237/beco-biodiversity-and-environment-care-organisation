import PageHeader from '../components/PageHeader';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Linkedin, Mail } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { useTranslation } from 'react-i18next';
import { trpc } from '@/providers/trpc';

export default function Team() {
  const { t } = useTranslation();
  const descRef = useScrollReveal<HTMLElement>({});
  const gridRef = useScrollReveal<HTMLElement>({ stagger: 0.12 });

  const { data: dbMembers, isLoading } = trpc.admin.public.getPublishedTeam.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const translationMembers = t('team.members', { returnObjects: true }) as Array<{
    name: string; role: string; status?: string; description: string; image?: string;
  }> | null;

  const fallbackImages = [
    '/assets/hero-1.jpg', '/assets/hero-4.jpg', '/assets/hero-5.jpg',
    '/assets/focus-community.jpg', '/assets/hero-3.jpg',
    '/assets/focus-agriculture.jpg', '/assets/focus-education.jpg',
  ];

  // Use DB members if available, fall back to translation data
  const displayMembers = dbMembers && dbMembers.length > 0
    ? dbMembers.map((m) => ({
      name: m.name,
      role: m.role,
      status: m.status || undefined,
      description: m.description || '',
      image: m.image || undefined,
      linkedin: m.linkedin || undefined,
      email: m.email || undefined,
    }))
    : Array.isArray(translationMembers)
      ? translationMembers.map((m) => ({
        name: m.name,
        role: m.role,
        status: m.status,
        description: m.description || '',
        image: m.image,
        linkedin: undefined,
        email: undefined,
      }))
      : [];

  return (
    <>
      <SEOHead
        title={t('team.pageTitle')}
        description="Rencontrez l'équipe de BECO : chercheurs, experts et passionnés dédiés à la conservation de la biodiversité au Cameroun."
        path="/team"
      />
      <PageHeader title={t('team.pageTitle')} image="/assets/team-header.jpg" />

      {/* Description */}
      <section ref={descRef} className="bg-white py-20">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <p className="section-label" data-reveal>{t('team.label')}</p>
          <h2 className="section-title mt-4" data-reveal>
            {t('team.title')}
          </h2>
          <p className="font-raleway text-[15px] text-beco-dark/75 leading-[1.7] mt-5" data-reveal>
            {t('team.description')}
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section ref={gridRef} className="bg-beco-off-white py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-3 border-beco-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {displayMembers.map((member, i) => (
                <div
                  key={i}
                  data-reveal
                  className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] text-center"
                >
                  <div className="w-full aspect-square overflow-hidden">
                    <img
                      src={member.image || fallbackImages[i] || '/assets/hero-1.jpg'}
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
                    {member.description && (
                      <p className="font-raleway text-[13px] text-beco-dark/65 leading-[1.6] mt-3">
                        {member.description}
                      </p>
                    )}
                    <div className="flex justify-center gap-3 mt-4">
                      {(member.linkedin || false) && (
                        <a href={member.linkedin} className="text-beco-primary/50 hover:text-beco-primary transition-colors duration-300">
                          <Linkedin className="w-[18px] h-[18px]" />
                        </a>
                      )}
                      {(member.email || false) && (
                        <a href={`mailto:${member.email}`} className="text-beco-primary/50 hover:text-beco-primary transition-colors duration-300">
                          <Mail className="w-[18px] h-[18px]" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
