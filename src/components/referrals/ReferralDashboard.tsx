import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Copy, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Gift, 
  Share2,
  ExternalLink,
  Award,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  pendingRewards: number;
  totalEarnings: number;
  referralCode: string;
  referralLink: string;
}

interface Referral {
  id: string;
  referred_user_id: string;
  status: string;
  referral_date: string;
  activation_date?: string;
  reward_amount?: number;
}

interface Reward {
  id: string;
  reward_type: string;
  reward_amount: number;
  status: string;
  created_at: string;
  payout_date?: string;
}

export const ReferralDashboard: React.FC = () => {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const baseUrl = window.location.origin;

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch referral code
      const { data: referralCode } = await supabase
        .from('referral_codes')
        .select('referral_code')
        .eq('user_id', user.id)
        .single();

      // Fetch referrals
      const { data: referralsData } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_user_id', user.id)
        .order('referral_date', { ascending: false });

      // Fetch rewards
      const { data: rewardsData } = await supabase
        .from('referral_rewards')
        .select('*')
        .eq('referrer_user_id', user.id)
        .order('created_at', { ascending: false });

      const totalReferrals = referralsData?.length || 0;
      const activeReferrals = referralsData?.filter(r => r.status === 'active').length || 0;
      const pendingRewards = rewardsData?.filter(r => r.status === 'pending' || r.status === 'approved').length || 0;
      const totalEarnings = rewardsData?.filter(r => r.status === 'paid').reduce((sum, r) => sum + Number(r.reward_amount), 0) || 0;

      setStats({
        totalReferrals,
        activeReferrals,
        pendingRewards,
        totalEarnings,
        referralCode: referralCode?.referral_code || '',
        referralLink: `${baseUrl}?ref=${referralCode?.referral_code}`
      });

      setReferrals(referralsData || []);
      setRewards(rewardsData || []);
    } catch (error) {
      console.error('Error fetching referral data:', error);
      toast({
        title: "Error",
        description: "Failed to load referral data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const shareReferralLink = async () => {
    if (navigator.share && stats) {
      try {
        await navigator.share({
          title: 'Join Boutique Family Office',
          text: 'Get access to exclusive family office tools and marketplace!',
          url: stats.referralLink
        });
      } catch (error) {
        copyToClipboard(stats.referralLink, 'Referral link');
      }
    } else if (stats) {
      copyToClipboard(stats.referralLink, 'Referral link');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'paid': return <DollarSign className="h-4 w-4" />;
      case 'approved': return <Award className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Legal Disclaimer */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Referral rewards apply only to platform usage, not investment services. 
          No investment advice or account opening incentives provided.
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Referrals</p>
                <p className="text-3xl font-bold">{stats?.totalReferrals || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Referrals</p>
                <p className="text-3xl font-bold">{stats?.activeReferrals || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Rewards</p>
                <p className="text-3xl font-bold">{stats?.pendingRewards || 0}</p>
              </div>
              <Gift className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                <p className="text-3xl font-bold">${stats?.totalEarnings?.toFixed(2) || '0.00'}</p>
              </div>
              <DollarSign className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Your Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={stats?.referralLink || ''}
              readOnly
              className="flex-1"
            />
            <Button 
              variant="outline" 
              onClick={() => copyToClipboard(stats?.referralLink || '', 'Referral link')}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button onClick={shareReferralLink}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Your Referral Code:</p>
              <div className="flex items-center gap-2">
                <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                  {stats?.referralCode}
                </code>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => copyToClipboard(stats?.referralCode || '', 'Referral code')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Referrals and Rewards */}
      <Tabs defaultValue="referrals">
        <TabsList>
          <TabsTrigger value="referrals">My Referrals</TabsTrigger>
          <TabsTrigger value="rewards">My Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="referrals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Referral History</CardTitle>
            </CardHeader>
            <CardContent>
              {referrals.length > 0 ? (
                <div className="space-y-4">
                  {referrals.map((referral) => (
                    <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Referral #{referral.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          Referred on {new Date(referral.referral_date).toLocaleDateString()}
                        </p>
                        {referral.activation_date && (
                          <p className="text-sm text-green-600">
                            Activated on {new Date(referral.activation_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(referral.status)}>
                          {getStatusIcon(referral.status)}
                          <span className="ml-1 capitalize">{referral.status}</span>
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No referrals yet</h3>
                  <p className="text-muted-foreground">Start sharing your referral link to earn rewards!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reward History</CardTitle>
            </CardHeader>
            <CardContent>
              {rewards.length > 0 ? (
                <div className="space-y-4">
                  {rewards.map((reward) => (
                    <div key={reward.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {reward.reward_type === 'credits' ? 'Platform Credits' : 
                           reward.reward_type === 'cash' ? 'Cash Reward' : 'Gift Card'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Earned on {new Date(reward.created_at).toLocaleDateString()}
                        </p>
                        {reward.payout_date && (
                          <p className="text-sm text-green-600">
                            Paid on {new Date(reward.payout_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {reward.reward_type === 'credits' ? `${reward.reward_amount} credits` : `$${reward.reward_amount}`}
                        </p>
                        <Badge className={getStatusColor(reward.status)}>
                          {getStatusIcon(reward.status)}
                          <span className="ml-1 capitalize">{reward.status}</span>
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No rewards yet</h3>
                  <p className="text-muted-foreground">Earn rewards when your referrals upgrade to paid plans!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};