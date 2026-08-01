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

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t('privacy.pageTitle')} image="/assets/hero-1.jpg" />

      <section className="bg-white py-[100px]">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="space-y-10">
            <InfoBlock title={t('privacy.dataCollection')}>
              <p>{t('privacy.dataCollectionText')}</p>
            </InfoBlock>

            <InfoBlock title={t('privacy.dataUsage')}>
              <ul className="list-disc pl-6 mt-3 space-y-1">
                <li>{t('privacy.dataUsageList1')}</li>
                <li>{t('privacy.dataUsageList2')}</li>
                <li>{t('privacy.dataUsageList3')}</li>
                <li>{t('privacy.dataUsageList4')}</li>
              </ul>
            </InfoBlock>

            <InfoBlock title={t('privacy.retention')}>
              <p>{t('privacy.retentionText')}</p>
            </InfoBlock>

            <InfoBlock title={t('privacy.security')}>
              <p>{t('privacy.securityText')}</p>
            </InfoBlock>

            <InfoBlock title={t('privacy.rights')}>
              <p>
                {t('privacy.rightsText')}{' '}
                Pour exercer ces droits, contactez-nous à :{' '}
                <a href="mailto:beco@afrotropical.org" className="text-beco-primary hover:underline">beco@afrotropical.org</a>.
              </p>
            </InfoBlock>

            <InfoBlock title={t('privacy.sharing')}>
              <p>{t('privacy.sharingText')}</p>
            </InfoBlock>
          </div>
        </div>
      </section>
    </>
  );
}
