import "express-async-errors"; // forwarde les erreurs des handlers async vers le middleware d'erreur
import express from "express";
import type { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./lib/env.js";
import { publicRouter } from "./routes/public.js";
import { formsRouter } from "./routes/forms.js";
import { adminAuthRouter } from "./routes/admin-auth.js";
import { adminRouter } from "./routes/admin.js";
import { resolvePublicDir } from "./lib/public-dir.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Fabrique de l'application Express.
 * Utilisée par :
 *  - `server/index.ts` pour le démarrage local / production Node ;
 *  - `api/index.ts` comme fonction serverless Vercel.
 */
export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json({ limit: "50mb" }));

  // CORS — autorise le même-origin en dev (Vite proxy) et le site en prod.
  const allowedOrigins = [env.siteUrl, "http://localhost:3000", "http://localhost:5173"];
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
    }
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-token");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
  });

  // ============================================================
  // Routes API
  // ============================================================
  app.use("/api/public", publicRouter);
  app.use("/api/forms", formsRouter);
  app.use("/api/admin/auth", adminAuthRouter);
  app.use("/api/admin", adminRouter);

  // Fallback 404 pour l'API
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  // ============================================================
  // Gestionnaire d'erreurs global (attrape les erreurs async)
  // ============================================================
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[BECO] Erreur serveur:", message);
    res.status(500).json({ error: message || "Internal Server Error" });
  });

  // ============================================================
  // Fichiers statiques + SPA (production Node uniquement).
  // Sur Vercel, les fichiers statiques sont servis séparément par
  // le CDN : cette partie n'est atteinte que par l'API.
  // ============================================================
  const distPath = resolvePublicDir();
  if (env.isProduction) {
    app.use(
      "/uploads",
      express.static(path.resolve(process.cwd(), env.uploadsDir)),
    );
    // Fichiers statiques du client (assets, images…). Cache long pour les
    // assets hashés (Vite) afin d'éviter de refrapper la fonction à chaque visite.
    app.use(
      "/assets",
      express.static(path.join(distPath, "assets"), {
        maxAge: "1y",
        immutable: true,
      }),
    );
    app.use(express.static(distPath));

    // Fallback SPA (hors /api)
    app.get(/^(?!\/api).*/, (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Build introuvable. Lancez `npm run build`.");
      }
    });
  }

  return app;
}
