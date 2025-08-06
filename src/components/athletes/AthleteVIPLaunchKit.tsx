import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Trophy, Star, Send, Copy, Download, Users, Target, Shield, 
  Mail, MessageCircle, Smartphone, FileText, Calendar, TrendingUp 
} from 'lucide-react';
import { toast } from 'sonner';

interface AthleteVIPLaunchKitProps {
  onLaunch: (data: any) => void;
}

export function AthleteVIPLaunchKit({ onLaunch }: AthleteVIPLaunchKitProps) {
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState('');
  const [launchName, setLaunchName] = useState('Athlete VIP Launch - ' + new Date().toLocaleDateString());

  const handleCopyTemplate = (template: string) => {
    navigator.clipboard.writeText(template);
    toast.success('Template copied to clipboard');
  };

  const emailTemplate = `Subject: Founding Invitation: Athlete Wealth Education—Boutique Family Office™

Hi [Athlete Name],

As a champion on and off the field, you've been chosen as a founding member of our Athlete Wealth Education Center. Our team—trusted by families, advisors, and sports professionals—has developed a world-class curriculum and self-assessment tools to help protect your legacy and empower your journey.

Join now for VIP access, a founding badge, and the opportunity to shape the future of athlete financial education.

[Activate My Athlete Portal] (magic link)

—Tony Gomes
Boutique Family Office`;

  const linkedinTemplate = `Hi [Name],

I'm launching the first fiduciary-led athlete wealth education platform—would love to collaborate with [league/team/association] to help protect and empower athletes. Let's connect!

This platform features:
🏆 Curriculum designed specifically for athletes
🧠 Mental health and career transition support
💰 Direct access to vetted financial advisors
🤝 Elite founding member network

Interested in joining as a founding member?`;

  const smsTemplate = `Hi [Name], you're invited as a founding Athlete in our Family Office Marketplace—VIP badge, premium education, and direct advisor access. Join the elite: [magic-link]`;

  const targetAthletes = [
    { id: '1', name: 'LeBron James', sport: 'Basketball', team: 'Lakers', tier: 'Superstar' },
    { id: '2', name: 'Tom Brady', sport: 'Football', team: 'Retired', tier: 'Legend' },
    { id: '3', name: 'Serena Williams', sport: 'Tennis', team: 'Retired', tier: 'Icon' },
    { id: '4', name: 'Patrick Mahomes', sport: 'Football', team: 'Chiefs', tier: 'Rising Star' },
    { id: '5', name: 'Simone Biles', sport: 'Gymnastics', team: 'Olympic', tier: 'Champion' },
    { id: '6', name: 'Tiger Woods', sport: 'Golf', team: 'PGA', tier: 'Legend' },
    { id: '7', name: 'Megan Rapinoe', sport: 'Soccer', team: 'USWNT', tier: 'Icon' },
    { id: '8', name: 'Stephen Curry', sport: 'Basketball', team: 'Warriors', tier: 'Superstar' }
  ];

  const launchMetrics = [
    { label: 'Target Athletes', value: '500+', icon: Trophy },
    { label: 'Expected Response Rate', value: '15-25%', icon: TrendingUp },
    { label: 'Avg. Platform Value', value: '$2.5M+', icon: Target },
    { label: 'Launch Timeline', value: '2 weeks', icon: Calendar }
  ];

  const handleLaunch = () => {
    const launchData = {
      name: launchName,
      selectedAthletes,
      customMessage,
      templates: {
        email: emailTemplate,
        linkedin: linkedinTemplate,
        sms: smsTemplate
      },
      timestamp: new Date().toISOString()
    };
    
    onLaunch(launchData);
    toast.success('VIP launch initiated successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Athlete VIP Launch Kit</h2>
        </div>
        <p className="text-muted-foreground">
          Launch your exclusive Athlete & Entertainer wealth education program
        </p>
      </div>

      {/* Launch Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        {launchMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <metric.icon className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="athletes" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Target List
          </TabsTrigger>
          <TabsTrigger value="campaign" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Campaign
          </TabsTrigger>
          <TabsTrigger value="press" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Press Kit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6">
            {/* Email Template */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Invitation Template
                </CardTitle>
                <CardDescription>
                  Personalized email invitation for VIP athletes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg font-mono text-sm whitespace-pre-line">
                    {emailTemplate}
                  </div>
                  <Button onClick={() => handleCopyTemplate(emailTemplate)} variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* LinkedIn Template */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  LinkedIn Outreach Template
                </CardTitle>
                <CardDescription>
                  Professional network outreach message
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg font-mono text-sm whitespace-pre-line">
                    {linkedinTemplate}
                  </div>
                  <Button onClick={() => handleCopyTemplate(linkedinTemplate)} variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* SMS Template */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  SMS Template
                </CardTitle>
                <CardDescription>
                  Concise text message invitation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg font-mono text-sm">
                    {smsTemplate}
                  </div>
                  <Button onClick={() => handleCopyTemplate(smsTemplate)} variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="athletes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Target Athlete Directory</CardTitle>
              <CardDescription>
                Select athletes for your VIP launch campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-3">
                  {targetAthletes.map((athlete) => (
                    <div
                      key={athlete.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer"
                      onClick={() => {
                        setSelectedAthletes(prev =>
                          prev.includes(athlete.id)
                            ? prev.filter(id => id !== athlete.id)
                            : [...prev, athlete.id]
                        );
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedAthletes.includes(athlete.id)}
                          readOnly
                          className="rounded"
                        />
                        <div>
                          <div className="font-medium">{athlete.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {athlete.sport} • {athlete.team}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{athlete.tier}</Badge>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Selected: {selectedAthletes.length} athletes
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaign" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Configuration</CardTitle>
              <CardDescription>
                Set up your VIP launch campaign details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="launch-name">Campaign Name</Label>
                <Input
                  id="launch-name"
                  value={launchName}
                  onChange={(e) => setLaunchName(e.target.value)}
                  placeholder="Enter campaign name"
                />
              </div>

              <div>
                <Label htmlFor="custom-message">Custom Message (Optional)</Label>
                <Textarea
                  id="custom-message"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Add any custom message or context for this launch..."
                  rows={4}
                />
              </div>

              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-semibold mb-2">Launch Summary</h4>
                <div className="space-y-1 text-sm">
                  <div>Campaign: {launchName}</div>
                  <div>Target Athletes: {selectedAthletes.length} selected</div>
                  <div>Channels: Email, LinkedIn, SMS</div>
                  <div>Expected Reach: ~{selectedAthletes.length * 1000} followers</div>
                </div>
              </div>

              <Button onClick={handleLaunch} className="w-full" size="lg">
                <Send className="h-4 w-4 mr-2" />
                Launch VIP Campaign
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="press" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Press Release Kit</CardTitle>
              <CardDescription>
                Media assets and press release for your launch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Press Release Headlines</h4>
                <div className="space-y-2 text-sm">
                  <div className="p-3 bg-muted rounded">
                    "Boutique Family Office™ Launches Fiduciary-Driven Wealth Education Platform for Athletes—Founding Members Announced"
                  </div>
                  <div className="p-3 bg-muted rounded">
                    "Elite Athletes Join Revolutionary Financial Education Platform Focused on Post-Career Wellness"
                  </div>
                  <div className="p-3 bg-muted rounded">
                    "First-of-its-Kind Platform Addresses Mental Health and Wealth Management for Professional Athletes"
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Key Messages</h4>
                <div className="space-y-2 text-sm">
                  <div>• World-class curriculum designed specifically for athletes and entertainers</div>
                  <div>• Addresses unique challenges including post-career depression and identity transition</div>
                  <div>• AI-powered wellbeing copilot for confidential mental health support</div>
                  <div>• Direct access to vetted, fiduciary financial advisors</div>
                  <div>• Founding member program with exclusive benefits and recognition</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Press Kit
                </Button>
                <Button variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Press Release
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}