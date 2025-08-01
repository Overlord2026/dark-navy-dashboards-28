import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  UserPlus, 
  Mail, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Send, 
  Upload, 
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  FileText,
  Video,
  Download,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ClientInvitation {
  id: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  clientType: 'individual' | 'business' | 'trust' | 'nonprofit';
  businessStructure?: string;
  customMessage?: string;
  status: 'pending' | 'sent' | 'opened' | 'accepted' | 'expired';
  sentAt?: Date;
  openedAt?: Date;
  acceptedAt?: Date;
}

interface OnboardingProgress {
  id: string;
  clientName: string;
  email: string;
  stage: string;
  progressPercentage: number;
  organizerCompleted: boolean;
  documentsUploaded: number;
  documentsRequired: number;
  engagementLetterSigned: boolean;
  estimatedCompletion?: Date;
}

const mockInvitations: ClientInvitation[] = [
  {
    id: '1',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Smith',
    clientType: 'individual',
    status: 'sent',
    sentAt: new Date('2024-01-01'),
    customMessage: 'Looking forward to working with you this tax season!'
  },
  {
    id: '2',
    email: 'contact@techcorp.com',
    companyName: 'TechCorp LLC',
    clientType: 'business',
    businessStructure: 'llc',
    status: 'accepted',
    sentAt: new Date('2024-01-02'),
    acceptedAt: new Date('2024-01-03')
  }
];

const mockOnboardingProgress: OnboardingProgress[] = [
  {
    id: '1',
    clientName: 'John Smith',
    email: 'john@example.com',
    stage: 'documents_pending',
    progressPercentage: 60,
    organizerCompleted: true,
    documentsUploaded: 3,
    documentsRequired: 5,
    engagementLetterSigned: false,
    estimatedCompletion: new Date('2024-02-15')
  },
  {
    id: '2',
    clientName: 'TechCorp LLC',
    email: 'contact@techcorp.com',
    stage: 'review_ready',
    progressPercentage: 85,
    organizerCompleted: true,
    documentsUploaded: 8,
    documentsRequired: 8,
    engagementLetterSigned: true,
    estimatedCompletion: new Date('2024-02-10')
  }
];

