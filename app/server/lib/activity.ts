import { supabase } from "./supabase.js";

export interface ActivityInput {
  adminUserId: number;
  adminName: string;
  action: string;
  entity: string;
  entityId?: number | null;
  details?: string | null;
}

/** Enregistre une action admin dans la table `activity_logs`. */
export async function logActivity(input: ActivityInput): Promise<void> {
  try {
    await supabase.from("activity_logs").insert({
      admin_user_id: input.adminUserId,
      admin_name: input.adminName,
      action: input.action,
      entity: input.entity,
      entity_id: input.entityId ?? null,
      details: input.details ?? null,
    });
  } catch (err) {
    // Le log ne doit jamais faire échouer l'opération principale.
    console.error("Failed to log activity:", err);
  }
}
