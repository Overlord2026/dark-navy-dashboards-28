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
      <nav className="flex items-center" style={{ gap: '1.5rem' }}>
        {navItems.map((item, index) => (
          <button
            key={index}
            className="text-white hover:text-blue-200 transition-colors duration-200 font-medium whitespace-nowrap"
            style={{ fontSize: '18px' }}
          >
            {item}
          </button>
        ))}
      </nav>
    </div>
  );
};