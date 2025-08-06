import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Send, Users, Mail, MessageSquare, Linkedin, Smartphone, Crown, CheckCircle, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ClientRecord {
  name: string;
  email: string;
  phone?: string;
  investmentAmount?: number;
  riskTolerance?: string;
  notes?: string;
}

interface MessageTemplate {
  id: string;
  type: 'email' | 'linkedin' | 'sms';
  subject?: string;
  content: string;
  personalization: string[];
}

const messageTemplates: MessageTemplate[] = [
  {
    id: 'advisor-email',
    type: 'email',
    subject: "You're Invited: Founding Access to the Boutique Family Office Platform™",
    content: `Hi [Name],

As a leader in the advisor community, you've been selected as a Founding Member of the new Boutique Family Office™ platform—a premium ecosystem for high-net-worth families and top professionals.

What's in it for you:
• VIP status: Founding Member badge and early adopter perks
• Invite your book of business: Seamlessly onboard clients—your brand, your experience
• Unlock rewards: Credits for every client/referral, exclusive dashboard access
• Marketplace access: Network with elite family offices, attorneys, CPAs, and more
• Practice management tools: Automate onboarding, compliance, and client reporting

Ready to elevate your practice?
[Activate Your Founders Account Now] ([magic-link])

We're reserving your spot for the next 7 days—don't miss this founding opportunity!

Best,
Tony Gomes
Co-Founder, Boutique Family Office™`,
    personalization: ['[Name]', '[Company]', '[magic-link]']
  },
  {
    id: 'advisor-linkedin',
    type: 'linkedin',
    content: `Hi [Name],
We're launching the Boutique Family Office™ platform—an invite-only network for elite advisors and their clients.
You're on our VIP list of founding members.
Would love to send you early access—okay to share your best email/mobile for your personalized invite?`,
    personalization: ['[Name]']
  },
  {
    id: 'advisor-sms',
    type: 'sms',
    content: `Hi [Name],
It's Tony Gomes—your VIP invitation to Boutique Family Office™ is ready. Founders get exclusive perks and first access. Tap to activate: [magic-link]`,
    personalization: ['[Name]', '[magic-link]']
  }
];

