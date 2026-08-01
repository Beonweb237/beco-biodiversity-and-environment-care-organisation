# AUDIT COMPLET DU SITE BECO

**Organisation :** Biodiversity and Environment Care Organisation  
**Date de l’audit :** 20 juin 2026  
**Périmètre :** code source React/Vite, build, TypeScript, ESLint, tests locaux desktop/mobile/RTL et vérification DNS.

> Le domaine `beco-afrotropical.org` ne résolvait pas en DNS lors de l’audit. La production n’a donc pas pu être validée directement.

## A. SYNTHÈSE EXÉCUTIVE

**Note globale : 4,8/10.**

Points forts : identité visuelle cohérente, architecture publique riche, traductions structurées dans cinq langues.  
Le responsive public ne présente pas de débordement majeur sur mobile.  
Les routes principales et les dix domaines thématiques existent.  
Points faibles majeurs : backend absent du déploiement Vercel, sécurité administrateur critique, tunnels d’engagement largement inopérants.  
Le SEO reste presque entièrement statique malgré la richesse éditoriale.  
Le RTL active bien `dir="rtl"`, mais de nombreux contenus demeurent en français.  
Le build Vite réussit, tandis que TypeScript et ESLint échouent.  

**Verdict :** vitrine prometteuse, mais pas prête pour une mise en production institutionnelle ou une campagne auprès de bailleurs.

## B. TABLEAU DES ANOMALIES

