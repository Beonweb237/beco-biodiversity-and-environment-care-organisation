export interface FocusAreaConfig {
  slug: string;
  index: number;
  image: string;
}

export const focusAreaConfigs: FocusAreaConfig[] = [
  { slug: 'biodiversity', index: 0, image: '/assets/focus-biodiversity.jpg' },
  { slug: 'environment', index: 1, image: '/assets/focus-environment.jpg' },
  { slug: 'climate', index: 2, image: '/assets/focus-climate.jpg' },
  { slug: 'agriculture', index: 3, image: '/assets/focus-agriculture.jpg' },
  { slug: 'onehealth', index: 4, image: '/assets/focus-onehealth.jpg' },
  { slug: 'wildlife', index: 5, image: '/assets/focus-wildlife.jpg' },
  { slug: 'forest', index: 6, image: '/assets/focus-forest.jpg' },
  { slug: 'education', index: 7, image: '/assets/focus-education.jpg' },
  { slug: 'community', index: 8, image: '/assets/focus-community.jpg' },
  { slug: 'research', index: 9, image: '/assets/focus-research.jpg' },
];

// Note: actionKeys have been moved to translation files (locales/*.json → focusAreaActions)
// Use t('focusAreaActions', { returnObjects: true })[slug] to access them
