import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleGetStarted } from '@/utils/getStartedUtils';

interface BrandBarProps {
  className?: string;
}

export const BrandBar: React.FC<BrandBarProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  return (
    <div className={`sticky top-0 z-50 w-full h-14 bg-background border-b border-border backdrop-blur-md ${className}`}>
      <div className="container flex items-center justify-between h-full px-4">
        {/* Brand Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-3 group transition-transform duration-200 hover:scale-105"
          aria-label="Boutique Family Office - Home"
        >
          {/* Gold Tree Icon */}
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-md group-hover:shadow-lg transition-shadow duration-200">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
              aria-hidden="true"
            >
              <path 
                d="M12 2L15 9H21L16 14L18 21L12 17L6 21L8 14L3 9H9L12 2Z" 
                fill="currentColor"
              />
            </svg>
          </div>
          
          {/* Product Wordmark */}
          <div className="hidden sm:block">
            <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-200">
              Boutique Family Office
            </span>
            <span className="block text-xs text-muted-foreground font-medium tracking-wide">
              Marketplace
            </span>
          </div>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Feature Flag Integration Indicator */}
          <div className="hidden lg:flex items-center space-x-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true" />
            <span>Integration Ready</span>
          </div>

          {/* User Actions Placeholder */}
          <div className="flex items-center space-x-2">
            <button 
              className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md"
              aria-label="Sign in"
            >
              Sign In
            </button>
            <button 
              className="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
              onClick={() => handleGetStarted(navigate)}
              aria-label="Get started"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};