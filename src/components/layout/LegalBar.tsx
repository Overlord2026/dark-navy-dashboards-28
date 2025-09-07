import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LegalBarProps {
  className?: string;
}

export function LegalBar({ className }: LegalBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // On mobile, hide when scrolling down, show when scrolling up
      if (window.innerWidth < 768) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border/50 transition-transform duration-300 ease-in-out",
        !isVisible && "md:translate-y-0 translate-y-full",
        className
      )}
      role="contentinfo"
      aria-label="Legal information and company details"
    >
      <div className="container mx-auto px-4 py-2"
           aria-label="Footer content">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          {/* Company name and tagline */}
          <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 text-center md:text-left">
            <span className="font-medium text-foreground">
              Advanced Wealth Management, LLC — Fiduciary Duty Principles™
            </span>
            <span className="hidden md:inline">|</span>
            <span className="italic">Retire once. Stay retired.</span>
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-3 md:gap-4 flex-wrap justify-center">
            <Link 
              to="/legal/terms" 
              className="hover:text-foreground transition-colors"
              aria-label="Read Terms of Use"
            >
              Terms of Use
            </Link>
            <Link 
              to="/legal/privacy" 
              className="hover:text-foreground transition-colors"
              aria-label="Read Privacy Policy"
            >
              Privacy
            </Link>
            <Link 
              to="/legal/disclosures" 
              className="hover:text-foreground transition-colors"
              aria-label="Read Legal Disclosures"
            >
              Disclosures
            </Link>
            <span 
              className="hover:text-foreground cursor-default" 
              role="text"
              aria-label="Patent status"
            >
              Patent Pending
            </span>
            <span 
              className="hover:text-foreground cursor-default font-medium" 
              role="text"
              aria-label="Investment advice disclaimer"
            >
              Not investment advice
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}