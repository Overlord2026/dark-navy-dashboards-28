import React from 'react'
import { Toaster } from '@/components/ui/toaster'

interface SafeToastProviderProps {
  children: React.ReactNode
}

export function SafeToastProvider({ children }: SafeToastProviderProps) {
  return (
    <>
      {children}
      {/* keep app toasts working without Radix provider */}
      <Toaster />
    </>
  )
}
