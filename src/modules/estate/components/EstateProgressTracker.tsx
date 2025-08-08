import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle, Users, FileSignature, FileText, Upload } from 'lucide-react';
import { getRequiredSteps } from '../stateCompliance';

interface EstateProgressTrackerProps {
  currentStatus: string;
  stateCode: string;
  className?: string;
}

export const EstateProgressTracker: React.FC<EstateProgressTrackerProps> = ({
  currentStatus,
  stateCode,
  className = ''
}) => {
  const requiredSteps = getRequiredSteps(stateCode);
  
  const stepConfig = {
    intake: { 
      label: 'Intake', 
      icon: FileText, 
      description: 'Personal and family information' 
    },
    drafting: { 
      label: 'Drafting', 
      icon: FileSignature, 
      description: 'Document preparation' 
    },
    review: { 
      label: 'Attorney Review', 
      icon: Users, 
      description: 'Legal review and approval' 
    },
    signing: { 
      label: 'Signing', 
      icon: FileSignature, 
      description: 'Document execution' 
    },
    notarizing: { 
      label: 'Notarization', 
      icon: FileSignature, 
      description: 'Digital notary session' 
    },
    witnessing: { 
      label: 'Witnesses', 
      icon: Users, 
      description: 'Witness verification' 
    },
    filing: { 
      label: 'State Filing', 
      icon: Upload, 
      description: 'Government submission' 
    },
    complete: { 
      label: 'Complete', 
      icon: CheckCircle2, 
      description: 'All steps finished' 
    }
  };

  const getStepStatus = (stepName: string) => {
    const currentIndex = requiredSteps.indexOf(currentStatus);
    const stepIndex = requiredSteps.indexOf(stepName);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'current':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'current':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card className={`sticky top-4 ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Progress</h3>
            <Badge variant="secondary">
              {stateCode}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {requiredSteps.map((stepName, index) => {
              const config = stepConfig[stepName as keyof typeof stepConfig];
              const status = getStepStatus(stepName);
              
              if (!config) return null;
              
              return (
                <div key={stepName} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {getStatusIcon(status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-medium text-sm ${
                        status === 'completed' ? 'text-green-700' :
                        status === 'current' ? 'text-blue-700' :
                        'text-gray-500'
                      }`}>
                        {config.label}
                      </p>
                      <Badge variant={getStatusColor(status) as any} className="text-xs">
                        {status === 'completed' ? 'Done' :
                         status === 'current' ? 'In Progress' :
                         'Pending'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {config.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Progress Bar */}
          <div className="pt-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>
                {Math.round((requiredSteps.indexOf(currentStatus) + 1) / requiredSteps.length * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(requiredSteps.indexOf(currentStatus) + 1) / requiredSteps.length * 100}%` 
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};