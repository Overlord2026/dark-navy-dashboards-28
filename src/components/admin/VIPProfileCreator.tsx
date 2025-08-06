import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Crown, Users, Mail, Building } from 'lucide-react';

interface VIPProfileData {
  orgName: string;
  primaryContact: string;
  email: string;
  profileSummary: string;
  landingBanner: string;
  personalNote: string;
  persona: string;
}

const PRE_DEFINED_VIPS: VIPProfileData[] = [
  {
    orgName: 'Kitces.com / Nerd\'s Eye View',
    primaryContact: 'Michael Kitces',
    email: 'michael@kitces.com',
    profileSummary: 'Kitces.com—Setting the standard in advisor education, now a Founding VIP on the Boutique Family Office Marketplace.',
    landingBanner: 'Exclusive: Kitces.com Founders\' Portal',
    personalNote: 'Michael, your thought leadership has shaped the future of the advisor profession. We\'re honored to recognize you as an inaugural Founding VIP. Your portal is live, and your insights will help shape our next chapter.',
    persona: 'advisor'
  },
  {
    orgName: 'C2P Enterprises / The Mastermind Group',
    primaryContact: 'Dave Allison & Jason Smith',
    email: 'dave.allison@c2penterprises.com',
    profileSummary: 'C2P Enterprises—Empowering Advisors, now a Founding VIP on the Boutique Family Office Marketplace.',
    landingBanner: 'C2P Mastermind—Founders\' Dashboard',
    personalNote: 'Dave & Jason, your C2P vision for advisors aligns perfectly with our mission. We\'re excited to welcome you as VIP Founders—your custom portal and invitation to shape our industry\'s future are ready!',
    persona: 'advisor'
  }
];

