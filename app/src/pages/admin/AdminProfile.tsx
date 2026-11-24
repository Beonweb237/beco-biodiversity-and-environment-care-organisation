import { useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  Shield,
  Lock,
} from "lucide-react";
import { ToastContainer, type ToastData } from "./AdminToast";

export default function AdminProfile() {
  const { user } = useAdminAuth();
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6 max-w-[600px]">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div>
        <h2 className="text-lg font-semibold text-gray-800">Mon profil</h2>
        <p className="text-sm text-gray-500 mt-1">Informations de votre compte administrateur</p>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-beco-primary/10 flex items-center justify-center">
            <Shield className="w-7 h-7 text-beco-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-800">{user?.name}</h3>
            <p className="text-sm text-gray-500">@{user?.username}</p>
            <span className="inline-block mt-1 text-xs bg-beco-olive-light text-beco-primary px-2.5 py-0.5 rounded-full capitalize font-medium">
              {user?.role === "superadmin" ? "Super Administrateur" : "Administrateur"}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input
              defaultValue={user?.name}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary bg-gray-50 text-gray-500 cursor-not-allowed"
              readOnly
            />
            <p className="text-xs text-gray-400 mt-1">Contactez un super administrateur pour modifier</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
            <input
              defaultValue={user?.username}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary bg-gray-50 text-gray-500 cursor-not-allowed"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              defaultValue={user?.email ?? ""}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary bg-gray-50 text-gray-500 cursor-not-allowed"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
            <input
              defaultValue={user?.role === "superadmin" ? "Super Administrateur" : "Administrateur"}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-beco-primary bg-gray-50 text-gray-500 cursor-not-allowed"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Security info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-beco-primary" />
          <h3 className="font-semibold text-gray-800">Sécurité</h3>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-700">
            La modification du mot de passe n'est pas disponible dans cette version.
            Contactez un super administrateur pour modifier vos informations.
          </p>
        </div>
      </div>
    </div>
  );
}
