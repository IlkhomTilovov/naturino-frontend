import { apiClient } from "../client";
import type { Theme, ThemeFormValues } from "../../types/theme";

export const themesApi = {
  getAll: () => apiClient.get<Theme[]>("/themes").then((r) => r.data),

  getById: (id: string) => apiClient.get<Theme>(`/themes/${id}`).then((r) => r.data),

  getActive: () => apiClient.get<Theme>("/themes/active").then((r) => r.data),

  create: (dto: ThemeFormValues) => apiClient.post<Theme>("/themes", dto).then((r) => r.data),

  update: (id: string, dto: ThemeFormValues) => apiClient.put<Theme>(`/themes/${id}`, dto).then((r) => r.data),

  remove: (id: string) => apiClient.delete(`/themes/${id}`).then((r) => r.data),

  duplicate: (id: string) => apiClient.patch<Theme>(`/themes/${id}/duplicate`).then((r) => r.data),

  activate: (id: string) => apiClient.patch<Theme>(`/themes/${id}/activate`).then((r) => r.data),
};
