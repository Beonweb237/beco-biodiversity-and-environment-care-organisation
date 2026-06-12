import { trpc } from "@/providers/trpc";
import {
  FolderOpen,
  Newspaper,
  Users,
  Mail,
  Globe,
  MessageSquare,
} from "lucide-react";

const statCards = [
  { key: "projects" as const, label: "Projets", icon: FolderOpen, color: "bg-emerald-50 text-emerald-600" },
  { key: "news" as const, label: "Actualités", icon: Newspaper, color: "bg-blue-50 text-blue-600" },
  { key: "team" as const, label: "Membres", icon: Users, color: "bg-amber-50 text-amber-600" },
  { key: "messages" as const, label: "Messages", icon: Mail, color: "bg-rose-50 text-rose-600" },
  { key: "focusAreas" as const, label: "Domaines", icon: Globe, color: "bg-purple-50 text-purple-600" },
];

export default function AdminDashboard() {
  const { data: stats } = trpc.admin.stats.get.useQuery();
  const { data: recentMessages } = trpc.admin.messages.list.useQuery();

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div
            key={card.key}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className={`inline-flex p-2 rounded-lg ${card.color} mb-3`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {stats?.[card.key] ?? 0}
            </p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Unread messages alert */}
      {stats && stats.unreadMessages > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-rose-500" />
          <p className="text-sm text-rose-700">
            <span className="font-semibold">{stats.unreadMessages}</span> message{stats.unreadMessages > 1 ? "s" : ""} non lu{stats.unreadMessages > 1 ? "s" : ""}
          </p>
          <a
            href="/administrateur/messages"
            className="ml-auto text-sm font-medium text-rose-600 hover:text-rose-700"
          >
            Voir &rarr;
          </a>
        </div>
      )}

      {/* Recent messages */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Messages récents</h3>
          <a
            href="/administrateur/messages"
            className="text-sm text-beco-primary hover:underline"
          >
            Voir tout
          </a>
        </div>
        <div className="divide-y divide-gray-50">
          {recentMessages?.slice(0, 5).map((msg) => (
            <div key={msg.id} className="px-6 py-4 flex items-start gap-3">
              <div
                className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  msg.isRead ? "bg-gray-300" : "bg-rose-400"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {msg.firstName} {msg.lastName}
                </p>
                <p className="text-sm text-gray-500 truncate">{msg.message}</p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">
                {new Date(msg.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
          ))}
          {(!recentMessages || recentMessages.length === 0) && (
            <p className="px-6 py-8 text-center text-sm text-gray-400">
              Aucun message pour le moment
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
