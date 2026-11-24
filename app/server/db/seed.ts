import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { ensureBucket } from "../lib/storage.js";
import {
  DEFAULT_ADMIN,
  seedProjects,
  seedNews,
  seedTeam,
  seedFocusAreas,
  seedPartners,
  seedSettings,
} from "./seed-data.js";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("❌ SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis dans .env");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function resetTable(table: string): Promise<void> {
  const { error } = await supabase.from(table).delete().gte("id", 0);
  if (error) throw new Error(`delete ${table}: ${error.message}`);
}

async function seed() {
  console.log("🌱 Seed Supabase démarré…\n");

  // ============================================================
  // Bucket Storage (images du panneau admin)
  // ============================================================
  await ensureBucket();
  console.log("  ✔ Bucket Supabase Storage prêt");

  // ============================================================
  // Admin par défaut (upsert par username)
  // ============================================================
  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
  const { data: existingAdmin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("username", DEFAULT_ADMIN.username)
    .maybeSingle();
  if (existingAdmin) {
    await supabase
      .from("admin_users")
      .update({ password_hash: passwordHash, name: DEFAULT_ADMIN.name, email: DEFAULT_ADMIN.email, role: DEFAULT_ADMIN.role, is_active: true })
      .eq("id", existingAdmin.id);
    console.log("  ✔ Admin mis à jour :", DEFAULT_ADMIN.username);
  } else {
    await supabase.from("admin_users").insert({
      username: DEFAULT_ADMIN.username,
      password_hash: passwordHash,
      name: DEFAULT_ADMIN.name,
      email: DEFAULT_ADMIN.email,
      role: DEFAULT_ADMIN.role,
      is_active: true,
    });
    console.log("  ✔ Admin créé :", DEFAULT_ADMIN.username, "/", DEFAULT_ADMIN.password);
  }

  // ============================================================
  // Contenus (reset + insert)
  // ============================================================
  await resetTable("projects");
  const { error: pErr } = await supabase.from("projects").insert(
    seedProjects.map((p) => ({
      title: p.title,
      slug: p.slug,
      tag: p.tag,
      date: p.date,
      description: p.description,
      image: p.image,
      details: p.details,
      funder: p.funder,
      category: p.category,
      url: p.url,
      is_published: p.isPublished,
    })),
  );
  if (pErr) throw pErr;
  console.log(`  ✔ ${seedProjects.length} projets`);

  await resetTable("news");
  const { error: nErr } = await supabase.from("news").insert(
    seedNews.map((n) => ({
      title: n.title,
      slug: n.slug,
      excerpt: n.excerpt,
      content: n.content,
      tag: n.tag,
      date: n.date,
      image: n.image,
      category: n.category,
      is_published: n.isPublished,
    })),
  );
  if (nErr) throw nErr;
  console.log(`  ✔ ${seedNews.length} actualités`);

  await resetTable("team_members");
  const { error: tErr } = await supabase.from("team_members").insert(
    seedTeam.map((m) => ({
      name: m.name,
      role: m.role,
      status: m.status,
      description: m.description,
      image: m.image || null,
      sort_order: m.order,
      is_published: m.isPublished,
    })),
  );
  if (tErr) throw tErr;
  console.log(`  ✔ ${seedTeam.length} membres d'équipe`);

  await resetTable("focus_areas");
  const { error: fErr } = await supabase.from("focus_areas").insert(
    seedFocusAreas.map((a) => ({
      title: a.title,
      slug: a.slug,
      description: a.description,
      image: a.image,
      sort_order: a.order,
      is_published: a.isPublished,
    })),
  );
  if (fErr) throw fErr;
  console.log(`  ✔ ${seedFocusAreas.length} domaines d'intervention`);

  await resetTable("partners");
  const { error: paErr } = await supabase.from("partners").insert(
    seedPartners.map((p) => ({
      name: p.name,
      abbr: p.abbr,
      logo: p.logo,
      sort_order: p.order,
      is_published: p.isPublished,
    })),
  );
  if (paErr) throw paErr;
  console.log(`  ✔ ${seedPartners.length} partenaires`);

  // ============================================================
  // Paramètres du site (upsert par key)
  // ============================================================
  for (const s of seedSettings) {
    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .eq("key", s.key)
      .maybeSingle();
    if (existing) {
      await supabase
        .from("site_settings")
        .update({ value: s.value, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase.from("site_settings").insert({ key: s.key, value: s.value });
    }
  }
  console.log(`  ✔ ${seedSettings.length} paramètres du site`);

  console.log("\n✅ Seed terminé avec succès !");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed échoué :", err);
  process.exit(1);
});
