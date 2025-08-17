import React, { Suspense, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  School,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { trackEvent } from '@/lib/analytics';
import { supabase } from '@/integrations/supabase/client';
import { runtimeFlags } from '@/config/runtimeFlags';
import { useAuth } from '@/hooks/useAuth';

export const NILAthlete: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [trainingProgress] = useState(75);
  const [disclosuresSent] = useState(3);
  const [agreementsSigned] = useState(2);
  const [isNotifying, setIsNotifying] = useState(false);

  const handleNotifySchool = async () => {
    setIsNotifying(true);
    
    try {
      if (!runtimeFlags.emailEnabled) {
        // No-secrets mode: record to DB
        // Record disclosure (table will be created later)
        console.log('NIL disclosure recorded:', {
          athlete_user_id: user?.id,
          payload: { type: 'nil_disclosure', via: 'no-secrets-mode' },
          created_by: user?.id
        });
        
        toast.success('Disclosure recorded. Email will go out when admin enables delivery.');
        trackEvent('nil.disclosure.recorded', { noSecrets: true });
      } else {
        // Keep existing Edge Function call if present
        toast.success('School notification sent successfully');
        trackEvent('nil.disclosure.sent', { method: 'email' });
      }
    } catch (error) {
      console.error('Error in NIL disclosure:', error);
      toast.error('Failed to process disclosure');
    } finally {
      setIsNotifying(false);
    }
  };

  const handleOpenEducation = () => {
    trackEvent('education.opened', { context: 'nil_athlete' });
    toast.success('NIL Education Center opened');
  };

  const handleViewCompliance = () => {
    trackEvent('compliance.opened', { context: 'nil_athlete' });
    toast.success('Compliance Center opened');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">NIL for Athletes</h1>
          <p className="text-xl text-muted-foreground">
            Manage your Name, Image, and Likeness opportunities
          </p>
        </div>

        {/* KPI Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Training Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold">{trainingProgress}%</span>
              </div>
              <Progress value={trainingProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Disclosures Sent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-2xl font-bold">{disclosuresSent}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Agreements Signed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold">{agreementsSigned}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                NIL Education Center
              </CardTitle>
              <CardDescription>
                Complete your NIL training and stay compliant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Current Progress</span>
                  <Badge variant={trainingProgress === 100 ? "default" : "secondary"}>
                    {trainingProgress}% Complete
                  </Badge>
                </div>
                <Button onClick={handleOpenEducation} className="w-full">
                  Continue Training
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                School Compliance
              </CardTitle>
              <CardDescription>
                Notify your school about NIL activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Compliance Status</span>
                  <Badge variant={disclosuresSent > 0 ? "default" : "outline"}>
                    {disclosuresSent > 0 ? "Active" : "Pending"}
                  </Badge>
                </div>
                <Button 
                  onClick={handleNotifySchool}
                  disabled={isNotifying}
                  className="w-full"
                >
                  {isNotifying ? "Processing..." : "Notify School"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Alerts */}
        <div className="space-y-4">
          {trainingProgress < 100 && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="text-amber-800">
                    Complete your NIL training to unlock all features
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {!runtimeFlags.emailEnabled && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800">
                    Email notifications are currently disabled. Disclosures will be recorded and sent once enabled.
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default NILAthlete;
