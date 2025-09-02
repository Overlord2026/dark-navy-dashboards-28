
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import './index.css'
import './styles/brand.css'
import './styles/nil-a11y-perf.css'
import './styles/chartColors.css'
import emailjs from '@emailjs/browser'
import { initializeAnalytics } from './lib/analytics'
import { registerServiceWorker, promptInstallPWA } from './lib/pwa'
import { AuthProvider } from '@/context/AuthContext'
import { EntitlementsProvider } from '@/context/EntitlementsContext'

// Initialize EmailJS at app entry point
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'rfbjUYJ8iPHEZaQvx')

// Initialize analytics
initializeAnalytics()

// Initialize job system for admin users
import('@/jobs/sample-jobs').then(() => {
  console.log('[App] Job system samples loaded');
}).catch(console.error);

// Register service worker for PWA
registerServiceWorker()

// Set up PWA install prompt
promptInstallPWA()

// Initialize Web Vitals tracking
if (import.meta.env.PROD || import.meta.env.DEV) {
  import('./scripts/vitals').then(({ vitalsTracker }) => {
    console.log('[Web Vitals] Tracking initialized');
  }).catch(err => {
    console.warn('[Web Vitals] Failed to initialize:', err);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <EntitlementsProvider>
        <RouterProvider router={router} />
      </EntitlementsProvider>
    </AuthProvider>
  </React.StrictMode>,
)
