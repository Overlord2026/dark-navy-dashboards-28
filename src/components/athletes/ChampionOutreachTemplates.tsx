import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Send, Eye, Star, Mail, MessageSquare, Video } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  type: 'email' | 'linkedin' | 'sms' | 'video_script';
  subject?: string;
  content: string;
  variables: string[];
  useCase: string;
  successRate?: string;
}

const outreachTemplates: Template[] = [
  {
    id: '1',
    name: 'VIP Founders Invitation',
    type: 'email',
    subject: 'Join Our Hall of Champions: Help Shape the Next Generation of Athletes',
    content: `Hi {{championName}},

I'm {{senderName}}, founder of the Boutique Family Office Athlete & Entertainer Wealth & Wellbeing Center. As someone who has inspired millions both on and off the field, your voice carries the power to change lives.

We're inviting you as a Founding Champion to leave a legacy tip or video for young athletes who are starting their journey. Just a minute of your wisdom could help protect a career—or a future.

How you can help:
• Record a quick message or tip for our athletes (video or written—your choice)
• Optionally join a Q&A or virtual roundtable for even bigger impact
• For every Hall of Champions message received, we'll donate to {{charityName}} in your honor

Your insights could shape a new era of responsible, empowered athletes. We'll showcase your message (with your permission) on our Hall of Champions wall—setting the gold standard for those who follow in your footsteps.

Let us know if you'd like to participate, and we'll make it seamless (concierge service, upload link, and full editing help included).

With deep respect,
{{senderName}}
{{senderTitle}}
Boutique Family Office`,
    variables: ['championName', 'senderName', 'charityName', 'senderTitle'],
    useCase: 'Initial outreach to legendary athletes',
    successRate: '32%'
  },
  {
    id: '2',
    name: 'LinkedIn Direct Message',
    type: 'linkedin',
    content: `Hi {{championName}},

I'm launching a mission-driven Athlete Wealth & Wellbeing platform to help educate and empower athletes at every stage. Would you be open to sharing a 1-minute wisdom tip or video for our Hall of Champions? 

We'll handle all logistics and make a donation to {{charityChoice}} in your honor. Let's inspire the next generation together!

Best regards,
{{senderName}}`,
    variables: ['championName', 'charityChoice', 'senderName'],
    useCase: 'Social media outreach',
    successRate: '28%'
  },
  {
    id: '3',
    name: 'Follow-up Reminder',
    type: 'email',
    subject: 'Quick follow-up: Hall of Champions invitation',
    content: `Hi {{championName}},

I wanted to follow up on my previous message about contributing to our Athlete Wealth & Wellbeing Center's Hall of Champions.

I know you're incredibly busy, but your message could truly change the trajectory for young athletes entering professional sports. Even a 30-second video sharing your #1 piece of advice would make an enormous impact.

We've already had {{currentChampions}} legends contribute, including {{exampleChampions}}.

Would you be interested in participating? I can have our team reach out to make the process effortless.

Thank you for considering,
{{senderName}}`,
    variables: ['championName', 'currentChampions', 'exampleChampions', 'senderName'],
    useCase: 'Follow-up after 1 week of no response',
    successRate: '18%'
  },
  {
    id: '4',
    name: 'Agent/Representative Outreach',
    type: 'email',
    subject: 'Partnership Opportunity: Hall of Champions for {{championName}}',
    content: `Hello,

I'm reaching out regarding an opportunity for {{championName}} to be featured in our prestigious Hall of Champions at the Boutique Family Office Athlete & Entertainer Wealth & Wellbeing Center.

This initiative features legendary athletes sharing wisdom with the next generation. We handle all production, and we make charitable donations in their honor for participation.

Current participating champions include {{exampleChampions}}, and the response from young athletes has been overwhelmingly positive.

This would involve:
• A brief video message (1-3 minutes) or written tip
• Professional editing and production support
• Feature placement in our Hall of Champions
• Charitable donation to their chosen cause
• Positive PR and social media amplification (with approval)

Would {{championName}} be interested in discussing this opportunity? I'd be happy to provide more details or schedule a brief call.

Best regards,
{{senderName}}
{{senderTitle}}
{{contactInfo}}`,
    variables: ['championName', 'exampleChampions', 'senderName', 'senderTitle', 'contactInfo'],
    useCase: 'Outreach through agents/representatives',
    successRate: '45%'
  },
  {
    id: '5',
    name: 'HeyGen Video Script',
    type: 'video_script',
    content: `Hey {{championName}},

We're building the gold standard for athlete empowerment, and no one embodies that like you. 

We'd be honored if you'd share a quick tip or message for the next generation—anything you wish you knew at the start, or what's mattered most in your journey.

We'll feature it in our Hall of Champions, with a donation to {{charityChoice}} in your honor.

Let's change the game for the next wave of champions—together.

[Show Hall of Champions preview]

Ready to inspire? Just reply to this video or click the link below.`,
    variables: ['championName', 'charityChoice'],
    useCase: 'Personalized video outreach using HeyGen',
    successRate: '52%'
  }
];

