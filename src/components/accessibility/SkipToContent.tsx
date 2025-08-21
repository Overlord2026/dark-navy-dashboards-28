import React from 'react';
import { Button } from '@/components/ui/button';

interface SkipToContentProps {
  targetId?: string;
  className?: string;
}

export function SkipToContent({ targetId = 'main-content', className }: SkipToContentProps) {
  const handleSkip = () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSkip}
      className={`sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 ${className}`}
      aria-label="Skip to main content"
    >
      Skip to main content
    </Button>
  );
}