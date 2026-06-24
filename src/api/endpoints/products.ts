import { apiClient } from "../client";
import type {
  PagedResult,
  Product,
  ProductCategory,
  ProductCategoryFormValues,
  ProductCategoryReorderItem,
  ProductFormValues,
  ProductImage,
} from "../../types/product";

export interface ProductQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export const productsApi = {
  getPaged: (query: ProductQuery) =>
    apiClient.get<PagedResult<Product>>("/products", { params: query }).then((r) => r.data),

  getById: (id: string) => apiClient.get<Product>(`/products/${id}`).then((r) => r.data),

  getBySlug: (slug: string) => apiClient.get<Product>(`/products/by-slug/${slug}`).then((r) => r.data),

  getRelated: (id: string, take = 4) =>
    apiClient.get<Product[]>(`/products/${id}/related`, { params: { take } }).then((r) => r.data),

  create: (dto: ProductFormValues) => apiClient.post<Product>("/products", dto).then((r) => r.data),

  update: (id: string, dto: ProductFormValues) =>
    apiClient.put<Product>(`/products/${id}`, dto).then((r) => r.data),

  remove: (id: string) => apiClient.delete(`/products/${id}`).then((r) => r.data),

  setActive: (id: string, isActive: boolean) =>
    apiClient.patch(`/products/${id}/active`, isActive, {
      headers: { "Content-Type": "application/json" },
    }),
};

export const productImagesApi = {
  getAll: (productId: string) =>
    apiClient.get<ProductImage[]>(`/products/${productId}/images`).then((r) => r.data),

  add: (productId: string, mediaFileIds: string[]) =>
    apiClient
      .post<ProductImage[]>(`/products/${productId}/images`, { mediaFileIds })
      .then((r) => r.data),

  remove: (productId: string, imageId: string) =>
    apiClient.delete(`/products/${productId}/images/${imageId}`).then((r) => r.data),

  setCover: (productId: string, imageId: string) =>
    apiClient.patch(`/products/${productId}/images/${imageId}/cover`).then((r) => r.data),

  reorder: (productId: string, imageIds: string[]) =>
    apiClient
      .patch(`/products/${productId}/images/reorder`, { imageIds })
      .then((r) => r.data),

  update: (productId: string, imageId: string, altText: string | null) =>
    apiClient
      .patch<ProductImage>(`/products/${productId}/images/${imageId}`, { altText })
      .then((r) => r.data),
};

export const productCategoriesApi = {
  getAll: () => apiClient.get<ProductCategory[]>("/product-categories").then((r) => r.data),

  create: (dto: ProductCategoryFormValues) =>
    apiClient.post<ProductCategory>("/product-categories", dto).then((r) => r.data),

  update: (id: string, dto: ProductCategoryFormValues) =>
    apiClient.put<ProductCategory>(`/product-categories/${id}`, dto).then((r) => r.data),

  remove: (id: string) => apiClient.delete(`/product-categories/${id}`).then((r) => r.data),

  reorder: (items: ProductCategoryReorderItem[]) =>
    apiClient.put(`/product-categories/reorder`, items).then((r) => r.data),
};
