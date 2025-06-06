
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface DiagnosticsContextType {
  isRunning: boolean;
  results: any[];
  startDiagnostics: () => void;
  stopDiagnostics: () => void;
  clearResults: () => void;
}

const DiagnosticsContext = createContext<DiagnosticsContextType | undefined>(undefined);

export const DiagnosticsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { userProfile } = useAuth(); // Changed from useUser to useAuth

  const startDiagnostics = () => {
    setIsRunning(true);
    console.log('Starting diagnostics for user:', userProfile?.id);
  };

  const stopDiagnostics = () => {
    setIsRunning(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <DiagnosticsContext.Provider
      value={{
        isRunning,
        results,
        startDiagnostics,
        stopDiagnostics,
        clearResults
      }}
    >
      {children}
    </DiagnosticsContext.Provider>
  );
};

export const useDiagnostics = (): DiagnosticsContextType => {
  const context = useContext(DiagnosticsContext);
  if (context === undefined) {
    throw new Error('useDiagnostics must be used within a DiagnosticsProvider');
  }
  return context;
};
