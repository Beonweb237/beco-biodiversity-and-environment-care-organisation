import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import {
  projects,
  news,
  teamMembers,
  focusAreas,
  contactMessages,
  siteSettings,
  adminUsers,
} from "@db/schema";
import { eq, desc, count } from "drizzle-orm";
import { verifyAdminToken } from "./admin-auth-router";
import bcrypt from "bcryptjs";

// Helper to verify admin token from context
async function getAdminFromContext(req: Request) {
  const token = req.headers.get("x-admin-token");
  if (!token) return null;
  const decoded = verifyAdminToken(token);
  if (!decoded) return null;
  const db = getDb();
  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, decoded.sub)).limit(1);
  return user && user.isActive ? user : null;
}

// Admin procedure middleware
const adminProcedure = publicQuery.use(async (opts) => {
  const admin = await getAdminFromContext(opts.ctx.req);
  if (!admin) {
    throw new Error("Unauthorized");
  }
  return opts.next({ ctx: { ...opts.ctx, adminUser: admin } });
});

// ============================================================
// DASHBOARD STATS
// ============================================================
const statsRouter = createRouter({
  get: adminProcedure.query(async () => {
    const db = getDb();
    const [projectCount] = await db.select({ count: count() }).from(projects);
    const [newsCount] = await db.select({ count: count() }).from(news);
    const [teamCount] = await db.select({ count: count() }).from(teamMembers);
    const [messageCount] = await db.select({ count: count() }).from(contactMessages);
    const [unreadCount] = await db.select({ count: count() }).from(contactMessages).where(eq(contactMessages.isRead, false));
    const [areaCount] = await db.select({ count: count() }).from(focusAreas);

    return {
      projects: projectCount.count,
      news: newsCount.count,
      team: teamCount.count,
      messages: messageCount.count,
      unreadMessages: unreadCount.count,
      focusAreas: areaCount.count,
    };
  }),
});

// ============================================================
// PROJECTS CRUD
// ============================================================
const projectsRouter = createRouter({
  list: adminProcedure.query(async () => {
    const db = getDb();
    return db.select().from(projects).orderBy(desc(projects.createdAt));
  }),

  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [item] = await db.select().from(projects).where(eq(projects.id, input.id)).limit(1);
      return item || null;
    }),

  create: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      tag: z.string().min(1),
      date: z.string().optional(),
      description: z.string().min(1),
      image: z.string().optional(),
      details: z.string().optional(),
      funder: z.string().optional(),
      category: z.string().optional(),
      isPublished: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(projects).values(input).$returningId();
      return { id: result.id, success: true };
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1),
      slug: z.string().min(1),
      tag: z.string().min(1),
      date: z.string().optional(),
      description: z.string().min(1),
      image: z.string().optional(),
      details: z.string().optional(),
      funder: z.string().optional(),
      category: z.string().optional(),
      isPublished: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(projects).set(data).where(eq(projects.id, id));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(projects).where(eq(projects.id, input.id));
      return { success: true };
    }),
});

// ============================================================
// NEWS CRUD
// ============================================================
const newsRouter = createRouter({
  list: adminProcedure.query(async () => {
    const db = getDb();
    return db.select().from(news).orderBy(desc(news.createdAt));
  }),

  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [item] = await db.select().from(news).where(eq(news.id, input.id)).limit(1);
      return item || null;
    }),

  create: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      excerpt: z.string().min(1),
      content: z.string().optional(),
      tag: z.string().min(1),
      date: z.string().optional(),
      image: z.string().optional(),
      category: z.string().optional(),
      isPublished: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(news).values(input).$returningId();
      return { id: result.id, success: true };
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1),
      slug: z.string().min(1),
      excerpt: z.string().min(1),
      content: z.string().optional(),
      tag: z.string().min(1),
      date: z.string().optional(),
      image: z.string().optional(),
      category: z.string().optional(),
      isPublished: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(news).set(data).where(eq(news.id, id));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(news).where(eq(news.id, input.id));
      return { success: true };
    }),
});

