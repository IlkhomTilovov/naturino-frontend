function readEnv(key: string, fallback: string): string {
  const value = import.meta.env[key];
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

export const env = {
  apiBaseUrl: readEnv("VITE_API_BASE_URL", "http://localhost:5004/api/v1"),
};
