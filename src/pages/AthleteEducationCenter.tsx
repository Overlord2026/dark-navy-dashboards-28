import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useEventTracking } from '@/hooks/useEventTracking';
import {
  Trophy,
  Play,
  BookOpen,
  Award,
  Clock,
  Users,
  Target,
  CheckCircle,
  Lock,
  Zap,
  Heart,
  Shield,
  DollarSign,
  GraduationCap,
  FileText,
  Download
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  badge: string;
  phase: 'pre-season' | 'regular-season' | 'playoffs' | 'championship';
  level: 'foundation' | 'intermediate' | 'advanced';
  completed: boolean;
  locked: boolean;
  progress: number;
  tools: string[];
  quiz: {
    questions: number;
    passThreshold: number;
  };
  downloadables: string[];
}

const coursesData: Course[] = [
  // Pre-Season
  {
    id: 'intro',
    title: 'Introduction to Athlete Financial Wellness',
    description: 'Foundation of financial literacy for professional athletes',
    duration: '45 min',
    badge: 'Foundation',
    phase: 'pre-season',
    level: 'foundation',
    completed: false,
    locked: false,
    progress: 0,
    tools: ['Athlete Readiness Self-Check', 'Goal Setting Worksheet'],
    quiz: { questions: 5, passThreshold: 80 },
    downloadables: ['Athlete Financial Wellness Guide.pdf']
  },
  {
    id: 'money-myths',
    title: 'Money Myths & Athletic Mindset',
    description: 'Debunking financial myths and building winning money habits',
    duration: '30 min',
    badge: 'Mindset',
    phase: 'pre-season',
    level: 'foundation',
    completed: false,
    locked: false,
    progress: 0,
    tools: ['Myth Buster Quiz', 'Mindset Assessment'],
    quiz: { questions: 5, passThreshold: 80 },
    downloadables: ['Money Myths Debunked.pdf']
  },
  {
    id: 'wealth-playbook',
    title: 'Your Wealth Playbook',
    description: 'Creating your personalized financial game plan',
    duration: '60 min',
    badge: 'Strategy',
    phase: 'pre-season',
    level: 'foundation',
    completed: false,
    locked: false,
    progress: 0,
    tools: ['Wealth Playbook Builder', 'Budget Calculator'],
    quiz: { questions: 5, passThreshold: 80 },
    downloadables: ['Personal Wealth Playbook Template.pdf']
  },

  // Regular Season
  {
    id: 'nil-contracts',
    title: 'NIL & Contracts Mastery',
    description: 'Understanding NIL deals and contract negotiations',
    duration: '75 min',
    badge: 'Contracts',
    phase: 'regular-season',
    level: 'intermediate',
    completed: false,
    locked: true,
    progress: 0,
    tools: ['Contract Red-Flag Finder', 'NIL Calculator'],
    quiz: { questions: 8, passThreshold: 80 },
    downloadables: ['NIL Contract Guide.pdf', 'Negotiation Checklist.pdf']
  },
  {
    id: 'team-building',
    title: 'Building Your Financial Team',
    description: 'Assembling agents, advisors, and support staff',
    duration: '50 min',
    badge: 'Team',
    phase: 'regular-season',
    level: 'intermediate',
    completed: false,
    locked: true,
    progress: 0,
    tools: ['Team Builder Tool', 'Advisor Vetting Checklist'],
    quiz: { questions: 6, passThreshold: 80 },
    downloadables: ['Financial Team Assembly Guide.pdf']
  },
  {
    id: 'taxes-protection',
    title: 'Taxes & Asset Protection',
    description: 'Managing taxes and protecting your wealth',
    duration: '90 min',
    badge: 'Protection',
    phase: 'regular-season',
    level: 'advanced',
    completed: false,
    locked: true,
    progress: 0,
    tools: ['Tax Calculator', 'Asset Protection Planner'],
    quiz: { questions: 10, passThreshold: 80 },
    downloadables: ['Tax Optimization Guide.pdf', 'Asset Protection Strategies.pdf']
  },

  // Playoffs
  {
    id: 'mental-health',
    title: 'Mental Health & Money',
    description: 'Managing financial stress and mental wellness',
    duration: '40 min',
    badge: 'Wellness',
    phase: 'playoffs',
    level: 'intermediate',
    completed: false,
    locked: true,
    progress: 0,
    tools: ['Stress Assessment', 'Wellness Tracker'],
    quiz: { questions: 5, passThreshold: 80 },
    downloadables: ['Mental Health & Finance Guide.pdf']
  },
  {
    id: 'second-act',
    title: 'Second Act Career Planning',
    description: 'Preparing for life after professional sports',
    duration: '65 min',
    badge: 'Career',
    phase: 'playoffs',
    level: 'advanced',
    completed: false,
    locked: true,
    progress: 0,
    tools: ['Career Transition Planner', 'Skills Assessment'],
    quiz: { questions: 7, passThreshold: 80 },
    downloadables: ['Second Career Planning Guide.pdf']
  },
  {
    id: 'legacy',
    title: 'Legacy & Impact Planning',
    description: 'Building lasting impact beyond your playing career',
    duration: '55 min',
    badge: 'Legacy',
    phase: 'playoffs',
    level: 'advanced',
    completed: false,
    locked: true,
    progress: 0,
    tools: ['Legacy Builder', 'Impact Calculator'],
    quiz: { questions: 6, passThreshold: 80 },
    downloadables: ['Legacy Planning Workbook.pdf']
  },

  // Championship
  {
    id: 'copilot',
    title: 'Athlete Copilot System',
    description: 'Advanced AI-powered financial guidance',
    duration: '45 min',
    badge: 'AI Assistant',
    phase: 'championship',
    level: 'advanced',
    completed: false,
    locked: true,
    progress: 0,
    tools: ['AI Copilot Interface', 'Smart Recommendations'],
    quiz: { questions: 5, passThreshold: 80 },
    downloadables: ['AI Copilot User Guide.pdf']
  },
  {
    id: 'smart-investing',
    title: 'Smart Investing for Athletes',
    description: 'Investment strategies tailored for athlete income patterns',
    duration: '80 min',
    badge: 'Investing',
    phase: 'championship',
    level: 'advanced',
    completed: false,
    locked: true,
    progress: 0,
    tools: ['Investment Calculator', 'Portfolio Builder'],
    quiz: { questions: 10, passThreshold: 80 },
    downloadables: ['Athlete Investment Guide.pdf', 'Portfolio Templates.pdf']
  },
  {
    id: 'next-steps',
    title: 'Next Steps & Graduation',
    description: 'Completing your financial education journey',
    duration: '30 min',
    badge: 'Graduate',
    phase: 'championship',
    level: 'foundation',
    completed: false,
    locked: true,
    progress: 0,
    tools: ['Graduation Assessment', 'Action Plan Builder'],
    quiz: { questions: 5, passThreshold: 80 },
    downloadables: ['Graduation Certificate.pdf', 'Next Steps Action Plan.pdf']
  }
];

