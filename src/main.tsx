
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/chartColors.css'
import emailjs from '@emailjs/browser'
import { initializeAnalytics } from './lib/analytics'
import { registerServiceWorker, promptInstallPWA } from './lib/pwa'

// Initialize EmailJS at app entry point
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'rfbjUYJ8iPHEZaQvx')

// Initialize analytics
initializeAnalytics()

// Register service worker for PWA
registerServiceWorker()

// Set up PWA install prompt
promptInstallPWA()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
