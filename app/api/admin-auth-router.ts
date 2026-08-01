import { z } from "zod";
import { createRouter, publicQuery } from "./middleware.js";
import { getDb } from "./queries/connection.js";
import { adminUsers } from "@db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("ADMIN_JWT_SECRET environment variable is required");
}

function signToken(userId: number): string {
  return jwt.sign({ sub: userId, type: "admin" }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): { sub: number; type: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as unknown as { sub: number; type: string };
  } catch {
    return null;
  }
}

// Rate limiting for login attempts
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const attemptCache = new Map<string, { count: number; lockedUntil: number }>();

function getClientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("cf-connecting-ip") || "unknown";
}

export const adminAuthRouter = createRouter({
  login: publicQuery
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const ip = getClientIp(ctx.req);
      const now = Date.now();

      // Check rate limit
      const cached = attemptCache.get(ip);
      if (cached && cached.lockedUntil > now) {
        const remaining = Math.ceil((cached.lockedUntil - now) / 60000);
        return { success: false, error: `Trop de tentatives. Réessayez dans ${remaining} minute(s).` };
      }

      const db = getDb();
      const [user] = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.username, input.username))
        .limit(1);

      if (!user || !user.isActive) {
        return { success: false, error: "Identifiants invalides" };
      }

      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) {
        // Increment attempt counter
        const entry = attemptCache.get(ip);
        if (entry) {
          entry.count++;
          if (entry.count >= MAX_ATTEMPTS) {
            entry.lockedUntil = now + LOCKOUT_DURATION_MS;
            entry.count = 0;
          }
        } else {
          attemptCache.set(ip, { count: 1, lockedUntil: 0 });
        }
        return { success: false, error: "Identifiants invalides" };
      }

      // Reset on success
      attemptCache.delete(ip);

      const token = signToken(user.id);

      return {
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      };
    }),

  me: publicQuery.query(async ({ ctx }) => {
    const authHeader = ctx.req.headers.get("x-admin-token");
    if (!authHeader) return null;

    const decoded = verifyAdminToken(authHeader);
    if (!decoded) return null;

    const db = getDb();
    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, decoded.sub))
      .limit(1);

    if (!user || !user.isActive) return null;

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }),
});
