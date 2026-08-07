export interface ProjectData {
  title: string;
  description: string;
  image: string;
  tag: string;
  /** Lien externe vers la page du projet (site du financeur, fiche projet…). */
  url: string;
  date?: string;
  funder?: string;
}

export const projects: ProjectData[] = [
  {
    title: 'Protecting Grey Parrots in the Mpem & Djim National Park',
    description:
      "Protection du perroquet gris (Psittacus erithacus), dispersateur de graines en déclin rapide, par suivi acoustique innovant dans le parc national de Mpem & Djim. Évaluation des populations, cartographie des habitats, réduction des menaces par sensibilisation communautaire et renforcement des capacités locales.",
    image: '/assets/project-parrot.jpg',
    tag: 'Biodiversité',
    url: 'https://www.1wild.org/case-studies/protecting-grey-parrots-in-mpem-%26-djim-national-park',
    funder: '1Wild Foundation',
  },
  {
    title:
      'Distribution, Bioecology, and Threats of Katydid Species in Mpem & Djim National Park',
    description:
      "Évaluation préliminaire de l'état de conservation des katydids dans le parc national de Mpem & Djim (976 km²). 12 campagnes de terrain avec échantillonnage au filet, 24 transects de 4 km, cartographie QGIS et analyse des menaces anthropiques pour planifier des stratégies de conservation efficaces et durables.",
    image: '/assets/distribution-bioecology.jpg',
    tag: 'Recherche',
    url: 'https://share.google/KP9wxxTDNcc97JJHH',
  },
  {
    title: 'Passive Acoustic Monitoring of Katydid Species for Conservation in Cameroon',
    description:
      "Lauréat 2024 du programme ASPIRE de JRS et CARN, ce projet utilise la surveillance acoustique passive pour la conservation des katydids au Cameroun. Soutien aux jeunes scientifiques africains dans la biodiversité et la durabilité environnementale par la recherche de terrain.",
    image: '/assets/passive-acoustic-monitoring.jpg',
    tag: 'Bioacoustique',
    url: 'https://share.google/QiJUpSRPY2LOf096Z',
    date: '2024',
    funder: 'JRS Biodiversity Foundation & CARN',
  },
  {
    title:
      'Passive Acoustic Monitoring of Orthoptera for Conservation in Mpem & Djim National Park',
    description:
      "Subvention Rufford octroyée en septembre 2025 à Alain Simeu Noutchom pour la surveillance acoustique passive des orthoptères dans le parc national de Mpem & Djim. Développement des travaux précédents avec des unités d'enregistrement autonomes pour la conservation.",
    image: '/assets/focus-research.jpg',
    tag: 'Bioacoustique',
    url: 'https://share.google/tcEtFbCKr0gB4M1WD',
    date: 'Septembre 2025',
    funder: 'The Rufford Foundation',
  },
  {
    title: 'How Environmental Conditions Affect the Sounds of Grasshoppers and Crickets',
    description:
      "Podcast Africa Early Career Fellowship avec le Dr. Alain Simeu Noutchom sur l'impact des conditions environnementales sur les sons des orthoptères. Exploration de leur rôle d'indicateurs de la santé des écosystèmes et de la biodiversité dans les forêts tropicales du Cameroun.",
    image: '/assets/sounds-grasshoppers-crickets.jpg',
    tag: 'Podcast',
    url: 'https://share.google/YpstjZ8yfXhD5F4KG',
  },
];
