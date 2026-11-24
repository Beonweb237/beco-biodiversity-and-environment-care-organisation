// ============================================================
// Hooks React Query — administration (REST Express + Supabase)
// Les hooks de mutation acceptent les options React Query
// (onSuccess / onError) et invalident les caches concernés.
// ============================================================
import { useMutation, useQuery, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type {
  AdminUserDto,
  AdminAuthResponse,
  AdminStats,
  ProjectDto,
  ProjectInput,
  NewsItemDto,
  NewsInput,
  TeamMemberDto,
  TeamMemberInput,
  FocusAreaDto,
  FocusAreaInput,
  PartnerDto,
  PartnerInput,
  ContactMessageDto,
  VolunteerApplicationDto,
  SiteSettingDto,
  ActivityLogDto,
  PaginatedLogs,
} from "@contracts/types";
import type { AdminPageContentResponse } from "@contracts/pageContent";

// ============================================================
// Clés de cache
// ============================================================
export const adminKeys = {
  me: ["admin", "auth", "me"] as const,
  stats: ["admin", "stats"] as const,
  projects: ["admin", "projects"] as const,
  news: ["admin", "news"] as const,
  team: ["admin", "team"] as const,
  focusAreas: ["admin", "focus-areas"] as const,
  partners: ["admin", "partners"] as const,
  messages: ["admin", "messages"] as const,
  volunteers: ["admin", "volunteers"] as const,
  settings: ["admin", "settings"] as const,
  users: ["admin", "users"] as const,
  activityLogs: (params?: Record<string, unknown>) => ["admin", "activity-logs", params] as const,
};

/** Mutation générique : invalide les caches + propage les options. */
function useApiMutation<TData, TVariables, TContext = unknown>(
  mutationFn: (vars: TVariables) => Promise<TData>,
  invalidateKeys: ReadonlyArray<readonly unknown[]>,
  options?: UseMutationOptions<TData, Error, TVariables, TContext>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options ?? {}),
    mutationFn,
    onSettled: () => {
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key as unknown[] });
      });
    },
  });
}

