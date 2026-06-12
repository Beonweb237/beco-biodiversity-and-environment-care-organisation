import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Pencil, Trash2, Plus, X, Eye, EyeOff } from "lucide-react";

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
  category: "",
  isPublished: true,
};

export default function AdminProjects() {
  const utils = trpc.useUtils();
  const { data: items } = trpc.admin.projects.list.useQuery();
  const [editing, setEditing] = useState<typeof emptyForm | null>(null);
  const [form, setForm] = useState(emptyForm);

  const createMut = trpc.admin.projects.create.useMutation({
    onSuccess: () => { utils.admin.projects.list.invalidate(); setEditing(null); },
  });
  const updateMut = trpc.admin.projects.update.useMutation({
    onSuccess: () => { utils.admin.projects.list.invalidate(); setEditing(null); },
  });
  const deleteMut = trpc.admin.projects.delete.useMutation({
    onSuccess: () => utils.admin.projects.list.invalidate(),
  });

  const openCreate = () => {
    setForm({ ...emptyForm, id: 0 });
    setEditing({ ...emptyForm, id: 0 });
  };
  const openEdit = (item: NonNullable<typeof items>[0]) => {
    setForm({
      id: item.id,
      title: item.title,
      slug: item.slug,
      tag: item.tag,
      date: item.date || "",
      description: item.description,
      image: item.image || "",
      details: item.details || "",
      funder: item.funder || "",
      category: item.category || "",
      isPublished: item.isPublished,
    });
    setEditing({ ...emptyForm, id: item.id });
  };
  const save = () => {
    if (!form.title || !form.slug || !form.description) return;
    if (form.id === 0) {
      createMut.mutate(form);
    } else {
      updateMut.mutate(form);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{items?.length ?? 0} projet(s)</p>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-[600px] max-h-[85vh] overflow-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-lg">{form.id === 0 ? "Nouveau projet" : "Modifier le projet"}</h3>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Image (URL)</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary" placeholder="/assets/..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Détails (séparés par ;)</label>
                <textarea value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Financeur</label>
                  <input value={form.funder} onChange={(e) => setForm({ ...form, funder: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
                Publié
              </label>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setEditing(null)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Annuler</button>
              <button onClick={save} disabled={createMut.isPending || updateMut.isPending} className="btn-primary text-sm">Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Titre</th>
              <th className="px-4 py-3 font-medium">Tag</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items?.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.slug}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">{item.tag}</td>
                <td className="px-4 py-3 text-gray-500">{item.date}</td>
                <td className="px-4 py-3">
                  {item.isPublished ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 text-xs">
                      <Eye className="w-3 h-3" /> Publié
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-gray-400 text-xs">
                      <EyeOff className="w-3 h-3" /> Brouillon
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-gray-100 rounded"><Pencil className="w-4 h-4 text-gray-500" /></button>
                    <button onClick={() => { if (confirm("Supprimer ?")) deleteMut.mutate({ id: item.id }); }} className="p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-400" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {(!items || items.length === 0) && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Aucun projet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