export const ChampionOutreachTemplates: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(outreachTemplates[0]);
  const [customizedContent, setCustomizedContent] = useState(selectedTemplate.content);
  const [variables, setVariables] = useState<Record<string, string>>({});

  const replaceVariables = (content: string, vars: Record<string, string>) => {
    let result = content;
    Object.entries(vars).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value || `{{${key}}}`);
    });
    return result;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'linkedin': return <MessageSquare className="h-4 w-4" />;
      case 'video_script': return <Video className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-500';
      case 'linkedin': return 'bg-purple-500';
      case 'video_script': return 'bg-green-500';
      case 'sms': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Star className="h-8 w-8 text-gold" />
          Champion Outreach Templates
        </h1>
        <p className="text-lg text-muted-foreground">
          Proven templates for recruiting legendary athletes to your Hall of Champions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available Templates</h2>
          {outreachTemplates.map((template) => (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all ${
                selectedTemplate.id === template.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => {
                setSelectedTemplate(template);
                setCustomizedContent(template.content);
              }}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{template.name}</h3>
                    <Badge className={getTypeColor(template.type)}>
                      {getTypeIcon(template.type)}
                      <span className="ml-1">{template.type}</span>
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{template.useCase}</p>
                  
                  {template.successRate && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-gold" />
                      <span className="text-sm font-medium">{template.successRate} success rate</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Template Editor */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedTemplate.name}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(replaceVariables(customizedContent, variables))}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button size="sm">
                    <Send className="h-4 w-4 mr-1" />
                    Send
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Variables */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Template Variables</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedTemplate.variables.map((variable) => (
                    <div key={variable} className="space-y-1">
                      <Label htmlFor={variable} className="text-sm">
                        {variable.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Label>
                      <Input
                        id={variable}
                        placeholder={`Enter ${variable}...`}
                        value={variables[variable] || ''}
                        onChange={(e) => setVariables(prev => ({ ...prev, [variable]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject Line (for emails) */}
              {selectedTemplate.subject && (
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Subject Line</Label>
                  <Input
                    value={replaceVariables(selectedTemplate.subject, variables)}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              )}

              {/* Content Editor */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Message Content</Label>
                <Textarea
                  value={customizedContent}
                  onChange={(e) => setCustomizedContent(e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Preview</Label>
                <div className="p-4 bg-muted rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm">
                    {replaceVariables(customizedContent, variables)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>Best Practices:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-muted-foreground">
                    <li>Personalize every message with specific achievements</li>
                    <li>Mention specific charitable causes they support</li>
                    <li>Reference other champions who have already participated</li>
                    <li>Keep initial outreach under 200 words</li>
                  </ul>
                </div>
                
                <div>
                  <strong>Success Metrics:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-muted-foreground">
                    <li>Response rate: Track opens, replies, and conversions</li>
                    <li>Follow-up timing: Wait 5-7 days between touches</li>
                    <li>Agent outreach has highest success rate (45%)</li>
                  </ul>
                </div>
                
                <div>
                  <strong>Next Steps:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-muted-foreground">
                    <li>Copy template and personalize variables</li>
                    <li>Send through appropriate channel (email, LinkedIn, agent)</li>
                    <li>Log outreach in admin panel for tracking</li>
                    <li>Set reminder for follow-up in 5-7 days</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};