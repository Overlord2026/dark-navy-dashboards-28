import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Users, 
  FileText, 
  DollarSign, 
  BarChart3, 
  Crown,
  Mail,
  MessageSquare,
  Phone,
  Upload,
  Download,
  Award,
  CheckCircle,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Star,
  Building,
  UserPlus,
  Target
} from 'lucide-react';

export const InsuranceVIPLaunchKit: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [invitesSent, setInvitesSent] = useState(0);
  const [agentsOnboarded, setAgentsOnboarded] = useState(0);

  const stats = [
    { label: 'Total Agents', value: '24', icon: Users, color: 'text-blue-600' },
    { label: 'Active Policies', value: '156', icon: Shield, color: 'text-green-600' },
    { label: 'Commission MTD', value: '$24.5K', icon: DollarSign, color: 'text-gold' },
    { label: 'SWAG Score™', value: '95%', icon: TrendingUp, color: 'text-emerald-600' }
  ];

  const complianceItems = [
    { state: 'California', license: 'CA-123456', renewal: '2024-12-15', status: 'active' },
    { state: 'Texas', license: 'TX-789012', renewal: '2024-11-30', status: 'warning' },
    { state: 'Florida', license: 'FL-345678', renewal: '2025-03-10', status: 'active' },
    { state: 'New York', license: 'NY-901234', renewal: '2024-10-22', status: 'critical' }
  ];

  const inviteTemplates = {
    email: {
      subject: "You're Invited: Elite Access to Boutique Family Office™ Insurance Marketplace",
      body: `Hi [Agent/Executive Name],

As a recognized leader in the insurance & annuities field, you've been selected for Founding Partner access to the Boutique Family Office™—the industry's new platform for wealth, health, and risk management.

Exclusive Benefits for Founders:
• VIP badge & profile: Priority placement in the Insurance Marketplace
• Bulk Client/Downline Invites: Instantly bring your agents and clients
• CE Tracker & License Alerts: Stay compliant with automated reminders
• Marketplace referral credits: Earn for each agent or client added

Activate your VIP profile and start building your presence:
[Activate Insurance Profile] (magic-link-url)

To your continued success,
Tony Gomes
Co-Founder, Boutique Family Office™`
    },
    linkedin: "Hi [Name], Excited to invite you as a VIP Founding Partner to Boutique Family Office's new Insurance Marketplace—designed for top agents, IMOs, and FMOs. Want early access and special recognition?",
    sms: "Hi [Name], it's Tony Gomes—founding partner invite for you to our Insurance Marketplace. VIP badge, client referral credits, CE/license tracking, and more: [magic-link-url]"
  };

  const trainingModules = [
    { title: 'Insurance Dashboard & Profile Setup', duration: '15 min', completed: true },
    { title: 'Bulk Downline Import & Seat Allocation', duration: '20 min', completed: true },
    { title: 'Compliance and CE Tracker Usage', duration: '25 min', completed: false },
    { title: 'Client Onboarding & Document Workflows', duration: '30 min', completed: false },
    { title: 'Referral Credits & Reward System', duration: '15 min', completed: false },
    { title: 'Performance Analytics & Reporting', duration: '20 min', completed: false },
    { title: 'Admin Tools for IMO/FMO Management', duration: '25 min', completed: false },
    { title: 'Support & FAQ for Agency Staff', duration: '10 min', completed: false }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Insurance VIP Launch Kit</h1>
            <p className="text-muted-foreground">
              Complete toolkit for Insurance/IMO/FMO founding partners
            </p>
          </div>
        </div>
        <Badge className="bg-gold/10 text-gold border-gold/20">
          VIP Founding Partner
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invites">Invitations</TabsTrigger>
          <TabsTrigger value="downline">Downline</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Agency Profile Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Agency Name</label>
                  <Input placeholder="Enter your agency name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Specialties</label>
                  <div className="flex flex-wrap gap-2">
                    {['Annuities', 'Life Insurance', 'LTC', 'Disability', 'Medicare'].map((specialty) => (
                      <Badge key={specialty} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Agency Description</label>
                  <Textarea placeholder="Describe your agency and services" rows={3} />
                </div>
                <Button className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Agency Logo
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  VIP Benefits Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">VIP Badge Activated</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Priority Marketplace Placement</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bulk Import Access</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Referral Rewards</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Early Feature Access</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-gold/10 border border-gold/20 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Crown className="h-5 w-5 text-gold mr-2" />
                    <h4 className="font-semibold">Founding Partner Status</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Permanent recognition and enhanced benefits
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invites" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Invitation Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject Line</label>
                  <Input value={inviteTemplates.email.subject} readOnly />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Body</label>
                  <Textarea 
                    value={inviteTemplates.email.body} 
                    rows={8} 
                    readOnly 
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Copy Template
                  </Button>
                  <Button className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invite
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Quick Invite Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">LinkedIn Message</label>
                  <Textarea 
                    value={inviteTemplates.linkedin} 
                    rows={3} 
                    readOnly 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">SMS Message</label>
                  <Textarea 
                    value={inviteTemplates.sms} 
                    rows={3} 
                    readOnly 
                  />
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Invitation Stats</h4>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{invitesSent}</div>
                      <div className="text-sm text-muted-foreground">Invites Sent</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{agentsOnboarded}</div>
                      <div className="text-sm text-muted-foreground">Agents Joined</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="downline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Agent & Downline Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-20 flex-col">
                  <Upload className="h-6 w-6 mb-2" />
                  Bulk Import CSV
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <UserPlus className="h-6 w-6 mb-2" />
                  Add Individual
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Mail className="h-6 w-6 mb-2" />
                  Send Invites
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4">Agent Roster</h4>
                <div className="space-y-3">
                  {[
                    { name: 'Sarah Johnson', role: 'Senior Agent', status: 'Active', licenses: 3 },
                    { name: 'Mike Chen', role: 'Agent', status: 'Pending', licenses: 2 },
                    { name: 'Emily Rodriguez', role: 'Agent', status: 'Active', licenses: 4 },
                    { name: 'David Kim', role: 'Junior Agent', status: 'Training', licenses: 1 }
                  ].map((agent, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-sm text-muted-foreground">{agent.role}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge 
                          variant={agent.status === 'Active' ? 'default' : 'outline'}
                          className={
                            agent.status === 'Active' ? 'bg-green-100 text-green-800' :
                            agent.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }
                        >
                          {agent.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{agent.licenses} licenses</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                License & CE Compliance Tracker
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {complianceItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-medium">{item.state}</div>
                        <div className="text-sm text-muted-foreground">License: {item.license}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">Renewal: {item.renewal}</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.ceil((new Date(item.renewal).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          item.status === 'active' ? 'bg-green-100 text-green-800' :
                          item.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {item.status === 'active' ? 'Active' : 
                         item.status === 'warning' ? 'Renewal Due' : 'Critical'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">CE Progress</h4>
                  <Progress value={75} className="mb-2" />
                  <p className="text-sm text-muted-foreground">18/24 hours completed</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Compliance Score</h4>
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <p className="text-sm text-muted-foreground">Above industry average</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Referral Rewards Program
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gold/10 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-gold">$50</div>
                    <div className="text-sm text-muted-foreground">Per Agent</div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">$25</div>
                    <div className="text-sm text-muted-foreground">Per Client</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">$100</div>
                    <div className="text-sm text-muted-foreground">Per Sub-Agency</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Current Balance</span>
                    <span className="font-semibold text-gold">$1,275</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pending Rewards</span>
                    <span className="font-semibold">$350</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Earned</span>
                    <span className="font-semibold">$2,840</span>
                  </div>
                </div>

                <Button className="w-full">
                  <Target className="h-4 w-4 mr-2" />
                  Send Referral Invites
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  VIP Insurance Wall
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold mb-2">#3</div>
                  <p className="text-sm text-muted-foreground">Current Leaderboard Position</p>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Elite Insurance Group', score: 2840, position: 1 },
                    { name: 'Premier Financial Services', score: 2650, position: 2 },
                    { name: 'Your Agency', score: 2350, position: 3, highlight: true },
                    { name: 'Apex Insurance Partners', score: 2180, position: 4 }
                  ].map((agency) => (
                    <div 
                      key={agency.position} 
                      className={`flex items-center justify-between p-3 rounded ${
                        agency.highlight ? 'bg-gold/10 border border-gold/20' : 'bg-gray-50 dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          agency.position === 1 ? 'bg-gold text-white' :
                          agency.position === 2 ? 'bg-gray-400 text-white' :
                          agency.position === 3 ? 'bg-amber-600 text-white' :
                          'bg-gray-300 text-gray-700'
                        }`}>
                          {agency.position}
                        </div>
                        <span className={`font-medium ${agency.highlight ? 'text-gold' : ''}`}>
                          {agency.name}
                        </span>
                      </div>
                      <span className="font-semibold">${agency.score}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">95%</div>
                    <div className="text-sm text-muted-foreground">SWAG Score™</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">156</div>
                    <div className="text-sm text-muted-foreground">Active Policies</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Conversion Rate</span>
                    <span className="font-semibold">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="font-semibold">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Retention Rate</span>
                    <span className="font-semibold">89%</span>
                  </div>
                  <Progress value={89} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Pipeline Tracker
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { stage: 'Leads', count: 23, color: 'bg-blue-100 text-blue-800' },
                    { stage: 'Qualified', count: 15, color: 'bg-purple-100 text-purple-800' },
                    { stage: 'Applications', count: 8, color: 'bg-orange-100 text-orange-800' },
                    { stage: 'Underwriting', count: 5, color: 'bg-yellow-100 text-yellow-800' },
                    { stage: 'Issued', count: 3, color: 'bg-green-100 text-green-800' }
                  ].map((stage, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <span className="font-medium">{stage.stage}</span>
                      <Badge className={stage.color}>{stage.count}</Badge>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">This Month</h4>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold">12</div>
                      <div className="text-sm text-muted-foreground">Policies Sold</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gold">$24.5K</div>
                      <div className="text-sm text-muted-foreground">Commission</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Insurance Training Manual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {trainingModules.map((module, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {module.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                      )}
                      <div>
                        <div className="font-medium">{module.title}</div>
                        <div className="text-sm text-muted-foreground">{module.duration}</div>
                      </div>
                    </div>
                    <Button 
                      variant={module.completed ? "outline" : "default"} 
                      size="sm"
                    >
                      {module.completed ? "Review" : "Start"}
                    </Button>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Training Progress</h4>
                <Progress value={25} className="mb-2" />
                <p className="text-sm text-muted-foreground">2 of 8 modules completed</p>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF Manual
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Print Checklist
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};