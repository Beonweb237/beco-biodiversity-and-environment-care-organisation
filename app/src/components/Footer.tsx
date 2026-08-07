import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { trpc } from '@/providers/trpc';
import { partners } from '@/lib/partnersData';

const CONTACT_EMAIL = 'administration@becocameroon.org';
const CONTACT_PHONE = '+237 6 57 90 27 84';

export default function Footer() {
  const { t } = useTranslation();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const subscribeMutation = trpc.admin.public.submitNewsletter.useMutation();

  const { data: settings } = trpc.admin.public.getSettings.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const siteSettings = useMemo(() => {
    const map: Record<string, string> = {};
    settings?.forEach((s) => {
      map[s.key] = s.value || '';
    });
    return map;
  }, [settings]);

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

  const navLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.projects'), path: '/projects' },
    { label: t('nav.news'), path: '/news' },
  ];

  const exploreLinks = [
    { label: t('nav.involved'), path: '/involved' },
    { label: t('nav.contact'), path: '/contact' },
    { label: 'FAQ', path: '/faq' },
  ];

  const email = siteSettings['contact_email'] || CONTACT_EMAIL;
  const phone = siteSettings['contact_phone'] || CONTACT_PHONE;
  const address = siteSettings['contact_address'] || t('footer.address');

  const contactItems = [
    { icon: MapPin, value: address, href: null },
    { icon: Mail, value: email, href: `mailto:${email}` },
    { icon: Phone, value: phone, href: `tel:${phone.replace(/[^+\d]/g, '')}` },
  ];

  // Seuls les réseaux réellement renseignés en admin sont affichés.
  const socials = [
    { name: 'Facebook', icon: Facebook, url: siteSettings['facebook_url'] },
    { name: 'Instagram', icon: Instagram, url: siteSettings['instagram_url'] },
    { name: 'LinkedIn', icon: Linkedin, url: siteSettings['linkedin_url'] },
  ].filter((s) => s.url && s.url !== '#');

  return (
    <footer className="relative bg-beco-primary text-white">
      {/* Filet d'accent en haut du footer */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-beco-secondary/50 to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-12">
          {/* Marque */}
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white p-1.5 shadow-sm">
                <img
                  src="/assets/logo-icon.png?v=20260801a"
                  alt="BECO Logo"
                  loading="lazy"
                  className="h-full w-full rounded-full object-contain"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = '/assets/logo-icon.svg';
                  }}
                />
              </div>
              <p className="font-playfair font-bold text-[22px] leading-none tracking-[0.06em] text-white">
                {t('common.siteName')}
              </p>
            </div>

            <p className="font-raleway text-[13px] text-white/65 leading-[1.8] mt-6 max-w-[320px]">
              {t('footer.description')}
            </p>

            {socials.length > 0 && (
              <div className="mt-7">
                <p className="font-raleway font-semibold text-[10px] uppercase tracking-[0.16em] text-white/40">
                  {t('footer.followUs')}
                </p>
                <div className="flex items-center gap-2.5 mt-3">
                  {socials.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 hover:bg-beco-secondary hover:border-beco-secondary hover:text-beco-primary hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <social.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <FooterHeading>{t('footer.navigation')}</FooterHeading>
            <nav className="flex flex-col gap-3 mt-5">
              {navLinks.map((link) => (
                <FooterLink key={link.path} to={link.path}>
                  {link.label}
                </FooterLink>
              ))}
            </nav>
          </div>

          {/* Explorer */}
          <div className="lg:col-span-2">
            <FooterHeading>{t('footer.explore')}</FooterHeading>
            <nav className="flex flex-col gap-3 mt-5">
              {exploreLinks.map((link) => (
                <FooterLink key={link.path} to={link.path}>
                  {link.label}
                </FooterLink>
              ))}
            </nav>
          </div>

          {/* Contact + Newsletter */}
          <div className="sm:col-span-2 lg:col-span-4">
            <FooterHeading>{t('footer.contact')}</FooterHeading>
            <ul className="flex flex-col gap-3.5 mt-5">
              {contactItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/10 text-beco-secondary">
                    <item.icon className="w-3.5 h-3.5" />
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="font-raleway text-[13px] leading-[1.6] text-white/70 hover:text-white transition-colors duration-300 break-all"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="font-raleway text-[13px] leading-[1.6] text-white/70">
                      {item.value}
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-7 border-t border-white/10">
              <FooterHeading>{t('footer.newsletter')}</FooterHeading>
              {subscribed ? (
                <div className="flex items-center gap-2 mt-4">
                  <Check className="w-4 h-4 text-beco-secondary shrink-0" />
                  <p className="font-raleway text-[13px] text-beco-secondary">
                    {t('home.newsletter.success')}
                  </p>
                </div>
              ) : (
                <>
                  <p className="font-raleway text-[12px] text-white/50 leading-[1.7] mt-3">
                    {t('footer.newsletterText')}
                  </p>
                  <form
                    onSubmit={handleNewsletterSubmit}
                    className="relative mt-4 max-w-[340px]"
                  >
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder={t('common.emailPlaceholder')}
                      required
                      aria-label={t('common.yourEmail')}
                      className="w-full rounded-full border border-white/20 bg-white/5 py-3 ps-5 pe-14 font-raleway text-[13px] text-white placeholder:text-white/40 outline-none focus:border-beco-secondary/70 focus:bg-white/10 transition-colors duration-300"
                    />
                    <button
                      type="submit"
                      disabled={subscribeMutation.isPending}
                      aria-label={t('common.subscribe')}
                      className="absolute end-1.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-beco-secondary text-beco-primary hover:bg-white hover:scale-105 transition-all duration-300 disabled:opacity-50"
                    >
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Partenaires — Logos */}
      <div className="border-t border-white/10 py-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="font-raleway text-[11px] uppercase tracking-[0.15em] text-white/40 text-center mb-8">
            {t('footer.partners')}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-5 sm:gap-6">
            {partners.map((partner) => (
              <div
                key={partner.abbr}
                title={partner.name}
                className="flex h-[76px] w-[165px] items-center justify-center rounded-lg bg-white/95 px-4 py-3 hover:bg-white hover:-translate-y-0.5 transition-all duration-300"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Barre inférieure */}
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <p className="font-raleway text-[12px] text-white/40 text-center">
            {t('common.allRightsReserved')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link
              to="/legal"
              className="font-raleway text-[11px] uppercase tracking-wider text-white/40 hover:text-white/80 transition-colors duration-300"
            >
              {t('nav.legal')}
            </Link>
            <Link
              to="/privacy"
              className="font-raleway text-[11px] uppercase tracking-wider text-white/40 hover:text-white/80 transition-colors duration-300"
            >
              {t('footer.privacy')}
            </Link>
            <Link
              to="/faq"
              className="font-raleway text-[11px] uppercase tracking-wider text-white/40 hover:text-white/80 transition-colors duration-300"
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-raleway font-semibold text-[11px] uppercase tracking-[0.16em] text-beco-secondary">
      {children}
    </h4>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 font-raleway text-[13px] text-white/65 hover:text-white transition-colors duration-300"
    >
      <span className="h-px w-0 bg-beco-secondary group-hover:w-3 transition-all duration-300" />
      <span className="group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform duration-300">
        {children}
      </span>
    </Link>
  );
}
