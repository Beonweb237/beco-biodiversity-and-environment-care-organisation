import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Leaf } from 'lucide-react';
import PageHeader from './PageHeader';
import type { FocusAreaConfig } from '../lib/focusAreaData';
import { actionKeys } from '../lib/focusAreaData';

interface FocusAreaPageProps {
  config: FocusAreaConfig;
  extraText?: string;
}

export default function FocusAreaPage({ config }: FocusAreaPageProps) {
  const { t } = useTranslation();
  const areas = t('focusAreas', { returnObjects: true }) as Array<{ title: string; desc: string }>;
  const area = areas[config.index];
  const actions = actionKeys.find((a) => a.key === config.slug)?.actions || [];

  return (
    <>
      <PageHeader title={area?.title || ''} image={config.image} />

      <section className="bg-white py-[100px]">
        <div className="max-w-[1000px] mx-auto px-6">
          <Link
            to="/#focus"
            className="inline-flex items-center gap-2 font-raleway text-[13px] text-beco-primary hover:text-beco-primary-light transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {t('focusAreaPage.backLink')}
          </Link>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="overflow-hidden rounded-xl">
              <img
                src={config.image}
                alt={area?.title}
                className="w-full aspect-[4/3] object-cover"
              />
            </div>

            <div>
              <p className="font-raleway text-[15px] text-beco-dark/75 leading-[1.7]">
                {area?.desc}
              </p>
              <p className="font-raleway text-[15px] text-beco-dark/75 leading-[1.7] mt-4">
                {t('focusAreaPage.actionsText')}
              </p>

              <h3 className="font-playfair italic text-[20px] text-beco-dark mt-8 mb-4">
                {t('focusAreaPage.keyActions')}
              </h3>
              <ul className="space-y-2.5">
                {actions.map((action, i) => (
                  <li key={i} className="flex items-start gap-3 font-raleway text-[14px] text-beco-dark/70">
                    <CheckCircle className="w-5 h-5 text-beco-primary mt-0.5 flex-shrink-0" />
                    {action}
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-5 rounded-xl bg-beco-off-white border border-beco-olive-light/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-beco-primary/10 flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-beco-primary" />
                  </div>
                  <span className="font-raleway font-semibold text-[14px] text-beco-dark">
                    {t('focusAreaPage.relatedProjects')}
                  </span>
                </div>
                <Link
                  to="/projects"
                  className="font-raleway text-[13px] text-beco-primary hover:underline font-medium"
                >
                  {t('focusAreaPage.viewAllProjects')} &rarr;
                </Link>
              </div>

              <div className="mt-6">
                <Link
                  to="/involved"
                  className="btn-primary text-center w-full"
                >
                  {t('focusAreaPage.supportProgram')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
