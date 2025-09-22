import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { ArrowLeft, Home } from 'lucide-react';

// Ensure React is properly initialized
if (!React || typeof React.useContext !== 'function') {
  throw new Error('React runtime not properly initialized in SecondaryNav');
}

function SecondaryNav() {
  const nav = useNavigate();
  const loc = useLocation();
  const items = useMemo(() => [
    { to: '/pros', label: 'Pros' },
    { to: '/pros/accountants', label: 'CPAs' },
    { to: '/pros/attorneys', label: 'Attorneys' },
    { to: '/families', label: 'Families' },
    { to: '/healthcare', label: 'Healthcare' },
    { to: '/solutions', label: 'Solutions' },
    { to: '/learn', label: 'Learn' },
    { to: '/marketplace', label: 'Marketplace' }
  ], []);

  const handleBack = () => {
    window.history.length > 1 ? nav(-1) : nav('/');
  };

  const handleHome = () => {
    nav('/');
  };

  const handleNavigation = (path: string) => {
    nav(path);
  };

  return (
    <div 
      className="fixed left-0 right-0 z-40 flex justify-center items-center"
      style={{ 
        backgroundColor: '#001F3F', 
        top: '80px',
        height: '80px',
        borderBottom: '1px solid #D4AF37'
      }}
    >
      <nav className="flex items-center justify-between w-full max-w-7xl px-4">
        <div className="flex items-center justify-between w-full">
          {/* Back button - far left */}
          <button
            onClick={handleBack}
            className="flex items-center justify-center transition-all duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-[#001F3F]"
            style={{
              backgroundColor: '#000000',
              color: '#D4AF37',
              border: '1px solid #D4AF37',
              borderRadius: '4px',
              height: '48px',
              width: '48px',
              cursor: 'pointer'
            }}
            title="Go Back"
          >
            <ArrowLeft size={20} />
          </button>
          
          {/* Center navigation items - spread evenly */}
          <div className="flex items-center justify-center flex-1 gap-4 mx-8">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.to)}
                className={`font-medium transition-all duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-[#001F3F] flex-1 ${
                  loc.pathname === item.to ? 'opacity-100' : 'opacity-70'
                }`}
                style={{
                  backgroundColor: loc.pathname === item.to ? '#D4AF37' : '#000000',
                  color: loc.pathname === item.to ? '#000000' : '#D4AF37',
                  border: '1px solid #D4AF37',
                  fontSize: '14px',
                  borderRadius: '4px',
                  height: '48px',
                  minWidth: '48px',
                  padding: '0 12px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Home button - far right */}
          <button
            onClick={handleHome}
            className="flex items-center justify-center transition-all duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-[#001F3F]"
            style={{
              backgroundColor: '#000000',
              color: '#D4AF37',
              border: '1px solid #D4AF37',
              borderRadius: '4px',
              height: '48px',
              width: '48px',
              cursor: 'pointer'
            }}
            title="Go Home"
          >
            <Home size={20} />
          </button>
        </div>
      </nav>
    </div>
  );
}

// Default and named exports
export default SecondaryNav;
export { SecondaryNav };