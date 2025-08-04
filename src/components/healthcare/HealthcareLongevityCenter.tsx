import React, { useState, useEffect } from 'react';
import OutreachTemplates from './OutreachTemplates';
import { HealthcareNavigation } from './HealthcareNavigation';
import { PersonaWelcomeBanner } from './PersonaWelcomeBanner';
import { HealthcareModals } from './HealthcareModals';
import { ProviderSearch } from './ProviderSearch';
import { HealthcareBreadcrumbs } from './HealthcareBreadcrumbs';
import { useCelebration } from '@/components/ui/confetti';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { getLogoConfig } from '@/assets/logos';
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
  Award,
  Star,
  CheckCircle,
  DollarSign,
  Briefcase,
  X,
  Link,
  Camera,
  Globe,
  TrendingUp,
  Search
} from 'lucide-react';

type Persona = 'client' | 'family' | 'advisor' | 'consultant' | 'influencer' | 'agent';

const HealthcareLongevityCenter = () => {
  const [activePersona, setActivePersona] = useState<Persona>('client');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { celebrating, celebrate, ConfettiComponent } = useCelebration();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    name: '',
    specialty: '',
    bio: '',
    linkedinUrl: '',
    certifications: '',
    experience: ''
  });

  const treeLogoConfig = getLogoConfig('tree');

  const personaOptions = [
    { value: 'client', label: 'Family/Client', icon: Heart, description: 'See care team, health reports, book appointments' },
    { value: 'family', label: 'Family Member', icon: Users2, description: 'Manage family health records and appointments' },
    { value: 'advisor', label: 'Advisor', icon: Users, description: 'View clients\' health summary, share guides, recommend programs' },
    { value: 'consultant', label: 'Healthcare Consultant', icon: Brain, description: 'Set up public profile, offer consultations, upload content' },
    { value: 'influencer', label: 'Thought Leader', icon: Award, description: 'Verified badge, post resources, host AMA events' },
    { value: 'agent', label: 'Healthcare Agent', icon: Shield, description: 'Sell insurance, manage renewals, receive leads' },
  ];

  const getPersonaColor = (persona: Persona) => {
    switch (persona) {
      case 'client': return 'bg-primary';
      case 'family': return 'bg-emerald';
      case 'advisor': return 'bg-navy';
      case 'consultant': return 'bg-emerald';
      case 'influencer': return 'bg-gold text-navy';
      case 'agent': return 'bg-emerald';
      default: return 'bg-muted';
    }
  };

  const handlePersonaChange = (newPersona: Persona) => {
    setIsLoading(true);
    
    // Simulate loading state
    setTimeout(() => {
      setActivePersona(newPersona);
      setIsLoading(false);
      
      if (['consultant', 'influencer', 'agent'].includes(newPersona)) {
        setShowOnboardingModal(true);
      }
      
      toast({
        title: "Persona Updated",
        description: `Now viewing as ${personaOptions.find(p => p.value === newPersona)?.label}`,
      });
    }, 500);
  };

  const handleProfileSetup = () => {
    setShowOnboardingModal(false);
    celebrate(); // Trigger confetti
    toast({
      title: "Profile Complete!",
      description: "Your healthcare professional profile has been successfully set up.",
    });
  };

  const handleCTAClick = (action: string) => {
    switch (action) {
      case 'set-rates':
        setActiveModal('set-rates');
        break;
      case 'complete-profile':
        setShowOnboardingModal(true);
        break;
      case 'find-providers':
        setActiveTab('care-team');
        break;
      default:
        toast({
          title: "Feature Coming Soon",
          description: `${action.replace('-', ' ')} functionality will be available soon.`,
        });
    }
  };

  const handleModalSuccess = (type: string, data: any) => {
    celebrate(); // Trigger confetti for successful actions
    toast({
      title: "Success!",
      description: `${type} has been completed successfully.`,
    });
  };

  const breadcrumbItems = [
    { label: 'Healthcare Center', current: activeTab === 'dashboard' },
    ...(activeTab !== 'dashboard' ? [{ 
      label: activeTab.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '), 
      current: true 
    }] : [])
  ];

  return (
    <div className="min-h-screen bg-background">
      <ConfettiComponent />
      
      {/* Header */}
      <div className="border-b border-border bg-navy">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src={treeLogoConfig.src}
                  alt={treeLogoConfig.alt}
                  className="h-8 w-auto"
                />
                <h1 className="text-2xl font-serif font-bold text-white">
                  Healthcare & Longevity Center
                </h1>
              </div>
            </div>
            
            {/* Persona Switcher */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/70">View as:</span>
              <Select 
                value={activePersona} 
                onValueChange={handlePersonaChange}
                disabled={isLoading}
              >
                <SelectTrigger className="w-48 touch-target bg-card border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
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

      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 py-2">
        <HealthcareBreadcrumbs items={breadcrumbItems} />
      </div>

      {/* Welcome Banner */}
      {showWelcomeBanner && (
        <div className="container mx-auto px-6">
          <PersonaWelcomeBanner 
            persona={activePersona}
            onDismiss={() => setShowWelcomeBanner(false)}
            onCTAClick={handleCTAClick}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <HealthcareNavigation 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            activePersona={activePersona}
            showOutreach={['consultant', 'influencer', 'agent'].includes(activePersona)}
          />

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="relative overflow-hidden">
                {/* Gold tree watermark */}
                <div className="absolute top-2 right-2 opacity-10">
                  <img 
                    src={treeLogoConfig.src}
                    alt=""
                    className="h-8 w-auto"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <Heart className="h-5 w-5 text-emerald" />
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
                    <Button 
                      className="w-full gap-2 touch-target font-display"
                      onClick={() => setActiveModal('book-appointment')}
                    >
                      <Target className="h-4 w-4" />
                      Set Health Goals
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <div className="absolute top-2 right-2 opacity-10">
                  <img 
                    src={treeLogoConfig.src}
                    alt=""
                    className="h-8 w-auto"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <Users2 className="h-5 w-5 text-emerald" />
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
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 touch-target"
                      onClick={() => {
                        celebrate();
                        toast({
                          title: "Family Member Added!",
                          description: "Health history has been updated.",
                        });
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      Add Family Member
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <div className="absolute top-2 right-2 opacity-10">
                  <img 
                    src={treeLogoConfig.src}
                    alt=""
                    className="h-8 w-auto"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <Shield className="h-5 w-5 text-navy" />
                    Insurance Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Health Insurance</span>
                      <Badge className="bg-emerald text-white">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Life Insurance</span>
                      <Badge className="bg-emerald text-white">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Long-term Care</span>
                      <Badge variant="secondary">Review Needed</Badge>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 touch-target"
                      onClick={() => setActiveModal('get-quote')}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Review Coverage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Next Steps */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-4 right-4 opacity-10">
                <img 
                  src={treeLogoConfig.src}
                  alt=""
                  className="h-12 w-auto"
                />
              </div>
              <CardHeader>
                <CardTitle className="font-serif">Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    className="h-20 flex-col gap-2 touch-target font-display"
                    onClick={() => setActiveModal('book-appointment')}
                  >
                    <Calendar className="h-6 w-6" />
                    Book Annual Checkup
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2 touch-target"
                    onClick={() => {
                      celebrate();
                      toast({
                        title: "Device Connected!",
                        description: "Your wearable device has been synced.",
                      });
                    }}
                  >
                    <Activity className="h-6 w-6" />
                    Connect Wearable Device
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2 touch-target"
                    onClick={() => {
                      celebrate();
                      toast({
                        title: "Assessment Complete!",
                        description: "Your health risk assessment has been completed.",
                      });
                    }}
                  >
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
              <h3 className="text-2xl font-serif font-bold">My Care Team</h3>
              <Button 
                className="gap-2 touch-target font-display"
                onClick={() => setActiveTab('care-team-search')}
              >
                <Plus className="h-4 w-4" />
                Add Provider
              </Button>
            </div>

            {activeTab === 'care-team-search' ? (
              <ProviderSearch 
                onInviteProvider={(provider) => {
                  celebrate();
                  toast({
                    title: "Provider Invited!",
                    description: `${provider.name} has been invited to your care team.`,
                  });
                  setActiveTab('care-team');
                }}
                onBookAppointment={(provider) => setActiveModal('book-appointment')}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="relative overflow-hidden">
                  <div className="absolute top-2 right-2 opacity-10">
                    <img 
                      src={treeLogoConfig.src}
                      alt=""
                      className="h-6 w-auto"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg font-serif">Dr. Sarah Johnson</CardTitle>
                    <p className="text-muted-foreground">Primary Care Physician</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">Last visit: March 15, 2024</div>
                      <div className="text-sm">Next appointment: June 15, 2024</div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="touch-target">Message</Button>
                        <Button size="sm" variant="outline" className="touch-target">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                  <div className="absolute top-2 right-2 opacity-10">
                    <img 
                      src={treeLogoConfig.src}
                      alt=""
                      className="h-6 w-auto"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg font-serif">Dr. Michael Chen</CardTitle>
                    <p className="text-muted-foreground">Cardiologist</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">Last visit: February 20, 2024</div>
                      <div className="text-sm">Next appointment: August 20, 2024</div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="touch-target">Message</Button>
                        <Button size="sm" variant="outline" className="touch-target">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-dashed relative overflow-hidden">
                  <div className="absolute top-2 right-2 opacity-5">
                    <img 
                      src={treeLogoConfig.src}
                      alt=""
                      className="h-6 w-auto"
                    />
                  </div>
                  <CardContent className="flex flex-col items-center justify-center h-40 text-center">
                    <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Add a new healthcare provider</p>
                    <Button 
                      className="touch-target font-display"
                      onClick={() => setActiveTab('care-team-search')}
                    >
                      Find & Invite Provider
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Longevity Programs Tab */}
          <TabsContent value="longevity" className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-serif font-bold mb-4">Evidence-Based Longevity Programs</h3>
              <p className="text-muted-foreground">Curated programs from leading longevity experts</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="relative overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-emerald to-emerald/80 rounded-t-lg relative">
                  <div className="absolute top-2 right-2 opacity-20">
                    <img 
                      src={treeLogoConfig.src}
                      alt=""
                      className="h-8 w-auto"
                    />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="font-serif">Fountain Life</CardTitle>
                  <p className="text-muted-foreground">Comprehensive health optimization</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">Advanced diagnostics and precision medicine approach to longevity.</p>
                  <Button 
                    className="w-full touch-target font-display"
                    onClick={() => setActiveModal('request-review')}
                  >
                    Request Review
                  </Button>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-navy to-navy/80 rounded-t-lg relative">
                  <div className="absolute top-2 right-2 opacity-20">
                    <img 
                      src={treeLogoConfig.src}
                      alt=""
                      className="h-8 w-auto"
                    />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="font-serif">Human Longevity Inc.</CardTitle>
                  <p className="text-muted-foreground">Genomics-based health insights</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">Cutting-edge genomics and AI for personalized health strategies.</p>
                  <Button 
                    className="w-full touch-target font-display"
                    onClick={() => setActiveModal('request-review')}
                  >
                    Request Review
                  </Button>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-gold to-gold/80 rounded-t-lg relative">
                  <div className="absolute top-2 right-2 opacity-20">
                    <img 
                      src={treeLogoConfig.src}
                      alt=""
                      className="h-8 w-auto"
                    />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="font-serif">Attia Healthspan</CardTitle>
                  <p className="text-muted-foreground">Science-driven longevity</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">Evidence-based approach to extending healthy lifespan.</p>
                  <Button 
                    className="w-full touch-target font-display"
                    onClick={() => setActiveModal('request-review')}
                  >
                    Request Review
                  </Button>
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
              <Card className="relative overflow-hidden">
                <div className="absolute top-2 right-2 opacity-10">
                  <img 
                    src={treeLogoConfig.src}
                    alt=""
                    className="h-6 w-auto"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <Shield className="h-5 w-5 text-navy" />
                    Medicare Planning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Optimize your Medicare coverage and supplements
                  </p>
                  <Button 
                    className="w-full touch-target font-display"
                    onClick={() => setActiveModal('get-quote')}
                  >
                    Get Quote
                  </Button>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <div className="absolute top-2 right-2 opacity-10">
                  <img 
                    src={treeLogoConfig.src}
                    alt=""
                    className="h-6 w-auto"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <Heart className="h-5 w-5 text-emerald" />
                    Long-Term Care
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Protect against long-term care costs
                  </p>
                  <Button 
                    className="w-full touch-target font-display"
                    onClick={() => setActiveModal('get-quote')}
                  >
                    Get Quote
                  </Button>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <div className="absolute top-2 right-2 opacity-10">
                  <img 
                    src={treeLogoConfig.src}
                    alt=""
                    className="h-6 w-auto"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <Activity className="h-5 w-5 text-gold" />
                    Disability Insurance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Income protection for health events
                  </p>
                  <Button 
                    className="w-full touch-target font-display"
                    onClick={() => setActiveModal('get-quote')}
                  >
                    Get Quote
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            {/* Influencer Hub */}
            {activePersona === 'influencer' && (
              <>
                <Card className="border-pink-200 bg-pink-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-pink-600" />
                      Verified Thought Leader Hub
                      <Badge className="bg-pink-600 text-white gap-1">
                        <Star className="h-3 w-3" />
                        Verified
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Leaderboard</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-gold" />
                              Dr. Health Expert
                            </span>
                            <Badge>1,250 pts</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-gold" />
                              Wellness Coach Pro
                            </span>
                            <Badge>1,100 pts</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-pink-600 font-medium">Your Rank: #3</span>
                            <Badge variant="secondary">980 pts</Badge>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Content Analytics</h4>
                        <div className="space-y-2">
                          <div className="text-sm">Your contributions: 45</div>
                          <div className="text-sm">Total views: 12,500</div>
                          <div className="text-sm">Engagement rate: 8.5%</div>
                          <div className="text-sm">AMA sessions: 3</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Actions</h4>
                        <div className="space-y-2">
                          <Button size="sm" className="w-full gap-2">
                            <Plus className="h-4 w-4" />
                            Post Resource
                          </Button>
                          <Button size="sm" variant="outline" className="w-full gap-2">
                            <MessageCircle className="h-4 w-4" />
                            Schedule AMA
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming AMA Events */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Your Upcoming AMA Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">Longevity Supplements Q&A</h4>
                            <p className="text-sm text-muted-foreground">March 28, 2024 at 2:00 PM EST</p>
                          </div>
                          <Badge>45 registered</Badge>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full gap-2">
                        <Plus className="h-4 w-4" />
                        Schedule New AMA
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Healthcare Agent Lead Dashboard */}
            {activePersona === 'agent' && (
              <Card className="border-teal-200 bg-teal-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-teal-600" />
                    Healthcare Agent Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Lead Pipeline</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>New Leads</span>
                          <Badge className="bg-teal-600">12</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>In Progress</span>
                          <Badge variant="secondary">8</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Closed This Month</span>
                          <Badge variant="default">15</Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Renewals Due</h4>
                      <div className="space-y-2">
                        <div className="text-sm">Health Insurance: 24 clients</div>
                        <div className="text-sm">Life Insurance: 12 clients</div>
                        <div className="text-sm">LTC Insurance: 8 clients</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Performance</h4>
                      <div className="space-y-2">
                        <div className="text-sm">Conversion Rate: 68%</div>
                        <div className="text-sm">Avg. Policy Value: $2,850</div>
                        <div className="text-sm flex items-center gap-1">
                          Revenue Growth: 
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span className="text-green-600">+15%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Discussion Threads */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Discussion Threads</CardTitle>
                  {['consultant', 'influencer'].includes(activePersona) && (
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Start Discussion
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">Best Strategies for Healthy Retirement</h4>
                      {activePersona === 'influencer' && (
                        <Badge variant="outline" className="text-xs">Trending</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">24 replies • Started by WealthAdvisor123</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">Longevity Supplements: Evidence vs. Hype</h4>
                      <Badge className="bg-pink-600 text-white gap-1 text-xs">
                        <Star className="h-2 w-2" />
                        Expert
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">18 replies • Started by Dr. Sarah Chen (Verified)</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold">Insurance Gaps in Health Planning</h4>
                    <p className="text-sm text-muted-foreground">12 replies • Started by InsurancePro</p>
                  </div>

                  {/* Featured Content for Advisors */}
                  {activePersona === 'advisor' && (
                    <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded-r-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">Client Health Summary Templates</h4>
                        <Badge className="bg-purple-600 text-white text-xs">Advisor Only</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">8 replies • Shared by FinancialWellnessPro</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Network Directory */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Health & Longevity Network Directory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
                      <div>
                        <h4 className="font-semibold text-sm">Dr. Michael Torres</h4>
                        <p className="text-xs text-muted-foreground">Longevity Medicine</p>
                      </div>
                      <Badge className="bg-pink-600 text-white">
                        <Star className="h-2 w-2" />
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">Connect</Button>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full"></div>
                      <div>
                        <h4 className="font-semibold text-sm">Sarah Wilson</h4>
                        <p className="text-xs text-muted-foreground">Health Coach</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">Connect</Button>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full"></div>
                      <div>
                        <h4 className="font-semibold text-sm">James Rodriguez</h4>
                        <p className="text-xs text-muted-foreground">Insurance Agent</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">Connect</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Outreach Tab - For Consultants, Influencers, and Agents */}
          {['consultant', 'influencer', 'agent'].includes(activePersona) && (
            <TabsContent value="outreach">
              <OutreachTemplates />
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Modals */}
      <HealthcareModals 
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onSuccess={handleModalSuccess}
      />

      {/* Onboarding Modal */}
      <Dialog open={showOnboardingModal} onOpenChange={setShowOnboardingModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {activePersona === 'consultant' && <Brain className="h-5 w-5 text-orange-500" />}
              {activePersona === 'influencer' && <Award className="h-5 w-5 text-pink-500" />}
              {activePersona === 'agent' && <Shield className="h-5 w-5 text-teal-500" />}
              Set Up Your {personaOptions.find(p => p.value === activePersona)?.label} Profile
            </DialogTitle>
            <DialogDescription>
              Join our Health & Longevity Network and connect with families seeking trusted guidance.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* VIP Outreach Script for Influencers */}
            {activePersona === 'influencer' && (
              <Alert className="bg-pink-50 border-pink-200">
                <Award className="h-4 w-4 text-pink-600" />
                <AlertDescription className="text-pink-800">
                  <strong>VIP Invitation:</strong> Your pioneering work has inspired our Family Office mission. 
                  We'd be honored to feature you as a Founding Healthcare Influencer in our network.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Dr. John Smith"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty/Area of Expertise</Label>
                <Input 
                  id="specialty"
                  value={profileData.specialty}
                  onChange={(e) => setProfileData(prev => ({ ...prev, specialty: e.target.value }))}
                  placeholder="Longevity Medicine"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea 
                id="bio"
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Brief description of your background and expertise..."
                rows={3}
              />
            </div>

            {/* LinkedIn Import */}
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Link className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Import from LinkedIn</span>
              </div>
              <Button variant="outline" size="sm">
                Connect LinkedIn
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications</Label>
                <Input 
                  id="certifications"
                  value={profileData.certifications}
                  onChange={(e) => setProfileData(prev => ({ ...prev, certifications: e.target.value }))}
                  placeholder="MD, PhD, Certified Longevity Specialist"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input 
                  id="experience"
                  value={profileData.experience}
                  onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder="15+ years"
                />
              </div>
            </div>

            {/* Upload Photo Section */}
            <div className="space-y-2">
              <Label>Professional Photo</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">Upload professional headshot</p>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              </div>
            </div>

            {/* Media/Press Links for Influencers */}
            {activePersona === 'influencer' && (
              <div className="space-y-2">
                <Label>Media & Press Links</Label>
                <div className="space-y-2">
                  <Input placeholder="Website URL" />
                  <Input placeholder="Book/Publication URL" />
                  <Input placeholder="Podcast/Media URL" />
                </div>
              </div>
            )}

            {/* Healthcare Agent Specific Fields */}
            {activePersona === 'agent' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Licensed States</Label>
                  <Input placeholder="CA, NY, TX" />
                </div>
                <div className="space-y-2">
                  <Label>Insurance Products</Label>
                  <Input placeholder="Health, Life, Long-term Care, Disability" />
                </div>
                <div className="space-y-2">
                  <Label>Commission Structure</Label>
                  <Input placeholder="Fee structure details" />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleProfileSetup}
                className="flex-1 gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Complete Profile Setup
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowOnboardingModal(false)}
              >
                Skip for Now
              </Button>
            </div>

            {/* Network CTA */}
            <div className="text-center p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">
                Join Our Health & Longevity Network
              </h4>
              <p className="text-sm text-muted-foreground">
                For Thought Leaders, Advisors, and Families Serious About Wellbeing
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HealthcareLongevityCenter;