import { apiClient } from "../client";
import type { MediaFile } from "../../types/media";

export const mediaApi = {
  getAll: () => apiClient.get<MediaFile[]>("/media").then((r) => r.data),

  upload: (file: File, onProgress?: (percent: number) => void) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient
      .post<MediaFile>("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100));
        },
      })
      .then((r) => r.data);
  },

  createFromUrl: (url: string, altText?: string) =>
    apiClient.post<MediaFile>("/media/from-url", { url, altText }).then((r) => r.data),

  remove: (id: string) => apiClient.delete(`/media/${id}`).then((r) => r.data),
};
