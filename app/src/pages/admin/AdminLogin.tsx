import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Leaf, Lock, User } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, isLoading } = useAdminAuth();

  const loginMutation = trpc.adminAuth.login.useMutation({
    onSuccess: (data) => {
      if (data.success && data.token) {
        localStorage.setItem("adminToken", data.token);
        window.location.href = "/administrateur/dashboard";
      } else {
        setError(data.error || "Erreur de connexion");
      }
    },
    onError: (err) => {
      setError(err.message || "Erreur de connexion");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-beco-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    window.location.href = "/administrateur/dashboard";
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-beco-primary mb-4">
            <Leaf className="w-7 h-7 text-beco-secondary" />
          </div>
          <h1 className="font-playfair font-bold italic text-2xl text-beco-dark">
            BECO
          </h1>
          <p className="text-sm text-gray-500 mt-1">Espace d'administration</p>
        </div>

        {/* Login form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="font-raleway font-semibold text-lg text-beco-dark mb-1">
            Connexion
          </h2>
          <p className="font-raleway text-sm text-gray-500 mb-6">
            Connectez-vous avec vos identifiants personnels
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full ps-10 pe-4 py-2.5 border border-gray-300 rounded-lg font-raleway text-sm outline-none focus:border-beco-primary focus:ring-1 focus:ring-beco-primary/20 transition-all"
                  placeholder="Nom d'utilisateur"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full ps-10 pe-4 py-2.5 border border-gray-300 rounded-lg font-raleway text-sm outline-none focus:border-beco-primary focus:ring-1 focus:ring-beco-primary/20 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-beco-primary text-white py-2.5 rounded-lg font-raleway font-semibold text-sm hover:bg-beco-primary-light transition-colors disabled:opacity-60"
            >
              {loginMutation.isPending ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              Espace réservé aux administrateurs
            </p>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-gray-400">
          <a href="/" className="hover:text-beco-primary transition-colors">
            &larr; Retour au site
          </a>
        </p>
      </div>
    </div>
  );
}
