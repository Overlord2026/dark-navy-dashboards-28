import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Linkedin, Video, Phone, Copy, Send, Users, Building, Trophy, Star } from 'lucide-react';
import { toast } from 'sonner';

interface OutreachTemplate {
  id: string;
  name: string;
  type: 'email' | 'linkedin' | 'video' | 'phone';
  subject?: string;
  content: string;
  category: 'initial' | 'follow-up' | 'league-exec' | 'agent-specific';
  personalizable: string[];
}

const OUTREACH_TEMPLATES: OutreachTemplate[] = [
  {
    id: '1',
    name: 'VIP Founding 100 Invitation',
    type: 'email',
    subject: 'You\'ve Been Chosen: Elite VIP Founders Invitation for Family Office Marketplace',
    content: `Hi [AGENT_NAME],

We're excited to invite you as one of the first 100 Sports Agents recognized as leaders in your field to join the Family Office Marketplace.

As one of the industry's most respected agents representing [NOTABLE_CLIENTS], you've been personally selected for our exclusive Founding 100.

🏆 What You Get as a Founding Member:
• Private access to HNW families and athletes
• Premium AI-driven compliance & marketplace toolkit  
• Athlete education modules and wellness resources
• Special "Founding Member" VIP badge and recognition
• Early access to all platform features

This offer is exclusive—first 100 only.

[Link: Claim My Founders Seat]

Spots are limited—first come, first served. We look forward to welcoming you as a founding member!

Best regards,
Tony Gomes
Founder & CEO, Boutique Family Office

P.S. The Founding 100 window closes soon. Secure your VIP profile today.`,
    category: 'initial',
    personalizable: ['AGENT_NAME', 'NOTABLE_CLIENTS']
  },
  {
    id: '2',
    name: 'LinkedIn VIP Connection',
    type: 'linkedin',
    content: `Hi [AGENT_NAME], you've been selected as one of the top 100 sports agents to join our Family Office Marketplace as a VIP founding member. Exclusive access to HNW families, athlete education tools, and AI compliance platform. Would love to connect and share how we're empowering [PRIMARY_SPORT] agents like you with [TOP_CLIENT]. Founding 100 spots filling fast!`,
    category: 'initial',
    personalizable: ['AGENT_NAME', 'PRIMARY_SPORT', 'TOP_CLIENT']
  },
  {
    id: '3',
    name: 'Follow-Up: Founding Window Closing',
    type: 'email',
    subject: 'Final Hours: Your VIP Founding 100 Seat Is Reserved',
    content: `Hi [AGENT_NAME],

Quick follow-up on your reserved VIP Founding 100 seat in our Family Office Marketplace.

We're down to the final spots, and I wanted to make sure you didn't miss this exclusive opportunity.

As a leading agent in [SPORT] representing [TOP_CLIENT], your expertise would be invaluable to our founding community.

⏰ Only [SPOTS_LEFT] founding seats remain

What happens when you claim your seat:
✓ Instant VIP profile activation
✓ Access to our Hall of Champions network
✓ Premium compliance and education tools
✓ Direct connection to elite families

[Claim Your Founding Seat - 2 Minutes]

The founding window closes at midnight. After that, entry moves to our standard waitlist.

Questions? Just reply to this email.

Best,
Tony`,
    category: 'follow-up',
    personalizable: ['AGENT_NAME', 'SPORT', 'TOP_CLIENT', 'SPOTS_LEFT']
  },
  {
    id: '4',
    name: 'Video Invitation Script',
    type: 'video',
    content: `Hey [AGENT_NAME],

Tony Gomes here, founder of the Family Office Marketplace. 

I'm personally reaching out because you've been selected as one of our Founding 100 - the most elite sports agents who are shaping the future of athlete representation.

Your work with [TOP_CLIENT] and success in [SPORT] exemplifies exactly the kind of leadership we want in our founding community.

We're building the first comprehensive platform that combines:
- Real fiduciary education for athletes
- AI-powered compliance tools
- Direct access to family office services
- Mental health and post-career planning resources

As a founding member, you'll get:
• VIP badge and recognition
• Early access to all features
• Direct line to our development team
• Exclusive founding member benefits

There are only [SPOTS_LEFT] founding seats left. Once they're gone, that's it.

Ready to be part of something revolutionary in athlete representation?

Claim your founding seat now - it takes 2 minutes.

Looking forward to having you on board!`,
    category: 'initial',
    personalizable: ['AGENT_NAME', 'TOP_CLIENT', 'SPORT', 'SPOTS_LEFT']
  },
  {
    id: '5',
    name: 'Last Call - Urgency Sequence',
    type: 'email',
    subject: '🚨 FINAL CALL: Your Founding 100 Seat Expires Tonight',
    content: `[AGENT_NAME],

This is it - the final call for your reserved Founding 100 seat.

At midnight tonight, we close the founding member program forever. After that:
❌ No more founding member benefits
❌ No more VIP status
❌ Standard application process only

I'd hate to see you miss out on this exclusive opportunity, especially given your impressive track record with [NOTABLE_CLIENTS].

Your seat is literally one click away:
[SECURE MY FOUNDING SEAT NOW]

After tonight, this link deactivates permanently.

Don't let this opportunity slip away.

Final hours,
Tony Gomes
Founder, Family Office Marketplace

P.S. Only [FINAL_SPOTS] seats remain. When they're gone, they're gone.`,
    category: 'follow-up',
    personalizable: ['AGENT_NAME', 'NOTABLE_CLIENTS', 'FINAL_SPOTS']
  },
  {
    id: '6',
    name: 'Congratulations - Welcome Template',
    type: 'email',
    subject: '🎉 Welcome to the Founding 100! Your VIP Access is Now Active',
    content: `Congratulations [AGENT_NAME]!

Welcome to the exclusive Founding 100 of the Family Office Marketplace!

Your VIP profile is now live, and you officially have founding member status. You're now part of an elite group of just 100 sports agents who are shaping the future of athlete representation.

🎯 Your Next Steps:
1. Complete your VIP profile: [PROFILE_LINK]
2. Access the Hall of Champions: [CHAMPIONS_LINK]  
3. Explore athlete education modules: [EDUCATION_LINK]
4. Join our founding member Slack: [SLACK_INVITE]

🏆 Your Founding Member Benefits:
• Exclusive VIP badge on all platforms
• Priority access to new features
• Direct line to our development team
• Founding member networking events
• Revenue sharing opportunities

We're thrilled to have someone of your caliber representing [NOTABLE_CLIENTS] as part of our founding community.

Ready to revolutionize athlete representation together?

Welcome aboard!

Tony Gomes & The Family Office Team`,
    category: 'agent-specific',
    personalizable: ['AGENT_NAME', 'NOTABLE_CLIENTS', 'PROFILE_LINK', 'CHAMPIONS_LINK', 'EDUCATION_LINK', 'SLACK_INVITE']
  }
];

