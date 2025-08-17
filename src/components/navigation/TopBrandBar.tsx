import React from 'react';
import { Link } from 'react-router-dom';

export const TopBrandBar: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4 h-12 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md"
          aria-label="Boutique Family Office - Home"
        >
          <img 
            src="/brand/bfo-horizontal.svg" 
            alt="Boutique Family Office" 
            className="h-6"
            onError={(e) => {
              // Fallback if image doesn't exist
              const target = e.currentTarget;
              const fallback = target.nextElementSibling as HTMLElement;
              target.style.display = 'none';
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <span 
            className="text-lg font-bold text-foreground"
            style={{ display: 'none' }}
          >
            BFO
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link 
            to="/auth/signin" 
            className="px-3 py-1.5 rounded-md text-sm text-foreground hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            Sign In
          </Link>
          <Link 
            to="/auth/signup" 
            className="px-3 py-1.5 rounded-md text-sm bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};