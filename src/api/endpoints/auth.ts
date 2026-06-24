import { apiClient } from "../client";
import type { LoginResponse } from "../../types/auth";

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<LoginResponse>("/auth/login", { email, password }).then((r) => r.data),

  logout: (refreshToken: string) => apiClient.post("/auth/logout", { refreshToken }).then((r) => r.data),
};
