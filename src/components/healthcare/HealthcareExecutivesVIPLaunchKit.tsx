import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Users, Calendar, FileText, BarChart3, Mail, MessageSquare, Phone, Upload, Download, Award, Stethoscope, Brain, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const HealthcareExecutivesVIPLaunchKit: React.FC = () => {
  const [selectedClinics, setSelectedClinics] = useState<string[]>([]);
  const [invitesSent, setInvitesSent] = useState(0);

  const handleBulkInvite = (method: 'email' | 'linkedin' | 'sms') => {
    setInvitesSent(prev => prev + selectedClinics.length);
    toast({
      title: "VIP Invites Sent!",
      description: `Sent ${selectedClinics.length} invitations via ${method} to healthcare executives`,
    });
    setSelectedClinics([]);
  };

  const handleExportData = () => {
    toast({
      title: "Data Exported",
      description: "Healthcare executives contact list exported successfully",
    });
  };

  const clinicTargets = [
    {
      id: '1',
      name: 'Dr. Peter Diamandis',
      organization: 'Fountain Life',
      role: 'Co-Founder & CEO',
      specialty: 'Longevity Medicine',
      email: 'peter@fountainlife.com',
      linkedin: 'linkedin.com/in/peterdiamandis',
      status: 'priority',
      tier: 'VIP Visionary'
    },
    {
      id: '2',
      name: 'Dr. David Sinclair',
      organization: 'Sinclair Lab (Harvard)',
      role: 'Professor of Genetics',
      specialty: 'Aging Research',
      email: 'david_sinclair@harvard.edu',
      linkedin: 'linkedin.com/in/davidsinclair',
      status: 'priority',
      tier: 'VIP Visionary'
    },
    {
      id: '3',
      name: 'Dr. Bill Kapp',
      organization: 'Fountain Life',
      role: 'Chief Medical Officer',
      specialty: 'Precision Medicine',
      email: 'bill@fountainlife.com',
      linkedin: 'linkedin.com/in/billkapp',
      status: 'reserved',
      tier: 'Founding Partner'
    },
    {
      id: '4',
      name: 'Dr. Mark Hyman',
      organization: 'Cleveland Clinic',
      role: 'Director of Functional Medicine',
      specialty: 'Functional Medicine',
      email: 'mark@hyman.com',
      linkedin: 'linkedin.com/in/markhyman',
      status: 'invited',
      tier: 'Healthcare Leader'
    },
    {
      id: '5',
      name: 'Dr. Casey Means',
      organization: 'Levels Health',
      role: 'Co-Founder & CMO',
      specialty: 'Metabolic Health',
      email: 'casey@levelshealth.com',
      linkedin: 'linkedin.com/in/caseymeans',
      status: 'pending',
      tier: 'Healthcare Innovator'
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
      case 'VIP Visionary': return 'bg-purple-100 text-purple-800';
      case 'Founding Partner': return 'bg-gold/10 text-gold';
      case 'Healthcare Leader': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const inviteTemplates = {
    email: {
      subject: "VIP Founding Invitation: Healthcare Innovation Leadership on Family Office Marketplace™",
      body: `Hi [Name],

You've been selected as a Founding Healthcare Innovator for the Boutique Family Office Marketplace™. Join the nation's most progressive longevity clinics and precision medicine experts in bringing proactive healthcare to discerning families.

Your VIP Benefits:
• Early access to our family office healthcare marketplace
• "Founding Clinic" badge and premium positioning
• Direct-to-family referral system and health analytics
• Platform to publish research and insights to high-impact audience
• Featured placement in our Healthcare Innovation Center

[Activate Your VIP Clinic Profile] (magic-link-url)

Welcome to the future of family-centric healthcare.

Best regards,
Tony Gomes
Co-Founder, Boutique Family Office™`
    },
    linkedin: `Hi [Name],

We're reserving your spot as a founding healthcare innovator/clinic for our Family Office Marketplace—longevity clients, advanced analytics, and premium family network await. 

Your expertise in [Specialty] would be invaluable to our elite family community. Interested in joining our founding cohort?`,
    sms: `Hi [Name], Tony Gomes here—reserved you a VIP founding spot for our Family Office Healthcare Marketplace. Spotlight for [Organization], with direct access to elite families seeking next-level health solutions. Activate: [magic-link]`
  };

  const trainingModules = [
    {
      title: "Healthcare Dashboard & Profile Setup",
      description: "Configure clinic profile, team credentials, and service offerings",
      icon: Stethoscope,
      duration: "15 min"
    },
    {
      title: "Appointment & Booking System",
      description: "Set up calendar integration and automated booking workflows",
      icon: Calendar,
      duration: "20 min"
    },
    {
      title: "Research Publication Platform",
      description: "Upload publications, host webinars, and engage with families",
      icon: FileText,
      duration: "25 min"
    },
    {
      title: "Family Referral & Analytics",
      description: "Track patient referrals, outcomes, and engagement metrics",
      icon: BarChart3,
      duration: "18 min"
    },
    {
      title: "Compliance & Privacy Controls",
      description: "HIPAA compliance, data privacy, and security protocols",
      icon: Shield,
      duration: "22 min"
    },
    {
      title: "Advanced Health Analytics",
      description: "Leverage health data insights and family health trends",
      icon: Brain,
      duration: "30 min"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="h-8 w-8 text-emerald-600" />
        <div>
          <h1 className="text-3xl font-bold">Healthcare Executives & Clinics VIP Launch Kit</h1>
          <p className="text-muted-foreground">
            Onboarding tools for longevity clinics and precision medicine leaders
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{clinicTargets.length}</div>
          <div className="text-sm text-muted-foreground">Target Clinics</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{invitesSent}</div>
          <div className="text-sm text-muted-foreground">Invites Sent</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">2</div>
          <div className="text-sm text-muted-foreground">VIP Activated</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">89%</div>
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
                <Users className="h-6 w-6 text-emerald-600" />
                Healthcare Executive Bulk Manager
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
                  disabled={selectedClinics.length === 0}
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Send Email Invites ({selectedClinics.length})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleBulkInvite('linkedin')}
                  disabled={selectedClinics.length === 0}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  LinkedIn Messages ({selectedClinics.length})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleBulkInvite('sms')}
                  disabled={selectedClinics.length === 0}
                  className="flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  SMS Invites ({selectedClinics.length})
                </Button>
              </div>

              <div className="space-y-3">
                {clinicTargets.map((clinic) => (
                  <Card key={clinic.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedClinics.includes(clinic.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedClinics([...selectedClinics, clinic.id]);
                            } else {
                              setSelectedClinics(selectedClinics.filter(id => id !== clinic.id));
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                            <Heart className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold">{clinic.name}</div>
                            <div className="text-sm text-muted-foreground">{clinic.role} at {clinic.organization}</div>
                            <div className="text-xs text-muted-foreground">{clinic.specialty}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getTierColor(clinic.tier)}>
                          {clinic.tier}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(clinic.status)}>
                          {clinic.status}
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
              Healthcare Executives VIP Wall
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clinicTargets.filter(clinic => clinic.status === 'priority' || clinic.status === 'reserved').map((clinic) => (
                <Card key={clinic.id} className="p-6 border-2 border-gold/20 bg-gradient-to-br from-background to-gold/5">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{clinic.name}</h3>
                      <p className="text-sm text-muted-foreground">{clinic.role}</p>
                      <p className="text-sm font-medium text-emerald-600">{clinic.organization}</p>
                    </div>
                    <Badge variant="outline" className={getTierColor(clinic.tier)}>
                      {clinic.tier}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      Specialty: {clinic.specialty}
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
              Healthcare Executive Training Center
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
                  <span className="font-semibold">92%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Profile Completion Rate</span>
                  <span className="font-semibold">78%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">First Booking Rate</span>
                  <span className="font-semibold">84%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Family Satisfaction</span>
                  <span className="font-semibold">9.1/10</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Clinic Performance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Top Performer</span>
                  <span className="font-semibold">Fountain Life</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Most Bookings</span>
                  <span className="font-semibold">127 this month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Revenue/Clinic</span>
                  <span className="font-semibold">$84,300</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Referral Success Rate</span>
                  <span className="font-semibold">76%</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};