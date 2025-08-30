import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Shield, Award, Building2, Play, Share, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { invite, accept, getInvites, getPendingInvites, PendingInvite } from '@/features/nil/invite/api';
import { issueConsent, revokeConsent, getActiveConsents, ConsentRequest } from '@/features/nil/consent/api';
import { ConsentRDS } from '@/features/receipts/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getFlag } from '@/lib/flags';
import { DemoTipsPopover } from '@/components/nil/DemoTipsPopover';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';

export default function MarketplacePage() {
  const navigate = useNavigate();
  const [invites, setInvites] = React.useState<PendingInvite[]>([]);
  const [activeConsents, setActiveConsents] = React.useState<ConsentRDS[]>([]);
  const [showInviteForm, setShowInviteForm] = React.useState(false);
  const [showConsentForm, setShowConsentForm] = React.useState(false);
  
  // Form state
  const [inviteForm, setInviteForm] = React.useState({
    role: 'advisor' as 'advisor' | 'cpa' | 'attorney',
    email: ''
  });

  const [consentForm, setConsentForm] = React.useState<ConsentRequest>({
    roles: [],
    resources: [],
    ttlDays: 365,
    purpose_of_use: 'contract_collab'
  });

  React.useEffect(() => {
    setInvites(getInvites());
    setActiveConsents(getActiveConsents());
  }, []);

  const handleSendInvite = () => {
    if (!inviteForm.email || !inviteForm.role) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const { pendingId } = invite(inviteForm.role, inviteForm.email);
      setInvites(getInvites());
      setShowInviteForm(false);
      
      // Reset form
      setInviteForm({ role: 'advisor', email: '' });

      toast.success('Invite sent successfully!', {
        description: `Invitation sent to ${inviteForm.email}`,
        action: {
          label: 'View Invites',
          onClick: () => console.log('Pending ID:', pendingId)
        }
      });
    } catch (error) {
      toast.error('Failed to send invite');
    }
  };

  const handleBrandStart = () => {
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('brand.start.click', { 
        source: 'nil-marketplace-sticky',
        campaign: 'quick-start'
      });
    }
    navigate('/start/brand');
  };

  const handleAthleteDemo = () => {
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('demo.open', { 
        source: 'nil-marketplace-sticky',
        demoId: 'nil-athlete'
      });
    }
    navigate('/demos/nil-athlete');
  };

  const handleSchoolDemo = () => {
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('demo.open', { 
        source: 'nil-marketplace-sticky',
        demoId: 'nil-school'
      });
    }
    navigate('/demos/nil-school');
  };

  const handleShare = async () => {
    const shareData = {
      title: 'NIL Marketplace',
      text: 'NIL collaboration platform connecting athletes, brands, and advisors with compliance built-in.',
      url: window.location.href
    };

    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('share.click', { 
        source: 'nil-marketplace-sticky'
      });
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        console.log('Share cancelled');
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Could not copy link");
    }
  };

  return (
    <>
      <Helmet>
        <title>NIL Platform — Athlete as Hero | myBFOCFO</title>
        <meta name="description" content="Name, Image & Likeness marketplace connecting athletes with brands. Manage NIL deals, compliance, and partnerships in one secure platform." />
        <meta property="og:title" content="NIL Platform — Athlete as Hero | myBFOCFO" />
        <meta property="og:description" content="Name, Image & Likeness marketplace connecting athletes with brands. Manage NIL deals, compliance, and partnerships in one secure platform." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
      </Helmet>

      <div className="min-h-screen bg-bfo-black text-white relative">
        <div className="container mx-auto py-8 pb-24">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-bfo-gold/20 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-bfo-gold" />
              </div>
              <h1 className="text-3xl font-bold text-white">NIL Marketplace</h1>
            </div>
            <p className="text-white/70">
              Collaborate with advisors, CPAs, and attorneys on NIL contracts
            </p>
          </div>

          <div className="grid gap-6">
            {/* Invite Section */}
            <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
              <CardHeader className="border-b border-bfo-gold/30">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-white font-semibold">
                      <UserPlus className="h-5 w-5 text-bfo-gold" />
                      Professional Invites
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Invite professionals to collaborate on your NIL deals
                    </CardDescription>
                  </div>
                  <GoldButton onClick={() => setShowInviteForm(true)}>
                    Send Invite
                  </GoldButton>
                </div>
              </CardHeader>
              <CardContent>
                {showInviteForm && (
                  <div className="mb-6 p-4 border border-bfo-gold/30 rounded-lg space-y-4 bg-bfo-black/30">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white">Professional Role</Label>
                        <Select value={inviteForm.role} onValueChange={(value: any) => setInviteForm(prev => ({ ...prev, role: value }))}>
                          <SelectTrigger className="bg-[#24313d] border-bfo-gold/40 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#24313d] border-bfo-gold/40">
                            <SelectItem value="advisor" className="text-white hover:bg-bfo-gold/20">Financial Advisor</SelectItem>
                            <SelectItem value="cpa" className="text-white hover:bg-bfo-gold/20">CPA/Accountant</SelectItem>
                            <SelectItem value="attorney" className="text-white hover:bg-bfo-gold/20">Attorney</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-white">Email Address</Label>
                        <Input
                          type="email"
                          value={inviteForm.email}
                          onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="professional@example.com"
                          className="bg-[#24313d] border-bfo-gold/40 text-white placeholder:text-white/50"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <GoldButton onClick={handleSendInvite}>Send Invite</GoldButton>
                      <GoldOutlineButton onClick={() => setShowInviteForm(false)}>Cancel</GoldOutlineButton>
                    </div>
                  </div>
                )}

                {invites.length > 0 ? (
                  <div className="space-y-3">
                    {invites.map((invite) => (
                      <div key={invite.id} className="flex items-center justify-between p-3 border border-bfo-gold/30 rounded bg-bfo-black/30">
                        <div>
                          <p className="font-medium text-white">{invite.email}</p>
                          <p className="text-sm text-white/70 capitalize">{invite.role}</p>
                        </div>
                        <Badge 
                          variant={invite.status === 'accepted' ? 'default' : 'secondary'}
                          className={invite.status === 'accepted' 
                            ? 'bg-bfo-gold text-black' 
                            : 'bg-white/10 text-white border-white/20'
                          }
                        >
                          {invite.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/50 text-center py-4">No invites sent yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sticky Action Row */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-bfo-black/95 backdrop-blur border-t border-bfo-gold/30">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getFlag('BRAND_PUBLIC_ENABLED') && (
                  <GoldButton 
                    onClick={handleBrandStart}
                    className="flex items-center gap-2 min-h-[44px]"
                  >
                    <Building2 className="w-4 h-4" />
                    For Brands & Local Businesses
                  </GoldButton>
                )}
                
                {getFlag('DEMOS_ENABLED') && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <GoldOutlineButton className="flex items-center gap-2 min-h-[44px]">
                        <Play className="w-4 h-4" />
                        See 60-sec Demo
                        <ChevronDown className="w-4 h-4" />
                      </GoldOutlineButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      className="z-50 bg-[#24313d] border-bfo-gold/40 shadow-lg"
                      align="start"
                    >
                      <DropdownMenuItem onClick={handleAthleteDemo} className="text-white hover:bg-bfo-gold/20">
                        <Award className="w-4 h-4 mr-2" />
                        Athlete Demo
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSchoolDemo} className="text-white hover:bg-bfo-gold/20">
                        <Building2 className="w-4 h-4 mr-2" />
                        School Demo
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              
              <Button
                variant="ghost"
                onClick={handleShare}
                className="flex items-center gap-2 min-h-[44px] text-bfo-gold hover:text-[#f4d66e] hover:bg-bfo-gold/10"
              >
                <Share className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
        
        <DemoTipsPopover />
      </div>
    </>
  );
}