| # | Page / Zone / Langue | Catégorie | Sévérité | Description | Impact |
|---|---|---|---|---|---|
| 1 | Domaine public | Disponibilité | **CRITIQUE** | `beco-afrotropical.org` et `www` ne résolvent pas en DNS. | Site inaccessible aux visiteurs, moteurs et bailleurs. |
| 2 | `vercel.json` / API | Technique | **CRITIQUE** | Vercel exécute seulement `vite build`, avec toutes les routes réécrites vers `index.html`. Le serveur Hono/tRPC de `api/boot.ts` n’est pas déployé. | Contact, administration et contenu dynamique ne peuvent pas fonctionner sur Vercel en l’état. |
| 3 | `AdminLogin` / `db/seed.ts` | Sécurité | **CRITIQUE** | Identifiants `admin / beco2026` préremplis, affichés publiquement et créés par le seed. | Prise de contrôle immédiate de l’administration si ces identifiants existent en production. |
| 4 | `admin-auth-router.ts` | Sécurité | **CRITIQUE** | Secret JWT de secours codé en dur : `beco-admin-secret-key-2026`. | Fabrication potentielle de jetons administrateur si la variable d’environnement manque. |
| 5 | Don / adhésion | Conversion | **CRITIQUE** | Les montants FCFA, « montant libre » et boutons « Adhérer » n’ont aucun gestionnaire ni paiement associé. | Aucune collecte de don ou adhésion réelle. |
| 6 | Bénévolat | Formulaire | **MAJEUR** | Le formulaire n’a ni `onSubmit` ni état contrôlé. Le test provoque un rechargement vers `/involved?` et efface les données. | Candidatures perdues sans message explicite. |
| 7 | Newsletter | Formulaire | **MAJEUR** | `NewsletterCTA` et `Footer` affichent seulement une alerte locale ; aucune inscription n’est enregistrée. | Faux signal de réussite et perte de prospects. |
| 8 | Contact / API | Formulaire | **MAJEUR** | L’interface est correctement reliée à tRPC, mais l’API locale renvoie 500 sans backend configuré. | Messages potentiellement perdus ; **à vérifier avec le backend et la base de données**. |
| 9 | Actualités détaillées | Navigation | **MAJEUR** | Les slugs configurés dans `newsData.ts` ne correspondent pas toujours au `slugify` des titres. Une route testée affiche « Article non trouvé ». | Liens d’actualité cassés, perte de crédibilité et de référencement. |
| 10 | Focus Areas / AR, EN, ES, DE | i18n | **MAJEUR** | `FocusAreaPage`, `focusAreaData.ts` et `actionKeys` contiennent paragraphes, actions et CTA en français. | Mélange de langues très visible ; le test arabe affichait une grande partie du contenu en français. |
| 11 | Contenu administré | i18n | **MAJEUR** | Projets, actualités, équipe et domaines en base ne possèdent pas de champs par langue. Les données du seed sont françaises. | Le contenu dynamique écrase les traductions statiques pour les visiteurs internationaux. |
| 12 | RTL arabe | Accessibilité/i18n | **MAJEUR** | `dir="rtl"` est appliqué, mais les classes directionnelles `left-*`, `right-*`, flèches et alignements ne sont pas inversés systématiquement. | Lecture et navigation arabes incohérentes. |
| 13 | Toutes les pages | SEO | **MAJEUR** | Un seul `<title>` global, aucune meta description dynamique, canonical, Open Graph ou Twitter Card. | Pages mal différenciées dans Google et lors des partages. |
| 14 | SEO multilingue | SEO | **MAJEUR** | Aucun `hreflang`, URL localisée, sitemap ou `robots.txt`. | Variantes linguistiques difficiles à indexer correctement. |
| 15 | Bundle | Performance | **MAJEUR** | JS principal : **909,57 kB minifié / 260,26 kB gzip**, sans découpage par route. | Temps d’interactivité élevé sur réseaux mobiles camerounais. |
| 16 | Images | Performance | **MAJEUR** | Assets : environ **4,9 MB**. Les cinq images Hero sont montées simultanément et presque aucune image n’utilise `loading="lazy"`, `srcset` ou dimensions explicites. | LCP, consommation réseau et stabilité visuelle dégradés. |
| 17 | TypeScript | Qualité | **MAJEUR** | `npm run check` échoue : erreurs Zod, union incorrecte dans `About`, erreurs dans `AdminToast`, imports inutilisés. | Risque accru de régressions malgré un build Vite réussi. |
| 18 | ESLint | Qualité | **MAJEUR** | 37 erreurs et 1 avertissement, dont effets React, mutations pendant le rendu et composants non purs. | Dette technique et comportements instables en React 19. |
| 19 | `HeroCarousel` | Accessibilité | **MAJEUR** | Huit boutons sans nom accessible sur l’accueil ; points et flèches sans `aria-label`, aucune pause, aucun respect de `prefers-reduced-motion`. | Carrousel difficile pour lecteurs d’écran, clavier et personnes sensibles au mouvement. |
| 20 | Formulaires publics | Accessibilité | **MAJEUR** | Plusieurs champs utilisent uniquement des placeholders, sans `<label>` associé. | Compréhension et navigation assistée insuffisantes. |
| 21 | Hero / première impression | Message | **MINEUR** | Le premier slide parle de protection de la nature, mais ne formule pas immédiatement la double identité « terrain + recherche scientifique ». | Différenciation moins nette auprès des partenaires scientifiques. |
| 22 | Hero / CTA | Conversion | **MINEUR** | Un seul CTA contextuel est visible dans le Hero ; contact et adhésion ne sont pas simultanément proposés. | Les parcours prioritaires demandent davantage d’exploration. |
| 23 | Recherche | UX | **MINEUR** | `Search.tsx` recherche seulement dans huit pages et quelques mots-clés codés en dur, pas dans projets ou actualités. | Résultats incomplets malgré l’apparence d’un moteur global. |
| 24 | Titres | Accessibilité/SEO | **MINEUR** | Plusieurs pages passent du `h1` de `PageHeader` directement à `h3`, notamment `FocusAreaPage`. | Hiérarchie documentaire moins claire. |
| 25 | Contrastes | Accessibilité | **MINEUR** | Certains textes en blanc atténué sur vert sont proches ou sous 4,5:1 ; `#C9B79C` sur blanc atteint environ 1,96:1. | Lisibilité insuffisante pour certains textes fins. |
| 26 | Financeurs | Réassurance | **MINEUR** | Partenaires affichés comme textes typographiques, sans logos, liens, projets associés ou preuves de financement. | Réassurance institutionnelle sous-exploitée. |

## C. PLAN DE CORRECTION PRIORISÉ

### Phase 1 — Urgent (0–7 jours)