export const AdvisorVIPLaunchKit: React.FC = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate>(messageTemplates[0]);
  const [customMessage, setCustomMessage] = useState('');
  const [clientRecords, setClientRecords] = useState<ClientRecord[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvData = e.target?.result as string;
        const lines = csvData.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const parsedRecords: ClientRecord[] = lines.slice(1).map((line, index) => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          const record: any = {};
          
          headers.forEach((header, i) => {
            record[header] = values[i] || '';
          });

          return {
            name: record.name || record['full name'] || `Client ${index + 1}`,
            email: record.email || record['email address'] || '',
            phone: record.phone || record.mobile || '',
            investmentAmount: parseInt(record['investment amount'] || record.aum || '0') || 0,
            riskTolerance: record['risk tolerance'] || record.risk || 'moderate',
            notes: record.notes || record.comments || ''
          };
        });

        setClientRecords(parsedRecords);
        toast({
          title: 'File Uploaded',
          description: `Successfully imported ${parsedRecords.length} client records`,
        });
      } catch (error) {
        toast({
          title: 'Upload Error',
          description: 'Failed to parse CSV file. Please check the format.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  };

  const sendBulkInvitations = async () => {
    if (clientRecords.length === 0) {
      toast({
        title: 'No Clients',
        description: 'Please upload client records before sending invitations',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    let successful = 0;
    let failed = 0;

    for (const client of clientRecords) {
      try {
        // Create client invitation record
        const { error } = await supabase
          .from('advisor_client_links')
          .insert({
            advisor_id: 'current-advisor-id', // This would come from auth context
            client_user_id: null, // Will be filled when client signs up
            status: 'invited',
            notes: `Invited via VIP launch kit - ${client.notes || ''}`
          });

        if (error) throw error;
        successful++;
      } catch (error) {
        failed++;
        console.error(`Failed to invite ${client.name}:`, error);
      }
    }

    setIsProcessing(false);
    toast({
      title: 'Invitations Sent',
      description: `${successful} invitations sent successfully, ${failed} failed`,
      variant: failed > 0 ? 'destructive' : 'default',
    });
  };

  const copyTemplate = (template: MessageTemplate) => {
    const content = template.type === 'email' 
      ? `Subject: ${template.subject}\n\n${template.content}`
      : template.content;
    
    navigator.clipboard.writeText(content);
    toast({
      title: 'Template Copied',
      description: 'Message template copied to clipboard',
    });
  };

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      case 'sms': return <Smartphone className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTemplateColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-800';
      case 'linkedin': return 'bg-purple-100 text-purple-800';
      case 'sms': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Crown className="h-8 w-8 text-gold" />
        <div>
          <h1 className="text-3xl font-bold">Advisor VIP Launch Kit</h1>
          <p className="text-muted-foreground">
            Templates, tools, and training for advisor VIP onboarding
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Message Templates
          </TabsTrigger>
          <TabsTrigger value="bulk-invite" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Bulk Client Import
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Training Materials
          </TabsTrigger>
          <TabsTrigger value="checklist" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Admin Checklist
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Invitation Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {messageTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTemplate.id === template.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getTemplateIcon(template.type)}
                          <div>
                            <h4 className="font-medium capitalize">{template.type} Invitation</h4>
                            {template.subject && (
                              <p className="text-xs text-muted-foreground">
                                {template.subject.substring(0, 50)}...
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge className={getTemplateColor(template.type)}>
                          {template.type.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <Label htmlFor="customMessage">Custom Message Addition</Label>
                  <Textarea
                    id="customMessage"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Add a personal touch to your invitations..."
                    rows={3}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Template Preview</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyTemplate(selectedTemplate)}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedTemplate.subject && (
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">
                        Subject:
                      </Label>
                      <div className="font-medium">{selectedTemplate.subject}</div>
                    </div>
                  )}
                  
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">
                      Message:
                    </Label>
                    <div className="mt-2 p-4 bg-muted/50 rounded-lg whitespace-pre-wrap text-sm">
                      {selectedTemplate.content}
                    </div>
                  </div>

                  {customMessage && (
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">
                        Your Custom Addition:
                      </Label>
                      <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                        {customMessage}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">
                      Personalization Fields:
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTemplate.personalization.map((field) => (
                        <Badge key={field} variant="outline" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bulk-invite">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Client CSV Upload</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="csvFile">Upload Client List (CSV)</Label>
                  <Input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Expected columns: name, email, phone, investment_amount, risk_tolerance, notes
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Choose File
                  </Button>
                </div>

                {clientRecords.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">
                        Loaded Clients ({clientRecords.length})
                      </h4>
                      <Button
                        onClick={sendBulkInvitations}
                        disabled={isProcessing}
                        className="flex items-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Send Invitations
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {clientRecords.slice(0, 5).map((client, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded text-sm">
                          <span className="font-medium">{client.name}</span>
                          <span className="text-muted-foreground">{client.email}</span>
                        </div>
                      ))}
                      {clientRecords.length > 5 && (
                        <div className="text-center text-xs text-muted-foreground">
                          +{clientRecords.length - 5} more clients
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invitation Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="messageType">Message Type</Label>
                  <Select value={selectedTemplate.type} onValueChange={(value) => {
                    const template = messageTemplates.find(t => t.type === value);
                    if (template) setSelectedTemplate(template);
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email Invitation</SelectItem>
                      <SelectItem value="sms">SMS Invitation</SelectItem>
                      <SelectItem value="linkedin">LinkedIn Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sendDelay">Send Delay (hours)</Label>
                  <Select defaultValue="0">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Send Immediately</SelectItem>
                      <SelectItem value="1">1 Hour Delay</SelectItem>
                      <SelectItem value="24">24 Hour Delay</SelectItem>
                      <SelectItem value="168">1 Week Delay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Pro Tips:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Start with your top 10-20 clients for testing</li>
                    <li>• Personalize messages with client-specific details</li>
                    <li>• Follow up via phone for high-value relationships</li>
                    <li>• Track responses and adjust approach accordingly</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="training">
          <div className="text-center py-12">
            <Crown className="h-16 w-16 mx-auto text-gold mb-4" />
            <h2 className="text-2xl font-bold mb-2">Advisor Training Materials</h2>
            <p className="text-muted-foreground mb-6">
              Comprehensive training resources for VIP advisor onboarding
            </p>
            <div className="flex justify-center gap-4">
              <Button className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Download Training Manual
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Access Video Library
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="checklist">
          <Card>
            <CardHeader>
              <CardTitle>Admin VIP Launch Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  'Add advisors to "Founders Wall"',
                  'Assign VIP badge and magic link',
                  'Send all invitations (email/SMS/LinkedIn)',
                  'Monitor onboarding progress',
                  'Provide white-glove support for VIPs',
                  'Collect testimonials and feedback',
                  'Track referral credits and rewards',
                  'Schedule follow-up check-ins',
                  'Update leaderboard rankings',
                  'Document success stories'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="flex-1">{item}</span>
                    <div className="w-4 h-4 border rounded border-muted-foreground/30"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};