const AGENT_CATEGORIES = [
  { id: 'tier1', name: 'Tier 1 Agents', description: 'Scott Boras, Rich Paul, Drew Rosenhaus level' },
  { id: 'tier2', name: 'Tier 2 Agents', description: 'Established agents with strong client roster' },
  { id: 'rising', name: 'Rising Stars', description: 'Up-and-coming agents with momentum' },
  { id: 'specialty', name: 'Specialty Agents', description: 'Golf, Soccer, UFC, Olympic specialists' }
];

export const AgentOutreachTemplates: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<OutreachTemplate>(OUTREACH_TEMPLATES[0]);
  const [personalizations, setPersonalizations] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState('initial');

  const handlePersonalizationChange = (key: string, value: string) => {
    setPersonalizations(prev => ({ ...prev, [key]: value }));
  };

  const generatePersonalizedContent = () => {
    let content = selectedTemplate.content;
    Object.entries(personalizations).forEach(([key, value]) => {
      content = content.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
    });
    return content;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Template copied to clipboard!');
  };

  const filteredTemplates = OUTREACH_TEMPLATES.filter(template => 
    selectedCategory === 'all' || template.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Hero Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Mail className="w-4 h-4" />
            VIP Agent Outreach
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Sports Agent Outreach Templates
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Professional templates for connecting with top sports agents and league executives
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Selector */}
          <div className="lg:col-span-1">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Outreach Templates</CardTitle>
                <CardDescription className="text-blue-200">
                  Choose a template category and customize
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Template Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Templates</SelectItem>
                    <SelectItem value="initial">Initial Contact</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="league-exec">League Executives</SelectItem>
                    <SelectItem value="agent-specific">Agent-Specific</SelectItem>
                  </SelectContent>
                </Select>

                <div className="space-y-2">
                  {filteredTemplates.map((template) => (
                    <Button
                      key={template.id}
                      variant={selectedTemplate.id === template.id ? "default" : "outline"}
                      className={`w-full text-left justify-start ${
                        selectedTemplate.id === template.id 
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black' 
                          : 'border-white/20 text-white hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <div className="flex items-center gap-2">
                        {template.type === 'email' && <Mail className="w-4 h-4" />}
                        {template.type === 'linkedin' && <Linkedin className="w-4 h-4" />}
                        {template.type === 'video' && <Video className="w-4 h-4" />}
                        {template.type === 'phone' && <Phone className="w-4 h-4" />}
                        <div>
                          <div className="font-semibold">{template.name}</div>
                          <div className="text-xs opacity-70">{template.type.toUpperCase()}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Agent Categories */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle className="text-white">Target Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {AGENT_CATEGORIES.map((category) => (
                  <div key={category.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="font-semibold text-white">{category.name}</div>
                    <div className="text-sm text-blue-200">{category.description}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Template Editor */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="template" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger value="template" className="data-[state=active]:bg-white data-[state=active]:text-black">
                  Template Editor
                </TabsTrigger>
                <TabsTrigger value="personalize" className="data-[state=active]:bg-white data-[state=active]:text-black">
                  Personalize
                </TabsTrigger>
              </TabsList>

              <TabsContent value="template">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">{selectedTemplate.name}</CardTitle>
                        <CardDescription className="text-blue-200">
                          {selectedTemplate.type.toUpperCase()} Template
                        </CardDescription>
                      </div>
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                        {selectedTemplate.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedTemplate.subject && (
                      <div>
                        <label className="text-sm font-semibold text-white mb-2 block">Subject Line:</label>
                        <Input
                          value={selectedTemplate.subject}
                          readOnly
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-semibold text-white mb-2 block">Template Content:</label>
                      <Textarea
                        value={generatePersonalizedContent()}
                        readOnly
                        rows={15}
                        className="bg-white/10 border-white/20 text-white font-mono text-sm"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => copyToClipboard(generatePersonalizedContent())}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Template
                      </Button>
                      <Button 
                        onClick={() => copyToClipboard(selectedTemplate.subject || '')}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Copy Subject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="personalize">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Personalization Fields</CardTitle>
                    <CardDescription className="text-blue-200">
                      Fill in these fields to customize your template
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedTemplate.personalizable.map((field) => (
                      <div key={field}>
                        <label className="text-sm font-semibold text-white mb-2 block">
                          {field.replace(/_/g, ' ')}:
                        </label>
                        <Input
                          placeholder={`Enter ${field.replace(/_/g, ' ').toLowerCase()}`}
                          value={personalizations[field] || ''}
                          onChange={(e) => handlePersonalizationChange(field, e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                    ))}

                    <div className="pt-4">
                      <Button 
                        onClick={() => copyToClipboard(generatePersonalizedContent())}
                        className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-semibold"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Copy Personalized Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">100+</div>
              <div className="text-sm text-blue-200">Target Agents</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Building className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">15+</div>
              <div className="text-sm text-blue-200">League Executives</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">$1B+</div>
              <div className="text-sm text-blue-200">Contracts Represented</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">9</div>
              <div className="text-sm text-blue-200">Sports Covered</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};