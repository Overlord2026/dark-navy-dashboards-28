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
      // Force single React instance
      "react": path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
    dedupe: ["react","react-dom","react-dom/client","react/jsx-runtime","react/jsx-dev-runtime"],
  },
  optimizeDeps: { 
    include: ["react","react-dom","react-dom/client","react/jsx-runtime"],
    exclude: ["@radix-ui/react-toast"],
    force: true // Force re-optimization
  },
  define: {
    // Force single React instance and build-time defines  
    'process.env.NODE_ENV': JSON.stringify(mode),
    __RUNTIME_REPO__: JSON.stringify(process.env.GITHUB_REPOSITORY || 'unknown'),
    __RUNTIME_BRANCH__: JSON.stringify(process.env.VERCEL_GIT_COMMIT_REF || process.env.GITHUB_REF_NAME || 'local'),
    __ENABLE_NIL__: JSON.stringify(false),
    // Ensure React globals are available
    global: 'globalThis',
  }
}));
