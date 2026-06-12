# Spécification Technique — Site BECO

## Dépendances

### npm

| Package | Version | Justification |
|---------|---------|---------------|
| react-router-dom | ^7 | Routing multi-page côté client (7 pages) avec scroll-to-top |
| gsap | ^3.12 | ScrollTrigger pour scroll reveals, timelines séquentiels carrousel, animation compteurs |
| embla-carousel-react | ^8 | Carrousel hero — autoplay, fading crossfade, API clean |
| embla-carousel-autoplay | ^8 | Plugin autoplay pour Embla |
| lucide-react | ^0.400 | Icônes : Target, Eye, Heart, User, Building, Award, Shield, FileText, Mail, etc. |
| @fontsource/playfair-display | ^5 | H1/H2 titres — self-hosted, meilleures perf que Google Fonts CDN |
| @fontsource/raleway | ^5 | Corps de texte et UI — self-hosted |

---

## Inventaire des composants

### Layout (partagés)

| Composant | Source | Réutilisation |
|-----------|--------|---------------|
| Header | Custom | Toutes les pages — transparent → blanc au scroll |
| Footer | Custom | Toutes les pages |
| PageHeader | Custom | 6 pages (toutes sauf Accueil) — bannière 50vh avec image + overlay |

### Sections — Accueil

| Composant | Source | Complexité |
|-----------|--------|------------|
| HeroCarousel | Custom + Embla | Haute — 5 slides Ken Burns, crossfade, texte séquentiel, dots, flèches |
| AboutSection | Custom | Basse — grille 2 colonnes texte + image |
| FocusAreas | Custom | Haute — grille 10 cartes avec overlay hover animé (opacity + translateY séquentiels) |
| ImpactNumbers | Custom + GSAP | Moyenne — grille 4 stats avec animation compteur (GSAP) |
| Funders | Custom | Basse — grille logos en niveaux de gris, hover color |
| FeaturedProjects | Custom | Moyenne — 3 cartes horizontales alternées (image/texte) |
| NewsletterCTA | Custom | Basse — bannière image de fond + overlay + formulaire inline |

### Sections — À propos

| Composant | Source | Complexité |
|-----------|--------|------------|
| StorySection | Custom | Basse — 2 colonnes texte + image |
| MissionVisionValues | Custom | Basse — 3 cartes icône + titre + texte |
| Objectives | Custom | Basse — grille 2 colonnes numérotée |

### Sections — Projets

| Composant | Source | Complexité |
|-----------|--------|------------|
| ProjectCategories | Custom | Moyenne — 6 cartes avec overlay hover révélant description |
| ProjectsList | Custom | Moyenne — 4 cartes projet étendues avec tags, détails, logos financeurs |

### Sections — Actualités

| Composant | Source | Complexité |
|-----------|--------|------------|
| NewsList | Custom | Moyenne — grille 6 cartes avec filtres catégorie (état local) + pagination |

### Sections — Équipe

| Composant | Source | Complexité |
|-----------|--------|------------|
| TeamDescription | Custom | Basse — texte centré |
| TeamGrid | Custom | Basse — grille portraits avec liens sociaux |

### Sections — S'impliquer

| Composant | Source | Complexité |
|-----------|--------|------------|
| Membership | Custom | Basse — 3 cartes avec checklists et hover border |
| Volunteer | Custom | Moyenne — 2 colonnes texte + formulaire multi-champs |
| Donate | Custom | Basse — grille boutons montant + info cards |

### Sections — Contact

| Composant | Source | Complexité |
|-----------|--------|------------|
| ContactForm | Custom (shadcn inputs) | Moyenne — formulaire 6 champs + sidebar infos |
| MapEmbed | Custom | Basse — iframe Google Maps |

### shadcn/ui

| Composant | Usage |
|-----------|-------|
| Button | CTA globaux, boutons filtres, soumission formulaires |
| Input | Formulaires (contact, bénévolat, newsletter) |
| Textarea | Formulaires message/motivation |
| Select | Type de demande contact, domaine bénévolat |
| Card | Non utilisé directement — les cartes sont custom pour respecter le design précis |

