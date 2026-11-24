import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAdminNews, useCreateNews, useUpdateNews } from "@/lib/api/admin";
import AdminImageUploader from "./AdminImageUploader";

const BASE = "/administrateur/actualites";

const emptyForm = {
  id: 0,
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  tag: "",
  date: "",
  image: "",
  category: "",
  isPublished: true,
};

type NewsForm = typeof emptyForm;

export default function AdminNewsEdit({ create = false }: { create?: boolean }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = create || id === "nouveau";
  const itemId = isNew ? 0 : Number(id);

  const { data: items } = useAdminNews();
  const item = isNew ? null : items?.find((it) => it.id === itemId) ?? null;
  const isLoadingItem = !isNew && items === undefined;
  const notFound = !isNew && items !== undefined && !item;

  const [form, setForm] = useState<NewsForm>({ ...emptyForm });
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
        excerpt: ex.excerpt,
        content: ex.content || "",
        tag: ex.tag,
        date: ex.date || "",
        image: ex.image || "",
        category: ex.category || "",
        isPublished: ex.isPublished,
      });
      initializedRef.current = true;
    }
  }, [isNew, itemId, items]);

  const createMut = useCreateNews({ onSuccess: () => navigate(BASE) });
  const updateMut = useUpdateNews({ onSuccess: () => navigate(BASE) });
  const pending = createMut.isPending || updateMut.isPending;

  const save = () => {
    if (!form.title || !form.slug || !form.excerpt) return;
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
        <p className="text-gray-400 text-sm">Actualité introuvable.</p>
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
            <ArrowLeft className="w-4 h-4" /> Retour aux actualités
          </Link>
          <h1 className="text-xl font-semibold text-gray-800 mt-1">
            {isNew ? "Nouvel article" : "Modifier l'article"}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Extrait</label>
            <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary resize-none" />
          </div>
          <div>
            <AdminImageUploader value={form.image} onChange={(url) => setForm({ ...form, image: url })} label="Image" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary" />
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
            {pending ? "Enregistrement..." : isNew ? "Créer l'article" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
