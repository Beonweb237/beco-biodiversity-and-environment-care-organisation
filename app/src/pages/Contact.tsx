import { useState, useMemo } from 'react';
import PageHeader from '../components/PageHeader';
import { useScrollReveal } from '../hooks/useScrollReveal';
import SEOHead from '../components/SEOHead';
import { MapPin, Mail, Phone, Globe, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { trpc } from '@/providers/trpc';

export default function Contact() {
  const { t } = useTranslation();
  const ref = useScrollReveal<HTMLElement>({ stagger: 0.2 });
  const mapRef = useScrollReveal<HTMLElement>({});

  // Form state
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const submitMutation = trpc.admin.public.submitContact.useMutation();

  const { data: settings } = trpc.admin.public.getSettings.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const siteSettings = useMemo(() => {
    const map: Record<string, string> = {};
    settings?.forEach((s) => { map[s.key] = s.value || ''; });
    return map;
  }, [settings]);

  const contactItems = [
    { icon: MapPin, label: t('contact.info.address'), value: siteSettings['contact_address'] || t('contact.info.addressValue'), href: null },
    { icon: Mail, label: t('contact.info.email'), value: siteSettings['contact_email'] || t('contact.info.emailValue'), href: `mailto:${siteSettings['contact_email'] || t('contact.info.emailValue')}` },
    { icon: Phone, label: t('contact.info.phone'), value: siteSettings['contact_phone'] || t('contact.info.phoneValue'), href: `tel:${siteSettings['contact_phone'] || t('contact.info.phoneValue')}` },
    { icon: Globe, label: t('contact.info.website'), value: siteSettings['contact_website'] || t('contact.info.websiteValue'), href: `https://${siteSettings['contact_website'] || t('contact.info.websiteValue')}` },
  ];

  const requestOptions = t('contact.form.requestOptions', { returnObjects: true }) as Array<{ value: string; label: string }>;

  const socials = [
    { name: 'Facebook', icon: Facebook, url: siteSettings['social_facebook'] || '#' },
    { name: 'Instagram', icon: Instagram, url: siteSettings['social_instagram'] || '#' },
    { name: 'LinkedIn', icon: Linkedin, url: siteSettings['social_linkedin'] || '#' },
    { name: 'X', icon: null as React.ElementType | null, url: siteSettings['social_x'] || '#' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await submitMutation.mutateAsync({
        firstName,
        lastName,
        email,
        subject: subject || undefined,
        type: type || undefined,
        message,
      });
      setSubmitted(true);
      setLastName('');
      setFirstName('');
      setEmail('');
      setSubject('');
      setType('');
      setMessage('');
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <>
      <SEOHead
        title={t('contact.pageTitle')}
        description="Contactez BECO pour toute question, partenariat ou collaboration. Basé à Yaoundé, Cameroun."
        path="/contact"
      />
      <PageHeader title={t('contact.pageTitle')} image="/assets/contact-header.jpg" />

      <section ref={ref} className="bg-white py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6 grid lg:grid-cols-[7fr_5fr] gap-16">
          {/* Form */}
          <div data-reveal>
            <p className="section-label">{t('contact.form.label')}</p>
            <h2 className="font-playfair italic text-[28px] text-beco-dark leading-[1.3] mt-3">
              {t('contact.form.title')}
            </h2>
            <p className="font-raleway text-[14px] text-beco-dark/70 leading-[1.7] mt-3">
              {t('contact.form.description')}
            </p>

            {submitted ? (
              <div className="mt-8 p-6 bg-beco-olive-light rounded-lg">
                <p className="font-raleway text-[15px] text-beco-dark font-medium">
                  Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="font-raleway text-[13px] text-beco-primary mt-4 hover:underline"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder={t('contact.form.lastNamePlaceholder')}
                    className="w-full px-4 py-3.5 border border-black/15 rounded-lg font-raleway text-[14px] outline-none focus:border-beco-primary transition-colors"
                  />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder={t('contact.form.firstNamePlaceholder')}
                    className="w-full px-4 py-3.5 border border-black/15 rounded-lg font-raleway text-[14px] outline-none focus:border-beco-primary transition-colors"
                  />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t('contact.form.emailPlaceholder')}
                  className="w-full px-4 py-3.5 border border-black/15 rounded-lg font-raleway text-[14px] outline-none focus:border-beco-primary transition-colors"
                />
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={t('contact.form.subjectPlaceholder')}
                  className="w-full px-4 py-3.5 border border-black/15 rounded-lg font-raleway text-[14px] outline-none focus:border-beco-primary transition-colors"
                />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-3.5 border border-black/15 rounded-lg font-raleway text-[14px] outline-none focus:border-beco-primary transition-colors bg-white"
                >
                  {requestOptions?.map((opt, i) => (
                    <option key={i} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder={t('contact.form.messagePlaceholder')}
                  rows={6}
                  className="w-full px-4 py-3.5 border border-black/15 rounded-lg font-raleway text-[14px] outline-none focus:border-beco-primary transition-colors resize-none"
                />
                {error && (
                  <p className="font-raleway text-[13px] text-red-500">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="btn-primary self-start disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitMutation.isPending ? 'Envoi en cours...' : t('contact.form.cta')}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div data-reveal>
            <div className="bg-beco-off-white rounded-xl p-10">
              <h3 className="font-raleway font-semibold text-[16px] text-beco-dark mb-6">
                {t('contact.info.title')}
              </h3>
              <div className="space-y-6">
                {contactItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <item.icon className="w-5 h-5 text-beco-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-raleway font-medium text-[12px] uppercase tracking-[0.1em] text-beco-dark/50">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="font-raleway text-[14px] text-beco-dark hover:text-beco-primary transition-colors duration-300"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-raleway text-[14px] text-beco-dark">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-black/10 mt-7 pt-7">
                <h4 className="font-raleway font-semibold text-[14px] text-beco-dark">
                  {t('contact.info.socialMedia')}
                </h4>
                <div className="flex flex-wrap gap-3 mt-4">
                  {socials.map((s, i) => (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 border border-beco-primary rounded-lg font-raleway text-[13px] text-beco-primary hover:bg-beco-primary hover:text-white transition-all duration-300"
                    >
                      {s.icon && <s.icon className="w-4 h-4" />}
                      {s.name}
                    </a>
                  ))}
                </div>
              </div>

              <div className="border-t border-black/10 mt-7 pt-7">
                <h4 className="font-raleway font-semibold text-[14px] text-beco-dark">
                  {t('contact.info.hours')}
                </h4>
                <p className="font-raleway text-[13px] text-beco-dark/65 mt-2">
                  {t('contact.info.weekdays')}
                </p>
                <p className="font-raleway text-[13px] text-beco-dark/65 mt-1">
                  {t('contact.info.saturday')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section ref={mapRef} className="h-[400px] bg-beco-off-white" data-reveal>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255281.1989200681!2d11.40480705!3d3.830 Waters!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf7a309a7977%3A0x7f54bad35e693c51!2sYaound%C3%A9%2C%20Cameroun!5e0!3m2!1sfr!2s!4v1700000000000!5m2!1sfr!2s"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(0.3) contrast(1.1)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localisation BECO - Yaoundé"
        />
      </section>
    </>
  );
}
