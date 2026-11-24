// ============================================================
// API formulaires publics (contact, newsletter, bénévolat, upload)
// ============================================================
import { apiFetch, getAdminToken } from "./client";
import type { UploadResponse } from "@contracts/types";

export interface ContactInput {
  firstName: string;
  lastName: string;
  email: string;
  subject?: string;
  type?: string;
  message: string;
}

export function submitContact(input: ContactInput) {
  return apiFetch<{ success: boolean }>("/forms/contact", {
    method: "POST",
    body: input,
  });
}

export function submitNewsletter(email: string) {
  return apiFetch<{ success: boolean }>("/forms/newsletter", {
    method: "POST",
    body: { email },
  });
}

export interface VolunteerInput {
  fullName: string;
  email: string;
  phone?: string;
  interest?: string;
  motivation?: string;
}

export function submitVolunteer(input: VolunteerInput) {
  return apiFetch<{ success: boolean }>("/forms/volunteer", {
    method: "POST",
    body: input,
  });
}

export interface UploadImageInput {
  name: string;
  type: string;
  base64: string;
}

export async function uploadImage(input: UploadImageInput): Promise<UploadResponse> {
  const token = getAdminToken();
  const res = await fetch(`/api/forms/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "x-admin-token": token } : {}),
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Upload échoué");
  }
  return res.json();
}

// ============================================================
// Galerie d'images (admin) — liste des images du bucket Supabase
// ============================================================
export interface GalleryImage {
  name: string;
  url: string;
  createdAt?: string | null;
}

export async function listGalleryImages(): Promise<GalleryImage[]> {
  const token = getAdminToken();
  const res = await fetch(`/api/forms/images`, {
    method: "GET",
    headers: {
      ...(token ? { "x-admin-token": token } : {}),
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Impossible de charger la galerie");
  }
  return res.json();
}

export async function deleteGalleryImage(name: string): Promise<{ success: boolean }> {
  const token = getAdminToken();
  const res = await fetch(`/api/forms/images/${encodeURIComponent(name)}`, {
    method: "DELETE",
    headers: {
      ...(token ? { "x-admin-token": token } : {}),
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Suppression impossible");
  }
  return res.json();
}

