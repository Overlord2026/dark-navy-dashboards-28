import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Target, 
  BarChart, 
  Zap, 
  Eye, 
  Play,
  ChevronRight,
  Trophy,
  Star,
  X
} from 'lucide-react';

interface RoadmapStage {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tools: string[];
  completed: boolean;
  current: boolean;
  nextActions?: string[];
}

interface TaxOptimizationRoadmapProps {
  onStageClick: (stageId: string) => void;
  completedStages?: string[];
  currentStage?: string;
  isFirstTime?: boolean;
}

export function TaxOptimizationRoadmap({ 
  onStageClick, 
  completedStages = [], 
  currentStage = 'assess',
  isFirstTime = true 
}: TaxOptimizationRoadmapProps) {
  const [showOnboarding, setShowOnboarding] = useState(isFirstTime);
  const [onboardingStep, setOnboardingStep] = useState(0);

  const stages: RoadmapStage[] = [
    {
      id: 'assess',
      title: 'Assess',
      description: 'Evaluate your current tax situation and upload documents',
      icon: <Target className="h-6 w-6" />,
      tools: ['Tax Return Analyzer', 'Document Upload', 'Tax Readiness Assessment'],
      completed: completedStages.includes('assess'),
      current: currentStage === 'assess',
      nextActions: [
        'Upload your latest tax return',
        'Complete the tax readiness assessment',
        'Review extracted tax data'
      ]
    },
    {
      id: 'analyze',
      title: 'Analyze',
      description: 'Run comprehensive analysis across multiple scenarios',
      icon: <BarChart className="h-6 w-6" />,
      tools: ['Multi-Year Projector', 'Tax Bracket Analysis', 'Withdrawal Sequencing'],
      completed: completedStages.includes('analyze'),
      current: currentStage === 'analyze',
      nextActions: [
        'Run multi-year tax projections',
        'Analyze different withdrawal strategies',
        'Compare tax bracket scenarios'
      ]
    },
    {
      id: 'optimize',
      title: 'Optimize',
      description: 'Identify and prioritize tax-saving opportunities',
      icon: <Zap className="h-6 w-6" />,
      tools: ['Roth Conversion Analyzer', 'AI Tax Optimizer', 'Opportunity Ranking'],
      completed: completedStages.includes('optimize'),
      current: currentStage === 'optimize',
      nextActions: [
        'Explore Roth conversion opportunities',
        'Review AI-generated recommendations',
        'Prioritize high-impact strategies'
      ]
    },
    {
      id: 'review',
      title: 'Review',
      description: 'Get professional review and implement strategies',
      icon: <Eye className="h-6 w-6" />,
      tools: ['CPA Consultation', 'Strategy Report', 'Implementation Tracking'],
      completed: completedStages.includes('review'),
      current: currentStage === 'review',
      nextActions: [
        'Schedule CPA consultation',
        'Download detailed strategy report',
        'Set up implementation reminders'
      ]
    }
  ];

  const completedStageCount = completedStages.length;
  const progressPercentage = (completedStageCount / stages.length) * 100;

  const onboardingSteps = [
    {
      title: 'Welcome to Your Tax Optimization Journey',
      description: 'We\'ll guide you through a systematic approach to minimize your tax burden and maximize your after-tax wealth.',
      action: 'Get Started'
    },
    {
      title: 'Step 1: Assess Your Situation',
      description: 'Upload your tax documents and let our AI extract key information to understand your current tax position.',
      action: 'Continue'
    },
    {
      title: 'Step 2: Analyze Opportunities',
      description: 'Run comprehensive analyses to identify potential tax-saving strategies across multiple years.',
      action: 'Continue'
    },
    {
      title: 'Step 3: Optimize Your Strategy',
      description: 'Prioritize the most impactful opportunities and create a personalized optimization plan.',
      action: 'Continue'
    },
    {
      title: 'Step 4: Review & Implement',
      description: 'Get professional validation and implement your tax optimization strategy with confidence.',
      action: 'Start Journey'
    }
  ];

  const handleOnboardingNext = () => {
    if (onboardingStep < onboardingSteps.length - 1) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setShowOnboarding(false);
      onStageClick('assess');
    }
  };

  const handleStageClick = (stageId: string) => {
    setShowOnboarding(false);
    onStageClick(stageId);
  };

  const StageCard = ({ stage, index }: { stage: RoadmapStage; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      <Card 
        className={`cursor-pointer transition-all duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${
          stage.current ? 'ring-2 ring-primary bg-primary/5' : ''
        } ${stage.completed ? 'bg-green-50 border-green-200' : ''}`}
        role="button"
        tabIndex={0}
        aria-label={`${stage.title} stage - ${stage.description}. ${stage.current ? 'Currently active' : ''} ${stage.completed ? 'Completed' : ''}`}
        onClick={() => handleStageClick(stage.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleStageClick(stage.id);
          }
        }}
      >
        <CardHeader className="pb-3 px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className={`p-3 sm:p-2 rounded-full flex-shrink-0 ${
                stage.completed ? 'bg-green-100 text-green-600' :
                stage.current ? 'bg-primary/10 text-primary' :
                'bg-muted text-muted-foreground'
              }`}>
                {stage.completed ? <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" /> : stage.icon}
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base sm:text-lg font-semibold truncate">{stage.title}</CardTitle>
                <CardDescription className="text-sm line-clamp-2">{stage.description}</CardDescription>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end">
              {stage.current && (
                <Badge 
                  variant="default" 
                  className="bg-primary text-primary-foreground text-xs px-2 py-1 min-h-[28px]"
                  aria-label="Current stage indicator"
                >
                  You Are Here
                </Badge>
              )}
              {stage.completed && (
                <Badge 
                  variant="secondary" 
                  className="bg-green-100 text-green-700 text-xs px-2 py-1 min-h-[28px]"
                  aria-label="Stage completed"
                >
                  Complete
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-4 sm:px-6">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Available Tools:</p>
              <div className="flex flex-wrap gap-1">
                {stage.tools.map((tool) => (
                  <Badge key={tool} variant="outline" className="text-xs px-2 py-1">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
            
            {stage.current && stage.nextActions && (
              <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium mb-2">Recommended Actions:</p>
                <ul className="text-sm space-y-1" role="list">
                  {stage.nextActions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2" role="listitem">
                      <Circle className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="flex-1">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {index < stages.length - 1 && (
        <div className="flex justify-center mt-4 mb-4" aria-hidden="true">
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
        </div>
      )}
    </motion.div>
  );

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Trophy className="h-5 w-5 text-yellow-500 flex-shrink-0" aria-hidden="true" />
                <span className="truncate">Tax Optimization Roadmap</span>
              </CardTitle>
              <CardDescription className="mt-1 text-sm sm:text-base">
                Your personalized journey to tax optimization success
              </CardDescription>
            </div>
            {isFirstTime && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowOnboarding(true)}
                className="min-h-[44px] px-4 py-2 text-sm whitespace-nowrap"
                aria-label="Start guided tour of tax optimization roadmap"
              >
                <Play className="h-4 w-4 mr-2" aria-hidden="true" />
                Start Tour
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
              <span className="font-medium">
                Progress: {completedStageCount} of {stages.length} stages complete
              </span>
              <span className="font-bold text-primary">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-3 sm:h-2" 
              aria-label={`Tax optimization progress: ${Math.round(progressPercentage)}% complete`}
            />
            
            <div className="grid gap-4 sm:gap-6 mt-6">
              {stages.map((stage, index) => (
                <StageCard key={stage.id} stage={stage} index={index} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Modal */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowOnboarding(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="onboarding-title"
            aria-describedby="onboarding-description"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6"
            >
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <Badge variant="secondary" className="text-xs">
                    Step {onboardingStep + 1} of {onboardingSteps.length}
                  </Badge>
                  <Progress 
                    value={((onboardingStep + 1) / onboardingSteps.length) * 100} 
                    className="w-20 sm:w-24 h-2" 
                    aria-label={`Onboarding progress: step ${onboardingStep + 1} of ${onboardingSteps.length}`}
                  />
                </div>
                
                <div className="text-center space-y-3">
                  <Star className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-500 mx-auto" aria-hidden="true" />
                  <h3 id="onboarding-title" className="text-lg sm:text-xl font-bold">
                    {onboardingSteps[onboardingStep].title}
                  </h3>
                  <p id="onboarding-description" className="text-sm sm:text-base text-muted-foreground">
                    {onboardingSteps[onboardingStep].description}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  {onboardingStep > 0 && (
                    <Button 
                      variant="outline" 
                      onClick={() => setOnboardingStep(onboardingStep - 1)}
                      className="flex-1 min-h-[44px] px-4 py-2"
                      aria-label="Go back to previous step"
                    >
                      Back
                    </Button>
                  )}
                  <Button 
                    onClick={handleOnboardingNext}
                    className="flex-1 min-h-[44px] px-4 py-2"
                    aria-label={onboardingStep === onboardingSteps.length - 1 ? "Start your tax optimization journey" : "Continue to next step"}
                  >
                    {onboardingSteps[onboardingStep].action}
                    <ChevronRight className="h-4 w-4 ml-2" aria-hidden="true" />
                  </Button>
                </div>
                
                {/* Close button for accessibility */}
                <button
                  onClick={() => setShowOnboarding(false)}
                  className="absolute top-4 right-4 p-2 rounded-md hover:bg-muted"
                  aria-label="Close onboarding dialog"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}