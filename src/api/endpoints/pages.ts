import { apiClient } from "../client";
import type { Page, PageSection, PageSectionContent, UpdatePageInput } from "../../types/page";

export const pagesApi = {
  getAll: () => apiClient.get<Page[]>("/pages").then((r) => r.data),

  getBySlug: (slug: string) => apiClient.get<Page>(`/pages/by-slug/${slug}`).then((r) => r.data),

  getById: (id: string) => apiClient.get<Page>(`/pages/${id}`).then((r) => r.data),

  update: (id: string, dto: UpdatePageInput) => apiClient.put<Page>(`/pages/${id}`, dto).then((r) => r.data),

  updateSection: (sectionId: string, dto: { sortOrder: number; isEnabled: boolean; content: PageSectionContent }) =>
    apiClient.put<PageSection>(`/pages/sections/${sectionId}`, dto).then((r) => r.data),

  addSection: (pageId: string, dto: { sectionType: number; sortOrder: number; content?: PageSectionContent }) =>
    apiClient.post<PageSection>(`/pages/${pageId}/sections`, dto).then((r) => r.data),

  deleteSection: (sectionId: string) => apiClient.delete(`/pages/sections/${sectionId}`).then((r) => r.data),

  publish: (id: string) => apiClient.patch<Page>(`/pages/${id}/publish`).then((r) => r.data),
};
