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
      className="fixed left-0 right-0 z-40 flex justify-center items-center py-4"
      style={{ 
        backgroundColor: '#001F3F', 
        top: '60px',
        height: '60px',
        border: '1px solid #D4AF37'
      }}
    >
      <nav className="flex items-center" style={{ gap: '1rem' }}>
        {navItems.map((item, index) => (
          <button
            key={index}
            className="text-white hover:text-blue-200 transition-colors duration-200 font-medium whitespace-nowrap"
            style={{ fontSize: '1.2rem' }}
          >
            {item}
          </button>
        ))}
      </nav>
    </div>
  );
};