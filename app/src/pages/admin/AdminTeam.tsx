import { useNavigate } from "react-router-dom";
import { useAdminTeam, useDeleteTeamMember } from "@/lib/api/admin";
import { Pencil, Trash2, Plus, Eye, EyeOff } from "lucide-react";

export default function AdminTeam() {
  const navigate = useNavigate();
  const { data: items } = useAdminTeam();
  const deleteMut = useDeleteTeamMember();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{items?.length ?? 0} membre(s)</p>
        <button
          onClick={() => navigate("/administrateur/equipe/nouveau")}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Membre</th>
              <th className="px-4 py-3 font-medium">Rôle</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Visibilité</th>
              <th className="px-4 py-3 font-medium w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items?.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                    )}
                    <span className="font-medium text-gray-800">{item.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{item.role}</td>
                <td className="px-4 py-3 text-gray-500">{item.status || "-"}</td>
                <td className="px-4 py-3">
                  {item.isPublished ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 text-xs">
                      <Eye className="w-3 h-3" /> Publié
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-gray-400 text-xs">
                      <EyeOff className="w-3 h-3" /> Masqué
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/administrateur/equipe/${item.id}`)}
                      className="p-1.5 hover:bg-gray-100 rounded"
                      title="Modifier"
                    >
                      <Pencil className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Supprimer ce membre ?")) deleteMut.mutate(item.id);
                      }}
                      className="p-1.5 hover:bg-red-50 rounded"
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
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Aucun membre
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
