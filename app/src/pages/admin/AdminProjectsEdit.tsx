import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAdminProjects, useCreateProject, useUpdateProject } from "@/lib/api/admin";
import AdminImageUploader from "./AdminImageUploader";

const BASE = "/administrateur/projets";

const emptyForm = {
  id: 0,
  title: "",
  slug: "",
  tag: "",
  date: "",
  description: "",
  image: "",
  details: "",
  funder: "",
  url: "",
  category: "",
  isPublished: true,
};

type ProjectForm = typeof emptyForm;

export default function AdminProjectsEdit({ create = false }: { create?: boolean }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = create || id === "nouveau";
  const itemId = isNew ? 0 : Number(id);

  const { data: items } = useAdminProjects();
  const item = isNew ? null : items?.find((it) => it.id === itemId) ?? null;
  const isLoadingItem = !isNew && items === undefined;
  const notFound = !isNew && items !== undefined && !item;

  const [form, setForm] = useState<ProjectForm>({ ...emptyForm });
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    if (isNew) {
      setForm({ ...emptyForm });
      initializedRef.current = true;
      return;
    }
    const ex = items?.find((it) => it.id === itemId);
    if (ex) {
      setForm({
        id: ex.id,
        title: ex.title,
        slug: ex.slug,
        tag: ex.tag,
        date: ex.date || "",
        description: ex.description,
        image: ex.image || "",
        details: ex.details || "",
        funder: ex.funder || "",
        url: ex.url || "",
        category: ex.category || "",
        isPublished: ex.isPublished,
      });
      initializedRef.current = true;
    }
  }, [isNew, itemId, items]);

  const createMut = useCreateProject({ onSuccess: () => navigate(BASE) });
  const updateMut = useUpdateProject({ onSuccess: () => navigate(BASE) });
  const pending = createMut.isPending || updateMut.isPending;

  const save = () => {
    if (!form.title || !form.slug || !form.description) return;
    if (isNew) createMut.mutate(form);
    else updateMut.mutate(form);
  };

  if (isLoadingItem) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-8 h-8 border-3 border-beco-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-400 mt-3">Chargement...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-400 text-sm">Projet introuvable.</p>
        <Link to={BASE} className="mt-4 inline-flex items-center gap-2 text-sm text-beco-primary hover:underline">
          <ArrowLeft className="w-4 h-4" /> Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-[800px]">
      <div className="flex items-center justify-between">
        <div>
          <Link to={BASE} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-beco-primary">
            <ArrowLeft className="w-4 h-4" /> Retour aux projets
          </Link>
          <h1 className="text-xl font-semibold text-gray-800 mt-1">
            {isNew ? "Nouveau projet" : "Modifier le projet"}
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
              <input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary resize-none" />
          </div>
          <div>
            <AdminImageUploader value={form.image} onChange={(url) => setForm({ ...form, image: url })} label="Image" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Détails (séparés par ;)</label>
            <textarea value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Financeur (Funded by)</label>
              <input value={form.funder} onChange={(e) => setForm({ ...form, funder: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lien du projet (URL)</label>
            <input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://... (lien personnalisé « View project »)"
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary"
            />
            <p className="text-xs text-gray-400 mt-1">Lien externe vers la fiche projet (site du financeur, dossier Google, etc.).</p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
            Publié
          </label>
        </div>
        <div className="pt-6 border-t border-gray-100 mt-6 flex gap-3 justify-end">
          <Link to={BASE} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
            Annuler
          </Link>
          <button onClick={save} disabled={pending} className="btn-primary text-sm">
            {pending ? "Enregistrement..." : isNew ? "Créer le projet" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
