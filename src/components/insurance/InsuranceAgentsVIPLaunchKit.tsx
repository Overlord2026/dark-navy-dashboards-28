import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, FileText, BarChart3, Mail, MessageSquare, Phone, Upload, Download, Award, Clock, Building, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const InsuranceAgentsVIPLaunchKit: React.FC = () => {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [invitesSent, setInvitesSent] = useState(0);

  const handleBulkInvite = (method: 'email' | 'linkedin' | 'sms') => {
    setInvitesSent(prev => prev + selectedAgents.length);
    toast({
      title: "VIP Invites Sent!",
      description: `Sent ${selectedAgents.length} invitations via ${method} to insurance professionals`,
    });
    setSelectedAgents([]);
  };

  const handleExportData = () => {
    toast({
      title: "Data Exported",
      description: "Insurance agents contact list exported successfully",
    });
  };

  const agentTargets = [
    {
      id: '1',
      name: 'Michael Rodriguez',
      organization: 'Rodriguez Insurance Group',
      role: 'Principal Agent',
      specialty: 'Life & Annuities',
      email: 'michael@rodriguezins.com',
      linkedin: 'linkedin.com/in/michaelrodriguez',
      status: 'priority',
      tier: 'IMO Executive',
      licenses: ['Life', 'Health', 'Series 6', 'Series 63']
    },
    {
      id: '2',
      name: 'Sarah Chen',
      organization: 'Elite Financial Services',
      role: 'Managing Partner',
      specialty: 'Estate Planning',
      email: 'sarah@elitefinancial.com',
      linkedin: 'linkedin.com/in/sarahchen',
      status: 'reserved',
      tier: 'Founding Agent',
      licenses: ['Life', 'Health', 'P&C', 'Series 7']
    },
    {
      id: '3',
      name: 'David Thompson',
      organization: 'Thompson & Associates',
      role: 'Senior Agent',
      specialty: 'Business Insurance',
      email: 'david@thompsonassoc.com',
      linkedin: 'linkedin.com/in/davidthompson',
      status: 'invited',
      tier: 'Premium Agent',
      licenses: ['Life', 'Health', 'P&C']
    },
    {
      id: '4',
      name: 'Lisa Martinez',
      organization: 'Martinez Insurance Solutions',
      role: 'Agency Owner',
      specialty: 'Group Benefits',
      email: 'lisa@martinezins.com',
      linkedin: 'linkedin.com/in/lisamartinez',
      status: 'pending',
      tier: 'Agency Leader',
      licenses: ['Life', 'Health', 'Group']
    },
    {
      id: '5',
      name: 'Robert Kim',
      organization: 'Pacific Coast Insurance',
      role: 'Regional Director',
      specialty: 'High Net Worth',
      email: 'robert@pacificcoast.com',
      linkedin: 'linkedin.com/in/robertkim',
      status: 'priority',
      tier: 'VIP Executive',
      licenses: ['Life', 'Health', 'Series 6', 'Series 7', 'Series 66']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'priority': return 'bg-red-100 text-red-800';
      case 'reserved': return 'bg-gold/10 text-gold';
      case 'invited': return 'bg-blue-100 text-blue-800';
      case 'activated': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'VIP Executive': return 'bg-purple-100 text-purple-800';
      case 'IMO Executive': return 'bg-gold/10 text-gold';
      case 'Founding Agent': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const inviteTemplates = {
    email: {
      subject: "Founding Invitation: Insurance & Annuity Advisor on Family Office Marketplace™",
      body: `Hi [Name],

You've been selected as a Founding Insurance & Annuity Advisor for our new Family Office Marketplace™. Join other elite professionals offering best-in-class coverage to high-net-worth families—your VIP profile is ready.

VIP Benefits:
• Founding badge for premium marketplace positioning
• Instant visibility to family office clients
• Automated compliance/CE reminders
• Dedicated IMO/FMO integration for streamlined product management

[Claim My Profile Now] (magic-link)

Best,
Tony Gomes
Co-Founder, Boutique Family Office™`
    },
    linkedin: `Hi [Name],

You're invited as a founding Insurance Advisor/IMO on our Family Office Marketplace—direct access to HNW families, compliance automation, and VIP status. 

Your expertise in [Specialty] would be invaluable to our elite family community. Interested in joining our founding cohort?`,
    sms: `Hi [Name], you're invited as a founding Insurance Advisor on our platform. VIP badge, premium family access—activate: [magic-link]`
  };

  const trainingModules = [
    {
      title: "Insurance Dashboard & Compliance Setup",
      description: "Configure your profile, upload licenses, and set up compliance tracking",
      icon: Shield,
      duration: "20 min"
    },
    {
      title: "Agent Downline & IMO Management",
      description: "Bulk import agents, manage hierarchies, and track performance",
      icon: Users,
      duration: "25 min"
    },
    {
      title: "Carrier Integration & Product Catalog",
      description: "Connect with carriers, manage appointments, and track commissions",
      icon: Building,
      duration: "30 min"
    },
    {
      title: "Family Office Client Referrals",
      description: "Navigate the referral system and client matching process",
      icon: TrendingUp,
      duration: "18 min"
    },
    {
      title: "CE Tracking & License Management",
      description: "Automated renewals, CE credits, and compliance monitoring",
      icon: Clock,
      duration: "15 min"
    },
    {
      title: "Analytics & Performance Tracking",
      description: "Commission tracking, pipeline management, and goal setting",
      icon: BarChart3,
      duration: "22 min"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Insurance Agents & IMO/FMO VIP Launch Kit</h1>
          <p className="text-muted-foreground">
            Onboarding tools for insurance professionals and agency executives
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{agentTargets.length}</div>
          <div className="text-sm text-muted-foreground">Target Agents</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{invitesSent}</div>
          <div className="text-sm text-muted-foreground">Invites Sent</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">3</div>
          <div className="text-sm text-muted-foreground">VIP Activated</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gold">94%</div>
          <div className="text-sm text-muted-foreground">Response Rate</div>
        </Card>
      </div>

      <Tabs defaultValue="bulk-manager" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="bulk-manager">Bulk Manager</TabsTrigger>
          <TabsTrigger value="invite-templates">Invite Templates</TabsTrigger>
          <TabsTrigger value="vip-wall">VIP Wall</TabsTrigger>
          <TabsTrigger value="training">Training Center</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="bulk-manager">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-600" />
                Insurance Agent Bulk Manager
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="w-4 h-4 mr-2" />
                  Export List
                </Button>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Import CSV
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 mb-4">
                <Button
                  onClick={() => handleBulkInvite('email')}
                  disabled={selectedAgents.length === 0}
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Send Email Invites ({selectedAgents.length})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleBulkInvite('linkedin')}
                  disabled={selectedAgents.length === 0}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  LinkedIn Messages ({selectedAgents.length})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleBulkInvite('sms')}
                  disabled={selectedAgents.length === 0}
                  className="flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  SMS Invites ({selectedAgents.length})
                </Button>
              </div>

              <div className="space-y-3">
                {agentTargets.map((agent) => (
                  <Card key={agent.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedAgents.includes(agent.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAgents([...selectedAgents, agent.id]);
                            } else {
                              setSelectedAgents(selectedAgents.filter(id => id !== agent.id));
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold">{agent.name}</div>
                            <div className="text-sm text-muted-foreground">{agent.role} at {agent.organization}</div>
                            <div className="text-xs text-muted-foreground">
                              Specialty: {agent.specialty} | Licenses: {agent.licenses.join(', ')}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getTierColor(agent.tier)}>
                          {agent.tier}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(agent.status)}>
                          {agent.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="invite-templates">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Email Template
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Subject Line:</label>
                  <div className="p-3 bg-muted rounded-lg text-sm mt-1">
                    {inviteTemplates.email.subject}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Email Body:</label>
                  <div className="p-3 bg-muted rounded-lg text-sm mt-1 max-h-48 overflow-y-auto whitespace-pre-line">
                    {inviteTemplates.email.body}
                  </div>
                </div>
                <Button className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Use Email Template
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                LinkedIn Message
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Message:</label>
                  <div className="p-3 bg-muted rounded-lg text-sm mt-1 whitespace-pre-line">
                    {inviteTemplates.linkedin}
                  </div>
                </div>
                <Button className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Use LinkedIn Template
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                SMS Template
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Message:</label>
                  <div className="p-3 bg-muted rounded-lg text-sm mt-1 whitespace-pre-line">
                    {inviteTemplates.sms}
                  </div>
                </div>
                <Button className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Use SMS Template
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vip-wall">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Award className="h-6 w-6 text-gold" />
              Insurance Professionals VIP Wall
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agentTargets.filter(agent => agent.status === 'priority' || agent.status === 'reserved').map((agent) => (
                <Card key={agent.id} className="p-6 border-2 border-blue-200 bg-gradient-to-br from-background to-blue-50">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground">{agent.role}</p>
                      <p className="text-sm font-medium text-blue-600">{agent.organization}</p>
                    </div>
                    <Badge variant="outline" className={getTierColor(agent.tier)}>
                      {agent.tier}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      Specialty: {agent.specialty}
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {agent.licenses.map(license => (
                        <Badge key={license} variant="outline" className="text-xs">
                          {license}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Insurance Professional Training Center
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trainingModules.map((module, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <module.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{module.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{module.duration}</Badge>
                        <Button size="sm">Start Module</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Engagement Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Email Open Rate</span>
                  <span className="font-semibold">94%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Profile Completion Rate</span>
                  <span className="font-semibold">87%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">License Upload Rate</span>
                  <span className="font-semibold">92%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Client Referral Rate</span>
                  <span className="font-semibold">76%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Agent Performance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Top Performer</span>
                  <span className="font-semibold">Rodriguez Insurance</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Most Referrals</span>
                  <span className="font-semibold">47 this month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Premium/Agent</span>
                  <span className="font-semibold">$142,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Compliance Rate</span>
                  <span className="font-semibold">98%</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};