export type MediaSourceType = "Local" | "ExternalUrl" | number;

export interface MediaFile {
  id: string;
  fileName: string;
  originalFileName: string;
  url: string;
  mimeType: string;
  sourceType: MediaSourceType;
  fileSizeBytes: number;
  altText?: string | null;
  createdAt: string;
}
