import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Save, Languages } from "lucide-react";
import { getPageDef, CONTENT_LANGS, type ContentSectionData } from "@contracts/pageContent";
import { useAdminPageContent, useSavePageSection } from "@/lib/api/admin";
import { ToastContainer, type ToastData, type ToastType } from "./AdminToast";

const langFlags: Record<string, string> = {
  fr: "🇫🇷 Français",
  en: "🇬🇧 English",
  es: "🇪🇸 Español",
  de: "🇩🇪 Deutsch",
  ar: "🇸🇦 العربية",
};

export default function AdminPageContentEdit() {
  const { pageId = "" } = useParams();
  const def = getPageDef(pageId);

  const [lang, setLang] = useState<string>("fr");
  const [form, setForm] = useState<Record<string, ContentSectionData>>({});
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [saving, setSaving] = useState(false);

  const { data: raw } = useAdminPageContent(pageId);
  const saveMut = useSavePageSection();

  const addToast = (type: ToastType, message: string) => {
    const tid = crypto.randomUUID();
    setToasts((prev) => [...prev, { id: tid, type, message }]);
  };
  const dismissToast = (tid: string) => setToasts((prev) => prev.filter((t) => t.id !== tid));

  // Pré-remplit le formulaire pour la langue active quand les données brutes arrivent.
  const langData = useMemo(() => (raw && lang in raw ? raw[lang as keyof typeof raw] ?? {} : {}), [raw, lang]);

  useEffect(() => {
    if (!def) return;
    const next: Record<string, ContentSectionData> = {};
    for (const section of def.sections) {
      const existing = langData[section.id] ?? {};
      next[section.id] = {};
      for (const field of section.fields) {
        next[section.id][field.key] = existing[field.key] ?? "";
      }
    }
    setForm(next);
  }, [def, lang, langData]);

  if (!def) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-400 text-sm">Page inconnue.</p>
        <Link to="/administrateur/pages" className="mt-4 inline-flex items-center gap-2 text-sm text-beco-primary hover:underline">
          <ArrowLeft className="w-4 h-4" /> Retour aux pages
        </Link>
      </div>
    );
  }

  const BASE = "/administrateur/pages";

  const setField = (sectionId: string, fieldKey: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [sectionId]: { ...(prev[sectionId] ?? {}), [fieldKey]: value },
    }));
  };

  const save = async () => {
    if (!def) return;
    setSaving(true);
    try {
      for (const section of def.sections) {
        const data = form[section.id] ?? {};
        // N'envoie que les champs vides en tant que "" afin de forcer le repli FR.
        await saveMut.mutateAsync({ page: def.id, section: section.id, lang, data });
      }
      addToast("success", "Contenu enregistré (repli français si champ vide).");
    } catch {
      addToast("error", "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-[900px]">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <div className="flex items-center justify-between">
        <div>
          <Link to={BASE} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-beco-primary">
            <ArrowLeft className="w-4 h-4" /> Retour aux pages
          </Link>
          <h1 className="text-xl font-semibold text-gray-800 mt-1">Modifier : {def.label}</h1>
          <p className="text-sm text-gray-400 mt-1 flex items-center gap-1.5">
            <Languages className="w-4 h-4" /> Les champs vides affichent automatiquement la version française.
          </p>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2 text-sm">
          <Save className="w-4 h-4" /> {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>

      {/* Sélecteur de langue */}
      <div className="flex flex-wrap gap-2">
        {CONTENT_LANGS.map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${lang === l ? "bg-beco-primary text-white border-beco-primary" : "bg-white text-gray-600 border-gray-200 hover:border-beco-primary"
              }`}
          >
            {langFlags[l]}
          </button>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {def.sections.map((section) => (
          <div key={section.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">{section.label}</h3>
            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={form[section.id]?.[field.key] ?? ""}
                      onChange={(e) => setField(section.id, field.key, e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary resize-none"
                    />
                  ) : (
                    <input
                      value={form[section.id]?.[field.key] ?? ""}
                      onChange={(e) => setField(section.id, field.key, e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2 text-sm">
          <Save className="w-4 h-4" /> {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}
