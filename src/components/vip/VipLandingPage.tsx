import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Crown, 
  Star, 
  Clock, 
  Users, 
  Shield, 
  Zap,
  Check,
  Mail,
  Phone,
  Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface VipInvite {
  id: string;
  slug: string;
  name: string;
  firm: string;
  persona_type: string;
  email: string;
  phone?: string;
  linkedin_url?: string;
  invite_status: 'reserved' | 'sent' | 'viewed' | 'activated';
  activation_link: string;
  persona_group: string;
  batch_name: string;
  custom_message?: string;
  landing_page_data?: any;
}

export const VipLandingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [vipInvite, setVipInvite] = useState<VipInvite | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [activationForm, setActivationForm] = useState({
    password: '',
    confirmPassword: '',
    phone: '',
    linkedin: '',
    acceptTerms: false
  });

  useEffect(() => {
    if (slug) {
      loadVipInvite(slug);
    }
  }, [slug]);

  const loadVipInvite = async (inviteSlug: string) => {
    // TODO: Uncomment after VIP migration is run
    // try {
    //   setLoading(true);
    //   
    //   const { data, error } = await supabase
    //     .from('vip_invites')
    //     .select('*')
    //     .eq('slug', inviteSlug)
    //     .single();

    //   if (error) {
    //     console.error('Error loading VIP invite:', error);
    //     toast.error('Invite not found');
    //     navigate('/marketplace');
    //     return;
    //   }

    //   setVipInvite(data);
    //   setIsActivated(data.invite_status === 'activated');

    //   // Track page view
    //   await supabase
    //     .from('vip_invitation_tracking')
    //     .insert({
    //       vip_invite_id: data.id,
    //       action_type: 'page_viewed',
    //       user_agent: navigator.userAgent,
    //       ip_address: await getUserIP()
    //     });

    //   // Update invite status to viewed if not already
    //   if (data.invite_status === 'sent') {
    //     await supabase
    //       .from('vip_invites')
    //       .update({ invite_status: 'viewed' })
    //       .eq('id', data.id);
    //   }

    // } catch (error) {
    //   console.error('Error loading VIP invite:', error);
    //   toast.error('Failed to load invitation');
    // } finally {
    //   setLoading(false);
    // }
    setLoading(false);
  };

  const getUserIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  };

  const handleActivation = async () => {
    if (!vipInvite) return;

    if (activationForm.password !== activationForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!activationForm.acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    try {
      setActivating(true);

      // Create user account or update existing
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: vipInvite.email,
        password: activationForm.password,
        options: {
          data: {
            name: vipInvite.name,
            firm: vipInvite.firm,
            persona_type: vipInvite.persona_type,
            vip_status: 'founding_member',
            vip_batch: vipInvite.batch_name
          }
        }
      });

      if (authError && !authError.message.includes('already registered')) {
        throw authError;
      }

      // TODO: Uncomment after VIP migration is run
      // Update VIP invite status
      // await supabase
      //   .from('vip_invites')
      //   .update({ 
      //     invite_status: 'activated',
      //     activated_at: new Date().toISOString(),
      //     activation_data: {
      //       phone: activationForm.phone,
      //       linkedin: activationForm.linkedin,
      //       activation_ip: await getUserIP()
      //     }
      //   })
      //   .eq('id', vipInvite.id);

      // Track activation
      // await supabase
      //   .from('vip_invitation_tracking')
      //   .insert({
      //     vip_invite_id: vipInvite.id,
      //     action_type: 'profile_activated',
      //     user_agent: navigator.userAgent,
      //     ip_address: await getUserIP(),
      //     additional_data: {
      //       phone: activationForm.phone,
      //       linkedin: activationForm.linkedin
      //     }
      //   });

      setIsActivated(true);
      toast.success('Welcome to the Founding Members! Your VIP profile is now active.');

      // Redirect to onboarding after a delay
      setTimeout(() => {
        navigate('/onboarding');
      }, 3000);

    } catch (error) {
      console.error('Error activating VIP profile:', error);
      toast.error('Failed to activate profile. Please try again.');
    } finally {
      setActivating(false);
    }
  };

  const getPersonaDisplayName = (personaType: string) => {
    switch (personaType) {
      case 'advisor': return 'Financial Advisor';
      case 'attorney': return 'Legal Counsel';
      case 'cpa': return 'CPA';
      case 'accountant': return 'Accountant';
      case 'insurance_agent': return 'Insurance Professional';
      case 'consultant': return 'Consultant';
      case 'coach': return 'Coach';
      case 'healthcare_consultant': return 'Healthcare Consultant';
      case 'realtor': return 'Real Estate Professional';
      case 'property_manager': return 'Property Manager';
      default: return 'Professional';
    }
  };

  const getPersonaBenefits = (personaType: string) => {
    const commonBenefits = [
      'Founding Member VIP Badge',
      'Priority Support & Direct Access',
      'Exclusive Networking Events',
      'Early Access to New Features',
      'Custom Branding Options'
    ];

    const specificBenefits: Record<string, string[]> = {
      advisor: [
        'Premium Client Management Tools',
        'Advanced Portfolio Analytics',
        'Exclusive HNW Family Network',
        'Commission-Free First Year'
      ],
      attorney: [
        'Secure Document Vault',
        'Legal Compliance Automation',
        'Family Office Client Referrals',
        'CLE Credit Tracking'
      ],
      cpa: [
        'Tax Workflow Automation',
        'CE Credit Management',
        'Client Tax Portal Access',
        'Multi-State Compliance Tools'
      ],
      accountant: [
        'Automated Bookkeeping Tools',
        'Client Financial Dashboards',
        'Tax Season Support',
        'Practice Management Suite'
      ]
    };

    return [...commonBenefits, ...(specificBenefits[personaType] || [])];
  };

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

  if (!vipInvite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy via-primary to-slate-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <h2 className="text-xl font-bold mb-4">Invitation Not Found</h2>
            <p className="text-muted-foreground mb-6">
              This VIP invitation link is invalid or has expired.
            </p>
            <Button onClick={() => navigate('/marketplace')}>
              Go to Marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-primary to-slate-900">
      {/* Gold tree watermark */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg width="400" height="400" viewBox="0 0 100 100" className="text-gold">
            <path fill="currentColor" d="M50 10 L35 40 L15 40 L30 55 L25 85 L50 70 L75 85 L70 55 L85 40 L65 40 Z"/>
            <rect x="47" y="70" width="6" height="20" fill="currentColor"/>
          </svg>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
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
            <Badge className="bg-gradient-to-r from-gold to-yellow-500 text-navy text-lg px-6 py-2">
              {vipInvite.batch_name} • {getPersonaDisplayName(vipInvite.persona_type)}
            </Badge>
          </div>

          <AnimatePresence mode="wait">
            {isActivated ? (
              <motion.div
                key="activated"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center"
              >
                <Card className="max-w-2xl mx-auto bg-white/10 backdrop-blur border-gold/20">
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="h-10 w-10 text-navy" />
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2">Welcome to the Elite!</h2>
                      <p className="text-gold">Your VIP Founding Member profile is now active</p>
                    </div>
                    
                    <div className="space-y-4 text-white/80">
                      <p>🎉 You're now part of an exclusive group of {vipInvite.batch_name} industry leaders</p>
                      <p>✨ Your founding member benefits are being prepared</p>
                      <p>🚀 Redirecting you to complete your profile setup...</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="activation"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="grid lg:grid-cols-2 gap-8"
              >
                {/* Welcome Card */}
                <Card className="bg-white/10 backdrop-blur border-gold/20">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8 text-navy" />
                    </div>
                    <CardTitle className="text-2xl text-white">
                      Welcome, {vipInvite.name}!
                    </CardTitle>
                    <p className="text-gold">{vipInvite.firm}</p>
                    <Badge variant="outline" className="border-gold text-gold">
                      {getPersonaDisplayName(vipInvite.persona_type)}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <p className="text-white/90 leading-relaxed">
                        You've been personally selected as one of the first{' '}
                        <span className="text-gold font-semibold">{vipInvite.batch_name}</span> to pioneer 
                        the Family Office Marketplace™. Your reserved VIP profile is ready to activate.
                      </p>
                    </div>

                    {vipInvite.custom_message && (
                      <div className="bg-gold/10 border border-gold/20 rounded-lg p-4">
                        <p className="text-gold text-sm italic">"{vipInvite.custom_message}"</p>
                      </div>
                    )}

                    <div className="space-y-3">
                      <h4 className="text-white font-semibold flex items-center gap-2">
                        <Zap className="h-4 w-4 text-gold" />
                        Your Founding Member Benefits:
                      </h4>
                      <div className="space-y-2">
                        {getPersonaBenefits(vipInvite.persona_type).map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-white/80">
                            <Check className="h-4 w-4 text-emerald-400" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-2">
                        <Clock className="h-4 w-4" />
                        Limited Time Offer
                      </div>
                      <p className="text-emerald-300 text-sm">
                        First 25 to activate receive permanent "VIP Pioneer" status and lifetime benefits.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Activation Form */}
                <Card className="bg-white/10 backdrop-blur border-gold/20">
                  <CardHeader>
                    <CardTitle className="text-white text-center">
                      Claim Your VIP Profile
                    </CardTitle>
                    <p className="text-gold text-center">Complete activation to join the elite</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-white text-sm font-medium">Create Password</label>
                        <Input
                          type="password"
                          placeholder="Strong password..."
                          value={activationForm.password}
                          onChange={(e) => setActivationForm(prev => ({ ...prev, password: e.target.value }))}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>

                      <div>
                        <label className="text-white text-sm font-medium">Confirm Password</label>
                        <Input
                          type="password"
                          placeholder="Confirm password..."
                          value={activationForm.confirmPassword}
                          onChange={(e) => setActivationForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>

                      <div>
                        <label className="text-white text-sm font-medium">Phone (Optional)</label>
                        <Input
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={activationForm.phone}
                          onChange={(e) => setActivationForm(prev => ({ ...prev, phone: e.target.value }))}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>

                      <div>
                        <label className="text-white text-sm font-medium">LinkedIn URL (Optional)</label>
                        <Input
                          type="url"
                          placeholder="https://linkedin.com/in/yourprofile"
                          value={activationForm.linkedin}
                          onChange={(e) => setActivationForm(prev => ({ ...prev, linkedin: e.target.value }))}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>

                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={activationForm.acceptTerms}
                          onChange={(e) => setActivationForm(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                          className="mt-1"
                        />
                        <label htmlFor="terms" className="text-white/80 text-sm">
                          I accept the Terms of Service and Privacy Policy, and agree to founding member commitments.
                        </label>
                      </div>

                      <Button
                        onClick={handleActivation}
                        disabled={!activationForm.password || !activationForm.confirmPassword || !activationForm.acceptTerms || activating}
                        className="w-full bg-gradient-to-r from-gold to-yellow-500 text-navy font-bold py-3 hover:from-yellow-500 hover:to-gold"
                        size="lg"
                      >
                        {activating ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-navy"></div>
                            Activating...
                          </div>
                        ) : (
                          <>
                            <Crown className="h-5 w-5 mr-2" />
                            Activate VIP Profile
                          </>
                        )}
                      </Button>

                      <div className="text-center">
                        <div className="flex items-center justify-center gap-4 text-white/60 text-sm">
                          <div className="flex items-center gap-1">
                            <Shield className="h-4 w-4" />
                            Secure
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Exclusive
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};