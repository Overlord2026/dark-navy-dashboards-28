import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, User, FileCheck } from 'lucide-react';
import { createConsentRDS } from '@/features/nil/services/nilRDSService';
import { NILTrainingModule, NILConsentPassport } from '@/features/nil/types';
import { useToast } from '@/hooks/use-toast';

const TRAINING_MODULES: NILTrainingModule[] = [
  {
    id: 'nil-basics',
    title: 'NIL Rights & Responsibilities',
    description: 'Understanding your name, image, and likeness rights',
    duration_minutes: 15,
    required: true,
    completed: false
  },
  {
    id: 'social-compliance',
    title: 'Social Media Compliance',
    description: 'FTC disclosure requirements and best practices',
    duration_minutes: 10,
    required: true,
    completed: false
  },
  {
    id: 'contract-basics',
    title: 'Contract Fundamentals',
    description: 'Reading and understanding brand agreements',
    duration_minutes: 8,
    required: true,
    completed: false
  }
];

interface AthleteQuickStartProps {
  athleteId: string;
  isMinor: boolean;
  onComplete: () => void;
}

export function AthleteQuickStart({ athleteId, isMinor, onComplete }: AthleteQuickStartProps) {
  const [modules, setModules] = useState<NILTrainingModule[]>(TRAINING_MODULES);
  const [currentStep, setCurrentStep] = useState<'training' | 'consent' | 'connect'>('training');
  const [consentPassport, setConsentPassport] = useState<NILConsentPassport | null>(null);
  const { toast } = useToast();

  const completedModules = modules.filter(m => m.completed).length;
  const totalModules = modules.length;
  const allTrainingComplete = completedModules === totalModules;

  const handleCompleteModule = (moduleId: string) => {
    setModules(prev => prev.map(m => 
      m.id === moduleId ? { ...m, completed: true, completion_date: new Date().toISOString() } : m
    ));
    
    toast({
      title: "Module Completed",
      description: "Training progress has been recorded.",
    });
  };

  const handleCompleteTraining = () => {
    if (!allTrainingComplete) {
      toast({
        title: "Training Incomplete",
        description: "Please complete all required modules first.",
        variant: "destructive"
      });
      return;
    }

    // Create Consent-RDS for training completion
    const consentRDS = createConsentRDS(
      athleteId,
      ['training_completed'],
      true,
      1.0, // Fresh completion
      isMinor,
      365 // Valid for 1 year
    );

    setCurrentStep('consent');
    toast({
      title: "Training Complete",
      description: "Consent-RDS recorded. Ready for consent passport.",
    });
  };

  const handleCreateConsentPassport = () => {
    const passport: NILConsentPassport = {
      id: `passport_${Date.now()}`,
      athlete_id: athleteId,
      scope: ['publish', 'disclose', 'monetize'],
      ttl_days: 30,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      co_signer_id: isMinor ? 'parent_guardian_pending' : undefined,
      status: 'active',
      freshness_score: 1.0
    };

    // Create Consent-RDS for passport
    const consentRDS = createConsentRDS(
      athleteId,
      passport.scope,
      true,
      passport.freshness_score,
      isMinor,
      passport.ttl_days
    );

    setConsentPassport(passport);
    setCurrentStep('connect');
    
    toast({
      title: "Consent Passport Created",
      description: `Valid for ${passport.ttl_days} days. Consent-RDS recorded.`,
    });
  };

  const handleConnectBrand = () => {
    onComplete();
    toast({
      title: "Quick Start Complete",
      description: "Ready to receive and review brand offers!",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            NIL Athlete Quick Start
          </CardTitle>
          <CardDescription>
            Complete training and consent setup in under 90 seconds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Step 1: Training */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">1. Complete Training</h3>
                {allTrainingComplete && <CheckCircle className="h-5 w-5 text-green-600" />}
              </div>
              
              <Progress value={(completedModules / totalModules) * 100} className="w-full" />
              
              <div className="grid gap-3">
                {modules.map((module) => (
                  <div key={module.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{module.title}</h4>
                        {module.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          {module.duration_minutes}m
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </div>
                    <Button
                      size="sm"
                      variant={module.completed ? "secondary" : "default"}
                      onClick={() => handleCompleteModule(module.id)}
                      disabled={module.completed}
                    >
                      {module.completed ? 'Complete' : 'Start'}
                    </Button>
                  </div>
                ))}
              </div>

              <Button 
                onClick={handleCompleteTraining}
                disabled={!allTrainingComplete || currentStep !== 'training'}
                className="w-full"
              >
                Complete Training → Create Consent-RDS
              </Button>
            </div>

            {/* Step 2: Consent Passport */}
            {currentStep !== 'training' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">2. Consent Passport</h3>
                  {consentPassport && <CheckCircle className="h-5 w-5 text-green-600" />}
                </div>

                {!consentPassport ? (
                  <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4" />
                      <span className="font-medium">Create Consent Passport</span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Scope: Publish, Disclose, Monetize</p>
                      <p>• Duration: 30 days</p>
                      {isMinor && <p>• Co-signer required (parent/guardian)</p>}
                    </div>
                    <Button 
                      onClick={handleCreateConsentPassport}
                      disabled={currentStep !== 'consent'}
                      className="w-full"
                    >
                      Create Passport → Record Consent-RDS
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">Consent Passport Active</span>
                    </div>
                    <div className="text-sm text-green-700 mt-1">
                      Expires: {new Date(consentPassport.expires_at).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Connect Brand */}
            {currentStep === 'connect' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">3. Connect Brand</h3>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <p className="text-sm text-muted-foreground">
                    You're now ready to receive brand offers and monetization opportunities.
                  </p>
                  <Button onClick={handleConnectBrand} className="w-full">
                    Ready for Brand Offers
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}