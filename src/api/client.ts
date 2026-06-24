import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "../config/env";
import { useAuthStore } from "../store/authStore";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await axios.post<{ accessToken: string; refreshToken: string }>(
      `${env.apiBaseUrl}/auth/refresh`,
      { refreshToken },
    );
    useAuthStore.getState().setSession(
      useAuthStore.getState().user!,
      response.data.accessToken,
      response.data.refreshToken,
    );
    return response.data.accessToken;
  } catch {
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retried && !originalRequest.url?.includes("/auth/")) {
      originalRequest._retried = true;

      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });

      const newAccessToken = await refreshPromise;

      if (newAccessToken) {
        originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
        return apiClient(originalRequest);
      }

      useAuthStore.getState().clearSession();
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  },
);
