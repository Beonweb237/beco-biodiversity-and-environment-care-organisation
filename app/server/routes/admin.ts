import { Router } from "express";
import bcrypt from "bcryptjs";
import { supabase } from "../lib/supabase.js";
import { requireAdmin, getAdminUser } from "../middleware/auth.js";
import { logActivity } from "../lib/activity.js";
import {
  mapProject,
  mapNews,
  mapTeamMember,
  mapFocusArea,
  mapPartner,
  mapContactMessage,
  mapVolunteer,
  mapSetting,
  mapAdminUser,
  mapActivityLog,
} from "../lib/serialize.js";
import type { ProjectInput, NewsInput, TeamMemberInput, FocusAreaInput, PartnerInput } from "@contracts/types";

export const adminRouter = Router();
adminRouter.use(requireAdmin);

// ============================================================
// Helpers de mapping input camelCase -> colonnes snake_case
// ============================================================
function projectToRow(input: ProjectInput) {
  return {
    title: input.title,
    slug: input.slug,
    tag: input.tag,
    date: input.date ?? null,
    description: input.description,
    image: input.image ?? null,
    details: input.details ?? null,
    funder: input.funder ?? null,
    category: input.category ?? null,
    url: input.url ?? null,
    is_published: input.isPublished ?? true,
  };
}

function newsToRow(input: NewsInput) {
  return {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    content: input.content ?? null,
    tag: input.tag,
    date: input.date ?? null,
    image: input.image ?? null,
    category: input.category ?? null,
    is_published: input.isPublished ?? true,
  };
}

function teamToRow(input: TeamMemberInput) {
  return {
    name: input.name,
    role: input.role,
    status: input.status ?? null,
    description: input.description ?? null,
    image: input.image ?? null,
    linkedin: input.linkedin ?? null,
    email: input.email ?? null,
    sort_order: input.order ?? 0,
    is_published: input.isPublished ?? true,
  };
}

function focusAreaToRow(input: FocusAreaInput) {
  return {
    title: input.title,
    slug: input.slug,
    description: input.description,
    image: input.image ?? null,
    sort_order: input.order ?? 0,
    is_published: input.isPublished ?? true,
  };
}

function partnerToRow(input: PartnerInput) {
  return {
    name: input.name,
    abbr: input.abbr,
    logo: input.logo ?? null,
    sort_order: input.order ?? 0,
    is_published: input.isPublished ?? true,
  };
}

function parseIntId(raw: string): number {
  const id = Number.parseInt(raw, 10);
  return Number.isFinite(id) ? id : NaN;
}

// ============================================================
// STATS DASHBOARD
// ============================================================
adminRouter.get("/stats", async (_req, res) => {
  const tables: Array<[string, string]> = [
    ["projects", "projects"],
    ["news", "news"],
    ["team_members", "team"],
    ["contact_messages", "messages"],
    ["focus_areas", "focusAreas"],
    ["volunteer_applications", "volunteers"],
  ];
  const stats: Record<string, number> = {};
  for (const [table, key] of tables) {
    const { count, error } = await supabase.from(table).select("id", { count: "exact", head: true });
    if (error) return res.status(500).json({ error: error.message });
    stats[key] = count ?? 0;
  }
  const { count: unread, error: uErr } = await supabase
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);
  if (uErr) return res.status(500).json({ error: uErr.message });
  stats.unreadMessages = unread ?? 0;
  res.json(stats);
});

// ============================================================
// PROJETS — CRUD
// ============================================================
adminRouter.get("/projects", async (_req, res) => {
  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json((data ?? []).map(mapProject));
});

