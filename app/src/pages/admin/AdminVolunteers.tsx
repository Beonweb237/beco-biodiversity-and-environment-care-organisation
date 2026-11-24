import { useMemo, useState } from "react";
import {
  useAdminVolunteers,
  useMarkVolunteerRead,
  useDeleteVolunteer,
} from "@/lib/api/admin";
import {
  UserCheck,
  Trash2,
  Download,
  Search,
  X,
  Clock,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
} from "lucide-react";
import AdminConfirmDialog from "./AdminConfirmDialog";
import { ToastContainer, type ToastData, type ToastType } from "./AdminToast";

export default function AdminVolunteers() {
  const { data: volunteers } = useAdminVolunteers();
  const [search, setSearch] = useState("");
  const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (type: ToastType, message: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markReadMut = useMarkVolunteerRead({
    onSuccess: () => addToast("success", "Candidature marquée comme lue"),
  });

  const deleteMut = useDeleteVolunteer({
    onSuccess: () => {
      setDeleteTarget(null);
      addToast("success", "Candidature supprimée");
    },
  });

  const filtered = useMemo(() => {
    if (!volunteers) return [];
    let result = volunteers;
    if (filterRead === "unread") result = result.filter((v) => !v.isRead);
    else if (filterRead === "read") result = result.filter((v) => v.isRead);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.fullName.toLowerCase().includes(q) ||
          v.email.toLowerCase().includes(q) ||
          (v.phone ?? "").toLowerCase().includes(q) ||
          (v.interest ?? "").toLowerCase().includes(q) ||
          (v.motivation ?? "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [volunteers, search, filterRead]);

  const unreadCount = volunteers?.filter((v) => !v.isRead).length ?? 0;

  const handleExportCSV = () => {
    if (!volunteers || volunteers.length === 0) return;
    const headers = ["Nom complet", "Email", "Téléphone", "Intérêt", "Motivation", "Date", "Lu"];
    const rows = filtered.map((v) => [
      v.fullName,
      v.email,
      v.phone || "",
      v.interest || "",
      (v.motivation || "").replace(/"/g, '""'),
      new Date(v.createdAt).toLocaleDateString("fr-FR"),
      v.isRead ? "Oui" : "Non",
    ]);
    const csv = [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `benevoles-beco-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast("success", "Export CSV téléchargé");
  };

  return (
    <div className="space-y-4">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Supprimer la candidature"
        message={`Êtes-vous sûr de vouloir supprimer la candidature de ${deleteTarget?.name} ? Cette action est irréversible.`}
        onConfirm={() => deleteTarget && deleteMut.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        isPending={deleteMut.isPending}
      />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm text-gray-500">{volunteers?.length ?? 0} candidature(s) bénévole(s)</p>
          {unreadCount > 0 && (
            <p className="text-sm text-rose-600 font-medium">
              {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-56 pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-beco-primary"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <select
            value={filterRead}
            onChange={(e) => setFilterRead(e.target.value as typeof filterRead)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-beco-primary bg-white"
          >
            <option value="all">Toutes</option>
            <option value="unread">Non lues</option>
            <option value="read">Lues</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 text-gray-500" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Liste */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-50">
        {filtered.map((v) => (
          <div key={v.id} className={`${!v.isRead ? "bg-amber-50/30" : ""} transition-colors`}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => setExpandedId(expandedId === v.id ? null : v.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setExpandedId(expandedId === v.id ? null : v.id);
                }
              }}
              className="w-full text-left p-6 flex items-start gap-4 hover:bg-black/[0.02] cursor-pointer"
            >
              <div className={`mt-0.5 flex-shrink-0 ${v.isRead ? "text-gray-300" : "text-amber-400"}`}>
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h4 className={`text-sm ${!v.isRead ? "font-semibold" : "font-medium"} text-gray-800`}>
                    {v.fullName}
                  </h4>
                  <a
                    href={`mailto:${v.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm text-beco-primary hover:underline inline-flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {v.email}
                  </a>
                  {v.phone && (
                    <a
                      href={`tel:${v.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm text-gray-500 hover:text-beco-primary inline-flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {v.phone}
                    </a>
                  )}
                  {!v.isRead && (
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium uppercase tracking-wider">
                      Nouveau
                    </span>
                  )}
                </div>
                {v.interest && (
                  <p className="text-sm text-gray-500 mt-0.5">Intérêt : {v.interest}</p>
                )}
                {v.motivation && (
                  <p className={`text-sm mt-2 leading-relaxed ${expandedId === v.id ? "" : "line-clamp-2"}`}>
                    {v.motivation}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(v.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {v.motivation && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      {expandedId === v.id ? (
                        <>
                          <ChevronUp className="w-3 h-3" /> Réduire
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3" /> Lire la suite
                        </>
                      )}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                {!v.isRead && (
                  <button
                    onClick={() => markReadMut.mutate(v.id)}
                    className="text-xs text-beco-primary hover:underline font-medium whitespace-nowrap"
                  >
                    Marquer lu
                  </button>
                )}
                <button
                  onClick={() => setDeleteTarget({ id: v.id, name: v.fullName })}
                  className="text-xs text-red-400 hover:text-red-600 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <UserCheck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              {search || filterRead !== "all"
                ? "Aucune candidature ne correspond aux filtres"
                : "Aucune candidature reçue pour le moment"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
