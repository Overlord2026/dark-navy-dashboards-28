import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Crown, Star, Users, CheckCircle, Clock, Mail, Phone, Building } from 'lucide-react';
import { toast } from 'sonner';
import { VipInvite, PERSONA_DISPLAY_NAMES, INVITE_STATUS_COLORS } from '@/types/vip';

export const VipLandingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [invite, setInvite] = useState<VipInvite | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchInvite();
    }
  }, [slug]);

  const fetchInvite = async () => {
    try {
      setLoading(true);
      
      // Using type assertion since the table exists but TypeScript doesn't know yet
      const { data, error } = await supabase
        .from('vip_invites' as any)
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      const vipInvite = data as unknown as VipInvite;
      setInvite(vipInvite);
      
      if (vipInvite.invite_status === 'pending' || vipInvite.invite_status === 'sent') {
        // Track page view
        await supabase
          .from('vip_invitation_tracking' as any)
          .insert({
            invite_id: vipInvite.id,
            channel: 'direct',
            viewed_at: new Date().toISOString()
          });

        // Update invite status to viewed
        if (vipInvite.invite_status === 'sent') {
          await supabase
            .from('vip_invites' as any)
            .update({ 
              invite_status: 'viewed' 
            })
            .eq('id', vipInvite.id);
        }
      }
    } catch (error) {
      console.error('Error fetching invite:', error);
      toast.error('Failed to load invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!invite) return;

    try {
      setActivating(true);

      // Update invite status to activated
      const { error } = await supabase
        .from('vip_invites' as any)
        .update({ 
          invite_status: 'activated',
          activated_at: new Date().toISOString(),
          is_public_directory: true
        })
        .eq('id', invite.id);

      if (error) throw error;

      // Track activation
      await supabase
        .from('vip_invitation_tracking' as any)
        .insert({
          invite_id: invite.id,
          channel: 'direct',
          clicked_at: new Date().toISOString()
        });

      toast.success('VIP profile activated successfully!');
      setInvite({ ...invite, invite_status: 'activated', activated_at: new Date().toISOString() });
    } catch (error) {
      console.error('Error activating invite:', error);
      toast.error('Failed to activate VIP profile');
    } finally {
      setActivating(false);
    }
  };

  const getUrgencyData = async () => {
    if (!invite) return { spotsLeft: 100, totalSpots: 100 };

    try {
      const { count: totalInvites } = await supabase
        .from('vip_invites' as any)
        .select('*', { count: 'exact', head: true })
        .eq('batch_name', invite.batch_name || 'VIP 100');

      const { count: activatedInvites } = await supabase
        .from('vip_invites' as any)
        .select('*', { count: 'exact', head: true })
        .eq('invite_status', 'activated');

      const spotsLeft = Math.max(0, (totalInvites || 100) - (activatedInvites || 0));
      return { spotsLeft, totalSpots: totalInvites || 100 };
    } catch (error) {
      console.error('Error fetching urgency data:', error);
      return { spotsLeft: 100, totalSpots: 100 };
    }
  };

  const [urgencyData, setUrgencyData] = useState({ spotsLeft: 100, totalSpots: 100 });

  useEffect(() => {
    if (invite) {
      getUrgencyData().then(setUrgencyData);
    }
  }, [invite]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy via-primary to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gold">Loading your VIP invitation...</p>
        </div>
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy via-primary to-slate-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <h2 className="text-xl font-bold mb-4">Invitation Not Found</h2>
            <p className="text-muted-foreground mb-6">
              This VIP invitation link is invalid or has expired.
            </p>
            <Button onClick={() => window.location.href = '/marketplace'}>
              Go to Marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-primary to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Crown className="h-8 w-8 text-gold" />
              <h1 className="text-4xl font-bold text-white">VIP FOUNDING MEMBER</h1>
              <Crown className="h-8 w-8 text-gold" />
            </div>
            <Badge className="bg-gradient-to-r from-gold to-yellow-500 text-white">
              {PERSONA_DISPLAY_NAMES[invite.persona_type as keyof typeof PERSONA_DISPLAY_NAMES]} VIP
            </Badge>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Welcome Card */}
            <Card className="bg-white/10 backdrop-blur border-gold/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-navy" />
                </div>
                <CardTitle className="text-2xl text-white">
                  Welcome, {invite.name}!
                </CardTitle>
                {invite.firm && <p className="text-gold">{invite.firm}</p>}
                <Badge className={INVITE_STATUS_COLORS[invite.invite_status as keyof typeof INVITE_STATUS_COLORS]}>
                  {invite.invite_status === 'activated' ? 'VIP Claimed' : 'Reserved Spot'}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-white/90 leading-relaxed">
                    You've been personally selected as one of the first{' '}
                    <span className="text-gold font-semibold">{invite.batch_name || 'VIP 100'}</span> to pioneer 
                    the Family Office Marketplace™. Your reserved VIP profile is ready to activate.
                  </p>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-2">
                    <Clock className="h-4 w-4" />
                    Exclusive Access
                  </div>
                  <p className="text-emerald-300 text-sm">
                    Only {urgencyData.spotsLeft} of {urgencyData.totalSpots} VIP spots remaining. 
                    Activate now to secure your founding member status.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <Star className="h-4 w-4 text-gold" />
                    Your VIP Benefits:
                  </h4>
                  <div className="space-y-2">
                    {[
                      'Founding Member VIP Badge',
                      'Priority Support & Direct Access',
                      'Exclusive Networking Events',
                      'Early Access to New Features',
                      'Premium Profile Directory Listing'
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-white/80">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activation Card */}
            <Card className="bg-white/10 backdrop-blur border-gold/20">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  {invite.invite_status === 'activated' ? 'Profile Activated!' : 'Activate Your VIP Profile'}
                </CardTitle>
                {invite.invite_status !== 'activated' && (
                  <p className="text-gold text-center">Join the elite founding members</p>
                )}
              </CardHeader>
              <CardContent className="text-center">
                {invite.invite_status === 'activated' ? (
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="h-10 w-10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">Welcome to the Elite!</h3>
                      <p className="text-emerald-300">Your VIP profile is now active and visible in our directory.</p>
                      <p className="text-white/70 text-sm">You'll receive an email with next steps shortly.</p>
                    </div>
                    <Button 
                      onClick={() => window.location.href = '/marketplace'}
                      className="bg-gold hover:bg-gold/90 text-navy"
                    >
                      Visit Marketplace
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-2 text-white/80">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">{invite.email}</span>
                      </div>
                      {invite.phone && (
                        <div className="flex items-center justify-center gap-2 text-white/80">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm">{invite.phone}</span>
                        </div>
                      )}
                      {invite.firm && (
                        <div className="flex items-center justify-center gap-2 text-white/80">
                          <Building className="h-4 w-4" />
                          <span className="text-sm">{invite.firm}</span>
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={handleActivate}
                      disabled={activating}
                      className="w-full bg-gradient-to-r from-gold to-yellow-500 hover:from-gold/90 hover:to-yellow-500/90 text-navy font-semibold py-3"
                    >
                      {activating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-navy mr-2"></div>
                          Activating...
                        </>
                      ) : (
                        <>
                          <Crown className="h-4 w-4 mr-2" />
                          Activate My VIP Profile
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-white/60">
                      By activating, you agree to our Terms of Service and Privacy Policy.
                      Your profile will be added to our VIP directory.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};