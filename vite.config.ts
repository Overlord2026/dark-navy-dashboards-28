import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { componentTagger } from "lovable-tagger";
import { execSync } from "node:child_process";

const gitHash = (() => {
  try { return execSync("git rev-parse --short HEAD").toString().trim(); }
  catch { return "nogit"; }
})();
const utc = new Date().toISOString();
/* Allow CI/Release script to override */
const BUILD_ID = process.env.BUILD_ID ? String(process.env.BUILD_ID) : `${gitHash}-${utc}`;

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  cacheDir: "node_modules/.vite-bfo-final",
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@radix-ui/react-toast": path.resolve(__dirname, "src/shims/radix-toast-shim.tsx"),
      "react": path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "node_modules/react/jsx-runtime.js"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "node_modules/react/jsx-dev-runtime.js"),
      "react-dom/client": path.resolve(__dirname, "node_modules/react-dom/client.js"),
    },
    dedupe: ["react","react-dom"]
  },
  optimizeDeps: {
    include: ["react","react-dom","react/jsx-runtime","react/jsx-dev-runtime","sonner"],
    exclude: ["@radix-ui/react-toast"],
    dedupe: ["react", "react-dom"]
  },
  define: {
    "__BUILD_ID__": JSON.stringify(Date.now()),
    "process.env.NODE_ENV": JSON.stringify(mode || "development")
  }
}));
