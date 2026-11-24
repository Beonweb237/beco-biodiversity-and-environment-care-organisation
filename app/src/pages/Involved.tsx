import { useState, useCallback } from 'react';
import PageHeader from '../components/PageHeader';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { User, Building, Award, Check, Shield, FileText, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { submitVolunteer as submitVolunteerApi } from '@/lib/api/forms';
import SEOHead from '../components/SEOHead';

export default function Involved() {
  const { t } = useTranslation();
  const memRef = useScrollReveal<HTMLElement>({ stagger: 0.15 });
  const volRef = useScrollReveal<HTMLElement>({ stagger: 0.2 });
  const donRef = useScrollReveal<HTMLElement>({ stagger: 0.1 });

  // Volunteer form state
  const [volName, setVolName] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volInterest, setVolInterest] = useState('');
  const [volMotivation, setVolMotivation] = useState('');
  const [volSubmitted, setVolSubmitted] = useState(false);
  const [volError, setVolError] = useState('');
  const [volSubmitting, setVolSubmitting] = useState(false);

  // Donate handler
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const handleDonate = useCallback((amount: string) => {
    setSelectedAmount(amount);
    // TODO: Intégrer un système de paiement (Orange Money, MTN MoMo, PayPal)
    // Pour l'instant, ouvre un email pré-rempli
    const subject = encodeURIComponent(`Don BECO — ${amount}`);
    const body = encodeURIComponent(`Bonjour, je souhaite faire un don de ${amount} à BECO. Merci de me contacter pour les modalités de paiement.`);
    window.open(`mailto:beco@afrotropical.org?subject=${subject}&body=${body}`, '_blank');
  }, []);

  const memberships = [
    {
      icon: User,
      title: t('involved.membership.activeMember'),
      description: t('involved.membership.activeDesc'),
      benefits: t('involved.membership.activeBenefits', { returnObjects: true }) as string[],
    },
    {
      icon: Building,
      title: t('involved.membership.institutionalMember'),
      description: t('involved.membership.institutionalDesc'),
      benefits: t('involved.membership.institutionalBenefits', { returnObjects: true }) as string[],
    },
    {
      icon: Award,
      title: t('involved.membership.honoraryMember'),
      description: t('involved.membership.honoraryDesc'),
      benefits: t('involved.membership.honoraryBenefits', { returnObjects: true }) as string[],
    },
  ];

  const volunteerOps = t('involved.volunteer.opportunities', { returnObjects: true }) as string[];
  const interestOptions = t('involved.volunteer.interestOptions', { returnObjects: true }) as Array<{ value: string; label: string }>;
  const donateAmounts = t('involved.donate.amounts', { returnObjects: true }) as string[];

  return (
    <>
      <SEOHead
        title={t('involved.pageTitle')}
        description={t('involved.donate.description')}
        path="/involved"
      />
      <PageHeader title={t('involved.pageTitle')} image="/assets/involved-header.jpg" />

      {/* Membership */}
      <section ref={memRef} className="bg-white py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14" data-reveal>
            <p className="section-label">{t('involved.membership.label')}</p>
            <h2 className="section-title mt-4">{t('involved.membership.title')}</h2>
            <p className="font-raleway text-[15px] text-beco-dark/75 leading-[1.7] max-w-[640px] mx-auto mt-4">
              {t('involved.membership.description')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {memberships.map((card, i) => (
              <div
                key={i}
                data-reveal
                className="bg-beco-off-white rounded-xl p-10 text-center border-2 border-transparent hover:border-beco-primary hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(74,83,42,0.1)] transition-all duration-300"
              >
                <card.icon className="w-12 h-12 text-beco-primary mx-auto mb-5" />
                <h3 className="font-raleway font-semibold text-[18px] text-beco-dark">
                  {card.title}
                </h3>
                <p className="font-raleway text-[13px] text-beco-dark/65 leading-[1.6] mt-3">
                  {card.description}
                </p>
                <ul className="text-start mt-5 space-y-2">
                  {card.benefits?.map((b, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-beco-primary mt-0.5 flex-shrink-0" />
                      <span className="font-raleway text-[13px] text-beco-dark/70">{b}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className="btn-outline w-full mt-6"
                  onClick={() => handleDonate('Adhésion')}
                >
                  {t('involved.membership.cta')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer */}
      <section ref={volRef} className="bg-beco-primary py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div data-reveal>
            <p className="section-label text-beco-secondary">{t('involved.volunteer.label')}</p>
            <h2 className="font-playfair text-[32px] text-white leading-[1.3] mt-4">
              {t('involved.volunteer.title')}
            </h2>
            <p className="font-raleway text-[15px] text-white/85 leading-[1.7] mt-4">
              {t('involved.volunteer.description')}
            </p>
            <div className="mt-7 space-y-4">
              {volunteerOps?.map((op, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-beco-secondary flex-shrink-0" />
                  <span className="font-raleway text-[14px] text-white/85">{op}</span>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal>
            <div className="bg-white rounded-2xl p-10">
              <h3 className="font-raleway font-semibold text-[18px] text-beco-dark text-center mb-6">
                {t('involved.volunteer.formTitle')}
              </h3>
              {volSubmitted ? (
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-beco-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-7 h-7 text-beco-primary" />
                  </div>
                  <p className="font-raleway font-semibold text-[15px] text-beco-dark">
                    {t('volunteerForm.successTitle')}
                  </p>
                  <p className="font-raleway text-[13px] text-beco-dark/60 mt-2">
                    {t('volunteerForm.successMessage')}
                  </p>
                  <button
                    onClick={() => { setVolSubmitted(false); setVolName(''); setVolEmail(''); setVolPhone(''); setVolInterest(''); setVolMotivation(''); }}
                    className="font-raleway text-[13px] text-beco-primary mt-4 hover:underline"
                  >
                    {t('volunteerForm.sendAnother')}
                  </button>
                </div>
              ) : (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setVolError('');
                  setVolSubmitting(true);
                  try {
                    await submitVolunteerApi({
                      fullName: volName,
                      email: volEmail,
                      phone: volPhone || undefined,
                      interest: volInterest || undefined,
                      motivation: volMotivation || undefined,
                    });
                    setVolSubmitted(true);
                  } catch {
                    setVolError(t('volunteerForm.error'));
                  } finally {
                    setVolSubmitting(false);
                  }
                }} className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={volName}
                    onChange={(e) => setVolName(e.target.value)}
                    required
                    placeholder={t('involved.volunteer.namePlaceholder')}
                    className="w-full px-4 py-3.5 border border-black/15 rounded-lg font-raleway text-[14px] outline-none focus:border-beco-primary transition-colors"
                  />
                  <input
                    type="email"
                    value={volEmail}
                    onChange={(e) => setVolEmail(e.target.value)}
                    required
                    placeholder={t('involved.volunteer.emailPlaceholder')}
                    className="w-full px-4 py-3.5 border border-black/15 rounded-lg font-raleway text-[14px] outline-none focus:border-beco-primary transition-colors"
                  />
                  <input
                    type="tel"
                    value={volPhone}
                    onChange={(e) => setVolPhone(e.target.value)}
                    placeholder={t('involved.volunteer.phonePlaceholder')}
                    className="w-full px-4 py-3.5 border border-black/15 rounded-lg font-raleway text-[14px] outline-none focus:border-beco-primary transition-colors"
                  />
                  <select
                    value={volInterest}
                    onChange={(e) => setVolInterest(e.target.value)}
                    className="w-full px-4 py-3.5 border border-black/15 rounded-lg font-raleway text-[14px] outline-none focus:border-beco-primary transition-colors bg-white"
                  >
                    {interestOptions?.map((opt, j) => (
                      <option key={j} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <textarea
                    value={volMotivation}
                    onChange={(e) => setVolMotivation(e.target.value)}
                    placeholder={t('involved.volunteer.motivationPlaceholder')}
                    rows={4}
                    className="w-full px-4 py-3.5 border border-black/15 rounded-lg font-raleway text-[14px] outline-none focus:border-beco-primary transition-colors resize-none"
                  />
                  {volError && (
                    <p className="font-raleway text-[13px] text-red-500">{volError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={volSubmitting}
                    className="btn-primary w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {volSubmitting ? t('volunteerForm.submitting') : t('involved.volunteer.cta')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Donate */}
      <section ref={donRef} className="bg-beco-off-white py-[100px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14" data-reveal>
            <p className="section-label">{t('involved.donate.label')}</p>
            <h2 className="section-title mt-4">
              {t('involved.donate.title')}
            </h2>
            <p className="font-raleway text-[15px] text-beco-dark/75 leading-[1.7] max-w-[640px] mx-auto mt-4">
              {t('involved.donate.description')}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12" data-reveal>
            {donateAmounts?.map((amount, i) => (
              <button
                key={i}
                onClick={() => handleDonate(amount)}
                className={`py-5 px-6 border-2 rounded-xl font-raleway font-semibold text-[16px] transition-all duration-300 text-center ${selectedAmount === amount
                  ? 'bg-beco-primary text-white border-beco-primary'
                  : 'text-beco-primary border-beco-primary bg-transparent hover:bg-beco-primary hover:text-white'
                  }`}
              >
                {amount}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { icon: Shield, title: t('involved.donate.secure.title'), text: t('involved.donate.secure.text') },
              { icon: FileText, title: t('involved.donate.receipt.title'), text: t('involved.donate.receipt.text') },
              { icon: Mail, title: t('involved.donate.transparency.title'), text: t('involved.donate.transparency.text') },
            ].map((info, i) => (
              <div key={i} data-reveal className="text-center">
                <info.icon className="w-9 h-9 text-beco-primary mx-auto" />
                <h4 className="font-raleway font-semibold text-[14px] text-beco-dark mt-3">
                  {info.title}
                </h4>
                <p className="font-raleway text-[13px] text-beco-dark/65 mt-2">
                  {info.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
