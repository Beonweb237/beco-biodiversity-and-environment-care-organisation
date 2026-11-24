import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAdminFocusAreas, useCreateFocusArea, useUpdateFocusArea } from "@/lib/api/admin";
import AdminImageUploader from "./AdminImageUploader";
import { ToastContainer, type ToastData, type ToastType } from "./AdminToast";

const BASE = "/administrateur/domaines";

const emptyForm = {
  id: 0,
  title: "",
  slug: "",
  description: "",
  image: "",
  order: 0,
  isPublished: true,
};

type FocusForm = typeof emptyForm;

export default function AdminFocusAreaEdit({ create = false }: { create?: boolean }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = create || id === "nouveau";
  const itemId = isNew ? 0 : Number(id);

  const { data: items } = useAdminFocusAreas();
  const item = isNew ? null : items?.find((it) => it.id === itemId) ?? null;
  const isLoadingItem = !isNew && items === undefined;
  const notFound = !isNew && items !== undefined && !item;

  const [form, setForm] = useState<FocusForm>({ ...emptyForm });
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const initializedRef = useRef(false);

  const addToast = (type: ToastType, message: string) => {
    const tid = crypto.randomUUID();
    setToasts((prev) => [...prev, { id: tid, type, message }]);
  };
  const dismissToast = (tid: string) => setToasts((prev) => prev.filter((t) => t.id !== tid));

  useEffect(() => {
    if (initializedRef.current) return;
    if (isNew) {
      const nextOrder = (items?.length ?? 0) + 1;
      setForm({ ...emptyForm, order: nextOrder });
      initializedRef.current = true;
      return;
    }
    const ex = items?.find((it) => it.id === itemId);
    if (ex) {
      setForm({
        id: ex.id,
        title: ex.title,
        slug: ex.slug,
        description: ex.description,
        image: ex.image || "",
        order: ex.order,
        isPublished: ex.isPublished,
      });
      initializedRef.current = true;
    }
  }, [isNew, itemId, items]);

  const createMut = useCreateFocusArea({
    onSuccess: () => navigate(BASE),
    onError: (err) => addToast("error", err.message),
  });
  const updateMut = useUpdateFocusArea({
    onSuccess: () => navigate(BASE),
    onError: (err) => addToast("error", err.message),
  });
  const pending = createMut.isPending || updateMut.isPending;

  const save = () => {
    if (!form.title || !form.slug || !form.description) {
      addToast("error", "Veuillez remplir tous les champs obligatoires");
      return;
    }
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
        <p className="text-gray-400 text-sm">Domaine introuvable.</p>
        <Link to={BASE} className="mt-4 inline-flex items-center gap-2 text-sm text-beco-primary hover:underline">
          <ArrowLeft className="w-4 h-4" /> Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-[800px]">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className="flex items-center justify-between">
        <div>
          <Link to={BASE} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-beco-primary">
            <ArrowLeft className="w-4 h-4" /> Retour aux domaines
          </Link>
          <h1 className="text-xl font-semibold text-gray-800 mt-1">
            {isNew ? "Nouveau domaine d'intervention" : "Modifier le domaine"}
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre <span className="text-red-400">*</span>
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary"
                placeholder="Ex: Conservation de la biodiversité"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug <span className="text-red-400">*</span>
              </label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary"
                placeholder="Ex: biodiversite"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary resize-none"
              placeholder="Description du domaine d'intervention"
            />
          </div>
          <div>
            <AdminImageUploader value={form.image} onChange={(url) => setForm({ ...form, image: url })} label="Image" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d'affichage</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="rounded"
                />
                Publié
              </label>
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-gray-100 mt-6 flex gap-3 justify-end">
          <Link to={BASE} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
            Annuler
          </Link>
          <button onClick={save} disabled={pending} className="btn-primary text-sm">
            {pending ? "Enregistrement..." : isNew ? "Créer le domaine" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
