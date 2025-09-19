import React from 'react'
import { Toaster } from '@/components/ui/toaster'
import { ToastProvider } from '@/components/ui/toast'

interface SafeToastProviderProps {
  children: React.ReactNode
}

export function SafeToastProvider({ children }: SafeToastProviderProps) {
  return (
    <ToastProvider>
      {children}
      <Toaster />
    </ToastProvider>
  )
}
