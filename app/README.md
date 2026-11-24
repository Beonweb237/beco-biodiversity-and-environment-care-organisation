# BECO — Site Web (React + Express + Supabase)

Site vitrine de la **Biodiversity and Environmental Care Organization** (BECO), entièrement dynamisé :

- **Frontend** : React 19 + TypeScript + Vite + Tailwind CSS
- **Backend** : **Express** (API REST) + **Supabase** (PostgreSQL)
- **Admin** : panneau d'administration (`/administrateur`) pour gérer projets, actualités, équipe, domaines, partenaires, messages, paramètres

## Architecture

```
app/
├── server/                 # Backend Express + Supabase
│   ├── index.ts            # Point d'entrée Express (routes, statique, erreurs)
│   ├── lib/                # env, client Supabase, JWT, journalisation, mapping DTO
│   ├── middleware/auth.ts  # Authentification admin (JWT)
│   ├── routes/             # public.ts (contenus), forms.ts (formulaires), admin.ts (CRUD), admin-auth.ts
│   └── db/                 # schema.sql (migration Supabase) + seed.ts (données initiales)
├── src/
│   ├── lib/api/            # Client REST + hooks React Query (public, admin, forms)
│   ├── pages/              # Pages publiques + panneau admin
│   └── providers/api.tsx   # QueryClientProvider
├── contracts/types.ts      # Types partagés client <-> serveur
└── vite.config.ts          # Proxy /api -> http://localhost:3001 (dev)
```

## Prérequis

- Node.js 20+
- Un projet [Supabase](https://supabase.com) (ou un projet local via `supabase start`)

## Installation

```bash
npm install
```

## Configuration

Copiez le fichier d'exemple puis renseignez vos clés :

```bash
cp .env.example .env
```

Variables requises :

| Variable | Description |
| --- | --- |
| `SUPABASE_URL` | URL de votre projet Supabase |
| `SUPABASE_ANON_KEY` | Clé publique (anon) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé `service_role` — **réservée au serveur, jamais exposée** |
| `ADMIN_JWT_SECRET` | Secret de signature des tokens admin (changez-le !) |

## Mise en place de la base (Supabase)

1. Créez les tables en exécutant `server/db/schema.sql` dans l'éditeur SQL du dashboard Supabase :
   ```bash
   npm run db:schema   # affiche les instructions
   ```
   Ou via `psql "$SUPABASE_DB_URL" -f server/db/schema.sql`.

2. Remplissez les données initiales (projets, actualités, équipe, domaines, partenaires, paramètres, admin par défaut) :
   ```bash
   npm run db:seed
   ```

   > Admin par défaut créé : `admin` / `beco2026` — **changez ce mot de passe après la première connexion** (via `/administrateur/parametres`).

## Développement

```bash
npm run dev
```

Lance **deux** processus (via `concurrently`) :

- l'**API Express** sur `http://localhost:3001`
- **Vite** sur `http://localhost:3000` (proxy `/api` → `3001`)

Ouvrez http://localhost:3000.

## Production

```bash
npm run build      # build client (dist/public) + bundle serveur (dist/server.js)
npm start          # NODE_ENV=production node dist/server.js
```

En production, Express sert les fichiers statiques de `dist/public` avec fallback SPA.

Les **images uploadées depuis le panneau admin** sont stockées dans le **bucket Supabase Storage** `beco-images` (bucket public, URL directe). Le bucket est créé automatiquement au premier upload (ou via `npm run db:seed`).

## API (aperçu)

**Publiques** — `GET /api/public/*` (projects, featured-projects, news, news/:slug, team, focus-areas, partners, settings, stats)

**Formulaires** — `POST /api/forms/*` (contact, newsletter, volunteer, upload[admin])

**Admin** — `/api/admin/*` (protégé par le header `x-admin-token`) :

- `POST /api/admin/auth/login` · `GET /api/admin/auth/me`
- CRUD : `projects`, `news`, `team`, `focus-areas`, `partners`
- `messages`, `volunteers` (lecture, marquer lu, suppression)
- `settings` (GET / PUT/:key), `users` (liste, création, activation)
- `stats`, `activity-logs` (+ `recent`)

## Scripts utiles

```bash
npm run check       # type-check client + serveur (tsc)
npm run build       # build de production
npm run db:seed     # remplit la base Supabase
npm test            # tests vitest
```
