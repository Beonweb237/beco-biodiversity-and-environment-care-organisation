# AUDIT COMPLET — SITE WEB BECO (Biodiversity and Environment Care Organisation)

---

## A. SYNTHÈSE EXÉCUTIVE
* **Note globale** : **5.5 / 10**
* **Points forts** :
  1. *Esthétique & Animations premium* : Trame visuelle soignée (palette verte/olive), carrousel Hero Ken Burns et transitions GSAP à fort impact visuel.
  2. *Intégration i18n structurelle* : Prise en charge initiale de 5 langues (FR/EN/ES/DE/AR) avec basculement automatique de direction (RTL pour l'arabe).
  3. *Type-safety robuste* : Intégration de bout en bout de tRPC et Drizzle ORM garantissant des communications saines entre le client et l'API.
* **Points faibles majeurs** :
  1. *Bilinguisme dynamique absent de la BDD* : Le schéma de base de données ne supporte pas le multilinguisme (champs uniques en français), rendant les traductions dynamiques impossibles en production.
  2. *Bugs fonctionnels bloquants* : Plantage complet (`404 Article non trouvé`) de la page actualité en cas de changement de langue (liaison de slug dynamique) et téléversement d'images dysfonctionnel (utilisation de `blob:` temporaires au lieu d'un stockage persistant S3).
  3. *Formulaire inerte & Sécurité critique* : Formulaire de bénévolat décoratif sans gestionnaire de soumission, et identifiants administrateurs affichés en clair sur l'écran de connexion avec stockage JWT vulnérable dans le `localStorage`.
* **Verdict** : Une excellente vitrine visuelle et structurelle, mais souffrant de sérieux raccourcis de développement (données volatiles, failles de sécurité, multilinguisme incomplet) qui doivent être corrigés avant toute mise en production.

---

## B. TABLEAU DES ANOMALIES

| # | Page/Zone | Catégorie | Sévérité | Description | Impact |
|---|-----------|-----------|----------|-------------|--------|
| **01** | `NewsArticle.tsx` | Fonctionnel | **CRITIQUE** | Les slugs de recherche d'actualités traduits sont générés dynamiquement à la volée. Changer de langue sur un article modifie le titre localisé recherché, ce qui rompt le lien avec le slug d'origine dans l'URL et provoque une erreur `404` immédiate. | Rupture complète de navigation pour les utilisateurs multilingues. |
| **02** | `AdminImageUploader.tsx` | Fonctionnel | **CRITIQUE** | La fonction glisser-déposer génère un `blob:URL` local (`URL.createObjectURL(file)`) et l'enregistre en base de données au lieu de téléverser le fichier sur S3 ou un serveur. | Dès que la page est rafraîchie ou qu'un autre utilisateur se connecte, l'image devient brisée (lien mort). |
| **03** | `AdminLogin.tsx` | Sécurité | **CRITIQUE** | Les identifiants administratifs de base (`admin` / `beco2026`) sont pré-remplis dans le formulaire et affichés en clair sous forme de texte d'aide sur l'interface de connexion. | N'importe quel visiteur accédant à la page `/administrateur` peut prendre le contrôle du back-office. |
| **04** | Base de données | Architecture | **CRITIQUE** | Les tables `projects`, `news`, `team_members` et `focus_areas` n'ont qu'une seule colonne textuelle (ex: `title`, `description`) sans colonne de traduction ni table de jointure linguistique. | Impossible d'avoir des projets ou des articles traduits en EN, ES, DE ou AR ; tout le contenu dynamique reste figé dans la langue saisie (en français). |
| **05** | `Involved.tsx` (Bénévolat) | Fonctionnel | **MAJEUR** | Le formulaire d'inscription pour le bénévolat n'a pas d'attribut `value`, de `onChange` ou de fonction `onSubmit`. Les champs sont inertes et aucun appel d'API n'est déclenché. | Perte définitive des candidatures de bénévoles qui croient avoir soumis leur dossier. |
| **06** | `FocusAreaPage.tsx` | Accessibilité / i18n | **MAJEUR** | De nombreux textes d'interface clés ("Nos actions clés", "Projets liés", "Voir tous nos projets dans ce domaine") et le tableau `actionKeys` des actions par domaine sont codés en dur en français. | L'utilisateur naviguant en anglais, espagnol, allemand ou arabe verra des blocs textuels entiers non traduits. |
| **07** | `FocusAreaPage.tsx` | Performance / UX | **MAJEUR** | Le bouton de retour utilise une balise brute `<a href="/#focus">` au lieu d'un `<Link>` de React Router. | Provoque un rafraîchissement complet du navigateur, réinitialisant l'état complet de l'application (et faisant perdre la langue sélectionnée par l'utilisateur). |
| **08** | `LanguageSwitcher.tsx` / CSS | Accessibilité / i18n | **MAJEUR** | Utilisation exclusive des classes de positionnement physique (ex: `pl-10`, `pr-4`, `right-0`) à la place des propriétés logiques (ex: `ps-10`, `pe-4`, `end-0`). | Le mode arabe (RTL) ne s'aligne pas correctement et provoque des superpositions visuelles d'éléments ou de textes. |
| **09** | `Search.tsx` | i18n | **MINEUR** | Les messages textuels ("Que recherchez-vous ?", "résultat(s) pour") ainsi que les mots-clés d'indexation (`keywords` en français) sont codés en dur. | La recherche ne fonctionne pas si un utilisateur saisit un mot-clé dans une autre langue (ex: "team" ou "ecology"). |
| **10** | `HeroCarousel.tsx` | Performance | **MINEUR** | Les timelines GSAP de texte sont instanciées à chaque transition de diapositive sans que la timeline précédente ne soit détruite (`kill()`). | Risque de fuite de mémoire CPU et de conflits d'animation si le visiteur clique rapidement sur les indicateurs de changement de slide. |
| **11** | `providers/trpc.tsx` | Sécurité | **MINEUR** | Le jeton de session `adminToken` est stocké dans le `localStorage` et injecté via des en-têtes HTTP personnalisés. | Risque accru de vol de session par faille XSS (les cookies `HttpOnly` sécurisés devraient être privilégiés). |