export const VIPProfileCreator: React.FC = () => {
  const [creating, setCreating] = useState<string | null>(null);
  const [customProfile, setCustomProfile] = useState<VIPProfileData>({
    orgName: '',
    primaryContact: '',
    email: '',
    profileSummary: '',
    landingBanner: '',
    personalNote: '',
    persona: 'advisor'
  });

  const createVIPProfile = async (profile: VIPProfileData) => {
    setCreating(profile.orgName);
    
    try {
      // For now, we'll create the VIP profile structure in the existing tables
      // This will be updated when the migration runs and types are regenerated
      
      // Create in reserved profiles for now (will migrate to vip_organizations later)
      const { data: vipProfile, error: profileError } = await supabase
        .from('reserved_profiles')
        .insert({
          name: profile.primaryContact,
          email: profile.email,
          organization: profile.orgName,
          persona_type: profile.persona,
          priority_level: 'high',
          segment: 'founding_member',
          notes: `VIP Profile: ${profile.profileSummary}\n\nBanner: ${profile.landingBanner}\n\nPersonal Note: ${profile.personalNote}`,
          is_active: true
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Generate a simple invitation token for now
      const invitationToken = `vip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Update with invitation token
      await supabase
        .from('reserved_profiles')
        .update({ invitation_token: invitationToken })
        .eq('id', vipProfile.id);

      const magicLink = `${window.location.origin}/vip-invite/${invitationToken}`;

      toast.success(`VIP profile created for ${profile.orgName}`, {
        description: `Magic link: ${magicLink}`
      });

    } catch (error: any) {
      console.error('Error creating VIP profile:', error);
      toast.error('Failed to create VIP profile', {
        description: error.message
      });
    } finally {
      setCreating(null);
    }
  };

  const generateEmailContent = (profile: VIPProfileData, magicLink: string): string => {
    return `
Hi ${profile.primaryContact},

You've been selected as an inaugural VIP Founding Member of the Boutique Family Office Marketplace—our industry's next-generation platform for advisor, family, and professional collaboration.

We've pre-built your ${profile.orgName} Founders' Portal, unlocking premium access, a dedicated dashboard, and the chance to shape the advisor experience for years to come.

👉 Access Your Portal: ${magicLink}

${profile.personalNote}

Welcome aboard!

Tony Gomes  
Founder, Boutique Family Office  
tony@awmfl.com
    `.trim();
  };

  const createCustomProfile = async () => {
    if (!customProfile.orgName || !customProfile.primaryContact || !customProfile.email) {
      toast.error('Please fill in required fields');
      return;
    }
    await createVIPProfile(customProfile);
    setCustomProfile({
      orgName: '',
      primaryContact: '',
      email: '',
      profileSummary: '',
      landingBanner: '',
      personalNote: '',
      persona: 'advisor'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Crown className="h-8 w-8 text-gold" />
        <div>
          <h2 className="text-2xl font-bold">VIP Profile Creator</h2>
          <p className="text-muted-foreground">
            Pre-create branded portals for top industry leaders
          </p>
        </div>
      </div>

      {/* Pre-defined VIPs */}
      <div className="grid gap-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Pre-defined VIP Leaders
        </h3>
        
        {PRE_DEFINED_VIPS.map((profile, index) => (
          <Card key={index} className="border-gold/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{profile.orgName}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {profile.persona}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-gold/50 text-gold">
                      Founding Member
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={() => createVIPProfile(profile)}
                  disabled={creating === profile.orgName}
                  className="bg-gradient-gold hover:bg-gradient-gold/90"
                >
                  {creating === profile.orgName ? 'Creating...' : 'Create VIP Profile'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{profile.primaryContact}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{profile.email}</span>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg mt-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Landing Banner:</p>
                  <p className="text-sm">{profile.landingBanner}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom VIP Creator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Create Custom VIP Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="orgName">Organization Name *</Label>
              <Input
                id="orgName"
                value={customProfile.orgName}
                onChange={(e) => setCustomProfile(prev => ({ ...prev, orgName: e.target.value }))}
                placeholder="e.g., Kitces.com / Nerd's Eye View"
              />
            </div>
            <div>
              <Label htmlFor="primaryContact">Primary Contact *</Label>
              <Input
                id="primaryContact"
                value={customProfile.primaryContact}
                onChange={(e) => setCustomProfile(prev => ({ ...prev, primaryContact: e.target.value }))}
                placeholder="e.g., Michael Kitces"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={customProfile.email}
                onChange={(e) => setCustomProfile(prev => ({ ...prev, email: e.target.value }))}
                placeholder="contact@organization.com"
              />
            </div>
            <div>
              <Label htmlFor="persona">Persona Type</Label>
              <select
                id="persona"
                value={customProfile.persona}
                onChange={(e) => setCustomProfile(prev => ({ ...prev, persona: e.target.value }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="advisor">Advisor</option>
                <option value="attorney">Attorney</option>
                <option value="cpa">CPA</option>
                <option value="healthcare">Healthcare</option>
                <option value="insurance">Insurance</option>
                <option value="consultant">Consultant</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="landingBanner">Landing Banner Text</Label>
            <Input
              id="landingBanner"
              value={customProfile.landingBanner}
              onChange={(e) => setCustomProfile(prev => ({ ...prev, landingBanner: e.target.value }))}
              placeholder="Exclusive: [Org] Founders' Portal"
            />
          </div>

          <div>
            <Label htmlFor="profileSummary">Profile Summary</Label>
            <Textarea
              id="profileSummary"
              value={customProfile.profileSummary}
              onChange={(e) => setCustomProfile(prev => ({ ...prev, profileSummary: e.target.value }))}
              placeholder="Brief description of the organization..."
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="personalNote">Personal Note (for invitation)</Label>
            <Textarea
              id="personalNote"
              value={customProfile.personalNote}
              onChange={(e) => setCustomProfile(prev => ({ ...prev, personalNote: e.target.value }))}
              placeholder="Personalized message for the invitation..."
              rows={3}
            />
          </div>

          <Button onClick={createCustomProfile} className="w-full">
            Create Custom VIP Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};