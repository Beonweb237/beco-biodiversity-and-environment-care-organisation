import { useScrollReveal } from '../hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';
import { usePublicFocusAreas } from '@/lib/api/public';

const areaSlugs = [
  'biodiversity', 'environment', 'climate', 'agriculture', 'onehealth',
  'wildlife', 'forest', 'education', 'community', 'research'
];

export default function FocusAreas() {
  const { t } = useTranslation();
  const ref = useScrollReveal<HTMLElement>({ stagger: 0.1 });

  const { data: dbAreas, isLoading } = usePublicFocusAreas();

  const fallbackAreas = t('focusAreas', { returnObjects: true }) as Array<{ title: string; desc: string }>;

  const areas = dbAreas && dbAreas.length > 0
    ? dbAreas.map((a) => ({
      title: a.title,
      desc: a.description,
    }))
    : fallbackAreas;

  return (
    <section ref={ref} className="bg-beco-off-white py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14" data-reveal>
          <p className="section-label">{t('home.focusAreas.label')}</p>
          <h2 className="section-title mt-4">
            {t('home.focusAreas.title')}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-3 border-beco-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {areas.map((area, i) => (
              <div
                key={i}
                data-reveal
                className="group relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer"
              >
                <img
                  src={`/assets/focus-${areaSlugs[i] || 'biodiversity'}.jpg`}
                  alt={area.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-5 left-0 right-0 text-center px-3 transition-all duration-500 group-hover:-translate-y-16">
                  <h3 className="font-raleway font-medium text-[13px] uppercase tracking-[0.1em] text-white leading-tight">
                    {area.title}
                  </h3>
                </div>
                <div className="absolute inset-0 bg-beco-primary opacity-0 group-hover:opacity-90 transition-opacity duration-500 flex flex-col justify-center items-center px-5">
                  <h3 className="font-raleway font-medium text-[14px] uppercase tracking-[0.1em] text-white transition-transform duration-400 -translate-y-2 group-hover:translate-y-0">
                    {area.title}
                  </h3>
                  <p className="font-raleway text-[13px] text-white/85 leading-[1.6] mt-3 text-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 delay-150">
                    {area.desc}
                  </p>
                  <span className="font-raleway font-semibold text-[11px] uppercase text-beco-secondary mt-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-250">
                    {t('common.readMore')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
