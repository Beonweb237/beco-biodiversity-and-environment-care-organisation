import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
}

export default function SEOHead({ title, description, image, path }: SEOHeadProps) {
  const { t } = useTranslation();

  const siteName = t('common.siteName');
  const tagline = t('common.tagline');
  const baseUrl = 'https://www.afrotropical.org';

  const pageTitle = title ? `${title} — ${siteName}` : `${siteName} — ${tagline}`;
  const pageDescription = description || t('footer.description');
  const pageImage = image ? `${baseUrl}${image}` : `${baseUrl}/assets/hero-1.jpg`;
  const pageUrl = path ? `${baseUrl}${path}` : baseUrl;

  useEffect(() => {
    document.title = pageTitle;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', pageDescription);

    // Open Graph
    setMeta('og:title', pageTitle);
    setMeta('og:description', pageDescription);
    setMeta('og:image', pageImage);
    setMeta('og:url', pageUrl);
    setMeta('og:type', 'website');
    setMeta('og:site_name', siteName);

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', pageTitle);
    setMeta('twitter:description', pageDescription);
    setMeta('twitter:image', pageImage);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageUrl);
  }, [pageTitle, pageDescription, pageImage, pageUrl, siteName]);

  return null;
}

function setMeta(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}
