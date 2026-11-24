import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAdminTeam, useCreateTeamMember, useUpdateTeamMember } from "@/lib/api/admin";
import AdminImageUploader from "./AdminImageUploader";

const BASE = "/administrateur/equipe";

const emptyForm = {
  id: 0,
  name: "",
  role: "",
  status: "",
  description: "",
  image: "",
  linkedin: "",
  email: "",
  order: 0,
  isPublished: true,
};

type TeamForm = typeof emptyForm;

export default function AdminTeamEdit({ create = false }: { create?: boolean }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = create || id === "nouveau";
  const itemId = isNew ? 0 : Number(id);

  const { data: items } = useAdminTeam();
  const item = isNew ? null : items?.find((it) => it.id === itemId) ?? null;
  const isLoadingItem = !isNew && items === undefined;
  const notFound = !isNew && items !== undefined && !item;

  const [form, setForm] = useState<TeamForm>({ ...emptyForm });
  const initializedRef = useRef(false);

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
        name: ex.name,
        role: ex.role,
        status: ex.status || "",
        description: ex.description || "",
        image: ex.image || "",
        linkedin: ex.linkedin || "",
        email: ex.email || "",
        order: ex.order,
        isPublished: ex.isPublished,
      });
      initializedRef.current = true;
    }
  }, [isNew, itemId, items]);

  const createMut = useCreateTeamMember({ onSuccess: () => navigate(BASE) });
  const updateMut = useUpdateTeamMember({ onSuccess: () => navigate(BASE) });
  const pending = createMut.isPending || updateMut.isPending;

  const save = () => {
    if (!form.name || !form.role) return;
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
        <p className="text-gray-400 text-sm">Membre introuvable.</p>
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
            <ArrowLeft className="w-4 h-4" /> Retour à l'équipe
          </Link>
          <h1 className="text-xl font-semibold text-gray-800 mt-1">
            {isNew ? "Nouveau membre" : "Modifier le membre"}
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
              <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <input value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary" placeholder="PhD, Doctorante..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordre</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary resize-none" />
          </div>
          <div>
            <AdminImageUploader value={form.image} onChange={(url) => setForm({ ...form, image: url })} label="Image" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary" />
            </div>
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
            {pending ? "Enregistrement..." : isNew ? "Créer le membre" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