adminRouter.get("/projects/:id", async (req, res) => {
  const id = parseIntId(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalide" });
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Introuvable" });
  res.json(mapProject(data));
});

adminRouter.post("/projects", async (req, res) => {
  const body = req.body as ProjectInput;
  if (!body.title || !body.slug || !body.tag || !body.description) {
    return res.status(400).json({ error: "Champs obligatoires manquants" });
  }
  const { data, error } = await supabase.from("projects").insert(projectToRow(body)).select("*").single();
  if (error) return res.status(500).json({ error: error.message });
  const admin = getAdminUser(req);
  logActivity({ adminUserId: admin.id, adminName: admin.name, action: "create", entity: "project", entityId: data.id, details: `Projet « ${body.title} » créé` });
  res.json({ id: data.id, success: true });
});

adminRouter.put("/projects/:id", async (req, res) => {
  const id = parseIntId(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalide" });
  const body = req.body as ProjectInput;
  const { error } = await supabase.from("projects").update(projectToRow(body)).eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  const admin = getAdminUser(req);
  logActivity({ adminUserId: admin.id, adminName: admin.name, action: "update", entity: "project", entityId: id, details: `Projet « ${body.title} » modifié` });
  res.json({ success: true });
});

adminRouter.delete("/projects/:id", async (req, res) => {
  const id = parseIntId(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalide" });
  const { data } = await supabase.from("projects").select("title").eq("id", id).maybeSingle();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  const admin = getAdminUser(req);
  logActivity({ adminUserId: admin.id, adminName: admin.name, action: "delete", entity: "project", entityId: id, details: `Projet « ${data?.title || "Inconnu"} » supprimé` });
  res.json({ success: true });
});

// ============================================================
// ACTUALITÉS — CRUD
// ============================================================
adminRouter.get("/news", async (_req, res) => {
  const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json((data ?? []).map(mapNews));
});

adminRouter.get("/news/:id", async (req, res) => {
  const id = parseIntId(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalide" });
  const { data, error } = await supabase.from("news").select("*").eq("id", id).maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Introuvable" });
  res.json(mapNews(data));
});

adminRouter.post("/news", async (req, res) => {
  const body = req.body as NewsInput;
  if (!body.title || !body.slug || !body.excerpt || !body.tag) {
    return res.status(400).json({ error: "Champs obligatoires manquants" });
  }
  const { data, error } = await supabase.from("news").insert(newsToRow(body)).select("*").single();
  if (error) return res.status(500).json({ error: error.message });
  const admin = getAdminUser(req);
  logActivity({ adminUserId: admin.id, adminName: admin.name, action: "create", entity: "news", entityId: data.id, details: `Actualité « ${body.title} » créée` });
  res.json({ id: data.id, success: true });
});

adminRouter.put("/news/:id", async (req, res) => {
  const id = parseIntId(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalide" });
  const body = req.body as NewsInput;
  const { error } = await supabase.from("news").update(newsToRow(body)).eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  const admin = getAdminUser(req);
  logActivity({ adminUserId: admin.id, adminName: admin.name, action: "update", entity: "news", entityId: id, details: `Actualité « ${body.title} » modifiée` });
  res.json({ success: true });
});

adminRouter.delete("/news/:id", async (req, res) => {
  const id = parseIntId(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalide" });
  const { data } = await supabase.from("news").select("title").eq("id", id).maybeSingle();
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  const admin = getAdminUser(req);
  logActivity({ adminUserId: admin.id, adminName: admin.name, action: "delete", entity: "news", entityId: id, details: `Actualité « ${data?.title || "Inconnue"} » supprimée` });
  res.json({ success: true });
});

// ============================================================
// ÉQUIPE — CRUD
// ============================================================
adminRouter.get("/team", async (_req, res) => {
  const { data, error } = await supabase.from("team_members").select("*").order("sort_order", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json((data ?? []).map(mapTeamMember));
});

adminRouter.get("/team/:id", async (req, res) => {
  const id = parseIntId(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalide" });
  const { data, error } = await supabase.from("team_members").select("*").eq("id", id).maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Introuvable" });
  res.json(mapTeamMember(data));
});

adminRouter.post("/team", async (req, res) => {
  const body = req.body as TeamMemberInput;
  if (!body.name || !body.role) return res.status(400).json({ error: "Champs obligatoires manquants" });
  const { data, error } = await supabase.from("team_members").insert(teamToRow(body)).select("*").single();
  if (error) return res.status(500).json({ error: error.message });
  const admin = getAdminUser(req);
  logActivity({ adminUserId: admin.id, adminName: admin.name, action: "create", entity: "team_member", entityId: data.id, details: `Membre « ${body.name} » créé` });
  res.json({ id: data.id, success: true });
});

adminRouter.put("/team/:id", async (req, res) => {
  const id = parseIntId(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalide" });
  const body = req.body as TeamMemberInput;
  const { error } = await supabase.from("team_members").update(teamToRow(body)).eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  const admin = getAdminUser(req);
  logActivity({ adminUserId: admin.id, adminName: admin.name, action: "update", entity: "team_member", entityId: id, details: `Membre « ${body.name} » modifié` });
  res.json({ success: true });
});

adminRouter.delete("/team/:id", async (req, res) => {
  const id = parseIntId(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalide" });
  const { data } = await supabase.from("team_members").select("name").eq("id", id).maybeSingle();
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  const admin = getAdminUser(req);
  logActivity({ adminUserId: admin.id, adminName: admin.name, action: "delete", entity: "team_member", entityId: id, details: `Membre « ${data?.name || "Inconnu"} » supprimé` });
  res.json({ success: true });
});

// ============================================================
// DOMAINES D'INTERVENTION — CRUD
// ============================================================
adminRouter.get("/focus-areas", async (_req, res) => {
  const { data, error } = await supabase.from("focus_areas").select("*").order("sort_order", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json((data ?? []).map(mapFocusArea));
});

adminRouter.get("/focus-areas/:id", async (req, res) => {
  const id = parseIntId(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalide" });
  const { data, error } = await supabase.from("focus_areas").select("*").eq("id", id).maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Introuvable" });
  res.json(mapFocusArea(data));
});

adminRouter.post("/focus-areas", async (req, res) => {
  const body = req.body as FocusAreaInput;
  if (!body.title || !body.slug || !body.description) {
    return res.status(400).json({ error: "Champs obligatoires manquants" });
  }
  const { data, error } = await supabase.from("focus_areas").insert(focusAreaToRow(body)).select("*").single();
  if (error) return res.status(500).json({ error: error.message });
  const admin = getAdminUser(req);
  logActivity({ adminUserId: admin.id, adminName: admin.name, action: "create", entity: "focus_area", entityId: data.id, details: `Domaine « ${body.title} » créé` });
  res.json({ id: data.id, success: true });
});

adminRouter.put("/focus-areas/:id", async (req, res) => {
  const id = parseIntId(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalide" });
  const body = req.body as FocusAreaInput;
  const { error } = await supabase.from("focus_areas").update(focusAreaToRow(body)).eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  const admin = getAdminUser(req);
  logActivity({ adminUserId: admin.id, adminName: admin.name, action: "update", entity: "focus_area", entityId: id, details: `Domaine « ${body.title} » modifié` });
  res.json({ success: true });
});

adminRouter.delete("/focus-areas/:id", async (req, res) => {
  const id = parseIntId(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalide" });
  const { data } = await supabase.from("focus_areas").select("title").eq("id", id).maybeSingle();
  const { error } = await supabase.from("focus_areas").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  const admin = getAdminUser(req);
  logActivity({ adminUserId: admin.id, adminName: admin.name, action: "delete", entity: "focus_area", entityId: id, details: `Domaine « ${data?.title || "Inconnu"} » supprimé` });
  res.json({ success: true });
});

// ============================================================
// PARTENAIRES — CRUD
// ============================================================
adminRouter.get("/partners", async (_req, res) => {
  const { data, error } = await supabase.from("partners").select("*").order("sort_order", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json((data ?? []).map(mapPartner));
});

adminRouter.post("/partners", async (req, res) => {
  const body = req.body as PartnerInput;
  if (!body.name || !body.abbr) return res.status(400).json({ error: "Champs obligatoires manquants" });
  const { data, error } = await supabase.from("partners").insert(partnerToRow(body)).select("*").single();
  if (error) return res.status(500).json({ error: error.message });
  const admin = getAdminUser(req);
  logActivity({ adminUserId: admin.id, adminName: admin.name, action: "create", entity: "partner", entityId: data.id, details: `Partenaire « ${body.name} » créé` });
  res.json({ id: data.id, success: true });
});

adminRouter.put("/partners/:id", async (req, res) => {
  const id = parseIntId(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalide" });
  const body = req.body as PartnerInput;
  const { error } = await supabase.from("partners").update(partnerToRow(body)).eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  const admin = getAdminUser(req);
  logActivity({ adminUserId: admin.id, adminName: admin.name, action: "update", entity: "partner", entityId: id, details: `Partenaire « ${body.name} » modifié` });
  res.json({ success: true });
});

adminRouter.delete("/partners/:id", async (req, res) => {
  const id = parseIntId(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalide" });
  const { data } = await supabase.from("partners").select("name").eq("id", id).maybeSingle();
  const { error } = await supabase.from("partners").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  const admin = getAdminUser(req);
  logActivity({ adminUserId: admin.id, adminName: admin.name, action: "delete", entity: "partner", entityId: id, details: `Partenaire « ${data?.name || "Inconnu"} » supprimé` });
  res.json({ success: true });
});

// ============================================================
// MESSAGES DE CONTACT
// ============================================================
adminRouter.get("/messages", async (_req, res) => {
  const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json((data ?? []).map(mapContactMessage));
});

adminRouter.patch("/messages/:id/read", async (req, res) => {
  const id = parseIntId(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalide" });
  const { error } = await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  const admin = getAdminUser(req);
  logActivity({ adminUserId: admin.id, adminName: admin.name, action: "mark_read", entity: "contact_message", entityId: id, details: "Message marqué comme lu" });
  res.json({ success: true });
});

adminRouter.delete("/messages/:id", async (req, res) => {
  const id = parseIntId(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalide" });
  const { data } = await supabase.from("contact_messages").select("first_name").eq("id", id).maybeSingle();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  const admin = getAdminUser(req);
  logActivity({ adminUserId: admin.id, adminName: admin.name, action: "delete", entity: "contact_message", entityId: id, details: `Message de ${data?.first_name || "Inconnu"} supprimé` });
  res.json({ success: true });
});

// ============================================================
// CANDIDATURES BÉNÉVOLAT
// ============================================================
adminRouter.get("/volunteers", async (_req, res) => {
  const { data, error } = await supabase.from("volunteer_applications").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json((data ?? []).map(mapVolunteer));
});

adminRouter.patch("/volunteers/:id/read", async (req, res) => {
  const id = parseIntId(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalide" });
  const { error } = await supabase.from("volunteer_applications").update({ is_read: true }).eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

adminRouter.delete("/volunteers/:id", async (req, res) => {
  const id = parseIntId(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalide" });
  const { error } = await supabase.from("volunteer_applications").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ============================================================
// PARAMÈTRES DU SITE
// ============================================================
adminRouter.get("/settings", async (_req, res) => {
  const { data, error } = await supabase.from("site_settings").select("*").order("key");
  if (error) return res.status(500).json({ error: error.message });
  res.json((data ?? []).map(mapSetting));
});

adminRouter.put("/settings/:key", async (req, res) => {
  const key = req.params.key;
  const { value } = req.body ?? {};
  const { error } = await supabase
    .from("site_settings")
    .update({ value: value ?? null, updated_at: new Date().toISOString() })
    .eq("key", key);
  if (error) return res.status(500).json({ error: error.message });
  const admin = getAdminUser(req);
  logActivity({ adminUserId: admin.id, adminName: admin.name, action: "update", entity: "site_setting", details: `Paramètre « ${key} » mis à jour` });
  res.json({ success: true });
});

// ============================================================
// CONTENU DE PAGES (éditable par langue) — stocké dans site_settings
// Clés : content:<page>:<section>:<lang> = JSON des champs
// ============================================================
const PAGE_CONTENT_LANGS = ["fr", "en", "es", "de", "ar"];

function pageContentRowKey(page: string, section: string, lang: string): string {
  return `content:${page}:${section}:${lang}`;
}

function parseRowData(value: string | null): Record<string, string> {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

// Renvoie les sections brutes par langue : { fr: { story: {...} }, en: {...} }
adminRouter.get("/page-content/:page", async (req, res) => {
  const page = req.params.page;
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .like("key", `content:${page}:%`);

  if (error) return res.status(500).json({ error: error.message });

  const result: Record<string, Record<string, Record<string, string>>> = {};
  for (const row of data ?? []) {
    const match = /^content:[^:]+:([^:]+):([a-z]{2})$/.exec(row.key);
    if (!match) continue;
    const [, section, lang] = match;
    if (!result[lang]) result[lang] = {};
    result[lang][section] = parseRowData(row.value);
  }

  res.json(result);
});

// Met à jour (upsert) le contenu d'une section pour une page + langue donnée.
adminRouter.put("/page-content/:page/:section/:lang", async (req, res) => {
  const { page, section, lang } = req.params;
  if (!page || !section || !PAGE_CONTENT_LANGS.includes(lang)) {
    return res.status(400).json({ error: "Paramètres invalides" });
  }
  const data = (req.body as { data?: Record<string, string> })?.data ?? {};
  const value = JSON.stringify(data);

  const key = pageContentRowKey(page, section, lang);
  const { data: existing } = await supabase.from("site_settings").select("id").eq("key", key).maybeSingle();
  if (existing) {
    const { error } = await supabase
      .from("site_settings")
      .update({ value, updated_at: new Date().toISOString() })
      .eq("key", key);
    if (error) return res.status(500).json({ error: error.message });
  } else {
    const { error } = await supabase.from("site_settings").insert({ key, value });
    if (error) return res.status(500).json({ error: error.message });
  }

  const admin = getAdminUser(req);
  logActivity({ adminUserId: admin.id, adminName: admin.name, action: "update", entity: "page_content", details: `Page « ${page} » — section « ${section} » (${lang}) mise à jour` });
  res.json({ success: true });
});

// ============================================================
// UTILISATEURS ADMIN
// ============================================================
adminRouter.get("/users", async (_req, res) => {
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, username, name, email, role, is_active, created_at")
    .order("created_at", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json((data ?? []).map(mapAdminUser));
});

adminRouter.post("/users", async (req, res) => {
  const { username, password, name, email, role } = req.body ?? {};
  if (!username || !password || !name) {
    return res.status(400).json({ error: "Champs obligatoires manquants" });
  }
  const passwordHash = await bcrypt.hash(String(password), 10);
  const { data, error } = await supabase
    .from("admin_users")
    .insert({
      username: String(username),
      password_hash: passwordHash,
      name: String(name),
      email: email ? String(email) : null,
      role: role === "superadmin" ? "superadmin" : "admin",
      is_active: true,
    })
    .select("*")
    .single();
  if (error) return res.status(500).json({ error: error.message });
  const admin = getAdminUser(req);
  logActivity({ adminUserId: admin.id, adminName: admin.name, action: "create", entity: "admin_user", entityId: data.id, details: `Admin « ${name} » créé (${data.role})` });
  res.json({ id: data.id, success: true });
});

adminRouter.patch("/users/:id/toggle", async (req, res) => {
  const id = parseIntId(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID invalide" });
  const { data: user } = await supabase.from("admin_users").select("*").eq("id", id).maybeSingle();
  if (!user) return res.status(404).json({ error: "Introuvable" });
  const { error } = await supabase
    .from("admin_users")
    .update({ is_active: !user.is_active })
    .eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  const admin = getAdminUser(req);
  logActivity({ adminUserId: admin.id, adminName: admin.name, action: "toggle", entity: "admin_user", entityId: id, details: `Admin « ${user.name} » ${user.is_active ? "désactivé" : "activé"}` });
  res.json({ success: true });
});

// ============================================================
// JOURNAUX D'ACTIVITÉ
// ============================================================
adminRouter.get("/activity-logs", async (req, res) => {
  const limit = Math.min(Number.parseInt(String(req.query.limit ?? "50"), 10) || 50, 200);
  const offset = Number.parseInt(String(req.query.offset ?? "0"), 10) || 0;
  const entity = typeof req.query.entity === "string" ? req.query.entity : undefined;
  const action = typeof req.query.action === "string" ? req.query.action : undefined;

  let query = supabase.from("activity_logs").select("*", { count: "exact" });
  if (entity) query = query.eq("entity", entity);
  if (action) query = query.eq("action", action);
  query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ rows: (data ?? []).map(mapActivityLog), total: count ?? 0 });
});

adminRouter.get("/activity-logs/recent", async (req, res) => {
  const limit = Math.min(Number.parseInt(String(req.query.limit ?? "10"), 10) || 10, 50);
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return res.status(500).json({ error: error.message });
  res.json((data ?? []).map(mapActivityLog));
});
