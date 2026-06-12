import { trpc } from "@/providers/trpc";
import { MailOpen, Mail, Trash2 } from "lucide-react";

export default function AdminMessages() {
  const utils = trpc.useUtils();
  const { data: messages } = trpc.admin.messages.list.useQuery();

  const markReadMut = trpc.admin.messages.markRead.useMutation({
    onSuccess: () => utils.admin.messages.list.invalidate(),
  });
  const deleteMut = trpc.admin.messages.delete.useMutation({
    onSuccess: () => { utils.admin.messages.list.invalidate(); utils.admin.stats.get.invalidate(); },
  });

  const unreadCount = messages?.filter((m) => !m.isRead).length ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{messages?.length ?? 0} message(s)</p>
        {unreadCount > 0 && (
          <p className="text-sm text-rose-600 font-medium">{unreadCount} non lu{unreadCount > 1 ? "s" : ""}</p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-50">
        {messages?.map((msg) => (
          <div
            key={msg.id}
            className={`p-6 ${!msg.isRead ? "bg-amber-50/30" : ""}`}
          >
            <div className="flex items-start gap-4">
              <div className={`mt-1 flex-shrink-0 ${msg.isRead ? "text-gray-300" : "text-amber-400"}`}>
                {msg.isRead ? <MailOpen className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h4 className="font-semibold text-gray-800">
                    {msg.firstName} {msg.lastName}
                  </h4>
                  <a href={`mailto:${msg.email}`} className="text-sm text-beco-primary hover:underline">
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
                {msg.type && (
                  <p className="text-xs text-gray-400 mt-0.5">Type : {msg.type}</p>
                )}
                <p className="text-sm text-gray-700 mt-2 leading-relaxed">{msg.message}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs text-gray-400">
                    {new Date(msg.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {!msg.isRead && (
                    <button
                      onClick={() => markReadMut.mutate({ id: msg.id })}
                      className="text-xs text-beco-primary hover:underline font-medium"
                    >
                      Marquer comme lu
                    </button>
                  )}
                  <button
                    onClick={() => { if (confirm("Supprimer ce message ?")) deleteMut.mutate({ id: msg.id }); }}
                    className="text-xs text-red-400 hover:text-red-600 font-medium ml-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {(!messages || messages.length === 0) && (
          <div className="p-12 text-center">
            <Mail className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Aucun message reçu</p>
          </div>
        )}
      </div>
    </div>
  );
}