// ============================================================
// AUTH
// ============================================================
export function useAdminMe() {
  return useQuery({
    queryKey: adminKeys.me,
    queryFn: () => apiFetch<AdminUserDto | null>("/admin/auth/me"),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useAdminLogin(
  options?: UseMutationOptions<AdminAuthResponse, Error, { username: string; password: string }>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    ...(options ?? {}),
    mutationFn: (input) =>
      apiFetch<AdminAuthResponse>("/admin/auth/login", { method: "POST", body: input }),
    onSettled: (data) => {
      if (data?.success && data.user) {
        queryClient.setQueryData(adminKeys.me, data.user);
      }
    },
  });
}

// ============================================================
// STATS
// ============================================================
export function useAdminStats() {
  return useQuery({
    queryKey: adminKeys.stats,
    queryFn: () => apiFetch<AdminStats>("/admin/stats"),
  });
}

// ============================================================
// PROJETS
// ============================================================
export function useAdminProjects() {
  return useQuery({
    queryKey: adminKeys.projects,
    queryFn: () => apiFetch<ProjectDto[]>("/admin/projects"),
  });
}

export function useCreateProject(options?: UseMutationOptions<{ id: number; success: boolean }, Error, ProjectInput>) {
  return useApiMutation(
    (input) => apiFetch<{ id: number; success: boolean }>("/admin/projects", { method: "POST", body: input }),
    [adminKeys.projects, adminKeys.stats],
    options,
  );
}

export function useUpdateProject(options?: UseMutationOptions<{ success: boolean }, Error, ProjectInput & { id: number }>) {
  return useApiMutation(
    (input) => apiFetch<{ success: boolean }>(`/admin/projects/${input.id}`, { method: "PUT", body: input }),
    [adminKeys.projects],
    options,
  );
}

export function useDeleteProject(options?: UseMutationOptions<{ success: boolean }, Error, number>) {
  return useApiMutation(
    (id) => apiFetch<{ success: boolean }>(`/admin/projects/${id}`, { method: "DELETE" }),
    [adminKeys.projects, adminKeys.stats],
    options,
  );
}

// ============================================================
// ACTUALITÉS
// ============================================================
export function useAdminNews() {
  return useQuery({
    queryKey: adminKeys.news,
    queryFn: () => apiFetch<NewsItemDto[]>("/admin/news"),
  });
}

export function useCreateNews(options?: UseMutationOptions<{ id: number; success: boolean }, Error, NewsInput>) {
  return useApiMutation(
    (input) => apiFetch<{ id: number; success: boolean }>("/admin/news", { method: "POST", body: input }),
    [adminKeys.news, adminKeys.stats],
    options,
  );
}

export function useUpdateNews(options?: UseMutationOptions<{ success: boolean }, Error, NewsInput & { id: number }>) {
  return useApiMutation(
    (input) => apiFetch<{ success: boolean }>(`/admin/news/${input.id}`, { method: "PUT", body: input }),
    [adminKeys.news],
    options,
  );
}

export function useDeleteNews(options?: UseMutationOptions<{ success: boolean }, Error, number>) {
  return useApiMutation(
    (id) => apiFetch<{ success: boolean }>(`/admin/news/${id}`, { method: "DELETE" }),
    [adminKeys.news, adminKeys.stats],
    options,
  );
}

// ============================================================
// ÉQUIPE
// ============================================================
export function useAdminTeam() {
  return useQuery({
    queryKey: adminKeys.team,
    queryFn: () => apiFetch<TeamMemberDto[]>("/admin/team"),
  });
}

export function useCreateTeamMember(options?: UseMutationOptions<{ id: number; success: boolean }, Error, TeamMemberInput>) {
  return useApiMutation(
    (input) => apiFetch<{ id: number; success: boolean }>("/admin/team", { method: "POST", body: input }),
    [adminKeys.team, adminKeys.stats],
    options,
  );
}

export function useUpdateTeamMember(options?: UseMutationOptions<{ success: boolean }, Error, TeamMemberInput & { id: number }>) {
  return useApiMutation(
    (input) => apiFetch<{ success: boolean }>(`/admin/team/${input.id}`, { method: "PUT", body: input }),
    [adminKeys.team],
    options,
  );
}

export function useDeleteTeamMember(options?: UseMutationOptions<{ success: boolean }, Error, number>) {
  return useApiMutation(
    (id) => apiFetch<{ success: boolean }>(`/admin/team/${id}`, { method: "DELETE" }),
    [adminKeys.team, adminKeys.stats],
    options,
  );
}

// ============================================================
// DOMAINES D'INTERVENTION
// ============================================================
export function useAdminFocusAreas() {
  return useQuery({
    queryKey: adminKeys.focusAreas,
    queryFn: () => apiFetch<FocusAreaDto[]>("/admin/focus-areas"),
  });
}

export function useCreateFocusArea(options?: UseMutationOptions<{ id: number; success: boolean }, Error, FocusAreaInput>) {
  return useApiMutation(
    (input) => apiFetch<{ id: number; success: boolean }>("/admin/focus-areas", { method: "POST", body: input }),
    [adminKeys.focusAreas, adminKeys.stats],
    options,
  );
}

export function useUpdateFocusArea(options?: UseMutationOptions<{ success: boolean }, Error, FocusAreaInput & { id: number }>) {
  return useApiMutation(
    (input) => apiFetch<{ success: boolean }>(`/admin/focus-areas/${input.id}`, { method: "PUT", body: input }),
    [adminKeys.focusAreas],
    options,
  );
}

export function useDeleteFocusArea(options?: UseMutationOptions<{ success: boolean }, Error, number>) {
  return useApiMutation(
    (id) => apiFetch<{ success: boolean }>(`/admin/focus-areas/${id}`, { method: "DELETE" }),
    [adminKeys.focusAreas, adminKeys.stats],
    options,
  );
}

// ============================================================
// PARTENAIRES
// ============================================================
export function useAdminPartners() {
  return useQuery({
    queryKey: adminKeys.partners,
    queryFn: () => apiFetch<PartnerDto[]>("/admin/partners"),
  });
}

export function useCreatePartner(options?: UseMutationOptions<{ id: number; success: boolean }, Error, PartnerInput>) {
  return useApiMutation(
    (input) => apiFetch<{ id: number; success: boolean }>("/admin/partners", { method: "POST", body: input }),
    [adminKeys.partners],
    options,
  );
}

export function useUpdatePartner(options?: UseMutationOptions<{ success: boolean }, Error, PartnerInput & { id: number }>) {
  return useApiMutation(
    (input) => apiFetch<{ success: boolean }>(`/admin/partners/${input.id}`, { method: "PUT", body: input }),
    [adminKeys.partners],
    options,
  );
}

export function useDeletePartner(options?: UseMutationOptions<{ success: boolean }, Error, number>) {
  return useApiMutation(
    (id) => apiFetch<{ success: boolean }>(`/admin/partners/${id}`, { method: "DELETE" }),
    [adminKeys.partners],
    options,
  );
}

// ============================================================
// MESSAGES DE CONTACT
// ============================================================
export function useAdminMessages() {
  return useQuery({
    queryKey: adminKeys.messages,
    queryFn: () => apiFetch<ContactMessageDto[]>("/admin/messages"),
  });
}

export function useMarkMessageRead(options?: UseMutationOptions<{ success: boolean }, Error, number>) {
  return useApiMutation(
    (id) => apiFetch<{ success: boolean }>(`/admin/messages/${id}/read`, { method: "PATCH" }),
    [adminKeys.messages, adminKeys.stats],
    options,
  );
}

export function useDeleteMessage(options?: UseMutationOptions<{ success: boolean }, Error, number>) {
  return useApiMutation(
    (id) => apiFetch<{ success: boolean }>(`/admin/messages/${id}`, { method: "DELETE" }),
    [adminKeys.messages, adminKeys.stats],
    options,
  );
}

// ============================================================
// CANDIDATURES BÉNÉVOLAT
// ============================================================
export function useAdminVolunteers() {
  return useQuery({
    queryKey: adminKeys.volunteers,
    queryFn: () => apiFetch<VolunteerApplicationDto[]>("/admin/volunteers"),
  });
}

export function useMarkVolunteerRead(options?: UseMutationOptions<{ success: boolean }, Error, number>) {
  return useApiMutation(
    (id) => apiFetch<{ success: boolean }>(`/admin/volunteers/${id}/read`, { method: "PATCH" }),
    [adminKeys.volunteers],
    options,
  );
}

export function useDeleteVolunteer(options?: UseMutationOptions<{ success: boolean }, Error, number>) {
  return useApiMutation(
    (id) => apiFetch<{ success: boolean }>(`/admin/volunteers/${id}`, { method: "DELETE" }),
    [adminKeys.volunteers],
    options,
  );
}

// ============================================================
// PARAMÈTRES DU SITE
// ============================================================
export function useAdminSettings() {
  return useQuery({
    queryKey: adminKeys.settings,
    queryFn: () => apiFetch<SiteSettingDto[]>("/admin/settings"),
  });
}

export function useUpdateSetting(options?: UseMutationOptions<{ success: boolean }, Error, { key: string; value: string }>) {
  return useApiMutation(
    (input) =>
      apiFetch<{ success: boolean }>(`/admin/settings/${encodeURIComponent(input.key)}`, {
        method: "PUT",
        body: { value: input.value },
      }),
    [adminKeys.settings],
    options,
  );
}

// ============================================================
// CONTENU DE PAGES (éditable par langue)
// ============================================================
export function useAdminPageContent(page: string) {
  return useQuery({
    queryKey: ["admin", "page-content", page],
    queryFn: () => apiFetch<AdminPageContentResponse>(`/admin/page-content/${encodeURIComponent(page)}`),
    enabled: !!page,
  });
}

export function useSavePageSection(options?: UseMutationOptions<{ success: boolean }, Error, { page: string; section: string; lang: string; data: Record<string, string> }>) {
  return useMutation({
    ...(options ?? {}),
    mutationFn: (input) =>
      apiFetch<{ success: boolean }>(
        `/admin/page-content/${encodeURIComponent(input.page)}/${encodeURIComponent(input.section)}/${encodeURIComponent(input.lang)}`,
        { method: "PUT", body: { data: input.data } },
      ),
  });
}

// ============================================================
// UTILISATEURS ADMIN
// ============================================================
export function useAdminUsers() {
  return useQuery({
    queryKey: adminKeys.users,
    queryFn: () => apiFetch<AdminUserDto[]>("/admin/users"),
  });
}

export function useCreateAdminUser(
  options?: UseMutationOptions<{ id: number; success: boolean }, Error, { username: string; password: string; name: string; email?: string; role: "admin" | "superadmin" }>,
) {
  return useApiMutation(
    (input) => apiFetch<{ id: number; success: boolean }>("/admin/users", { method: "POST", body: input }),
    [adminKeys.users],
    options,
  );
}

export function useToggleAdminUser(options?: UseMutationOptions<{ success: boolean }, Error, number>) {
  return useApiMutation(
    (id) => apiFetch<{ success: boolean }>(`/admin/users/${id}/toggle`, { method: "PATCH" }),
    [adminKeys.users],
    options,
  );
}

// ============================================================
// JOURNAUX D'ACTIVITÉ
// ============================================================
export function useAdminActivityLogs(params?: { limit?: number; offset?: number; entity?: string; action?: string }) {
  const query = new URLSearchParams();
  if (params?.limit != null) query.set("limit", String(params.limit));
  if (params?.offset != null) query.set("offset", String(params.offset));
  if (params?.entity) query.set("entity", params.entity);
  if (params?.action) query.set("action", params.action);
  const qs = query.toString();
  return useQuery({
    queryKey: adminKeys.activityLogs(params),
    queryFn: () => apiFetch<PaginatedLogs>(`/admin/activity-logs${qs ? `?${qs}` : ""}`),
  });
}

export function useAdminActivityRecent(limit = 10) {
  return useQuery({
    queryKey: ["admin", "activity-logs", "recent", limit],
    queryFn: () => apiFetch<ActivityLogDto[]>(`/admin/activity-logs/recent?limit=${limit}`),
  });
}
