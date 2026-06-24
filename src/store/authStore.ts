import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CurrentUser } from "../types/auth";

interface AuthState {
  user: CurrentUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setSession: (user: CurrentUser, accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  clearSession: () => void;
  hasPermission: (code: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setSession: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),
      setAccessToken: (accessToken) => set({ accessToken }),
      clearSession: () => set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
      // Single-admin site: any authenticated SuperAdmin has full access regardless of code.
      hasPermission: () => get().user?.roles.includes("SuperAdmin") ?? false,
    }),
    { name: "naturino-admin-auth" },
  ),
);
