
import React from 'react';
import { useLocation } from 'react-router-dom';

interface NavigationDebuggerProps {
  show?: boolean;
}

export const NavigationDebugger: React.FC<NavigationDebuggerProps> = ({ show = false }) => {
  const location = useLocation();
  
  if (!show) return null;
  
  return (
    <div className="fixed bottom-0 right-0 bg-black/80 text-white p-2 text-xs z-50 max-w-xs">
      <h4 className="font-bold">Navigation Debug</h4>
      <p>Current path: {location.pathname}</p>
      <p>Path segments: {location.pathname.split('/').filter(Boolean).join(', ')}</p>
    </div>
  );
};

// Add this component to your ThreeColumnLayout to debug navigation issues
// <NavigationDebugger show={true} />
