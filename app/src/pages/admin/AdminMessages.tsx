import { useState, useMemo } from "react";
import { useAdminMessages, useMarkMessageRead, useDeleteMessage } from "@/lib/api/admin";
import {
  MailOpen,
  Mail,
  Trash2,
  Download,
  Search,
  X,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import AdminConfirmDialog from "./AdminConfirmDialog";
import { ToastContainer, type ToastData, type ToastType } from "./AdminToast";

export default function AdminMessages() {
  const { data: messages } = useAdminMessages();
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

  const markReadMut = useMarkMessageRead({
    onSuccess: () => {
      addToast("success", "Message marqué comme lu");
    },
  });

  const deleteMut = useDeleteMessage({
    onSuccess: () => {
      setDeleteTarget(null);
      addToast("success", "Message supprimé");
    },
  });

  const filtered = useMemo(() => {
    if (!messages) return [];
    let result = messages;

    // Filter by read status
    if (filterRead === "unread") result = result.filter((m) => !m.isRead);
    else if (filterRead === "read") result = result.filter((m) => m.isRead);

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.firstName.toLowerCase().includes(q) ||
          m.lastName.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          (m.subject && m.subject.toLowerCase().includes(q)) ||
          m.message.toLowerCase().includes(q)
      );
    }

    return result;
  }, [messages, search, filterRead]);

  const unreadCount = messages?.filter((m) => !m.isRead).length ?? 0;

  const handleExportCSV = () => {
    if (!messages || messages.length === 0) return;
    const headers = ["Prénom", "Nom", "Email", "Sujet", "Type", "Message", "Date", "Lu"];
    const rows = filtered.map((m) => [
      m.firstName,
      m.lastName,
      m.email,
      m.subject || "",
      m.type || "",
      m.message.replace(/"/g, '""'),
      new Date(m.createdAt).toLocaleDateString("fr-FR"),
      m.isRead ? "Oui" : "Non",
    ]);

    const csv = [
      headers.join(";"),
      ...rows.map((r) => r.join(";")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `messages-beco-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast("success", "Export CSV téléchargé");
  };

  return (
    <div className="space-y-4">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Supprimer le message"
        message={`Êtes-vous sûr de vouloir supprimer le message de ${deleteTarget?.name} ? Cette action est irréversible.`}
        onConfirm={() => deleteTarget && deleteMut.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        isPending={deleteMut.isPending}
      />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm text-gray-500">{messages?.length ?? 0} message(s)</p>
          {unreadCount > 0 && (
            <p className="text-sm text-rose-600 font-medium">
              {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
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
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter */}
          <select
            value={filterRead}
            onChange={(e) => setFilterRead(e.target.value as typeof filterRead)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-beco-primary bg-white"
          >
            <option value="all">Tous les messages</option>
            <option value="unread">Non lus</option>
            <option value="read">Lus</option>
          </select>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 text-gray-500" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-50">
        {filtered.map((msg) => (
          <div
            key={msg.id}
            className={`${!msg.isRead ? "bg-amber-50/30" : ""} transition-colors`}
          >
            <button
              onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
              className="w-full text-left p-6 flex items-start gap-4 hover:bg-black/[0.02]"
            >
              <div className={`mt-0.5 flex-shrink-0 ${msg.isRead ? "text-gray-300" : "text-amber-400"}`}>
                {msg.isRead ? <MailOpen className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h4 className={`text-sm ${!msg.isRead ? "font-semibold" : "font-medium"} text-gray-800`}>
                    {msg.firstName} {msg.lastName}
                  </h4>
                  <a
                    href={`mailto:${msg.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm text-beco-primary hover:underline"
                  >
                    {msg.email}
                  </a>
                  {!msg.isRead && (
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium uppercase tracking-wider">
                      Nouveau
                    </span>
                  )}
                </div>
                {msg.subject && (
                  <p className="text-sm text-gray-500 mt-0.5">Sujet : {msg.subject}</p>
                )}
                <p className={`text-sm mt-2 leading-relaxed ${expandedId === msg.id ? "" : "line-clamp-2"}`}>
                  {msg.message}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(msg.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    {expandedId === msg.id ? (
                      <><ChevronUp className="w-3 h-3" /> Réduire</>
                    ) : (
                      <><ChevronDown className="w-3 h-3" /> Lire la suite</>
                    )}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                {!msg.isRead && (
                  <button
                    onClick={() => markReadMut.mutate(msg.id)}
                    className="text-xs text-beco-primary hover:underline font-medium whitespace-nowrap"
                  >
                    Marquer lu
                  </button>
                )}
                <button
                  onClick={() => setDeleteTarget({ id: msg.id, name: `${msg.firstName} ${msg.lastName}` })}
                  className="text-xs text-red-400 hover:text-red-600 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </button>

            {/* Expanded details */}
            {expandedId === msg.id && msg.type && (
              <div className="px-6 pb-4 ml-12">
                <div className="flex items-center gap-4 text-xs text-gray-500 bg-gray-50 rounded-lg px-4 py-2">
                  {msg.type && <span>Type : {msg.type}</span>}
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <Mail className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              {search || filterRead !== "all" ? "Aucun message ne correspond aux filtres" : "Aucun message reçu"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
