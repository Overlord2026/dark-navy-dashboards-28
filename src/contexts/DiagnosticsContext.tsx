
import React, { createContext, useContext, useState } from 'react';

interface DiagnosticsContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const DiagnosticsContext = createContext<DiagnosticsContextType | undefined>(undefined);

export function DiagnosticsProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DiagnosticsContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DiagnosticsContext.Provider>
  );
}

export function useDiagnostics() {
  const context = useContext(DiagnosticsContext);
  if (context === undefined) {
    throw new Error('useDiagnostics must be used within a DiagnosticsProvider');
  }
  return context;
}
