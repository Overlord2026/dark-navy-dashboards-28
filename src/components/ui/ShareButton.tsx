import { useState } from 'react';
import { Share, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export default function ShareButton({ 
  title, 
  text, 
  url = window.location.href,
  variant = 'outline',
  size = 'sm',
  className 
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    // Analytics - share.click
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('share.click', { 
        url,
        text,
        title
      });
    }

    // Try Web Share API first (mobile-friendly)
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url
        });

        // Analytics - share.success
        if (typeof window !== 'undefined' && (window as any).analytics) {
          (window as any).analytics.track('share.success', { 
            method: 'native',
            url,
            text,
            title
          });
        }
        return;
      } catch (error) {
        // User cancelled or error occurred, fallback to clipboard
        console.log('Web Share cancelled or failed:', error);
      }
    }

    // Fallback to clipboard copy
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      });

      // Analytics - share.success
      if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.track('share.success', { 
          method: 'copy',
          url,
          text,
          title
        });
      }
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast({
        title: "Copy failed",
        description: "Could not copy link to clipboard.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      className={`flex items-center gap-2 ${className}`}
      aria-label={`Share ${title}`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          Copied!
        </>
      ) : (
        <>
          <Share className="w-4 h-4" />
          Share
        </>
      )}
    </Button>
  );
}