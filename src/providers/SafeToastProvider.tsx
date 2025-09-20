import React from 'react'
import { ToastProvider } from '@/components/ui/toast'
import { Toaster } from '@/components/ui/toaster'

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
