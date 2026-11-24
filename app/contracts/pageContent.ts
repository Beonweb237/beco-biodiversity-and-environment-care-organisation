// ============================================================
// BECO — Contenus de pages éditables par langue
// Schéma partagé (front + serveur + admin) décrivant les blocs
// de contenu éditables de chaque page, pour chaque langue.
//
// Stockage : table `site_settings` (clé/valeur existante, zéro
// migration DDL) avec des clés structurées :
//   `content:<page>:<section>:<lang>` = JSON des champs
// Repli : si un champ est vide dans la langue demandée, l'API
// renvoie la valeur FRANÇAISE correspondante (langue par défaut).
// ============================================================

export const CONTENT_LANGS = ["fr", "en", "es", "de", "ar"] as const;
export type ContentLang = (typeof CONTENT_LANGS)[number];

export type ContentFieldType = "input" | "textarea";

export interface PageContentFieldDef {
  /** Nom du champ tel que stocké dans le JSON de la section. */
  key: string;
  /** Libellé affiché dans l'éditeur admin. */
  label: string;
  type: ContentFieldType;
  /** Clé i18n exacte de repli (ex: "about.story.p1"). */
  i18n: string;
  hint?: string;
}

export interface PageContentSectionDef {
  id: string;
  label: string;
  fields: PageContentFieldDef[];
}

export interface PageDef {
  id: string;
  label: string;
  /** Explication courte affichée dans la liste admin. */
  description: string;
  sections: PageContentSectionDef[];
}

export const PAGE_DEFS: PageDef[] = [
  {
    id: "about",
    label: "À propos",
    description: "Histoire, mission/vision/valeurs, en-tête équipe.",
    sections: [
      {
        id: "header",
        label: "En-tête de page",
        fields: [
          { key: "pageTitle", label: "Titre de la page", type: "input", i18n: "about.pageTitle" },
        ],
      },
      {
        id: "story",
        label: "Notre histoire",
        fields: [
          { key: "label", label: "Sur-titre", type: "input", i18n: "about.story.label" },
          { key: "title", label: "Titre", type: "input", i18n: "about.story.title" },
          { key: "p1", label: "Paragraphe 1", type: "textarea", i18n: "about.story.p1" },
          { key: "p2", label: "Paragraphe 2", type: "textarea", i18n: "about.story.p2" },
          { key: "p3", label: "Paragraphe 3", type: "textarea", i18n: "about.story.p3" },
        ],
      },
      {
        id: "mvv",
        label: "Mission / Vision / Valeurs",
        fields: [
          { key: "label", label: "Sur-titre", type: "input", i18n: "about.mvv.label" },
          { key: "title", label: "Titre", type: "input", i18n: "about.mvv.title" },
          { key: "mission", label: "Mission — titre", type: "input", i18n: "about.mvv.mission" },
          { key: "missionText", label: "Mission — texte", type: "textarea", i18n: "about.mvv.missionText" },
          { key: "vision", label: "Vision — titre", type: "input", i18n: "about.mvv.vision" },
          { key: "visionText", label: "Vision — texte", type: "textarea", i18n: "about.mvv.visionText" },
          { key: "values", label: "Valeurs — titre", type: "input", i18n: "about.mvv.values" },
          { key: "valuesText", label: "Valeurs — texte", type: "textarea", i18n: "about.mvv.valuesText" },
        ],
      },
      {
        id: "objectives",
        label: "Objectifs (en-tête)",
        fields: [
          { key: "label", label: "Sur-titre", type: "input", i18n: "about.objectives.label" },
          { key: "title", label: "Titre", type: "input", i18n: "about.objectives.title" },
        ],
      },
      {
        id: "teamSection",
        label: "Section équipe (en-tête)",
        fields: [
          { key: "label", label: "Sur-titre", type: "input", i18n: "about.teamSection.label" },
          { key: "title", label: "Titre", type: "input", i18n: "about.teamSection.title" },
        ],
      },
    ],
  },
];

export function getPageDef(page: string): PageDef | undefined {
  return PAGE_DEFS.find((p) => p.id === page);
}

// ============================================================
// Types API
// ============================================================

/** Champ -> valeur (texte brut) pour une section donnée. */
export type ContentSectionData = Record<string, string>;

/** Réponse publique : sections fusionnées (lang demandée, repli FR). */
export interface PublicPageContentResponse {
  page: string;
  lang: string;
  sections: Record<string, ContentSectionData>;
}

/** Données brutes par langue (pour l'éditeur admin). */
export type AdminPageContentResponse = Partial<Record<ContentLang, Record<string, ContentSectionData>>>;

/** Corps d'upsert d'une section (par page/section/lang). */
export interface AdminPageContentUpsert {
  data: ContentSectionData;
}

export function contentKey(page: string, section: string, lang: string): string {
  return `content:${page}:${section}:${lang}`;
}

export function isContentKey(page: string, key: string): boolean {
  return key.startsWith(`content:${page}:`);
}

export function parseContentKey(key: string): { page: string; section: string; lang: string } | null {
  const parts = key.split(":");
  if (parts.length !== 4 || parts[0] !== "content") return null;
  return { page: parts[1], section: parts[2], lang: parts[3] };
}
