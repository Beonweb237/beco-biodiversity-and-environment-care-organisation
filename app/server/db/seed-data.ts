// ============================================================
// BECO — Données de seed (contenu initial du site)
// Correspond aux données actuellement affichées sur le site.
// ============================================================

export const DEFAULT_ADMIN = {
  username: "admin",
  password: "beco2026",
  name: "Administrateur BECO",
  email: "admin@beco-afrotropical.org",
  role: "superadmin" as const,
};

export const seedProjects = [
  {
    title: "Protecting Grey Parrots in the Mpem & Djim National Park",
    slug: "protecting-grey-parrots-mpem-djim",
    tag: "Biodiversité",
    date: null,
    description:
      "Protection du perroquet gris (Psittacus erithacus), dispersateur de graines en déclin rapide, par suivi acoustique innovant dans le parc national de Mpem & Djim. Évaluation des populations, cartographie des habitats, réduction des menaces par sensibilisation communautaire et renforcement des capacités locales.",
    image: "/assets/project-parrot.jpg",
    details: "Suivi des populations de perroquets gris par comptages et observations;Sensibilisation des communautés locales;Lutte contre le braconnage;Cartographie des zones de nidification",
    funder: "1Wild Foundation",
    category: "Biodiversité & Conservation",
    url: "https://www.1wild.org/case-studies/protecting-grey-parrots-in-mpem-%26-djim-national-park",
    isPublished: true,
  },
  {
    title: "Distribution, Bioecology, and Threats of Katydid Species in Mpem & Djim National Park",
    slug: "distribution-bioecology-katydids-mpem-djim",
    tag: "Recherche",
    date: null,
    description:
      "Évaluation préliminaire de l'état de conservation des katydids dans le parc national de Mpem & Djim (976 km²). 12 campagnes de terrain avec échantillonnage au filet, 24 transects de 4 km, cartographie QGIS et analyse des menaces anthropiques pour planifier des stratégies de conservation efficaces et durables.",
    image: "/assets/distribution-bioecology.jpg",
    details: "Échantillonnage au filet;Transects de 4 km;Cartographie QGIS;Analyse des menaces anthropiques",
    funder: null,
    category: "Recherche scientifique",
    url: "https://share.google/KP9wxxTDNcc97JJHH",
    isPublished: true,
  },
  {
    title: "Passive Acoustic Monitoring of Katydid Species for Conservation in Cameroon",
    slug: "passive-acoustic-monitoring-katydids-cameroon",
    tag: "Bioacoustique",
    date: "2024",
    description:
      "Lauréat 2024 du programme ASPIRE de JRS et CARN, ce projet utilise la surveillance acoustique passive pour la conservation des katydids au Cameroun. Soutien aux jeunes scientifiques africains dans la biodiversité et la durabilité environnementale par la recherche de terrain.",
    image: "/assets/passive-acoustic-monitoring.jpg",
    details: "Déploiement de capteurs acoustiques;Analyse des signaux acoustiques;Évaluation de la biodiversité;Soutien aux jeunes chercheurs",
    funder: "JRS Biodiversity Foundation & CARN",
    category: "Recherche scientifique",
    url: "https://share.google/QiJUpSRPY2LOf096Z",
    isPublished: true,
  },
  {
    title: "Passive Acoustic Monitoring of Orthoptera for Conservation in Mpem & Djim National Park",
    slug: "passive-acoustic-monitoring-orthoptera-mpem-djim",
    tag: "Bioacoustique",
    date: "Septembre 2025",
    description:
      "Subvention Rufford octroyée en septembre 2025 à Alain Simeu Noutchom pour la surveillance acoustique passive des orthoptères dans le parc national de Mpem & Djim. Développement des travaux précédents avec des unités d'enregistrement autonomes pour la conservation.",
    image: "/assets/focus-research.jpg",
    details: "Déploiement de capteurs acoustiques;Analyse des signaux acoustiques;Évaluation de la biodiversité;Création d'une base de données acoustique",
    funder: "The Rufford Foundation",
    category: "Recherche scientifique",
    url: "https://share.google/tcEtFbCKr0gB4M1WD",
    isPublished: true,
  },
  {
    title: "How Environmental Conditions Affect the Sounds of Grasshoppers and Crickets",
    slug: "sounds-grasshoppers-crickets",
    tag: "Podcast",
    date: null,
    description:
      "Podcast Africa Early Career Fellowship avec le Dr. Alain Simeu Noutchom sur l'impact des conditions environnementales sur les sons des orthoptères. Exploration de leur rôle d'indicateurs de la santé des écosystèmes et de la biodiversité dans les forêts tropicales du Cameroun.",
    image: "/assets/sounds-grasshoppers-crickets.jpg",
    details: "Podcast scientifique;Indicateurs de santé des écosystèmes;Biodiversité des forêts tropicales",
    funder: null,
    category: "Communication scientifique",
    url: "https://share.google/YpstjZ8yfXhD5F4KG",
    isPublished: true,
  },
];

