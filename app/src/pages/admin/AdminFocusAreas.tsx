import { useState } from "react";
import { trpc } from "@/providers/trpc";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  Eye,
  EyeOff,
  GripVertical,
  Check,
  AlertTriangle,
} from "lucide-react";
import AdminConfirmDialog from "./AdminConfirmDialog";
import { ToastContainer, type ToastData, type ToastType } from "./AdminToast";

const emptyForm = {
  id: 0,
  title: "",
  slug: "",
  description: "",
  image: "",
  order: 0,
  isPublished: true,
};

export default function AdminFocusAreas() {
  const utils = trpc.useUtils();
  const { data: items, isLoading } = trpc.admin.focusAreas.list.useQuery();
  const [editing, setEditing] = useState<typeof emptyForm | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (type: ToastType, message: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const createMut = trpc.admin.focusAreas.create.useMutation({
    onSuccess: () => {
      utils.admin.focusAreas.list.invalidate();
      utils.admin.stats.get.invalidate();
      setEditing(null);
      addToast("success", "Domaine d'intervention créé avec succès");
    },
    onError: (err) => addToast("error", err.message),
  });

  const updateMut = trpc.admin.focusAreas.update.useMutation({
    onSuccess: () => {
      utils.admin.focusAreas.list.invalidate();
      setEditing(null);
      addToast("success", "Domaine d'intervention mis à jour");
    },
    onError: (err) => addToast("error", err.message),
  });

  const deleteMut = trpc.admin.focusAreas.delete.useMutation({
    onSuccess: () => {
      utils.admin.focusAreas.list.invalidate();
      utils.admin.stats.get.invalidate();
      setDeleteTarget(null);
      addToast("success", "Domaine d'intervention supprimé");
    },
    onError: (err) => addToast("error", err.message),
  });

  const openCreate = () => {
    const nextOrder = items?.length ?? 0;
    setForm({ ...emptyForm, id: 0, order: nextOrder + 1 });
    setEditing({ ...emptyForm, id: 0, order: nextOrder + 1 });
  };

  const openEdit = (item: NonNullable<typeof items>[0]) => {
    setForm({
      id: item.id,
      title: item.title,
      slug: item.slug,
      description: item.description,
      image: item.image || "",
      order: item.order,
      isPublished: item.isPublished,
    });
    setEditing({ ...emptyForm, id: item.id });
  };

  const save = () => {
    if (!form.title || !form.slug || !form.description) {
      addToast("error", "Veuillez remplir tous les champs obligatoires");
      return;
    }
    if (form.id === 0) {
      createMut.mutate(form);
    } else {
      updateMut.mutate(form);
    }
  };

  return (
    <div className="space-y-4">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Confirm delete dialog */}
      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Supprimer le domaine"
        message={`Êtes-vous sûr de vouloir supprimer « ${deleteTarget?.title} » ? Cette action est irréversible.`}
        onConfirm={() => deleteTarget && deleteMut.mutate({ id: deleteTarget.id })}
        onCancel={() => setDeleteTarget(null)}
        isPending={deleteMut.isPending}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{items?.length ?? 0} domaine(s) d'intervention</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Ajouter un domaine
        </button>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-[600px] max-h-[85vh] overflow-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                {form.id === 0 ? "Nouveau domaine d'intervention" : "Modifier le domaine"}
              </h3>
              <button onClick={() => setEditing(null)} disabled={createMut.isPending || updateMut.isPending}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Image (URL)</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary"
                  placeholder="/assets/focus-..."
                />
                {form.image && (
                  <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={form.image}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='50' x='50' text-anchor='middle' dominant-baseline='central' font-size='12' fill='%23999'>Image invalide</text></svg>";
                      }}
                    />
                  </div>
                )}
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
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button
                onClick={() => setEditing(null)}
                disabled={createMut.isPending || updateMut.isPending}
                className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={save}
                disabled={createMut.isPending || updateMut.isPending}
                className="btn-primary text-sm flex items-center gap-2"
              >
                {(createMut.isPending || updateMut.isPending) && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {form.id === 0 ? "Créer" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table/Cards */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-8 h-8 border-3 border-beco-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-400 mt-3">Chargement...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3 font-medium w-12">#</th>
                <th className="px-4 py-3 font-medium">Titre</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Description</th>
                <th className="px-4 py-3 font-medium w-24">Statut</th>
                <th className="px-4 py-3 font-medium w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-gray-400">
                      <GripVertical className="w-3.5 h-3.5" />
                      <span className="text-xs">{item.order}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt=""
                          className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{item.title}</p>
                        <p className="text-xs text-gray-400">/{item.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell max-w-xs truncate">
                    {item.description}
                  </td>
                  <td className="px-4 py-3">
                    {item.isPublished ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-xs bg-emerald-50 px-2 py-1 rounded-full">
                        <Eye className="w-3 h-3" /> Publié
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-400 text-xs bg-gray-100 px-2 py-1 rounded-full">
                        <EyeOff className="w-3 h-3" /> Masqué
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title="Modifier"
                      >
                        <Pencil className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: item.id, title: item.title })}
                        className="p-1.5 hover:bg-red-50 rounded transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!items || items.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <AlertTriangle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Aucun domaine d'intervention</p>
                    <button
                      onClick={openCreate}
                      className="mt-3 text-sm text-beco-primary hover:underline"
                    >
                      Créer le premier domaine
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
