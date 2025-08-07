import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  Shield, 
  DollarSign, 
  FileText, 
  Users, 
  AlertTriangle,
  Trophy,
  HelpCircle,
  Play,
  Download,
  CheckCircle,
  Star,
  MapPin,
  BookOpen,
  Award,
  Share,
  Calculator,
  Eye,
  Brain,
  Heart,
  Building,
  UserPlus,
  Clock,
  Video,
  FileDown,
  MessageCircle,
  TrendingUp,
  Instagram,
  Youtube,
  Monitor
} from 'lucide-react';
import { motion } from 'framer-motion';
import { NILInviteSystem } from '@/components/education/NILInviteSystem';
import { NILCertificationBadges } from '@/components/education/NILCertificationBadges';
import { NILResourceLibrary } from '@/components/education/NILResourceLibrary';

interface NILModule {
  id: string;
  title: string;
  description: string;
  icon: any;
  progress: number;
  isCompleted: boolean;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  videoCount?: number;
  pdfCount?: number;
  quizzes?: number;
  badge?: string;
}

interface CertificationBadge {
  id: string;
  name: string;
  description: string;
  icon: any;
  earned: boolean;
  requirements: string[];
}

const NILEducationCenter = () => {
  const [activeTab, setActiveTab] = useState('welcome');
  const [userProgress, setUserProgress] = useState(15);

  const modules: NILModule[] = [
    {
      id: 'welcome',
      title: 'Welcome & Your NIL Journey',
      description: 'Start your NIL education journey with essential foundations',
      icon: Trophy,
      progress: 100,
      isCompleted: true,
      estimatedTime: '10 min',
      difficulty: 'Beginner',
      videoCount: 1,
      pdfCount: 0,
      quizzes: 0,
      badge: 'NIL Starter'
    },
    {
      id: 'basics',
      title: 'NIL Basics & NCAA/State Compliance',
      description: 'Understanding NCAA and state regulations, interactive state rules map',
      icon: Shield,
      progress: 80,
      isCompleted: false,
      estimatedTime: '25 min',
      difficulty: 'Beginner',
      videoCount: 3,
      pdfCount: 2,
      quizzes: 1,
      badge: 'Compliance Expert'
    },
    {
      id: 'financial',
      title: 'Financial Literacy & Tax Planning',
      description: 'Money management, tax obligations, business formation',
      icon: DollarSign,
      progress: 30,
      isCompleted: false,
      estimatedTime: '35 min',
      difficulty: 'Intermediate',
      videoCount: 4,
      pdfCount: 3,
      quizzes: 2,
      badge: 'Financial Pro'
    },
    {
      id: 'branding',
      title: 'Social Media, Branding & Monetization',
      description: 'Build your brand, content tips, FTC compliance',
      icon: TrendingUp,
      progress: 60,
      isCompleted: false,
      estimatedTime: '30 min',
      difficulty: 'Intermediate',
      videoCount: 5,
      pdfCount: 4,
      quizzes: 1,
      badge: 'Brand Builder'
    },
    {
      id: 'contracts',
      title: 'Agent, Contract & Legal Guidance',
      description: 'Navigate contracts, agent relationships, red flags',
      icon: FileText,
      progress: 0,
      isCompleted: false,
      estimatedTime: '40 min',
      difficulty: 'Advanced',
      videoCount: 3,
      pdfCount: 3,
      quizzes: 2,
      badge: 'Contract Pro'
    },
    {
      id: 'risk',
      title: 'Risk Management & Avoiding Scams',
      description: 'Protect yourself from fraud, cybersecurity basics',
      icon: AlertTriangle,
      progress: 0,
      isCompleted: false,
      estimatedTime: '20 min',
      difficulty: 'Beginner',
      videoCount: 3,
      pdfCount: 2,
      quizzes: 1,
      badge: 'Risk Manager'
    },
    {
      id: 'life-after',
      title: 'Life & Career After Sports',
      description: 'Second career planning, entrepreneurship, mental health',
      icon: Heart,
      progress: 0,
      isCompleted: false,
      estimatedTime: '25 min',
      difficulty: 'Intermediate',
      videoCount: 4,
      pdfCount: 2,
      quizzes: 1,
      badge: 'Future Planner'
    },
    {
      id: 'family',
      title: 'Family, Guardians & Coaches',
      description: 'Resources for parents, guardians, and coaching staff',
      icon: Users,
      progress: 0,
      isCompleted: false,
      estimatedTime: '15 min',
      difficulty: 'Beginner',
      videoCount: 2,
      pdfCount: 3,
      quizzes: 0,
      badge: 'Team Player'
    },
    {
      id: 'stories',
      title: 'Real Stories & Mentors',
      description: 'Success stories, pro athlete advice, mentor connections',
      icon: Star,
      progress: 0,
      isCompleted: false,
      estimatedTime: '15 min',
      difficulty: 'Beginner',
      videoCount: 6,
      pdfCount: 0,
      quizzes: 0,
      badge: 'Community Member'
    },
    {
      id: 'resources',
      title: 'Resources & Help Desk',
      description: 'PDF library, FAQ, glossary, live support',
      icon: BookOpen,
      progress: 0,
      isCompleted: false,
      estimatedTime: '10 min',
      difficulty: 'Beginner',
      videoCount: 0,
      pdfCount: 15,
      quizzes: 0,
      badge: 'Resource Master'
    }
  ];

  const certificationBadges: CertificationBadge[] = [
    {
      id: 'nil-certified',
      name: 'NIL Smart Money Certified',
      description: 'Complete all 10 modules with passing quiz scores',
      icon: Award,
      earned: false,
      requirements: ['Complete all modules', 'Pass all quizzes with 80%+', 'Download certificate']
    },
    {
      id: 'compliance-expert',
      name: 'Compliance Expert',
      description: 'Master NCAA and state regulations',
      icon: Shield,
      earned: true,
      requirements: ['Complete Basics module', 'Pass compliance quiz']
    },
    {
      id: 'brand-builder',
      name: 'Brand Builder',
      description: 'Learn to build and monetize your personal brand',
      icon: TrendingUp,
      earned: false,
      requirements: ['Complete Branding module', 'Create social media plan']
    }
  ];

  const renderWelcomeTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/10 to-primary/20 rounded-xl p-8 text-center border border-primary/20">
        <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">Welcome to NIL Smart Money</h2>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
          Your complete education platform for Name, Image, and Likeness opportunities. 
          Learn to maximize your earning potential while staying compliant and protecting your future.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Button size="lg" className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Watch Welcome Video (5:32)
          </Button>
          <Button variant="outline" size="lg">
            Start Learning Journey
          </Button>
          <Button variant="outline" size="lg" className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Teammates
          </Button>
        </div>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            100% Privacy Protected
          </div>
          <div className="flex items-center gap-1">
            <Shield className="h-4 w-4 text-blue-500" />
            NCAA Compliant
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            Expert Guidance
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Your Learning Progress</h3>
            <p className="text-muted-foreground">Track your NIL education journey</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-sm text-muted-foreground">{userProgress}%</span>
            </div>
            <Progress value={userProgress} className="mb-4" />
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">
                  {modules.filter(m => m.isCompleted).length}
                </div>
                <div className="text-xs text-green-700">Completed</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">
                  {modules.filter(m => m.progress > 0 && !m.isCompleted).length}
                </div>
                <div className="text-xs text-blue-700">In Progress</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-600">
                  {modules.filter(m => m.progress === 0).length}
                </div>
                <div className="text-xs text-gray-700">Not Started</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-semibold text-yellow-800">Next Badge</span>
              </div>
              <p className="text-xs text-yellow-700">
                Complete 3 more modules to earn "NIL Smart Money Certified" badge!
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Quick Access</h3>
            <p className="text-muted-foreground">Jump to key resources and tools</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Calculator className="h-4 w-4 mr-2" />
              NIL Deal Value Calculator
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Download Contract Checklist
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MapPin className="h-4 w-4 mr-2" />
              Interactive State Rules Map
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageCircle className="h-4 w-4 mr-2" />
              Get Expert Help
              <Badge className="ml-auto bg-red-500">Live</Badge>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.slice(0, 4).map((module) => {
          const IconComponent = module.icon;
          return (
            <Card key={module.id} className="border-l-4 border-l-primary/50 hover:border-l-primary transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <IconComponent className="h-5 w-5 text-primary" />
                  <Badge variant="secondary" className="text-xs">
                    {module.difficulty}
                  </Badge>
                </div>
                <h4 className="font-semibold mb-1 text-sm">{module.title}</h4>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {module.description}
                </p>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted-foreground">{module.estimatedTime}</span>
                  <span className="text-muted-foreground">
                    {module.videoCount}V • {module.pdfCount}P
                  </span>
                </div>
                <Progress value={module.progress} className="h-1 mb-2" />
                <Button size="sm" variant="outline" className="w-full text-xs">
                  {module.progress === 0 ? 'Start' : module.isCompleted ? 'Review' : 'Continue'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderBasicsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-500" />
            <h3 className="text-xl font-semibold">NIL Basics & NCAA Compliance</h3>
          </div>
          <p className="text-muted-foreground">Master the fundamentals and stay compliant</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <h4 className="font-semibold">Interactive State Rules Map</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Explore NIL regulations by state with our interactive map
                </p>
                <Button variant="outline" size="sm">View Map</Button>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h4 className="font-semibold">Pre-Deal Checklist</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Essential steps before signing any NIL agreement
                </p>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">Important Reminder</h4>
                <p className="text-sm text-yellow-700">
                  Always check with your compliance office before signing any NIL deal. 
                  Rules vary by school and can change frequently.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFinancialTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-green-500" />
            <h3 className="text-xl font-semibold">Financial Literacy & Tax Planning</h3>
          </div>
          <p className="text-muted-foreground">Manage your NIL income responsibly</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">Income Tracking</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Learn to track and categorize your NIL earnings
                </p>
                <Button variant="outline" size="sm">Start Module</Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">Tax Obligations</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Understand quarterly payments and deductions
                </p>
                <Button variant="outline" size="sm">Learn More</Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">Quiz & Scenarios</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Test your knowledge with real-world examples
                </p>
                <Button variant="outline" size="sm">Take Quiz</Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStoriesTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500" />
            <h3 className="text-xl font-semibold">Real Stories & Mentors</h3>
          </div>
          <p className="text-muted-foreground">Learn from successful athletes and mentors</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-yellow-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah's Success Story</h4>
                    <p className="text-sm text-muted-foreground">Basketball • Stanford</p>
                  </div>
                </div>
                <p className="text-sm mb-4">
                  "NIL changed my life, but education saved me from costly mistakes. Here's how I built a sustainable brand..."
                </p>
                <Button variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Watch Story
                </Button>
              </CardContent>
            </Card>
            <Card className="border-2 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Mentor Network</h4>
                    <p className="text-sm text-muted-foreground">Former Athletes • Advisors</p>
                  </div>
                </div>
                <p className="text-sm mb-4">
                  Connect with former college athletes who successfully navigated NIL and are now building careers.
                </p>
                <Button variant="outline" size="sm">Find Mentors</Button>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3">Share Your Story</h4>
              <p className="text-muted-foreground mb-4">
                Help future athletes by sharing your NIL journey, lessons learned, and advice.
              </p>
              <Button>Submit Your Story</Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">NIL Education Center</h1>
              <p className="text-xl opacity-90">
                Empower Your NIL Journey with Expert Education
              </p>
              <div className="flex items-center gap-4 mt-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  For Athletes
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Parents & Coaches
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  100% Privacy Protected
                </Badge>
              </div>
            </div>
            <div className="hidden md:block">
              <Trophy className="h-24 w-24 opacity-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 mb-8">
            <TabsTrigger value="welcome" className="text-xs">Welcome</TabsTrigger>
            <TabsTrigger value="basics" className="text-xs">Basics</TabsTrigger>
            <TabsTrigger value="financial" className="text-xs">Financial</TabsTrigger>
            <TabsTrigger value="branding" className="text-xs">Branding</TabsTrigger>
            <TabsTrigger value="contracts" className="text-xs">Contracts</TabsTrigger>
            <TabsTrigger value="risk" className="text-xs">Risk</TabsTrigger>
            <TabsTrigger value="life-after" className="text-xs">Life After</TabsTrigger>
            <TabsTrigger value="family" className="text-xs">Family</TabsTrigger>
            <TabsTrigger value="stories" className="text-xs">Stories</TabsTrigger>
            <TabsTrigger value="resources" className="text-xs">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="welcome">
            {renderWelcomeTab()}
          </TabsContent>

          <TabsContent value="basics">
            {renderBasicsTab()}
          </TabsContent>

          <TabsContent value="financial">
            {renderFinancialTab()}
          </TabsContent>

          <TabsContent value="contracts">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="h-6 w-6 text-orange-500" />
                    <h3 className="text-xl font-semibold">Agent, Contract & Legal Guidance</h3>
                  </div>
                  <p className="text-muted-foreground">Navigate contracts, agent relationships, and red flags</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-l-4 border-l-purple-500">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Video className="h-5 w-5 text-purple-500" />
                          <h4 className="font-semibold">Do I Need an Agent?</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Learn when and how to engage professional representation
                        </p>
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Watch Video (8:45)
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-red-500">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          <h4 className="font-semibold">Red Flags</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Interactive quiz: Spot bad contract terms
                        </p>
                        <Button variant="outline" size="sm">
                          Take Quiz
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <FileDown className="h-5 w-5 text-blue-500" />
                          <h4 className="font-semibold">Sample Contracts</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Download agent/endorsement contract templates
                        </p>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Get Expert Advice
                    </h4>
                    <p className="text-sm text-blue-700 mb-4">
                      Schedule a consultation with a fiduciary advisor to review your specific situation and contracts.
                    </p>
                    <Button>
                      Schedule Consultation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="branding">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-purple-500" />
                    <h3 className="text-xl font-semibold">Social Media, Branding & Monetization</h3>
                  </div>
                  <p className="text-muted-foreground">Build your brand, create content, and stay FTC compliant</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-2 border-purple-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Star className="h-6 w-6 text-purple-500" />
                          <h4 className="font-semibold">Building Your Brand</h4>
                        </div>
                        <ul className="text-sm space-y-2 mb-4 text-muted-foreground">
                          <li>• Finding your authentic story and values</li>
                          <li>• Content strategy for all platforms</li>
                          <li>• Privacy and reputation management</li>
                        </ul>
                        <Button variant="outline" size="sm" className="w-full">
                          <Video className="h-4 w-4 mr-2" />
                          Watch Series (15:20)
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-2 border-green-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="h-6 w-6 text-green-500" />
                          <h4 className="font-semibold">Monetization</h4>
                        </div>
                        <ul className="text-sm space-y-2 mb-4 text-muted-foreground">
                          <li>• Endorsements and product collabs</li>
                          <li>• Setting rates and negotiating</li>
                          <li>• FTC advertising compliance</li>
                        </ul>
                        <Button variant="outline" size="sm" className="w-full">
                          Access Templates
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="text-center">
                      <CardContent className="pt-6">
                        <Instagram className="h-8 w-8 mx-auto mb-2 text-pink-500" />
                        <p className="text-sm font-semibold">Instagram</p>
                        <p className="text-xs text-muted-foreground">Post templates</p>
                      </CardContent>
                    </Card>
                    <Card className="text-center">
                      <CardContent className="pt-6">
                        <Monitor className="h-8 w-8 mx-auto mb-2 text-black" />
                        <p className="text-sm font-semibold">TikTok</p>
                        <p className="text-xs text-muted-foreground">Content ideas</p>
                      </CardContent>
                    </Card>
                    <Card className="text-center">
                      <CardContent className="pt-6">
                        <Youtube className="h-8 w-8 mx-auto mb-2 text-red-500" />
                        <p className="text-sm font-semibold">YouTube</p>
                        <p className="text-xs text-muted-foreground">Channel guide</p>
                      </CardContent>
                    </Card>
                    <Card className="text-center">
                      <CardContent className="pt-6">
                        <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <p className="text-sm font-semibold">Community</p>
                        <p className="text-xs text-muted-foreground">Engagement tips</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risk">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                    <h3 className="text-xl font-semibold">Risk Management & Avoiding Scams</h3>
                  </div>
                  <p className="text-muted-foreground">Protect yourself from fraud, cybersecurity threats, and bad deals</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-l-4 border-l-red-500">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Eye className="h-5 w-5 text-red-500" />
                          <h4 className="font-semibold">Common Scams</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Real examples of NIL scams and how to spot them
                        </p>
                        <Button variant="outline" size="sm">
                          <Video className="h-4 w-4 mr-2" />
                          Watch Examples
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-5 w-5 text-blue-500" />
                          <h4 className="font-semibold">Cybersecurity</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Protect your data, accounts, and personal information
                        </p>
                        <Button variant="outline" size="sm">
                          Learn Basics
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-green-500">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <h4 className="font-semibold">Safety Checklist</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Download safety checklist for NIL partnerships
                        </p>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Emergency Help
                    </h4>
                    <p className="text-sm text-red-700 mb-4">
                      If you think you've been scammed or need immediate help with a suspicious offer:
                    </p>
                    <div className="space-y-2">
                      <Button variant="destructive" size="sm">
                        Report Scam
                      </Button>
                      <Button variant="outline" size="sm" className="ml-2">
                        Emergency Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="life-after">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Heart className="h-6 w-6 text-pink-500" />
                    <h3 className="text-xl font-semibold">Life & Career After Sports</h3>
                  </div>
                  <p className="text-muted-foreground">Plan for second career, entrepreneurship, and mental health</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-2 border-pink-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Building className="h-6 w-6 text-pink-500" />
                          <h4 className="font-semibold">Second Career Planning</h4>
                        </div>
                        <ul className="text-sm space-y-2 mb-4 text-muted-foreground">
                          <li>• Education and skill development</li>
                          <li>• Networking and mentorship</li>
                          <li>• Using NIL as career launchpad</li>
                        </ul>
                        <Button variant="outline" size="sm" className="w-full">
                          <Video className="h-4 w-4 mr-2" />
                          Watch Pro Stories
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-2 border-purple-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Heart className="h-6 w-6 text-purple-500" />
                          <h4 className="font-semibold">Mental Health & Identity</h4>
                        </div>
                        <ul className="text-sm space-y-2 mb-4 text-muted-foreground">
                          <li>• Handling fame and pressure</li>
                          <li>• Identity beyond athletics</li>
                          <li>• Support resources</li>
                        </ul>
                        <Button variant="outline" size="sm" className="w-full">
                          Access Resources
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-3">Finding Your Next Purpose</h4>
                      <p className="text-muted-foreground mb-4">
                        Download our comprehensive workbook for exploring career paths and purpose after sports.
                      </p>
                      <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Download Workbook
                      </Button>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="family">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-blue-500" />
                    <h3 className="text-xl font-semibold">Family, Guardians & Coaches</h3>
                  </div>
                  <p className="text-muted-foreground">Resources for parents, guardians, and coaching staff</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-5 w-5 text-blue-500" />
                          <h4 className="font-semibold">Parent Guide</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Essential NIL information for parents and guardians
                        </p>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download Guide
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-green-500">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy className="h-5 w-5 text-green-500" />
                          <h4 className="font-semibold">Coach Resources</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Tools for monitoring and supporting athletes
                        </p>
                        <Button variant="outline" size="sm">
                          Access Portal
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-l-purple-500">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-5 w-5 text-purple-500" />
                          <h4 className="font-semibold">Minor Protection</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Legal and compliance steps for minors
                        </p>
                        <Button variant="outline" size="sm">
                          Learn More
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-800 mb-3">Team Meeting Templates</h4>
                    <p className="text-sm text-blue-700 mb-4">
                      Download presentation templates for school-wide NIL education meetings.
                    </p>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        PowerPoint
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        PDF Handout
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stories">
            {renderStoriesTab()}
          </TabsContent>

          <TabsContent value="resources">
            <NILResourceLibrary />
          </TabsContent>

          <TabsContent value="help">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-semibold">Get Help & Support</h3>
                  </div>
                  <p className="text-muted-foreground">Connect with coaches, advisors, and live support</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-2 border-green-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <MessageCircle className="h-6 w-6 text-green-500" />
                          <h4 className="font-semibold">Live Chat Support</h4>
                          <Badge className="bg-green-500">Online</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Get instant help from NIL education experts
                        </p>
                        <Button className="w-full">
                          Start Chat
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-2 border-blue-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="h-6 w-6 text-blue-500" />
                          <h4 className="font-semibold">Expert Consultation</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Schedule 1-on-1 time with fiduciary advisors
                        </p>
                        <Button variant="outline" className="w-full">
                          Schedule Call
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <NILInviteSystem />
                  
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold mb-4">Frequently Asked Questions</h4>
                    <div className="space-y-4">
                      <Card>
                        <CardContent className="pt-6">
                          <h5 className="font-semibold mb-2">How do I know if an NIL deal is legitimate?</h5>
                          <p className="text-sm text-muted-foreground">
                            Look for verified companies, clear contract terms, and always consult with your compliance office before signing anything.
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <h5 className="font-semibold mb-2">Do I need to pay taxes on NIL income?</h5>
                          <p className="text-sm text-muted-foreground">
                            Yes, NIL income is taxable. You'll need to track earnings and may need to make quarterly payments. See our Financial module for details.
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <h5 className="font-semibold mb-2">Can my school help me with NIL deals?</h5>
                          <p className="text-sm text-muted-foreground">
                            Schools can provide educational resources and compliance guidance but cannot arrange deals or negotiate on your behalf.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Certification Badges Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Certification Badges</h2>
            <Button variant="outline" onClick={() => setActiveTab('badges')}>
              View All Badges
            </Button>
          </div>
          <NILCertificationBadges />
        </div>

        {/* Module Progress Grid */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Your Learning Modules
            <Badge variant="secondary">{modules.filter(m => m.isCompleted).length}/{modules.length} Complete</Badge>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <motion.div
                key={module.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className={`cursor-pointer transition-all duration-200 relative ${
                  module.isCompleted ? 'border-green-200 bg-green-50' : 
                  module.progress > 0 ? 'border-blue-200 bg-blue-50' : 'hover:border-primary/50'
                }`}>
                  {/* Get Help Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('help');
                    }}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between pr-8">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          module.isCompleted ? 'bg-green-100 text-green-600' :
                          module.progress > 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <module.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{module.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {module.difficulty}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {module.estimatedTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      {module.isCompleted && (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-2" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {module.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>{module.videoCount}V • {module.pdfCount}P • {module.quizzes}Q</span>
                      <span>{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="mb-3" />
                    
                    {module.badge && (
                      <div className="mb-3">
                        <Badge variant="secondary" className="text-xs">
                          <Award className="h-3 w-3 mr-1" />
                          Earns: {module.badge}
                        </Badge>
                      </div>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant={module.progress > 0 ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setActiveTab(module.id)}
                    >
                      {module.isCompleted ? 'Review' : module.progress > 0 ? 'Continue' : 'Start'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NILEducationCenter;