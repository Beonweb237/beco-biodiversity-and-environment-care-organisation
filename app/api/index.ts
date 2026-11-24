// ============================================================
// Fonction serverless Vercel — API Express
// Capture toutes les routes /api/* et les sert via Express.
// Le frontend statique (dist/public) est servi séparément par le CDN.
// ============================================================
import { createApp } from "../server/app.js";

export default createApp();
