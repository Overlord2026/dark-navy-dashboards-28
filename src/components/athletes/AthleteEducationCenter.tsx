import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Star, Shield, Download, PlayCircle, CheckCircle, Brain, Target, Users, Presentation, GraduationCap, Video, Mail, FileText, Upload, Send } from 'lucide-react';
import { AthleteAssessmentQuiz } from './AthleteAssessmentQuiz';
import { AthleteCopilotChat } from './AthleteCopilotChat';
import { AthleteOnboardingSlides } from './AthleteOnboardingSlides';
import { AthleteCurriculumModules } from './AthleteCurriculumModules';
import { AthleteTrainingManual } from './AthleteTrainingManual';
import { AthleteEmailTemplates } from './AthleteEmailTemplates';
import { AthleteSlideContent } from './AthleteSlideContent';
import { AthleteVideoScripts } from './AthleteVideoScripts';
import { AthleteCampaignKit } from './AthleteCampaignKit';
import { HallOfChampions } from './HallOfChampions';
import { ChampionSubmissionForm } from './ChampionSubmissionForm';
import { ChampionAdminPanel } from './ChampionAdminPanel';
import { ChampionOutreachTemplates } from './ChampionOutreachTemplates';
import { AthleteDatabase } from './AthleteDatabase';
import { SportsAgentsDatabase } from './SportsAgentsDatabase';
import { AgentOutreachTemplates } from './AgentOutreachTemplates';
import { LeagueExecutivePortal } from './LeagueExecutivePortal';

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: 'financial' | 'wellness' | 'career';
  completed: boolean;
  icon: React.ReactNode;
  downloadUrl?: string;
}

const modules: Module[] = [
  {
    id: 'intro',
    title: 'Introduction: The Unique Wealth Journey of Athletes',
    description: 'Understanding your financial landscape as a professional athlete',
    duration: '15 min',
    category: 'financial',
    completed: true,
    icon: <Trophy className="h-5 w-5" />
  },
  {
    id: 'risks',
    title: '10 Risks That Can Derail Your Career and Wealth',
    description: 'Early retirement, poor advice, overspending - learn to avoid the pitfalls',
    duration: '25 min',
    category: 'financial',
    completed: true,
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: 'nil',
    title: 'Understanding N.I.L. and Endorsements',
    description: 'Maximize your name, image, and likeness opportunities',
    duration: '20 min',
    category: 'financial',
    completed: false,
    icon: <Star className="h-5 w-5" />
  },
  {
    id: 'trusts',
    title: 'Trusts, Taxes, and Asset Protection 101',
    description: 'Essential legal structures for wealth protection',
    duration: '30 min',
    category: 'financial',
    completed: false,
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: 'entourage',
    title: 'Family, Friends, and Entourage—Protecting Your Future',
    description: 'Navigate relationships while protecting your wealth',
    duration: '18 min',
    category: 'financial',
    completed: false,
    icon: <Users className="h-5 w-5" />
  },
  {
    id: 'depression',
    title: 'Life After Sports: Understanding Post-Career Depression',
    description: 'Recognizing warning signs and building support networks',
    duration: '22 min',
    category: 'wellness',
    completed: false,
    icon: <Brain className="h-5 w-5" />
  },
  {
    id: 'second-act',
    title: 'Finding Your Second Act: Career Transition & Personal Branding',
    description: 'Building your post-sports career and leveraging your legacy',
    duration: '28 min',
    category: 'career',
    completed: false,
    icon: <Target className="h-5 w-5" />
  },
  {
    id: 'mental-fitness',
    title: 'Mental Fitness & Wellbeing for Life\'s Next Season',
    description: 'Self-care, resilience, and healthy routines for the long haul',
    duration: '20 min',
    category: 'wellness',
    completed: false,
    icon: <Brain className="h-5 w-5" />
  }
];

