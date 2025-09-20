import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export const SecondaryNav: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    window.history.length > 1 ? navigate(-1) : navigate('/');
  };

  const handleHome = () => {
    navigate('/');
  };

  const navItems = [
    { label: 'Families', path: '/families' },
    { label: 'Service Pros', path: '/pros' }, 
    // NIL conditionally included based on feature flag
    ...((window as any).__ENABLE_NIL__ ? [{ label: 'NIL', path: '/nil' }, { label: 'Load NIL Demo', path: '/nil/demo' }] : []),
    { label: 'Healthcare', path: '/healthcare' },
    { label: 'Solutions', path: '/solutions' },
    { label: 'Learn', path: '/learn' },
    { label: 'Marketplace', path: '/marketplace' }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
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
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className="font-medium transition-all duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-[#001F3F] flex-1"
                style={{
                  backgroundColor: '#000000',
                  color: '#D4AF37',
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
};