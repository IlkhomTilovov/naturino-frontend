import { apiClient } from "../client";

export interface Shop {
  id: string;
  name: string;
  country: string;
  city: string;
  address: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShopFormValues {
  name: string;
  country: string;
  city: string;
  address: string;
  phone?: string;
  latitude?: number | null;
  longitude?: number | null;
  isActive: boolean;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ShopQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
}

export const shopsApi = {
  getAllActive: () => apiClient.get<Shop[]>("/shops/public").then((r) => r.data),
  getPaged: (query: ShopQuery) => apiClient.get<PagedResult<Shop>>("/shops", { params: query }).then((r) => r.data),
  getById: (id: string) => apiClient.get<Shop>(`/shops/${id}`).then((r) => r.data),
  create: (dto: ShopFormValues) => apiClient.post<Shop>("/shops", dto).then((r) => r.data),
  update: (id: string, dto: ShopFormValues) => apiClient.put<Shop>(`/shops/${id}`, dto).then((r) => r.data),
  remove: (id: string) => apiClient.delete(`/shops/${id}`).then((r) => r.data),
  toggleStatus: (id: string) => apiClient.patch<Shop>(`/shops/${id}/toggle-status`).then((r) => r.data),
};
