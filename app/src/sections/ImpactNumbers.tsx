import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import { trpc } from '@/providers/trpc';

gsap.registerPlugin(ScrollTrigger);

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated) return;

    const proxy = { val: 0 };
    const tween = gsap.to(proxy, {
      val: value,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => setDisplay(Math.round(proxy.val)),
      onComplete: () => setHasAnimated(true),
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, hasAnimated]);

  return (
    <span ref={ref}>
      {display}{suffix}
    </span>
  );
}

export default function ImpactNumbers() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);

  const { data: dbStats } = trpc.admin.public.getStats.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const stats = [
    { value: dbStats?.activeProjects ?? 4, suffix: '+', label: t('home.impactNumbers.activeProjects') },
    { value: dbStats?.yearCreated ?? 2025, suffix: '', label: t('home.impactNumbers.yearCreated') },
    { value: dbStats?.domains ?? 10, suffix: '', label: t('home.impactNumbers.domains') },
    { value: dbStats?.teamMembers ?? 7, suffix: '', label: t('home.impactNumbers.teamMembers') },
  ];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = el.querySelectorAll('[data-stat]');
    gsap.set(items, { opacity: 0, y: 20 });

    const triggers: ScrollTrigger[] = [];
    items.forEach((item, i) => {
      const tween = gsap.to(item, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: i * 0.15,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    return () => triggers.forEach((t) => t.kill());
  }, [stats]);

  return (
    <section ref={ref} className="bg-beco-primary py-20">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {stats.map((stat, i) => (
          <div
            key={i}
            data-stat
            className={`${i < stats.length - 1 ? 'lg:border-r lg:border-white/20' : ''}`}
          >
            <p className="font-playfair font-bold italic text-[40px] sm:text-[48px] text-white">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="font-raleway text-[13px] text-white/70 uppercase tracking-[0.1em] mt-2">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
