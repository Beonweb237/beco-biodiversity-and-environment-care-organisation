import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { adminUsers } from "@db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "beco-admin-secret-key-2026";

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

export const adminAuthRouter = createRouter({
  login: publicQuery
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
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
        return { success: false, error: "Identifiants invalides" };
      }

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
