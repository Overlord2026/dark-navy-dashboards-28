import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from '@/context/AuthContext';
import { EntitlementsProvider } from '@/context/EntitlementsContext';
import { ToolsProvider } from '@/contexts/ToolsContext';
import { SafeToastProvider } from '@/providers/SafeToastProvider';
import { ErrorBoundary } from '@/components/system/ErrorBoundary';
import emailjs from '@emailjs/browser';
import { initializeAnalytics } from './lib/analytics';
import { registerServiceWorker, promptInstallPWA } from './lib/pwa';
import { removeProductionLogs } from './utils/consoleRemoval';
import { initializeAccessibility } from './utils/accessibility';
import { setupNetworkErrorHandling } from "@/components/monitoring/network";
import './index.css';
import './styles/brand.css';
import './styles/chartColors.css';
import './styles/accessibility.css';

// CRITICAL: Ensure React runtime is properly initialized
import React from 'react';
if (!React || typeof React.useState !== 'function' || typeof React.createElement !== 'function') {
  throw new Error(`React runtime initialization failed. React: ${!!React}, useState: ${typeof React?.useState}, createElement: ${typeof React?.createElement}`);
}

// Initialize production optimizations
removeProductionLogs();
initializeAccessibility();

// Initialize EmailJS at app entry point
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'rfbjUYJ8iPHEZaQvx');

// Initialize analytics
initializeAnalytics();

// Register service worker for PWA
registerServiceWorker();
promptInstallPWA();

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

const el = document.getElementById('root');
if (!el) throw new Error('Root element #root not found');

createRoot(el).render(
  <StrictMode>
    <BrowserRouter>
      <SafeToastProvider>
        <AuthProvider>
          <EntitlementsProvider>
            <ToolsProvider>
              <ErrorBoundary>
                <App />
              </ErrorBoundary>
            </ToolsProvider>
          </EntitlementsProvider>
        </AuthProvider>
      </SafeToastProvider>
    </BrowserRouter>
  </StrictMode>
);

// Optional HMR cleanup
if ((import.meta as any).hot) {
  (import.meta as any).hot.dispose(() => {
    try { teardown?.(); } catch {}
  });
}