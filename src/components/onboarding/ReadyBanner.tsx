import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Shield, 
  BookOpen, 
  Vault, 
  CheckCircle, 
  AlertCircle,
  ArrowRight 
} from 'lucide-react';
import { ReadinessStatus, useReadyCheck } from '@/hooks/useReadyCheck';

interface ReadyBannerProps {
  readiness: ReadinessStatus;
}

export const ReadyBanner: React.FC<ReadyBannerProps> = ({ readiness }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateOnboardingStep, refreshReadiness } = useReadyCheck();

  if (readiness.ready) {
    return (
      <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-green-800 dark:text-green-200 font-medium">
              You're all set! All onboarding steps completed.
            </span>
            <Badge variant="outline" className="text-green-700 border-green-300">
              {readiness.score}/{readiness.total} Complete
            </Badge>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  const stepActions = [
    {
      key: 'profile',
      title: 'Complete Profile',
      description: 'Add your personal and financial information',
      icon: User,
      route: '/onboarding/profile',
      field: 'profile_complete'
    },
    {
      key: 'consent',
      title: 'Privacy Consent',
      description: 'Review and accept privacy policies',
      icon: Shield,
      route: '/onboarding/consent',
      field: 'consent_ok'
    },
    {
      key: 'disclosures',
      title: 'Review Disclosures',
      description: 'Important legal and regulatory information',
      icon: BookOpen,
      route: '/onboarding/disclosures',
      field: 'disclosures_done'
    },
    {
      key: 'vault',
      title: 'Setup Document Vault',
      description: 'Secure storage for your important documents',
      icon: Vault,
      route: '/onboarding/vault',
      field: 'vault_onboarded'
    }
  ];

  const handleStepAction = async (action: typeof stepActions[0]) => {
    // For demo purposes, mark step as complete when clicked
    const success = await updateOnboardingStep(action.field, true);
    
    if (success) {
      toast({
        title: "Great! One step closer.",
        description: `${action.title} completed successfully.`,
        duration: 3000
      });
      
      // Refresh readiness after a short delay
      setTimeout(() => {
        refreshReadiness();
      }, 500);
    } else {
      // Navigate to the actual page if update fails
      navigate(action.route);
    }
  };

  const completionPercentage = (readiness.score / readiness.total) * 100;

  return (
    <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-amber-800 dark:text-amber-200 font-medium">
            Complete your setup to access all Family tools
          </span>
          <Badge variant="outline" className="text-amber-700 border-amber-300">
            {readiness.score}/{readiness.total} Complete
          </Badge>
        </div>
        
        <Progress value={completionPercentage} className="h-2" />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {stepActions.map((action) => {
            const isCompleted = (readiness as any)[action.field];
            const isNeeded = readiness.missing_steps.includes(action.key);
            
            if (isCompleted) {
              return (
                <div
                  key={action.key}
                  className="flex items-center gap-2 p-3 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-200"
                >
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    {action.title}
                  </span>
                </div>
              );
            }
            
            if (!isNeeded) return null;
            
            return (
              <Button
                key={action.key}
                variant="outline"
                size="sm"
                onClick={() => handleStepAction(action)}
                className="flex items-center gap-2 h-auto p-3 hover:bg-amber-100 dark:hover:bg-amber-900/40"
              >
                <action.icon className="w-4 h-4 text-amber-600" />
                <div className="text-left flex-1">
                  <div className="text-sm font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
                <ArrowRight className="w-3 h-3" />
              </Button>
            );
          })}
        </div>
      </AlertDescription>
    </Alert>
  );
};