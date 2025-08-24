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
  persona?: 'retiree' | 'advisor' | 'nil-athlete' | 'family' | 'default';
}

export default function ShareButton({ 
  title, 
  text, 
  url = window.location.href,
  variant = 'outline',
  size = 'sm',
  className,
  persona = 'default'
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Persona-specific share messages for virality
  const getPersonaShareText = () => {
    const personaMessages = {
      'retiree': `🏆 Found the perfect retirement toolkit! ${text} - Tools that actually work for real people planning their next chapter.`,
      'advisor': `💼 Game-changing tools for financial advisors! ${text} - Finally, professional-grade solutions that clients actually understand.`,
      'nil-athlete': `🏆 NIL just got easier! ${text} - Perfect for athletes navigating name, image & likeness deals with confidence.`,
      'family': `💡 Smart money moves made simple! ${text} - Financial planning tools designed for real families.`,
      'default': text
    };
    return personaMessages[persona] || text;
  };

  const shareText = getPersonaShareText();

  const handleShare = async () => {
    // Analytics - share.click
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('share.click', { 
        persona,
        url,
        text: shareText,
        title
      });
    }

    // Try Web Share API first (mobile-friendly)
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url
        });

        // Analytics - share.success
        if (typeof window !== 'undefined' && (window as any).analytics) {
          (window as any).analytics.track('share.success', { 
            method: 'native',
            persona,
            url,
            text: shareText,
            title
          });
        }
        return;
      } catch (error) {
        // User cancelled or error occurred, fallback to clipboard
        console.log('Web Share cancelled or failed:', error);
      }
    }

    // Fallback to clipboard copy (copy shareable text + URL)
    try {
      const copyText = `${shareText}\n\n${url}`;
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      });

      // Analytics - share.success
      if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.track('share.success', { 
          method: 'copy',
          persona,
          url,
          text: shareText,
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