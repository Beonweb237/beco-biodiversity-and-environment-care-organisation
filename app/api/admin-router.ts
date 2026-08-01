import { z } from "zod";
import { createRouter, publicQuery } from "./middleware.js";
import { getDb } from "./queries/connection.js";
import {
  projects,
  news,
  teamMembers,
  focusAreas,
  contactMessages,
  siteSettings,
  adminUsers,
  activityLogs,
  volunteerApplications,
} from "@db/schema";
import { eq, desc, count, and, gte, lte } from "drizzle-orm";
import { verifyAdminToken } from "./admin-auth-router.js";
import { logActivity } from "./lib/activity-logger.js";
import fs from "fs";
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
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const [result] = await db.insert(projects).values(input).$returningId();
      logActivity({ adminUserId: ctx.adminUser.id, adminName: ctx.adminUser.name, action: "create", entity: "project", entityId: result.id, details: `Projet « ${input.title} » créé` });
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
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(projects).set(data).where(eq(projects.id, id));
      logActivity({ adminUserId: ctx.adminUser.id, adminName: ctx.adminUser.name, action: "update", entity: "project", entityId: id, details: `Projet « ${input.title} » modifié` });
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const [item] = await db.select({ title: projects.title }).from(projects).where(eq(projects.id, input.id)).limit(1);
      await db.delete(projects).where(eq(projects.id, input.id));
      logActivity({ adminUserId: ctx.adminUser.id, adminName: ctx.adminUser.name, action: "delete", entity: "project", entityId: input.id, details: `Projet « ${item?.title || "Inconnu"} » supprimé` });
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
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const [result] = await db.insert(news).values(input).$returningId();
      logActivity({ adminUserId: ctx.adminUser.id, adminName: ctx.adminUser.name, action: "create", entity: "news", entityId: result.id, details: `Actualité « ${input.title} » créée` });
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
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(news).set(data).where(eq(news.id, id));
      logActivity({ adminUserId: ctx.adminUser.id, adminName: ctx.adminUser.name, action: "update", entity: "news", entityId: id, details: `Actualité « ${input.title} » modifiée` });
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const [item] = await db.select({ title: news.title }).from(news).where(eq(news.id, input.id)).limit(1);
      await db.delete(news).where(eq(news.id, input.id));
      logActivity({ adminUserId: ctx.adminUser.id, adminName: ctx.adminUser.name, action: "delete", entity: "news", entityId: input.id, details: `Actualité « ${item?.title || "Inconnue"} » supprimée` });
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
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const [result] = await db.insert(teamMembers).values(input).$returningId();
      logActivity({ adminUserId: ctx.adminUser.id, adminName: ctx.adminUser.name, action: "create", entity: "team_member", entityId: result.id, details: `Membre « ${input.name} » créé` });
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
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(teamMembers).set(data).where(eq(teamMembers.id, id));
      logActivity({ adminUserId: ctx.adminUser.id, adminName: ctx.adminUser.name, action: "update", entity: "team_member", entityId: id, details: `Membre « ${input.name} » modifié` });
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const [item] = await db.select({ name: teamMembers.name }).from(teamMembers).where(eq(teamMembers.id, input.id)).limit(1);
      await db.delete(teamMembers).where(eq(teamMembers.id, input.id));
      logActivity({ adminUserId: ctx.adminUser.id, adminName: ctx.adminUser.name, action: "delete", entity: "team_member", entityId: input.id, details: `Membre « ${item?.name || "Inconnu"} » supprimé` });
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

  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [item] = await db.select().from(focusAreas).where(eq(focusAreas.id, input.id)).limit(1);
      return item || null;
    }),

  create: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().min(1),
      image: z.string().optional(),
      order: z.number().default(0),
      isPublished: z.boolean().default(true),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const [result] = await db.insert(focusAreas).values(input).$returningId();
      logActivity({ adminUserId: ctx.adminUser.id, adminName: ctx.adminUser.name, action: "create", entity: "focus_area", entityId: result.id, details: `Domaine « ${input.title} » créé` });
      return { id: result.id, success: true };
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1),
      slug: z.string().optional(),
      description: z.string().min(1),
      image: z.string().optional(),
      order: z.number().default(0),
      isPublished: z.boolean().default(true),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(focusAreas).set(data).where(eq(focusAreas.id, id));
      logActivity({ adminUserId: ctx.adminUser.id, adminName: ctx.adminUser.name, action: "update", entity: "focus_area", entityId: id, details: `Domaine « ${input.title} » modifié` });
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const [item] = await db.select({ title: focusAreas.title }).from(focusAreas).where(eq(focusAreas.id, input.id)).limit(1);
      await db.delete(focusAreas).where(eq(focusAreas.id, input.id));
      logActivity({ adminUserId: ctx.adminUser.id, adminName: ctx.adminUser.name, action: "delete", entity: "focus_area", entityId: input.id, details: `Domaine « ${item?.title || "Inconnu"} » supprimé` });
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
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      await db.update(contactMessages).set({ isRead: true }).where(eq(contactMessages.id, input.id));
      logActivity({ adminUserId: ctx.adminUser.id, adminName: ctx.adminUser.name, action: "mark_read", entity: "contact_message", entityId: input.id, details: "Message marqué comme lu" });
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const [item] = await db.select({ name: contactMessages.firstName }).from(contactMessages).where(eq(contactMessages.id, input.id)).limit(1);
      await db.delete(contactMessages).where(eq(contactMessages.id, input.id));
      logActivity({ adminUserId: ctx.adminUser.id, adminName: ctx.adminUser.name, action: "delete", entity: "contact_message", entityId: input.id, details: `Message de ${item?.name || "Inconnu"} supprimé` });
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
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      await db.update(siteSettings).set({ value: input.value }).where(eq(siteSettings.key, input.key));
      logActivity({ adminUserId: ctx.adminUser.id, adminName: ctx.adminUser.name, action: "update", entity: "site_setting", details: `Paramètre « ${input.key} » mis à jour` });
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
    .mutation(async ({ input, ctx }) => {
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
      logActivity({ adminUserId: ctx.adminUser.id, adminName: ctx.adminUser.name, action: "create", entity: "admin_user", entityId: result.id, details: `Admin « ${input.name} » créé (${input.role})` });
      return { id: result.id, success: true };
    }),

  toggleActive: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, input.id)).limit(1);
      if (!user) return { success: false };
      await db.update(adminUsers).set({ isActive: !user.isActive }).where(eq(adminUsers.id, input.id));
      logActivity({ adminUserId: ctx.adminUser.id, adminName: ctx.adminUser.name, action: "toggle", entity: "admin_user", entityId: input.id, details: `Admin « ${user.name} » ${user.isActive ? "désactivé" : "activé"}` });
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

  getFeaturedProjects: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(projects).where(eq(projects.isPublished, true)).orderBy(desc(projects.createdAt)).limit(3);
  }),

  getStats: publicQuery.query(async () => {
    const db = getDb();
    const [projectCount] = await db.select({ count: count() }).from(projects).where(eq(projects.isPublished, true));
    const [teamCount] = await db.select({ count: count() }).from(teamMembers).where(eq(teamMembers.isPublished, true));
    const [areaCount] = await db.select({ count: count() }).from(focusAreas).where(eq(focusAreas.isPublished, true));
    return {
      activeProjects: projectCount.count,
      yearCreated: 2025,
      domains: areaCount.count,
      teamMembers: teamCount.count,
    };
  }),

  uploadImage: publicQuery
    .input(z.object({
      name: z.string(),
      type: z.string(),
      base64: z.string(),
    }))
    .mutation(async ({ input }) => {
      const buffer = Buffer.from(input.base64, "base64");
      const sanitizedName = input.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filename = `${Date.now()}-${sanitizedName}`;
      const filePath = `public/uploads/${filename}`;
      await fs.promises.mkdir("public/uploads", { recursive: true });
      await fs.promises.writeFile(filePath, buffer);
      return { url: `/uploads/${filename}` };
    }),

  submitNewsletter: publicQuery
    .input(z.object({
      email: z.string().email(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(contactMessages).values({
        firstName: "Newsletter",
        lastName: input.email,
        email: input.email,
        subject: "Inscription newsletter",
        message: "Nouvelle inscription à la newsletter",
      });
      return { success: true };
    }),

  submitVolunteer: publicQuery
    .input(z.object({
      fullName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      interest: z.string().optional(),
      motivation: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(volunteerApplications).values(input);
      return { success: true };
    }),

  getNewsBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [article] = await db.select().from(news).where(and(eq(news.slug, input.slug), eq(news.isPublished, true))).limit(1);
      return article ?? null;
    }),
});

// ============================================================
// ACTIVITY LOGS
// ============================================================
const activityLogsRouter = createRouter({
  list: adminProcedure
    .input(z.object({
      limit: z.number().default(50),
      offset: z.number().default(0),
      entity: z.string().optional(),
      action: z.string().optional(),
    }).optional().default({}))
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];
      if (input.entity) conditions.push(eq(activityLogs.entity, input.entity));
      if (input.action) conditions.push(eq(activityLogs.action, input.action));

      const total = await db.select({ count: count() }).from(activityLogs);
      const rows = await db.select()
        .from(activityLogs)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(activityLogs.createdAt))
        .limit(input.limit)
        .offset(input.offset);
      return { rows, total: total[0]?.count ?? 0 };
    }),

  getRecent: adminProcedure
    .input(z.object({ limit: z.number().default(10) }).optional().default({}))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select()
        .from(activityLogs)
        .orderBy(desc(activityLogs.createdAt))
        .limit(input.limit);
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
  activityLogs: activityLogsRouter,
  public: publicRouter,
});
