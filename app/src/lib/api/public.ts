// ============================================================
// Hooks React Query — données publiques (Express + Supabase)
// ============================================================
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type {
  ProjectDto,
  NewsItemDto,
  TeamMemberDto,
  FocusAreaDto,
  PartnerDto,
  SiteSettingDto,
  PublicStats,
} from "@contracts/types";
import type { PublicPageContentResponse } from "@contracts/pageContent";

export const publicKeys = {
  projects: ["public", "projects"] as const,
  featuredProjects: ["public", "featured-projects"] as const,
  news: ["public", "news"] as const,
  newsBySlug: (slug: string) => ["public", "news", slug] as const,
  team: ["public", "team"] as const,
  focusAreas: ["public", "focus-areas"] as const,
  partners: ["public", "partners"] as const,
  settings: ["public", "settings"] as const,
  stats: ["public", "stats"] as const,
  pageContent: (page: string, lang: string) => ["public", "page-content", page, lang] as const,
};

export function usePublicProjects(enabled = true) {
  return useQuery({
    queryKey: publicKeys.projects,
    queryFn: () => apiFetch<ProjectDto[]>("/public/projects"),
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });
}

export function useFeaturedProjects(enabled = true) {
  return useQuery({
    queryKey: publicKeys.featuredProjects,
    queryFn: () => apiFetch<ProjectDto[]>("/public/featured-projects"),
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });
}

export function usePublicNews(enabled = true) {
  return useQuery({
    queryKey: publicKeys.news,
    queryFn: () => apiFetch<NewsItemDto[]>("/public/news"),
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });
}

export function useNewsBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: publicKeys.newsBySlug(slug ?? ""),
    queryFn: () => apiFetch<NewsItemDto>(`/public/news/${encodeURIComponent(slug!)}`),
    enabled: !!slug,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function usePublicTeam(enabled = true) {
  return useQuery({
    queryKey: publicKeys.team,
    queryFn: () => apiFetch<TeamMemberDto[]>("/public/team"),
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });
}

export function usePublicFocusAreas(enabled = true) {
  return useQuery({
    queryKey: publicKeys.focusAreas,
    queryFn: () => apiFetch<FocusAreaDto[]>("/public/focus-areas"),
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });
}

export function usePublicPartners(enabled = true) {
  return useQuery({
    queryKey: publicKeys.partners,
    queryFn: () => apiFetch<PartnerDto[]>("/public/partners"),
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });
}

export function useSiteSettings(enabled = true) {
  return useQuery({
    queryKey: publicKeys.settings,
    queryFn: () => apiFetch<SiteSettingDto[]>("/public/settings"),
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });
}

export function usePublicStats(enabled = true) {
  return useQuery({
    queryKey: publicKeys.stats,
    queryFn: () => apiFetch<PublicStats>("/public/stats"),
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });
}

/** Convertit une liste de paramètres (clé -> valeur) en objet pratique. */
export function settingsToMap(settings?: SiteSettingDto[]): Record<string, string> {
  const map: Record<string, string> = {};
  settings?.forEach((s) => {
    map[s.key] = s.value || "";
  });
  return map;
}

/** Contenu éditable d'une page pour une langue donnée (repli FR inclus côté API). */
export function usePageContent(page: string, lang = "fr") {
  return useQuery({
    queryKey: publicKeys.pageContent(page, lang),
    queryFn: () =>
      apiFetch<PublicPageContentResponse>(
        `/public/page-content/${encodeURIComponent(page)}?lang=${encodeURIComponent(lang)}`,
      ),
    enabled: !!page,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });
}