---

## C. PLAN DE CORRECTION PRIORISÉ

### Phase 1 — Urgent (0-7 jours) : Sécurité & Bloquants Fonctionnels

#### 1. Désactiver le pré-remplissage et masquer les aides d'identifiants admin
* **Description** : Retirer les valeurs par défaut dans [AdminLogin.tsx](file:///c:/Users/MN%20COMPUTERS/Downloads/templates%20BEONWEB/extracted/BECO%20-%20Biodiversity%20and%20Environment%20Care%20Organisation/app/src/pages/admin/AdminLogin.tsx) (lignes 7-8) et effacer la note d'aide en bas de formulaire (lignes 116-120).
* **Effort estimé** : Faible
* **Impact attendu** : Élevé
* **Prérequis** : Aucun

#### 2. Fixer la perte de référence de slug lors du changement de langue
* **Description** : Mettre à jour la logique dans [NewsArticle.tsx](file:///c:/Users/MN%20COMPUTERS/Downloads/templates%20BEONWEB/extracted/BECO%20-%20Biodiversity%20and%20Environment%20Care%20Organisation/app/src/pages/NewsArticle.tsx) pour baser la recherche sur un ID immuable ou un slug indépendant de la langue plutôt que de slugifier le titre traduit à la volée.
* **Effort estimé** : Moyen
* **Impact attendu** : Élevé
* **Prérequis** : Aucun

#### 3. Mettre en place un vrai flux de stockage pour les téléversements d'images
* **Description** : Créer un endpoint d'API tRPC ou une route de téléversement Hono pour recevoir les fichiers de [AdminImageUploader.tsx](file:///c:/Users/MN%20COMPUTERS/Downloads/templates%20BEONWEB/extracted/BECO%20-%20Biodiversity%20and%20Environment%20Care%20Organisation/app/src/pages/admin/AdminImageUploader.tsx), les stocker sur S3 ou en local persistant, puis renvoyer l'URL finale.
* **Effort estimé** : Élevé
* **Impact attendu** : Élevé
* **Prérequis** : Service S3 ou dossier `/uploads` persistant configuré.

#### 4. Activer le formulaire de bénévolat
* **Description** : Lier les champs du formulaire dans [Involved.tsx](file:///c:/Users/MN%20COMPUTERS/Downloads/templates%20BEONWEB/extracted/BECO%20-%20Biodiversity%20and%20Environment%20Care%20Organisation/app/src/pages/Involved.tsx) à un état React (`useState`) et ajouter la soumission des données à la base de données.
* **Effort estimé** : Moyen
* **Impact attendu** : Élevé
* **Prérequis** : Aucun

---

### Phase 2 — Important (1-4 semaines) : Refonte i18n & Accessibilité

#### 5. Internationalisation des modèles de données (Projets, Actualités, Equipe)
* **Description** : Modifier le schéma Drizzle [schema.ts](file:///c:/Users/MN%20COMPUTERS/Downloads/templates%20BEONWEB/extracted/BECO%20-%20Biodiversity%20and%20Environment%20Care%20Organisation/app/db/schema.ts) pour stocker les textes de contenu sous forme de JSON contenant des paires clés/valeurs linguistiques (ex: `{ fr: "...", en: "..." }`) ou mettre en place une table de traductions pour permettre une vraie gestion multilingue depuis l'administration.
* **Effort estimé** : Élevé
* **Impact attendu** : Élevé
* **Prérequis** : Migration de base de données.

#### 6. Extraction des textes codés en dur dans les Focus Areas
* **Description** : Extraire tous les textes codés en dur dans [FocusAreaPage.tsx](file:///c:/Users/MN%20COMPUTERS/Downloads/templates%20BEONWEB/extracted/BECO%20-%20Biodiversity%20and%20Environment%20Care%20Organisation/app/src/components/FocusAreaPage.tsx), [Search.tsx](file:///c:/Users/MN%20COMPUTERS/Downloads/templates%20BEONWEB/extracted/BECO%20-%20Biodiversity%20and%20Environment%20Care%20Organisation/app/src/pages/Search.tsx) et [faqKeys](file:///c:/Users/MN%20COMPUTERS/Downloads/templates%20BEONWEB/extracted/BECO%20-%20Biodiversity%20and%20Environment%20Care%20Organisation/app/src/pages/FAQ.tsx) vers les fichiers de traduction i18n.
* **Effort estimé** : Moyen
* **Impact attendu** : Moyen
* **Prérequis** : Aucun

#### 7. Correction des styles logiques pour le mode RTL (Arabe)
* **Description** : Remplacer les classes de positionnement physiques de Tailwind (`pl-`, `pr-`, `ml-`, `mr-`, `text-left`) par leurs équivalents logiques (`ps-`, `pe-`, `ms-`, `me-`, `text-start`).
* **Effort estimé** : Moyen
* **Impact attendu** : Moyen
* **Prérequis** : Aucun

---

### Phase 3 — Optimisation (1-3 mois) : Performance & Sécurité

#### 8. Nettoyage des instances GSAP
* **Description** : Modifier [HeroCarousel.tsx](file:///c:/Users/MN%20COMPUTERS/Downloads/templates%20BEONWEB/extracted/BECO%20-%20Biodiversity%20and%20Environment%20Care%20Organisation/app/src/sections/HeroCarousel.tsx) pour appeler systématiquement `timeline.kill()` avant de créer une nouvelle transition afin d'éviter les fuites de mémoire.
* **Effort estimé** : Faible
* **Impact attendu** : Moyen
* **Prérequis** : Aucun

#### 9. Transition vers des cookies sécurisés pour le jeton JWT
* **Description** : Remplacer le stockage en `localStorage` par des cookies `HttpOnly` sécurisés gérés par Hono lors de la connexion pour éliminer les risques d'attaques XSS.
* **Effort estimé** : Moyen
* **Impact attendu** : Moyen
* **Prérequis** : Aucun

---

## D. QUICK WINS
1. **Remplacement des balises `<a>` brutes par des `<Link>`** : Dans [FocusAreaPage.tsx](file:///c:/Users/MN%20COMPUTERS/Downloads/templates%20BEONWEB/extracted/BECO%20-%20Biodiversity%20and%20Environment%20Care%20Organisation/app/src/components/FocusAreaPage.tsx) (ligne 25-31), remplacer la balise `<a href="/#focus">` par `<Link to="/#focus">` pour éliminer le rafraîchissement complet de la page et la perte de la langue active.
2. **Traductions statiques immédiates** : Traduire directement les boutons et étiquettes d'information dans [FocusAreaPage.tsx](file:///c:/Users/MN%20COMPUTERS/Downloads/templates%20BEONWEB/extracted/BECO%20-%20Biodiversity%20and%20Environment%20Care%20Organisation/app/src/components/FocusAreaPage.tsx) en utilisant des clés de traduction statiques simples.
3. **Nettoyage des avertissements console** : Ajouter des gestionnaires d'erreur d'image robustes sur les portraits de l'équipe et logos partenaires pour éviter les logs d'erreurs 404 dans la console du navigateur.
