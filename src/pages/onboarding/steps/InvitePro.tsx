import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserPlus, CheckCircle2, Star } from 'lucide-react';
import { analytics } from '@/lib/analytics';

interface InviteProData {
  invitedProfessionals: Array<{
    email: string;
    role: string;
    message?: string;
  }>;
  skipReason?: string;
}

interface InviteProProps {
  onComplete: (data: InviteProData) => void;
  persona: string;
  segment: string;
  initialData?: Partial<InviteProData>;
}

const professionalTypes = {
  retirees: [
    { value: 'financial_advisor', label: 'Retirement Specialist', description: 'RMD and income planning expertise' },
    { value: 'tax_professional', label: 'Tax Advisor', description: 'Retirement tax optimization' },
    { value: 'estate_attorney', label: 'Estate Attorney', description: 'Legacy and estate planning' }
  ],
  aspiring: [
    { value: 'financial_advisor', label: 'Financial Planner', description: 'Goal-based financial planning' },
    { value: 'insurance_agent', label: 'Insurance Agent', description: 'Protection and risk management' },
    { value: 'accountant', label: 'CPA', description: 'Tax planning and preparation' }
  ],
  hnw: [
    { value: 'wealth_manager', label: 'Wealth Manager', description: 'Private wealth management' },
    { value: 'tax_strategist', label: 'Tax Strategist', description: 'Advanced tax planning' },
    { value: 'estate_attorney', label: 'Estate Attorney', description: 'Complex estate structures' }
  ],
  uhnw: [
    { value: 'family_office', label: 'Family Office Advisor', description: 'Ultra-HNW family services' },
    { value: 'trust_officer', label: 'Trust Officer', description: 'Trust and fiduciary services' },
    { value: 'investment_banker', label: 'Investment Banker', description: 'Capital markets and M&A' }
  ]
};

export const InvitePro: React.FC<InviteProProps> = ({
  onComplete,
  persona,
  segment,
  initialData
}) => {
  const [invites, setInvites] = useState<Array<{
    id: string;
    email: string;
    role: string;
    message: string;
  }>>(
    initialData?.invitedProfessionals?.map((inv, index) => ({
      id: index.toString(),
      email: inv.email,
      role: inv.role,
      message: inv.message || ''
    })) || []
  );

  const [currentInvite, setCurrentInvite] = useState({
    email: '',
    role: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const professionals = professionalTypes[segment as keyof typeof professionalTypes] || professionalTypes.aspiring;

  const addInvite = () => {
    if (!currentInvite.email || !currentInvite.role) return;

    const newInvite = {
      id: Date.now().toString(),
      ...currentInvite
    };

    setInvites(prev => [...prev, newInvite]);
    setCurrentInvite({ email: '', role: '', message: '' });
  };

  const removeInvite = (id: string) => {
    setInvites(prev => prev.filter(inv => inv.id !== id));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Simulate sending invites
      await new Promise(resolve => setTimeout(resolve, 2000));

      const data: InviteProData = {
        invitedProfessionals: invites.map(inv => ({
          email: inv.email,
          role: inv.role,
          message: inv.message
        }))
      };

      analytics.trackEvent('onboarding.step_completed', {
        step: 'invite_pro',
        persona,
        segment,
        professionals_invited: invites.length,
        professional_types: [...new Set(invites.map(inv => inv.role))]
      });

      analytics.trackEvent('onboarding.completed', {
        persona,
        segment,
        completion_timestamp: Date.now()
      });

      onComplete(data);

    } catch (error) {
      console.error('Failed to send invites:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    analytics.trackEvent('onboarding.step_completed', {
      step: 'invite_pro',
      persona,
      segment,
      skipped: true
    });

    analytics.trackEvent('onboarding.completed', {
      persona,
      segment,
      completion_timestamp: Date.now(),
      skipped_professional_invites: true
    });

    onComplete({
      invitedProfessionals: [],
      skipReason: 'user_choice'
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Invite Professionals</CardTitle>
        <CardDescription>
          Connect with qualified professionals who specialize in {segment} family needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Recommended Professional Types */}
        <div className="space-y-3">
          <h3 className="font-medium">Recommended for {segment} Families</h3>
          <div className="grid gap-3">
            {professionals.map((pro) => (
              <Card key={pro.value} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{pro.label}</p>
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {pro.description}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentInvite(prev => ({ ...prev, role: pro.value }))}
                    disabled={currentInvite.role === pro.value}
                  >
                    {currentInvite.role === pro.value ? 'Selected' : 'Select'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Add Professional Form */}
        <Card className="p-4">
          <h3 className="font-medium mb-4">Invite a Professional</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={currentInvite.email}
                  onChange={(e) => setCurrentInvite(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="professional@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Professional Type</Label>
                <Select 
                  value={currentInvite.role} 
                  onValueChange={(value) => setCurrentInvite(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionals.map((pro) => (
                      <SelectItem key={pro.value} value={pro.value}>
                        {pro.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Personal Message (Optional)</Label>
              <Input
                id="message"
                value={currentInvite.message}
                onChange={(e) => setCurrentInvite(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Add a personal note to your invitation"
              />
            </div>
            
            <Button 
              onClick={addInvite}
              disabled={!currentInvite.email || !currentInvite.role}
              className="w-full"
            >
              Add Professional
            </Button>
          </div>
        </Card>

        {/* Invited Professionals */}
        {invites.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Professionals to Invite ({invites.length})
            </h3>
            <div className="space-y-2">
              {invites.map((invite) => (
                <Card key={invite.id} className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{invite.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {professionals.find(p => p.value === invite.role)?.label || invite.role}
                        </Badge>
                        {invite.message && (
                          <span className="text-xs text-muted-foreground">
                            • Personal message included
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInvite(invite.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Sending Invites...' : 
             invites.length > 0 ? `Send ${invites.length} Invite${invites.length > 1 ? 's' : ''}` : 'Complete Setup'}
          </Button>
          <Button variant="outline" onClick={handleSkip}>
            Skip for Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};