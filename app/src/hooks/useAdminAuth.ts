import { useCallback } from "react";
import { useAdminMe } from "@/lib/api/admin";
import { queryClient } from "@/providers/api";

export interface AdminUser {
  id: number;
  name: string;
  username: string;
  email: string | null;
  role: string;
}

export function useAdminAuth() {
  const { data: user, isLoading } = useAdminMe();

  const logout = useCallback(() => {
    localStorage.removeItem("adminToken");
    queryClient.clear();
    window.location.href = "/administrateur";
  }, []);

  return {
    user: user as AdminUser | null | undefined,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin" || user?.role === "superadmin",
    isSuperAdmin: user?.role === "superadmin",
    logout,
  };
}