export const seedNews = [
  {
    title: "Lancement du projet de protection des perroquets gris",
    slug: "lancement-perroquets-gris",
    excerpt: "BECO lance un nouveau programme de conservation financé par la fondation 1Wild.",
    content:
      "BECO annonce le lancement officiel de son nouveau programme de conservation dédié à la protection des perroquets gris dans le Parc National de Mpem & Djim.\n\nGrâce au soutien de la fondation 1Wild, ce projet associe suivi scientifique, sensibilisation communautaire et lutte contre le braconnage.\n\nCe programme marque une étape majeure dans la stratégie de conservation de l'organisation.",
    tag: "Projet",
    date: "Janvier 2026",
    image: "/assets/news-1.jpg",
    category: "Projets",
    isPublished: true,
  },
  {
    title: "BECO obtient une subvention de la British Ecological Society",
    slug: "subvention-british-ecological-society",
    excerpt: "Notre projet sur la variabilité acoustique des Orthoptères a été sélectionné par la BES.",
    content:
      "La British Ecological Society (BES) a octroyé une subvention à BECO pour son projet portant sur la variabilité acoustique des Orthoptères et le climat.\n\nCette reconnaissance internationale témoigne de la qualité scientifique des travaux menés par l'équipe.\n\nLe projet étudiera les variations saisonnières et altitudinales de l'activité acoustique des Orthoptères sur la Ligne du Cameroun Volcanique.",
    tag: "Recherche",
    date: "Novembre 2025",
    image: "/assets/news-2.jpg",
    category: "Publications",
    isPublished: true,
  },
  {
    title: "Deuxième Rufford Small Grant pour le monitoring acoustique",
    slug: "deuxieme-rufford-small-grant",
    excerpt: "BECO reçoit le deuxième Rufford Small Grant pour poursuivre le monitoring acoustique.",
    content:
      "BECO a obtenu un deuxième Rufford Small Grant afin de poursuivre et approfondir le monitoring acoustique passif des Orthoptères.\n\nCette nouvelle subvention permettra de déployer des unités d'enregistrement autonomes supplémentaires et d'étendre la couverture géographique du suivi.\n\nElle confirme la confiance des bailleurs internationaux dans le travail de BECO.",
    tag: "Projet",
    date: "Septembre 2025",
    image: "/assets/project-acoustic.jpg",
    category: "Projets",
    isPublished: true,
  },
  {
    title: "BECO sélectionné pour le programme CDKN",
    slug: "selectionne-cdkn-early-career",
    excerpt: "Notre directeur exécutif a été sélectionné comme fellow du programme CDKN.",
    content:
      "Le directeur exécutif de BECO a été sélectionné comme fellow du programme CDKN (Climate and Development Knowledge Network).\n\nCe programme soutient les chercheurs africains en début de carrière travaillant sur les enjeux du changement climatique.\n\nCette sélection renforce la capacité de BECO à produire des données scientifiques utiles aux politiques climatiques.",
    tag: "Événement",
    date: "Avril 2025",
    image: "/assets/news-4.jpg",
    category: "Événements",
    isPublished: true,
  },
  {
    title: "Création officielle de BECO à Yaoundé",
    slug: "creation-officielle-beco",
    excerpt: "La Biodiversity and Environmental Care Organization est officiellement créée.",
    content:
      "La Biodiversity and Environmental Care Organization (BECO) a été officiellement créée à Yaoundé, au Cameroun.\n\nFondée par le Dr SIMEU NOUTCHOM Alain et une équipe de jeunes chercheurs passionnés, BECO est née d'un constat simple : la biodiversité africaine, parmi les plus riches du monde, est menacée comme jamais.\n\nL'organisation s'engage pour la conservation, la recherche et le développement durable.",
    tag: "Organisation",
    date: "Juin 2025",
    image: "/assets/about-home.jpg",
    category: "Événements",
    isPublished: true,
  },
  {
    title: "Premiers résultats du monitoring acoustique des Orthoptères",
    slug: "premiers-resultats-monitoring-acoustique",
    excerpt: "Les premières données révèlent une richesse remarquable de la communauté d'Orthoptères.",
    content:
      "Les premières données issues du monitoring acoustique passif révèlent une richesse remarquable de la communauté d'Orthoptères dans le Parc National de Mpem & Djim.\n\nCes résultats préliminaires confirment l'importance de ce site pour la conservation de la biodiversité.\n\nL'analyse acoustique ouvre de nouvelles perspectives pour le suivi non invasif des écosystèmes.",
    tag: "Publication",
    date: "À venir",
    image: "/assets/hero-2.jpg",
    category: "Publications",
    isPublished: true,
  },
];

