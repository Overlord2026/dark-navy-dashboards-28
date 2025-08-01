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
  Star
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
        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
          stage.current ? 'ring-2 ring-primary bg-primary/5' : ''
        } ${stage.completed ? 'bg-green-50 border-green-200' : ''}`}
        onClick={() => handleStageClick(stage.id)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                stage.completed ? 'bg-green-100 text-green-600' :
                stage.current ? 'bg-primary/10 text-primary' :
                'bg-muted text-muted-foreground'
              }`}>
                {stage.completed ? <CheckCircle className="h-6 w-6" /> : stage.icon}
              </div>
              <div>
                <CardTitle className="text-lg">{stage.title}</CardTitle>
                <CardDescription className="text-sm">{stage.description}</CardDescription>
              </div>
            </div>
            {stage.current && (
              <Badge variant="default" className="bg-primary text-primary-foreground">
                You Are Here
              </Badge>
            )}
            {stage.completed && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Complete
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Available Tools:</p>
              <div className="flex flex-wrap gap-1">
                {stage.tools.map((tool) => (
                  <Badge key={tool} variant="outline" className="text-xs">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
            
            {stage.current && stage.nextActions && (
              <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium mb-2">Recommended Actions:</p>
                <ul className="text-sm space-y-1">
                  {stage.nextActions.map((action, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Circle className="h-3 w-3 text-muted-foreground" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {index < stages.length - 1 && (
        <div className="flex justify-center mt-4 mb-4">
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
    </motion.div>
  );

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Tax Optimization Roadmap
              </CardTitle>
              <CardDescription>
                Your personalized journey to tax optimization success
              </CardDescription>
            </div>
            {isFirstTime && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowOnboarding(true)}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Tour
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Progress: {completedStageCount} of {stages.length} stages complete</span>
              <span className="font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            
            <div className="grid gap-4 mt-6">
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
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    Step {onboardingStep + 1} of {onboardingSteps.length}
                  </Badge>
                  <Progress 
                    value={((onboardingStep + 1) / onboardingSteps.length) * 100} 
                    className="w-24 h-2" 
                  />
                </div>
                
                <div className="text-center space-y-3">
                  <Star className="h-12 w-12 text-yellow-500 mx-auto" />
                  <h3 className="text-xl font-bold">
                    {onboardingSteps[onboardingStep].title}
                  </h3>
                  <p className="text-muted-foreground">
                    {onboardingSteps[onboardingStep].description}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  {onboardingStep > 0 && (
                    <Button 
                      variant="outline" 
                      onClick={() => setOnboardingStep(onboardingStep - 1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                  )}
                  <Button 
                    onClick={handleOnboardingNext}
                    className="flex-1"
                  >
                    {onboardingSteps[onboardingStep].action}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}