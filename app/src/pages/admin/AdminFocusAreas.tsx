import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminFocusAreas, useDeleteFocusArea } from "@/lib/api/admin";
import { Pencil, Trash2, Plus, Eye, EyeOff, GripVertical, AlertTriangle } from "lucide-react";
import AdminConfirmDialog from "./AdminConfirmDialog";
import { ToastContainer, type ToastData, type ToastType } from "./AdminToast";

export default function AdminFocusAreas() {
  const navigate = useNavigate();
  const { data: items, isLoading } = useAdminFocusAreas();
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (type: ToastType, message: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);
  };
  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const deleteMut = useDeleteFocusArea({
    onSuccess: () => {
      setDeleteTarget(null);
      addToast("success", "Domaine d'intervention supprimé");
    },
    onError: (err) => addToast("error", err.message),
  });

  return (
    <div className="space-y-4">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Supprimer le domaine"
        message={`Êtes-vous sûr de vouloir supprimer « ${deleteTarget?.title} » ? Cette action est irréversible.`}
        onConfirm={() => deleteTarget && deleteMut.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        isPending={deleteMut.isPending}
      />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{items?.length ?? 0} domaine(s) d'intervention</p>
        </div>
        <button
          onClick={() => navigate("/administrateur/domaines/nouveau")}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> Ajouter un domaine
        </button>
      </div>

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
                        onClick={() => navigate(`/administrateur/domaines/${item.id}`)}
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
                      onClick={() => navigate("/administrateur/domaines/nouveau")}
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
