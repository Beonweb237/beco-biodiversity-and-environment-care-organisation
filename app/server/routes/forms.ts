import { Router } from "express";
import { supabase } from "../lib/supabase.js";
import { requireAdmin } from "../middleware/auth.js";
import { deleteBucketImage, listBucketImages, uploadToBucket } from "../lib/storage.js";

export const formsRouter = Router();

// ============================================================
// FORMULAIRE DE CONTACT
// ============================================================
formsRouter.post("/contact", async (req, res) => {
  const { firstName, lastName, email, subject, type, message } = req.body ?? {};
  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: "Champs obligatoires manquants" });
  }
  const { error } = await supabase.from("contact_messages").insert({
    first_name: String(firstName),
    last_name: String(lastName),
    email: String(email),
    subject: subject ? String(subject) : null,
    type: type ? String(type) : null,
    message: String(message),
  });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ============================================================
// NEWSLETTER
// ============================================================
formsRouter.post("/newsletter", async (req, res) => {
  const { email } = req.body ?? {};
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email requis" });
  }
  const { error } = await supabase.from("contact_messages").insert({
    first_name: "Newsletter",
    last_name: email,
    email,
    subject: "Inscription newsletter",
    message: "Nouvelle inscription à la newsletter",
  });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ============================================================
// CANDIDATURE BÉNÉVOLAT
// ============================================================
formsRouter.post("/volunteer", async (req, res) => {
  const { fullName, email, phone, interest, motivation } = req.body ?? {};
  if (!fullName || !email) {
    return res.status(400).json({ error: "Champs obligatoires manquants" });
  }
  const { error } = await supabase.from("volunteer_applications").insert({
    full_name: String(fullName),
    email: String(email),
    phone: phone ? String(phone) : null,
    interest: interest ? String(interest) : null,
    motivation: motivation ? String(motivation) : null,
  });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ============================================================
// UPLOAD D'IMAGE (réservé à l'admin)
// ============================================================
formsRouter.post("/upload", requireAdmin, async (req, res) => {
  try {
    const { name, type, base64 } = req.body ?? {};
    if (!name || !base64) {
      return res.status(400).json({ error: "name et base64 requis" });
    }
    const buffer = Buffer.from(String(base64), "base64");
    const sanitizedName = String(name).replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${Date.now()}-${sanitizedName}`;
    const url = await uploadToBucket(
      buffer,
      filename,
      type ? String(type) : undefined,
    );
    res.json({ url });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Upload failed" });
  }
});

// ============================================================
// GALERIE — liste des images du bucket (réservé à l'admin)
// ============================================================
formsRouter.get("/images", requireAdmin, async (_req, res) => {
  try {
    const images = await listBucketImages(200);
    res.json(images);
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Erreur lors du chargement de la galerie" });
  }
});

// ============================================================
// GALERIE — suppression d'une image du bucket (réservé à l'admin)
// ============================================================
formsRouter.delete("/images/:name", requireAdmin, async (req, res) => {
  try {
    const name = String(req.params.name ?? "");
    if (!name) {
      return res.status(400).json({ error: "Nom d'image manquant" });
    }
    await deleteBucketImage(name);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Erreur lors de la suppression" });
  }
});

