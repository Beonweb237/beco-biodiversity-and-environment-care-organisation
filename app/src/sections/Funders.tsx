import { useScrollReveal } from '../hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';
import { trpc } from '@/providers/trpc';
import { useMemo } from 'react';

const defaultFunders = [
  { name: 'Rufford Foundation', abbr: 'RUFFORD' },
  { name: '1Wild Foundation', abbr: '1WILD' },
  { name: 'MBZ Species Conservation Fund', abbr: 'MBZ' },
  { name: 'IDEA WILD', abbr: 'IDEA WILD' },
  { name: 'British Ecological Society', abbr: 'BES' },
];

export default function Funders() {
  const { t } = useTranslation();
  const ref = useScrollReveal<HTMLElement>({ stagger: 0.1 });

  const { data: settings } = trpc.admin.public.getSettings.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const funders = useMemo(() => {
    const fundersSetting = settings?.find((s) => s.key === 'site_funders');
    if (fundersSetting?.value) {
      try {
        const parsed = JSON.parse(fundersSetting.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((f: { name?: string; abbr?: string }) => ({
            name: f.name || '',
            abbr: f.abbr || f.name || '',
          }));
        }
      } catch {}
    }
    return defaultFunders;
  }, [settings]);

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12" data-reveal>
          <p className="section-label">{t('home.funders.label')}</p>
          <h2 className="font-playfair italic text-[28px] text-beco-dark mt-3">
            {t('home.funders.title')}
          </h2>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-12">
          {funders.map((funder, i) => (
            <div
              key={i}
              data-reveal
              className="group flex items-center justify-center"
            >
              <span className="font-raleway font-bold text-[22px] sm:text-[26px] tracking-[0.15em] text-beco-dark/40 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:text-beco-primary transition-all duration-300 cursor-default">
                {funder.abbr}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
