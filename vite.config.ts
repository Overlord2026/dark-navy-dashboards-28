import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  server: { host: "::", port: 8080 },
  plugins: [react()], // do NOT include swc or other dev-time react plugins
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@tax": path.resolve(__dirname, "./src/features/tax"),
      "@advisor": path.resolve(__dirname, "./src/features/advisors/platform"),
      // IMPORTANT: do not alias 'react' or 'react-dom' to node_modules paths here
      // External modules (advisor/marketplace/tax) should be imported as source via their alias, not as separate apps
    },
    dedupe: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime"
    ],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-dom/client"]
  }
});
