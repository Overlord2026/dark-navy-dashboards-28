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
    name: 'Initial Agent Introduction',
    type: 'email',
    subject: 'Empowering Athletes & Their Agents: Family Office Marketplace Collaboration',
    content: `Hi [AGENT_NAME],

I'm Tony Gomes, founder of Boutique Family Office. Our mission is to empower athletes and their trusted advisors—sports agents, coaches, and families—with world-class education, compliance tools, and wellness resources.

We're launching a first-of-its-kind platform combining:
• Fiduciary best practices and education
• Private market access and family office services
• Mental health and post-career transition support
• Secure, compliant digital environments for your clients

As one of the industry's most respected agents representing [NOTABLE_CLIENTS], your insights would be invaluable. We're inviting a select group of top agents to:

✓ Preview our platform before public launch
✓ Provide feedback on agent-specific features
✓ Join as a Founding Partner with special benefits
✓ Co-create educational content for your athletes

Would you be open to a brief 15-minute call to discuss how we can support your clients' long-term success?

Best regards,
Tony Gomes
Founder & CEO, Boutique Family Office

P.S. Happy to arrange this around your schedule - I know how busy you are during [SEASON_CONTEXT].`,
    category: 'initial',
    personalizable: ['AGENT_NAME', 'NOTABLE_CLIENTS', 'SEASON_CONTEXT']
  },
  {
    id: '2',
    name: 'LinkedIn Connection Request',
    type: 'linkedin',
    content: `Hi [AGENT_NAME], I'm launching a family office platform specifically designed to empower athletes and their agents with financial education, compliance tools, and wellness resources. Would love to connect and share our vision for supporting [PRIMARY_SPORT] athletes like [TOP_CLIENT]. Always looking to learn from industry leaders!`,
    category: 'initial',
    personalizable: ['AGENT_NAME', 'PRIMARY_SPORT', 'TOP_CLIENT']
  },
  {
    id: '3',
    name: 'League Executive Partnership',
    type: 'email',
    subject: 'Athlete Financial Wellness Partnership Opportunity',
    content: `Dear [EXEC_NAME],

I'm Tony Gomes, founder of Boutique Family Office. Our mission aligns perfectly with [LEAGUE]'s commitment to player welfare and long-term success.

We're developing a comprehensive platform that addresses the critical gap in athlete financial education and post-career planning. Key features include:

🏆 League-endorsed educational modules
📊 Compliance tools and best practices
🧠 Mental health and transition support
💼 Family office services and private market access
🤝 Secure collaboration tools for agents and families

We'd be honored to collaborate with [LEAGUE] as a founding partner to:
• Co-create player education content
• Develop league-specific compliance tools
• Offer white-label solutions for player development programs
• Support your existing wellness initiatives

Could we schedule a brief call to discuss how our platform can complement [LEAGUE]'s player development goals?

Respectfully,
Tony Gomes
Founder & CEO

[LEAGUE_SPECIFIC_STATS]`,
    category: 'league-exec',
    personalizable: ['EXEC_NAME', 'LEAGUE', 'LEAGUE_SPECIFIC_STATS']
  },
  {
    id: '4',
    name: 'Video Script Template',
    type: 'video',
    content: `Hey [AGENT_NAME],

Tony Gomes here from Boutique Family Office. I know you're incredibly busy representing some of the best talent in [SPORT], including [TOP_CLIENT].

I wanted to personally reach out because we're building something I think you and your clients will find incredibly valuable—a comprehensive family office platform designed specifically for athletes.

We're talking about:
- Real fiduciary education and compliance tools
- Mental health support and post-career planning
- Private market access typically reserved for ultra-high net worth families
- Secure collaboration spaces for you, your athletes, and their families

As one of the most respected agents in the business, your input would be invaluable. We're offering a select group of top agents early access and founding partner benefits.

Would you be open to a quick 15-minute call this week? I can work around your schedule.

Looking forward to hearing from you!`,
    category: 'initial',
    personalizable: ['AGENT_NAME', 'SPORT', 'TOP_CLIENT']
  },
  {
    id: '5',
    name: 'Follow-up After No Response',
    type: 'email',
    subject: 'Quick follow-up: Athlete empowerment platform',
    content: `Hi [AGENT_NAME],

I sent a note last week about our athlete family office platform. I know you're incredibly busy, especially with [CURRENT_CONTEXT].

Just wanted to share a quick update: we've had [RECENT_SUCCESS] and several top agents have already joined as founding partners.

No pressure at all—if you're interested in learning more, I'm happy to send a 2-minute video demo or schedule a brief call at your convenience.

If now isn't the right time, I completely understand. Your clients and their success come first.

Best,
Tony`,
    category: 'follow-up',
    personalizable: ['AGENT_NAME', 'CURRENT_CONTEXT', 'RECENT_SUCCESS']
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