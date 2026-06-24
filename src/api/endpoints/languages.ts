import { apiClient } from "../client";
import type { Language, LanguageFormValues, LanguageReorderItem } from "../../types/language";

export const languagesApi = {
  getAll: () => apiClient.get<Language[]>("/languages").then((r) => r.data),

  getById: (id: string) => apiClient.get<Language>(`/languages/${id}`).then((r) => r.data),

  create: (dto: LanguageFormValues) => apiClient.post<Language>("/languages", dto).then((r) => r.data),

  update: (id: string, dto: LanguageFormValues) =>
    apiClient.put<Language>(`/languages/${id}`, dto).then((r) => r.data),

  remove: (id: string) => apiClient.delete(`/languages/${id}`).then((r) => r.data),

  setDefault: (id: string) => apiClient.patch<Language>(`/languages/${id}/set-default`).then((r) => r.data),

  toggleStatus: (id: string) => apiClient.patch<Language>(`/languages/${id}/toggle-status`).then((r) => r.data),

  reorder: (items: LanguageReorderItem[]) => apiClient.patch(`/languages/sort`, items).then((r) => r.data),
};
