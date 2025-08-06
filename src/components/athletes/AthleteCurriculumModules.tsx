import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, Download, Play, Trophy, AlertTriangle, Shield, Users, DollarSign, Brain, Heart, Star, MessageCircle } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completed: boolean;
  progress: number;
  icon: any;
  content: {
    videos: string[];
    downloads: string[];
    quizzes: string[];
    resources: string[];
  };
}

const modules: Module[] = [
  {
    id: 'intro',
    title: 'Introduction: Why This Center Exists',
    description: 'Understanding the unique financial challenges athletes face and why this education matters',
    duration: '15 min',
    difficulty: 'Beginner',
    completed: true,
    progress: 100,
    icon: Trophy,
    content: {
      videos: ['Welcome Video', 'Athlete Success Stories'],
      downloads: ['Getting Started Checklist', 'Platform Overview PDF'],
      quizzes: ['Knowledge Check: Platform Basics'],
      resources: ['Athlete Financial Statistics', 'Success Stories Library']
    }
  },
  {
    id: 'myths',
    title: 'Money Myths & Mistakes',
    description: 'Common financial misconceptions that derail athletic careers',
    duration: '25 min',
    difficulty: 'Beginner',
    completed: true,
    progress: 100,
    icon: AlertTriangle,
    content: {
      videos: ['Top 10 Money Myths', 'Case Study: What Went Wrong'],
      downloads: ['Myth Busters Checklist', 'Red Flags Guide'],
      quizzes: ['Myth vs Reality Quiz'],
      resources: ['Financial Failure Stories', 'Expert Commentary']
    }
  },
  {
    id: 'playbook',
    title: 'The Playbook for Wealth: Planning & Goals',
    description: 'Creating your personal financial game plan',
    duration: '30 min',
    difficulty: 'Intermediate',
    completed: false,
    progress: 60,
    icon: Shield,
    content: {
      videos: ['Goal Setting for Athletes', 'Creating Your Financial Plan'],
      downloads: ['Personal Playbook Template', 'Goal Setting Worksheet'],
      quizzes: ['Planning Readiness Assessment'],
      resources: ['Planning Tools', 'Template Library']
    }
  },
  {
    id: 'nil-contracts',
    title: 'NIL, Endorsements, & Contracts—Reading the Fine Print',
    description: 'Understanding and evaluating endorsement deals and NIL opportunities',
    duration: '35 min',
    difficulty: 'Intermediate',
    completed: false,
    progress: 0,
    icon: DollarSign,
    content: {
      videos: ['Contract Basics', 'NIL Deal Analysis', 'Negotiation Strategies'],
      downloads: ['Contract Review Checklist', 'NIL Deal Analyzer'],
      quizzes: ['Contract Knowledge Test'],
      resources: ['Legal Templates', 'Industry Standards']
    }
  },
  {
    id: 'team',
    title: 'Understanding Your Team: Advisors, Agents, Family',
    description: 'Building and managing your professional support team',
    duration: '20 min',
    difficulty: 'Beginner',
    completed: false,
    progress: 0,
    icon: Users,
    content: {
      videos: ['Building Your Advisory Team', 'Red Flags in Advisors'],
      downloads: ['Team Assembly Guide', 'Advisor Interview Questions'],
      quizzes: ['Team Building Quiz'],
      resources: ['Advisor Directory', 'Credential Checker']
    }
  },
  {
    id: 'taxes',
    title: 'Taxes & Asset Protection',
    description: 'Smart tax strategies and protecting your wealth',
    duration: '40 min',
    difficulty: 'Advanced',
    completed: false,
    progress: 0,
    icon: Shield,
    content: {
      videos: ['Tax Planning Basics', 'Asset Protection Strategies'],
      downloads: ['Tax Planning Checklist', 'Protection Strategies Guide'],
      quizzes: ['Tax Knowledge Assessment'],
      resources: ['Tax Calendar', 'Protection Tools']
    }
  },
  {
    id: 'mental-health',
    title: 'Mental Health: Resilience & Transition',
    description: 'Maintaining mental wellness through career transitions',
    duration: '30 min',
    difficulty: 'Intermediate',
    completed: false,
    progress: 0,
    icon: Brain,
    content: {
      videos: ['Mental Health Awareness', 'Transition Strategies'],
      downloads: ['Wellness Checklist', 'Resources Directory'],
      quizzes: ['Wellness Self-Assessment'],
      resources: ['Support Networks', 'Crisis Resources']
    }
  },
  {
    id: 'second-act',
    title: 'Building Your Second Act (Career, Business, Purpose)',
    description: 'Planning and executing your post-sport career',
    duration: '45 min',
    difficulty: 'Advanced',
    completed: false,
    progress: 0,
    icon: Star,
    content: {
      videos: ['Career Transition Stories', 'Business Building Basics'],
      downloads: ['Second Act Planner', 'Business Plan Template'],
      quizzes: ['Career Readiness Assessment'],
      resources: ['Mentorship Network', 'Business Resources']
    }
  },
  {
    id: 'legacy',
    title: 'Protecting Your Legacy & Family',
    description: 'Building generational wealth and protecting your family',
    duration: '35 min',
    difficulty: 'Advanced',
    completed: false,
    progress: 0,
    icon: Heart,
    content: {
      videos: ['Legacy Planning', 'Family Vault Creation'],
      downloads: ['Legacy Planning Guide', 'Family Vault Template'],
      quizzes: ['Legacy Readiness Quiz'],
      resources: ['Estate Planning Tools', 'Family Resources']
    }
  },
  {
    id: 'copilot',
    title: 'Athlete Copilot—Your 24/7 Support System',
    description: 'Maximizing your AI support and connecting with real advisors',
    duration: '15 min',
    difficulty: 'Beginner',
    completed: false,
    progress: 0,
    icon: MessageCircle,
    content: {
      videos: ['Using Your Copilot', 'When to Escalate to Humans'],
      downloads: ['Copilot User Guide', 'Support Resources'],
      quizzes: ['Support System Quiz'],
      resources: ['Help Center', 'FAQ Library']
    }
  },
  {
    id: 'investing',
    title: 'Bonus: Smart Investing & Private Opportunities',
    description: 'Investment strategies and exclusive opportunities for athletes',
    duration: '50 min',
    difficulty: 'Advanced',
    completed: false,
    progress: 0,
    icon: Trophy,
    content: {
      videos: ['Investment Basics', 'Private Market Access'],
      downloads: ['Investment Strategy Guide', 'Risk Assessment Tool'],
      quizzes: ['Investment Knowledge Test'],
      resources: ['Investment Platforms', 'Opportunity Database']
    }
  },
  {
    id: 'ambassador',
    title: 'Next Steps & Sharing the Knowledge (Ambassador/Referral)',
    description: 'Becoming an ambassador and helping other athletes',
    duration: '20 min',
    difficulty: 'Beginner',
    completed: false,
    progress: 0,
    icon: Users,
    content: {
      videos: ['Ambassador Program', 'Referral Strategies'],
      downloads: ['Ambassador Guide', 'Referral Tools'],
      quizzes: ['Ambassador Readiness Quiz'],
      resources: ['Sharing Tools', 'Recognition Program']
    }
  }
];

