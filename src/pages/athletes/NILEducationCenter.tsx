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
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

interface NILModule {
  id: string;
  title: string;
  description: string;
  icon: any;
  progress: number;
  isCompleted: boolean;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const NILEducationCenter = () => {
  const [activeTab, setActiveTab] = useState('welcome');
  const [userProgress, setUserProgress] = useState(15); // Overall completion percentage

  const modules: NILModule[] = [
    {
      id: 'welcome',
      title: 'Welcome & Your NIL Journey',
      description: 'Start your NIL education journey with essential foundations',
      icon: Trophy,
      progress: 100,
      isCompleted: true,
      estimatedTime: '10 min',
      difficulty: 'Beginner'
    },
    {
      id: 'basics',
      title: 'NIL Basics & Compliance',
      description: 'Understanding NCAA and state regulations',
      icon: Shield,
      progress: 80,
      isCompleted: false,
      estimatedTime: '25 min',
      difficulty: 'Beginner'
    },
    {
      id: 'financial',
      title: 'Tax & Financial Planning',
      description: 'Managing NIL income and tax obligations',
      icon: DollarSign,
      progress: 30,
      isCompleted: false,
      estimatedTime: '35 min',
      difficulty: 'Intermediate'
    },
    {
      id: 'contracts',
      title: 'Agent & Contract Guidance',
      description: 'Navigate contracts and agent relationships',
      icon: FileText,
      progress: 0,
      isCompleted: false,
      estimatedTime: '40 min',
      difficulty: 'Advanced'
    },
    {
      id: 'branding',
      title: 'Social Media & Brand Building',
      description: 'Build your personal brand and online presence',
      icon: Users,
      progress: 60,
      isCompleted: false,
      estimatedTime: '30 min',
      difficulty: 'Intermediate'
    },
    {
      id: 'risk',
      title: 'Risk Management & Scams',
      description: 'Protect yourself from fraud and bad deals',
      icon: AlertTriangle,
      progress: 0,
      isCompleted: false,
      estimatedTime: '20 min',
      difficulty: 'Beginner'
    },
    {
      id: 'stories',
      title: 'Real Stories & Mentors',
      description: 'Learn from successful athlete experiences',
      icon: Star,
      progress: 0,
      isCompleted: false,
      estimatedTime: '15 min',
      difficulty: 'Beginner'
    },
    {
      id: 'resources',
      title: 'Resources & FAQ',
      description: 'Downloadable guides and frequently asked questions',
      icon: BookOpen,
      progress: 0,
      isCompleted: false,
      estimatedTime: '10 min',
      difficulty: 'Beginner'
    },
    {
      id: 'help',
      title: 'Get Help',
      description: 'Connect with coaches and trusted advisors',
      icon: HelpCircle,
      progress: 0,
      isCompleted: false,
      estimatedTime: '5 min',
      difficulty: 'Beginner'
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
            Watch Welcome Video
          </Button>
          <Button variant="outline" size="lg">
            Start Learning Journey
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {modules.filter(m => m.isCompleted).length}
              </div>
              <div className="text-sm text-green-700">Completed</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {modules.filter(m => m.progress > 0 && !m.isCompleted).length}
              </div>
              <div className="text-sm text-blue-700">In Progress</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {modules.filter(m => m.progress === 0).length}
              </div>
              <div className="text-sm text-gray-700">Not Started</div>
            </div>
          </div>
        </CardContent>
      </Card>
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
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-9 mb-8">
            <TabsTrigger value="welcome" className="text-xs">Welcome</TabsTrigger>
            <TabsTrigger value="basics" className="text-xs">Basics</TabsTrigger>
            <TabsTrigger value="financial" className="text-xs">Financial</TabsTrigger>
            <TabsTrigger value="contracts" className="text-xs">Contracts</TabsTrigger>
            <TabsTrigger value="branding" className="text-xs">Branding</TabsTrigger>
            <TabsTrigger value="risk" className="text-xs">Risk</TabsTrigger>
            <TabsTrigger value="stories" className="text-xs">Stories</TabsTrigger>
            <TabsTrigger value="resources" className="text-xs">Resources</TabsTrigger>
            <TabsTrigger value="help" className="text-xs">Get Help</TabsTrigger>
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
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Agent & Contract Guidance</h3>
                <p className="text-muted-foreground">Navigate the complex world of NIL contracts</p>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Content for contracts and agent guidance coming soon...</p>
                <Button>Schedule Advisor Consultation</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Social Media & Brand Building</h3>
                <p className="text-muted-foreground">Build a powerful personal brand</p>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Content for branding and social media guidance coming soon...</p>
                <Button>Access Templates</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Risk Management & Scams</h3>
                <p className="text-muted-foreground">Protect yourself from fraud and bad deals</p>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Content for risk management coming soon...</p>
                <Button>Learn Safety Tips</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stories">
            {renderStoriesTab()}
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Resources & FAQ</h3>
                <p className="text-muted-foreground">Downloadable guides and answers</p>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Resource library and FAQ coming soon...</p>
                <Button>Browse Resources</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="help">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Get Help</h3>
                <p className="text-muted-foreground">Connect with coaches and trusted advisors</p>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Help and support options coming soon...</p>
                <Button>Contact Support</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Module Progress Grid */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Your Learning Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <motion.div
                key={module.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className={`cursor-pointer transition-all duration-200 ${
                  module.isCompleted ? 'border-green-200 bg-green-50' : 
                  module.progress > 0 ? 'border-blue-200 bg-blue-50' : 'hover:border-primary/50'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
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
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {module.description}
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">Progress</span>
                      <span className="text-xs text-muted-foreground">{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="mb-3" />
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