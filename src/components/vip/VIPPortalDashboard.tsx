import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, Users, Link2, Star, TrendingUp, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { VIPBadge } from '@/components/badges/VIPBadgeSystem';

interface VIPOrganization {
  id: string;
  organization_name: string;
  organization_type: string;
  vip_tier: string;
  status: string;
  referral_code: string;
  early_access_expires_at: string;
  premium_features_unlocked: string[];
  brand_colors: {
    primary: string;
    secondary: string;
  };
  logo_url?: string;
  custom_banner_url?: string;
}

interface VIPMember {
  id: string;
  name: string;
  email: string;
  role: string;
  invitation_status: string;
  joined_at?: string;
}

interface VIPReferralNetwork {
  id: string;
  referee_email: string;
  referee_organization: string;
  network_level: number;
  activation_status: string;
  total_credits_earned: number;
  activation_date?: string;
}

export const VIPPortalDashboard: React.FC = () => {
  const [organization, setOrganization] = useState<VIPOrganization | null>(null);
  const [members, setMembers] = useState<VIPMember[]>([]);
  const [referralNetwork, setReferralNetwork] = useState<VIPReferralNetwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    fetchVIPPortalData();
  }, []);

  const fetchVIPPortalData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's VIP organization
      const { data: orgData, error: orgError } = await supabase
        .from('vip_organizations')
        .select('*')
        .or(`admin_contact_id.eq.${user.id},id.in.(select organization_id from vip_organization_members where user_id = '${user.id}')`)
        .single();

      if (orgError) throw orgError;
      setOrganization(orgData);

      // Get organization members
      const { data: memberData, error: memberError } = await supabase
        .from('vip_organization_members')
        .select('*')
        .eq('organization_id', orgData.id)
        .order('joined_at', { ascending: false });

      if (memberError) throw memberError;
      setMembers(memberData || []);

      // Get referral network
      const { data: referralData, error: referralError } = await supabase
        .from('vip_referral_networks')
        .select('*')
        .eq('organization_id', orgData.id)
        .order('created_at', { ascending: false });

      if (referralError) throw referralError;
      setReferralNetwork(referralData || []);

    } catch (error: any) {
      console.error('Error fetching VIP portal data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load VIP portal data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (!organization?.referral_code) return;
    
    const link = `${window.location.origin}/signup?ref=${organization.referral_code}&vip=true`;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Copied',
      description: 'VIP referral link copied to clipboard',
    });
  };

  const inviteMember = async (email: string, name: string, role: string = 'member') => {
    if (!organization) return;

    try {
      const { data, error } = await supabase
        .from('vip_organization_members')
        .insert({
          organization_id: organization.id,
          email,
          name,
          role,
          invitation_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Invitation Sent',
        description: `Invited ${name} to join your VIP organization`,
      });

      fetchVIPPortalData();
    } catch (error: any) {
      console.error('Error inviting member:', error);
      toast({
        title: 'Error',
        description: 'Failed to send invitation',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Crown className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No VIP Organization Found</h2>
            <p className="text-muted-foreground">
              You don't have access to any VIP organization portal yet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalNetworkValue = referralNetwork.reduce((sum, ref) => sum + ref.total_credits_earned, 0);
  const activeReferrals = referralNetwork.filter(ref => ref.activation_status === 'activated').length;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* VIP Header with Custom Branding */}
      <Card 
        className="relative overflow-hidden border-2"
        style={{ 
          borderColor: organization.brand_colors?.primary || '#000',
          background: `linear-gradient(135deg, ${organization.brand_colors?.primary}10, ${organization.brand_colors?.secondary}10)`
        }}
      >
        {organization.custom_banner_url && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: `url(${organization.custom_banner_url})` }}
          />
        )}
        <CardContent className="relative p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {organization.logo_url && (
                <img 
                  src={organization.logo_url} 
                  alt="Organization Logo"
                  className="w-16 h-16 rounded-lg object-contain bg-white p-2"
                />
              )}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{organization.organization_name}</h1>
                  <VIPBadge 
                    type={organization.vip_tier as any} 
                    size="lg" 
                    animated={true} 
                  />
                </div>
                <p className="text-muted-foreground capitalize">
                  {organization.organization_type.replace('_', ' ')} • VIP Founding Member Portal
                </p>
                <Badge variant="outline" className="mt-2">
                  Early Access until {new Date(organization.early_access_expires_at).toLocaleDateString()}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <Button onClick={copyReferralLink} variant="outline">
                <Link2 className="h-4 w-4 mr-2" />
                Copy VIP Referral Link
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Code: <code className="bg-muted px-2 py-1 rounded">{organization.referral_code}</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{members.length}</p>
                <p className="text-sm text-muted-foreground">Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{activeReferrals}</p>
                <p className="text-sm text-muted-foreground">Active Referrals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-gold" />
              <div>
                <p className="text-2xl font-bold">${totalNetworkValue.toFixed(0)}</p>
                <p className="text-sm text-muted-foreground">Network Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-gold" />
              <div>
                <p className="text-2xl font-bold">{organization.premium_features_unlocked?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Premium Features</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Portal Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team Management</TabsTrigger>
          <TabsTrigger value="referrals">Referral Network</TabsTrigger>
          <TabsTrigger value="features">Premium Features</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>VIP Benefits & Onboarding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-gold/10 to-primary/10 p-4 rounded-lg border border-gold/20">
                <h3 className="font-semibold mb-2">🎉 Welcome to Your VIP Portal!</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  As a founding member, you have exclusive access to premium features and the ability 
                  to build your network with enhanced referral rewards.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    ✅ 6 months premium access<br/>
                    ✅ Custom branded portal<br/>
                    ✅ Priority support & concierge
                  </div>
                  <div>
                    ✅ Enhanced referral rewards<br/>
                    ✅ Founding member badge<br/>
                    ✅ Exclusive webinars & events
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-medium">Next Steps:</h4>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• Invite your team members to join your portal</li>
                  <li>• Share your VIP referral link to earn enhanced rewards</li>
                  <li>• Explore premium features and tools</li>
                  <li>• Schedule your concierge onboarding call</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage your organization's team members and their access levels
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={member.invitation_status === 'accepted' ? 'default' : 'secondary'}>
                        {member.invitation_status}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                ))}
                {members.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No team members yet</p>
                    <p className="text-sm">Invite your colleagues to join your VIP portal</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>VIP Referral Network</CardTitle>
              <p className="text-sm text-muted-foreground">
                Track your referral network and enhanced VIP rewards
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {referralNetwork.map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{referral.referee_email}</p>
                      <p className="text-sm text-muted-foreground">
                        {referral.referee_organization} • Level {referral.network_level}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={referral.activation_status === 'activated' ? 'default' : 'secondary'}>
                        {referral.activation_status}
                      </Badge>
                      <div className="text-right text-sm">
                        <p className="font-medium">${referral.total_credits_earned}</p>
                        <p className="text-muted-foreground">earned</p>
                      </div>
                    </div>
                  </div>
                ))}
                {referralNetwork.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No referrals yet</p>
                    <p className="text-sm">Share your VIP referral link to start building your network</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Premium Features</CardTitle>
              <p className="text-sm text-muted-foreground">
                Exclusive features unlocked for VIP founding members
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {organization.premium_features_unlocked?.map((feature, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-gold" />
                      <span className="font-medium capitalize">{feature.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
                {(!organization.premium_features_unlocked || organization.premium_features_unlocked.length === 0) && (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Premium features will be unlocked as you reach milestones</p>
                    <p className="text-sm">Continue referring and growing your network</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};