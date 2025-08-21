import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HeartHandshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HsaSummary } from '@/components/health/HsaSummary';
import HsaActions from '@/components/health/HsaActionsConsent';
import { ConsentPassport } from '@/components/health/ConsentPassport';
import { SkipToContent } from '@/components/accessibility/SkipToContent';
import { getPlan, HsaPlan } from '@/features/health/hsa/api';

export default function HealthHsaPage() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<HsaPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadPlan = async () => {
    setIsLoading(true);
    try {
      const planData = getPlan();
      setPlan(planData);
    } catch (error) {
      console.error('Failed to load HSA plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlan();
  }, []);

  const handleRefresh = () => {
    loadPlan();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/healthcare')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Healthcare
          </Button>
        </div>
        
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading HSA plan information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/healthcare')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Healthcare
          </Button>
        </div>
        
        <Card>
          <CardContent className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <HeartHandshake className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">HSA Plan Not Available</h3>
              <p className="text-muted-foreground mb-4">
                Unable to load HSA plan information. Please try again later.
              </p>
              <Button onClick={handleRefresh}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <SkipToContent />
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/healthcare')}
          className="flex items-center gap-2"
          aria-label="Return to healthcare dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Healthcare
        </Button>
      </div>

      {/* Page Title */}
      <div id="main-content" tabIndex={-1}>
        <h1 className="text-3xl font-bold tracking-tight" data-testid="hsa-page-title">HSA Planner</h1>
        <p className="text-muted-foreground mt-2">
          Manage your Health Savings Account contributions, track eligibility, and maintain compliance records.
        </p>
      </div>

      {/* Plan Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5" />
            {plan.planName}
          </CardTitle>
          <CardDescription>
            Current HSA plan status and contribution limits for {new Date().getFullYear()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HsaSummary plan={plan} />
        </CardContent>
      </Card>

      {/* Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">HSA Actions</h2>
        <HsaActions />
      </div>

      {/* Consent Management */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Consent Management</h2>
        <ConsentPassport />
      </div>

      {/* Compliance Note */}
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/10">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Compliance & Privacy Notice
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                All HSA actions generate Health-RDS receipts for compliance tracking. 
                No personal health information (PHI) is stored in logs. Only anonymized 
                hashes and boolean flags are maintained for audit purposes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}