-- ============================================================
-- BECO — Schéma Supabase (PostgreSQL)
-- À exécuter dans l'éditeur SQL du tableau de bord Supabase,
-- ou via :  psql "$SUPABASE_DB_URL" -f server/db/schema.sql
-- ============================================================

-- ------------------------------------------------------------
-- Utilisateurs admin (auth locale : bcrypt + JWT)
-- ------------------------------------------------------------
create table if not exists public.admin_users (
  id            bigserial primary key,
  username      text not null unique,
  password_hash text not null,
  name          text not null,
  email         text,
  role          text not null default 'admin' check (role in ('admin', 'superadmin')),
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Projets
-- ------------------------------------------------------------
create table if not exists public.projects (
  id           bigserial primary key,
  title        text not null,
  slug         text not null unique,
  tag          text not null,
  date         text,
  description  text not null,
  image        text,
  details      text,
  funder       text,
  category     text,
  url          text,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Actualités / News
-- ------------------------------------------------------------
create table if not exists public.news (
  id           bigserial primary key,
  title        text not null,
  slug         text not null unique,
  excerpt      text not null,
  content      text,
  tag          text not null,
  date         text,
  image        text,
  category     text,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Membres de l'équipe
-- ------------------------------------------------------------
create table if not exists public.team_members (
  id           bigserial primary key,
  name         text not null,
  role         text not null,
  status       text,
  description  text,
  image        text,
  linkedin     text,
  email        text,
  sort_order   int not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Domaines d'intervention (Focus Areas)
-- ------------------------------------------------------------
create table if not exists public.focus_areas (
  id           bigserial primary key,
  title        text not null,
  slug         text not null unique,
  description  text not null,
  image        text,
  sort_order   int not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Partenaires / financeurs
-- ------------------------------------------------------------
create table if not exists public.partners (
  id           bigserial primary key,
  name         text not null,
  abbr         text not null,
  logo         text,
  sort_order   int not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Paramètres du site (clé/valeur)
-- ------------------------------------------------------------
create table if not exists public.site_settings (
  id         bigserial primary key,
  key        text not null unique,
  value      text,
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Messages de contact
-- ------------------------------------------------------------
create table if not exists public.contact_messages (
  id         bigserial primary key,
  first_name text not null,
  last_name  text not null,
  email      text not null,
  subject    text,
  type       text,
  message    text not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Candidatures bénévolat
-- ------------------------------------------------------------
create table if not exists public.volunteer_applications (
  id          bigserial primary key,
  full_name   text not null,
  email       text not null,
  phone       text,
  interest    text,
  motivation  text,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Journaux d'activité admin
-- ------------------------------------------------------------
create table if not exists public.activity_logs (
  id            bigserial primary key,
  admin_user_id bigint not null,
  admin_name    text not null,
  action        text not null,
  entity        text not null,
  entity_id     bigint,
  details       text,
  created_at    timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Index utiles
-- ------------------------------------------------------------
create index if not exists idx_projects_published  on public.projects  (is_published, created_at desc);
create index if not exists idx_news_published      on public.news      (is_published, created_at desc);
create index if not exists idx_team_order          on public.team_members (sort_order);
create index if not exists idx_focus_order         on public.focus_areas  (sort_order);
create index if not exists idx_partners_order      on public.partners     (sort_order);
create index if not exists idx_messages_created    on public.contact_messages (created_at desc);
create index if not exists idx_volunteers_created  on public.volunteer_applications (created_at desc);
create index if not exists idx_logs_created        on public.activity_logs (created_at desc);
