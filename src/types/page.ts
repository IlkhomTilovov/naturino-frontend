export interface PageSectionContent {
  [key: string]: unknown;
}

export interface PageSection {
  id: string;
  pageId: string;
  sectionType: number | string;
  sortOrder: number;
  isEnabled: boolean;
  content: PageSectionContent;
  hasUnpublishedChanges?: boolean;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  isHomePage: boolean;
  isPublished: boolean;
  updatedAt: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  ogImageUrl?: string | null;
  isIndexable: boolean;
  isFollow: boolean;
  sections: PageSection[];
}

export interface UpdatePageInput {
  title: string;
  isPublished: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  ogImageFileId?: string | null;
  isIndexable: boolean;
  isFollow: boolean;
}
