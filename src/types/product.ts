export interface ProductImage {
  id: string;
  mediaFileId: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  categoryId: string;
  categoryName: string;
  sku: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  price: number;
  oldPrice?: number | null;
  stockQuantity: number;
  weight?: number | null;
  brand?: string | null;
  ageGroup?: string | null;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
}

export interface ProductFormValues {
  categoryId: string;
  sku: string;
  name: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  price: number;
  oldPrice?: number | null;
  stockQuantity: number;
  weight?: number | null;
  brand?: string;
  ageGroup?: string;
  isFeatured: boolean;
  isActive: boolean;
}

export interface ProductCategory {
  id: string;
  parentCategoryId?: string | null;
  name: string;
  nameRu?: string | null;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  metaTitleUz?: string | null;
  metaTitleRu?: string | null;
  metaDescriptionUz?: string | null;
  metaDescriptionRu?: string | null;
  metaKeywords?: string | null;
  isIndexable: boolean;
  isFollow: boolean;
}

export interface ProductCategoryReorderItem {
  id: string;
  sortOrder: number;
}

export interface ProductCategoryFormValues {
  parentCategoryId?: string | null;
  name: string;
  nameRu?: string;
  slug?: string;
  description?: string;
  imageFileId?: string | null;
  sortOrder: number;
  isActive: boolean;
  metaTitleUz?: string;
  metaTitleRu?: string;
  metaDescriptionUz?: string;
  metaDescriptionRu?: string;
  metaKeywords?: string;
  isIndexable: boolean;
  isFollow: boolean;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
