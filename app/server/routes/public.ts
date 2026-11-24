import { Router } from "express";
import { supabase } from "../lib/supabase.js";
import {
  mapProject,
  mapNews,
  mapTeamMember,
  mapFocusArea,
  mapPartner,
  mapSetting,
} from "../lib/serialize.js";

export const publicRouter = Router();

// ============================================================
// PROJETS (publiés)
// ============================================================
publicRouter.get("/projects", async (_req, res) => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json((data ?? []).map(mapProject));
});

publicRouter.get("/featured-projects", async (_req, res) => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(3);
  if (error) return res.status(500).json({ error: error.message });
  res.json((data ?? []).map(mapProject));
});

// ============================================================
// ACTUALITÉS (publiées)
// ============================================================
publicRouter.get("/news", async (_req, res) => {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json((data ?? []).map(mapNews));
});

publicRouter.get("/news/:slug", async (req, res) => {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", req.params.slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Article introuvable" });
  res.json(mapNews(data));
});

// ============================================================
// ÉQUIPE (publiée)
// ============================================================
publicRouter.get("/team", async (_req, res) => {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json((data ?? []).map(mapTeamMember));
});

// ============================================================
// DOMAINES D'INTERVENTION (publiés)
// ============================================================
publicRouter.get("/focus-areas", async (_req, res) => {
  const { data, error } = await supabase
    .from("focus_areas")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json((data ?? []).map(mapFocusArea));
});

// ============================================================
// PARTENAIRES (publiés)
// ============================================================
publicRouter.get("/partners", async (_req, res) => {
  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json((data ?? []).map(mapPartner));
});

// ============================================================
// PARAMÈTRES DU SITE
// ============================================================
publicRouter.get("/settings", async (_req, res) => {
  const { data, error } = await supabase.from("site_settings").select("*").order("key");
  if (error) return res.status(500).json({ error: error.message });
  res.json((data ?? []).map(mapSetting));
});

// ============================================================
// STATISTIQUES (compteurs pour la page d'accueil)
// ============================================================
publicRouter.get("/stats", async (_req, res) => {
  const { count: projectCount, error: e1 } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("is_published", true);
  const { count: teamCount, error: e2 } = await supabase
    .from("team_members")
    .select("id", { count: "exact", head: true })
    .eq("is_published", true);
  const { count: areaCount, error: e3 } = await supabase
    .from("focus_areas")
    .select("id", { count: "exact", head: true })
    .eq("is_published", true);

  if (e1 || e2 || e3) {
    return res.status(500).json({ error: e1?.message || e2?.message || e3?.message });
  }

  res.json({
    activeProjects: projectCount ?? 0,
    yearCreated: 2025,
    domains: areaCount ?? 0,
    teamMembers: teamCount ?? 0,
  });
});

// ============================================================
// CONTENU DE PAGE (éditable par langue)
// Renvoie les sections de la page pour la langue demandée,
// avec repli sur le français si un champ est vide/non rempli.
// ============================================================
const CONTENT_LANGS = ["fr", "en", "es", "de", "ar"];

function parseSectionJson(value: string | null): Record<string, string> {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

publicRouter.get("/page-content/:page", async (req, res) => {
  const page = req.params.page;
  const rawLang = (req.query.lang as string) || "fr";
  const lang = CONTENT_LANGS.includes(rawLang) ? rawLang : "fr";

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .like("key", `content:${page}:%`);

  if (error) return res.status(500).json({ error: error.message });

  // Regroupe par section : { section: { lang: { champ: valeur } } }
  const bySection: Record<string, Record<string, Record<string, string>>> = {};
  for (const row of data ?? []) {
    const match = /^content:[^:]+:([^:]+):([a-z]{2})$/.exec(row.key);
    if (!match) continue;
    const [, section, rowLang] = match;
    if (!bySection[section]) bySection[section] = {};
    bySection[section][rowLang] = parseSectionJson(row.value);
  }

  const sections: Record<string, Record<string, string>> = {};
  for (const [section, langs] of Object.entries(bySection)) {
    const target = langs[lang] ?? {};
    const fallback = langs["fr"] ?? {};
    // Règle : valeur de la langue demandée, sinon valeur française (champ vide → repli FR).
    const merged: Record<string, string> = {};
    for (const key of new Set([...Object.keys(fallback), ...Object.keys(target)])) {
      const candidate = target[key] ?? "";
      const v = candidate.trim() !== "" ? candidate : fallback[key] ?? "";
      if (v.trim() !== "") merged[key] = v;
    }
    if (Object.keys(merged).length > 0) sections[section] = merged;
  }

  res.json({ page, lang, sections });
});
