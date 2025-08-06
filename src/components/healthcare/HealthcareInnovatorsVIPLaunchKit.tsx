import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Users, 
  FileText, 
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
  Microscope,
  Brain,
  Activity,
  Zap,
  Shield,
  Star,
  Building,
  UserPlus,
  Target,
  Globe,
  BookOpen,
  Video
} from 'lucide-react';

export const HealthcareInnovatorsVIPLaunchKit: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [invitesSent, setInvitesSent] = useState(0);
  const [facilitiesOnboarded, setFacilitiesOnboarded] = useState(0);

  const stats = [
    { label: 'Partner Clinics', value: '12', icon: Building, color: 'text-blue-600' },
    { label: 'Family Referrals', value: '89', icon: Users, color: 'text-green-600' },
    { label: 'Revenue Impact', value: '$2.4M', icon: Target, color: 'text-gold' },
    { label: 'Health Score™', value: '96%', icon: Activity, color: 'text-emerald-600' }
  ];

  const visionaryLeaders = [
    { name: 'Tony Robbins', company: 'Robbins Research', status: 'invited', focus: 'Peak Performance' },
    { name: 'Peter Diamandis', company: 'XPRIZE Foundation', status: 'activated', focus: 'Longevity Tech' },
    { name: 'David Sinclair', company: 'Harvard Medical', status: 'reserved', focus: 'Aging Research' },
    { name: 'Fountain Life', company: 'Fountain Life', status: 'activated', focus: 'Precision Medicine' }
  ];

  const diagnosticServices = [
    { name: 'Liquid Biopsy', provider: 'Fountain Life', price: '$2,500', status: 'active' },
    { name: 'Epigenetic Analysis', provider: 'Sinclair Lab', price: '$1,800', status: 'active' },
    { name: 'AI Cancer Screening', provider: 'Multiple', price: '$3,200', status: 'featured' },
    { name: 'Advanced Brain Imaging', provider: 'Specialized Centers', price: '$4,500', status: 'active' }
  ];

  const inviteTemplates = {
    visionary: {
      subject: "VIP Founding Invitation: Transform Family Health with Boutique Family Office™",
      body: `Hi [Name],

You're receiving this invitation as a global leader in longevity and proactive healthcare.
We're building a revolutionary Family Office Marketplace—integrating cutting-edge health solutions directly into the world's leading wealth & wellness platform.

Why You?
• Visionary founders (Tony, Peter, David) have inspired the healthspan movement.
• Your work is helping families control their destiny through science, data, and personalized medicine.

Your VIP Access Includes:
• Reserved space for Fountain Life, Sinclair Lab, or your clinic—custom co-branded profile
• "Founding Innovator" badge
• Seamless referral workflow for high-net-worth families
• Direct integration for advanced testing, screening, and health advisory tools
• Opportunities for events, webinars, and featured guides

[Activate Your VIP Profile] (magic-link-url)

Let's empower families to live healthier, longer—and make proactive health the new normal.

With deep respect,
Tony Gomes
Co-Founder, Boutique Family Office™`
    },
    linkedin: "Hi [Name], We're launching a global family office platform to connect the world's top families with breakthrough longevity & healthspan solutions. Reserved a VIP founder space for [Fountain Life/Sinclair Lab]. Would love to include you as a launch partner—interested?",
    sms: "Hi [Name], Tony Gomes here—reserved you a VIP founder spot for our Family Office Health Marketplace. Spotlight for Fountain Life/Sinclair Labs, with direct access to top families. Activate: [magic-link]"
  };

  const trainingModules = [
    { title: 'Healthcare Profile & Brand Setup', duration: '20 min', completed: true },
    { title: 'Advanced Service Integration', duration: '25 min', completed: true },
    { title: 'Family Referral Network Access', duration: '30 min', completed: false },
    { title: 'Event & Webinar Hosting', duration: '20 min', completed: false },
    { title: 'Research Publication Tools', duration: '15 min', completed: false },
    { title: 'Privacy & HIPAA Compliance', duration: '25 min', completed: false },
    { title: 'Analytics & Impact Tracking', duration: '20 min', completed: false },
    { title: 'VIP Marketplace Engagement', duration: '15 min', completed: false }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-emerald-600" />
          <div>
            <h1 className="text-3xl font-bold">Healthcare Innovators VIP Launch Kit</h1>
            <p className="text-muted-foreground">
              Complete toolkit for longevity centers and healthcare visionaries
            </p>
          </div>
        </div>
        <Badge className="bg-gold/10 text-gold border-gold/20">
          Founding Innovator
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
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visionaries">Visionaries</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="invites">Invitations</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="families">Families</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Clinic & Innovation Center Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Facility Name</label>
                  <Input placeholder="Enter facility or research center name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Specializations</label>
                  <div className="flex flex-wrap gap-2">
                    {['Longevity Research', 'Cancer Screening', 'Epigenetics', 'AI Diagnostics', 'Precision Medicine'].map((spec) => (
                      <Badge key={spec} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Research Focus</label>
                  <Textarea placeholder="Describe your breakthrough research and innovations" rows={3} />
                </div>
                <Button className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Facility Branding
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Founding Innovator Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">VIP Marketplace Placement</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Co-branded Profile Page</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Direct Family Access</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Event & Webinar Platform</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Research Publication Tools</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-gold/10 border border-gold/20 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Star className="h-5 w-5 text-gold mr-2" />
                    <h4 className="font-semibold">Global Impact Status</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Reserved placement with global visionaries transforming healthcare
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="visionaries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Visionary Leaders & Pioneer Network
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {visionaryLeaders.map((leader, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center text-white font-bold">
                        {leader.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium">{leader.name}</div>
                        <div className="text-sm text-muted-foreground">{leader.company}</div>
                        <div className="text-xs text-blue-600">{leader.focus}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge 
                        variant="outline" 
                        className={
                          leader.status === 'activated' ? 'bg-green-100 text-green-800' :
                          leader.status === 'invited' ? 'bg-blue-100 text-blue-800' :
                          'bg-gold/10 text-gold border-gold/20'
                        }
                      >
                        {leader.status === 'activated' ? 'Active' : 
                         leader.status === 'invited' ? 'Invited' : 'Reserved'}
                      </Badge>
                      <Button size="sm" variant="outline">
                        {leader.status === 'activated' ? 'View Profile' : 'Send Invite'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-20 flex-col">
                  <Globe className="h-6 w-6 mb-2" />
                  LinkedIn Outreach
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Mail className="h-6 w-6 mb-2" />
                  Personal Email
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Video className="h-6 w-6 mb-2" />
                  Podcast Invite
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Microscope className="h-5 w-5" />
                Advanced Diagnostic Services Directory
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {diagnosticServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        {service.name.includes('Cancer') ? <Shield className="h-5 w-5 text-blue-600" /> :
                         service.name.includes('Epigenetic') ? <Activity className="h-5 w-5 text-purple-600" /> :
                         service.name.includes('Brain') ? <Brain className="h-5 w-5 text-green-600" /> :
                         <Microscope className="h-5 w-5 text-blue-600" />}
                      </div>
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-muted-foreground">{service.provider}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold text-lg">{service.price}</div>
                        <div className="text-xs text-muted-foreground">per test</div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          service.status === 'featured' ? 'bg-gold/10 text-gold border-gold/20' :
                          'bg-green-100 text-green-800'
                        }
                      >
                        {service.status === 'featured' ? 'Featured' : 'Active'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Service Categories</h4>
                  <div className="space-y-2 text-sm">
                    <div>• Cancer & Early Detection</div>
                    <div>• Longevity & Anti-Aging</div>
                    <div>• Precision Medicine</div>
                    <div>• AI-Powered Diagnostics</div>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Integration Status</h4>
                  <Progress value={85} className="mb-2" />
                  <p className="text-sm text-muted-foreground">85% of services fully integrated</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invites" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Visionary Leader Invitation Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject Line</label>
                  <Input value={inviteTemplates.visionary.subject} readOnly />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Body</label>
                  <Textarea 
                    value={inviteTemplates.visionary.body} 
                    rows={10} 
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
                    Send to Visionaries
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Quick Outreach Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">LinkedIn Message</label>
                  <Textarea 
                    value={inviteTemplates.linkedin} 
                    rows={4} 
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
                
                <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Invitation Stats</h4>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-emerald-600">{invitesSent}</div>
                      <div className="text-sm text-muted-foreground">Invites Sent</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{facilitiesOnboarded}</div>
                      <div className="text-sm text-muted-foreground">Facilities Active</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Events & Thought Leadership Platform
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-24 flex-col">
                  <Video className="h-8 w-8 mb-2" />
                  Host Webinar
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <BookOpen className="h-8 w-8 mb-2" />
                  Publish Research
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Users className="h-8 w-8 mb-2" />
                  Schedule AMA
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4">Upcoming Events</h4>
                <div className="space-y-3">
                  {[
                    { title: 'Longevity Science Breakthrough Demo', date: '2024-02-15', type: 'Webinar', attendees: 150 },
                    { title: 'Family Health Strategy AMA', date: '2024-02-22', type: 'Q&A', attendees: 89 },
                    { title: 'Precision Medicine Panel', date: '2024-03-01', type: 'Panel', attendees: 200 }
                  ].map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground">{event.date} • {event.type}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm">{event.attendees} attendees</span>
                        <Button size="sm" variant="outline">Manage</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="families" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  High-Net-Worth Family Network
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">42</div>
                    <div className="text-sm text-muted-foreground">Active Families</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">89%</div>
                    <div className="text-sm text-muted-foreground">Satisfaction</div>
                  </div>
                  <div className="bg-gold/10 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-gold">$2.4M</div>
                    <div className="text-sm text-muted-foreground">Health Spend</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Consultation Bookings</span>
                    <span className="font-semibold">156 this quarter</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Follow-up Appointments</span>
                    <span className="font-semibold">89 scheduled</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Preventive Screenings</span>
                    <span className="font-semibold">234 completed</span>
                  </div>
                </div>

                <Button className="w-full">
                  <Target className="h-4 w-4 mr-2" />
                  Invite New Families
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">HIPAA Compliance</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">End-to-End Encryption</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Family Opt-in Protocols</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Audit Trail Logging</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Data Access Controls</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>• Role-based access permissions</div>
                    <div>• Time-limited data sharing</div>
                    <div>• Family consent management</div>
                    <div>• Automatic data anonymization</div>
                  </div>
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
                  Impact & Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">96%</div>
                    <div className="text-sm text-muted-foreground">Health Score™</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">234</div>
                    <div className="text-sm text-muted-foreground">Lives Enhanced</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Family Engagement Rate</span>
                    <span className="font-semibold">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Health Outcome Improvement</span>
                    <span className="font-semibold">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Preventive Care Adoption</span>
                    <span className="font-semibold">91%</span>
                  </div>
                  <Progress value={91} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Revenue & Growth Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { metric: 'Monthly Consultations', value: 156, trend: '+23%' },
                    { metric: 'Diagnostic Revenue', value: '$890K', trend: '+45%' },
                    { metric: 'Family Retention', value: '95%', trend: '+12%' },
                    { metric: 'Referral Growth', value: '+67%', trend: '+34%' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <span className="font-medium">{item.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{item.value}</span>
                        <Badge className="bg-green-100 text-green-800">{item.trend}</Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gold/10 border border-gold/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Quarterly Highlights</h4>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-gold">$2.4M</div>
                      <div className="text-sm text-muted-foreground">Total Impact</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-emerald-600">89</div>
                      <div className="text-sm text-muted-foreground">Families Served</div>
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
                <BookOpen className="h-5 w-5" />
                Healthcare Innovator Training Hub
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

              <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Training Progress</h4>
                <Progress value={25} className="mb-2" />
                <p className="text-sm text-muted-foreground">2 of 8 modules completed</p>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Training Guide
                </Button>
                <Button variant="outline" className="flex-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Onboarding
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};