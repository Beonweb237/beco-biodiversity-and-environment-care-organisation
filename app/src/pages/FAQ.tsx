import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const faqKeys = [
  { q: 'faq.q1', a: 'faq.a1' },
  { q: 'faq.q2', a: 'faq.a2' },
  { q: 'faq.q3', a: 'faq.a3' },
  { q: 'faq.q4', a: 'faq.a4' },
  { q: 'faq.q5', a: 'faq.a5' },
  { q: 'faq.q6', a: 'faq.a6' },
  { q: 'faq.q7', a: 'faq.a7' },
  { q: 'faq.q8', a: 'faq.a8' },
];

function FAQItem({ questionKey, answerKey }: { questionKey: string; answerKey: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-start bg-white hover:bg-beco-off-white transition-colors duration-300"
      >
        <h3 className="font-raleway font-semibold text-[15px] text-beco-dark flex-1 pe-4">
          {t(questionKey)}
        </h3>
        <ChevronDown
          className={`w-5 h-5 text-beco-primary flex-shrink-0 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 border-t border-gray-100">
          <p className="font-raleway text-[14px] text-beco-dark/70 leading-[1.7] mt-4">
            {t(answerKey)}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t('faq.pageTitle')} image="/assets/hero-1.jpg" />

      <section className="bg-white py-[100px]">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="text-center mb-14">
            <p className="section-label">{t('faq.label')}</p>
            <h2 className="section-title mt-4">
              {t('faq.title')}
            </h2>
            <p className="font-raleway text-[15px] text-beco-dark/75 leading-[1.7] max-w-[560px] mx-auto mt-4">
              {t('faq.description')}
            </p>
          </div>

          <div className="space-y-3">
            {faqKeys.map((item, i) => (
              <FAQItem key={i} questionKey={item.q} answerKey={item.a} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
