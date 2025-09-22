import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';
import { abTesting } from '@/lib/abTesting';
import { usePersona } from '@/context/PersonaContext';
import { useUser } from '@/context/UserContext';
import { useViralGrowthSimple } from '@/hooks/useViralGrowthSimple';

interface ViralShareButtonProps {
  variant?: 'button' | 'card' | 'inline';
  landingPageUrl?: string;
  userName?: string;
  customMessage?: string;
  showDismiss?: boolean;
  onDismiss?: () => void;
}

const ViralShareButton: React.FC<ViralShareButtonProps> = ({
  variant = 'button',
  landingPageUrl = window.location.origin + '/join-pros',
  userName = 'Professional',
  customMessage,
  showDismiss = false,
  onDismiss
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { currentPersona } = usePersona();
  const { userProfile } = useUser();
  const { trackSocialShare, generateReferralLink, getOptimizedMessage } = useViralGrowthSimple();

  // A/B test the button text
  const buttonVariant = abTesting.getVariantConfig(
    'viral_share_button_text', 
    userProfile?.id || 'anonymous',
    { buttonText: 'Share on LinkedIn', description: 'Share your professional network access' }
  );

  const shareUrl = generateReferralLink(currentPersona || 'professional', 'linkedin');
  const shareMessage = customMessage || getOptimizedMessage('linkedin', currentPersona || 'professional');

  const handleLinkedInShare = async () => {
    // Track viral share analytics with both systems
    await trackSocialShare('linkedin', shareMessage, shareUrl, currentPersona || 'professional');
    
    if (userProfile) {
      analytics.trackViralShare('linkedin', { persona: currentPersona, userId: userProfile.id });
      
      // Track A/B test conversion
      const variant = abTesting.getVariant('viral_share_button_text', userProfile.id);
      if (variant) {
        abTesting.trackConversion('viral_share_button_text', variant.id, userProfile.id, 'clicked');
      }
    }

    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent('Join the Family Office Marketplace™')}&summary=${encodeURIComponent(shareMessage)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=550');
    
    toast({
      title: "Shared on LinkedIn",
      description: "Thank you for helping us grow the community!",
    });
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      // Track copy action
      await trackSocialShare('copy', shareMessage, shareUrl, currentPersona || 'professional');
      
      toast({
        title: "Message copied",
        description: "Share this message anywhere to invite others!",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the message manually.",
        variant: "destructive"
      });
    }
  };

  const ShareContent = () => (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Share the Future of Finance</h3>
        <p className="text-sm text-muted-foreground">
          Help us build the largest network of trusted wealth professionals
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Message to share:</label>
        <Textarea
          value={shareMessage}
          readOnly
          className="min-h-[120px] text-sm"
        />
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={handleLinkedInShare}
          className="flex-1 bg-[#0077b5] hover:bg-[#0077b5]/90 text-white"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          {buttonVariant.buttonText}
        </Button>
        <Button 
          onClick={handleCopyMessage}
          variant="outline"
          className="flex-1"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy Message
            </>
          )}
        </Button>
      </div>

      <div className="text-center">
        <Badge variant="secondary" className="text-xs">
          💡 Tip: Personal referrals get priority review and bonus features
        </Badge>
      </div>
    </div>
  );

  if (variant === 'card') {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-gold/5">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-gold flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Spread the Word</h3>
                  <p className="text-sm text-muted-foreground">
                    Invite colleagues to join
                  </p>
                </div>
              </div>
              {showDismiss && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onDismiss}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              )}
            </div>
            <ShareContent />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-primary" />
          <span className="font-semibold">Share with your network</span>
        </div>
        <ShareContent />
      </div>
    );
  }

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        variant="outline"
        className="gap-2 border-primary/20 hover:bg-primary/5"
      >
        <Share2 className="w-4 h-4" />
        🔗 {buttonVariant.buttonText}
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              Share the Marketplace
            </DialogTitle>
          </DialogHeader>
          <ShareContent />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViralShareButton;