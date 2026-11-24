import jwt from "jsonwebtoken";
import { env } from "./env.js";

export interface AdminTokenPayload {
  sub: number;
  type: "admin";
}

export function signAdminToken(userId: number): string {
  return jwt.sign({ sub: userId, type: "admin" }, env.adminJwtSecret, {
    expiresIn: "7d",
  });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const decoded = jwt.verify(token, env.adminJwtSecret);
    return decoded as unknown as AdminTokenPayload;
  } catch {
    return null;
  }
}
