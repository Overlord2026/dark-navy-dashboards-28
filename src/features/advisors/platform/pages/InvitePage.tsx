import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { 
  Mail, 
  CreditCard, 
  User, 
  ArrowLeft,
  Send,
  Check,
  DollarSign
} from 'lucide-react';
import { sendAdvisorInvite, getAdvisorInvitations, type AdvisorInviteRequest } from '../state/invite.mock';

export default function InvitePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AdvisorInviteRequest>({
    email: '',
    firstName: '',
    lastName: '',
    paymentResponsibility: 'client_paid',
    personalNote: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast.error('Please enter an email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await sendAdvisorInvite(formData);
      
      if (result.success) {
        toast.success(result.message);
        // Reset form
        setFormData({
          email: '',
          firstName: '',
          lastName: '',
          paymentResponsibility: 'client_paid',
          personalNote: ''
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to send invitation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof AdvisorInviteRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      <Helmet>
        <title>Invite Clients | Advisor Platform</title>
        <meta name="description" content="Invite clients to your family office platform with flexible payment options" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/pros/advisors/platform')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Invite Clients</h1>
            <p className="text-muted-foreground text-lg">
              Send magic link invitations to prospective clients
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Invite Form */}
          <div className="lg:col-span-2">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Client Invitation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Smith"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  {/* Payment Responsibility */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Who pays for this client's subscription?</Label>
                    <RadioGroup
                      value={formData.paymentResponsibility}
                      onValueChange={(value: 'advisor_paid' | 'client_paid') => 
                        handleInputChange('paymentResponsibility', value)
                      }
                    >
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border">
                        <RadioGroupItem value="client_paid" id="client_paid" />
                        <div className="flex-1">
                          <Label htmlFor="client_paid" className="font-medium cursor-pointer">
                            Client pays directly
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Client will be prompted to set up their own subscription
                          </p>
                        </div>
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                      
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border">
                        <RadioGroupItem value="advisor_paid" id="advisor_paid" />
                        <div className="flex-1">
                          <Label htmlFor="advisor_paid" className="font-medium cursor-pointer">
                            I'll pay for this client
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Client seat will be added to your advisor subscription
                          </p>
                        </div>
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Personal Note */}
                  <div>
                    <Label htmlFor="personalNote">Personal Message (Optional)</Label>
                    <Textarea
                      id="personalNote"
                      placeholder="Add a personal note to your invitation..."
                      value={formData.personalNote}
                      onChange={(e) => handleInputChange('personalNote', e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Sending Invitation...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Invitation
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent Invitations Management */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Recent Invitations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">john@example.com</p>
                        <p className="text-sm text-muted-foreground">Sent 2 days ago • Pending</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/invite/abc123`);
                            toast.success('Invite link copied to clipboard');
                          }}
                        >
                          Copy Link
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toast.success('Invitation re-sent')}
                        >
                          Re-send
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => toast.success('Invitation revoked')}
                        >
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">jane@example.com</p>
                        <p className="text-sm text-muted-foreground">Sent 1 week ago • Accepted</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* How it Works */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">How it Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-semibold text-primary">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium">Magic Link Sent</p>
                    <p className="text-xs text-muted-foreground">
                      Client receives secure invitation email
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-semibold text-primary">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium">One-Click Access</p>
                    <p className="text-xs text-muted-foreground">
                      No password required - instant secure access
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-semibold text-primary">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium">Seamless Onboarding</p>
                    <p className="text-xs text-muted-foreground">
                      Client completes profile and starts using platform
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Billing Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="text-sm font-medium">Client Paid</p>
                  <p className="text-xs text-muted-foreground">
                    $29-299/month per client
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium">Advisor Paid</p>
                  <p className="text-xs text-muted-foreground">
                    $19/month per client seat
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}