import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 4, suffix: '+', label: 'Projets actifs' },
  { value: 2025, suffix: '', label: 'Année de création' },
  { value: 10, suffix: '', label: 'Domaines d\'intervention' },
  { value: 7, suffix: '', label: 'Membres de l\'équipe' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value]);

  return (
    <span ref={ref}>
      {display}{suffix}
    </span>
  );
}

export default function ImpactNumbers() {
  const ref = useRef<HTMLElement>(null);

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
  }, []);

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
