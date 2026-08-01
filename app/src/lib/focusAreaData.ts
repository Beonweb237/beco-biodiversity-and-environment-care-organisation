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

export const actionKeys = [
  { key: 'biodiversity', actions: ['Inventaires et suivis des espèces menacées', 'Protection des habitats naturels', 'Sensibilisation des communautés locales', 'Partenariats scientifiques internationaux'] },
  { key: 'environment', actions: ['Gestion durable des ressources naturelles', 'Réduction de la pollution et des déchets', 'Promotion des énergies renouvelables', 'Évaluation des impacts environnementaux'] },
  { key: 'climate', actions: ['Atténuation des émissions de gaz à effet de serre', 'Adaptation des communautés vulnérables', 'Reforestation et puits de carbone', 'Éducation aux risques climatiques'] },
  { key: 'agriculture', actions: ['Promotion de l\'agroécologie', 'Formation aux pratiques durables', 'Sécurité alimentaire des communautés', 'Restauration des sols dégradés'] },
  { key: 'onehealth', actions: ['Surveillance des maladies émergentes', 'Lien santé humaine-animale-environnementale', 'Recherche interdisciplinaire', 'Prévention des zoonoses'] },
  { key: 'wildlife', actions: ['Protection des espèces menacées', 'Lutte contre le braconnage', 'Suivi des populations animales', 'Conservation des corridors écologiques'] },
  { key: 'forest', actions: ['Reboisement des zones dégradées', 'Restauration des écosystèmes forestiers', 'Agroforesterie communautaire', 'Protection des forêts sacrées'] },
  { key: 'education', actions: ['Formation des jeunes à l\'environnement', 'Ateliers dans les écoles', 'Campagnes de sensibilisation', 'Production de supports pédagogiques'] },
  { key: 'community', actions: ['Autonomisation des populations locales', 'Développement de filières durables', 'Microprojets communautaires', 'Renforcement des capacités'] },
  { key: 'research', actions: ['Études scientifiques appliquées', 'Monitoring acoustique et technologique', 'Publication de données et résultats', 'Innovation pour la conservation'] },
];
