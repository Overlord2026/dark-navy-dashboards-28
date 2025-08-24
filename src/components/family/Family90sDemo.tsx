import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  SkipForward, 
  X,
  Clock,
  CheckCircle,
  Calculator,
  Upload,
  FileText,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';
import { analytics } from '@/lib/analytics';
import { recordReceipt } from '@/features/receipts/record';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  duration: number; // seconds
  action: () => void;
  icon: React.ReactNode;
}

interface Family90sDemoProps {
  isOpen: boolean;
  onClose: () => void;
  persona: 'aspiring' | 'retirees';
}

export const Family90sDemo: React.FC<Family90sDemoProps> = ({
  isOpen,
  onClose,
  persona
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);

  const retireeSteps: DemoStep[] = [
    {
      id: 'ss-timing',
      title: 'Social Security Timing',
      description: 'Optimize claiming strategy for maximum benefits',
      duration: 20,
      icon: <Clock className="h-4 w-4" />,
      action: () => {
        // Simulate SS calculation
        const receipt = recordReceipt({
          id: `demo_ss_${Date.now()}`,
          type: 'Decision-RDS',
          timestamp: new Date().toISOString(),
          payload: {
            action: 'ss_timing_calculated',
            demo_mode: true,
            optimal_age: 67,
            monthly_benefit: 3200,
            lifetime_value: 850000
          },
          inputs_hash: `demo_ss_${Date.now()}`,
          policy_version: 'v1.0'
        });
        analytics.track('demo.step.completed', { 
          persona: 'retirees', 
          step: 'ss_timing' 
        });
      }
    },
    {
      id: 'rmd-check',
      title: 'RMD Calculator',
      description: 'Calculate required minimum distributions',
      duration: 15,
      icon: <Calculator className="h-4 w-4" />,
      action: () => {
        const receipt = recordReceipt({
          id: `demo_rmd_${Date.now()}`,
          type: 'Decision-RDS',
          timestamp: new Date().toISOString(),
          payload: {
            action: 'rmd_calculated',
            demo_mode: true,
            account_balance: 1200000,
            rmd_amount: 45000,
            tax_impact: 12000
          },
          inputs_hash: `demo_rmd_${Date.now()}`,
          policy_version: 'v1.0'
        });
        analytics.track('demo.step.completed', { 
          persona: 'retirees', 
          step: 'rmd_check' 
        });
      }
    },
    {
      id: 'annuity-review',
      title: 'Annuity Review',
      description: 'Evaluate annuity products for guaranteed income',
      duration: 25,
      icon: <DollarSign className="h-4 w-4" />,
      action: () => {
        const receipt = recordReceipt({
          id: `demo_annuity_${Date.now()}`,
          type: 'Decision-RDS',
          timestamp: new Date().toISOString(),
          payload: {
            action: 'annuity_reviewed',
            demo_mode: true,
            premium: 500000,
            monthly_income: 2800,
            income_start_age: 70
          },
          inputs_hash: `demo_annuity_${Date.now()}`,
          policy_version: 'v1.0'
        });
        analytics.track('demo.step.completed', { 
          persona: 'retirees', 
          step: 'annuity_review' 
        });
      }
    },
    {
      id: 'vault-upload',
      title: 'Vault Upload',
      description: 'Securely store estate planning documents',
      duration: 15,
      icon: <Upload className="h-4 w-4" />,
      action: () => {
        const receipt = recordReceipt({
          id: `demo_vault_${Date.now()}`,
          type: 'Vault-RDS',
          timestamp: new Date().toISOString(),
          payload: {
            action: 'document_uploaded',
            demo_mode: true,
            document_type: 'estate_plan',
            category: 'Keep-Safe',
            encrypted: true
          },
          inputs_hash: `demo_vault_${Date.now()}`,
          policy_version: 'v1.0'
        });
        analytics.track('demo.step.completed', { 
          persona: 'retirees', 
          step: 'vault_upload' 
        });
      }
    },
    {
      id: 'receipts-review',
      title: 'Review Receipts',
      description: 'Check proof slips and compliance tracking',
      duration: 15,
      icon: <FileText className="h-4 w-4" />,
      action: () => {
        analytics.track('demo.step.completed', { 
          persona: 'retirees', 
          step: 'receipts_review' 
        });
        // Navigate to receipts page (simulated)
        setTimeout(() => {
          toast.success('Demo completed! New receipts are available.');
        }, 1000);
      }
    }
  ];

  const aspiringSteps: DemoStep[] = [
    {
      id: 'wealth-building',
      title: 'Wealth Building Plan',
      description: 'Create investment strategy for long-term growth',
      duration: 25,
      icon: <Calculator className="h-4 w-4" />,
      action: () => {
        const receipt = recordReceipt({
          id: `demo_wealth_${Date.now()}`,
          type: 'Decision-RDS',
          timestamp: new Date().toISOString(),
          payload: {
            action: 'wealth_plan_calculated',
            demo_mode: true,
            target_amount: 2000000,
            monthly_savings: 5000,
            time_horizon: 25
          },
          inputs_hash: `demo_wealth_${Date.now()}`,
          policy_version: 'v1.0'
        });
        analytics.track('demo.step.completed', { 
          persona: 'aspiring', 
          step: 'wealth_building' 
        });
      }
    },
    {
      id: 'education-funding',
      title: 'Education Planning',
      description: 'Plan for children\'s education expenses',
      duration: 20,
      icon: <DollarSign className="h-4 w-4" />,
      action: () => {
        const receipt = recordReceipt({
          id: `demo_education_${Date.now()}`,
          type: 'Decision-RDS',
          timestamp: new Date().toISOString(),
          payload: {
            action: 'education_plan_calculated',
            demo_mode: true,
            target_amount: 300000,
            monthly_contribution: 800,
            years_to_goal: 15
          },
          inputs_hash: `demo_education_${Date.now()}`,
          policy_version: 'v1.0'
        });
        analytics.track('demo.step.completed', { 
          persona: 'aspiring', 
          step: 'education_funding' 
        });
      }
    },
    {
      id: 'tax-optimization',
      title: 'Tax Optimization',
      description: 'Review tax-efficient investment strategies',
      duration: 20,
      icon: <FileText className="h-4 w-4" />,
      action: () => {
        const receipt = recordReceipt({
          id: `demo_tax_${Date.now()}`,
          type: 'Decision-RDS',
          timestamp: new Date().toISOString(),
          payload: {
            action: 'tax_optimization_reviewed',
            demo_mode: true,
            current_tax_rate: 24,
            recommended_strategies: ['roth_conversion', 'tax_loss_harvesting'],
            potential_savings: 15000
          },
          inputs_hash: `demo_tax_${Date.now()}`,
          policy_version: 'v1.0'
        });
        analytics.track('demo.step.completed', { 
          persona: 'aspiring', 
          step: 'tax_optimization' 
        });
      }
    },
    {
      id: 'insurance-review',
      title: 'Insurance Review',
      description: 'Evaluate life and disability insurance needs',
      duration: 15,
      icon: <Upload className="h-4 w-4" />,
      action: () => {
        const receipt = recordReceipt({
          id: `demo_insurance_${Date.now()}`,
          type: 'Decision-RDS',
          timestamp: new Date().toISOString(),
          payload: {
            action: 'insurance_needs_analyzed',
            demo_mode: true,
            recommended_coverage: 1500000,
            current_coverage: 500000,
            coverage_gap: 1000000
          },
          inputs_hash: `demo_insurance_${Date.now()}`,
          policy_version: 'v1.0'
        });
        analytics.track('demo.step.completed', { 
          persona: 'aspiring', 
          step: 'insurance_review' 
        });
      }
    },
    {
      id: 'receipts-review',
      title: 'Review Receipts',
      description: 'Check proof slips and planning documentation',
      duration: 10,
      icon: <FileText className="h-4 w-4" />,
      action: () => {
        analytics.track('demo.step.completed', { 
          persona: 'aspiring', 
          step: 'receipts_review' 
        });
        setTimeout(() => {
          toast.success('Demo completed! New receipts are available.');
        }, 1000);
      }
    }
  ];

  const steps = persona === 'retirees' ? retireeSteps : aspiringSteps;
  const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && !isPaused && currentStep < steps.length) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
        setStepProgress(prev => {
          const newProgress = prev + (100 / steps[currentStep].duration);
          if (newProgress >= 100) {
            // Complete current step
            steps[currentStep].action();
            
            if (currentStep < steps.length - 1) {
              setCurrentStep(prev => prev + 1);
              setStepProgress(0);
            } else {
              // Demo completed
              setIsPlaying(false);
              analytics.track('demo.completed', { 
                persona,
                total_time: timeElapsed,
                steps_completed: steps.length
              });
              toast.success('90-second demo completed!');
              setTimeout(() => {
                onClose();
              }, 2000);
            }
            return 0;
          }
          return newProgress;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isPaused, currentStep, timeElapsed, steps, persona, onClose]);

  const handleStart = () => {
    setIsPlaying(true);
    setIsPaused(false);
    analytics.track('demo.started', { 
      persona,
      type: '90s_family_demo'
    });
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      steps[currentStep].action();
      setCurrentStep(prev => prev + 1);
      setStepProgress(0);
      analytics.track('demo.step.skipped', { 
        persona,
        step: steps[currentStep].id
      });
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentStep(0);
    setTimeElapsed(0);
    setStepProgress(0);
    analytics.track('demo.cancelled', { 
      persona,
      time_elapsed: timeElapsed,
      steps_completed: currentStep
    });
    onClose();
  };

  const progressPercent = ((currentStep * 100) + stepProgress) / steps.length;
  const timeRemaining = totalDuration - timeElapsed;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              {persona === 'retirees' ? 'Retiree' : 'Aspiring'} Family Demo
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </Badge>
              <Button size="sm" variant="ghost" onClick={handleStop}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {/* Current Step */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              {steps[currentStep]?.icon}
              <h3 className="font-semibold">{steps[currentStep]?.title}</h3>
              <Badge variant="outline">
                Step {currentStep + 1} of {steps.length}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {steps[currentStep]?.description}
            </p>
            <div className="mt-3">
              <Progress value={stepProgress} className="h-1" />
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            {!isPlaying ? (
              <Button onClick={handleStart} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Start Demo
              </Button>
            ) : (
              <>
                <Button onClick={handlePause} variant="outline">
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button onClick={handleSkip} variant="outline">
                  <SkipForward className="h-4 w-4" />
                  Skip Step
                </Button>
                <Button onClick={handleStop} variant="outline">
                  <X className="h-4 w-4" />
                  Stop
                </Button>
              </>
            )}
          </div>

          {/* Step List */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Demo Steps:</h4>
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`flex items-center gap-3 p-2 rounded ${
                  index === currentStep ? 'bg-primary/10' :
                  index < currentStep ? 'bg-green-50' :
                  'bg-muted/50'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : index === currentStep ? (
                  step.icon
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                )}
                <span className={`text-sm ${
                  index === currentStep ? 'font-medium' : ''
                }`}>
                  {step.title}
                </span>
                <Badge variant="outline" className="text-xs ml-auto">
                  {step.duration}s
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};