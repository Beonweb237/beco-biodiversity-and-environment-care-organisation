// ============================================================
// Seed du contenu de pages éditable (site_settings)
// Copie les textes actuels des fichiers de langue (src/locales/*.json)
// vers les clés structurées `content:<page>:<section>:<lang>`,
// pour préserver les traductions existantes comme base éditable.
//
// Usage : node --experimental-strip-types scripts/seed-page-content.ts
//   (ou : npx tsx scripts/seed-page-content.ts)
// ============================================================
import "dotenv/config";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { PAGE_DEFS, contentKey, CONTENT_LANGS } from "../contracts/pageContent";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("❌ SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis dans .env");
  process.exit(1);
}
const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

const HERE = dirname(fileURLToPath(import.meta.url));
const LOCALE_DIR = join(HERE, "..", "src", "locales");

function loadLocale(lang: string): Record<string, unknown> {
  const raw = readFileSync(join(LOCALE_DIR, `${lang}.json`), "utf-8");
  return JSON.parse(raw);
}

/** Navigue un chemin i18n (ex "about.story.p1") dans l'objet JSON d'une langue. */
function lookup(obj: Record<string, unknown>, path: string): string {
  let cur: unknown = obj;
  for (const seg of path.split(".")) {
    if (cur && typeof cur === "object" && seg in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[seg];
    } else {
      return "";
    }
  }
  return typeof cur === "string" ? cur : "";
}

async function upsert(key: string, value: string) {
  const { data: existing } = await supabase.from("site_settings").select("id").eq("key", key).maybeSingle();
  if (existing) {
    const { error } = await supabase.from("site_settings").update({ value, updated_at: new Date().toISOString() }).eq("key", key);
    if (error) throw new Error(`update ${key}: ${error.message}`);
  } else {
    const { error } = await supabase.from("site_settings").insert({ key, value });
    if (error) throw new Error(`insert ${key}: ${error.message}`);
  }
}

async function main() {
  const locales = Object.fromEntries(CONTENT_LANGS.map((l) => [l, loadLocale(l)])) as Record<string, Record<string, unknown>>;
  let count = 0;

  for (const page of PAGE_DEFS) {
    for (const section of page.sections) {
      for (const lang of CONTENT_LANGS) {
        const data: Record<string, string> = {};
        for (const field of section.fields) {
          data[field.key] = lookup(locales[lang], field.i18n);
        }
        const key = contentKey(page.id, section.id, lang);
        await upsert(key, JSON.stringify(data));
        count++;
      }
    }
  }
  console.log(`✅ ${count} entrées de contenu de page (re)seedées (${PAGE_DEFS.length} page(s)).`);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed page content échoué :", err);
  process.exit(1);
});
