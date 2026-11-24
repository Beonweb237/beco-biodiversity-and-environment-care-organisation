// ============================================================
// BECO — Types partagés (client <-> serveur Express + Supabase)
// Les DTO renvoyés par l'API sont en camelCase (mappés depuis
// les colonnes snake_case de la base Supabase).
// ============================================================

export type AdminRole = "admin" | "superadmin";

// ============================================================
// AUTH ADMIN
// ============================================================
export interface AdminUserDto {
  id: number;
  username: string;
  name: string;
  email: string | null;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
}

export interface AdminAuthResponse {
  success: boolean;
  token?: string;
  user?: AdminUserDto;
  error?: string;
}

// ============================================================
// PROJETS
// ============================================================
export interface ProjectDto {
  id: number;
  title: string;
  slug: string;
  tag: string;
  date: string | null;
  description: string;
  image: string | null;
  details: string | null;
  funder: string | null;
  category: string | null;
  /** Lien externe vers la fiche projet (site du financeur, etc.). */
  url: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProjectInput = {
  title: string;
  slug: string;
  tag: string;
  date?: string | null;
  description: string;
  image?: string | null;
  details?: string | null;
  funder?: string | null;
  category?: string | null;
  url?: string | null;
  isPublished?: boolean;
};

// ============================================================
// ACTUALITÉS / NEWS
// ============================================================
export interface NewsItemDto {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string | null;
  tag: string;
  date: string | null;
  image: string | null;
  category: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NewsInput = {
  title: string;
  slug: string;
  excerpt: string;
  content?: string | null;
  tag: string;
  date?: string | null;
  image?: string | null;
  category?: string | null;
  isPublished?: boolean;
};

// ============================================================
// ÉQUIPE
// ============================================================
export interface TeamMemberDto {
  id: number;
  name: string;
  role: string;
  status: string | null;
  description: string | null;
  image: string | null;
  linkedin: string | null;
  email: string | null;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TeamMemberInput = {
  name: string;
  role: string;
  status?: string | null;
  description?: string | null;
  image?: string | null;
  linkedin?: string | null;
  email?: string | null;
  order?: number;
  isPublished?: boolean;
};

// ============================================================
// DOMAINES D'INTERVENTION (FOCUS AREAS)
// ============================================================
export interface FocusAreaDto {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string | null;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export type FocusAreaInput = {
  title: string;
  slug: string;
  description: string;
  image?: string | null;
  order?: number;
  isPublished?: boolean;
};

// ============================================================
// PARTENAIRES
// ============================================================
export interface PartnerDto {
  id: number;
  name: string;
  abbr: string;
  logo: string | null;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PartnerInput = {
  name: string;
  abbr: string;
  logo?: string | null;
  order?: number;
  isPublished?: boolean;
};

// ============================================================
// PARAMÈTRES DU SITE
// ============================================================
export interface SiteSettingDto {
  key: string;
  value: string | null;
  updatedAt?: string;
}

// ============================================================
// MESSAGES DE CONTACT
// ============================================================
export interface ContactMessageDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  subject: string | null;
  type: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ============================================================
// CANDIDATURES BÉNÉVOLAT
// ============================================================
export interface VolunteerApplicationDto {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  interest: string | null;
  motivation: string | null;
  isRead: boolean;
  createdAt: string;
}

// ============================================================
// JOURNAUX D'ACTIVITÉ
// ============================================================
export interface ActivityLogDto {
  id: number;
  adminUserId: number;
  adminName: string;
  action: string;
  entity: string;
  entityId: number | null;
  details: string | null;
  createdAt: string;
}

export interface PaginatedLogs {
  rows: ActivityLogDto[];
  total: number;
}

// ============================================================
// STATISTIQUES
// ============================================================
export interface PublicStats {
  activeProjects: number;
  yearCreated: number;
  domains: number;
  teamMembers: number;
}

export interface AdminStats {
  projects: number;
  news: number;
  team: number;
  messages: number;
  unreadMessages: number;
  focusAreas: number;
  volunteers: number;
}

// ============================================================
// UPLOAD
// ============================================================
export interface UploadResponse {
  url: string;
}

export type { AppError } from "./errors";
export { Errors } from "./errors";
