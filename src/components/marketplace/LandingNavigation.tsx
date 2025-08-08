import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TreePine, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LandingNavigation: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Home', path: '/', active: true },
    { label: 'Marketplace', path: '/marketplace' },
    { label: 'Education', path: '/education' },
    { label: 'Solutions', path: '/solutions' },
    { label: 'About', path: '/about' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-gold/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity duration-300"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold/80 rounded-lg flex items-center justify-center shadow-lg">
              <TreePine className="w-6 h-6 text-navy" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-serif font-bold text-lg text-foreground">
                Boutique Family Office
              </h1>
              <p className="text-xs text-gold -mt-1">Marketplace</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigationItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`relative px-3 py-2 font-medium transition-all duration-300 ${
                  item.active 
                    ? 'text-gold' 
                    : 'text-foreground hover:text-gold'
                }`}
              >
                {item.label}
                {item.active && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
                )}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/auth/login')}
              className="border-emerald text-emerald hover:bg-emerald hover:text-white"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate('/auth/signup')}
              className="bg-gradient-to-r from-gold to-gold/90 text-navy font-bold hover:from-gold/90 hover:to-gold"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-foreground hover:text-gold transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gold/20 py-4 space-y-4 bg-navy/95 backdrop-blur-sm">
            {navigationItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 font-medium transition-colors duration-300 ${
                  item.active 
                    ? 'text-gold border-l-2 border-gold' 
                    : 'text-foreground hover:text-gold'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <div className="flex flex-col gap-3 px-4 pt-4 border-t border-gold/20">
              <Button
                variant="outline"
                onClick={() => {
                  navigate('/auth/login');
                  setIsMobileMenuOpen(false);
                }}
                className="border-emerald text-emerald hover:bg-emerald hover:text-white"
              >
                Login
              </Button>
              <Button
                onClick={() => {
                  navigate('/auth/signup');
                  setIsMobileMenuOpen(false);
                }}
                className="bg-gradient-to-r from-gold to-gold/90 text-navy font-bold hover:from-gold/90 hover:to-gold"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};