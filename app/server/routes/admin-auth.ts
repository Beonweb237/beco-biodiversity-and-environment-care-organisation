import { Router } from "express";
import bcrypt from "bcryptjs";
import { supabase } from "../lib/supabase.js";
import { signAdminToken, verifyAdminToken } from "../lib/jwt.js";
import { mapAdminUser } from "../lib/serialize.js";

export const adminAuthRouter = Router();

// ============================================================
// Anti force-brute simple (en mémoire)
// ============================================================
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; lockedUntil: number }>();

function getIp(req: import("express").Request): string {
  const fwd = req.headers["x-forwarded-for"];
  const ip = Array.isArray(fwd) ? fwd[0] : fwd;
  return ip?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
}

// ============================================================
// POST /api/admin/auth/login
// ============================================================
adminAuthRouter.post("/login", async (req, res) => {
  const { username, password } = req.body ?? {};
  if (!username || !password) {
    return res.status(400).json({ success: false, error: "Identifiants manquants" });
  }

  const ip = getIp(req);
  const now = Date.now();
  const cached = attempts.get(ip);
  if (cached && cached.lockedUntil > now) {
    const remaining = Math.ceil((cached.lockedUntil - now) / 60000);
    return res.json({ success: false, error: `Trop de tentatives. Réessayez dans ${remaining} minute(s).` });
  }

  const { data: user, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("username", String(username))
    .maybeSingle();

  if (error) return res.status(500).json({ success: false, error: "Erreur serveur" });
  if (!user || !user.is_active) {
    return res.json({ success: false, error: "Identifiants invalides" });
  }

  const valid = await bcrypt.compare(String(password), user.password_hash);
  if (!valid) {
    const entry = attempts.get(ip);
    if (entry) {
      entry.count++;
      if (entry.count >= MAX_ATTEMPTS) {
        entry.lockedUntil = now + LOCKOUT_MS;
        entry.count = 0;
      }
    } else {
      attempts.set(ip, { count: 1, lockedUntil: 0 });
    }
    return res.json({ success: false, error: "Identifiants invalides" });
  }

  attempts.delete(ip);
  const token = signAdminToken(user.id);
  res.json({ success: true, token, user: mapAdminUser(user) });
});

// ============================================================
// GET /api/admin/auth/me
// ============================================================
adminAuthRouter.get("/me", async (req, res) => {
  const authHeader = req.headers["x-admin-token"];
  if (!authHeader || Array.isArray(authHeader)) {
    return res.json(null);
  }
  const decoded = verifyAdminToken(authHeader);
  if (!decoded) return res.json(null);

  const { data: user } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", decoded.sub)
    .maybeSingle();

  if (!user || !user.is_active) return res.json(null);
  res.json(mapAdminUser(user));
});
