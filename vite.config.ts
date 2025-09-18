import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: { host: "::", port: 8080 },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@advisor": path.resolve(__dirname, "src/features/advisors/platform"),
    },
    dedupe: ["react","react-dom","react-dom/client","react/jsx-runtime","react/jsx-dev-runtime"],
  },
  optimizeDeps: { 
    include: ["react","react-dom","react-dom/client"],
    exclude: ["@radix-ui/react-toast"] 
  },
  define: {
    // Force single React instance
    'process.env.NODE_ENV': JSON.stringify(mode)
  }
}));
