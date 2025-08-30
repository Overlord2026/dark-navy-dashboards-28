import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';
import { ArrowRight, Play, LogIn } from 'lucide-react';
import { DemoLauncher } from './DemoLauncher';

export const CTAStickyBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling down 50% of viewport height
      const scrolled = window.scrollY > window.innerHeight * 0.5;
      setIsVisible(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartWorkspace = () => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('lp.hero.cta', { source: 'sticky_bar' });
    }
    
    window.location.href = '/onboarding';
  };

  const handleBookDemo = () => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('lp.hero.cta', { source: 'sticky_bar_demo' });
    }
    
    window.location.href = '/book-demo';
  };

  const handleLogin = () => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('login.click', { source: 'sticky_bar' });
    }
    
    window.location.href = '/login';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-t border-[#D4AF37] shadow-lg">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-center gap-3">
          <GoldButton 
            className="flex items-center gap-2 px-4 py-2"
            onClick={handleStartWorkspace}
          >
            <ArrowRight className="h-4 w-4" />
            Start workspace
          </GoldButton>
          
          <GoldOutlineButton 
            className="flex items-center gap-2 px-4 py-2"
            onClick={handleBookDemo}
          >
            <Play className="h-4 w-4" />
            Book demo
          </GoldOutlineButton>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogin}
            className="text-[#D4AF37] hover:bg-[#D4AF37]/10"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Log in
          </Button>
        </div>
      </div>
    </div>
  );
};