import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  DollarSign, 
  Download, 
  Settings, 
  Eye, 
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Gift
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ReferralData {
  id: string;
  referrer_name: string;
  referred_name: string;
  status: string;
  referral_date: string;
  activation_date?: string;
  reward_amount?: number;
  reward_status?: string;
}

interface PayoutData {
  id: string;
  period_start: string;
  period_end: string;
  total_amount: number;
  status: string;
  processed_at?: string;
}

interface ReferralSettings {
  reward_amount_credits: number;
  reward_amount_cash: number;
  minimum_payout_threshold: number;
  tax_reporting_threshold: number;
  leaderboard_enabled: boolean;
}

export const ReferralAdminDashboard: React.FC = () => {
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [payouts, setPayouts] = useState<PayoutData[]>([]);
  const [settings, setSettings] = useState<ReferralSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    totalRewards: 0,
    pendingPayouts: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch all referrals with rewards
      const { data: referralsData } = await supabase
        .from('referrals')
        .select(`
          *,
          referral_rewards(*)
        `)
        .order('referral_date', { ascending: false });

      // Fetch payouts
      const { data: payoutsData } = await supabase
        .from('referral_payouts')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch settings
      const { data: settingsData } = await supabase
        .from('referral_settings')
        .select('setting_key, setting_value');

      // Process settings
      const settingsObj: any = {};
      settingsData?.forEach(setting => {
        settingsObj[setting.setting_key] = setting.setting_value;
      });

      setSettings({
        reward_amount_credits: Number(settingsObj.reward_amount_credits) || 50,
        reward_amount_cash: Number(settingsObj.reward_amount_cash) || 25,
        minimum_payout_threshold: Number(settingsObj.minimum_payout_threshold) || 100,
        tax_reporting_threshold: Number(settingsObj.tax_reporting_threshold) || 600,
        leaderboard_enabled: settingsObj.leaderboard_enabled === 'true' || true
      });

      // Calculate stats
      const totalReferrals = referralsData?.length || 0;
      const activeReferrals = referralsData?.filter(r => r.status === 'active').length || 0;
      const totalRewards = referralsData?.reduce((sum, r) => {
        const rewards = Array.isArray(r.referral_rewards) ? r.referral_rewards : [];
        return sum + rewards.reduce((rewardSum: number, reward: any) => rewardSum + Number(reward.reward_amount), 0);
      }, 0) || 0;
      const pendingPayouts = payoutsData?.filter(p => p.status === 'pending').length || 0;

      setStats({
        totalReferrals,
        activeReferrals,
        totalRewards,
        pendingPayouts
      });

      setReferrals(referralsData || []);
      setPayouts(payoutsData || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('referral_settings')
        .update({ setting_value: value, updated_at: new Date().toISOString() })
        .eq('setting_key', key);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Setting updated successfully."
      });

      fetchAdminData();
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: "Failed to update setting.",
        variant: "destructive"
      });
    }
  };

  const exportData = async (type: 'referrals' | 'rewards' | 'payouts') => {
    try {
      let data: any[] = [];
      let filename = '';

      switch (type) {
        case 'referrals':
          data = referrals.map(r => ({
            'Referral ID': r.id,
            'Referrer': r.referrer_name || 'N/A',
            'Referred User': r.referred_name || 'N/A',
            'Status': r.status,
            'Referral Date': r.referral_date,
            'Activation Date': r.activation_date || 'N/A',
            'Reward Amount': r.reward_amount || 0
          }));
          filename = 'referrals_export.csv';
          break;
        case 'payouts':
          data = payouts.map(p => ({
            'Payout ID': p.id,
            'Period Start': p.period_start,
            'Period End': p.period_end,
            'Total Amount': p.total_amount,
            'Status': p.status,
            'Processed Date': p.processed_at || 'N/A'
          }));
          filename = 'payouts_export.csv';
          break;
      }

      if (data.length === 0) {
        toast({
          title: "No Data",
          description: "No data available to export.",
          variant: "destructive"
        });
        return;
      }

      // Convert to CSV
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} data exported successfully.`
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Error",
        description: "Failed to export data.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-orange-100 text-orange-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Referrals</p>
                <p className="text-3xl font-bold">{stats.totalReferrals}</p>
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
                <p className="text-3xl font-bold">{stats.activeReferrals}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Rewards</p>
                <p className="text-3xl font-bold">${stats.totalRewards.toFixed(2)}</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Payouts</p>
                <p className="text-3xl font-bold">{stats.pendingPayouts}</p>
              </div>
              <DollarSign className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="referrals">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportData('referrals')}>
              <Download className="h-4 w-4 mr-2" />
              Export Referrals
            </Button>
            <Button variant="outline" onClick={() => exportData('payouts')}>
              <Download className="h-4 w-4 mr-2" />
              Export Payouts
            </Button>
          </div>
        </div>

        <TabsContent value="referrals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {referrals.length > 0 ? (
                  referrals.map((referral) => (
                    <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Referral #{referral.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(referral.referral_date).toLocaleDateString()}
                        </p>
                        {referral.activation_date && (
                          <p className="text-sm text-green-600">
                            Activated: {new Date(referral.activation_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        {referral.reward_amount && (
                          <div className="text-right">
                            <p className="font-medium">${referral.reward_amount}</p>
                            <Badge className={getStatusColor(referral.reward_status || 'pending')}>
                              {referral.reward_status || 'pending'}
                            </Badge>
                          </div>
                        )}
                        <Badge className={getStatusColor(referral.status)}>
                          {referral.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No referrals yet</h3>
                    <p className="text-muted-foreground">Referrals will appear here once users start referring others.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Payout Management</CardTitle>
                <Button>
                  <Gift className="h-4 w-4 mr-2" />
                  Process Payouts
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payouts.length > 0 ? (
                  payouts.map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {new Date(payout.period_start).toLocaleDateString()} - {new Date(payout.period_end).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Payout ID: {payout.id.slice(0, 8)}
                        </p>
                        {payout.processed_at && (
                          <p className="text-sm text-green-600">
                            Processed: {new Date(payout.processed_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${payout.total_amount.toFixed(2)}</p>
                        <Badge className={getStatusColor(payout.status)}>
                          {payout.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No payouts yet</h3>
                    <p className="text-muted-foreground">Payouts will be processed quarterly based on settings.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Referral Program Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {settings && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium">Credits Reward Amount</label>
                      <Input
                        type="number"
                        value={settings.reward_amount_credits}
                        onChange={(e) => updateSetting('reward_amount_credits', Number(e.target.value))}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Platform credits awarded per referral</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Cash Reward Amount</label>
                      <Input
                        type="number"
                        value={settings.reward_amount_cash}
                        onChange={(e) => updateSetting('reward_amount_cash', Number(e.target.value))}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Cash amount awarded per referral (USD)</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Minimum Payout Threshold</label>
                      <Input
                        type="number"
                        value={settings.minimum_payout_threshold}
                        onChange={(e) => updateSetting('minimum_payout_threshold', Number(e.target.value))}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Minimum amount before payout processing</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Tax Reporting Threshold</label>
                      <Input
                        type="number"
                        value={settings.tax_reporting_threshold}
                        onChange={(e) => updateSetting('tax_reporting_threshold', Number(e.target.value))}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Annual threshold for 1099-NEC reporting</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Enable Leaderboard</p>
                      <p className="text-sm text-muted-foreground">Show top referrers for social proof</p>
                    </div>
                    <Button
                      variant={settings.leaderboard_enabled ? "default" : "outline"}
                      onClick={() => updateSetting('leaderboard_enabled', !settings.leaderboard_enabled)}
                    >
                      {settings.leaderboard_enabled ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};