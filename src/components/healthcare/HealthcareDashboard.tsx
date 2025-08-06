import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Stethoscope, 
  Users, 
  FileText, 
  Calendar,
  Heart,
  TrendingUp,
  Upload,
  Mail,
  Shield,
  Clock,
  CheckCircle,
  Bell,
  Globe,
  Building2,
  UserPlus,
  Settings,
  BarChart3,
  Archive,
  Video,
  MessageSquare,
  Activity,
  Brain,
  Clipboard,
  Award,
  Phone,
  MapPin,
  Database,
  Lock,
  Users2,
  Target,
  Briefcase
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const HealthcareDashboard = () => {
  const { userProfile } = useUser();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Family Office Health Network
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {userProfile?.displayName}! Empowering families to live healthier, longer.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Award className="h-3 w-3 mr-1" />
            BFO Health Partner
          </Badge>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Patient
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Patients</p>
                <p className="text-2xl font-bold">127</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8 new this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Family Members</p>
                <p className="text-2xl font-bold">348</p>
              </div>
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15 new this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Consultations</p>
                <p className="text-2xl font-bold">89</p>
              </div>
              <Video className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Health Score Avg</p>
                <p className="text-2xl font-bold">8.4</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.3 improvement
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="health-vault">Health Vault</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { icon: UserPlus, text: "New patient Sarah Thompson enrolled", time: "1 hour ago", type: "success" },
                    { icon: Video, text: "Telehealth consult completed with John Davis", time: "3 hours ago", type: "info" },
                    { icon: FileText, text: "Health program assessment submitted", time: "5 hours ago", type: "info" },
                    { icon: Heart, text: "Family health score improved to 8.6", time: "1 day ago", type: "success" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20">
                      <activity.icon className={`h-4 w-4 ${
                        activity.type === 'success' ? 'text-green-600' :
                        activity.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.text}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                  <UserPlus className="h-6 w-6" />
                  <span className="text-sm">Add Patient</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Video className="h-6 w-6" />
                  <span className="text-sm">Schedule Consult</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Upload className="h-6 w-6" />
                  <span className="text-sm">Upload Records</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm">Health Analytics</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Patient Health Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Patient Health Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { category: "Preventive Care", count: 45, status: "Up to date", color: "text-green-600" },
                  { category: "Chronic Conditions", count: 23, status: "Managed", color: "text-blue-600" },
                  { category: "Wellness Programs", count: 78, status: "Active", color: "text-purple-600" }
                ].map((category, index) => (
                  <Card key={index} className="p-4 bg-secondary/20">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{category.category}</h4>
                      <span className={`text-sm font-medium ${category.color}`}>{category.status}</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">{category.count}</div>
                    <p className="text-xs text-muted-foreground">Patients in this category</p>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Patient Management</h3>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Patient
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  { name: "Sarah Thompson", age: 52, condition: "Preventive Care", status: "Active", lastVisit: "2024-01-15", familyMembers: 4 },
                  { name: "John Davis", age: 67, condition: "Diabetes Management", status: "Active", lastVisit: "2024-01-10", familyMembers: 2 },
                  { name: "Maria Rodriguez", age: 43, condition: "Wellness Coaching", status: "Active", lastVisit: "2024-01-08", familyMembers: 3 }
                ].map((patient, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Stethoscope className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{patient.name}</h4>
                        <p className="text-sm text-muted-foreground">Age {patient.age} • {patient.condition}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Family</p>
                        <p className="font-semibold">{patient.familyMembers} members</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Last Visit</p>
                        <p className="font-semibold">{patient.lastVisit}</p>
                      </div>
                      <Badge variant="default">
                        {patient.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health-vault" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Health Vault & Records</h3>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Records
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Document Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: "Lab Results", count: 156, icon: Clipboard, recent: "2 new today" },
                    { category: "Imaging", count: 89, icon: Brain, recent: "1 new today" },
                    { category: "Prescriptions", count: 234, icon: FileText, recent: "5 new today" },
                    { category: "Care Plans", count: 67, icon: Heart, recent: "3 updated" }
                  ].map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <category.icon className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">{category.category}</p>
                          <p className="text-sm text-muted-foreground">{category.count} documents</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{category.recent}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">HIPAA Compliant</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <span className="font-medium">End-to-End Encryption</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users2 className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Family Permissions</span>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">Managed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="programs" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Health Programs & Services</h3>
            <Button>
              <Target className="h-4 w-4 mr-2" />
              Create Program
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                title: "Longevity Wellness", 
                description: "Comprehensive health optimization for high-net-worth families",
                participants: 23,
                icon: Heart,
                status: "Active"
              },
              { 
                title: "Executive Health", 
                description: "Tailored health programs for busy executives and entrepreneurs",
                participants: 18,
                icon: Briefcase,
                status: "Active"
              },
              { 
                title: "Family Mental Health", 
                description: "Mental wellness support for entire family units",
                participants: 31,
                icon: Brain,
                status: "Active"
              },
              { 
                title: "Preventive Care Plus", 
                description: "Advanced preventive care with genetic testing and biomarkers",
                participants: 15,
                icon: Shield,
                status: "New"
              }
            ].map((program, index) => (
              <Card key={index} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <program.icon className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-semibold">{program.title}</h4>
                      <Badge variant={program.status === 'New' ? 'default' : 'secondary'}>
                        {program.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{program.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{program.participants} participants</span>
                    <Button size="sm" variant="outline">Manage</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Compliance & Certifications</h3>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Update Credentials
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Professional Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { cert: "Medical License (CA)", expiry: "2025-12-31", status: "active" },
                    { cert: "Board Certification - Internal Medicine", expiry: "2026-06-30", status: "active" },
                    { cert: "Telehealth Certification", expiry: "2024-08-15", status: "expiring" },
                    { cert: "HIPAA Compliance Training", expiry: "2024-12-31", status: "active" }
                  ].map((cert, index) => (
                    <div key={index} className={`p-3 rounded-lg border-l-4 ${
                      cert.status === 'expiring' ? 'border-yellow-500 bg-yellow-50' : 'border-green-500 bg-green-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{cert.cert}</p>
                          <p className="text-sm text-muted-foreground">Expires: {cert.expiry}</p>
                        </div>
                        <Badge variant={cert.status === 'expiring' ? 'secondary' : 'default'}>
                          {cert.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Compliance Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { alert: "Telehealth certification expires in 45 days", priority: "medium" },
                    { alert: "Annual compliance training due", priority: "low" },
                    { alert: "Patient consent forms need review", priority: "low" }
                  ].map((alert, index) => (
                    <div key={index} className={`p-3 rounded-lg ${
                      alert.priority === 'high' ? 'bg-red-50 border border-red-200' :
                      alert.priority === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                      'bg-blue-50 border border-blue-200'
                    }`}>
                      <p className="text-sm font-medium">{alert.alert}</p>
                      <Badge variant="secondary" className="mt-1">
                        {alert.priority} priority
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">BFO Health Marketplace</h3>
            <Button>
              <Globe className="h-4 w-4 mr-2" />
              Explore All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users2 className="h-8 w-8 text-primary" />
                  <h4 className="text-xl font-semibold">Collaborate with Advisors</h4>
                </div>
                <p className="text-muted-foreground">
                  Partner with financial advisors to provide holistic wealth and health planning for families.
                </p>
                <Button className="w-full">
                  Find Partners
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-secondary/20 to-primary/10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-primary" />
                  <h4 className="text-xl font-semibold">Offer Health Programs</h4>
                </div>
                <p className="text-muted-foreground">
                  Create and market specialized health programs to the BFO family office network.
                </p>
                <Button variant="outline" className="w-full">
                  Create Program
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-accent/10 to-secondary/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-8 w-8 text-primary" />
                  <h4 className="text-xl font-semibold">Health Community</h4>
                </div>
                <p className="text-muted-foreground">
                  Join discussions with other healthcare professionals serving high-net-worth families.
                </p>
                <Button variant="outline" className="w-full">
                  Join Community
                </Button>
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Professional Network</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Estate Planning Attorneys", description: "Collaborate on health directives and estate planning", partners: 23 },
                  { title: "Financial Advisors", description: "Integrated health and wealth planning", partners: 67 },
                  { title: "Insurance Specialists", description: "Health and life insurance coordination", partners: 34 },
                  { title: "Tax Professionals", description: "Health savings and tax planning strategies", partners: 45 }
                ].map((network, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-semibold">{network.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{network.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-primary">{network.partners} professionals</span>
                      <Button size="sm" variant="outline">Connect</Button>
                    </div>
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