### Hooks

| Hook | Usage |
|------|-------|
| useScrollReveal | IntersectionObserver + GSAP pour révéler éléments au scroll (stagger configurable) |
| useHeaderScroll | Détecte scroll > 50px pour basculer header transparent → blanc |

---

## Plan d'animation

| Animation | Bibliothèque | Approche d'implémentation | Complexité |
|-----------|-------------|---------------------------|------------|
| Carrousel hero crossfade + Ken Burns | Embla + CSS | Embla autoplay 6s. CSS keyframes scale(1→1.08) sur chaque slide. Embla gère le crossfade opacity entre slides. Réinitialisation animation CSS via key React sur slide change. | Haute |
| Texte séquentiel carrousel | GSAP timeline | Timeline GSAP par slide : label (délay 0.4s), titre (0.6s), bouton (0.8s). Opacity + translateY. Kill/restart timeline au changement de slide. | Haute |
| Navigation dots + flèches carrousel | Embla API | Embla sélectionne l'index actif. Dots : classe active conditionnelle. Flèches : embla.scrollPrev/scrollNext. | Moyenne |
| Scroll reveal (global) | GSAP ScrollTrigger | Hook useScrollReveal : IntersectionObserver au 15% déclenche ScrollTrigger batch. translateY(40px→0), opacity 0→1, 0.8s, easing cubic-bezier(0.25, 0.46, 0.45, 0.94). Stagger configurable par section. | Moyenne |
| Overlay hover Focus Areas | CSS transitions | Pseudo-classe :hover. Overlay Brand Primary opacity 0→0.92 (0.5s). Titre translateY(-10px). Description + lien fade-in + translateY(15px→0) avec délai 0.15s/0.25s. Pas de JS — CSS pur pour performance. | Moyenne |
| Compteur Impact Numbers | GSAP | ScrollTrigger au viewport. gsap.to sur un objet proxy {value: 0}, interpolant jusqu'à la valeur finale sur 1.5s. React affiche Math.round(proxy.value). | Moyenne |
| Header scroll transition | Hook + CSS | useHeaderScroll détecte scroll > 50px. Classe conditionnelle sur header pour fond blanc + shadow-sm. Transition CSS 0.4s. | Basse |
| Bouton hover (global) | CSS | Background color transition 0.3s + scale(1.02) + box-shadow. CSS pur. | Basse |
| Logo grayscale hover | CSS | filter: grayscale(100%) → none. Opacity 0.6 → 1. Transition 0.3s. CSS pur. | Basse |

---

## Architecture et décisions

### Routing

React Router v7 en mode `BrowserRouter`. 7 routes définies dans `App.tsx`. Composant `ScrollToTop` (wrapper) remonte la page à chaque navigation. Pas de lazy loading — le site est statique, le bundle restera léger.

### Carrousel

**Embla Carousel** choisi pour le hero plutôt qu'une solution custom. Motivations : API propre pour autoplay, sélection d'index, et boucle infinie. Le fading crossfade s'implémente en superposant toutes les slides (position absolute) et contrôlant l'opacity via l'index actif d'Embla. L'animation Ken Burns est un keyframe CSS indépendant appliqué sur chaque image de fond — la clé React change au slide switch pour forcer le remount et relancer l'animation.

### Stratégie images

~45 images au total (10 domaines, 7 portraits équipe, 5 financeurs, 4 projets détaillés, 6 actualités, 6 headers, 6 autres). Stockage dans `public/assets/`. Format optimisé : hero images en 1920×1080 (WebP), portraits 600×600, thumbnails 800×500. Les logos financeurs sont fournis en PNG transparent.

### Formulaires

Les formulaires (contact, bénévolat, newsletter) sont purement frontaux — affichage d'un état de succès sans backend. Pas de validation complexe, juste required fields HTML5.
