import React, { createContext, useContext, useState } from 'react';

interface DemoContextType {
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  isDemo: boolean;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [demoMode, setDemoMode] = useState(true); // Default true for public demos

  return (
    <DemoContext.Provider
      value={{
        demoMode,
        setDemoMode,
        isDemo: demoMode
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};