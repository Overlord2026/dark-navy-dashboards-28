import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, CheckCircle, Users, Star, Gift, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { VIPBadge } from '@/components/badges/VIPBadgeSystem';
import { useAuth } from '@/context/AuthContext';

interface VIPOrganizationData {
  id: string;
  organization_name: string;
  organization_type: string;
  vip_tier: string;
  contact_name: string;
  contact_email: string;
  logo_url?: string;
  brand_colors: {
    primary: string;
    secondary: string;
  };
  custom_banner_url?: string;
  specialties?: string[];
  premium_features_unlocked: string[];
  early_access_expires_at: string;
  referral_code: string;
}

export const VIPMagicLinkOnboarding: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [organization, setOrganization] = useState<VIPOrganizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [step, setStep] = useState<'verify' | 'auth' | 'welcome'>('verify');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    verifyMagicLink();
  }, [token]);

  useEffect(() => {
    if (user && organization) {
      setStep('welcome');
    }
  }, [user, organization]);

  const verifyMagicLink = async () => {
    try {
      const { data, error } = await supabase
        .from('vip_organizations')
        .select('*')
        .eq('magic_link_token', token)
        .gt('magic_link_expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        throw new Error('Invalid or expired invitation link');
      }

      const processedOrgData = {
        ...data,
        premium_features_unlocked: Array.isArray(data.premium_features_unlocked) 
          ? (data.premium_features_unlocked as string[])
          : [],
        brand_colors: data.brand_colors 
          ? (typeof data.brand_colors === 'object' && data.brand_colors !== null 
            ? data.brand_colors as { primary: string; secondary: string }
            : { primary: '#000000', secondary: '#666666' })
          : { primary: '#000000', secondary: '#666666' }
      };

      setOrganization(processedOrgData);
      setFormData(prev => ({ ...prev, email: data.contact_email }));
      setStep('auth');
    } catch (error: any) {
      console.error('Error verifying magic link:', error);
      toast({
        title: 'Invalid Invitation',
        description: 'This invitation link is invalid or has expired.',
        variant: 'destructive',
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) return;

    setActivating(true);
    try {
      if (authMode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              persona: organization.organization_type,
              vip_organization_id: organization.id
            }
          }
        });

        if (authError) throw authError;

      } else {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (authError) throw authError;
      }

      // Activate VIP organization
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        const activationResult = await supabase.rpc('activate_vip_organization', {
          p_magic_token: token,
          p_user_id: currentUser.id
        });

        const result = activationResult.data as any;
        if (!result?.success) {
          throw new Error(result?.error || 'Failed to activate VIP organization');
        }

        toast({
          title: 'Welcome to VIP!',
          description: `${organization.organization_name} has been successfully activated.`,
        });

        setStep('welcome');
      }
    } catch (error: any) {
      console.error('Error during authentication/activation:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setActivating(false);
    }
  };

  const getPersonaBenefits = (personaType: string) => {
    const benefits = {
      advisor: [
        'Custom branded advisor dashboard',
        'Enhanced client referral rewards (6 months free per 3 clients)',
        'Premium compliance and analytics tools',
        'Founding member marketplace listing'
      ],
      attorney: [
        'Branded legal partner portal',
        'Client intake and case management',
        'Attorney referral network access',
        'Document automation and e-signature'
      ],
      cpa: [
        'Custom CPA practice dashboard',
        'Tax planning collaboration tools',
        'Client document management',
        'Professional referral network'
      ],
      default: [
        'Custom branded portal',
        'Enhanced referral rewards system',
        'Premium platform features',
        'Founding member recognition'
      ]
    };

    return benefits[personaType as keyof typeof benefits] || benefits.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-3">
          <Crown className="h-8 w-8 text-gold" />
          <span className="text-xl font-semibold">Verifying VIP invitation...</span>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Crown className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Invalid Invitation</h2>
            <p className="text-muted-foreground">
              This VIP invitation link is invalid or has expired.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto py-8 px-4">
          <Card 
            className="max-w-4xl mx-auto relative overflow-hidden border-2"
            style={{ 
              borderColor: organization.brand_colors.primary,
              background: `linear-gradient(135deg, ${organization.brand_colors.primary}10, ${organization.brand_colors.secondary}10)`
            }}
          >
            {organization.custom_banner_url && (
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-10"
                style={{ backgroundImage: `url(${organization.custom_banner_url})` }}
              />
            )}
            
            <CardContent className="relative p-8">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Crown className="h-10 w-10 text-gold" />
                  <VIPBadge type={organization.vip_tier as any} size="lg" animated={true} />
                </div>
                <h1 className="text-4xl font-bold mb-2">Welcome to Your VIP Portal!</h1>
                <p className="text-xl text-muted-foreground">
                  {organization.organization_name} is now a founding member
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    {organization.logo_url && (
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={organization.logo_url} alt={organization.organization_name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                          {organization.organization_name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <h2 className="text-2xl font-bold">{organization.organization_name}</h2>
                      <p className="text-muted-foreground capitalize">
                        {organization.organization_type.replace('_', ' ')} • {organization.contact_name}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gold/10 to-primary/10 p-4 rounded-lg border border-gold/20">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Gift className="h-4 w-4" />
                      Your VIP Benefits
                    </h3>
                    <ul className="space-y-1 text-sm">
                      {getPersonaBenefits(organization.organization_type).map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Your VIP Dashboard Features</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        Team Management
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-gold" />
                        Referral Network
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Premium Features
                      </div>
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4 text-gold" />
                        Founding Member Wall
                      </div>
                    </div>
                  </div>

                  <div className="border border-gold/20 p-4 rounded-lg bg-gradient-to-r from-gold/5 to-primary/5">
                    <h4 className="font-medium mb-2">Your Referral Code</h4>
                    <div className="flex items-center justify-between bg-background p-2 rounded border">
                      <code className="font-mono text-sm">{organization.referral_code}</code>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/signup?ref=${organization.referral_code}&vip=true`);
                          toast({ title: 'Copied', description: 'Referral link copied to clipboard' });
                        }}
                      >
                        Copy Link
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Share this link to invite clients and earn enhanced rewards
                    </p>
                  </div>

                  {organization.early_access_expires_at && (
                    <Badge variant="outline" className="w-full justify-center py-2">
                      VIP Early Access until {new Date(organization.early_access_expires_at).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button size="lg" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Enter Your VIP Portal
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/vip-founders')}>
                  View Founding Members
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-gold" />
            <VIPBadge type={organization.vip_tier as any} size="md" animated={true} />
          </div>
          <CardTitle className="text-2xl">VIP Invitation</CardTitle>
          <p className="text-muted-foreground">
            Welcome to {organization.organization_name}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="text-center mb-4">
              <div className="flex justify-center gap-1 mb-2">
                <Button
                  type="button"
                  variant={authMode === 'signup' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAuthMode('signup')}
                >
                  Sign Up
                </Button>
                <Button
                  type="button"
                  variant={authMode === 'signin' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAuthMode('signin')}
                >
                  Sign In
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              {authMode === 'signup' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>

              {authMode === 'signup' && (
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={activating}>
              {activating ? 'Activating...' : `Activate VIP ${authMode === 'signup' ? 'Account' : 'Access'}`}
            </Button>
          </form>

          <div className="mt-4 text-xs text-muted-foreground text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy.
            VIP rewards apply only to platform usage, not investment services.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};