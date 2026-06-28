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

export interface NutritionalItem {
  label: string;
  value?: string | null;
  unit?: string | null;
}

export interface PackagingOption {
  weight?: string | null;
  unit?: string | null;
  barcode?: string | null;
  isDefault?: boolean;
}

export interface IngredientItem {
  name: string;
  percentage?: string | null;
}

export interface ProductCertification {
  code: string;
  certificateNumber?: string | null;
  expiryDate?: string | null;
}

export interface ExportInfo {
  moq?: string | null;
  hsCode?: string | null;
  incoterms: string[];
  productionCapacity?: string | null;
  leadTime?: string | null;
  exportMarkets: string[];
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
  nutritionalInfo: NutritionalItem[];
  packagingOptions: PackagingOption[];
  ingredientsList: IngredientItem[];
  certifications: ProductCertification[];
  exportInfo: ExportInfo;
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
  nutritionalInfo?: NutritionalItem[];
  packagingOptions?: PackagingOption[];
  ingredientsList?: IngredientItem[];
  certifications?: ProductCertification[];
  exportInfo?: ExportInfo;
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
