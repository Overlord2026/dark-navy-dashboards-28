import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Share2, 
  Linkedin, 
  Mail, 
  Copy, 
  MessageSquare,
  BarChart3,
  Trophy,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';

interface SWAGViralShareProps {
  leadData?: {
    name: string;
    swagScore: number;
    band: string;
  };
  className?: string;
}

export function SWAGViralShare({ leadData, className }: SWAGViralShareProps) {
  const [customMessage, setCustomMessage] = useState('');
  const { toast } = useToast();

  const shareTemplates = {
    linkedin: `Got SWAG? I just scored my prospects with SWAG Lead Score™ - the AI-powered system that's revolutionizing how professionals identify high-value clients. Try it yourself at my.bfocfo.com #GotSWAG #LeadScoring #FinancialAdvisors`,
    
    sms: `I'm scoring my prospects with SWAG Lead Score™ - Strategic Wealth Alpha GPS. It's game-changing for client qualification. Try it: my.bfocfo.com`,
    
    email: {
      subject: 'Invitation: Experience SWAG Lead Score™',
      body: `Hi there,

As a top advisor, accountant, or attorney, you're invited to experience SWAG Lead Score™ - the AI-powered prospect scoring system that's transforming how professionals identify and qualify high-value clients.

SWAG (Strategic Wealth Alpha GPS™) analyzes:
• Profile completeness and engagement
• Linked accounts and verification status
• Digital signals and industry persona
• Source attribution and conversion probability

See how professionals are getting 35% better conversion rates and saving 60% of qualification time.

Sign up now: my.bfocfo.com

Best regards,
[Your Name]

P.S. Got SWAG? Find out with a free score!`
    }
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://my.bfocfo.com')}&summary=${encodeURIComponent(shareTemplates.linkedin)}`;
    window.open(url, '_blank', 'width=600,height=400');
    
    analytics.track('swag_viral_share_clicked', {
      platform: 'linkedin',
      template: 'default'
    });

    toast({
      title: "LinkedIn Share Opened",
      description: "Share your SWAG experience with your network!",
    });
  };

  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      analytics.track('swag_viral_share_clicked', {
        platform: type,
        template: 'copy'
      });

      toast({
        title: "Copied to Clipboard",
        description: `${type} share text copied successfully!`,
      });
    });
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(shareTemplates.email.subject);
    const body = encodeURIComponent(shareTemplates.email.body);
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoUrl;
    
    analytics.track('swag_viral_share_clicked', {
      platform: 'email',
      template: 'invitation'
    });
  };

  const handleCustomShare = () => {
    if (!customMessage.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a custom message to share.",
        variant: "destructive"
      });
      return;
    }

    handleCopyToClipboard(customMessage, 'custom');
  };

  return (
    <Card className={`bg-gradient-to-br from-gold/5 to-emerald/5 border-gold/20 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-deep-blue">
          <Share2 className="h-5 w-5 text-gold" />
          Share My SWAG
        </CardTitle>
        <CardDescription>
          Spread the word about SWAG Lead Score™ and help fellow professionals discover better lead qualification
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Lead Summary */}
        {leadData && (
          <div className="p-4 rounded-lg bg-gradient-to-r from-gold/10 to-emerald/10 border border-gold/20">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-deep-blue">{leadData.name}</h4>
                <p className="text-sm text-muted-foreground">Latest high-SWAG lead</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gold">{leadData.swagScore}/100</div>
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                  {leadData.band}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Quick Share Options */}
        <div className="space-y-4">
          <h4 className="font-semibold text-deep-blue flex items-center gap-2">
            <Trophy className="h-4 w-4 text-gold" />
            Quick Share Options
          </h4>
          
          <div className="grid gap-3">
            {/* LinkedIn Share */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gold/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Linkedin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">LinkedIn Post</p>
                  <p className="text-xs text-muted-foreground">Share with your professional network</p>
                </div>
              </div>
              <Button onClick={handleLinkedInShare} variant="outline" size="sm">
                Share
              </Button>
            </div>

            {/* SMS/WhatsApp Copy */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gold/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">SMS/WhatsApp</p>
                  <p className="text-xs text-muted-foreground">Copy text for messaging</p>
                </div>
              </div>
              <Button 
                onClick={() => handleCopyToClipboard(shareTemplates.sms, 'SMS')}
                variant="outline" 
                size="sm"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>

            {/* Email Template */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gold/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Mail className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Email Invitation</p>
                  <p className="text-xs text-muted-foreground">Professional invitation template</p>
                </div>
              </div>
              <Button onClick={handleEmailShare} variant="outline" size="sm">
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* Custom Message */}
        <div className="space-y-3">
          <h4 className="font-semibold text-deep-blue flex items-center gap-2">
            <Star className="h-4 w-4 text-gold" />
            Custom Message
          </h4>
          <Textarea
            placeholder="Write your own SWAG share message..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={handleCustomShare} className="w-full" variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Copy Custom Message
          </Button>
        </div>

        {/* Usage Analytics Preview */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-deep-blue/5 to-navy/5 border border-deep-blue/20">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-deep-blue" />
            <span className="text-sm font-medium text-deep-blue">Share Impact</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-deep-blue">247</div>
              <div className="text-xs text-muted-foreground">Total Shares</div>
            </div>
            <div>
              <div className="text-lg font-bold text-emerald">89</div>
              <div className="text-xs text-muted-foreground">Clicks</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gold">23</div>
              <div className="text-xs text-muted-foreground">Sign-ups</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-4 rounded-lg bg-gradient-to-r from-gold/10 to-emerald/10 border border-gold/20">
          <p className="text-sm text-muted-foreground mb-2">
            Help grow the SWAG community!
          </p>
          <Badge className="bg-gradient-to-r from-gold to-emerald text-deep-blue font-semibold">
            Got SWAG? Share the Alpha! 🚀
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}