import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, TrendingUp, Calculator, FileText, Play, CheckCircle } from 'lucide-react';
import { useEducationProgress } from '@/hooks/useEducationProgress';
import { canUse } from '@/lib/featureAccess';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';

const EducationPage: React.FC = () => {
  const { progressStats } = useEducationProgress();
  const { subscriptionPlan } = useSubscriptionAccess();
  const userTier = subscriptionPlan?.tier === 'free' ? 'basic' : subscriptionPlan?.tier || 'basic';
  const hasNilTraining = canUse(userTier as 'basic' | 'premium' | 'elite', 'nil_booking');

  const gettingStartedGuides = [
    {
      title: 'Family Office Basics',
      description: 'Understanding the fundamentals of family office management',
      duration: '15 min',
      icon: BookOpen,
      completed: false
    },
    {
      title: 'Investment Fundamentals',
      description: 'Core principles of wealth preservation and growth',
      duration: '20 min',
      icon: TrendingUp,
      completed: false
    },
    {
      title: 'Risk Assessment',
      description: 'How to evaluate and manage financial risks',
      duration: '12 min',
      icon: FileText,
      completed: false
    }
  ];

  const deepDiveTopics = [
    {
      title: 'SWAG Analysis',
      description: 'Scientific Wild Ass Guess - rapid estimation techniques',
      duration: '30 min',
      icon: Calculator,
      advanced: true
    },
    {
      title: 'Monte Carlo Simulations',
      description: 'Advanced portfolio modeling and scenario analysis',
      duration: '45 min',
      icon: TrendingUp,
      advanced: true
    },
    {
      title: 'RMD Planning',
      description: 'Required Minimum Distribution strategies and optimization',
      duration: '25 min',
      icon: FileText,
      advanced: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Education Center
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Learn about wealth management, tax planning, estate planning, and financial strategies.
              </p>
            </header>

            {/* NIL Learning Path Progress - Only show if training enabled */}
            {hasNilTraining && (
              <Card className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">NIL Learning Path</CardTitle>
                      <CardDescription>
                        Complete your personalized learning journey
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {progressStats.totalProgress}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {progressStats.completedModules}/{progressStats.totalModules} modules
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={progressStats.totalProgress} className="w-full" />
                </CardContent>
              </Card>
            )}
            
            {/* Getting Started Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Getting Started</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {gettingStartedGuides.map((guide) => {
                  const Icon = guide.icon;
                  return (
                    <Card key={guide.title} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          {guide.completed && (
                            <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                          )}
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {guide.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {guide.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{guide.duration}</span>
                          <div className="flex items-center gap-1 text-primary">
                            <Play className="h-4 w-4" />
                            <span className="text-sm font-medium">Start</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Deep Dives Section */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-6">Deep Dives</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {deepDiveTopics.map((topic) => {
                  const Icon = topic.icon;
                  return (
                    <Card key={topic.title} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-secondary/10">
                            <Icon className="h-5 w-5 text-secondary" />
                          </div>
                          {topic.advanced && (
                            <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                              Advanced
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {topic.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {topic.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{topic.duration}</span>
                          <div className="flex items-center gap-1 text-primary">
                            <Play className="h-4 w-4" />
                            <span className="text-sm font-medium">Start</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EducationPage;