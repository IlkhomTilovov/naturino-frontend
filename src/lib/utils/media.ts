const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5004/api/v1").replace(/\/api\/v1\/?$/, "");

export function resolveMediaUrl(url?: string | null): string | null {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_ORIGIN}${url}`;
}

export const FALLBACK_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YxZjVmOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCIgZmlsbD0iI2NiZDVlMSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+TmF0dXJpbm88L3RleHQ+PC9zdmc+";