export function AthleteCurriculumModules() {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const totalProgress = Math.round(
    modules.reduce((sum, module) => sum + module.progress, 0) / modules.length
  );

  const completedModules = modules.filter(m => m.completed).length;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Your Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalProgress}%</div>
              <div className="text-sm text-muted-foreground">Overall Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{completedModules}</div>
              <div className="text-sm text-muted-foreground">Modules Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{modules.length - completedModules}</div>
              <div className="text-sm text-muted-foreground">Modules Remaining</div>
            </div>
          </div>
          <Progress value={totalProgress} className="w-full" />
        </CardContent>
      </Card>

      {/* Module Selection */}
      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="modules">All Modules</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="not-started">Not Started</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Card key={module.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedModule(module)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Icon className="w-6 h-6 text-primary" />
                      <Badge variant={module.completed ? "default" : "outline"}>
                        {module.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {module.duration}
                        </span>
                        {module.completed && (
                          <CheckCircle className="w-4 h-4 text-accent" />
                        )}
                      </div>
                      <Progress value={module.progress} className="w-full" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.filter(m => m.completed).map((module) => {
              const Icon = module.icon;
              return (
                <Card key={module.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-primary" />
                      <CheckCircle className="w-5 h-5 text-accent" />
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      Review Module
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="in-progress">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.filter(m => !m.completed && m.progress > 0).map((module) => {
              const Icon = module.icon;
              return (
                <Card key={module.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon className="w-6 h-6 text-primary" />
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                    <Progress value={module.progress} className="w-full mb-3" />
                    <Button size="sm" className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Continue
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="not-started">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.filter(m => !m.completed && m.progress === 0).map((module) => {
              const Icon = module.icon;
              return (
                <Card key={module.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon className="w-6 h-6 text-muted-foreground" />
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                    <div className="text-sm text-muted-foreground mb-3">
                      Duration: {module.duration}
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Start Module
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Module Detail Modal/Panel would go here */}
      {selectedModule && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <selectedModule.icon className="w-6 h-6 text-primary" />
              {selectedModule.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Videos
                </h4>
                <ul className="space-y-1 text-sm">
                  {selectedModule.content.videos.map((video, index) => (
                    <li key={index} className="text-muted-foreground">{video}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Downloads
                </h4>
                <ul className="space-y-1 text-sm">
                  {selectedModule.content.downloads.map((download, index) => (
                    <li key={index} className="text-muted-foreground">{download}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Quizzes
                </h4>
                <ul className="space-y-1 text-sm">
                  {selectedModule.content.quizzes.map((quiz, index) => (
                    <li key={index} className="text-muted-foreground">{quiz}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Resources
                </h4>
                <ul className="space-y-1 text-sm">
                  {selectedModule.content.resources.map((resource, index) => (
                    <li key={index} className="text-muted-foreground">{resource}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button>
                {selectedModule.completed ? 'Review Module' : 'Start Module'}
              </Button>
              <Button variant="outline" onClick={() => setSelectedModule(null)}>
                Close Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}