import { apiClient } from "../client";

export interface CertificateTranslation {
  title?: string;
  description?: string;
}

export interface Certificate {
  id: string;
  title: string;
  description?: string;
  issuedBy?: string;
  certificateNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  icon?: string;
  category?: string;
  scope?: string;
  verificationUrl?: string;
  translations: Record<string, CertificateTranslation>;
  fileId?: string;
  fileUrl?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateFormValues {
  title: string;
  description?: string;
  issuedBy?: string;
  certificateNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  icon?: string;
  category?: string;
  scope?: string;
  verificationUrl?: string;
  translations?: Record<string, CertificateTranslation>;
  fileId?: string;
  sortOrder: number;
  isActive: boolean;
}

export const CERTIFICATE_CATEGORIES = [
  { value: "quality", label: "Sifat boshqaruvi" },
  { value: "safety", label: "Xavfsizlik" },
  { value: "halal", label: "Halol" },
  { value: "export", label: "Eksport" },
  { value: "veterinary", label: "Veterinariya" },
  { value: "laboratory", label: "Laboratoriya" },
] as const;

export const CERTIFICATE_SCOPES = [
  { value: "international", label: "Xalqaro" },
  { value: "eu", label: "Yevropa Ittifoqi" },
  { value: "cis", label: "MDH" },
  { value: "uzbekistan", label: "O'zbekiston" },
] as const;

export const certificatesApi = {
  getAll: () => apiClient.get<Certificate[]>("/certificates").then((r) => r.data),
  getById: (id: string) => apiClient.get<Certificate>(`/certificates/${id}`).then((r) => r.data),
  create: (dto: CertificateFormValues) => apiClient.post<Certificate>("/certificates", dto).then((r) => r.data),
  update: (id: string, dto: CertificateFormValues) => apiClient.put<Certificate>(`/certificates/${id}`, dto).then((r) => r.data),
  remove: (id: string) => apiClient.delete(`/certificates/${id}`).then((r) => r.data),
  toggleStatus: (id: string) => apiClient.patch<Certificate>(`/certificates/${id}/toggle-status`).then((r) => r.data),
  reorder: (items: { id: string; sortOrder: number }[]) => apiClient.patch("/certificates/sort", items).then((r) => r.data),
};
