import { getDb } from "../api/queries/connection";
import { adminUsers, projects, news, teamMembers, focusAreas, siteSettings } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // Seed default admin user
  const existingAdmin = await db.select().from(adminUsers).where(eq(adminUsers.username, "admin"));
  if (existingAdmin.length === 0) {
    const passwordHash = await bcrypt.hash("beco2026", 10);
    await db.insert(adminUsers).values({
      username: "admin",
      passwordHash,
      name: "Administrateur BECO",
      email: "admin@beco-afrotropical.org",
      role: "superadmin",
      isActive: true,
    });
    console.log("  + Default admin user created: admin / beco2026");
  }

  // Seed projects
  const existingProjects = await db.select().from(projects);
  if (existingProjects.length === 0) {
    await db.insert(projects).values([
      {
        title: "Protection des perroquets gris dans le Parc National de Mpem & Djim",
        slug: "protection-perroquets-gris-mpem-djim",
        tag: "Biodiversité",
        date: "Janvier 2026",
        description: "Projet soutenu par la fondation 1Wild visant à protéger les populations de perroquets gris du Parc National de Mpem & Djim.",
        image: "/assets/project-parrot.jpg",
        details: "Suivi des populations de perroquets gris par comptages et observations;Sensibilisation des communautés locales;Lutte contre le braconnage;Cartographie des zones de nidification",
        funder: "1Wild Foundation",
        category: "Biodiversité & Conservation",
        isPublished: true,
      },
      {
        title: "Monitoring acoustique passif des Orthoptères pour la conservation",
        slug: "monitoring-acoustique-orthopteres",
        tag: "Recherche",
        date: "Septembre 2025",
        description: "Projet financé par le Rufford Small Grant utilisant la surveillance acoustique passive pour étudier les communautés d'Orthoptères.",
        image: "/assets/project-acoustic.jpg",
        details: "Déploiement de capteurs acoustiques;Analyse des signaux acoustiques;Évaluation de la biodiversité;Création d'une base de données acoustique",
        funder: "Rufford Foundation",
        category: "Recherche scientifique",
        isPublished: true,
      },
      {
        title: "Variabilité acoustique des Orthoptères et climat",
        slug: "variabilite-acoustique-climat",
        tag: "Changement climatique",
        date: "Novembre 2025",
        description: "Étude des variations saisonnières et altitudinales de l'activité acoustique des Orthoptères sur la Ligne du Cameroun Volcanique.",
        image: "/assets/project-volcanic.jpg",
        details: "Échantillonnage acoustique multi-sites;Corrélation données climatiques;Modélisation impacts climatiques;Publication scientifique",
        funder: "British Ecological Society",
        category: "Changement climatique",
        isPublished: true,
      },
      {
        title: "Fellows chercheurs sur le changement climatique",
        slug: "fellows-changement-climatique",
        tag: "Recherche",
        date: "Avril 2025",
        description: "Programme de soutien aux chercheurs africains en début de carrière travaillant sur le changement climatique.",
        image: "/assets/hero-2.jpg",
        details: "Mentorat chercheurs juniors;Financement projets innovants;Renforcement capacités;Mise en réseau",
        funder: "CDKN",
        category: "Recherche scientifique",
        isPublished: true,
      },
    ]);
    console.log("  + 4 projects seeded");
  }

  // Seed news
  const existingNews = await db.select().from(news);
  if (existingNews.length === 0) {
    await db.insert(news).values([
      {
        title: "Lancement du projet de protection des perroquets gris",
        slug: "lancement-projet-perroquets-gris",
        excerpt: "BECO lance un nouveau programme de conservation financé par la fondation 1Wild.",
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
        tag: "Recherche",
        date: "Novembre 2025",
        image: "/assets/news-2.jpg",
        category: "Publications",
        isPublished: true,
      },
      {
        title: "Deuxième Rufford Small Grant pour le monitoring acoustique",
        slug: "deuxieme-rufford-grant",
        excerpt: "BECO reçoit le deuxième Rufford Small Grant pour poursuivre le monitoring acoustique.",
        tag: "Projet",
        date: "Septembre 2025",
        image: "/assets/project-acoustic.jpg",
        category: "Projets",
        isPublished: true,
      },
      {
        title: "BECO sélectionné pour le programme CDKN",
        slug: "selection-programme-cdkn",
        excerpt: "Notre directeur exécutif a été sélectionné comme fellow du programme CDKN.",
        tag: "Événement",
        date: "Avril 2025",
        image: "/assets/news-4.jpg",
        category: "Événements",
        isPublished: true,
      },
      {
        title: "Création officielle de BECO à Yaoundé",
        slug: "creation-officielle-beco",
        excerpt: "La Biodiversity and Environment Care Organisation est officiellement créée.",
        tag: "Organisation",
        date: "Juin 2025",
        image: "/assets/about-home.jpg",
        category: "Événements",
        isPublished: true,
      },
      {
        title: "Premiers résultats du monitoring acoustique des Orthoptères",
        slug: "premiers-resultats-monitoring",
        excerpt: "Les premières données révèlent une richesse remarquable de la communauté d'Orthoptères.",
        tag: "Publication",
        date: "À venir",
        image: "/assets/hero-2.jpg",
        category: "Publications",
        isPublished: true,
      },
    ]);
    console.log("  + 6 news articles seeded");
  }

  // Seed team members
  const existingTeam = await db.select().from(teamMembers);
  if (existingTeam.length === 0) {
    await db.insert(teamMembers).values([
      { name: "Dr SIMEU NOUTCHOM Alain", role: "Directeur Exécutif", status: "PhD", description: "Fondateur de BECO et chercheur en conservation de la biodiversité.", image: "/assets/hero-1.jpg", order: 1, isPublished: true },
      { name: "BAPITE NLOH Gloria", role: "Secrétaire Générale", status: "Doctorante", description: "Responsable de l'administration et de la coordination interne.", image: "/assets/hero-4.jpg", order: 2, isPublished: true },
      { name: "TSAFACK TSAGUE Sharone", role: "Vice-Secrétaire Générale", status: "Doctorante", description: "Soutien à la coordination administrative et projets de recherche.", image: "/assets/hero-5.jpg", order: 3, isPublished: true },
      { name: "NOUAKO EMENI Ange", role: "Secrétaire Financière / Trésorière", status: "Étudiante", description: "Gère les finances et la comptabilité de l'organisation.", image: "/assets/focus-community.jpg", order: 4, isPublished: true },
      { name: "FOUOGHAP DIFOUO Carmel", role: "Coordonnatrice des Projets", status: "Doctorante", description: "Supervise la planification et le suivi-évaluation des projets.", image: "/assets/hero-3.jpg", order: 5, isPublished: true },
      { name: "TONFACK Robert", role: "Coordonnateur Agriculture Durable", status: "Doctorant", description: "Spécialiste en agroécologie et agriculture durable.", image: "/assets/focus-agriculture.jpg", order: 6, isPublished: true },
      { name: "MIMLBE Theophile / BOUTCHOUANG Will", role: "Chargés de Communication / Webmasters", status: "", description: "Responsables de la stratégie de communication et présence en ligne.", image: "/assets/focus-education.jpg", order: 7, isPublished: true },
    ]);
    console.log("  + 7 team members seeded");
  }

  // Seed focus areas
  const existingAreas = await db.select().from(focusAreas);
  if (existingAreas.length === 0) {
    await db.insert(focusAreas).values([
      { title: "Conservation de la biodiversité", slug: "biodiversite", description: "Inventaires, suivis et protection des espèces menacées.", image: "/assets/focus-biodiversity.jpg", order: 1, isPublished: true },
      { title: "Protection de l'environnement", slug: "environnement", description: "Préservation des écosystèmes et gestion durable des ressources.", image: "/assets/focus-environment.jpg", order: 2, isPublished: true },
      { title: "Changement climatique", slug: "climat", description: "Atténuation et adaptation aux changements climatiques.", image: "/assets/focus-climate.jpg", order: 3, isPublished: true },
      { title: "Agriculture durable", slug: "agriculture", description: "Promotion de pratiques agricoles respectueuses de l'environnement.", image: "/assets/focus-agriculture.jpg", order: 4, isPublished: true },
      { title: "One Health", slug: "one-health", description: "Intégration santé humaine, animale et environnementale.", image: "/assets/focus-onehealth.jpg", order: 5, isPublished: true },
      { title: "Conservation de la faune", slug: "faune", description: "Protection des espèces sauvages contre le braconnage.", image: "/assets/focus-wildlife.jpg", order: 6, isPublished: true },
      { title: "Restauration des forêts", slug: "forets", description: "Reboisement et rehabilitation des paysages dégradés.", image: "/assets/focus-forest.jpg", order: 7, isPublished: true },
      { title: "Éducation environnementale", slug: "education", description: "Sensibilisation et formation des communautés.", image: "/assets/focus-education.jpg", order: 8, isPublished: true },
      { title: "Développement communautaire", slug: "communaute", description: "Accompagnement des populations locales.", image: "/assets/focus-community.jpg", order: 9, isPublished: true },
      { title: "Recherche et innovation", slug: "recherche", description: "Études scientifiques et technologies pour la conservation.", image: "/assets/focus-research.jpg", order: 10, isPublished: true },
    ]);
    console.log("  + 10 focus areas seeded");
  }

  // Seed site settings
  const existingSettings = await db.select().from(siteSettings);
  if (existingSettings.length === 0) {
    await db.insert(siteSettings).values([
      { key: "site_name", value: "BECO" },
      { key: "site_description", value: "Biodiversity and Environment Care Organisation" },
      { key: "contact_email", value: "administration@becocameroon.org" },
      { key: "contact_phone", value: "+237 6 57 90 27 84" },
      { key: "contact_address", value: "Yaoundé, Région du Centre, Cameroun" },
      { key: "facebook_url", value: "" },
      { key: "instagram_url", value: "" },
      { key: "linkedin_url", value: "" },
      { key: "twitter_url", value: "" },
    ]);
    console.log("  + 9 site settings seeded");
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
