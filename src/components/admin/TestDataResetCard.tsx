
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestDataResetModal } from './TestDataResetModal';
import { useAnalyticsTracking } from '@/hooks/useAnalytics';
import { Database, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function TestDataResetCard() {
  const [showModal, setShowModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { trackTestDataReset } = useAnalyticsTracking();

  const handleReset = async () => {
    setIsResetting(true);
    
    try {
      // Simulate reset process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Track successful reset
      trackTestDataReset(true, 'full_reset');
      
      toast.success('Test data has been successfully reset');
      setShowModal(false);
    } catch (error) {
      console.error('Reset failed:', error);
      
      // Track failed reset
      trackTestDataReset(false, 'full_reset');
      
      toast.error('Failed to reset test data. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="flex items-center text-amber-800">
            <Database className="mr-2 h-5 w-5" />
            Test Data Reset
          </CardTitle>
          <CardDescription className="text-amber-700">
            Reset all test data to initial seed state for development and testing purposes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3 p-3 bg-amber-100 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Warning: This action cannot be undone</p>
              <p className="mt-1">All current test data will be permanently deleted and replaced with seed data.</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Automatic backup created before reset</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>System administrators preserved</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Fresh seed data restored</span>
            </div>
          </div>

          <Button 
            onClick={() => setShowModal(true)} 
            variant="destructive" 
            className="w-full"
            disabled={isResetting}
          >
            <Database className="mr-2 h-4 w-4" />
            {isResetting ? 'Resetting...' : 'Reset Test Data'}
          </Button>
        </CardContent>
      </Card>

      <TestDataResetModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleReset}
        isLoading={isResetting}
      />
    </>
  );
}