// ============================================================
// TEAM MEMBERS CRUD
// ============================================================
const teamRouter = createRouter({
  list: adminProcedure.query(async () => {
    const db = getDb();
    return db.select().from(teamMembers).orderBy(teamMembers.order);
  }),

  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [item] = await db.select().from(teamMembers).where(eq(teamMembers.id, input.id)).limit(1);
      return item || null;
    }),

  create: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      role: z.string().min(1),
      status: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
      linkedin: z.string().optional(),
      email: z.string().optional(),
      order: z.number().default(0),
      isPublished: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(teamMembers).values(input).$returningId();
      return { id: result.id, success: true };
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1),
      role: z.string().min(1),
      status: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
      linkedin: z.string().optional(),
      email: z.string().optional(),
      order: z.number().default(0),
      isPublished: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(teamMembers).set(data).where(eq(teamMembers.id, id));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(teamMembers).where(eq(teamMembers.id, input.id));
      return { success: true };
    }),
});

// ============================================================
// FOCUS AREAS CRUD
// ============================================================
const focusAreasRouter = createRouter({
  list: adminProcedure.query(async () => {
    const db = getDb();
    return db.select().from(focusAreas).orderBy(focusAreas.order);
  }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1),
      description: z.string().min(1),
      image: z.string().optional(),
      order: z.number().default(0),
      isPublished: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(focusAreas).set(data).where(eq(focusAreas.id, id));
      return { success: true };
    }),
});

// ============================================================
// CONTACT MESSAGES
// ============================================================
const messagesRouter = createRouter({
  list: adminProcedure.query(async () => {
    const db = getDb();
    return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }),

  markRead: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(contactMessages).set({ isRead: true }).where(eq(contactMessages.id, input.id));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(contactMessages).where(eq(contactMessages.id, input.id));
      return { success: true };
    }),
});

// ============================================================
// SITE SETTINGS
// ============================================================
const settingsRouter = createRouter({
  list: adminProcedure.query(async () => {
    const db = getDb();
    return db.select().from(siteSettings);
  }),

  update: adminProcedure
    .input(z.object({
      key: z.string(),
      value: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(siteSettings).set({ value: input.value }).where(eq(siteSettings.key, input.key));
      return { success: true };
    }),
});

// ============================================================
// ADMIN USERS MANAGEMENT
// ============================================================
const adminUsersRouter = createRouter({
  list: adminProcedure.query(async () => {
    const db = getDb();
    return db.select({
      id: adminUsers.id,
      username: adminUsers.username,
      name: adminUsers.name,
      email: adminUsers.email,
      role: adminUsers.role,
      isActive: adminUsers.isActive,
      createdAt: adminUsers.createdAt,
    }).from(adminUsers);
  }),

  create: adminProcedure
    .input(z.object({
      username: z.string().min(3),
      password: z.string().min(4),
      name: z.string().min(1),
      email: z.string().email().optional(),
      role: z.enum(["admin", "superadmin"]).default("admin"),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const passwordHash = await bcrypt.hash(input.password, 10);
      const [result] = await db.insert(adminUsers).values({
        username: input.username,
        passwordHash,
        name: input.name,
        email: input.email,
        role: input.role,
        isActive: true,
      }).$returningId();
      return { id: result.id, success: true };
    }),

  toggleActive: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, input.id)).limit(1);
      if (!user) return { success: false };
      await db.update(adminUsers).set({ isActive: !user.isActive }).where(eq(adminUsers.id, input.id));
      return { success: true };
    }),
});

// ============================================================
// PUBLIC ENDPOINTS (for frontend contact form etc.)
// ============================================================
const publicRouter = createRouter({
  submitContact: publicQuery
    .input(z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      subject: z.string().optional(),
      type: z.string().optional(),
      message: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(contactMessages).values(input);
      return { success: true };
    }),

  getPublishedProjects: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(projects).where(eq(projects.isPublished, true)).orderBy(desc(projects.createdAt));
  }),

  getPublishedNews: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(news).where(eq(news.isPublished, true)).orderBy(desc(news.createdAt));
  }),

  getPublishedTeam: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(teamMembers).where(eq(teamMembers.isPublished, true)).orderBy(teamMembers.order);
  }),

  getPublishedFocusAreas: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(focusAreas).where(eq(focusAreas.isPublished, true)).orderBy(focusAreas.order);
  }),

  getSettings: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(siteSettings);
  }),
});

export const adminRouter = createRouter({
  stats: statsRouter,
  projects: projectsRouter,
  news: newsRouter,
  team: teamRouter,
  focusAreas: focusAreasRouter,
  messages: messagesRouter,
  settings: settingsRouter,
  users: adminUsersRouter,
  public: publicRouter,
});
