import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Save, Shield, UserPlus, Check } from "lucide-react";

export default function AdminSettings() {
  const utils = trpc.useUtils();
  const { data: settings } = trpc.admin.settings.list.useQuery();
  const { data: adminUsersList } = trpc.admin.users.list.useQuery();

  const updateMut = trpc.admin.settings.update.useMutation({
    onSuccess: () => utils.admin.settings.list.invalidate(),
  });
  const createUserMut = trpc.admin.users.create.useMutation({
    onSuccess: () => utils.admin.users.list.invalidate(),
  });
  const toggleUserMut = trpc.admin.users.toggleActive.useMutation({
    onSuccess: () => utils.admin.users.list.invalidate(),
  });

  const [newUser, setNewUser] = useState({ username: "", password: "", name: "", email: "", role: "admin" as "admin" | "superadmin" });
  const [showAddUser, setShowAddUser] = useState(false);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const getSetting = (key: string) => settings?.find((s) => s.key === key)?.value || "";

  const updateSetting = (key: string, value: string) => {
    updateMut.mutate({ key, value });
    setSavedKey(key);
    setTimeout(() => setSavedKey(null), 1500);
  };

  const siteFields = [
    { key: "site_name", label: "Nom du site" },
    { key: "site_description", label: "Description" },
    { key: "contact_email", label: "Email de contact" },
    { key: "contact_phone", label: "Téléphone" },
    { key: "contact_address", label: "Adresse" },
  ];

  const socialFields = [
    { key: "facebook_url", label: "Facebook" },
    { key: "instagram_url", label: "Instagram" },
    { key: "linkedin_url", label: "LinkedIn" },
    { key: "twitter_url", label: "X (Twitter)" },
  ];

  return (
    <div className="space-y-8 max-w-[800px]">
      {/* Site Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Save className="w-5 h-5 text-beco-primary" />
          <h3 className="font-semibold text-gray-800">Informations du site</h3>
        </div>
        <div className="space-y-4">
          {siteFields.map((field) => (
            <div key={field.key} className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 w-36 flex-shrink-0">{field.label}</label>
              <div className="flex-1 relative">
                <input
                  defaultValue={getSetting(field.key)}
                  onBlur={(e) => updateSetting(field.key, e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary pr-8"
                />
                {savedKey === field.key && <Check className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-beco-primary" />
          <h3 className="font-semibold text-gray-800">Réseaux sociaux</h3>
        </div>
        <div className="space-y-4">
          {socialFields.map((field) => (
            <div key={field.key} className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 w-36 flex-shrink-0">{field.label}</label>
              <div className="flex-1 relative">
                <input
                  defaultValue={getSetting(field.key)}
                  onBlur={(e) => updateSetting(field.key, e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary pr-8"
                  placeholder="https://..."
                />
                {savedKey === field.key && <Check className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Users */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-beco-primary" />
            <h3 className="font-semibold text-gray-800">Administrateurs</h3>
          </div>
          <button onClick={() => setShowAddUser(!showAddUser)} className="text-sm text-beco-primary hover:underline">
            {showAddUser ? "Annuler" : "Ajouter un administrateur"}
          </button>
        </div>

        {showAddUser && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Nom d'utilisateur" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} className="px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary" />
              <input placeholder="Mot de passe" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Nom complet" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary" />
              <input placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary" />
            </div>
            <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "admin" | "superadmin" })} className="px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary bg-white">
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
            <button
              onClick={() => {
                if (!newUser.username || !newUser.password || !newUser.name) return;
                createUserMut.mutate(newUser, { onSuccess: () => { setShowAddUser(false); setNewUser({ username: "", password: "", name: "", email: "", role: "admin" }); } });
              }}
              disabled={createUserMut.isPending}
              className="btn-primary text-sm"
            >
              Créer l'administrateur
            </button>
          </div>
        )}

        <div className="divide-y divide-gray-50">
          {adminUsersList?.map((u) => (
            <div key={u.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-800">{u.name}</p>
                <p className="text-xs text-gray-500">@{u.username} &middot; {u.email} &middot; <span className="capitalize">{u.role}</span></p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${u.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                  {u.isActive ? "Actif" : "Inactif"}
                </span>
                <button
                  onClick={() => { if (confirm(u.isActive ? "Désactiver cet utilisateur ?" : "Réactiver cet utilisateur ?")) toggleUserMut.mutate({ id: u.id }); }}
                  className="text-xs text-gray-500 hover:text-beco-primary"
                >
                  {u.isActive ? "Désactiver" : "Activer"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
