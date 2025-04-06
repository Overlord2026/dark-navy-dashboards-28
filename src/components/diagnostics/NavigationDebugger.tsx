
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavigationDebuggerProps {
  show?: boolean;
}

export const NavigationDebugger: React.FC<NavigationDebuggerProps> = ({ show = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  if (!show) return null;
  
  const handleTestNavigation = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="fixed bottom-0 right-0 bg-black/80 text-white p-4 text-xs z-50 max-w-md overflow-auto">
      <h4 className="font-bold text-sm mb-2">Navigation Debug</h4>
      <p className="mb-1"><span className="font-semibold">Current path:</span> {location.pathname}</p>
      <p className="mb-1"><span className="font-semibold">Path segments:</span> {location.pathname.split('/').filter(Boolean).join(', ')}</p>
      <p className="mb-1"><span className="font-semibold">Search params:</span> {location.search || "none"}</p>
      
      <div className="mt-3 border-t border-gray-600 pt-2">
        <h5 className="font-semibold mb-1">Test Navigation</h5>
        <div className="flex flex-wrap gap-1 mt-1">
          <button 
            onClick={() => handleTestNavigation('/dashboard')}
            className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
          >
            Dashboard
          </button>
          <button 
            onClick={() => handleTestNavigation('/investments')}
            className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
          >
            Investments
          </button>
          <button 
            onClick={() => handleTestNavigation('/education')}
            className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
          >
            Education
          </button>
        </div>
      </div>
    </div>
  );
};
