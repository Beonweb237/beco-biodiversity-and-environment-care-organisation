import { getDb } from "../queries/connection.js";
import { activityLogs } from "@db/schema";

export interface ActivityLogPayload {
  adminUserId: number;
  adminName: string;
  action: "create" | "update" | "delete" | "login" | "logout" | "toggle" | "mark_read" | "export";
  entity: "project" | "news" | "team_member" | "focus_area" | "contact_message" | "site_setting" | "admin_user";
  entityId?: number;
  details?: string;
}

export async function logActivity(payload: ActivityLogPayload) {
  try {
    const db = getDb();
    await db.insert(activityLogs).values({
      adminUserId: payload.adminUserId,
      adminName: payload.adminName,
      action: payload.action,
      entity: payload.entity,
      entityId: payload.entityId ?? null,
      details: payload.details ?? null,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
