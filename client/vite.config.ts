import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    chunkSizeWarningLimit: 1000, // optional (just hides warning)

    rollupOptions: {
      output: {
        manualChunks: {
          router: ["react-router-dom"],
          motion: ["framer-motion"],
          charts: ["recharts"],
          icons: ["lucide-react"],
          vendor: ["axios"],
        },
      },
    },
  },
});