export function ClientInviteOnboardingFlow() {
  const [activeTab, setActiveTab] = useState('invite');
  const [invitations, setInvitations] = useState<ClientInvitation[]>(mockInvitations);
  const [onboardingList, setOnboardingList] = useState<OnboardingProgress[]>(mockOnboardingProgress);
  const [bulkInviteList, setBulkInviteList] = useState<Partial<ClientInvitation>[]>([]);
  const [newInvite, setNewInvite] = useState<Partial<ClientInvitation>>({
    clientType: 'individual'
  });
  const [welcomeVideoUrl, setWelcomeVideoUrl] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const addToBulkList = () => {
    if (newInvite.email) {
      setBulkInviteList(prev => [...prev, { ...newInvite }]);
      setNewInvite({ clientType: 'individual' });
    }
  };

  const removeFromBulkList = (index: number) => {
    setBulkInviteList(prev => prev.filter((_, i) => i !== index));
  };

  const sendBulkInvites = async () => {
    if (bulkInviteList.length === 0) return;

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('bulk-invite', {
        body: {
          invitations: bulkInviteList.map(invite => ({
            email: invite.email!,
            phone: invite.phone,
            firstName: invite.firstName,
            lastName: invite.lastName,
            companyName: invite.companyName,
            clientType: invite.clientType!,
            businessStructure: invite.businessStructure,
            customMessage: customMessage || invite.customMessage
          })),
          welcomeVideoUrl,
          cpaPartnerId: 'current-partner-id', // This would come from auth context
          invitedBy: 'current-staff-id' // This would come from auth context
        }
      });

      if (error) throw error;

      toast({
        title: "Invitations sent!",
        description: `Successfully sent ${data.summary.successful} invitations. ${data.summary.failed} failed.`,
      });

      // Clear the bulk list
      setBulkInviteList([]);
      setCustomMessage('');
      setWelcomeVideoUrl('');

    } catch (error: any) {
      toast({
        title: "Error sending invitations",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'invited': return 'bg-gray-500';
      case 'organizer_pending': return 'bg-blue-500';
      case 'documents_pending': return 'bg-yellow-500';
      case 'review_ready': return 'bg-orange-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'invited': return 'Invited';
      case 'organizer_pending': return 'Organizer Pending';
      case 'documents_pending': return 'Documents Pending';
      case 'review_ready': return 'Review Ready';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { color: 'bg-gray-500', text: 'Pending' },
      sent: { color: 'bg-blue-500', text: 'Sent' },
      opened: { color: 'bg-yellow-500', text: 'Opened' },
      accepted: { color: 'bg-green-500', text: 'Accepted' },
      expired: { color: 'bg-red-500', text: 'Expired' }
    };
    
    const variant = variants[status as keyof typeof variants] || variants.pending;
    return (
      <Badge className={`${variant.color} text-white`}>
        {variant.text}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Client Invite & Onboarding Flow
          </h3>
          <p className="text-muted-foreground">
            Streamlined client onboarding with bulk invites, progress tracking, and automated workflows
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="invite">Bulk Invite</TabsTrigger>
          <TabsTrigger value="progress">Onboarding Progress</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Bulk Invite Tab */}
        <TabsContent value="invite" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Client Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Clients to Invite List
                </CardTitle>
                <CardDescription>
                  Add individual clients or import from CSV
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      value={newInvite.firstName || ''}
                      onChange={(e) => setNewInvite(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      value={newInvite.lastName || ''}
                      onChange={(e) => setNewInvite(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newInvite.email || ''}
                    onChange={(e) => setNewInvite(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    value={newInvite.phone || ''}
                    onChange={(e) => setNewInvite(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="client-type">Client Type</Label>
                  <Select
                    value={newInvite.clientType}
                    onValueChange={(value) => setNewInvite(prev => ({ ...prev, clientType: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="trust">Trust</SelectItem>
                      <SelectItem value="nonprofit">Non-Profit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newInvite.clientType === 'business' && (
                  <div>
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={newInvite.companyName || ''}
                      onChange={(e) => setNewInvite(prev => ({ ...prev, companyName: e.target.value }))}
                      placeholder="ABC Corp LLC"
                    />
                  </div>
                )}

                <Button onClick={addToBulkList} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Invite List
                </Button>
              </CardContent>
            </Card>

            {/* Bulk Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Bulk Invite Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="welcome-video">Welcome Video URL (Optional)</Label>
                  <Input
                    id="welcome-video"
                    value={welcomeVideoUrl}
                    onChange={(e) => setWelcomeVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div>
                  <Label htmlFor="custom-message">Custom Message</Label>
                  <Textarea
                    id="custom-message"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Add a personal message for all invitations..."
                    rows={3}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-medium text-blue-800 mb-2">
                    📧 What's Included in Invitations:
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Firm-branded welcome email</li>
                    <li>• Secure portal access link</li>
                    <li>• Video walkthrough (if provided)</li>
                    <li>• Clear next steps outline</li>
                    <li>• 30-day expiration notice</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invite List */}
          {bulkInviteList.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Ready to Send ({bulkInviteList.length} clients)
                  </span>
                  <Button 
                    onClick={sendBulkInvites} 
                    disabled={isSending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSending ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send All Invitations
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bulkInviteList.map((invite, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-medium">
                              {invite.firstName && invite.lastName 
                                ? `${invite.firstName} ${invite.lastName}`
                                : invite.companyName || invite.email
                              }
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {invite.email} • {invite.clientType}
                            </div>
                          </div>
                          <Badge variant="outline">{invite.clientType}</Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromBulkList(index)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Onboarding Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-blue-600">Active Onboarding</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {onboardingList.filter(o => o.progressPercentage < 100).length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-yellow-600">Awaiting Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {onboardingList.filter(o => o.stage === 'documents_pending').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-600">Ready for Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {onboardingList.filter(o => o.stage === 'review_ready').length}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {onboardingList.map((onboarding) => (
              <Card key={onboarding.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-lg">{onboarding.clientName}</h4>
                      <p className="text-muted-foreground">{onboarding.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`${getStageColor(onboarding.stage)} text-white`}>
                        {getStageLabel(onboarding.stage)}
                      </Badge>
                      <span className="text-sm font-medium">
                        {onboarding.progressPercentage}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Progress</span>
                        <span>{onboarding.progressPercentage}%</span>
                      </div>
                      <Progress value={onboarding.progressPercentage} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          onboarding.organizerCompleted ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <span>Organizer</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          onboarding.documentsUploaded >= onboarding.documentsRequired ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                        <span>Documents ({onboarding.documentsUploaded}/{onboarding.documentsRequired})</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          onboarding.engagementLetterSigned ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <span>E-Signature</span>
                      </div>
                    </div>

                    {onboarding.estimatedCompletion && (
                      <div className="text-sm text-muted-foreground">
                        Estimated completion: {onboarding.estimatedCompletion.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Email Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Welcome Email Templates
              </CardTitle>
              <CardDescription>
                Customize welcome emails for different client types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email Template Manager</h3>
                <p className="text-muted-foreground mb-4">
                  Create and manage personalized welcome email templates for each client type
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Invitations Sent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <div className="text-xs text-muted-foreground">+23% from last month</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Acceptance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89%</div>
                <div className="text-xs text-muted-foreground">+5% from last month</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Avg. Onboarding Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2 days</div>
                <div className="text-xs text-muted-foreground">-0.8 days improvement</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <div className="text-xs text-muted-foreground">+2% from last month</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Onboarding Funnel</CardTitle>
              <CardDescription>
                Track where clients are in the onboarding process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { stage: 'Invited', count: 45, percentage: 100 },
                  { stage: 'Email Opened', count: 42, percentage: 93 },
                  { stage: 'Portal Accessed', count: 40, percentage: 89 },
                  { stage: 'Organizer Started', count: 38, percentage: 84 },
                  { stage: 'Documents Uploaded', count: 35, percentage: 78 },
                  { stage: 'Engagement Signed', count: 33, percentage: 73 },
                  { stage: 'Completed', count: 32, percentage: 71 }
                ].map((stage, index) => (
                  <div key={stage.stage} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 text-sm font-medium">{index + 1}.</div>
                      <div>
                        <div className="font-medium">{stage.stage}</div>
                        <div className="text-sm text-muted-foreground">
                          {stage.count} clients ({stage.percentage}%)
                        </div>
                      </div>
                    </div>
                    <div className="w-32">
                      <Progress value={stage.percentage} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}