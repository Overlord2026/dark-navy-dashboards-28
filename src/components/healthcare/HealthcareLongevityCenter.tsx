import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Heart, 
  Users, 
  Activity, 
  BookOpen, 
  Shield, 
  MessageCircle,
  Calendar,
  Plus,
  Upload,
  ExternalLink,
  Stethoscope,
  Brain,
  Target,
  Users2,
  FileText,
  Video,
  Award
} from 'lucide-react';

type Persona = 'client' | 'family' | 'advisor' | 'consultant' | 'influencer';

const HealthcareLongevityCenter = () => {
  const [activePersona, setActivePersona] = useState<Persona>('client');
  const [activeTab, setActiveTab] = useState('dashboard');

  const personaOptions = [
    { value: 'client', label: 'Client', icon: Heart },
    { value: 'family', label: 'Family Member', icon: Users2 },
    { value: 'advisor', label: 'Advisor', icon: Users },
    { value: 'consultant', label: 'Consultant', icon: Brain },
    { value: 'influencer', label: 'Influencer', icon: Award },
  ];

  const getPersonaColor = (persona: Persona) => {
    switch (persona) {
      case 'client': return 'bg-blue-500';
      case 'family': return 'bg-green-500';
      case 'advisor': return 'bg-purple-500';
      case 'consultant': return 'bg-orange-500';
      case 'influencer': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Heart className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Healthcare & Longevity Center</h1>
              </div>
            </div>
            
            {/* Persona Switcher */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">View as:</span>
              <Select value={activePersona} onValueChange={(value) => setActivePersona(value as Persona)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {personaOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <Badge className={getPersonaColor(activePersona)}>
                {personaOptions.find(p => p.value === activePersona)?.label}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border">
        <div className="container mx-auto px-6 py-12 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Proactive Health = Proactive Wealth
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comprehensive healthcare planning for lasting prosperity and longevity
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="gap-2">
              <Calendar className="h-5 w-5" />
              Book a Consultation
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <BookOpen className="h-5 w-5" />
              Explore Resources
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="dashboard" className="gap-2">
              <Activity className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="care-team" className="gap-2">
              <Stethoscope className="h-4 w-4" />
              My Care Team
            </TabsTrigger>
            <TabsTrigger value="longevity" className="gap-2">
              <Brain className="h-4 w-4" />
              Longevity Programs
            </TabsTrigger>
            <TabsTrigger value="guides" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Health Guides
            </TabsTrigger>
            <TabsTrigger value="insurance" className="gap-2">
              <Shield className="h-4 w-4" />
              Insurance
            </TabsTrigger>
            <TabsTrigger value="community" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Community
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Health Snapshot
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Blood Pressure</span>
                      <Badge variant="secondary">120/80</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Cholesterol</span>
                      <Badge variant="secondary">180 mg/dL</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>BMI</span>
                      <Badge variant="secondary">22.5</Badge>
                    </div>
                    <Button className="w-full gap-2">
                      <Target className="h-4 w-4" />
                      Set Health Goals
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users2 className="h-5 w-5 text-green-500" />
                    Family Health Tree
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Track hereditary health patterns
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">Cardiovascular: 2 family members</div>
                      <div className="text-sm">Diabetes: 1 family member</div>
                    </div>
                    <Button variant="outline" className="w-full gap-2">
                      <Plus className="h-4 w-4" />
                      Add Family Member
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    Insurance Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Health Insurance</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Life Insurance</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Long-term Care</span>
                      <Badge variant="secondary">Review Needed</Badge>
                    </div>
                    <Button variant="outline" className="w-full gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Review Coverage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-20 flex-col gap-2">
                    <Calendar className="h-6 w-6" />
                    Book Annual Checkup
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Activity className="h-6 w-6" />
                    Connect Wearable Device
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    Complete Risk Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Care Team Tab */}
          <TabsContent value="care-team" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">My Care Team</h3>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Provider
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dr. Sarah Johnson</CardTitle>
                  <p className="text-muted-foreground">Primary Care Physician</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">Last visit: March 15, 2024</div>
                    <div className="text-sm">Next appointment: June 15, 2024</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Message</Button>
                      <Button size="sm" variant="outline">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dr. Michael Chen</CardTitle>
                  <p className="text-muted-foreground">Cardiologist</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">Last visit: February 20, 2024</div>
                    <div className="text-sm">Next appointment: August 20, 2024</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Message</Button>
                      <Button size="sm" variant="outline">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center h-40 text-center">
                  <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Add a new healthcare provider</p>
                  <Button>Invite Provider</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Longevity Programs Tab */}
          <TabsContent value="longevity" className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Evidence-Based Longevity Programs</h3>
              <p className="text-muted-foreground">Curated programs from leading longevity experts</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg"></div>
                <CardHeader>
                  <CardTitle>Fountain Life</CardTitle>
                  <p className="text-muted-foreground">Comprehensive health optimization</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">Advanced diagnostics and precision medicine approach to longevity.</p>
                  <Button className="w-full">Request Review</Button>
                </CardContent>
              </Card>

              <Card>
                <div className="h-48 bg-gradient-to-br from-green-500 to-teal-600 rounded-t-lg"></div>
                <CardHeader>
                  <CardTitle>Human Longevity Inc.</CardTitle>
                  <p className="text-muted-foreground">Genomics-based health insights</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">Cutting-edge genomics and AI for personalized health strategies.</p>
                  <Button className="w-full">Request Review</Button>
                </CardContent>
              </Card>

              <Card>
                <div className="h-48 bg-gradient-to-br from-orange-500 to-red-600 rounded-t-lg"></div>
                <CardHeader>
                  <CardTitle>Attia Healthspan</CardTitle>
                  <p className="text-muted-foreground">Science-driven longevity</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">Evidence-based approach to extending healthy lifespan.</p>
                  <Button className="w-full">Request Review</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Health Guides Tab */}
          <TabsContent value="guides" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Featured Books
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-12 h-16 bg-gradient-to-b from-blue-500 to-blue-600 rounded"></div>
                      <div>
                        <h4 className="font-semibold">Outlive</h4>
                        <p className="text-sm text-muted-foreground">by Peter Attia</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-12 h-16 bg-gradient-to-b from-green-500 to-green-600 rounded"></div>
                      <div>
                        <h4 className="font-semibold">Lifespan</h4>
                        <p className="text-sm text-muted-foreground">by David Sinclair</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-12 h-16 bg-gradient-to-b from-orange-500 to-orange-600 rounded"></div>
                      <div>
                        <h4 className="font-semibold">Younger Next Year</h4>
                        <p className="text-sm text-muted-foreground">by Chris Crowley</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Video Library
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-16 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded flex items-center justify-center">
                        <Video className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Huberman Lab</h4>
                        <p className="text-sm text-muted-foreground">Neuroscience protocols</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-16 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded flex items-center justify-center">
                        <Video className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Peter Attia Podcast</h4>
                        <p className="text-sm text-muted-foreground">Longevity insights</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Health Checklists</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-16 flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    Annual Preventive Care
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Activity className="h-6 w-6 mb-2" />
                    Essential Lab Tests
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Heart className="h-6 w-6 mb-2" />
                    Blue Zones Protocol
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insurance Tab */}
          <TabsContent value="insurance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    Medicare Planning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Optimize your Medicare coverage and supplements
                  </p>
                  <Button className="w-full">Get Quote</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-green-500" />
                    Long-Term Care
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Protect against long-term care costs
                  </p>
                  <Button className="w-full">Get Quote</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-orange-500" />
                    Disability Insurance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Income protection for health events
                  </p>
                  <Button className="w-full">Get Quote</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            {activePersona === 'influencer' && (
              <Card className="border-gold bg-gold/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-gold" />
                    Influencer Hub
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Leaderboard</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Dr. Health Expert</span>
                          <Badge>1,250 pts</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Wellness Coach Pro</span>
                          <Badge>1,100 pts</Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Content Analytics</h4>
                      <div className="space-y-2">
                        <div className="text-sm">Your contributions: 45</div>
                        <div className="text-sm">Total views: 12,500</div>
                        <div className="text-sm">Engagement rate: 8.5%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Discussion Threads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">Best Strategies for Healthy Retirement</h4>
                    <p className="text-sm text-muted-foreground">24 replies • Started by WealthAdvisor123</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold">Longevity Supplements: Evidence vs. Hype</h4>
                    <p className="text-sm text-muted-foreground">18 replies • Started by HealthOptimizer</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold">Insurance Gaps in Health Planning</h4>
                    <p className="text-sm text-muted-foreground">12 replies • Started by InsurancePro</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HealthcareLongevityCenter;