const phaseInfo = {
  'pre-season': {
    title: 'Pre-Season',
    description: 'Foundation & Preparation',
    icon: Target,
    color: 'bg-blue-500'
  },
  'regular-season': {
    title: 'Regular Season',
    description: 'Core Skills & Strategy',
    icon: Play,
    color: 'bg-green-500'
  },
  'playoffs': {
    title: 'Playoffs',
    description: 'Advanced Planning',
    icon: Trophy,
    color: 'bg-orange-500'
  },
  'championship': {
    title: 'Championship',
    description: 'Mastery & Excellence',
    icon: Award,
    color: 'bg-purple-500'
  }
};

export default function AthleteEducationCenter() {
  const navigate = useNavigate();
  const { trackEvent } = useEventTracking();
  const [selectedPhase, setSelectedPhase] = useState<string>('pre-season');
  const [courses, setCourses] = useState<Course[]>(coursesData);

  useEffect(() => {
    trackEvent('education', 'view', { section: 'athlete_center' });
  }, [trackEvent]);

  const handleCourseStart = (courseId: string) => {
    trackEvent('course', 'start', { courseId });
    navigate(`/courses/athlete/${courseId}`);
  };

  const handleDownload = (courseId: string, filename: string) => {
    console.log(`Downloading ${filename} for course ${courseId}`);
    // In real implementation, this would trigger actual download
  };

  const getPhaseProgress = (phase: string) => {
    const phaseCourses = courses.filter(course => course.phase === phase);
    const completedCourses = phaseCourses.filter(course => course.completed);
    return phaseCourses.length > 0 ? (completedCourses.length / phaseCourses.length) * 100 : 0;
  };

  const getOverallProgress = () => {
    const completedCourses = courses.filter(course => course.completed);
    return (completedCourses.length / courses.length) * 100;
  };

  const getBadgeIcon = (badge: string) => {
    const iconMap: { [key: string]: any } = {
      'Foundation': BookOpen,
      'Mindset': Heart,
      'Strategy': Target,
      'Contracts': FileText,
      'Team': Users,
      'Protection': Shield,
      'Wellness': Heart,
      'Career': GraduationCap,
      'Legacy': Trophy,
      'AI Assistant': Zap,
      'Investing': DollarSign,
      'Graduate': Award
    };
    return iconMap[badge] || BookOpen;
  };

  const filteredCourses = courses.filter(course => course.phase === selectedPhase);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-glow text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <Trophy className="h-16 w-16 text-white animate-pulse" />
            </div>
            <h1 className="text-5xl font-bold mb-4">
              Athlete Wealth & Wellbeing Education Center
            </h1>
            <p className="text-xl mb-6">
              Master your financial game with the Season Playbook curriculum
            </p>
            <div className="flex items-center justify-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>12 Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                <span>4 Phases</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                <span>Digital Certificates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Dashboard */}
      <section className="py-8 bg-card/50">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Your Season Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">{Math.round(getOverallProgress())}%</span>
                </div>
                <Progress value={getOverallProgress()} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(phaseInfo).map(([phase, info]) => {
                  const IconComponent = info.icon;
                  const progress = getPhaseProgress(phase);
                  return (
                    <div key={phase} className="text-center">
                      <div className={`w-12 h-12 rounded-full ${info.color} flex items-center justify-center mx-auto mb-2`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-sm font-medium">{info.title}</div>
                      <div className="text-xs text-muted-foreground mb-2">{info.description}</div>
                      <Progress value={progress} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-1">{Math.round(progress)}%</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Course Navigation */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs value={selectedPhase} onValueChange={setSelectedPhase}>
            <TabsList className="grid w-full grid-cols-4 mb-8">
              {Object.entries(phaseInfo).map(([phase, info]) => (
                <TabsTrigger key={phase} value={phase} className="text-xs md:text-sm">
                  {info.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.keys(phaseInfo).map((phase) => (
              <TabsContent key={phase} value={phase}>
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {phaseInfo[phase as keyof typeof phaseInfo].title}
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {phaseInfo[phase as keyof typeof phaseInfo].description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => {
                    const BadgeIcon = getBadgeIcon(course.badge);
                    return (
                      <Card
                        key={course.id}
                        className={`group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                          course.locked ? 'opacity-60' : ''
                        }`}
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between mb-3">
                            <Badge 
                              variant={course.completed ? "default" : course.locked ? "secondary" : "outline"}
                              className="flex items-center gap-1"
                            >
                              <BadgeIcon className="h-3 w-3" />
                              {course.badge}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {course.duration}
                            </div>
                          </div>
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            {course.description}
                          </p>

                          {course.progress > 0 && (
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium">Progress</span>
                                <span className="text-xs text-muted-foreground">{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-2" />
                            </div>
                          )}

                          <div className="space-y-2">
                            <div className="text-xs font-medium text-muted-foreground">Tools:</div>
                            <div className="flex flex-wrap gap-1">
                              {course.tools.slice(0, 2).map((tool) => (
                                <Badge key={tool} variant="outline" className="text-xs">
                                  {tool}
                                </Badge>
                              ))}
                              {course.tools.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{course.tools.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleCourseStart(course.id)}
                              disabled={course.locked}
                              className="flex-1"
                              size="sm"
                            >
                              {course.locked ? (
                                <>
                                  <Lock className="h-4 w-4 mr-1" />
                                  Locked
                                </>
                              ) : course.completed ? (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Review
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-1" />
                                  Start
                                </>
                              )}
                            </Button>
                            
                            {course.downloadables.length > 0 && !course.locked && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(course.id, course.downloadables[0])}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="text-xs text-muted-foreground">
                            Quiz: {course.quiz.questions} questions, {course.quiz.passThreshold}% to pass
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* League Branding Section */}
      <section className="py-12 bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Endorsed by Professional Leagues
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            This curriculum is developed in partnership with professional sports organizations
            to ensure relevance and accuracy for today's athletes.
          </p>
          <div className="flex justify-center items-center gap-8 opacity-60">
            <div className="text-lg font-bold">NFL</div>
            <div className="text-lg font-bold">NBA</div>
            <div className="text-lg font-bold">MLB</div>
            <div className="text-lg font-bold">NHL</div>
          </div>
        </div>
      </section>
    </div>
  );
}