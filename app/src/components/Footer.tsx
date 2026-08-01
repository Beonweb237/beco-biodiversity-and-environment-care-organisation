import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { trpc } from '@/providers/trpc';

export default function Footer() {
  const { t } = useTranslation();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const subscribeMutation = trpc.admin.public.submitNewsletter.useMutation();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    try {
      await subscribeMutation.mutateAsync({ email: newsletterEmail.trim() });
      setSubscribed(true);
      setNewsletterEmail('');
    } catch {
      // silencieux en footer
    }
  };

  const quickLinks1 = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.projects'), path: '/projects' },
    { label: t('nav.news'), path: '/news' },
  ];

  const quickLinks2 = [
    { label: t('nav.team'), path: '/team' },
    { label: t('nav.involved'), path: '/involved' },
    { label: t('nav.contact'), path: '/contact' },
    { label: t('nav.legal'), path: '/legal' },
  ];

  return (
    <footer className="bg-beco-primary text-white">
      <div className="max-w-[1200px] mx-auto px-6 pt-20 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Colonne 1 - Logo & Description */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-start gap-3 mb-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white p-2 shadow-sm">
                <img
                  src="/assets/logo-icon.png?v=20260801"
                  alt="BECO Logo"
                  loading="lazy"
                  className="h-full w-full rounded-full object-contain"
                />
              </div>
              <div className="leading-tight">
                <p className="font-playfair font-bold text-[14px] text-white leading-snug">
                  Biodiversity and Environment
                </p>
                <p className="font-raleway text-[9px] uppercase tracking-[0.2em] text-[#C9B79C]">
                  Care Organisation
                </p>
                <p className="font-playfair font-bold text-[18px] text-white tracking-wider mt-0.5">
                  — BECO —
                </p>
              </div>
            </div>
            <p className="font-raleway text-[13px] text-white/70 leading-[1.7]">
              {t('footer.description')}
            </p>
          </div>

          {/* Colonne 2 - Liens rapides */}
          <div>
            <nav className="flex flex-col gap-3">
              {quickLinks1.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="font-raleway font-medium text-[11px] uppercase tracking-[0.12em] text-white/60 hover:text-white transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Colonne 3 - Liens rapides suite */}
          <div>
            <nav className="flex flex-col gap-3">
              {quickLinks2.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="font-raleway font-medium text-[11px] uppercase tracking-[0.12em] text-white/60 hover:text-white transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Colonne 4 - Contact */}
          <div>
            <p className="font-raleway text-[13px] text-white/70 leading-[1.7] mb-2">
              {t('footer.address')}
            </p>
            <a
              href="mailto:beco@afrotropical.org"
              className="block font-raleway text-[13px] text-white/70 hover:text-white transition-colors duration-300 mb-1"
            >
              beco@afrotropical.org
            </a>
            <a
              href="tel:+237657902784"
              className="block font-raleway text-[13px] text-white/70 hover:text-white transition-colors duration-300"
            >
              +237 6 57 90 27 84
            </a>
          </div>

          {/* Colonne 5 - Newsletter */}
          <div>
            <h4 className="font-playfair italic text-base text-white mb-4">
              {t('footer.newsletter')}
            </h4>
            {subscribed ? (
              <p className="font-raleway text-[13px] text-beco-secondary">
                Merci pour votre inscription !
              </p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex items-center border-b border-white/30 pb-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={t('common.emailPlaceholder')}
                  required
                  className="bg-transparent text-white placeholder:text-white/50 font-raleway text-[13px] flex-1 outline-none"
                />
                <button
                  type="submit"
                  disabled={subscribeMutation.isPending}
                  className="flex items-center gap-1 font-raleway font-medium text-[12px] uppercase text-white hover:text-beco-secondary transition-colors duration-300 disabled:opacity-50"
                >
                  {subscribeMutation.isPending ? '...' : t('common.subscribe')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Partenaires — Logos */}
      <div className="border-t border-white/10 py-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="font-raleway text-[11px] uppercase tracking-[0.15em] text-white/50 text-center mb-8">
            {t('footer.partners')}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-14">
            <span className="font-raleway font-bold text-[20px] sm:text-[24px] tracking-[0.15em] text-white/40 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:text-beco-secondary transition-all duration-300 cursor-default">
              RUFFORD
            </span>
            <span className="font-raleway font-bold text-[20px] sm:text-[24px] tracking-[0.15em] text-white/40 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:text-beco-secondary transition-all duration-300 cursor-default">
              1WILD
            </span>
            <span className="font-raleway font-bold text-[20px] sm:text-[24px] tracking-[0.15em] text-white/40 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:text-beco-secondary transition-all duration-300 cursor-default">
              MBZ
            </span>
            <span className="font-raleway font-bold text-[20px] sm:text-[24px] tracking-[0.15em] text-white/40 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:text-beco-secondary transition-all duration-300 cursor-default">
              IDEA WILD
            </span>
            <span className="font-raleway font-bold text-[20px] sm:text-[24px] tracking-[0.15em] text-white/40 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:text-beco-secondary transition-all duration-300 cursor-default">
              BES
            </span>
          </div>
        </div>
      </div>

      {/* Barre inférieure */}
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white p-1 shadow-sm">
              <img
                src="/assets/logo-icon.png?v=20260801"
                alt="BECO"
                loading="lazy"
                className="h-full w-full rounded-full object-contain"
              />
            </div>
            <span className="font-playfair font-bold text-[11px] tracking-wider text-white/40 uppercase">
              BECO
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/faq" className="font-raleway text-[11px] uppercase tracking-wider text-white/40 hover:text-white/70 transition-colors">
              FAQ
            </Link>
            <span className="text-white/20">|</span>
            <Link to="/privacy" className="font-raleway text-[11px] uppercase tracking-wider text-white/40 hover:text-white/70 transition-colors">
              Confidentialité
            </Link>
            <span className="text-white/20">|</span>
            <Link to="/legal" className="font-raleway text-[11px] uppercase tracking-wider text-white/40 hover:text-white/70 transition-colors">
              {t('nav.legal')}
            </Link>
          </div>
          <p className="font-raleway text-[12px] text-white/40 text-center">
            {t('common.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
