// Génère public/assets-manifest.json avec la liste des images du thème
// (/assets/**). Exécuté avant vite build : le manifeste est copié dans
// dist/public et peut ensuite être lu par l'API (la galerie admin).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "../public");
const assetsDir = path.join(publicDir, "assets");
const outFile = path.join(publicDir, "assets-manifest.json");

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".avif"]);

function isImage(name) {
  return IMAGE_EXT.has(path.extname(name).toLowerCase());
}

function walk(dir, prefix, acc) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      walk(full, rel, acc);
    } else if (isImage(entry.name)) {
      acc.push(`/assets/${rel.replaceAll("\\", "/")}`);
    }
  }
}

if (!fs.existsSync(assetsDir)) {
  fs.writeFileSync(outFile, "[]");
  console.log("[assets-manifest] dossier public/assets introuvable, manifeste vide");
  process.exit(0);
}

const urls = [];
walk(assetsDir, "", urls);
urls.sort();

// Manifeste statique (lisible par l'API si besoin)
fs.writeFileSync(outFile, JSON.stringify(urls));

// Module TS importé par la galerie admin (déterministe, aucun FS au runtime)
const tsOut = path.resolve(__dirname, "../src/lib/generated-assets.ts");
const tsContent =
  "// FICHIER GÉNÉRÉ par scripts/generate-assets-manifest.mjs — ne pas modifier.\n" +
  "// Images locales du thème (/assets/**) utilisées par la galerie admin.\n" +
  `export const LOCAL_ASSETS: string[] = ${JSON.stringify(urls)};\n`;
fs.writeFileSync(tsOut, tsContent);

console.log(`[assets-manifest] ${urls.length} image(s) -> public/assets-manifest.json + src/lib/generated-assets.ts`);