export function AthleteEducationCenter() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);
  
  const completedModules = modules.filter(m => m.completed).length;
  const progressPercentage = Math.round((completedModules / modules.length) * 100);

  const getCategoryModules = (category: string) => 
    modules.filter(m => m.category === category);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Athletes & Entertainers</h1>
          <Badge variant="secondary" className="bg-gradient-elegant text-background">
            <Shield className="h-3 w-3 mr-1" />
            Founding Member
          </Badge>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          World-class wealth education and wellbeing support designed specifically for professional athletes and entertainers
        </p>
        
        {/* Progress Overview */}
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{completedModules}/{modules.length} modules</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {progressPercentage}% complete
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowAssessment(true)}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Take Assessment</h3>
                <p className="text-sm text-muted-foreground">Are you ready for life after sports?</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowCopilot(true)}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Wellbeing Copilot</h3>
                <p className="text-sm text-muted-foreground">AI-powered support and guidance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Find Advisor</h3>
                <p className="text-sm text-muted-foreground">Connect with trusted professionals</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-13">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="slides">Slide Copy</TabsTrigger>
          <TabsTrigger value="videos">Video Scripts</TabsTrigger>
          <TabsTrigger value="emails">Email Kit</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="champions">Champions</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="submit">Submit</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
          <TabsTrigger value="hall-of-champions">
            <Trophy className="h-4 w-4 mr-2" />
            Hall of Champions
          </TabsTrigger>
          <TabsTrigger value="champion-submission">
            <Upload className="h-4 w-4 mr-2" />
            Submit Content
          </TabsTrigger>
          <TabsTrigger value="admin-panel">
            <Users className="h-4 w-4 mr-2" />
            Admin Panel
          </TabsTrigger>
          <TabsTrigger value="outreach-templates">
            <Send className="h-4 w-4 mr-2" />
            Outreach Kit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hall-of-champions" className="space-y-6">
          <HallOfChampions />
        </TabsContent>

        <TabsContent value="champion-submission" className="space-y-6">
          <ChampionSubmissionForm />
        </TabsContent>

        <TabsContent value="admin-panel" className="space-y-6">
          <ChampionAdminPanel />
        </TabsContent>

        <TabsContent value="outreach-templates" className="space-y-6">
          <ChampionOutreachTemplates />
        </TabsContent>

        <TabsContent value="overview">
          {/* Quick Access Cards remain the same */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowAssessment(true)}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Take Assessment</h3>
                    <p className="text-sm text-muted-foreground">Are you ready for life after sports?</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowCopilot(true)}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Brain className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Wellbeing Copilot</h3>
                    <p className="text-sm text-muted-foreground">AI-powered support and guidance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Find Advisor</h3>
                    <p className="text-sm text-muted-foreground">Connect with trusted professionals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="onboarding">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Presentation className="w-6 h-6 text-primary" />
                Interactive Onboarding Experience
              </CardTitle>
              <p className="text-muted-foreground">12-slide journey through the platform</p>
            </CardHeader>
            <CardContent>
              <AthleteOnboardingSlides />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="curriculum">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-primary" />
                Complete Curriculum Library
              </CardTitle>
              <p className="text-muted-foreground">12 comprehensive learning modules</p>
            </CardHeader>
            <CardContent>
              <AthleteCurriculumModules />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment">
          <AthleteAssessmentQuiz onClose={() => setShowAssessment(false)} />
        </TabsContent>

        <TabsContent value="training">
          <AthleteTrainingManual />
        </TabsContent>

        <TabsContent value="slides">
          <AthleteSlideContent />
        </TabsContent>

        <TabsContent value="videos">
          <AthleteVideoScripts />
        </TabsContent>

        <TabsContent value="emails">
          <AthleteEmailTemplates />
        </TabsContent>

        <TabsContent value="campaigns">
          <AthleteCampaignKit />
        </TabsContent>

        <TabsContent value="champions">
          <HallOfChampions />
        </TabsContent>

      <TabsContent value="database">
        <AthleteDatabase />
      </TabsContent>

      <TabsContent value="agents">
        <SportsAgentsDatabase />
      </TabsContent>

      <TabsContent value="outreach">
        <AgentOutreachTemplates />
      </TabsContent>

      <TabsContent value="leagues">
        <LeagueExecutivePortal />
      </TabsContent>

        <TabsContent value="submit">
          <ChampionSubmissionForm />
        </TabsContent>

        <TabsContent value="admin">
          <ChampionAdminPanel />
        </TabsContent>
      </Tabs>

      {/* Assessment Modal */}
      {showAssessment && (
        <AthleteAssessmentQuiz onClose={() => setShowAssessment(false)} />
      )}

      {/* Copilot Chat Modal */}
      {showCopilot && (
        <AthleteCopilotChat onClose={() => setShowCopilot(false)} />
      )}
    </div>
  );
}

function ModuleCard({ module, onSelect }: { module: Module; onSelect: (id: string) => void }) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              {module.icon}
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {module.title}
                {module.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
              </CardTitle>
              <CardDescription className="mt-1">
                {module.description}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {module.duration}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => onSelect(module.id)}
              className="flex items-center gap-2"
            >
              <PlayCircle className="h-4 w-4" />
              {module.completed ? 'Review' : 'Start'}
            </Button>
            {module.downloadUrl && (
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
          {module.completed && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Complete
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}