
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import './index.css'
import './styles/brand.css'
import './styles/nil-a11y-perf.css'
import './styles/chartColors.css'
import './styles/accessibility.css'
import emailjs from '@emailjs/browser'
import { initializeAnalytics } from './lib/analytics'
import { registerServiceWorker, promptInstallPWA } from './lib/pwa'
import { AuthProvider } from '@/context/AuthContext'
import { EntitlementsProvider } from '@/context/EntitlementsContext'
import { removeProductionLogs } from './utils/consoleRemoval'
import { setupNetworkErrorHandling } from './components/monitoring/network'
import { initializeAccessibility } from './utils/accessibility'

// Initialize production optimizations
removeProductionLogs()
setupNetworkErrorHandling()
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <EntitlementsProvider>
        <RouterProvider router={router} />
      </EntitlementsProvider>
    </AuthProvider>
  </React.StrictMode>,
)
