export interface NewsArticleData {
  slug: string;
  index: number;
  image: string;
}

export const newsConfigs: NewsArticleData[] = [
  { slug: 'lancement-perroquets-gris', index: 0, image: '/assets/news-1.jpg' },
  { slug: 'subvention-british-ecological-society', index: 1, image: '/assets/news-2.jpg' },
  { slug: 'deuxieme-rufford-small-grant', index: 2, image: '/assets/project-acoustic.jpg' },
  { slug: 'selectionne-cdkn-early-career', index: 3, image: '/assets/news-4.jpg' },
  { slug: 'creation-officielle-beco', index: 4, image: '/assets/about-home.jpg' },
  { slug: 'premiers-resultats-monitoring-acoustique', index: 5, image: '/assets/hero-2.jpg' },
];
