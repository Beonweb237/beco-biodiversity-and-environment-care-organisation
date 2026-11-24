import { useState } from "react";
import { useAdminActivityLogs } from "@/lib/api/admin";
import {
  Activity,
  Plus,
  Pencil,
  Trash2,
  LogIn,
  LogOut,
  ToggleLeft,
  MailOpen,
  Download,
  History,
  Clock,
} from "lucide-react";
import AdminPagination from "./AdminPagination";

const actionIcons: Record<string, typeof Activity> = {
  create: Plus,
  update: Pencil,
  delete: Trash2,
  login: LogIn,
  logout: LogOut,
  toggle: ToggleLeft,
  mark_read: MailOpen,
  export: Download,
};

const actionColors: Record<string, string> = {
  create: "text-emerald-600 bg-emerald-50",
  update: "text-blue-600 bg-blue-50",
  delete: "text-red-600 bg-red-50",
  login: "text-green-600 bg-green-50",
  logout: "text-gray-600 bg-gray-50",
  toggle: "text-amber-600 bg-amber-50",
  mark_read: "text-purple-600 bg-purple-50",
  export: "text-indigo-600 bg-indigo-50",
};

const actionLabels: Record<string, string> = {
  create: "Création",
  update: "Modification",
  delete: "Suppression",
  login: "Connexion",
  logout: "Déconnexion",
  toggle: "Activation",
  mark_read: "Lu",
  export: "Export",
};

const entityLabels: Record<string, string> = {
  project: "Projet",
  news: "Actualité",
  team_member: "Membre",
  focus_area: "Domaine",
  contact_message: "Message",
  site_setting: "Paramètre",
  admin_user: "Admin",
};

const PAGE_SIZE = 20;

export default function AdminActivityLogs() {
  const [page, setPage] = useState(0);
  const [entityFilter, setEntityFilter] = useState<string>("");
  const [actionFilter, setActionFilter] = useState<string>("");

  const { data, isLoading } = useAdminActivityLogs({
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
    entity: entityFilter || undefined,
    action: actionFilter || undefined,
  });

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Journal d'activité</h2>
        <p className="text-sm text-gray-500 mt-1">
          Historique des actions des administrateurs
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={entityFilter}
          onChange={(e) => { setEntityFilter(e.target.value); setPage(0); }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-beco-primary bg-white"
        >
          <option value="">Toutes les entités</option>
          {Object.entries(entityLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(0); }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-beco-primary bg-white"
        >
          <option value="">Toutes les actions</option>
          {Object.entries(actionLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <span className="text-sm text-gray-500 ml-auto">
          {data?.total ?? 0} entrée(s)
        </span>
      </div>

      {/* Logs list */}
      <div className="bg-white rounded-xl border border-gray-200">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-beco-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-50">
              {data?.rows?.map((log) => {
                const ActionIcon = actionIcons[log.action] || Activity;
                const colorClass = actionColors[log.action] || "text-gray-600 bg-gray-50";
                return (
                  <div key={log.id} className="px-6 py-4 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <ActionIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm text-gray-800">{log.adminName}</span>
                        <span className="text-xs text-gray-400">a</span>
                        <span className="text-xs font-medium text-gray-600">
                          {actionLabels[log.action] || log.action}
                        </span>
                        <span className="text-xs text-gray-400">dans</span>
                        <span className="text-xs font-medium text-beco-primary">
                          {entityLabels[log.entity] || log.entity}
                        </span>
                        {log.entityId && (
                          <span className="text-xs text-gray-400">#{log.entityId}</span>
                        )}
                      </div>
                      {log.details && (
                        <p className="text-xs text-gray-500 mt-0.5">{log.details}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      {new Date(log.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                );
              })}
              {(!data?.rows || data.rows.length === 0) && (
                <div className="p-12 text-center">
                  <History className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Aucune activité enregistrée</p>
                </div>
              )}
            </div>
            <AdminPagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              total={data?.total ?? 0}
              pageSize={PAGE_SIZE}
            />
          </>
        )}
      </div>
    </div>
  );
}
