import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, assertSupabaseConfigured } from "./env.js";

let cached: SupabaseClient | null = null;

/**
 * Client Supabase singleton (clé `service_role`), créé à la première
 * utilisation. Réservé au serveur Express : il contourne les politiques
 * RLS, donc toute l'autorisation doit vivre dans l'API.
 */
export function getSupabase(): SupabaseClient {
  assertSupabaseConfigured();
  if (!cached) {
    cached = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}

/**
 * Proxy paresseux : `supabase.from(...)` fonctionne comme le client réel.
 * Les méthodes sont liées au client sous-jacent pour préserver `this`.
 * Lève une erreur claire si Supabase n'est pas configuré.
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase();
    const value = (client as any)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
