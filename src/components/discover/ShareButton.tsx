import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ShareButtonProps {
  text: string;
  url: string;
  title?: string;
  onShare?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  text,
  url,
  title = 'Check this out',
  onShare,
  className = '',
  variant = 'outline',
  size = 'default'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Analytics - share.click
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('share.click', { 
        url,
        text,
        title
      });
    }

    onShare?.();

    // Try Web Share API first (mobile)
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
        // User cancelled or error occurred, fall back to copy
        console.log('Native share cancelled or failed:', error);
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Analytics - share.success
      if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.track('share.success', { 
          method: 'copy',
          url,
          text,
          title
        });
      }

      // Toast notification
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('toast', {
          detail: { message: 'Link copied to clipboard!' }
        }));
      }
    } catch (error) {
      // Final fallback: show share modal
      console.log('Clipboard API failed:', error);
      setIsOpen(true);
    }
  };

  const handleCopyFromModal = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      // Analytics - share.success
      if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.track('share.success', { 
          method: 'modal_copy',
          url,
          text,
          title
        });
      }
    } catch (error) {
      // Manual selection fallback
      const input = document.createElement('input');
      input.value = textToCopy;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToSocial = (platform: string) => {
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
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}%20${encodedUrl}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      
      // Analytics - share.click
      if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.track('share.click', { 
          platform,
          url,
          text,
          title
        });
      }
    }
    
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        variant={variant}
        size={size}
        onClick={handleShare}
        className={className}
        aria-label="Share this content"
      >
        {copied ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Link copied!
          </>
        ) : (
          <>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </>
        )}
      </Button>

      {/* Desktop Share Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this content</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Social Share Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={() => shareToSocial('twitter')}
                className="w-full"
              >
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={() => shareToSocial('linkedin')}
                className="w-full"
              >
                LinkedIn
              </Button>
              <Button
                variant="outline"
                onClick={() => shareToSocial('email')}
                className="w-full"
              >
                Email
              </Button>
            </div>

            {/* Copy Message */}
            <div className="space-y-2">
              <Label htmlFor="share-message">Message</Label>
              <Textarea
                id="share-message"
                value={text}
                readOnly
                className="resize-none"
                rows={3}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyFromModal(text)}
                className="w-full"
              >
                <Copy className="mr-2 h-3 w-3" />
                Copy message
              </Button>
            </div>

            {/* Copy Link */}
            <div className="space-y-2">
              <Label htmlFor="share-url">Link</Label>
              <div className="flex gap-2">
                <Input
                  id="share-url"
                  value={url}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => handleCopyFromModal(url)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Copy Both */}
            <Button
              onClick={() => handleCopyFromModal(`${text} ${url}`)}
              className="w-full"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy message & link
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};