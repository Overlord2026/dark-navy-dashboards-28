import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Share2, Users, Download, Sparkles } from 'lucide-react';
import { OnboardingStepData } from '@/types/onboarding';
import confetti from 'canvas-confetti';

interface ConfirmationStepProps {
  data: OnboardingStepData;
  onComplete: (stepData: Partial<OnboardingStepData>) => void;
  isLoading?: boolean;
  whiteLabelConfig?: any;
  referralInfo?: any;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  data,
  onComplete,
  whiteLabelConfig,
  referralInfo
}) => {
  // Trigger confetti animation on component mount
  useEffect(() => {
    const triggerConfetti = () => {
      // Burst from center
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF6347', '#9370DB', '#20B2AA']
      });
      
      // Side bursts
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 }
        });
      }, 200);
      
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 }
        });
      }, 400);
    };

    triggerConfetti();
  }, []);
  const handleComplete = () => {
    onComplete({});
  };

  const handleShare = async (platform: string) => {
    const shareText = `I just completed my onboarding with ${whiteLabelConfig?.companyName || 'Family Office Platform'}! 🎉`;
    const shareUrl = window.location.origin;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
          // You could add a toast notification here
        } catch (err) {
          console.log('Copy failed');
        }
        break;
    }
  };

  const handleInviteFamily = () => {
    const inviteText = `Join me on ${whiteLabelConfig?.companyName || 'Family Office Platform'}! Here's the link to get started: ${window.location.origin}`;
    const subject = `Invitation to ${whiteLabelConfig?.companyName || 'Family Office Platform'}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(inviteText)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="space-y-6">
      <div className="text-center animate-fade-in">
        <div className="mx-auto w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6 animate-scale-in">
          <CheckCircle className="h-10 w-10 text-success animate-pulse" />
        </div>
        <div className="mb-4">
          <Sparkles className="h-6 w-6 text-primary mx-auto mb-2 animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            🎉 Onboarding Complete!
          </h2>
          <p className="text-lg text-muted-foreground">
            Welcome to {whiteLabelConfig?.companyName || 'our wealth management platform'}.
          </p>
          {referralInfo && (
            <p className="text-sm text-muted-foreground mt-2">
              Thanks to {referralInfo.referrerName} for the referral!
            </p>
          )}
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Next Steps Card */}
        <Card className="premium-card hover-scale">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your advisor will contact you within 24 hours to schedule your welcome call.
            </p>
            <div className="space-y-2">
              <Button onClick={handleComplete} className="btn-primary-gold w-full">
                Access Your Dashboard
              </Button>
              <Button 
                onClick={() => window.open('/client-portal', '_blank')} 
                variant="outline" 
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Mobile App
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Social Sharing Card */}
        <Card className="premium-card hover-scale">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Share2 className="h-5 w-5 text-primary" />
              Share & Invite
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Share your success or invite family members to join.
            </p>
            
            {/* Social Share Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Button 
                onClick={() => handleShare('twitter')} 
                variant="outline" 
                size="sm"
                className="text-xs"
              >
                Twitter
              </Button>
              <Button 
                onClick={() => handleShare('linkedin')} 
                variant="outline" 
                size="sm"
                className="text-xs"
              >
                LinkedIn
              </Button>
              <Button 
                onClick={() => handleShare('facebook')} 
                variant="outline" 
                size="sm"
                className="text-xs"
              >
                Facebook
              </Button>
              <Button 
                onClick={() => handleShare('copy')} 
                variant="outline" 
                size="sm"
                className="text-xs"
              >
                Copy Link
              </Button>
            </div>
            
            {/* Family Invite */}
            <Button 
              onClick={handleInviteFamily}
              variant="secondary" 
              className="w-full"
            >
              <Users className="h-4 w-4 mr-2" />
              Invite Family Members
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Stats */}
      <Card className="premium-card bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              🏆 Onboarding Achievement Unlocked!
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">8</div>
                <div className="text-xs text-muted-foreground">Steps Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">100%</div>
                <div className="text-xs text-muted-foreground">Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">⚡</div>
                <div className="text-xs text-muted-foreground">AI Assisted</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};