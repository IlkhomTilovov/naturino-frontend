export interface Language {
  id: string;
  name: string;
  nativeName: string;
  code: string;
  locale: string;
  flag?: string | null;
  direction: "ltr" | "rtl";
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface LanguageFormValues {
  name: string;
  nativeName: string;
  code: string;
  locale: string;
  flag?: string;
  direction: "ltr" | "rtl";
  isActive: boolean;
  sortOrder: number;
}

export interface LanguageReorderItem {
  id: string;
  sortOrder: number;
}
