import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Share2, Copy, Twitter, Linkedin, Mail } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ShareButtonProps {
  text: string;
  url?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg';
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  text,
  url = typeof window !== 'undefined' ? window.location.href : '',
  className = '',
  variant = 'ghost',
  size = 'sm'
}) => {
  const { toast } = useToast();

  const shareData = {
    title: 'Family Office Platform',
    text,
    url
  };

  const handleWebShare = async () => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('share.click', { method: 'web_share', url });
    }

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        
        // Analytics success
        if (typeof window !== 'undefined' && (window as any).analytics) {
          (window as any).analytics.track('share.success', { method: 'web_share', url });
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Web Share failed:', error);
      return false;
    }
  };

  const handleCopyLink = async () => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('share.click', { method: 'copy_link', url });
    }

    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Link copied!',
        description: 'The link has been copied to your clipboard.',
      });
      
      // Analytics success
      if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.track('share.success', { method: 'copy_link', url });
      }
    } catch (error) {
      console.error('Copy failed:', error);
      toast({
        title: 'Copy failed',
        description: 'Unable to copy link to clipboard.',
        variant: 'destructive'
      });
    }
  };

  const handleSocialShare = (platform: string) => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('share.click', { method: platform, url });
    }

    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent('Family Office Platform')}&body=${encodedText}%20${encodedUrl}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
      
      // Analytics success
      if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.track('share.success', { method: platform, url });
      }
    }
  };

  const handleShare = async () => {
    // Try Web Share API first on mobile
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      const webShareSuccess = await handleWebShare();
      if (webShareSuccess) return;
    }
    
    // Fallback to copy link
    await handleCopyLink();
  };

  // Mobile: simple button with Web Share fallback to copy
  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleShare}
        className={className}
      >
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
    );
  }

  // Desktop: dropdown menu with social options
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleSocialShare('twitter')}>
          <Twitter className="mr-2 h-4 w-4" />
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSocialShare('linkedin')}>
          <Linkedin className="mr-2 h-4 w-4" />
          Share on LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSocialShare('email')}>
          <Mail className="mr-2 h-4 w-4" />
          Share via Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};