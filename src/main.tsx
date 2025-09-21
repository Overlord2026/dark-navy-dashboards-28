
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './router'
import './index.css'
import './styles/brand.css'
import './styles/chartColors.css'
import './styles/accessibility.css'
import emailjs from '@emailjs/browser'
import { initializeAnalytics } from './lib/analytics'
import { registerServiceWorker, promptInstallPWA } from './lib/pwa'
import { AuthProvider } from '@/context/AuthContext'
import { EntitlementsProvider } from '@/context/EntitlementsContext'
import { removeProductionLogs } from './utils/consoleRemoval'
import { initializeAccessibility } from './utils/accessibility'
import GlobalErrorBoundary from "@/components/monitoring/GlobalErrorBoundary";
import { setupNetworkErrorHandling } from "@/components/monitoring/network";
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { SafeToastProvider } from '@/providers/SafeToastProvider';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Initialize production optimizations
removeProductionLogs()
initializeAccessibility()

// Initialize EmailJS at app entry point
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'rfbjUYJ8iPHEZaQvx')

// Initialize analytics
initializeAnalytics()

// Register service worker for PWA
registerServiceWorker()
promptInstallPWA()

// Initialize Web Vitals tracking (production logging removed)
if (import.meta.env.PROD || import.meta.env.DEV) {
  import('./scripts/vitals').then(({ vitalsTracker }) => {
    // Removed console.log for production
  }).catch(() => {
    // Silent fail in production
  });
}

const teardown = setupNetworkErrorHandling({
  onError: (p) => {
    // Optional: forward to your toast bus
    // window.dispatchEvent(new CustomEvent('toast', { detail: { title: 'Network error', payload: p }}));
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SafeToastProvider>
      <GlobalErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<div />}>
            <AuthProvider>
              <EntitlementsProvider>
                <RouterProvider router={router} />
              </EntitlementsProvider>
            </AuthProvider>
          </Suspense>
        </QueryClientProvider>
      </GlobalErrorBoundary>
    </SafeToastProvider>
  </React.StrictMode>
);

// Optional HMR cleanup
if ((import.meta as any).hot) {
  (import.meta as any).hot.dispose(() => {
    try { teardown?.(); } catch {}
  });
}
