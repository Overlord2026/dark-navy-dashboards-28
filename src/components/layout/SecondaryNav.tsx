import React from 'react';

export const SecondaryNav: React.FC = () => {
  const navItems = [
    'Families',
    'Service Pros', 
    'NIL Healthcare Solutions',
    'Learn',
    'Load NIL Demo',
    'Marketplace'
  ];

  return (
    <div 
      className="fixed left-0 right-0 z-40 flex justify-center items-center"
      style={{ 
        backgroundColor: '#001F3F', 
        top: '80px',
        height: '80px',
        border: '1px solid #D4AF37'
      }}
    >
      <nav className="flex items-center justify-center w-full max-w-7xl px-4">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6">
          {navItems.map((item, index) => (
            <button
              key={index}
              className="px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 font-medium transition-all duration-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              style={{
                backgroundColor: '#000000',
                color: '#D4AF37',
                border: '1px solid #D4AF37',
                fontSize: '14px',
                letterSpacing: item === 'NIL Healthcare Solutions' ? '1.2rem' : '0.05em',
                borderRadius: '4px',
                minHeight: '40px',
                whiteSpace: 'nowrap'
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};