import React, { useEffect, useState } from 'react';
import { Toaster } from 'sonner';

// Ensure React is properly initialized before creating provider
if (!React || typeof React.createElement !== 'function') {
  throw new Error('React runtime not properly initialized in SafeToastProvider');
}

export function SafeToastProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Delay mounting to ensure React is fully initialized
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      {children}
      {mounted && <Toaster richColors closeButton />}
    </>
  );
}

// Keep default export too, so both import styles work
export default SafeToastProvider;
