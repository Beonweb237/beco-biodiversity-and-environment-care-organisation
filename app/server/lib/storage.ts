import { supabase } from "./supabase.js";
import { env } from "./env.js";

const BUCKET = env.supabaseBucket;

/**
 * Crée le bucket Supabase Storage s'il n'existe pas (bucket public,
 * les fichiers sont directement accessibles via une URL).
 */
export async function ensureBucket(): Promise<void> {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (buckets?.some((b) => b.name === BUCKET)) return;
  const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
  if (error) throw error;
}

/**
 * Uploade un buffer dans le bucket et renvoie l'URL publique du fichier.
 */
export async function uploadToBucket(
  buffer: Buffer,
  filename: string,
  contentType?: string,
): Promise<string> {
  await ensureBucket();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, buffer, {
      contentType: contentType || "application/octet-stream",
      upsert: true,
    });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}

/**
 * Une image du bucket (galerie admin).
 */
export interface BucketImage {
  name: string;
  url: string;
  createdAt?: string | null;
}

/**
 * Liste les images présentes dans le bucket (les plus récentes d'abord)
 * et renvoie leurs URLs publiques.
 */
export async function listBucketImages(limit = 200): Promise<BucketImage[]> {
  await ensureBucket();
  const { data, error } = await supabase.storage.from(BUCKET).list("", {
    limit,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error) throw error;
  return (data ?? [])
    .filter((f) => f.name && !f.name.endsWith("/") && !f.name.startsWith("."))
    .map((f) => {
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(f.name);
      return { name: f.name, url: pub.publicUrl, createdAt: f.created_at ?? null };
    });
}

/**
 * Supprime une image du bucket.
 */
export async function deleteBucketImage(filename: string): Promise<void> {
  await ensureBucket();
  const { error } = await supabase.storage.from(BUCKET).remove([filename]);
  if (error) throw error;
}
