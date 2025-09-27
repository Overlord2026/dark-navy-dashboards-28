import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: { port: 8080 },
  cacheDir: "node_modules/.vite-bfo-final",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "react": path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "node_modules/react/jsx-runtime.js"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "node_modules/react/jsx-dev-runtime.js"),
      "react-dom/client": path.resolve(__dirname, "node_modules/react-dom/client.js"),
      // keep if you previously shimmed Radix:
      // "@radix-ui/react-toast": path.resolve(__dirname, "src/shims/radix-toast-shim.tsx"),
    },
    dedupe: ["react","react-dom"]
  },
  optimizeDeps: {
    include: ["react","react-dom","react/jsx-runtime","react/jsx-dev-runtime","sonner"],
    // exclude: ["@radix-ui/react-toast"], // uncomment if shim in use
  },
  define: {
    "__BUILD_ID__": JSON.stringify(Date.now()),
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
  }
});
