import React from 'react';
import { useNavigate } from 'react-router-dom';

export const SecondaryNav: React.FC = () => {
  const navigate = useNavigate();

  const navItems = [
    { label: 'Families', path: '/families' },
    { label: 'Service Pros', path: '/pros' }, 
    { label: 'NIL', path: '/nil' },
    { label: 'Healthcare', path: '/healthcare' },
    { label: 'Solutions', path: '/marketplace' },
    { label: 'Learn', path: '/learn' },
    { label: 'Load NIL Demo', path: '/nil/demo' },
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
      <nav className="flex items-center justify-center w-full max-w-7xl px-4">
        <div className="flex items-center justify-between w-full">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className="font-medium transition-all duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-[#001F3F]"
              style={{
                backgroundColor: '#000000',
                color: '#D4AF37',
                border: '1px solid #D4AF37',
                fontSize: '14px',
                borderRadius: '4px',
                height: '48px',
                minWidth: '48px',
                padding: '0 16px',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};