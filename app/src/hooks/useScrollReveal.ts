import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  y?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  threshold?: number;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);
  const {
    y = 40,
    duration = 0.8,
    stagger = 0.15,
    delay = 0,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = el.querySelectorAll('[data-reveal]');
    const targets = children.length > 0 ? children : [el];

    gsap.set(targets, { opacity: 0, y });

    const triggers: ScrollTrigger[] = [];

    targets.forEach((target, i) => {
      const tween = gsap.to(target, {
        opacity: 1,
        y: 0,
        duration,
        delay: delay + i * stagger,
        ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        scrollTrigger: {
          trigger: target,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
      if (tween.scrollTrigger) {
        triggers.push(tween.scrollTrigger);
      }
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [y, duration, stagger, delay]);

  return ref;
}
