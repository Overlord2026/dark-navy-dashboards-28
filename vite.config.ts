import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  server: { host: "::", port: 8080 },
  plugins: [react()], // do not include swc or other react plugins
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    dedupe: ["react","react-dom","react-dom/client","react/jsx-runtime","react/jsx-dev-runtime"],
  },
  optimizeDeps: { include: ["react","react-dom","react-dom/client"] }
});
