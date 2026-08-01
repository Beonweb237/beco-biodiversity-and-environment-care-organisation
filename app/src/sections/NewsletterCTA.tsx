import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';
import { trpc } from '@/providers/trpc';

export default function NewsletterCTA() {
  const { t } = useTranslation();
  const ref = useScrollReveal<HTMLElement>({ stagger: 0.2 });
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const subscribeMutation = trpc.admin.public.submitNewsletter.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) return;
    try {
      await subscribeMutation.mutateAsync({ email: email.trim() });
      setSubmitted(true);
      setEmail('');
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <section ref={ref} className="relative h-[400px] overflow-hidden">
      <img
        src="/assets/newsletter-bg.jpg"
        alt={t('home.newsletter.imageAlt')}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/70 to-[#1A1A1A]/85" />

      <div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-6">
        <div data-reveal>
          <h2 className="font-playfair italic text-[28px] sm:text-[32px] text-white">
            {t('home.newsletter.title')}
          </h2>
        </div>
        <div data-reveal>
          <p className="font-raleway text-[15px] text-white/80 leading-[1.7] max-w-[560px] mt-4">
            {t('home.newsletter.description')}
          </p>
        </div>
        <div data-reveal className="mt-7 w-full max-w-[480px]">
          {submitted ? (
            <div data-reveal className="mt-5">
              <p className="font-raleway text-[15px] text-beco-secondary font-medium">
                {t('home.newsletter.success')}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="font-raleway text-[13px] text-white/70 hover:text-white mt-2 underline"
              >
                S'inscrire à nouveau
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('home.newsletter.placeholder')}
                required
                className="flex-1 px-5 py-3.5 rounded-full border border-white/30 bg-white/10 text-white placeholder:text-white/50 font-raleway text-[14px] outline-none focus:border-white/50 transition-colors"
              />
              <button
                type="submit"
                disabled={subscribeMutation.isPending}
                className="btn-primary whitespace-nowrap disabled:opacity-50"
              >
                {subscribeMutation.isPending ? '...' : t('home.newsletter.cta')}
              </button>
              {error && (
                <p className="font-raleway text-[13px] text-red-300 col-span-full">{error}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
