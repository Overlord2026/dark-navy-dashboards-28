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
      className="fixed left-0 right-0 z-40 flex justify-center items-center py-3"
      style={{ 
        backgroundColor: '#001F3F', 
        top: '80px',
        height: '60px'
      }}
    >
      <nav className="flex gap-8">
        {navItems.map((item, index) => (
          <button
            key={index}
            className="text-white hover:text-blue-200 transition-colors duration-200 text-sm font-medium whitespace-nowrap"
          >
            {item}
          </button>
        ))}
      </nav>
    </div>
  );
};