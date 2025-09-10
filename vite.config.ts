import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ['react', 'react-dom'],
  },
  build: {
    // Code splitting for bundles >200KB
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-toast'],
          routing: ['react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          charts: ['recharts'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Split large features by actual existing files
          personas: [
            './src/components/bfo/PersonaDashboard.tsx'
          ],
          admin: [
            './src/pages/admin/AdminHQ.tsx',
            './src/components/bfo/AdminMigrations.tsx',
            './src/components/bfo/SecurityDashboard.tsx'
          ],
          marketplace: [
            './src/pages/marketplace/Index.tsx'
          ]
        }
      }
    },
    // Performance optimizations
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    cssCodeSplit: true
  },
  // Performance hints
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
    exclude: ['@vite/client', '@vite/env']
  }
}));
