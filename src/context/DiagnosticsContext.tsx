
import React, { createContext, useContext, useState, useEffect } from 'react';

type DiagnosticsContextType = {
  isDiagnosticsModeEnabled: boolean;
  toggleDiagnosticsMode: () => void;
  isDevelopmentMode: boolean;
  isCiMode: boolean;
};

const DiagnosticsContext = createContext<DiagnosticsContextType | undefined>(undefined);

export function DiagnosticsProvider({ children }: { children: React.ReactNode }) {
  const [isDiagnosticsModeEnabled, setIsDiagnosticsModeEnabled] = useState(false);
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);
  const [isCiMode, setIsCiMode] = useState(false);
  
  useEffect(() => {
    // Check if in development mode
    const isDev = import.meta.env.DEV || 
                  window.location.hostname === 'localhost' ||
                  window.location.hostname.includes('lovableproject.com');
    setIsDevelopmentMode(isDev);
    
    // Check if in CI mode
    const isCI = import.meta.env.CI === 'true' || 
                 import.meta.env.CI === '1' || 
                 import.meta.env.GITHUB_ACTIONS === 'true';
    setIsCiMode(isCI);
    
    // Check if URL has a diagnostics parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('diagnostics')) {
      setIsDiagnosticsModeEnabled(true);
    }
    
    // Enable diagnostics automatically in CI mode
    if (isCI) {
      setIsDiagnosticsModeEnabled(true);
    }
    
    // Set up keyboard shortcut: Alt+Shift+D
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDev && e.altKey && e.shiftKey && e.key === 'D') {
        setIsDiagnosticsModeEnabled(prev => !prev);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  const toggleDiagnosticsMode = () => {
    setIsDiagnosticsModeEnabled(prev => !prev);
  };
  
  return (
    <DiagnosticsContext.Provider
      value={{
        isDiagnosticsModeEnabled,
        toggleDiagnosticsMode,
        isDevelopmentMode,
        isCiMode
      }}
    >
      {children}
    </DiagnosticsContext.Provider>
  );
}

export function useDiagnosticsContext() {
  const context = useContext(DiagnosticsContext);
  if (context === undefined) {
    throw new Error('useDiagnosticsContext must be used within a DiagnosticsProvider');
  }
  return context;
}
