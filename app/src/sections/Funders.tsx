import { useScrollReveal } from '../hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';
import { usePublicPartners } from '@/lib/api/public';
import { useMemo } from 'react';
import { partners, getPartnerLogo } from '@/lib/partnersData';

const defaultFunders = partners.map((p) => ({ name: p.name, abbr: p.abbr, logo: p.logo }));

export default function Funders() {
  const { t } = useTranslation();
  const ref = useScrollReveal<HTMLElement>({ stagger: 0.1 });

  const { data: dbPartners } = usePublicPartners();

  const funders = useMemo(() => {
    if (dbPartners && dbPartners.length > 0) {
      return dbPartners.map((p) => ({
        name: p.name,
        abbr: p.abbr,
        logo: p.logo || getPartnerLogo(p.abbr, p.name),
      }));
    }
    return defaultFunders;
  }, [dbPartners]);

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12" data-reveal>
          <p className="section-label">{t('home.funders.label')}</p>
          <h2 className="font-playfair text-[28px] text-beco-dark mt-3">
            {t('home.funders.title')}
          </h2>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-10 sm:gap-x-16">
          {funders.map((funder, i) => (
            <div
              key={i}
              data-reveal
              title={funder.name}
              className="group flex h-[70px] w-[150px] sm:w-[170px] items-center justify-center"
            >
              {funder.logo ? (
                <img
                  src={funder.logo}
                  alt={funder.name || funder.abbr}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <span className="font-raleway font-bold text-[22px] sm:text-[26px] tracking-[0.15em] text-beco-dark/40 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:text-beco-primary transition-all duration-300 cursor-default">
                  {funder.abbr}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
