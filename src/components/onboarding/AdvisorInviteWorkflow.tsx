import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { Mail, Link, Copy, User, Settings, Building } from 'lucide-react';

interface InviteFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  message: string;
  onboardingTemplate: string;
  feeStructure: string;
  premiumModules: string[];
}

const ONBOARDING_TEMPLATES = [
  { id: 'standard', name: 'Standard Client Onboarding', description: 'Basic intake and documentation' },
  { id: 'high_net_worth', name: 'High Net Worth Client', description: 'Enhanced due diligence and complex planning' },
  { id: 'business_owner', name: 'Business Owner', description: 'Business valuations and succession planning' },
  { id: 'pre_retiree', name: 'Pre-Retiree', description: 'Retirement income and tax planning focus' }
];

const PREMIUM_MODULES = [
  { id: 'estate_planning', name: 'Estate Planning Tools' },
  { id: 'tax_optimization', name: 'Tax Optimization' },
  { id: 'business_valuation', name: 'Business Valuation' },
  { id: 'family_office', name: 'Family Office Services' },
  { id: 'concierge', name: 'Concierge Services' }
];

export function AdvisorInviteWorkflow() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<InviteFormData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    message: '',
    onboardingTemplate: 'standard',
    feeStructure: 'aum_based',
    premiumModules: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  
  const { toast } = useToast();
  const { userProfile } = useUser();

  const handleInputChange = (field: keyof InviteFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleModuleToggle = (moduleId: string) => {
    setFormData(prev => ({
      ...prev,
      premiumModules: prev.premiumModules.includes(moduleId)
        ? prev.premiumModules.filter(id => id !== moduleId)
        : [...prev.premiumModules, moduleId]
    }));
  };

  const generateInviteLink = async () => {
    setIsSubmitting(true);
    try {
      // Generate unique invite token
      const inviteToken = crypto.randomUUID();
      const link = `${window.location.origin}/onboard/${inviteToken}`;
      
      const { data, error } = await supabase
        .from('client_invitations')
        .insert({
          advisor_id: userProfile?.id,
          tenant_id: userProfile?.tenant_id || userProfile?.id, // Fallback to user ID if no tenant
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          custom_message: formData.message,
          onboarding_template: formData.onboardingTemplate,
          fee_structure: formData.feeStructure,
          premium_modules: formData.premiumModules,
          invite_link: link,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        })
        .select()
        .single();

      if (error) throw error;

      setInviteLink(link);
      setStep(4);

      toast({
        title: "Invitation Created",
        description: "Client invitation has been generated successfully.",
      });
    } catch (error) {
      console.error('Error creating invitation:', error);
      toast({
        title: "Error",
        description: "Failed to create invitation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Link Copied",
      description: "Invitation link copied to clipboard.",
    });
  };

  const sendInviteEmail = async () => {
    try {
      const { error } = await supabase.functions.invoke('send-client-invitation', {
        body: {
          inviteLink,
          clientName: `${formData.firstName} ${formData.lastName}`,
          clientEmail: formData.email,
          advisorName: userProfile?.displayName || userProfile?.name,
          customMessage: formData.message
        }
      });

      if (error) throw error;

      toast({
        title: "Invitation Sent",
        description: `Invitation email sent to ${formData.email}`,
      });
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Error",
        description: "Failed to send invitation email.",
        variant: "destructive"
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="client@example.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div>
                <Label htmlFor="message">Personal Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Add a personal welcome message for your client..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Onboarding Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="template">Onboarding Template</Label>
                <Select
                  value={formData.onboardingTemplate}
                  onValueChange={(value) => handleInputChange('onboardingTemplate', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ONBOARDING_TEMPLATES.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-muted-foreground">{template.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="feeStructure">Fee Structure</Label>
                <Select
                  value={formData.feeStructure}
                  onValueChange={(value) => handleInputChange('feeStructure', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aum_based">Assets Under Management (AUM) Based</SelectItem>
                    <SelectItem value="hourly">Hourly Consulting</SelectItem>
                    <SelectItem value="project_based">Project-Based</SelectItem>
                    <SelectItem value="retainer">Monthly Retainer</SelectItem>
                    <SelectItem value="custom">Custom Arrangement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Premium Modules & Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {PREMIUM_MODULES.map(module => (
                  <div
                    key={module.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.premiumModules.includes(module.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-muted'
                    }`}
                    onClick={() => handleModuleToggle(module.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{module.name}</span>
                      {formData.premiumModules.includes(module.id) && (
                        <Badge variant="secondary">Selected</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Invitation Ready
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono break-all pr-2">{inviteLink}</code>
                  <Button onClick={copyInviteLink} size="sm" variant="outline">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={sendInviteEmail} className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email Invitation
                </Button>
                <Button onClick={copyInviteLink} variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>

              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>Client:</strong> {formData.firstName} {formData.lastName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Template:</strong> {ONBOARDING_TEMPLATES.find(t => t.id === formData.onboardingTemplate)?.name}</p>
                <p><strong>Modules:</strong> {formData.premiumModules.length} selected</p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email;
      case 2:
        return formData.onboardingTemplate && formData.feeStructure;
      case 3:
        return true; // Premium modules are optional
      default:
        return true;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Invite New Client</h1>
        <p className="text-muted-foreground">
          Create a personalized onboarding experience for your new client
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span>Step {step} of 4</span>
          <span>{Math.round((step / 4) * 100)}% Complete</span>
        </div>
        <Progress value={(step / 4) * 100} />
      </div>

      {renderStep()}

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
        >
          Previous
        </Button>
        
        {step < 4 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!isStepValid()}
          >
            {step === 3 ? 'Create Invitation' : 'Next'}
          </Button>
        ) : (
          <Button onClick={() => window.location.href = '/advisor-dashboard'}>
            Back to Dashboard
          </Button>
        )}
      </div>

      {step === 3 && (
        <div className="text-center">
          <Button
            onClick={generateInviteLink}
            disabled={isSubmitting}
            size="lg"
            className="w-full"
          >
            {isSubmitting ? 'Creating Invitation...' : 'Generate Invitation Link'}
          </Button>
        </div>
      )}
    </div>
  );
}