export const seedTeam = [
  { name: "Dr SIMEU NOUTCHOM Alain", role: "Directeur Exécutif", status: "PhD", description: "Fondateur de BECO et chercheur en conservation de la biodiversité.", image: "/assets/team/dr-simeu-noutchom-alain.jpg", order: 1, isPublished: true },
  { name: "BAPITE NLOH Gloria", role: "Secrétaire Générale", status: "Doctorante", description: "Responsable de l'administration et de la coordination interne.", image: "/assets/team/bapite-nloh-gloria.jpg", order: 2, isPublished: true },
  { name: "TSAFACK TSAGUE Sharone", role: "Vice-Secrétaire Générale", status: "Doctorante", description: "Soutien à la coordination administrative et projets de recherche.", image: "", order: 3, isPublished: true },
  { name: "NOUAKO EMENI Ange", role: "Secrétaire Financière / Trésorière", status: "Étudiante", description: "Gère les finances et la comptabilité de l'organisation.", image: "", order: 4, isPublished: true },
  { name: "FOUOGHAP DIFOUO Carmel", role: "Coordonnatrice des Projets", status: "Doctorante", description: "Supervise la planification et le suivi-évaluation des projets.", image: "/assets/team/fouoghap-difouo-carmel.jpg", order: 5, isPublished: true },
  { name: "TONFACK Robert", role: "Coordonnateur Agriculture Durable", status: "Doctorant", description: "Spécialiste en agroécologie et agriculture durable.", image: "", order: 6, isPublished: true },
  { name: "MIMLBE Theophile / BOUTCHOUANG Will", role: "Chargés de Communication / Webmasters", status: "", description: "Responsables de la stratégie de communication et présence en ligne.", image: "", order: 7, isPublished: true },
];

export const seedFocusAreas = [
  { title: "Conservation de la biodiversité", slug: "biodiversite", description: "Inventaires, suivis et protection des espèces menacées.", image: "/assets/focus-biodiversity.jpg", order: 1, isPublished: true },
  { title: "Protection de l'environnement", slug: "environnement", description: "Préservation des écosystèmes et gestion durable des ressources.", image: "/assets/focus-environment.jpg", order: 2, isPublished: true },
  { title: "Changement climatique", slug: "climat", description: "Atténuation et adaptation aux changements climatiques.", image: "/assets/focus-climate.jpg", order: 3, isPublished: true },
  { title: "Agriculture durable", slug: "agriculture", description: "Promotion de pratiques agricoles respectueuses de l'environnement.", image: "/assets/focus-agriculture.jpg", order: 4, isPublished: true },
  { title: "One Health", slug: "one-health", description: "Intégration santé humaine, animale et environnementale.", image: "/assets/focus-onehealth.jpg", order: 5, isPublished: true },
  { title: "Conservation de la faune", slug: "faune", description: "Protection des espèces sauvages contre le braconnage.", image: "/assets/focus-wildlife.jpg", order: 6, isPublished: true },
  { title: "Restauration des forêts", slug: "forets", description: "Reboisement et réhabilitation des paysages dégradés.", image: "/assets/focus-forest.jpg", order: 7, isPublished: true },
  { title: "Éducation environnementale", slug: "education", description: "Sensibilisation et formation des communautés.", image: "/assets/focus-education.jpg", order: 8, isPublished: true },
  { title: "Développement communautaire", slug: "communaute", description: "Accompagnement des populations locales.", image: "/assets/focus-community.jpg", order: 9, isPublished: true },
  { title: "Recherche et innovation", slug: "recherche", description: "Études scientifiques et technologies pour la conservation.", image: "/assets/focus-research.jpg", order: 10, isPublished: true },
];

export const seedPartners = [
  { name: "The Rufford Foundation", abbr: "RUFFORD", logo: "/assets/partners/rufford.png", order: 1, isPublished: true },
  { name: "1Wild Foundation", abbr: "1WILD", logo: "/assets/partners/1wild.jpg", order: 2, isPublished: true },
  { name: "The Mohamed bin Zayed Species Conservation Fund", abbr: "MBZ", logo: "/assets/partners/mbz.png", order: 3, isPublished: true },
  { name: "IDEA WILD", abbr: "IDEA WILD", logo: "/assets/partners/idea-wild.jpg", order: 4, isPublished: true },
  { name: "British Ecological Society", abbr: "BES", logo: "/assets/partners/bes.png", order: 5, isPublished: true },
];

export const seedSettings = [
  { key: "site_name", value: "BECO" },
  { key: "site_description", value: "Biodiversity and Environmental Care Organization" },
  { key: "contact_email", value: "administration@becocameroon.org" },
  { key: "contact_phone", value: "+237 6 57 90 27 84" },
  { key: "contact_address", value: "Yaoundé, Région du Centre, Cameroun" },
  { key: "contact_website", value: "www.becocameroon.org" },
  { key: "facebook_url", value: "" },
  { key: "instagram_url", value: "" },
  { key: "linkedin_url", value: "" },
  { key: "twitter_url", value: "" },
  { key: "bluesky_url", value: "" },
];
