import { useTranslation } from 'react-i18next';
import PageHeader from '../components/PageHeader';

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="section-title mb-4">{title}</h2>
      <div className="font-raleway text-[15px] text-beco-dark/75 leading-[1.7]">
        {children}
      </div>
    </div>
  );
}

export default function Legal() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t('nav.legal')} image="/assets/hero-1.jpg" />

      <section className="bg-white py-[100px]">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="space-y-10">
            <InfoBlock title={t('legal.identification')}>
              <p className="whitespace-pre-line">
                {t('legal.identificationText')}
              </p>
              <p className="mt-2">
                Email : <a href="mailto:administration@becocameroon.org" className="text-beco-primary hover:underline">administration@becocameroon.org</a><br />
                Téléphone : <a href="tel:+237657902784" className="text-beco-primary hover:underline">+237 6 57 90 27 84</a>
              </p>
            </InfoBlock>

            <InfoBlock title={t('legal.director')}>
              <p>{t('legal.directorText')}</p>
            </InfoBlock>

            <InfoBlock title={t('legal.hosting')}>
              <p>{t('legal.hostingText')}</p>
            </InfoBlock>

            <InfoBlock title={t('legal.intellectualProperty')}>
              <p>{t('legal.intellectualPropertyText')}</p>
            </InfoBlock>

            <InfoBlock title={t('legal.dataProtection')}>
              <p>
                {t('legal.dataProtectionText')}{' '}
                Pour exercer ce droit, veuillez nous contacter à :{' '}
                <a href="mailto:administration@becocameroon.org" className="text-beco-primary hover:underline">administration@becocameroon.org</a>.
              </p>
            </InfoBlock>

            <InfoBlock title={t('legal.cookies')}>
              <p>{t('legal.cookiesText')}</p>
            </InfoBlock>
          </div>
        </div>
      </section>
    </>
  );
}
