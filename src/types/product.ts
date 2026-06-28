export interface ProductImage {
  id: string;
  mediaFileId: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductTranslation {
  name?: string | null;
  shortDescription?: string | null;
  description?: string | null;
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
  translations: Record<string, ProductTranslation>;
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
  translations?: Record<string, ProductTranslation>;
}

export interface CategoryTranslation {
  name?: string | null;
  description?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export interface ProductCategory {
  id: string;
  parentCategoryId?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  metaTitleUz?: string | null;
  metaDescriptionUz?: string | null;
  metaKeywords?: string | null;
  isIndexable: boolean;
  isFollow: boolean;
  translations: Record<string, CategoryTranslation>;
}

export interface ProductCategoryReorderItem {
  id: string;
  sortOrder: number;
}

export interface ProductCategoryFormValues {
  parentCategoryId?: string | null;
  name: string;
  slug?: string;
  description?: string;
  imageFileId?: string | null;
  sortOrder: number;
  isActive: boolean;
  metaTitleUz?: string;
  metaDescriptionUz?: string;
  metaKeywords?: string;
  isIndexable: boolean;
  isFollow: boolean;
  translations?: Record<string, CategoryTranslation>;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
