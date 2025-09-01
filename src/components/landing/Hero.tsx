import React from 'react';
import { cn } from '@/lib/utils';

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  className?: string;
}

export function Hero({ 
  title, 
  subtitle, 
  ctaText = "Watch 60-sec demo", 
  ctaHref = "#", 
  onCtaClick,
  className 
}: HeroProps) {
  return (
    <section className={cn("py-16 px-4 text-center", className)}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onCtaClick}
            className="bfo-cta text-lg px-8 py-4"
          >
            {ctaText}
          </button>
          
          <a
            href="#tools"
            className="bfo-cta-secondary text-lg px-8 py-4"
          >
            Explore tools
          </a>
        </div>
      </div>
    </section>
  );
}