import { authRouter } from "./auth-router.js";
import { adminAuthRouter } from "./admin-auth-router.js";
import { adminRouter } from "./admin-router.js";
import { createRouter, publicQuery } from "./middleware.js";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  adminAuth: adminAuthRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
