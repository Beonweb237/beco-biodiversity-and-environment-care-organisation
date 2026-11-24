import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./env.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Recherche le dossier public (contenant index.html) sous le répertoire de
 * travail — utile en lambda Vercel où les fichiers sont préfixés par le
 * sous-dossier du projet (ex. /var/task/app/dist/public).
 */
function findPublicRoot(): string {
  const found: string[] = [];
  const queue: Array<{ dir: string; depth: number }> = [{ dir: process.cwd(), depth: 0 }];
  while (queue.length) {
    const { dir, depth } = queue.shift()!;
    if (depth > 6) continue;
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      if (entry.isDirectory()) {
        queue.push({ dir: path.join(dir, entry.name), depth: depth + 1 });
      }
    }
    try {
      if (fs.existsSync(path.join(dir, "index.html"))) found.push(dir);
    } catch {
      // ignore
    }
  }
  // Priorité à celui qui contient un dossier assets (build réel).
  found.sort((a, b) => {
    const ha = fs.existsSync(path.join(a, "assets")) ? 1 : 0;
    const hb = fs.existsSync(path.join(b, "assets")) ? 1 : 0;
    return hb - ha;
  });
  return found[0] ?? "";
}

/**
 * Résout le dossier des fichiers statiques du client (`dist/public`).
 * L'emplacement diffère selon l'environnement :
 *  - local / serveur Node : `../dist/public` (relatif à `server/`) ;
 *  - lambda Vercel : `dist/public` à la racine de la fonction (cwd) ou sous le
 *    sous-dossier projet (ex. `/var/task/app/dist/public`) ;
 *  - surcharge possible via `PUBLIC_DIR`.
 */
export function resolvePublicDir(): string {
  const candidates = [
    env.publicDir,
    path.resolve(process.cwd(), "dist/public"),
    path.resolve(process.cwd(), "app/dist/public"),
    path.resolve(__dirname, "../dist/public"),
    path.resolve(process.cwd(), "public"),
    path.resolve(process.cwd(), "app/public"),
    path.resolve(__dirname, "../public"),
  ].filter(Boolean) as string[];
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(path.join(candidate, "index.html"))) return candidate;
    } catch {
      // ignore — on passe au candidat suivant
    }
  }
  const scan = findPublicRoot();
  if (scan) return scan;
  return candidates[0] ?? path.resolve(__dirname, "../dist/public");
}
