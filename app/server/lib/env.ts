import "dotenv/config";

function optional(name: string): string {
  return process.env[name] ?? "";
}

export const env = {
  isProduction: process.env.NODE_ENV === "production",
  port: parseInt(process.env.PORT || "3001", 10),

  // Supabase
  supabaseUrl: optional("SUPABASE_URL"),
  supabaseAnonKey: optional("SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: optional("SUPABASE_SERVICE_ROLE_KEY"),
  supabaseBucket: optional("SUPABASE_BUCKET") || "beco-images",

  // Auth admin
  adminJwtSecret: optional("ADMIN_JWT_SECRET") || "beco-admin-secret-change-me",

  // Divers
  uploadsDir: optional("UPLOADS_DIR") || "public/uploads",
  publicUrlPrefix: optional("PUBLIC_URL_PREFIX") || "", // ex: https://beco.org
  publicDir: optional("PUBLIC_DIR"), // ex: dist/public (surcharge Vercel)
  siteUrl: optional("SITE_URL") || "http://localhost:3000",
} as const;

/** Vérifie que Supabase est configuré avant d'exécuter des requêtes. */
export function assertSupabaseConfigured(): void {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    throw new Error(
      "Supabase n'est pas configuré. Renseignez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans le fichier .env",
    );
  }
}
