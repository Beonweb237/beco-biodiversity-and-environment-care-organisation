import { createApp } from "./app.js";
import { env } from "./lib/env.js";

// ============================================================
// Démarrage du serveur (local / production Node)
// ============================================================
const app = createApp();
app.listen(env.port, () => {
  console.log(`[BECO] Serveur Express démarré sur http://localhost:${env.port}`);
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    console.warn("[BECO] ⚠ SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY non configurés dans .env");
  }
});
