import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

export const useViralGrowth = () => {
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const shareData = {
        user_id: user.id,
        platform,
        message,
        shared_url: sharedUrl,
        persona,
        engagement_metrics: { clicks: 0, impressions: 0, conversions: 0 }
      };

      const { data, error } = await supabase
        .from('social_shares')
        .insert(shareData)
        .select()
        .single();

      if (error) throw error;

      setSocialShares(prev => [data, ...prev]);

      // Track analytics
      analytics.trackViralShare(platform, {
        persona,
        userId: user.id,
        message: message.substring(0, 100),
        sharedUrl
      });

      // Track in viral growth system
      await updateViralCoefficient(user.id);

      toast({
        title: "Share Tracked",
        description: `Your ${platform} share has been recorded for analytics`,
      });

      return data;
    } catch (error) {
      console.error('Error tracking social share:', error);
      return null;
    }
  };

  const updateViralCoefficient = async (userId: string) => {
    try {
      // Calculate viral coefficient: (New users from referrals / Total active users) * 100
      const { data: userShares } = await supabase
        .from('social_shares')
        .select('*')
        .eq('user_id', userId);

      const { data: referralConversions } = await supabase
        .from('referral_tracking')
        .select('*')
        .eq('referrer_id', userId);

      if (userShares && referralConversions) {
        const totalShares = userShares.length;
        const totalConversions = referralConversions.length;
        const viralCoefficient = totalShares > 0 ? (totalConversions / totalShares) * 100 : 0;

        await supabase
          .from('viral_metrics')
          .upsert({
            user_id: userId,
            total_shares: totalShares,
            total_conversions: totalConversions,
            viral_coefficient: viralCoefficient,
            updated_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error updating viral coefficient:', error);
    }
  };

  const getShareAnalytics = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's shares
      const { data: shares, error: sharesError } = await supabase
        .from('social_shares')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (sharesError) throw sharesError;
      setSocialShares(shares || []);

      // Get aggregated metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from('viral_metrics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (metricsError && metricsError.code !== 'PGRST116') {
        throw metricsError;
      }

      if (metricsData) {
        // Calculate additional metrics
        const platformPerformance = shares?.reduce((acc, share) => {
          acc[share.platform] = (acc[share.platform] || 0) + (share.engagement_metrics?.clicks || 0);
          return acc;
        }, {} as Record<string, number>) || {};

        const topPlatform = Object.entries(platformPerformance)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || 'linkedin';

        setMetrics({
          total_shares: metricsData.total_shares || 0,
          total_clicks: shares?.reduce((sum, share) => sum + (share.engagement_metrics?.clicks || 0), 0) || 0,
          total_conversions: metricsData.total_conversions || 0,
          viral_coefficient: metricsData.viral_coefficient || 0,
          top_performing_platform: topPlatform,
          referral_success_rate: metricsData.total_shares > 0 
            ? (metricsData.total_conversions / metricsData.total_shares) * 100 
            : 0
        });
      }
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
    getOptimizedMessage,
    updateViralCoefficient
  };
};