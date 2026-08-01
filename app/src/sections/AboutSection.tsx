import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';

export default function AboutSection() {
  const { t } = useTranslation();
  const ref = useScrollReveal<HTMLElement>({ stagger: 0.2 });

  return (
    <section ref={ref} className="bg-white py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Texte */}
        <div data-reveal>
          <p className="section-label">{t('home.aboutSection.label')}</p>
          <h2 className="section-title mt-4">
            {t('home.aboutSection.title')}
          </h2>
          <p className="font-raleway text-[15px] text-beco-dark/75 leading-[1.7] mt-5">
            {t('home.aboutSection.description')}
          </p>
          <Link to="/about" className="btn-outline mt-7">
            {t('home.aboutSection.cta')}
          </Link>
        </div>

        {/* Image */}
        <div data-reveal className="overflow-hidden rounded-lg">
          <img
            src="/assets/about-home.jpg?v=20260801a"
            alt={t('home.aboutSection.imageAlt')}
            className="w-full aspect-[4/3] object-cover"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = '/assets/about-home.jpg';
            }}
          />
        </div>
      </div>
    </section>
  );
}