| Action | Effort | Impact | Prérequis |
|---|---|---|---|
| Configurer le domaine et vérifier certificats, apex et `www` dans Vercel. | Faible | Élevé | Accès DNS/Vercel |
| Déployer réellement Hono/tRPC ou héberger l’API séparément ; protéger `/api/*` des rewrites SPA. | Élevé | Élevé | Choix d’architecture et base MySQL |
| Supprimer les identifiants visibles et préremplis ; remplacer le compte par défaut et réinitialiser son mot de passe. | Faible | Élevé | Accès base de production |
| Rendre `ADMIN_JWT_SECRET` obligatoire, long et secret ; invalider les anciens jetons. | Faible | Élevé | Variables Vercel |
| Ajouter limitation de tentatives, journalisation et expiration courte de session. | Moyen | Élevé | Backend opérationnel |
| Connecter bénévolat, adhésion, don et newsletter à de vrais endpoints ; afficher des erreurs réelles. | Élevé | Élevé | Prestataire de paiement/email |
| Corriger les slugs des actualités et ajouter des tests de routes. | Moyen | Élevé | Convention de slug unique |
| Traduire les textes codés en dur de `FocusAreaPage`, `Search`, `Footer` et articles. | Moyen | Élevé | Validation éditoriale |
| Faire réussir `npm run check` avant tout déploiement. | Moyen | Élevé | Aucun |

### Phase 2 — Important (1–4 semaines)

| Action | Effort | Impact | Prérequis |
|---|---|---|---|
| Ajouter des champs multilingues en base pour projets, actualités, équipe et domaines. | Élevé | Élevé | Migration DB et workflow éditorial |
| Créer un composant SEO dynamique par route : title, description, canonical et Open Graph. | Moyen | Élevé | Textes SEO validés |
| Ajouter sitemap, robots et stratégie `hreflang`. | Moyen | Élevé | Choix d’URL linguistiques |
| Découper les routes avec `React.lazy` et isoler GSAP, administration et graphiques. | Moyen | Élevé | Analyse du bundle |
| Convertir les images en WebP/AVIF, ajouter tailles responsives et chargement différé. | Moyen | Élevé | Pipeline d’images |
| Rendre `HeroCarousel` accessible : noms, clavier, pause, région annoncée et réduction des animations. | Moyen | Élevé | Aucun |
| Ajouter des labels, messages reliés par `aria-describedby` et focus après erreur. | Moyen | Élevé | Aucun |
| Tester et corriger les propriétés logiques RTL (`start/end`, ordre des icônes). | Moyen | Moyen | Relecture arabophone |
| Ajouter des tests mobile sur les tableaux et formulaires administrateur. | Moyen | Moyen | Compte de test sécurisé |

### Phase 3 — Optimisation (1–3 mois)

| Action | Effort | Impact | Prérequis |
|---|---|---|---|
| Créer des pages de résultats et rapports scientifiques indexables. | Élevé | Élevé | Contenu scientifique |
| Enrichir la FAQ sur dons, fiscalité, bénévolat et utilisation des fonds. | Moyen | Moyen | Validation juridique |
| Présenter les logos officiels des financeurs avec liens et projets financés. | Faible | Moyen | Autorisation d’utilisation |
| Ajouter des statistiques respectueuses du consentement et le suivi des conversions. | Moyen | Élevé | Politique de confidentialité |
| Mettre en place tests Lighthouse, accessibilité et routes dans la CI. | Moyen | Moyen | Pipeline CI |
| Réduire ou suspendre les animations sur appareils modestes. | Faible | Moyen | Mesures de performance |

## D. QUICK WINS

1. Retirer immédiatement `admin / beco2026` de `AdminLogin` et rendre `ADMIN_JWT_SECRET` obligatoire.
2. Ajouter des `aria-label` aux flèches, points, menu et sélecteur de langue.
3. Traduire les textes français codés en dur dans `FocusAreaPage`.
4. Ajouter `loading="lazy"` aux images hors écran et optimiser `logo-icon.png`.
5. Ajouter un titre et une meta description propres à chaque route publique.

## ÉLÉMENTS TECHNIQUES VÉRIFIÉS

- `npm run build` : réussi.
- Bundle client principal : 909,57 kB minifié, 260,26 kB gzip.
- `npm run check` : échec.
- `npm run lint` : 37 erreurs et 1 avertissement.
- Poids total de `public/assets` : environ 4,9 MB.
- Tests locaux des routes publiques : routes principales et dix domaines accessibles.
- Test mobile à 375 px : aucun débordement horizontal majeur constaté sur les pages échantillonnées.
- Test arabe : attributs `lang="ar"` et `dir="rtl"` appliqués, mais contenu partiellement français.
- API locale : erreurs 500 sans configuration backend valide.
- Domaine de production : résolution DNS indisponible au moment de l’audit.
