import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';

export default function HeroCarousel() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slides = [
    {
      image: '/assets/hero-1.jpg',
      label: t('home.hero.slide1.label'),
      title: t('home.hero.slide1.title'),
      cta: t('home.hero.slide1.cta'),
      ctaLink: '/projects',
    },
    {
      image: '/assets/hero-2.jpg',
      label: t('home.hero.slide2.label'),
      title: t('home.hero.slide2.title'),
      cta: t('home.hero.slide2.cta'),
      ctaLink: '/projects',
    },
    {
      image: '/assets/hero-3.jpg',
      label: t('home.hero.slide3.label'),
      title: t('home.hero.slide3.title'),
      cta: t('home.hero.slide3.cta'),
      ctaLink: '/projects',
    },
    {
      image: '/assets/hero-4.jpg',
      label: t('home.hero.slide4.label'),
      title: t('home.hero.slide4.title'),
      cta: t('home.hero.slide4.cta'),
      ctaLink: '/involved',
    },
    {
      image: '/assets/hero-5.jpg',
      label: t('home.hero.slide5.label'),
      title: t('home.hero.slide5.title'),
      cta: t('home.hero.slide5.cta'),
      ctaLink: '/about',
    },
  ];

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const animateText = useCallback(() => {
    if (!textRef.current) return;
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    const label = textRef.current.querySelector('.slide-label');
    const title = textRef.current.querySelector('.slide-title');
    const cta = textRef.current.querySelector('.slide-cta');

    gsap.set([label, title, cta], { opacity: 0, y: 30 });
    const tl = gsap.timeline();
    tl.to(label, { opacity: 1, y: 0, duration: 0.8, ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }, 0.4)
      .to(title, { opacity: 1, y: 0, duration: 0.8, ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }, 0.6)
      .to(cta, { opacity: 1, y: 0, duration: 0.8, ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }, 0.8);
    timelineRef.current = tl;
  }, []);

  const goTo = useCallback((index: number) => {
    setActive(index);
  }, []);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setActive((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    animateText();
  }, [active, animateText]);

  useEffect(() => {
    intervalRef.current = setInterval(next, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [next]);

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, 6000);
  };

  return (
    <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity ease-out ${
            i === active ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          style={{ transitionDuration: i === active ? '1500ms' : '800ms' }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            loading={i === 0 ? 'eager' : 'lazy'}
            className={`absolute inset-0 w-full h-full object-cover ${
              i === active ? 'ken-burns' : ''
            }`}
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>
      ))}

      {/* Texte */}
      <div
        ref={textRef}
        className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-20 px-6 w-full max-w-[700px]"
      >
        <p className="slide-label font-raleway font-semibold text-[11px] uppercase tracking-[0.15em] text-beco-secondary">
          {slides[active].label}
        </p>
        <h1 className="slide-title font-playfair font-bold italic text-[32px] sm:text-[42px] lg:text-[52px] text-white leading-[1.15] mt-4">
          {slides[active].title}
        </h1>
        <div className="slide-cta mt-8">
          <Link to={slides[active].ctaLink} className="btn-primary">
            {slides[active].cta} &rarr;
          </Link>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-10 start-1/2 -translate-x-1/2 z-20 flex gap-3" role="tablist" aria-label="Navigation des diapositives">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { goTo(i); resetInterval(); }}
            role="tab"
            aria-selected={i === active}
            aria-label={`Diapositive ${i + 1}`}
            className={`w-2.5 h-2.5 rounded-full border-[1.5px] border-white/50 transition-all duration-300 ${
              i === active
                ? 'bg-white border-white'
                : 'bg-transparent hover:border-white'
            }`}
          />
        ))}
      </div>

      {/* Flèches */}
      <button
        onClick={() => { prev(); resetInterval(); }}
        aria-label="Diapositive précédente"
        className="absolute start-6 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white transition-colors duration-300 hidden md:block"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => { next(); resetInterval(); }}
        aria-label="Diapositive suivante"
        className="absolute end-6 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white transition-colors duration-300 hidden md:block"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </section>
  );
}
