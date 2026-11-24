import { useAdminStats, useAdminMessages } from "@/lib/api/admin";
import { Link } from "react-router-dom";
import {
  FolderOpen,
  Newspaper,
  Users,
  Mail,
  Globe,
  MessageSquare,
  ArrowRight,
  Clock,
} from "lucide-react";

const statCards = [
  { key: "projects" as const, label: "Projets", icon: FolderOpen, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-200" },
  { key: "news" as const, label: "Actualités", icon: Newspaper, color: "bg-blue-50 text-blue-600", border: "border-blue-200" },
  { key: "team" as const, label: "Membres", icon: Users, color: "bg-amber-50 text-amber-600", border: "border-amber-200" },
  { key: "messages" as const, label: "Messages", icon: Mail, color: "bg-rose-50 text-rose-600", border: "border-rose-200" },
  { key: "focusAreas" as const, label: "Domaines", icon: Globe, color: "bg-purple-50 text-purple-600", border: "border-purple-200" },
];

export default function AdminDashboard() {
  const { data: stats } = useAdminStats();
  const { data: recentMessages } = useAdminMessages();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Tableau de bord</h2>
        <p className="text-sm text-gray-500 mt-1">Vue d'ensemble de votre site BECO</p>
      </div>

      {/* Cards statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div
            key={card.key}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className={`inline-flex p-2.5 rounded-lg ${card.color} mb-3`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {stats?.[card.key] ?? 0}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Alert messages non lus */}
      {stats && stats.unreadMessages > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 flex items-center gap-3 group hover:bg-rose-100/50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5 text-rose-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-rose-800">
              <span className="font-bold">{stats.unreadMessages}</span> message{stats.unreadMessages > 1 ? "s" : ""} non lu{stats.unreadMessages > 1 ? "s" : ""}
            </p>
            <p className="text-xs text-rose-600 mt-0.5">Consultez votre messagerie</p>
          </div>
          <Link
            to="/administrateur/messages"
            className="flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 group-hover:underline"
          >
            Voir <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Messages récents */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <h3 className="font-semibold text-gray-800">Messages récents</h3>
          </div>
          <Link
            to="/administrateur/messages"
            className="text-sm text-beco-primary hover:underline flex items-center gap-1"
          >
            Voir tout <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentMessages?.slice(0, 5).map((msg) => (
            <Link
              key={msg.id}
              to="/administrateur/messages"
              className="px-6 py-4 flex items-start gap-3 hover:bg-gray-50/50 transition-colors"
            >
              <div
                className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${msg.isRead ? "bg-gray-300" : "bg-rose-400"
                  }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {msg.firstName} {msg.lastName}
                </p>
                <p className="text-sm text-gray-500 truncate">{msg.message}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
                <Clock className="w-3 h-3" />
                {new Date(msg.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })}
              </div>
            </Link>
          ))}
          {(!recentMessages || recentMessages.length === 0) && (
            <div className="px-6 py-10 text-center">
              <Mail className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Aucun message pour le moment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
