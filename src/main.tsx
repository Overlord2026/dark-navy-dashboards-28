
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/chartColors.css'
import emailjs from '@emailjs/browser'

// Initialize EmailJS at app entry point
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'rfbjUYJ8iPHEZaQvx')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
