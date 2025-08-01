import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Circle, Settings, Palette, Database, FileText, Users, MessageSquare, BarChart3 } from 'lucide-react';

interface OnboardingStep {
  id: string;
  step_name: string;
  step_category: string;
  step_order: number;
  is_completed: boolean;
  step_description: string;
  completed_at?: string;
}

const categoryIcons = {
  setup: Settings,
  branding: Palette,
  data: Database,
  templates: FileText,
  clients: Users,
  communication: MessageSquare,
  analytics: BarChart3,
};

export function CPAOnboardingModule() {
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOnboardingSteps();
  }, []);

  const fetchOnboardingSteps = async () => {
    try {
      const { data: cpaPartner, error: partnerError } = await supabase
        .from('cpa_partners')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (partnerError || !cpaPartner) {
        toast({
          title: "Error",
          description: "Could not find CPA partner profile",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('cpa_onboarding_checklists')
        .select('*')
        .eq('cpa_partner_id', cpaPartner.id)
        .order('step_order');

      if (error) throw error;

      setSteps(data || []);
    } catch (error) {
      console.error('Error fetching onboarding steps:', error);
      toast({
        title: "Error",
        description: "Failed to load onboarding steps",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleStepCompletion = async (stepId: string, isCompleted: boolean) => {
    try {
      const { error } = await supabase
        .from('cpa_onboarding_checklists')
        .update({
          is_completed: !isCompleted,
          completed_at: !isCompleted ? new Date().toISOString() : null,
        })
        .eq('id', stepId);

      if (error) throw error;

      // Update local state
      setSteps(steps.map(step => 
        step.id === stepId 
          ? { 
              ...step, 
              is_completed: !isCompleted, 
              completed_at: !isCompleted ? new Date().toISOString() : undefined 
            }
          : step
      ));

      toast({
        title: "Success",
        description: `Step ${!isCompleted ? 'completed' : 'unchecked'}`,
      });
    } catch (error) {
      console.error('Error updating step:', error);
      toast({
        title: "Error",
        description: "Failed to update step",
        variant: "destructive",
      });
    }
  };

  const completedSteps = steps.filter(step => step.is_completed).length;
  const totalSteps = steps.length;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const stepsByCategory = steps.reduce((acc, step) => {
    if (!acc[step.step_category]) {
      acc[step.step_category] = [];
    }
    acc[step.step_category].push(step);
    return acc;
  }, {} as Record<string, OnboardingStep[]>);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <DashboardHeader 
        heading="CPA Firm Onboarding"
        text="Complete these steps to set up your practice and start working with clients"
      />

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Onboarding Progress</span>
            <Badge variant={progressPercentage === 100 ? "default" : "secondary"}>
              {completedSteps}/{totalSteps} Complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {progressPercentage === 100 
                ? "Congratulations! Your onboarding is complete."
                : `${Math.round(progressPercentage)}% complete - ${totalSteps - completedSteps} steps remaining`
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Steps by Category */}
      <div className="space-y-6">
        {Object.entries(stepsByCategory).map(([category, categorySteps]) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons] || Settings;
          const categoryCompleted = categorySteps.filter(step => step.is_completed).length;
          const categoryTotal = categorySteps.length;

          return (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  <span className="capitalize">{category.replace('_', ' ')}</span>
                  <Badge variant="outline">
                    {categoryCompleted}/{categoryTotal}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categorySteps.map((step) => (
                    <div
                      key={step.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border/40 hover:border-border/60 transition-colors"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto"
                        onClick={() => toggleStepCompletion(step.id, step.is_completed)}
                      >
                        {step.is_completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </Button>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${step.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                            {step.step_name}
                          </h4>
                          {step.is_completed && step.completed_at && (
                            <span className="text-xs text-muted-foreground">
                              Completed {new Date(step.completed_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {step.step_description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      {progressPercentage === 100 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Onboarding Complete!</h3>
                <p className="text-muted-foreground">
                  Your practice is now set up and ready to serve clients.
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button>
                  Invite Your First Client
                </Button>
                <Button variant="outline">
                  Explore Practice Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}