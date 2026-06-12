import { useCallback } from "react";
import { trpc } from "@/providers/trpc";

export interface AdminUser {
  id: number;
  name: string;
  username: string;
  email: string | null;
  role: string;
}

export function useAdminAuth() {
  const utils = trpc.useUtils();
  const { data: user, isLoading } = trpc.adminAuth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logout = useCallback(() => {
    localStorage.removeItem("adminToken");
    utils.adminAuth.me.invalidate();
    window.location.href = "/administrateur";
  }, [utils]);

  return {
    user: user as AdminUser | null | undefined,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin" || user?.role === "superadmin",
    isSuperAdmin: user?.role === "superadmin",
    logout,
  };
}
