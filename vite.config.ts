import path from "node:path";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      output: {
        // Split large, stable third-party libraries into their own chunks so a
        // change in app code doesn't bust the cached vendor bundle.
        manualChunks: (id: string) => {
          if (!id.includes("node_modules")) return;
          if (/[\\/]react(?:-dom|-router-dom)?[\\/]/.test(id)) return "react-vendor";
          if (/[\\/](?:react-hook-form|@hookform|zod)[\\/]/.test(id)) return "form-vendor";
          if (/[\\/](?:@tanstack|axios)[\\/]/.test(id)) return "query-vendor";
          if (/[\\/]@dnd-kit[\\/]/.test(id)) return "dnd-vendor";
        },
      },
    },
  },
})
