import type { NextFunction, Request, Response } from "express";
import { supabase } from "../lib/supabase.js";
import { verifyAdminToken } from "../lib/jwt.js";
import { mapAdminUser } from "../lib/serialize.js";
import type { AdminUserDto } from "@contracts/types";

// ============================================================
// Middleware d'authentification admin (JWT dans x-admin-token)
// ============================================================
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers["x-admin-token"];
    if (!token || Array.isArray(token)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const decoded = verifyAdminToken(token);
    if (!decoded) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", decoded.sub)
      .maybeSingle();

    if (error || !data || !data.is_active) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user: AdminUserDto = mapAdminUser(data);
    (req as any).adminUser = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export function getAdminUser(req: Request): AdminUserDto {
  return (req as any).adminUser as AdminUserDto;
}
