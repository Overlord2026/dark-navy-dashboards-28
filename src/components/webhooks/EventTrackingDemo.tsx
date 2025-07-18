import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEventTracking } from '@/hooks/useEventTracking';
import { toast } from 'sonner';
import {
  Download,
  Calendar,
  User,
  Calculator,
  FileText,
  Heart,
  Activity
} from 'lucide-react';

export const EventTrackingDemo: React.FC = () => {
  const {
    trackResourceDownload,
    trackAppointmentBooked,
    trackUserOnboarding,
    trackCalculatorUsed,
    trackDocumentUploaded,
    trackFeatureUsed,
    isTracking
  } = useEventTracking();

  const handleResourceDownload = async () => {
    try {
      await trackResourceDownload({
        resource_name: 'Estate Planning Guide',
        resource_type: 'PDF',
        resource_category: 'education',
        download_source: 'demo'
      });
      toast.success('Resource download tracked!');
    } catch (error) {
      toast.error('Failed to track event');
    }
  };

  const handleAppointmentBooked = async () => {
    try {
      await trackAppointmentBooked({
        appointment_type: 'consultation',
        advisor_id: 'demo-advisor',
        scheduled_date: new Date().toISOString(),
        duration: 60,
        meeting_type: 'video'
      });
      toast.success('Appointment booking tracked!');
    } catch (error) {
      toast.error('Failed to track event');
    }
  };

  const handleOnboardingStep = async () => {
    try {
      await trackUserOnboarding('profile_completed', {
        step_number: 3,
        completion_percentage: 75,
        time_spent: 300
      });
      toast.success('Onboarding step tracked!');
    } catch (error) {
      toast.error('Failed to track event');
    }
  };

  const handleCalculatorUsage = async () => {
    try {
      await trackCalculatorUsed('fee_calculator', {
        portfolio_value: 1000000,
        result: 7500,
        comparison_made: true
      });
      toast.success('Calculator usage tracked!');
    } catch (error) {
      toast.error('Failed to track event');
    }
  };

  const handleDocumentUpload = async () => {
    try {
      await trackDocumentUploaded({
        document_type: 'financial_statement',
        file_size: 2048576,
        category: 'documents',
        shared: false
      });
      toast.success('Document upload tracked!');
    } catch (error) {
      toast.error('Failed to track event');
    }
  };

  const handleFeatureUsage = async () => {
    try {
      await trackFeatureUsed('portfolio_analysis', {
        analysis_type: 'comprehensive',
        accounts_analyzed: 5,
        insights_generated: 12
      });
      toast.success('Feature usage tracked!');
    } catch (error) {
      toast.error('Failed to track event');
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Event Tracking Demo
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Click the buttons below to simulate key user actions and see event tracking in action.
          {isTracking && <Badge variant="outline" className="ml-2">Tracking...</Badge>}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={handleResourceDownload}
            disabled={isTracking}
            className="flex flex-col h-auto p-4 gap-2"
          >
            <Download className="h-6 w-6" />
            <span className="text-sm">Download Resource</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleAppointmentBooked}
            disabled={isTracking}
            className="flex flex-col h-auto p-4 gap-2"
          >
            <Calendar className="h-6 w-6" />
            <span className="text-sm">Book Appointment</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleOnboardingStep}
            disabled={isTracking}
            className="flex flex-col h-auto p-4 gap-2"
          >
            <User className="h-6 w-6" />
            <span className="text-sm">Complete Onboarding</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleCalculatorUsage}
            disabled={isTracking}
            className="flex flex-col h-auto p-4 gap-2"
          >
            <Calculator className="h-6 w-6" />
            <span className="text-sm">Use Calculator</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleDocumentUpload}
            disabled={isTracking}
            className="flex flex-col h-auto p-4 gap-2"
          >
            <FileText className="h-6 w-6" />
            <span className="text-sm">Upload Document</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleFeatureUsage}
            disabled={isTracking}
            className="flex flex-col h-auto p-4 gap-2"
          >
            <Heart className="h-6 w-6" />
            <span className="text-sm">Use Feature</span>
          </Button>
        </div>

        <div className="bg-muted/30 p-4 rounded-lg">
          <h4 className="font-medium mb-2">How it works:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Events are tracked in real-time and stored in the database</li>
            <li>• Configured webhooks receive immediate notifications</li>
            <li>• CRM systems get updated automatically based on sync settings</li>
            <li>• Analytics dashboard shows aggregated event data</li>
            <li>• All events include user context and tenant information</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};