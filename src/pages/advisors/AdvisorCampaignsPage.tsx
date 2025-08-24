import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Megaphone, 
  Send, 
  Eye, 
  MousePointer,
  Users,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { emitReceipt } from '@/lib/analytics';

interface Template {
  id: string;
  name: string;
  persona: 'retiree' | 'aspiring' | 'general';
  subject: string;
  content: string;
  isAllowlisted: boolean;
  throttleLimit: number;
}

interface Campaign {
  id: string;
  templateName: string;
  recipients: number;
  sent: number;
  opened: number;
  clicked: number;
  status: 'draft' | 'sending' | 'completed' | 'paused';
  createdAt: string;
}

export function AdvisorCampaignsPage() {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [isSendOpen, setIsSendOpen] = useState(false);

  const templates: Template[] = [
    {
      id: 'retiree3',
      name: 'Retiree Roadmap - 3 Key Steps',
      persona: 'retiree',
      subject: 'Your Retirement Roadmap: 3 Critical Steps',
      content: `Dear [Name],

As someone approaching or in retirement, you face unique financial challenges that require specialized strategies.

Here are 3 critical steps every retiree should consider:

1. **Social Security Optimization** - Timing your claim can increase lifetime benefits by $100K+
2. **Tax-Efficient Withdrawals** - Proper sequencing can save thousands annually  
3. **Healthcare Cost Planning** - Medicare planning and long-term care considerations

Would you like a complimentary consultation to review your specific situation?

Best regards,
[Advisor Name]

---
DISCLAIMER: This communication is for educational purposes only and does not constitute investment advice. Past performance does not guarantee future results.`,
      isAllowlisted: true,
      throttleLimit: 50
    },
    {
      id: 'roth4',
      name: 'Roth Conversion Strategy',
      persona: 'aspiring',
      subject: 'Roth IRA Conversion: Tax-Free Retirement Income',
      content: `Hi [Name],

Are you paying more taxes in retirement than necessary?

A Roth IRA conversion strategy might help you:

✓ Create tax-free income in retirement
✓ Reduce future Required Minimum Distributions  
✓ Leave tax-free assets to heirs
✓ Potentially lower Medicare premiums

The key is timing and tax bracket management.

Let's discuss if this strategy makes sense for your situation.

Best,
[Advisor Name]

---
DISCLAIMER: Tax strategies should be reviewed with your tax professional. Roth conversions are taxable in the year of conversion.`,
      isAllowlisted: true,
      throttleLimit: 30
    },
    {
      id: 'ss_timing',
      name: 'Social Security Timing',
      persona: 'retiree',
      subject: 'Social Security: When to Claim for Maximum Benefits',
      content: `Hello [Name],

One of the most important retirement decisions you'll make is WHEN to claim Social Security.

Did you know:
• Claiming at 62 reduces benefits by 25-30%
• Waiting until 70 increases benefits by 24-32%
• Married couples have additional claiming strategies

For a couple with $100K in projected benefits, optimal timing could mean an extra $200K+ over their lifetimes.

Would you like to explore your Social Security optimization options?

Sincerely,
[Advisor Name]

---
DISCLAIMER: Social Security benefits are subject to change. This analysis is for educational purposes only.`,
      isAllowlisted: true,
      throttleLimit: 40
    }
  ];

  const [campaigns] = useState<Campaign[]>([
    {
      id: '1',
      templateName: 'Retiree Roadmap - 3 Key Steps',
      recipients: 150,
      sent: 150,
      opened: 67,
      clicked: 12,
      status: 'completed',
      createdAt: '2024-01-14'
    },
    {
      id: '2',
      templateName: 'Roth Conversion Strategy',
      recipients: 89,
      sent: 89,
      opened: 34,
      clicked: 8,
      status: 'completed',
      createdAt: '2024-01-12'
    },
    {
      id: '3',
      templateName: 'Social Security Timing',
      recipients: 200,
      sent: 45,
      opened: 0,
      clicked: 0,
      status: 'sending',
      createdAt: '2024-01-15'
    }
  ]);

  const handleSendCampaign = async () => {
    if (!selectedTemplate) {
      toast({
        title: "No Template Selected",
        description: "Please select a template to send",
        variant: "destructive"
      });
      return;
    }

    if (!selectedTemplate.isAllowlisted) {
      toast({
        title: "Template Not Approved",
        description: "This template is not allowlisted for sending",
        variant: "destructive"
      });
      return;
    }

    try {
      // Emit Comms-RDS receipt for each send
      await emitReceipt('Comms-RDS', {
        action: 'campaign.email.sent',
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        recipientCount: 25, // Demo count
        persona: selectedTemplate.persona,
        throttleLimit: selectedTemplate.throttleLimit
      });

      toast({
        title: "Campaign Started",
        description: `${selectedTemplate.name} campaign has been launched`
      });

      setIsSendOpen(false);
      setSelectedTemplate(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send campaign",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'draft': return 'default';
      case 'sending': return 'default';
      case 'completed': return 'secondary';
      case 'paused': return 'destructive';
      default: return 'default';
    }
  };

  const getPersonaColor = (persona: Template['persona']) => {
    switch (persona) {
      case 'retiree': return 'default';
      case 'aspiring': return 'secondary';
      case 'general': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaign Management</h1>
          <p className="text-muted-foreground">Send compliant email campaigns with engagement tracking</p>
        </div>
        <Dialog open={isSendOpen} onOpenChange={setIsSendOpen}>
          <DialogTrigger asChild>
            <Button>
              <Send className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Launch Email Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Select Template</Label>
                <Select onValueChange={(value) => {
                  const template = templates.find(t => t.id === value);
                  setSelectedTemplate(template || null);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an allowlisted template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.filter(t => t.isAllowlisted).map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} ({template.persona})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedTemplate && (
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getPersonaColor(selectedTemplate.persona)}>
                        {selectedTemplate.persona}
                      </Badge>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Allowlisted ✓
                      </Badge>
                    </div>
                    <h4 className="font-medium">{selectedTemplate.subject}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Throttle Limit: {selectedTemplate.throttleLimit} emails/day
                    </p>
                  </div>
                  
                  <div>
                    <Label>Preview Content</Label>
                    <Textarea
                      value={selectedTemplate.content}
                      readOnly
                      rows={8}
                      className="text-sm"
                    />
                  </div>
                  
                  <div>
                    <Label>Custom Addition (Optional)</Label>
                    <Textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Add a personalized message to append..."
                      rows={3}
                    />
                  </div>
                </div>
              )}
              
              <Button onClick={handleSendCampaign} className="w-full" disabled={!selectedTemplate}>
                Launch Campaign
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Template Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5" />
            Template Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={getPersonaColor(template.persona)}>
                    {template.persona}
                  </Badge>
                  {template.isAllowlisted && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approved
                    </Badge>
                  )}
                </div>
                <h3 className="font-medium mb-1">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{template.subject}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Limit: {template.throttleLimit}/day</span>
                  <Button variant="outline" size="sm">
                    Preview
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1">
                    <h3 className="font-medium">{campaign.templateName}</h3>
                    <p className="text-sm text-muted-foreground">Launched {campaign.createdAt}</p>
                  </div>
                  <Badge variant={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>Recipients</span>
                    </div>
                    <div className="font-medium">{campaign.recipients}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Send className="w-3 h-3" />
                      <span>Sent</span>
                    </div>
                    <div className="font-medium">{campaign.sent}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="w-3 h-3" />
                      <span>Opened</span>
                    </div>
                    <div className="font-medium">{campaign.opened} ({((campaign.opened / campaign.sent) * 100).toFixed(1)}%)</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MousePointer className="w-3 h-3" />
                      <span>Clicked</span>
                    </div>
                    <div className="font-medium">{campaign.clicked} ({((campaign.clicked / campaign.sent) * 100).toFixed(1)}%)</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}