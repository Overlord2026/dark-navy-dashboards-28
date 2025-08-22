import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogIn, ArrowRight } from 'lucide-react';

export const PublicNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Personas', href: '/discover#personas' },
    { label: 'Goals', href: '/goals' },
    { label: 'Catalog', href: '/catalog' },
    { label: 'Proof', href: '/how-it-works' },
    { label: 'Pricing', href: '/pricing' }
  ];

  const handleLogin = () => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('login.click', { source: 'nav' });
    }
    
    window.location.href = '/login';
  };

  const handleGetStarted = () => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('lp.hero.cta', { source: 'nav' });
    }
    
    window.location.href = '/onboarding';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/discover" className="text-xl font-bold bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent">
              Family Office Platform
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleLogin}>
              <LogIn className="mr-2 h-4 w-4" />
              Log in
            </Button>
            <Button size="sm" className="bg-gold hover:bg-gold-hover text-navy" onClick={handleGetStarted}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Get started
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="space-y-6 mt-6">
                  {/* Navigation Links */}
                  <div className="space-y-4">
                    {navItems.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        className="block text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-6 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => {
                        setIsOpen(false);
                        handleLogin();
                      }}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Log in
                    </Button>
                    <Button 
                      className="w-full bg-gold hover:bg-gold-hover text-navy" 
                      onClick={() => {
                        setIsOpen(false);
                        handleGetStarted();
                      }}
                    >
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Get started
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};