import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';

interface SocialShareData {
  id: string;
  user_id: string;
  platform: 'linkedin' | 'twitter' | 'facebook' | 'email' | 'copy';
  message: string;
  shared_url: string;
  persona: string;
  created_at: string;
  engagement_metrics?: {
    clicks?: number;
    impressions?: number;
    conversions?: number;
  };
}

interface ReferralMetrics {
  total_shares: number;
  total_clicks: number;
  total_conversions: number;
  viral_coefficient: number;
  top_performing_platform: string;
  referral_success_rate: number;
}

const STORAGE_KEY = 'viral_growth_data';

export const useViralGrowthSimple = () => {
  const [socialShares, setSocialShares] = useState<SocialShareData[]>([]);
  const [metrics, setMetrics] = useState<ReferralMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const trackSocialShare = async (
    platform: SocialShareData['platform'],
    message: string,
    sharedUrl: string,
    persona: string
  ) => {
    try {
      const shareData: SocialShareData = {
        id: crypto.randomUUID(),
        user_id: 'current-user', // Fallback user ID
        platform,
        message,
        shared_url: sharedUrl,
        persona,
        created_at: new Date().toISOString(),
        engagement_metrics: { clicks: 0, impressions: 0, conversions: 0 }
      };

      // Store in localStorage
      const existingShares = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const updatedShares = [shareData, ...existingShares];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedShares));
      
      setSocialShares(updatedShares);
      updateMetrics(updatedShares);

      // Track analytics
      analytics.track('viral_share_tracked', {
        platform,
        persona,
        message: message.substring(0, 100),
        sharedUrl
      });

      toast({
        title: "Share Tracked",
        description: `Your ${platform} share has been recorded for analytics`,
      });

      return shareData;
    } catch (error) {
      console.error('Error tracking social share:', error);
      return null;
    }
  };

  const updateMetrics = (shares: SocialShareData[]) => {
    const totalShares = shares.length;
    const totalClicks = shares.reduce((sum, share) => 
      sum + (share.engagement_metrics?.clicks || 0), 0);
    const totalConversions = shares.reduce((sum, share) => 
      sum + (share.engagement_metrics?.conversions || 0), 0);
    
    const platformPerformance = shares.reduce((acc, share) => {
      acc[share.platform] = (acc[share.platform] || 0) + (share.engagement_metrics?.clicks || 0);
      return acc;
    }, {} as Record<string, number>);

    const topPlatform = Object.entries(platformPerformance)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'linkedin';

    const viralCoefficient = totalShares > 0 ? (totalConversions / totalShares) * 100 : 0;
    const referralSuccessRate = totalShares > 0 ? (totalConversions / totalShares) * 100 : 0;

    setMetrics({
      total_shares: totalShares,
      total_clicks: totalClicks,
      total_conversions: totalConversions,
      viral_coefficient: viralCoefficient,
      top_performing_platform: topPlatform,
      referral_success_rate: referralSuccessRate
    });
  };

  const getShareAnalytics = async () => {
    setLoading(true);
    try {
      const shares = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as SocialShareData[];
      setSocialShares(shares);
      updateMetrics(shares);
    } catch (error) {
      console.error('Error fetching share analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReferralLink = (persona: string, utm_source: string = 'viral_share') => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      utm_source,
      utm_medium: 'social',
      utm_campaign: 'viral_growth',
      utm_content: persona,
      ref: 'social_share'
    });

    return `${baseUrl}/join-pros?${params.toString()}`;
  };

  const getOptimizedMessage = (platform: SocialShareData['platform'], persona: string) => {
    const baseMessage = "Just joined the Family Office Marketplace™—the exclusive network for wealth management professionals!";
    const cta = generateReferralLink(persona, platform);

    const platformMessages = {
      linkedin: `${baseMessage} 

Connect with top-tier advisors, CPAs, and attorneys all in one secure platform. Import your LinkedIn profile and join me: ${cta}

#FamilyOfficeMarketplace #WealthManagement #ProfessionalNetworking`,

      twitter: `${baseMessage} 

Join the future of wealth management: ${cta}

#FamilyOffice #WealthTech #FinTech`,

      facebook: `${baseMessage}

I'm excited to be part of this exclusive community of wealth management professionals. If you're in finance, you should check this out: ${cta}`,

      email: `Subject: Invitation to Join the Family Office Marketplace™

Hi there,

${baseMessage}

I wanted to personally invite you to join this exclusive network where I'm connecting with other top professionals in wealth management, tax planning, estate law, and family office services.

Key benefits:
• Direct access to vetted professionals
• Secure collaboration tools
• Streamlined client referral system
• Industry-leading compliance features

Join me here: ${cta}

Best regards`,

      copy: `${baseMessage} Join me at: ${cta} #FamilyOfficeMarketplace`
    };

    return platformMessages[platform];
  };

  useEffect(() => {
    getShareAnalytics();
  }, []);

  return {
    socialShares,
    metrics,
    loading,
    trackSocialShare,
    getShareAnalytics,
    generateReferralLink,
    getOptimizedMessage
  };
};